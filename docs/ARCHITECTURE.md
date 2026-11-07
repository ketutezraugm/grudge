# Architecture (as built)

What exists in the repo today. The plan lives in `PRD.md`; this file describes only code that has landed. Update it in the same commit as the module it describes.

Last updated: 2026-11-07, after the probe and the memory codec.

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
Drizzle schema (`schema.ts`) and the lazy Postgres connection (`client.ts`, session pooler, SSL required). Migrations are generated into `drizzle/` and applied by `runMigrations`.

### Shared plumbing
- `env.ts`: one zod-parsed getter per concern (`tatumEnv`, `memoryEnv`, `databaseEnv`, ...), so a half-filled `.env.local` works while accounts are still being created. Errors name the variables, never print values.
- `singleton.ts`: state both `instrumentation.ts` and the route handlers must see lives on `globalThis`.
- `log.ts`: JSON lines to stdout.

## Scripts
Run with `tsx --conditions=react-server` (so `server-only` resolves to an empty module) and `--env-file-if-exists=.env` then `.env.local`. A later file wins even with an empty value, so `.env.local` holds only values that are set. They are `.mts` so top-level await works.
- `pnpm probe`: asks every dependency a live question and prints the result. `--write-memory` also stores one memory on Walrus mainnet.
- `pnpm db:migrate`: applies the migrations.

## Not built yet
The worker loop (discover, lock, resolve), the memory outbox and flusher, cold boot and amnesia, the x402 payment path, the paying agent, the API routes and the UI.

## Decisions that shaped the layout
See `DECISIONS.md`. In short: all Tatum access is in one folder because it shares one rate budget; venue parsers are pure so they can be tested against real payloads; shared state goes through `singleton` because Next bundles the worker and the route handlers separately.
