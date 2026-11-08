# Handoff

> Living state of the build. Overwritten (not appended) by `/handoff`. A new session reads this first, then the PRD sections named under **Next**.
> Last updated: 2026-11-08 06:35 UTC · Session 1 (worker, flusher and cold boot proven live; waiting on Render)

## Now
- **Phase:** the core loop works end to end against live data: it locks windows, settles them, scores the voices, queues memories and writes them to Walrus mainnet. It currently runs on this laptop (`next start -p 3100`, log in `%TEMP%\grudge\worker.log`, VPN required). **It should move to Render as soon as the user finishes the Blueprint steps; stop the local server then**, or two workers will double-write.
- **Deadline:** submissions close 2026-11-10 17:00 UTC. Our own cutoff is 14:00 UTC.
- **Checks:** `pnpm lint`, `pnpm typecheck`, `pnpm test` (74 tests) and `pnpm build` pass.
- **GitHub:** private repo `ketutezraugm/grudge`, pushed over HTTPS, commits authored as `AkuTampanTay <ezradarkwing@gmail.com>`. **Stays private until the user says so.**
- **Visual world:** Grudge Book (paper, ink, red pencil). See `docs/brand-guidelines.md` v2 and PRD §15. No UI built yet.

## Done (see `docs/ARCHITECTURE.md` for how it fits together)
- Research, PRD, brand v2, decisions, as-built architecture.
- Server foundation, Tatum layer (shared 3 rps budget, retries on 429 / `ECONNRESET` / `UNAVAILABLE`), engine, voices, memory codec.
- **Worker** (`src/server/worker/`): discover, lock, settle, flush, plus `GET /api/health`. Proven live:
  - 06:17 UTC: a 5m window locked with a strike of $75,680.20 and a Grudge line of 75.3%, then settled UP with DeepBook and Polymarket agreeing. Brier scores matched a hand calculation (0.0098 and 0.2450).
  - 06:22 UTC: a 15m window locked with all three venues (DeepBook, Polymarket, Kalshi).
  - 06:25 UTC window **voided as a split**: Pyth saw the move as -$0.14, Polymarket's Chainlink average said UP. Two feeds can disagree when Bitcoin barely moves. Worth measuring (see Open questions).
  - Two windows voided at 06:07 (VPN off) and one at 06:12 (Tatum connection reset); both causes are fixed or understood.
- **Walrus mainnet memories:** the probe memory, then flushes at 06:27 and 06:31 UTC (2 stored each, 0 refused). The first two predate the current format (no `resolvedAt` / `through`) and are skipped when restoring.
- **Cold boot and verification** (`memory/coldboot.ts`, `engine/rebuild.ts`): rebuilds the grudges from the latest snapshot plus later records in resolution order. A unit test proves the rebuild equals the live computation exactly. `restoreIfEmpty` runs at boot. `pnpm exec tsx --conditions=react-server --env-file=.env scripts/verify-memory.mts` compares live with rebuilt, read-only.
- Database: Supabase `grudge` (eu-central-1), three migrations applied, row-level security on every table.
- `render.yaml` Blueprint committed (Frankfurt, Starter).

## Next (in order)
1. **Prove cold boot against real Walrus data:** run `scripts/verify-memory.mts` once new-format memories are readable; the largest gap should be 0 except for memories still waiting to be written. Then build the destructive amnesia endpoint (admin token, flush first, wipe working tables, restore, report restored counts and whether the weights match) and the public read-only `POST /api/verify-memory` (PRD §15.6).
2. **Confirm Render is live:** with the service URL from the user, check `/api/health` and the Render logs through the Render MCP tools, then stop the local server.
3. `engine/lessons.ts` (templated lessons, one per 25 scored windows per category) and the lessons memory writer.
4. **Board API** (`GET /api/board`), picks (`POST /api/pick`), then the UI. Run `impeccable init` → `PRODUCT.md` and `shape` first (PRD §12, §15). Authenticity rules in `CLAUDE.md` apply.
5. x402 payment path (test-first), `scripts/agent.mts`, `/receipts`, `/agents` (PRD §5.5).

## Waiting on the user
- [ ] **Render Blueprint:** dashboard.render.com, New, Blueprint, connect GitHub with access to `ketutezraugm/grudge`, paste four values from `.env` (`DATABASE_URL`, `TATUM_API_KEY`, `MEMWAL_PRIVATE_KEY`, `TREASURY_ADDRESS`), confirm Starter ($7 a month), Apply. Never set `AGENT_PRIVATE_KEY` there. Then send the service URL.
- [ ] **Agent wallet funding:** about 2 USDC on Sui mainnet to `0x132643284ef48e256d2b31fe7907d87032f7be6c21086e68df89d36ba536d76c`. Its key is in `.env` as `AGENT_PRIVATE_KEY`. Balance was 0 at last check.
- [ ] Look at the Tatum dashboard for credit use (the worker makes a few gRPC calls per window, plus 429 retries) and decide on a paid plan.
- [ ] The `bot` host in `~/.ssh/config` (`167.71.197.78`) is not the user's DigitalOcean droplet and its host key changed. Do not connect to it; the user may want to remove the entry.

## Gotchas learned
- **Local runs need the VPN** (EU exit): Polymarket and Kalshi are DNS-blocked by the ISP. Turning the VPN on or off resets open connections, which cost one window each time. Render needs neither.
- Polymarket closes a window anywhere between 80 seconds and several minutes after it ends; the worker asks again every 20 s and waits up to 20 minutes. Gamma `markets?slug=` returns open markets only; add `&closed=true` for resolved ones. The live call uses `bestBid`/`bestAsk` because `outcomePrices` lags.
- Kalshi: `min_close_ts` and `max_close_ts` return exactly the market that closes with a window.
- DeepBook mainnet has 1m and 5m markets only. The 5m market for T is listed about 10 minutes ahead. `referencePrice` is `null` until the window opens, but `pricer()` works then.
- **Walrus has four look-alike values:** the owner address (here a Google-made one), the account object ID (`MEMWAL_ACCOUNT_ID`, public: `0x38de8cce40f73eeb500055ec3330b12fe0ad8347ee4d6fc5274ebe078bc20a04`), the delegate private key and the delegate public key. To find an account ID from an owner address, read the `accounts` table in the `AccountRegistry` object `0x8bf82c9e…199f`. On-chain delegate keys are base64, not hex.
- The treasury address does not have to own the Walrus account.
- Tatum answers bursts with 429 and drops idle connections; `ThrottledTransport` retries after 1 s then 3 s.
- One env file, `.env` (gitignored); `.env.local` no longer exists. An empty placeholder in a second env file once blanked a real key.
- `tsx` treats `.ts` as CommonJS, so scripts are `.mts`, run with `--conditions=react-server --env-file=.env`.
- Biome would reformat the markdown docs, so `docs`, `.claude` and `*.md` are excluded.
- pnpm holds back packages published in the last 24 hours; three Mysten versions are excluded in `pnpm-workspace.yaml`.

## Open questions
- **`btc-5m` split rate.** Only two venues settle a 5m window, so a 1–1 disagreement voids it (one of the first two settled windows). If it stays high, use DeepBook settlement as the tie-break for 5m and document it (PRD §10.5).
- Credits per Tatum call: the dashboard decides.
- Whether the first new-format snapshot restores cleanly from real Walrus data (Next, step 1).
