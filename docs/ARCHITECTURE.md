# Architecture (as built)

What exists in the repo today. The plan lives in `PRD.md`; this file describes only code that has landed. Update it in the same commit as the module it describes.

Last updated: 2026-11-08, after the worker, flusher and cold boot ran against live data.

## Vocabulary

One set of words runs through the schema, the code and the UI.

| Word | Meaning |
|---|---|
| category | `btc-5m` or `btc-15m`: the length of the window being asked about |
| window | `[start, end)` aligned to UTC marks; `lock` is when every voice is frozen |
| voice | a source of calls: `deepbook`, `polymarket`, `kalshi`, `crowd` |
| call | a voice's probability that the window ends at or above where it started |
| grudge | a voice's discounted Brier loss and call count in one category |
| record | one resolved or void window, written to Walrus Memory |

`src/server/domain.ts` holds the constants. Everything else imports them.

## Modules

### `src/server/engine/` (pure: no I/O, time is passed in)
- `windows.ts`: window boundaries, the lock lead per category (5m: 180 s, 15m: 480 s), `openWindows`, and the question id `category:endUnixSeconds`.
- `scoring.ts`: `scoreCall` (discounted Brier), `trustWeights` (Hedge softmax, rate 0.5, newcomers held at the established average), `grudgeLine` (logit pool), `confidence`, `priceAtomic`, `disagreement`.
- `resolve.ts`: the canonical outcome from venue results (majority; a 1–1 tie is void; a split is flagged).

### `src/server/voices/`
Each venue is a pure parser plus a thin fetcher. A voice never throws into the caller: it returns `null` and logs.
- `polymarket.ts`: Gamma `markets?slug=btc-updown-{5m|15m}-{startSeconds}`. The live call is the middle of `bestBid`/`bestAsk`; `outcomePrices` lags and is not used live. Resolved markets need `&closed=true`.
- `kalshi.ts`: `KXBTC15M` markets filtered by `min_close_ts = max_close_ts = window end`. Reads the mid of `yes_bid_dollars` / `yes_ask_dollars` and `floor_strike`. Lists 15m windows only.
- `deepbook.ts`: through Tatum gRPC. The strike is the market's `referencePrice` (5m) or the settlement of the 5m market that expired at the window start (15m). The call is `pricer.up(strike)` on the 5m market that expires with the window, refused if the Pyth spot is older than 30 s.
- Payloads recorded from the live venues are in `fixtures/`; `voices.test.ts` parses them.

### `src/server/tatum/`
Every Tatum request shares one budget of 3 requests per second (the free plan).
- `budget.ts`: `takeSlot` spaces calls 350 ms apart across gRPC and the Data API and counts them per surface.
- `transport.ts`: `ThrottledTransport` wraps protobuf-ts's `GrpcTransport` so every unary gRPC call waits for a slot.
- `sui.ts`: `SuiGrpcClient` on `sui-mainnet-grpc.gateway.tatum.io:443` with the API key as call metadata, extended with `predict()` from `@mysten/deepbook-v3`.
- `rate.ts`: BTC/USD from the Tatum Data API.

### `src/server/memory/`
- `codec.ts` (pure): `encode` writes a readable sentence followed by `#grudge {json}`; `decode` reads the exact data back. Three payload kinds: `record`, `scoreboard`, `lesson`.
- `store.ts`: the Walrus Memory client. `writeBulk` (one `rememberBulkAndWait` call per batch) and `recall`. Namespaces: `grudge:v1:records`, `grudge:v1:scoreboard`, `grudge:v1:lessons`.

### `src/server/db/`
Drizzle schema (`schema.ts`) and the lazy Postgres connection (`client.ts`, session pooler, SSL required). Migrations are generated into `drizzle/` and applied by `runMigrations`. Every table has row-level security enabled with no policies, so Supabase's public REST API sees nothing; the server connects as `postgres`, which bypasses it. Two migrations so far: `0000_init` and `0001_row_level_security`, both applied to the Supabase project `grudge` (eu-central-1).

### Shared plumbing
- `env.ts`: one zod-parsed getter per concern (`tatumEnv`, `memoryEnv`, `databaseEnv`, ...), so a half-filled `.env` works while accounts are still being created. Errors name the variables, never print values.
- `singleton.ts`: state both `instrumentation.ts` and the route handlers must see lives on `globalThis`.
- `log.ts`: JSON lines to stdout.

## Scripts
Run with `tsx --conditions=react-server` (so `server-only` resolves to an empty module) and `--env-file-if-exists=.env`.
- `pnpm probe`: asks every dependency a live question and prints the result. `--write-memory` also stores one memory on Walrus mainnet.
- `pnpm db:migrate`: applies the migrations.

## The worker (`src/server/worker/`)
Started once per process from `src/instrumentation.ts` (which first applies migrations and restores from Walrus if the scoreboard is empty). It wakes every 5 s and runs four steps in order, each isolated so one failure cannot stop the rest.
- `discover.ts`: creates a `questions` row for every window that can still take a call.
- `lock.ts`: at each window's lock instant, reads every voice and writes the calls to `forecasts`. The strike comes from DeepBook, or from Kalshi when DeepBook has none. A window with fewer than two voices, or locked more than 30 s late, is voided. It stores the Grudge line as it stood at lock time.
- `settle.ts`: after a window ends, asks each settling venue (every 20 s until it answers; Polymarket takes between 80 s and several minutes). When all have answered, or after 20 minutes, it resolves the window, scores each voice into `scoreboard`, and queues a record in `memories`, all in one transaction that only the first caller can win. When the category then reaches a multiple of 25 resolved windows, `engine/lessons.ts` counts, over the windows where the voices were 7+ pts apart, how often each voice was closest to the outcome (a tie credits nobody; fewer than 5 such windows writes nothing) and queues the sentence as a `lesson` memory plus a `lessons` row. That step runs in a savepoint, so a failure loses the lesson, never the settlement.
- `flush` (`memory/flusher.ts`): see below.
- `status.ts`: shared state the health route reads. `GET /api/health` returns 200 while the loop has finished a pass within the last minute, 503 otherwise.

## Memory flow (`src/server/memory/`)
1. A settled window adds a `record` to the `memories` outbox (status `pending`).
2. `flusher.ts` sends waiting memories to Walrus in one bulk call (at most 20), every 5 minutes or at 15 waiting. When records are waiting it first queues a `scoreboard` snapshot taken in one repeatable-read transaction. On success the row becomes `done` with its blob id; a memory the relayer refuses five times becomes `failed`; a failed call backs off for a minute.
3. `coldboot.ts`: `restoreIfEmpty` runs at boot. With no grudges in the database it reads the latest snapshot and up to 100 recent records from Walrus, rebuilds the grudges (`engine/rebuild.ts`: snapshot, then replay later records in resolution order) restores the recent ledger with its blob ids, and brings back the latest 20 lessons (skipping any whose blob is already held). `checkAgainstWalrus` does the same read-only and reports the largest gap against the live scoreboard, with the blob ids it read (`pnpm exec tsx ... scripts/verify-memory.mts`). A recall that comes back empty is asked again after 2 s, up to four times, because a fresh process gets empty answers for its first seconds.
4. `amnesia.ts`: `forget()` sets `paused` on the worker state, waits for a pass in flight, writes every waiting memory (`flushAll`), and checks that Walrus alone reproduces the live weights. If anything is unwritten or the gap exceeds 1e-9 it throws `AmnesiaRefused` and deletes nothing. Otherwise one transaction deletes picks, forecasts, lessons, questions, the scoreboard and the `record` memories that are done; `restoreFromWalrus` puts them back, and the report compares the weights before and after. `scoreboard` memories are kept so snapshot numbering continues.

## Board and picks (`src/server/board.ts`, `src/app/api/board`, `src/app/api/pick`)
`boardSnapshot()` reads, per category, the open window, the newest locked window, the last 20 with a result, the grudges, the resolved count and the newest lesson, and works out weights, confidence and price with the engine's pure functions. It is cached for 3 s and shared, so polling costs the same however many visitors there are. The visitor's own pick is the only per-visitor read. `engine/ledger.ts` turns calls and outcomes into right/wrong marks. The board shows only what has locked: live odds before the lock are not built yet.

## x402 payments (`src/server/x402/`, `src/app/api/consensus`, `scripts/agent.mts`)
`protocol.ts` holds the x402 v2 shapes (zod) and the base64 header codec. `quote.ts` signs the price, category and expiry with HMAC-SHA256 (`QUOTE_SECRET`) so the server stores nothing between the 402 and the payment. `verify.ts` is `acceptPayment`: it takes the chain and the ledger as arguments and runs the checks in the order the spec gives, executing only when all have held; it is fully covered by tests that use a real recorded payment (`fixtures/gasless-usdc.json`: a gasless 0.01 USDC transfer built and signed by the agent wallet, with the simulation Tatum returned for it). `chain.ts` simulates and executes through `sui()` (Tatum gRPC, shared 3 rps budget) and caps attempts at 20 a minute. `ledger.ts` is the `payments` table; the digest is the primary key, so the database decides who is first and a replay is refused. The server never holds a key: the buyer signs the transaction. `scripts/agent.mts` builds the payment on the public fullnode, refuses to pay more than 0.05 USDC a call, and in `--loop` mode buys every 30 minutes only when the voices disagree, up to 2 USDC.

## Deployment
`render.yaml` describes one Render web service in Frankfurt (Starter plan), built with `pnpm build` and started with `pnpm start`. Secrets are typed into the dashboard when the Blueprint is created. The database is Supabase `grudge` (eu-central-1) through the session pooler.

## Not built yet
The UI, streak and split lessons (only the every-25-windows lesson exists), an amnesia history table, and `/receipts`. Live odds before the lock were decided against.

## Decisions that shaped the layout
See `DECISIONS.md`. In short: all Tatum access is in one folder because it shares one rate budget; venue parsers are pure so they can be tested against real payloads; shared state goes through `singleton` because Next bundles the worker and the route handlers separately.
