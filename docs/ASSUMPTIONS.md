# Assumptions

Each item is `verified (source)` or `unverified (how to verify)`. Nothing unverified goes into the submission as a claim. Started 2026-11-08 15:00 UTC; PRD §4 holds the API facts verified on Nov 7.

## The product works as claimed

| Claim | Status |
| --- | --- |
| Memories are written to Walrus Memory on mainnet, more than the 10 required | verified (`/api/receipts` 15:48 UTC: 254 written, 141 records + 109 snapshots + 4 lessons; `verify-memory` 15:22 UTC read snapshot #106 and 99 records; flush logs show 0 refused) |
| Wiping the database and rebuilding from Walrus reproduces the weights exactly | **was verified at 06:43 and 15:22 UTC, broke at ~16:30 UTC** when the records namespace passed 100 (recall returns a similarity-ranked sample, not the newest; see ARCHITECTURE, Hourly buckets). Fixed by hourly buckets; **re-verify live before any claim** (the next row was the earlier evidence) |
| Rebuild from Walrus after the hourly-bucket fix | verified once, easy case (18:25 UTC: `verify-memory` read snapshot #143 from the bucket `grudge:v1:scoreboard:2026-11-08T18` plus 1 record, gap 0, nothing waiting). **Not yet verified:** a full amnesia wipe on production after the buckets hold several hours (the ledger after a wipe is thin until then, because older records live in the old namespaces and are not read). Rehearse once before the video |
| (earlier evidence for the first row) | verified (amnesia run 06:43 UTC: 5 grudges before and after, gap 0; production `verify-memory` gap 0 at 08:18) |
| DeepBook Predict is read through Tatum gRPC | verified (every lock since 06:17 UTC logs a DeepBook call and strike) |
| Polymarket and Kalshi are reachable from Render Frankfurt without a VPN | verified (Render lock at 08:07 UTC with all three venues) |
| Bitcoin spot comes from the Tatum Data API | verified (`bitcoinUsd` in `/api/board`, 08:18 UTC) |
| The disagreement lesson is read back from Walrus at view time | verified (`/api/board` 15:48 UTC: `lesson.recalled` true with a Walrus blob id on both categories while the voices disagreed; falls back to the stored lesson otherwise) |
| Lessons appear on the board | verified (`/api/board` 15:14 UTC: btc-5m "DeepBook was closer 72% of the time" over n=54 disagreements; btc-15m "Kalshi was closer 45%", n=22) |
| Grudge learns something real | verified as a small edge that is not yet statistically clear (`engine/learning.ts` on the stored lock-time line, last 100 resolved windows). btc-5m at 97 windows (15:43 UTC): Brier Grudge 0.1798, equal weights 0.1859, DeepBook alone 0.1749; gain over equal weights +0.0061 ± 0.0072 (95%, interval includes zero; one window earlier it was +0.0078 ± 0.0065 and just excluded zero, so treat it as borderline). Against DeepBook alone −0.0049 ± 0.0075. btc-15m at 36 windows: Grudge 0.1839, equal 0.1857, DeepBook 0.1727; gain +0.0018 ± 0.0035, against DeepBook −0.0112 ± 0.0170. **Claim only: Grudge is slightly ahead of an equal-weight average on both categories, and the interval includes zero on both. Do not claim a significant gain, and do not claim Grudge beats its best voice. Recompute after more windows** |
| x402 payment: a gasless USDC transfer built, simulated and executed through Tatum gRPC | verified (production, 15:33 UTC: `pnpm agent --replay` got a 402 for 0.038 USDC, paid, got a 200; digest `4f3bXYdm…eSnTY` is SUCCESS on Sui GraphQL with USDC −38000 on the agent and +38000 on the treasury; the `payments` row is `settled`; the same payment replayed returned 402 "already used") |
| Payments cost the buyer no SUI | verified (the agent wallet holds no SUI and paid). "Zero gas" is not verified: the gas summary shows computation cost equal to the storage rebate |
| The paying agent runs continuously until Nov 16 | unverified (`--loop` exists; it needs a machine that stays on, and the key must not go on Render. Ask the user where it runs) |
| The agent wallet can pay | verified (3.095552 USDC at `0x1326…d76c`, Sui GraphQL 06:50 UTC; payments are gasless so no SUI needed) |
| The pick cap keys on the visitor's address | verified for the header shape (live `X-Forwarded-For` 07:20 and 08:14 UTC); the cap itself only by unit test, no live pick sent |
| The board stays fast under many visitors | unverified (snapshot is shared and cached 3 s by design; measure with a short load test before the demo) |

## Data quality

| Claim | Status |
| --- | --- |
| btc-5m windows void as splits often | verified, and it eased (4 of the last 20 at 08:18 UTC = 20%; 2 of the last 20 at 15:14 UTC = 10%, under the PRD §10.5 trigger of 15%). No tie-break; see DECISIONS |
| ~400 resolutions a day across both categories | unverified (PRD estimate; count resolved windows over 24 h from the board or the database) |

## Operations

| Claim | Status |
| --- | --- |
| The free Tatum plan's credits last through judging (Nov 16) | unverified (user to read credit use on the Tatum dashboard) |
| Render Starter keeps the worker running without sleeping | verified (Starter is a paid always-on plan; health 200 with ticks under 3 s old at 07:18, 08:14, 08:22 UTC) |
| Only one worker runs | verified since 07:05 UTC (local server stopped; one Render instance) |

## Submission

| Claim | Status |
| --- | --- |
| The form asks for the Tatum account ID, a Sui address and `MEMWAL_AGENT_ID` (the delegate public key) | verified (hackathon page, pasted into PLAYBOOK §1) |
| We have the delegate public key value for the form | unverified (read it on memory.walrus.xyz/dashboard under Delegate keys) |
| The repo must be public at submission | verified (hackathon checklist: "Working demo and public repo"); it is private now, the user decides when |
| A published blog post is required | verified (checklist item 04); where it is published is open |
| The video should be 2–3 minutes | verified (a 2–3 min demo video is a submission form field; `docs/research/raw/judges-sponsors.md`, from the hackathon repo's `content.ts`) |
| Judges are named publicly | verified that they are not (Event Rules: a panel "appointed by the Sponsors"; `docs/research/raw/judges-sponsors.md`). Mock judging uses sponsor personas instead |
| Prizes are paid in USDC and must be claimed within 14 days of the announcement | verified (`docs/research/raw/judges-sponsors.md`) |

## Video pipeline (Phase V0, 2026-11-10)

| Claim | Status |
| --- | --- |
| HyperFrames CLI 0.9.28 renders here (Node 24.15, FFmpeg 2026-04-30 build, system Chrome, Docker) | verified (`npx hyperframes doctor`: core checks pass) |
| whisper-cpp (captions via `transcribe`), Kokoro TTS and MusicGen are installed | verified that they are not; optional, needed only in V6 |
| HyperFrames telemetry is off | verified (`hyperframes telemetry disable`, status: disabled); `HYPERFRAMES_NO_TELEMETRY=1` also works |
| The renderer injects its own runtime, so the CDN pins in `index.html` only matter for previews | verified in source (`packages/producer/src/services/fileServer.ts`) |
| Artifact pages need script versions at least two weeks old, so the seed pins `gsap@3.15.0` and `@hyperframes/*@0.8.206` (newest before 2026-10-27) instead of the guide's unpinned URLs | verified (smoke test 2026-11-10: the pinned jsdelivr GSAP loaded and was inlined at render; player needs the file path `@hyperframes/player@0.8.206/dist/hyperframes-player.js`, not the bare package URL) |
| The HyperFrames CLI reads the project root `.env` (it ignores our keys); run it from `video/` | verified (doctor output) |
| The Design canvas here stores `.dc.html` artboards, not a HyperFrames project; whether Claude Design can also write plain `project/hf/*.html` support files and preview them | verified (Claude Design wrote `index.html`, `preview.html`, `README.md` and a HANDOFF.md, delivered as a ZIP; lint 0 errors, render 1920x1080 30 fps 120 frames 4.0 s) |
| The renderer gets Martian Mono's width axis even though it re-requests fonts with its own `ital,wght` URL | verified (it keeps only the family name, `deterministicFonts.ts:1673`, but Google serves the full variable file: the rendered wordmark's ink is 492 px wide, the same as Chrome at `font-stretch: 112.5%`; 100% gives 459 px) |
| A `<video>` must be a direct child of the root, not inside a timed scene | verified (lint rule `video_nested_in_timed_element`) |
