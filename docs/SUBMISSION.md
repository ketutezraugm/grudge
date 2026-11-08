# Submission answers (draft, not final)

Numbers: `research/raw/facts-2026-11-08.md`. Recompute from `/api/receipts` before pasting.

## Form fields

| Field | Answer |
| --- | --- |
| Project name | Grudge |
| One line | Markets forget. Grudge doesn't. |
| Tatum account ID | [TATUM ACCOUNT ID] |
| Sui address | [SUI ADDRESS] (treasury that receives payments) |
| MEMWAL_AGENT_ID | [WALRUS DELEGATE KEY] |
| Live demo | [LIVE URL] |
| Repo | [REPO URL] |
| Video | [VIDEO URL] |
| Blog post | [BLOG URL] |
| Tracks | Markets & Sports Prediction; Best Walrus Memory; Best Agent Payments |
| Walrus Memory on mainnet | 267 memories (148 records, 114 scoreboard snapshots, 5 lessons), 0 refused |

## Description

Grudge asks four voices (DeepBook, Polymarket, Kalshi and the Crowd) whether Bitcoin will end a five-minute or fifteen-minute window higher. It freezes their calls at a lock time, scores each voice when the window resolves, and weights each voice by how right it has been. Resolved so far: 100 btc-5m windows and 37 btc-15m windows.

Walrus Memory holds what it learned. Every resolved window is a record, every few records a scoreboard snapshot, every 25 windows a lesson. After a real wipe of the database, the server rebuilt its weights from Walrus alone.

## How Grudge uses Walrus

- Three namespaces on mainnet: records, scoreboard snapshots, lessons. Writes go through an outbox and are flushed in bulk, 20 at most.
- Cold boot with an empty database restores the latest snapshot, replays later records, and brings back lessons.
- `POST /api/verify-memory` rebuilds the weights from Walrus and compares them with the live scoreboard. Current gap: 0.
- When two voices are 7+ points apart, the board reads its lesson back from Walrus at view time (for example, "DeepBook was closer 72% of the time" over 54 disagreements) and links the blob. If Walrus is slow or down, it shows the stored copy.

## How Grudge uses Tatum

- Every market and chain read goes through Tatum gRPC on Sui mainnet, behind one throttle of 3 requests per second (free plan). BTC/USD comes from the Tatum Data API.
- DeepBook's call is read over gRPC. Payments are simulated and executed through Tatum gRPC.

## Pitch, 50 words (count: 50)

Grudge asks four voices (DeepBook, Polymarket, Kalshi and the Crowd) to call Bitcoin up or down every five or fifteen minutes. It weights each voice by how right it has been, and keeps that memory on Walrus mainnet. Agents pay USDC on Sui mainnet, through Tatum, for the live result.

## Pitch, 150 words (count: 150)

Markets forget. Grudge doesn't.

Every five and fifteen minutes, four voices call whether Bitcoin ends a window higher: DeepBook (an onchain market on Sui), Polymarket, Kalshi and the Crowd, which is visitors' picks. Grudge freezes their calls at a lock time, waits for the result, and scores each voice. A voice that keeps missing counts for less next time.

That memory lives in Walrus Memory on mainnet: 267 memories so far, and the server can be wiped and rebuilt from Walrus alone, which we have done on real data. Market and chain reads go through Tatum gRPC.

Grudge's line is slightly ahead of an equal-weight average over the last 100 windows, not by a statistically clear margin, and DeepBook alone scores better. We say so.

Agents buy the trust-weighted call from GET /api/consensus for 0.012 to 0.04 USDC on Sui. The payer needs no SUI for gas. Replays are refused.

## Track: Markets & Sports Prediction

One onchain market (DeepBook Predict) is set against two offchain markets and the Crowd on the same window, settled every five and fifteen minutes.

Last 100 windows, mean Brier (lower is better):

| | Grudge | Equal weights | DeepBook alone |
| --- | --- | --- | --- |
| btc-5m | 0.1788 | 0.1856 | 0.1736 |
| btc-15m | 0.1855 | 0.1868 | 0.1748 |

Gain over equal weights: +0.0068 ± 0.0071 (5m), +0.0012 ± 0.0036 (15m), 95% intervals. Both include zero. DeepBook alone does better than Grudge. No visitor has picked yet, so the Crowd has not called.

## Track: Best Walrus Memory

Memory is the product's ledger, not a log. It sets the voice weights, it can rebuild the whole server, and a disagreement entry recalls its lesson from Walrus when viewed. Gaps stated plainly: in normal running the board reads Postgres, and memory changes weights, not what Grudge decides to ask. Lessons are one sentence per 25 windows, 5 so far.

## Track: Best Agent Payments

`GET /api/consensus` speaks x402 v2 (scheme exact, USDC on `sui:mainnet`). The price runs 0.012 to 0.04 USDC and rises with Grudge's confidence. The server checks the quote signature, the exact terms, the transaction signature, a Tatum simulation and the treasury amount, then claims the digest and executes. The server holds no key.

One real payment has settled: 0.038 USDC, digest 4f3bXYdmR1XYJTvVrm17HEat4aDSePvShTcqAZmeSnTY, SUCCESS on Sui. A replay was refused. The open-source agent (`pnpm agent`) buys only when voices disagree, refuses to pay over 0.05 USDC a call, and its wallet holds about 3.057 USDC. Volume is tiny, and we claim no outside buyers.

## Social posts (bonus)

X and LinkedIn: [X POST URL], [LINKEDIN POST URL]. Tag @Tatum_io and @WalrusFoundation.
