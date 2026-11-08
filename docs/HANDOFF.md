# Handoff

> Living state of the build. Overwritten (not appended) by `/handoff`. A new session reads this first, then the PRD sections named under **Next**.
> Last updated: 2026-11-07 18:10 UTC · Session 1 (GATE 1 passed; database and worker next)

## Now
- **Phase:** Day 0. **GATE 1 passed** at about 18:02 UTC: every external dependency answered through the real credentials, and the first memory is on Walrus mainnet.
- **Blocked:** Supabase rejects the password in `DATABASE_URL` (project `grudge`, `eu-central-1`, healthy; migration not applied). Hosting is undecided (see Waiting on the user).
- **Deadline:** submissions close 2026-11-10 17:00 UTC. Our own cutoff is 14:00 UTC.
- **Checks right now:** `pnpm lint`, `pnpm typecheck`, `pnpm test` (53 tests) and `pnpm build` pass.
- **Visual world:** Grudge Book (paper, ink, red pencil). See `docs/brand-guidelines.md` v2 and PRD §15.

## Done
- Research, PRD, brand v2, decision log, research archive, as-built architecture doc.
- Server foundation (`docs/ARCHITECTURE.md` describes each module): vocabulary, env, logger, singleton, Drizzle schema and first migration (`drizzle/0000_init.sql`, **not applied anywhere yet**), Tatum layer with a shared 3 rps budget and 429 retries, engine (windows, scoring, resolution), voices (DeepBook, Polymarket, Kalshi), memory codec and Walrus client.
- **GATE 1 evidence** (`pnpm probe --write-memory`):
  - DeepBook markets, pricer (Pyth age about 1 s) and the reference-price chain (gap under one cent) through Tatum gRPC.
  - Tatum BTC rate, Polymarket and Kalshi live calls (VPN on).
  - First Walrus mainnet memory: blob `U6j4ENe8kln_fFeuuThcB_eKL6-ogQGexVjTzMVDAfc`. Recalled by meaning with its write timestamp; the Walruscan link `https://walruscan.com/mainnet/blob/{blobId}` returns 200.
  - Tatum cost of one probe run: 15 gRPC calls and 1 Data API call. **Check the Tatum dashboard for the credits that used.**
- Single env file: everything is in `.env` (gitignored). `.env.local` was removed; its three generated secrets were moved into `.env`.

## Next (in order)
1. **Worker** (`src/server/worker/`, PRD §5.1–5.4, §6): discover windows with `openWindows`, create `questions`, capture every voice at `lockMs`, resolve after the end with `resolve`, update `scoreboard` with `scoreCall`, write records to the `memories` outbox. Start it from `src/instrumentation.ts` with a `globalThis` guard (use `singleton`).
   Done when both categories lock and resolve against a real database for an hour.
2. **Apply the migration** once a database exists: `pnpm db:migrate`.
3. **Outbox flusher + cold boot** (`src/server/memory/flusher.ts`, `coldboot.ts`): bulk-flush at most 20 items every 5 minutes; rebuild the scoreboard from Walrus when the database is empty. Deploy to Render so data accumulates overnight (GATE 2).
4. `engine/lessons.ts` (templated lessons, one per 25 scored windows per category).
5. Design context: `impeccable init` → `PRODUCT.md`, then `shape` the board (PRD §12, Day 0 22:00).

## Waiting on the user
- [ ] **Database password.** The Supabase project `grudge` exists (Frankfurt). `pnpm db:migrate` fails with "password authentication failed" even though the URL is well-formed. Reset it: Project Settings → Database → Reset database password (letters and digits only), then Connect → Session pooler → paste the URI into `DATABASE_URL`.
- [ ] **Hosting.** The user has a paid DigitalOcean droplet from another project (ssh alias `bot`, `167.71.197.78`, user root, key `~/.ssh/id_ed25519`). SSH from this laptop is refused with a **changed host key** warning (stored ECDSA entry at known_hosts line 3; the server now presents ED25519 `SHA256:68hb/8WunD00S/kEe4r+Fm1MZ4UFMFFwndaWjeQdvCA`). Do not bypass it. The user should compare that fingerprint in the DigitalOcean web console (`ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub`); if it matches, the droplet was rebuilt and the old entry can be removed. Then inspect it read-only (size, what runs there) before deploying. Fallback: Render Starter (about $7 a month, billed by the second).
- [x] **GitHub:** private repo `ketutezraugm/grudge`, pushed over HTTPS, 16 commits authored as `AkuTampanTay <ezradarkwing@gmail.com>`. Flip it public on Nov 10 (see DECISIONS).
- [ ] **Agent wallet funding:** about 2 USDC on Sui mainnet to `0x132643284ef48e256d2b31fe7907d87032f7be6c21086e68df89d36ba536d76c`. Its private key is in `.env` as `AGENT_PRIVATE_KEY`, and the user can sweep any leftover USDC back out. Balance was 0 at last check.
- [ ] Look at the Tatum dashboard for credit use after the probe, and decide on a paid plan.

## Gotchas learned
- **Walrus has four look-alike values.** The owner address (here a Google-made address, because the dashboard's "Continue with Google" creates one), the account object ID (`MEMWAL_ACCOUNT_ID`, what the code needs), the delegate private key, and the delegate public key (the "Agent ID" for the form). Our account ID is `0x38de8cce40f73eeb500055ec3330b12fe0ad8347ee4d6fc5274ebe078bc20a04` (public). The owner is `0xcabb5dd8…116e`.
- To find an account ID from an owner address: read the `AccountRegistry` object `0x8bf82c9e…199f`, then the dynamic field keyed by the owner address in its `accounts` table. The value is the account object ID.
- On-chain delegate keys are returned as **base64**, not hex. Compare after converting.
- The treasury address does not have to own the Walrus account. It only receives payments.
- Gamma `markets?slug=` returns open markets only; add `&closed=true` for resolved ones. Resolution lands about 80 s after the window ends. The live call uses `bestBid`/`bestAsk`, because `outcomePrices` lags.
- Kalshi: `min_close_ts` and `max_close_ts` return exactly the market that closes with a window, whatever its status.
- DeepBook mainnet has 1m and 5m markets only. A 1m market's reference price chains on a 60 s step, so check chaining on 5m markets only. `referencePrice` is `null` until the window opens, but `pricer()` still works then. The 5m market for T is listed about 10 minutes ahead (the probe skips that case).
- Tatum answers a burst of calls with HTTP 429 even within the plan's average rate. `ThrottledTransport` retries after 1 s and then 3 s.
- Node's `fetch` cannot use DNS-over-HTTPS, so Polymarket and Kalshi need the VPN (EU exit) locally. Render needs nothing.
- The Walrus relayer picks its own Sui RPC; it cannot be routed through Tatum. A 401 from it means a wrong account ID, a key that is not registered, or a testnet/mainnet mix-up.
- `create-next-app` 16.4.5 turns on `cacheComponents` and `partialPrefetching`; both were removed. `next typegen` (run by `pnpm typecheck`) adds `allowJs` to `tsconfig.json` once; it is committed.
- Biome would reformat the markdown docs, so `docs`, `.claude` and `*.md` are excluded.
- `tsx` treats `.ts` as CommonJS here, so scripts are `.mts`.
- pnpm holds back packages published in the last 24 hours; three Mysten versions are excluded in `pnpm-workspace.yaml`.

## Open questions
- What does a Tatum gRPC call cost in credits? The dashboard decides; the probe makes about 15 calls.
- The `btc-5m` void rate (only two venues resolve) needs measuring overnight. Above 15%, use DeepBook settlement as the tie-break.
