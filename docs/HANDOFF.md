# Handoff

> Living state of the build. Overwritten (not appended) by `/handoff`. A new session reads this first, then the docs named under **Next**. `docs/PLAYBOOK.md` (v3) is the master guideline and wins over any other doc.
> Last updated: 2026-11-09 04:50 UTC · repo cleaned of retired design material; Board (design Step B) is with Claude Design

## Key facts
- **Deadline:** submissions close 2026-11-10 17:00 UTC; our cutoff is 14:00 UTC. **Mode:** solo (the owner). **Idea:** Grudge. **Tracks:** Markets & Sports Prediction, Best Walrus Memory, Best Agent Payments.
- **Identity:** the Hindcast world (weather-forecast verification) under the name Grudge, locked in `docs/IDENTITY.md`. Claude does not design: Claude Design draws, then `impeccable` implements.

## Now
- **Render is the only worker.** Service `srv-dbo1qp3rjlhs73a6ico0` (Blueprint `exs-dbo1pgjl550s738gn730`, workspace `tea-db0fppid0e5s73beqn4g`) at **https://grudge-l19c.onrender.com**. It auto-deploys on every push to `main`, and each deploy restarts the worker (the open window is lost). **Never run `next start` locally** (a second worker double-writes).
- **Backend is done and live:** worker, Walrus memory and rebuild, lessons recalled from Walrus, `GET /api/board`, `POST /api/pick`, x402 `GET /api/consensus`, `GET /api/receipts`, the measured learning comparison. **There is no UI yet.**
- **Memory rebuild fix (cad6d98):** records and snapshots go to hourly Walrus namespaces (`memory/buckets.ts`; `docs/ARCHITECTURE.md` "Hourly buckets"). Live check 18:25 UTC Nov 8: snapshot #143, gap 0. **Still to do:** rehearse a real amnesia wipe on production once the buckets hold a few hours, and watch for relayer `RECALL_TIMEOUT` (504) on large recalls.
- **Checks:** `pnpm lint`, `pnpm typecheck`, `pnpm test` last verified green at 16:01 UTC Nov 8 (114 tests); re-run before the UI push.
- **Git:** private repo `ketutezraugm/grudge`, authored as `AkuTampanTay`, no co-author; it **stays private until the user says so**. `main` is pushed through `cad6d98`. Local and unpushed: `2cbd418`, `99370ad` (it committed a design `.rar` by mistake; the cleanup commit untracks it, but it stays in that commit's history, so squash it out before pushing if wanted) and the cleanup commit. A push restarts the worker.
- **Usage (`/usage` ~16:35 UTC Nov 8):** session 62%, week 21% (resets Nov 13). Top consumers: `deep-research` subagents 13% (earlier sessions), general-purpose 6%, grilling 3%.

## Design (PLAYBOOK v3)
- **Done:** Phase 3 (the three directions are archived in `docs/archive/DIRECTIONS.md`; the owner chose Hindcast under the Grudge name), `docs/IDENTITY.md` locked, `docs/DESIGN-BRIEF.md` rewritten, Design System artifact https://claude.ai/artifact/Ekg8ywRiET1GvoA3UQjpAB, style tiles https://claude.ai/artifact/NLRMhQgaFLEQsBfidcAtRR (references for drift checks only; Claude Design cannot open artifact links).
- **Step A done:** `design-from-claude/Board Step A.dc.html` holds three Board compositions at 1440 by 900: 1a Band first, 1b Line first, 1c Station rail. The owner chose **1b**. Sent to Claude Design: the pick panel is chart-coloured, with orange only on the selected Up/Down, the chosen confidence and "Log my call"; every state is its own 1440 artboard, with 1280, 768 and 390 showing the live state plus layout-changing states; Board first, then Receipts, Agents and 404.
- **Fixes asked of 1b:** a legible disabled "Log my call"; running sentences in Atkinson, never Martian Mono; keep the per-source Brier figure (not an API field today: compute it from the ledger in `/api/board`); the "Grudge" wordmark needs custom drawing (Step C).
- **Waiting on the Board (Step B) export** into `design-from-claude/`. Timebox: screens by Nov 9 ~12:00 UTC, build until Nov 10 ~08:00 UTC, then polish and packaging.
- **Drift check on anything that comes back:** ground `#2B54C9`, panels `#D9ECE6`, Martian Mono plus Atkinson Hyperlegible Next, orange only as a fill (about 5%), square corners, no gauge or dial. Details: "Not this" in `docs/IDENTITY.md`.

## Claims we can make (numbers drift; recompute from `/api/receipts`)
- **Learning:** slightly ahead of an equal-weight average, not statistically clear (the 95% interval includes zero), and DeepBook alone scores better. Never claim Grudge beats its best source. The hedge rate stays 0.5; a change would be disclosed and labelled.
- **x402:** one real mainnet payment, 0.038 USDC, digest `4f3bXYdmR1XYJTvVrm17HEat4aDSePvShTcqAZmeSnTY`, replay refused. Price 0.012 to 0.04 USDC, rising with confidence. The payer needs no SUI; "zero gas" is not verified. The agent wallet holds about 3.057 USDC.
- **Crowd:** no visitor picks yet, so the Crowd has not called.
- The number source for all drafts is `docs/research/raw/facts-2026-11-08.md` (16:00 UTC Nov 8; the live board has moved on).

## Next (in order)
1. **Implement the Board from the Step B export** with `impeccable`: Next.js App Router, real text, inline SVG, polling `/api/board` every 5 s, tokens as CSS custom properties from `docs/IDENTITY.md`, fonts via `next/font`. Done when `/` renders live data and matches the design at 1440 and 390. Then Receipts, Agents and the 404 as they arrive. After that: `impeccable document` (DESIGN.md), one Playwright test of the happy path, Lighthouse (a11y 95, performance 90), the README as a landing page, an MIT licence and repo topics, and a secret scan of the full git history.
2. **Step C and the deck:** assets from Claude Design (wordmark, favicon set, social image template, README banner, X image, blog cover, video cards, learning figure), and a Slides artifact for the pitch (Artifact quickstart intent `slides`, same Design System, honest numbers).
3. **Phase 7 text drafts are written and committed** (`docs/launch/*`, `docs/SUBMISSION.md`, `docs/research/raw/*`). Before anything goes public: recompute the numbers; fill the placeholders ([LIVE URL], [REPO URL], [VIDEO URL], [BLOG URL], [TATUM ACCOUNT ID], [WALRUS DELEGATE KEY], [SUI ADDRESS], [X POST URL], [LINKEDIN POST URL]); change "no visitor has picked yet" once picks exist; write the video's resolve shot (0:40 to 1:05) from the approved design; run the `humanizer` pass once the owner gives a writing sample.
4. After the competitor re-scan on Nov 9 17:00 UTC, read its run log (`RemoteTrigger list_runs` / `get_run_log`); it ends with PLAN CHANGE yes or no. Closest rival: `nancy197/sibyl`.
5. **Name:** Grudge is kept. grudge.app/.xyz/.ai/.dev and getgrudge.com are taken and so is the GitHub user `Grudge`; the submission needs no domain.
6. **Not covered:** Best Tatum AI Builder ($500) needs a build made in ai.tatum.io; the drafts do not claim it. The owner decides.

## Waiting on the user
- [ ] **Claude Design's Board export** in `design-from-claude/`; say so.
- [ ] **A paragraph of your own writing** for the `humanizer` pass.
- [ ] **Where `pnpm agent --loop` runs until Nov 16** (a machine that stays on; the key stays off Render; budget 2 USDC; it buys only when voices disagree). Not started.
- [ ] Tatum dashboard: credit use, a paid-plan decision, and the account ID for the form.
- [ ] Walrus dashboard: the delegate public key (`MEMWAL_AGENT_ID`) for the form.
- [ ] When the repo goes public; an X post with a real screenshot tagging @Tatum_io and @WalrusFoundation; 5 to 10 people to make picks once the board is up.
- [ ] Optional cleanup: delete `Grudge Design Revised.rar` in the repo root (untracked; its contents are already in `design-from-claude/`, but the archive could not be opened to confirm) and the retired Grudge Book Design artifact https://claude.ai/artifact/3Rm1ffnBBNPWc6AYTPJ2Zm.
- [ ] Optional: connect GitHub to your Claude account (`/web-setup`) if cloud routines should read the repo. The `bot` host in `~/.ssh/config` (`167.71.197.78`) is not your droplet and its host key changed: do not connect to it.

## Gotchas learned
- **Shell:** never put backticked words in an unquoted heredoc (`<<EOF`): bash runs them as commands and drops the words. Use `<<'EOF'`, or the Edit and Write tools. A long inline python heredoc once hung the Bash tool.
- **Render:** a new `value:` env var in `render.yaml` did not reach the existing service; set it with the Render MCP `update_environment_variables` (this redeploys). `exs-…` is a Blueprint ID; `get_blueprint` lists its `srv-…`; Render MCP calls need `workspaceId`.
- **Claude Design** cannot open any claude.ai artifact link, even one set to "anyone can open". Hand it files. A zip's `data/` subfolder did not come through, so upload JSON files directly or paste the values. To rebuild the upload set: `docs/DESIGN-BRIEF.md`, `docs/IDENTITY.md`, `docs/brand-guidelines.md`, plus fresh `GET /api/board`, `GET /api/receipts` and `POST /api/verify-memory` responses. Standalone claude.ai/design closes 2026-12-14.
- **Pick cap address:** behind Cloudflare and Render the visitor is the second-to-last `X-Forwarded-For` entry (`server/caller.ts`).
- **Walrus relayer** answers a fresh process with empty recalls for its first ~2 s; `coldboot.ts` retries up to four times, 2 s apart. Any new recall code must do the same or read "nothing" after a restart. `recall` returns the most similar memories, not the newest, which is why records live in hourly buckets.
- **x402:** gasless USDC builds and simulates through Tatum (`tx.balance` + `0x2::balance::send_funds`). JSON cannot carry bigint: amounts go out as strings. Sui public JSON-RPC is retired; use `https://graphql.mainnet.sui.io/graphql`.
- **Tatum:** bursts get HTTP 429, and idle connections drop; `ThrottledTransport` retries after 1 s then 3 s. Call counts reset on every deploy, so label them "since the last deploy".
- Polymarket closes a window between 80 s and several minutes after it ends (the worker asks every 20 s for up to 20 minutes); Gamma `markets?slug=` needs `&closed=true` for resolved markets. Kalshi `min_close_ts`/`max_close_ts` return exactly the window's market. DeepBook mainnet has 1m and 5m markets only.
- **Walrus look-alike values:** owner address, account object ID (`MEMWAL_ACCOUNT_ID`, public: `0x38de8cce40f73eeb500055ec3330b12fe0ad8347ee4d6fc5274ebe078bc20a04`), delegate private key, delegate public key (on-chain keys are base64, not hex).
- One env file, `.env` (gitignored). `tsx` treats `.ts` as CommonJS, so scripts are `.mts`, run with `--conditions=react-server --env-file=.env`, with relative imports. Biome formats code only (`docs`, `.claude`, `*.md` excluded); `pnpm exec biome check --write` fixes formatting. pnpm holds back packages published in the last 24 hours; three Mysten versions are excluded in `pnpm-workspace.yaml`.

## Open questions
- **The learning result is modest.** The pitch, README and video must say exactly that.
- btc-5m split rate: the DeepBook tie-break was **not** adopted (it would score Polymarket against DeepBook's own feed; the void rate fell to about 10%).
- Does `nancy197/sibyl` deploy or move to mainnet before Nov 10? The scheduled re-scan answers it.
- The first two Walrus memories use the old format and are skipped on restore; later snapshots supersede them.
