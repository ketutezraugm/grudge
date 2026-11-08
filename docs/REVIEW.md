# Red-team review, mock judging and win odds (PLAYBOOK phases 9–10)

2026-11-08 15:20 UTC, about 47 h before our cutoff (Nov 10 14:00 UTC). Inputs: `research/COMPETITORS.md`, `research/raw/*.md`, `ASSUMPTIONS.md`, live `/api/board`.

## Where we stand (live, 15:14 UTC)

- 92 resolved btc-5m windows and 34 btc-15m, on mainnet, with no gaps since 06:58 UTC.
- Both categories have real lessons. btc-5m: "DeepBook was closer 72% of the time" over 54 disagreements, and DeepBook now carries 0.846 of the line against Polymarket's 0.154.
- Wipe-and-rebuild has been run once on real data (gap 0), and the public check returns gap 0.
- No UI, README, video or x402 yet.

## Red-team findings

| # | Finding | Fix |
| --- | --- | --- |
| 1 | PRD §1 says Grudge is the only entry using an onchain Sui odds source. False since Sibyl (Nov 7) | Corrected in PRD §1 |
| 2 | PRD §1 says Tatum is used four ways, including a GraphQL payment ledger that does not exist | Claim only what ships; the GraphQL ledger is a Could |
| 3 | In normal running, the product reads Postgres. Walrus is read only at cold boot and by the verify check. A Walrus judge can call it a backup | Booster 3: the disagreement entry recalls its lesson from Walrus at view time, with the blob link |
| 4 | "Grudge learns" is shown as weights, but its effect is unmeasured. Tuition published an honest null result, which sets the bar | Booster 4, measured 15:43 UTC: Grudge is slightly ahead of equal-weight averaging on both categories (5m +0.0061 ± 0.0072, 15m +0.0018 ± 0.0035 Brier), the 95% interval includes zero on both, and DeepBook alone scores better on both. Publish exactly that |
| 5 | At T−47 h there is no UI, README or video. Presentation is 20%, and today it scores near zero | Booster 1 and 5. Critical path: the user starting Claude Design |
| 6 | Best Agent Payments depends on x402, which is not built | Booster 2 |
| 7 | The approved btc-5m tie-break would score Polymarket against DeepBook's own feed on every tie, favouring one graded voice. The void rate has also fallen to 10% (2 of 20), under the 15% trigger | Not adopted. Splits stay void and are shown as SPLIT, as the brand already frames them |
| 8 | Sibyl's core is near-identical, so a judge seeing both may discount both | The first screen leads with what only Grudge has: an onchain market against Polymarket and humans on the same live window, with the real result ("DeepBook was closer 72% of the time") |
| 9 | Rimba also uses a paper-and-pencil look | Tell Claude Design to push the Grudge Book marks (tallies, stamps, red-pencil strikes) so the look is unmistakably ours |
| 10 | The repo must go public. Its history has never been scanned for secrets | Run a secret scan of the full history before the user flips it public |
| 11 | Tatum free-plan credit use is unknown | The user checks the dashboard (already on the waiting list) |
| 12 | Over-engineering: nothing material. Streak and split lessons, and a learning chart beyond one comparison, are cut | |

## Mock judging (judges are not public; three sponsor personas)

**Walrus Foundation engineer** ("deepest learning loop, memories that visibly change the product")
- Likely 7/10 on integration today: three namespaces, a rebuild proven twice, outbox discipline. It rises to 8.5 if lessons are recalled live.
- Against Sibyl: Sibyl's memory moves decisions (episodic recall shifts its threshold), and ours only moves weights. Against Hindsight: they have 2,598 memories; we will have about 1,500 by the cutoff.
- Biggest criticism: "Walrus is where you back up the scoreboard; the app runs on Postgres."

**Tatum developer advocate** ("Tatum RPC used for onchain data where relevant")
- Likely 7/10: DeepBook Predict reads over Tatum gRPC with a shared 3 rps budget, plus the Data API. It rises to 8.5 when x402 simulate and execute go through Tatum.
- Against Sibyl: they stream checkpoints over Tatum gRPC, which goes deeper. Against Hindsight: they use Tatum gRPC for their markets, comparable.
- Biggest criticism: "Two Tatum surfaces; the settlement path is the interesting one and it is not there yet."

**Sui payments / x402 reviewer** ("x402 or MPP, settled on Sui")
- Likely 0 today and 7.5/10 if a mainnet USDC x402 sale settles through Tatum with an open-source agent client and a replay guard.
- Against the field: Sibyl's payments are testnet MPP, as a buyer. Hindsight's are 0.01 SUI. RECEIPTS charges 0.05 USDC per pick. A rising price tied to learned confidence is unique.
- Biggest criticism if shipped: "Tiny volume; is anyone but your own agent paying?" Answer it with the continuous paying agent (PRD §15.6) and an honest count.

## Re-score (0–10, now → if the five boosters ship)

| Criterion (weight) | Now | Shipped |
| --- | --- | --- |
| Walrus + Tatum integration (30%) | 7 | 8.5 |
| Technical quality (30%) | 8 | 8.5 |
| Creativity (20%) | 6.5 | 7 |
| Presentation (20%) | 1 | 8 |
| **Weighted** | **5.9** | **8.1** |

Weakest criterion: **Presentation**. It is raised only by the UI, video and README landing on time.

## Win odds (judgement, not data)

| Prize | If the boosters ship | If the UI slips past the cutoff |
| --- | --- | --- |
| Prediction track, 1st ($500) | ~25% (top 3: ~55%) | under 10% |
| Best Walrus Memory ($500) | ~15% | ~5% |
| Best Agent Payments ($500) | ~15% | 0 without x402 |
| At least one prize | ~60% | ~25% |

Why not higher: Hindsight is live, busy and packaged today. Sibyl overlaps our core. Memory and Payments are crowded at the top. Why not lower: we are one of very few entries live on mainnet with an onchain market against offchain ones, settled every five minutes, with a rebuild proven on production data.

## The five boosters, in order

1. **UI from the Claude Design output** (board, `/receipts`, `/agents`). Cost: the user starting Claude Design today, then about 6–8 h to build it.
2. **x402 on mainnet USDC**, verified and settled through Tatum gRPC, with the open-source `scripts/agent.mts` and the paying loop running until Nov 16. About 5 h.
3. **Memory visibly in the product:** the disagreement entry recalls its lesson from Walrus (PRD §5.4 query) with the Walruscan link, plus amnesia history on `/receipts`. About 2 h.
4. **Honest learning evidence:** the Grudge line against equal weights and against the best single voice, per category, with an interval, from stored lock-time calls. About 2 h.
5. **Packaging:** README with live links and a verify table, a 2:30 video, the blog post, and an X post on Nov 9. Mostly the user's time; Claude drafts.

## Human-only actions

- Start Claude Design on the canvas today. Everything in Presentation waits on it.
- Ask 5–10 people to make picks on the live board once the UI is up. The Crowd voice has had no picks so far.
- Tatum dashboard: credit use, and the account ID for the form.
- Walrus dashboard: the delegate public key (`MEMWAL_AGENT_ID`) for the form.
- Decide when the repo goes public (after the secret scan).
- Post on X with a real screenshot once the board renders, tagging @Tatum_io and @WalrusFoundation (bonus points).
- Optional: ask in the Walrus or Tatum Discord where the blog post should be published.
