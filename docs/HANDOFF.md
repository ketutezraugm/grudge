# Handoff

> Living state of the build. Overwritten (not appended) by `/handoff`. A new session reads this first, then the PRD sections named under **Next**.
> Last updated: 2026-11-08 08:20 UTC · Session 1 (lessons, board API and picks live on Render; the design handoff is next)

## Now
- **Render is the only worker.** Service `srv-dbo1qp3rjlhs73a6ico0` (Blueprint `exs-dbo1pgjl550s738gn730`, workspace `tea-db0fppid0e5s73beqn4g`), live since 06:58 UTC at **https://grudge-l19c.onrender.com**, auto-deploys on every push to `main`. The local server was stopped at 07:05 UTC; **do not start `next start` locally again** (a second worker double-writes). The VPN is no longer needed.
- **Phase:** the data side is done and live: worker, memory both ways (including after a real wipe), lessons, `GET /api/board`, `POST /api/pick`. **No UI yet, and none is built by Claude: the design handoff to Claude Design is next, and starts with questions to the user.**
- **Deadline:** submissions close 2026-11-10 17:00 UTC. Our own cutoff is 14:00 UTC.
- **Checks:** `pnpm lint`, `pnpm typecheck`, `pnpm test` (84 tests) pass at 08:17 UTC.
- **GitHub:** private repo `ketutezraugm/grudge`. Pushed through `e63964e`. A push to `main` redeploys Render and restarts the worker (a restart costs the open window). Commits are authored as `AkuTampanTay`, no co-author. **Stays private until the user says so.**
- **Visual world:** Grudge Book (paper, ink, red pencil). See `docs/brand-guidelines.md` v2 and PRD §15.

## Done (see `docs/ARCHITECTURE.md` and `docs/API.md`)
- Research, PRD, brand v2, decisions, as-built architecture.
- Server foundation, Tatum layer, engine, voices, memory codec.
- **Worker** (`src/server/worker/`): discover, lock, settle, flush, plus `GET /api/health`. Locks, settles, scores, queues memories.
- **Walrus mainnet memories: about 10** (probe memory plus flushes at 06:27, 06:31, 06:36 and 06:41 UTC; 0 refused). The hackathon minimum of 10 is reached; the worker adds a few per hour.
- **Cold boot** (`memory/coldboot.ts`, `engine/rebuild.ts`): rebuilds from the latest snapshot plus later records.
- **Lessons** (`engine/lessons.ts`, queued from `worker/settle.ts`): every 25 resolved windows per category, one counted sentence on how often each voice was closest when voices were 7+ pts apart. Restored on cold boot (latest 20). The database path was checked once in a rolled-back transaction; **no real lesson exists yet** (a category needs 25 resolved windows; btc-5m reaches it around 11:00 UTC Nov 8).
- **Board and picks** (`server/board.ts`, `app/api/board`, `app/api/pick`, `engine/ledger.ts`, `server/caller.ts`): see `docs/API.md` for the exact shape. Snapshot cached 3 s; Bitcoin price from Tatum cached 5 min; picks capped at 3 per address per window. The board shows only what has locked: **live odds before the lock are not built** (the Crowd and the live gauge need them if the design wants a moving needle).
- **Earlier this session:**
  - `src/server/memory/amnesia.ts` and `POST /api/admin/amnesia` (Bearer `ADMIN_TOKEN`, which is set in `.env`). Pauses the worker, flushes, refuses (409) unless Walrus alone reproduces the live weights, wipes, restores, reports. **Run live at 06:43 UTC: 5 grudges before and after, 4 ledger windows restored, gap 0, worker resumed.**
  - `POST /api/verify-memory`: public, read-only, one shared check per minute, returns blob ids plus rebuilt and live boards.
  - `flusher.ts` `flushAll()`; worker state gained `paused` and `ticking`.
  - `docs/API.md` created.
- Database: Supabase `grudge` (eu-central-1), three migrations, row-level security everywhere.
- `render.yaml` Blueprint committed (Frankfurt, Starter).

## Next (in order)
1. **Design handoff.** **The user's rule: Claude does not design.** Ask the user the design questions first (audience, screens, tone, the proof strip, what a judge sees in 10 seconds, whether live odds before the lock matter), then create a Design artifact (Artifact quickstart intent `design`) seeded with the brief, `docs/brand-guidelines.md`, real copy and a real `GET /api/board` response. Implement only what comes back (PRD §12, §15 mention `impeccable`; superseded). No dark/neon, no rounded boxes, no generic AI look. Done when the Design artifact exists and the user has seen it.
2. **x402 payment path** (test-first, PRD §5.5): `x402/{protocol,quote,verify}.ts`, `GET /api/consensus`, `scripts/agent.mts`. Needs no design, so it can run while the design is made. Done when the agent script gets 402, pays, gets 200, and a replay returns 402 `duplicate`.
3. **`GET /api/receipts`** (PRD §5.6): memory totals and Walruscan links, payments, Tatum counters, amnesia history. Amnesia history needs a table (none yet; the report is only logged as `amnesia.restored`). The `/receipts` page itself comes from the design.
4. Live odds before the lock for the gauge, if the design needs them.
5. `/agents` docs page content (curl flow, price now) once x402 works; the page itself comes from the design.

## Waiting on the user
- [x] **Render Blueprint applied** (see Now). `ADMIN_TOKEN` and `QUOTE_SECRET` are generated by Render; the admin token is in the service's Environment tab, for calling amnesia in production. Never set `AGENT_PRIVATE_KEY` there.
- [x] **Agent wallet funded:** 3.095552 USDC (no SUI, none needed: payments are gasless) at `0x132643284ef48e256d2b31fe7907d87032f7be6c21086e68df89d36ba536d76c`, checked on-chain via Sui GraphQL on 2026-11-08 06:50 UTC. Its key is in `.env` as `AGENT_PRIVATE_KEY`. Sui public JSON-RPC is retired; use `https://graphql.mainnet.sui.io/graphql` (`address(address:…){ balances { nodes { coinType { repr } totalBalance } } }`).
- [ ] Look at the Tatum dashboard for credit use (a few gRPC calls per window, plus 429 retries) and decide on a paid plan. Tests also log 429 retries, so the free plan is near its limit.
- [ ] The `bot` host in `~/.ssh/config` (`167.71.197.78`) is not the user's DigitalOcean droplet and its host key changed. Do not connect to it; the user may want to remove the entry.

## Gotchas learned
- **Two workers ran for about 4 minutes (06:58 to 07:05 UTC)** because Render went live before the local one was stopped. Both flushed at 07:01:19 and both locked `btc-5m:1794121500`. Checked afterwards: 7 records on Walrus, 7 distinct windows, snapshots #1 to #6 once each, production `verify-memory` gap 0. No damage found, but the flusher does not lock rows, so a second worker is never safe.
- Render IDs: `exs-…` is a Blueprint, not a service; `get_blueprint` lists its `srv-…`. Render MCP calls need `workspaceId`.
- **The Walrus relayer answers a fresh process with empty recalls for its first ~2 seconds** (empty at 1.3 s and 1.7 s, full at 6 s). `coldboot.ts` asks again up to four times, 2 s apart. Any new recall code must do the same or it will read "nothing" right after a restart.
- **Never rebuild (`pnpm build`) under a running `next start`:** stop the server first. Each restart costs the open window.
- A shell here: a long inline `python - <<EOF` heredoc hung the Bash tool; use the Edit tool for edits.
- **Local runs need the VPN** (EU exit): Polymarket and Kalshi are DNS-blocked. Toggling it resets open connections, which cost one window each time. Render needs neither. Scripts such as `verify-memory.mts` do not need it.
- Polymarket closes a window anywhere between 80 seconds and several minutes after it ends; the worker asks every 20 s and waits up to 20 minutes. Gamma `markets?slug=` returns open markets only; add `&closed=true`. The live call uses `bestBid`/`bestAsk`.
- Kalshi: `min_close_ts` and `max_close_ts` return exactly the market that closes with a window.
- DeepBook mainnet has 1m and 5m markets only; the 5m market for T is listed about 10 minutes ahead.
- **Walrus has four look-alike values:** owner address, account object ID (`MEMWAL_ACCOUNT_ID`, public: `0x38de8cce40f73eeb500055ec3330b12fe0ad8347ee4d6fc5274ebe078bc20a04`), delegate private key, delegate public key. On-chain delegate keys are base64, not hex.
- The treasury address does not have to own the Walrus account.
- Tatum answers bursts with 429 and drops idle connections; `ThrottledTransport` retries after 1 s then 3 s.
- One env file, `.env` (gitignored). `tsx` treats `.ts` as CommonJS, so scripts are `.mts`, run with `--conditions=react-server --env-file=.env`, and import with relative paths.
- Biome would reformat the markdown docs, so `docs`, `.claude` and `*.md` are excluded. `pnpm exec biome check --write` fixes formatting.
- pnpm holds back packages published in the last 24 hours; three Mysten versions are excluded in `pnpm-workspace.yaml`.

## Open questions
- **`btc-5m` split rate.** Only two venues settle a 5m window, so a 1-1 disagreement voids it (06:25 and 06:30 windows were voids; Pyth saw -$0.14 while Polymarket's Chainlink average said UP). If it stays high, use DeepBook settlement as the tie-break for 5m and document it (PRD §10.5).
- Credits per Tatum call: the dashboard decides.
- The first two Walrus memories use the old format and are skipped on restore; snapshot #2 onward supersedes them. Fine so far (gap 0).
