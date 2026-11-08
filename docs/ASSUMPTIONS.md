# Assumptions

Each item is `verified (source)` or `unverified (how to verify)`. Nothing unverified goes into the submission as a claim. Started 2026-11-08 15:00 UTC; PRD §4 holds the API facts verified on Nov 7.

## The product works as claimed

| Claim | Status |
| --- | --- |
| Memories are written to Walrus Memory on mainnet, more than the 10 required | verified (production `verify-memory` 08:18 UTC: snapshot #22, 26 records read; flush logs show 0 refused) |
| Wiping the database and rebuilding from Walrus reproduces the weights exactly | verified (amnesia run 06:43 UTC: 5 grudges before and after, gap 0; production `verify-memory` gap 0 at 08:18) |
| DeepBook Predict is read through Tatum gRPC | verified (every lock since 06:17 UTC logs a DeepBook call and strike) |
| Polymarket and Kalshi are reachable from Render Frankfurt without a VPN | verified (Render lock at 08:07 UTC with all three venues) |
| Bitcoin spot comes from the Tatum Data API | verified (`bitcoinUsd` in `/api/board`, 08:18 UTC) |
| Lessons appear on the board | verified (`/api/board` 15:14 UTC: btc-5m "DeepBook was closer 72% of the time" over n=54 disagreements; btc-15m "Kalshi was closer 45%", n=22) |
| Grudge learns something real | partly verified (15:14 UTC: btc-5m trusts DeepBook 0.846 vs Polymarket 0.154 after 92 resolved windows. Whether the Grudge line beats the equal-weight average is unverified: compute rolling Brier of the stored lock-time line against the equal-weight pool of the same stored calls) |
| x402 payment: a gasless USDC transfer built, simulated and executed through Tatum gRPC | unverified (not built; PRD §10.5 rates it Low-Med risk. Verify with `scripts/agent.mts` against production) |
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
