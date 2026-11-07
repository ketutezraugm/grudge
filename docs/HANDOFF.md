# Handoff

> Living state of the build. Overwritten (not appended) by `/handoff`. A new session reads this first, then the PRD sections named under **Next**.
> Last updated: 2026-11-07 16:10 UTC · Session 1 (foundation built, waiting on credentials for GATE 1)

## Now
- **Phase:** Day 0. The foundation is built and committed. GATE 1 (16:00 UTC) is **blocked on the user's credentials**: the probe cannot reach Tatum or Walrus without them.
- **Deadline:** submissions close 2026-11-10 17:00 UTC. Our own cutoff is 14:00 UTC.
- **Checks right now:** `pnpm lint`, `pnpm typecheck`, `pnpm test` (50 tests) and `pnpm build` all pass.
- **Visual world:** Grudge Book (paper, ink, red pencil). See `docs/brand-guidelines.md` v2 and PRD §15.

## Done
- Research and planning: PRD, brand v2, decision log, research archive. Plan review verified Tatum's gRPC methods and DeepBook's market lead times.
- Repo: Next.js 16.4.5 app (strict TypeScript, Biome, Tailwind 4, Vitest), git history of small commits with no AI trailers, `.gitattributes` pinning LF.
- Server foundation (`docs/ARCHITECTURE.md` describes each module):
  - vocabulary, env, logger, singleton, Drizzle schema + first migration (`drizzle/0000_init.sql`, **not yet applied anywhere**);
  - Tatum layer: shared 3 rps budget, throttled gRPC transport, Sui client with DeepBook Predict, BTC rate;
  - engine: windows, scoring, resolution (pure, tested);
  - voices: DeepBook, Polymarket, Kalshi (parsers tested against payloads recorded from the live venues);
  - memory: codec (tested) and Walrus client (`writeBulk`, `recall`);
  - `scripts/probe.mts` and `scripts/migrate.mts`.
- Placeholder home page and brand icon.

## Next (in order)
1. **GATE 1.** With `.env.local` filled (see below), run `pnpm probe --write-memory`.
   Done when every line says `ok`: DeepBook markets and pricer through Tatum (pyth age under 30 s), the strike-chain line (reference vs previous settlement; the gap should be tiny), BTC rate, Polymarket and Kalshi calls, and a Walrus `blob`. Record the Tatum call counts and check the Tatum dashboard for the credit cost per call.
   If the Tatum key is not attached to gRPC calls, switch `sui.ts` to a metadata-generator credential (PRD §10.5).
2. **Apply the migration:** `pnpm db:migrate` against the Supabase database.
3. **Worker** (`src/server/worker/`, PRD §5.1–5.4, §6): discover windows with `openWindows`, create `questions`, capture every voice at `lockMs`, resolve after the end with `resolve`, update `scoreboard` with `scoreCall`, write records to the `memories` outbox. Start it from `src/instrumentation.ts` with a `globalThis` guard (use `singleton`).
   Done when both categories lock and resolve locally for an hour.
4. **Outbox flusher + cold boot** (`src/server/memory/flusher.ts`, `coldboot.ts`): bulk-flush at most 20 items every 5 minutes; rebuild the scoreboard from Walrus when the database is empty. Then deploy to Render by GATE 2 so data accumulates overnight.
5. `engine/lessons.ts` (templated lessons, one per 25 scored windows per category).

## Waiting on the user
- [ ] **Tatum** API key + dashboard account ID
- [ ] **Walrus Memory** mainnet: `MEMWAL_PRIVATE_KEY` (delegate private key), `MEMWAL_ACCOUNT_ID` (the account object, not the wallet), `MEMWAL_AGENT_ID` (public key, for the form)
- [ ] A wallet with about 0.5 SUI (account creation may need gas)
- [ ] **Treasury** Sui address (receive only) and an **agent payer** keypair with about 1 USDC (needs no SUI)
- [ ] **Supabase** project in `eu-central-1`: session-pooler `DATABASE_URL`
- [ ] **Render** account (Starter plan, $7/mo approved?) and the GitHub repo `grudge`
- [ ] **Windows DNS-over-HTTPS** (1.1.1.1), so Polymarket and Kalshi resolve locally. The probe currently fails on both with `fetch failed`.
- [ ] Confirm the git identity for the public repo: commits are authored as `AkuTampanTay <ezradarkwing@gmail.com>` (from global git config). Nothing has been pushed.
- [ ] Decide on a paid Tatum plan after the probe measures credit burn

Create `.env.local` from `.env.example`. Generate the two local secrets with:
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` (once for `QUOTE_SECRET`, once for `ADMIN_TOKEN`).
Secrets go in `.env.local` only, never in docs or chat.

## Gotchas learned
- Gamma `markets?slug=` returns open markets only; add `&closed=true` for resolved ones. Resolution lands about 80 s after the window ends. Its `outcomePrices` can lag the live book right after a window opens, so the live call uses `bestBid`/`bestAsk`.
- Kalshi: `min_close_ts` and `max_close_ts` return exactly the market that closes with a window, whatever its status.
- DeepBook mainnet has 1m and 5m markets only. `referencePrice` is `null` until the window opens, but `pricer()` still works then. The 5m market for T is listed 6.5–10 minutes ahead.
- Local `curl` to Polymarket and Kalshi needs `--doh-url https://1.1.1.1/dns-query`; Node's `fetch` cannot use it, so local runs need Windows DoH.
- The Walrus Memory relayer picks its own Sui RPC; it cannot be routed through Tatum.
- `create-next-app` 16.4.5 turns on `cacheComponents` and `partialPrefetching`; both were removed because they conflict with our dynamic routes. `next typegen` (run by `pnpm typecheck`) rewrites `tsconfig.json` once to add `allowJs`; it is committed.
- Biome would reformat the markdown docs and add a blank line inside skill frontmatter, so `docs`, `.claude` and `*.md` are excluded.
- `tsx` treats `.ts` as CommonJS here; scripts are `.mts`.
- pnpm holds back packages published in the last 24 hours; three Mysten versions are excluded in `pnpm-workspace.yaml`.

## Open questions
- Does `GrpcTransport`'s `meta` option attach `x-api-key` to every call? The probe decides.
- What does a Tatum gRPC call cost in credits? The probe plus the Tatum dashboard decide.
- The `btc-5m` void rate (only two venues resolve) needs measuring overnight. Above 15%, use DeepBook settlement as the tie-break.
