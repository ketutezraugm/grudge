# Handoff

> Living state of the build. Overwritten (not appended) by `/handoff`. A new session reads this first, then the PRD sections named under **Next**. `docs/PLAYBOOK.md` is the master guideline and wins over any other doc.
> Last updated: 2026-11-08 18:35 UTC · Session 1 (memory rebuild bug found and fixed with hourly Walrus buckets; design Step A is with the owner)

## Now
- **Render is the only worker.** Service `srv-dbo1qp3rjlhs73a6ico0` (Blueprint `exs-dbo1pgjl550s738gn730`, workspace `tea-db0fppid0e5s73beqn4g`) at **https://grudge-l19c.onrender.com**, healthy at 16:01 UTC. It auto-deploys on every push to `main`, and each deploy restarts the worker (the open window is lost). **Never run `next start` locally** (a second worker double-writes).
- **Phase:** the backend is done and live: worker, Walrus memory and rebuild (proven after a real wipe), lessons recalled from Walrus, `GET /api/board`, `POST /api/pick`, x402 `GET /api/consensus` (one real mainnet payment settled), `GET /api/receipts`, the measured learning comparison. **There is no UI.** The user sent the design brief to Claude Design at ~16:00 UTC and has not returned a result.
- **Deadline:** submissions close 2026-11-10 17:00 UTC; our cutoff is 14:00 UTC.
- **Checks at 16:01 UTC:** `pnpm lint`, `pnpm typecheck` pass; `pnpm test` 114 tests pass. CI is green on every pushed commit (last pushed: `0ae6438`).
- **Git:** private repo `ketutezraugm/grudge`, authored as `AkuTampanTay`, no co-author. **Four docs-only commits are local and unpushed** (`4dec3fa`, `2eac1cd`, `6947b20`, `b0e8550`) plus an uncommitted `.gitignore` line for the design bundle; they go out with the next code push. The repo **stays private until the user says so**.
- **Usage (from `/usage` at ~16:35 UTC, for the playbook):** 5-hour session 62% used (resets Nov 8 19:50 UTC); week 21% (resets Nov 13). Last 24 h: top subagents `deep-research` 13% (earlier sessions), general-purpose 6%, grilling 3%; top skills `/handoff` 2%; top MCP `render` 2%. Advice shown: `/clear` when switching tasks, cheaper models for simple subagents. This session's three drafting agents ran Sonnet medium, Sonnet medium and Haiku low.

## Live numbers (16:00 UTC; recompute before quoting anywhere public)
- Walrus mainnet: 267 memories (148 records, 114 scoreboard snapshots, 5 lessons), 0 refused. `verify-memory` gap 0.
- Resolved windows: btc-5m 100, btc-15m 37. btc-5m trust: DeepBook 0.84, Polymarket 0.16.
- Lessons: 5m "DeepBook was closer 72% of the time" over 54 disagreements of 7+ pts; 15m "Kalshi 45%, DeepBook 36%" over 22.
- **Learning, stored lock-time line, last 100 windows:** btc-5m Grudge Brier 0.1788, equal weights 0.1856, DeepBook alone 0.1736; gain over equal weights +0.0068 ± 0.0071 (95%, includes zero). btc-15m 0.1855 / 0.1868 / DeepBook 0.1748; gain +0.0012 ± 0.0036. **Claim only: slightly ahead of an equal-weight average, not statistically clear, and DeepBook alone scores better.** The hedge rate stays 0.5.
- x402: one payment, 0.038 USDC, digest `4f3bXYdmR1XYJTvVrm17HEat4aDSePvShTcqAZmeSnTY`, SUCCESS on Sui, replay refused. Price now 0.012 to 0.04 USDC and rises with confidence. The agent wallet holds about 3.057 USDC.
- No visitor picks yet, so the Crowd has not called.

## Done (see `docs/ARCHITECTURE.md`, `docs/API.md`, `docs/ASSUMPTIONS.md`)
- Research, PRD, brand v2, decisions, as-built architecture, identity record (`docs/IDENTITY.md`).
- Server: Tatum layer, engine, voices, memory codec, worker, outbox flusher, cold boot, amnesia (`POST /api/admin/amnesia`, admin token) and public `POST /api/verify-memory`, lessons, board and picks (3 per address per window), x402 (`src/server/x402/*`, `scripts/agent.mts`, tests against a real recorded payment), `engine/learning.ts`, `receipts.ts` (+ `amnesia` table, migration 0003), `memory/recall.ts`.
- Research (playbook Phases 1, 9, 10): `docs/research/COMPETITORS.md` and `raw/*`, `docs/REVIEW.md` (red-team, mock judging, odds: about 60% for at least one prize if the UI, video and README land, about 25% if not), `docs/ASSUMPTIONS.md`. Closest rival: `nancy197/sibyl` (same core, testnet payments, no demo at 15:05 UTC).
- Design handoff: `docs/DESIGN-BRIEF.md` (the full brief), `docs/brand-guidelines.md` (stamps now square-cornered), a private Design artifact https://claude.ai/artifact/3Rm1ffnBBNPWc6AYTPJ2Zm (version 5, same files), and `design-handoff.zip` / `design-handoff/` in the repo folder (gitignored) for uploading to a separate Claude Design project.
- Ops: CI (`.github/workflows/ci.yml`), one-time cloud routine for a competitor re-scan on 2026-11-09 17:00 UTC (https://claude.ai/code/routines/trig_019N6pEzCmFoWL8CmkUmX4yB; no repo attached; it carries the account connectors Claude_Docs and Claude_Code_Remote, unused).
- Database Supabase `grudge` (eu-central-1), four migrations, RLS on every table. `render.yaml` Blueprint (Frankfurt, Starter).

## Next (in order)
0. **PLAYBOOK v3 (since ~17:40 UTC Nov 8) overrides everything; design restarted at Phase 3.** Phase 3 is **done**: the owner approved the **Hindcast world under the name Grudge** (weather-forecast verification; cobalt `#2B54C9` ground, Martian Mono + Atkinson Hyperlegible Next; record row borrowed from Formline). Locked in `docs/IDENTITY.md`; why in DECISIONS.md. Directions: `docs/DIRECTIONS.md`; style tiles https://claude.ai/artifact/NLRMhQgaFLEQsBfidcAtRR.
   **Phase 7 so far (~18:05 UTC):** `docs/DESIGN-BRIEF.md` rewritten (IDENTITY and section 6 bans pasted exactly; Step A = 3 first-viewport compositions of the Board, Step B = full screens, Step C = assets). **Design System artifact** "Grudge": https://claude.ai/artifact/Ekg8ywRiET1GvoA3UQjpAB (tokens, README from IDENTITY, cover). Upload bundle refreshed: `design-handoff/` + `design-handoff.zip` (brief, identity, brand guidelines, live `data/board.json`, `receipts.json`, `verify-memory.json` from 18:00 UTC). **Next:** the owner runs Step A in Claude Design (route to confirm), picks a composition, then Step B; Claude implements with `impeccable`. Timebox: compositions and screens by Nov 9 ~12:00 UTC, build until Nov 10 ~08:00 UTC.
   **Memory rebuild bug, found and fixed (18:25 UTC):** `recall` returns the most similar memories and `sort: "recent"` only re-orders them, so past 100 records in a namespace a rebuild read an arbitrary sample (gap 0.81 to 1.2). Records and snapshots now go to hourly namespaces (`memory/buckets.ts`, `docs/ARCHITECTURE.md` "Hourly buckets", DECISIONS 2026-11-08); live check at 18:25 UTC: snapshot #143 from a bucket, gap 0. **Still to do:** rehearse a real amnesia wipe on production once the buckets hold a few hours (the restored ledger is thin until then), and watch for relayer `RECALL_TIMEOUT` (504, Seal decrypt) on large recalls.
   **`design-from-claude/` holds the RETIRED Grudge Book designs** (Newsreader serif, paper `#F4EFE4`; exported 16:20 UTC, before playbook v3). **Do not implement them.** Wait for the Hindcast Step A/B output.
   Committed; `main` is pushed through `cad6d98` (the bucket fix) plus one local docs commit.
1. **Phase 7 drafts: written, reviewed and committed (2026-11-08 ~16:30 UTC).** Files: `docs/research/raw/facts-2026-11-08.md` (the number source), `docs/launch/{VIDEO-SCRIPT,DEMO-PLAN,TESTERS,PITCH-QA,BLOG-DRAFT}.md`, `docs/SUBMISSION.md`, `docs/research/raw/name-check.md`. Checked against the fact sheet, API.md and ARCHITECTURE.md; banned-word grep clean. **Before any of it goes public:** recompute numbers from `/api/receipts`; replace placeholders ([LIVE URL], [REPO URL], [VIDEO URL], [BLOG URL], [TATUM ACCOUNT ID], [WALRUS DELEGATE KEY], [SUI ADDRESS], [X POST URL], [LINKEDIN POST URL]); the pitch, Q&A and blog say "no visitor has picked yet", which must change once picks exist; the `humanizer` pass waits for the user's writing sample.
   - **Name check:** no crypto, Walrus or Sui product called Grudge. grudge.app/.xyz/.ai/.dev and getgrudge.com are taken; GitHub user `Grudge` is taken; @grudge on X unverified. The user decides whether that matters (no domain is needed for the submission).
   - **Video:** opens on a real Polymarket miss and runs the amnesia wipe on the live service at 0:08. Record a real wrong window first, rehearse the wipe once, and expect the board to take a few seconds to refill.
   - **Prize track not covered:** Best Tatum AI Builder ($500) needs a build made in ai.tatum.io; the drafts do not claim it. User decision.
2. **Implement the design when it returns.** The user is to export the Hindcast output (Step B screens) into `C:\Code\Hackatons\Walrus x Tatum Hackaton\design-from-claude\` after clearing the retired Grudge Book files, and say so. Build exactly what is drawn with `impeccable` (playbook Phase 7; Claude adds no visual decision), in Next.js with real text and inline SVG marks. Screens: `/`, `/receipts`, `/agents`, desktop 1440 and phone 390, states in `docs/DESIGN-BRIEF.md` §11. Done when `/` renders live data from `GET /api/board` and matches the design. Then: `impeccable document` → DESIGN.md, a Design System artifact, one Playwright test of the happy path, Lighthouse (a11y 95, performance 90), README as a landing page, MIT licence and repo topics, a secret scan of the full git history.
3. **Slides artifact for the pitch deck** (Artifact quickstart intent `slides`, seeded with the pitch and the honest numbers; the playbook lists it as a deliverable). Batch 2 design surfaces (favicon, social image, README banner, X image, blog cover, thumbnail, video cards, learning chart) go to Claude Design after batch 1 is approved.
4. After the re-scan on Nov 9 17:00 UTC, read its run log (`RemoteTrigger list_runs` / `get_run_log`); it ends with PLAN CHANGE yes or no.
5. Before any public writing, recompute the learning numbers from `/api/receipts` and update `docs/ASSUMPTIONS.md`.

## Waiting on the user
- [ ] **Claude Design result:** export it to `design-from-claude/` and tell Claude Code (the brief was uploaded as `design-handoff.zip`; the private canvas cannot be read by a separate Claude Design chat, and the chat inside the canvas is a normal Claude chat).
- [ ] **A paragraph of your own writing** for the `humanizer` pass.
- [ ] **Where `pnpm agent --loop` runs until Nov 16** (a machine that stays on; the key stays off Render; budget 2 USDC; it buys only when voices disagree). Not started.
- [ ] Tatum dashboard: credit use, a paid-plan decision, and the account ID for the submission form.
- [ ] Walrus dashboard: the delegate public key (`MEMWAL_AGENT_ID`) for the form.
- [ ] When the repo goes public; an X post with a real screenshot tagging @Tatum_io and @WalrusFoundation; 5 to 10 people to make picks once the board is up.
- [ ] Optional: connect GitHub to your Claude account (`/web-setup`) if cloud routines should read the repo. The `bot` host in `~/.ssh/config` (`167.71.197.78`) is not your droplet and its host key changed: do not connect to it.
- Done earlier: Render Blueprint applied (`ADMIN_TOKEN`, `QUOTE_SECRET` are generated by Render); agent wallet funded.

## Gotchas learned
- **Shell:** never put backticked words in an unquoted heredoc (`<<EOF`): bash runs them as commands and drops the words (it even tried to execute `docs/DECISIONS.md`). Use `<<'EOF'`, or the Edit and Write tools. A long inline python heredoc once hung the Bash tool.
- **Render:** a new `value:` env var in `render.yaml` did not reach the existing service; set it with the Render MCP `update_environment_variables` (this redeploys). `exs-…` is a Blueprint ID; `get_blueprint` lists its `srv-…`; Render MCP calls need `workspaceId`.
- **Claude Design:** a private artifact link is unreadable from another chat (it sees an empty shell). Standalone claude.ai/design closes 2026-12-14.
- **Pick cap address:** behind Cloudflare and Render the visitor is the second-to-last `X-Forwarded-For` entry (`server/caller.ts`).
- **Walrus relayer** answers a fresh process with empty recalls for its first ~2 s; `coldboot.ts` retries up to four times, 2 s apart. Any new recall code must do the same or read "nothing" after a restart.
- **x402:** gasless USDC builds and simulates through Tatum (`tx.balance` + `0x2::balance::send_funds`). "Zero gas" is not verified (computation cost equals the rebate); say "the payer needs no SUI". JSON cannot carry bigint: amounts go out as strings. Sui public JSON-RPC is retired; use `https://graphql.mainnet.sui.io/graphql`.
- **Tatum:** bursts get HTTP 429, and idle connections drop; `ThrottledTransport` retries after 1 s then 3 s. Call counts reset on every deploy.
- Polymarket closes a window between 80 s and several minutes after it ends (the worker asks every 20 s for up to 20 minutes); Gamma `markets?slug=` needs `&closed=true` for resolved markets. Kalshi `min_close_ts`/`max_close_ts` return exactly the window's market. DeepBook mainnet has 1m and 5m markets only.
- **Walrus look-alike values:** owner address, account object ID (`MEMWAL_ACCOUNT_ID`, public: `0x38de8cce40f73eeb500055ec3330b12fe0ad8347ee4d6fc5274ebe078bc20a04`), delegate private key, delegate public key (on-chain keys are base64, not hex).
- One env file, `.env` (gitignored). `tsx` treats `.ts` as CommonJS, so scripts are `.mts`, run with `--conditions=react-server --env-file=.env`, with relative imports. Biome formats code only (`docs`, `.claude`, `*.md` excluded); `pnpm exec biome check --write` fixes formatting. pnpm holds back packages published in the last 24 hours; three Mysten versions are excluded in `pnpm-workspace.yaml`.

## Open questions
- **The learning result is modest** (see "Live numbers"). The pitch, README and video must say exactly that. If the user wants to try a different hedge rate, do it as a disclosed, labelled change, not silently.
- Tatum call counts are since the last deploy; the proof strip's "Tatum calls" would mislead unless the design labels it or the counter is persisted.
- btc-5m split rate: the DeepBook tie-break was **not** adopted (it would score Polymarket against DeepBook's own feed; the void rate fell to about 10%).
- Does `nancy197/sibyl` deploy or move to mainnet before Nov 10? The scheduled re-scan answers it.
- The first two Walrus memories use the old format and are skipped on restore; later snapshots supersede them (gap 0).
