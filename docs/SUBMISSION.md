# Submission answers (draft, not final)

Numbers: `research/raw/facts-2026-11-10.md` (the figures filmed for the video, before the 10:38 UTC wipe test, unless marked live).

## Form fields

| Field | Answer |
| --- | --- |
| Project name | Grudge |
| One line | Markets forget. Grudge doesn't. |
| Tatum account ID | 6aeee02146ca44fe36bd2e92 |
| Sui address | 0x257c40edfb58d7e6574f0b7df816398db3f191fcaffcaefaaa6523a696f3f46e (treasury that receives payments) |
| MEMWAL_AGENT_ID | 69ca178fa1c3a285164ca434d601e9bae6be2cc183ec376e1be3988b993c29f6 (hex; base64 acoXj6HDooUWTKQ01gHpuua+LMGD7DduG+OYi5k8KfY=) |
| Live demo | https://grudge-l19c.onrender.com |
| Repo | https://github.com/ketutezraugm/grudge |
| Video | https://youtu.be/3QriWD1SdVA |
| Blog post | [BLOG URL] |
| Tracks | Markets & Sports Prediction; Best Walrus Memory; Best Agent Payments |
| Walrus Memory on mainnet | 1,163 memories by 10:10 UTC Nov 10 (520 records, 614 scoreboard snapshots, 29 lessons), 0 refused |

## Description

Grudge asks four voices (DeepBook, Polymarket, Kalshi and the Crowd) whether Bitcoin will end a five-minute or fifteen-minute window higher. It freezes their calls at a lock time, scores each voice when the window resolves, and weights each voice by how right it has been. Resolved by 10:35 UTC Nov 10: 350 btc-5m windows and about 133 btc-15m windows.

Walrus Memory holds what it learned. Every resolved window is a record, every few records a scoreboard snapshot, every 25 windows a lesson. After a real wipe of the database (twice, the second one filmed for the video), the server rebuilt its weights from Walrus alone. A wipe restores the latest snapshot and the records after it, so the live Receipts page counts fewer rows afterwards; the older records stay on Walrus.

## How Grudge uses Walrus

- Three namespaces on mainnet: records, scoreboard snapshots, lessons. Writes go through an outbox and are flushed in bulk, 20 at most.
- Cold boot with an empty database restores the latest snapshot, replays later records, and brings back lessons.
- `POST /api/verify-memory` rebuilds the weights from Walrus and compares them with the live scoreboard. Current gap: 0.
- When two voices are 7+ points apart, the board reads its lesson back from Walrus at view time (for example, "DeepBook was closer 83% of the time" over 121 disagreements) and links the blob. If Walrus is slow or down, it shows the stored copy.

## How Grudge uses Tatum

- Every market and chain read goes through Tatum gRPC on Sui mainnet, behind one throttle of 3 requests per second (free plan). BTC/USD comes from the Tatum Data API.
- DeepBook's call is read over gRPC. Payments are simulated and executed through Tatum gRPC.

## Pitch, 50 words (count: 50)

Grudge asks four voices (DeepBook, Polymarket, Kalshi and the Crowd) to call Bitcoin up or down every five or fifteen minutes. It weights each voice by how right it has been, and keeps that memory on Walrus mainnet. Agents pay USDC on Sui mainnet, through Tatum, for the live result.

## Pitch, 150 words (count: 149)

Markets forget. Grudge doesn't.

Every five and fifteen minutes, four voices call whether Bitcoin ends a window higher: DeepBook (an onchain market on Sui), Polymarket, Kalshi and the Crowd, which is visitors' picks. Grudge freezes their calls at a lock time, waits for the result, and scores each voice. A voice that keeps missing counts for less next time.

That memory lives in Walrus Memory on mainnet: 1,100+ memories, and the server can be wiped and rebuilt from Walrus alone, which we have done on real data. Market and chain reads go through Tatum gRPC.

Grudge's line is slightly ahead of an equal-weight average over the last 100 windows, not by a statistically clear margin, and about level with the best single source. We say so.

Agents buy the trust-weighted call from GET /api/consensus for 0.010 to 0.050 USDC on Sui. The payer needs no SUI. Replays are refused.

## Track: Markets & Sports Prediction

One onchain market (DeepBook Predict) is set against two offchain markets and the Crowd on the same window, settled every five and fifteen minutes.

Last 100 windows at 10:12 UTC Nov 10, mean Brier (lower is better):

| | Grudge | Equal weights | Best source alone |
| --- | --- | --- | --- |
| btc-5m | 0.140 | 0.157 | DeepBook 0.139 |
| btc-15m | 0.128 | 0.133 | DeepBook 0.120 |

Gain over equal weights: +0.0171 (5m, 95% interval excludes zero) and +0.0052 (15m, interval includes zero). Against the best single source, DeepBook, Grudge is 0.0008 behind in 5m and 0.0045 behind in 15m: it has not beaten its best voice. The live page now counts only windows since the 10:38 UTC wipe test (90 at 5m, 33 at 15m at 11:20 UTC), so its intervals are wider and both include zero. The Crowd's picks so far are the builder's own.

## Track: Best Walrus Memory

Memory is the product's ledger, not a log. It sets the voice weights, it can rebuild the whole server, and a disagreement entry recalls its lesson from Walrus when viewed. Gaps stated plainly: in normal running the board reads Postgres, and memory changes weights, not what Grudge decides to ask. Lessons are one sentence per 25 windows, 29 written by 10:10 UTC Nov 10.

## Track: Best Agent Payments

`GET /api/consensus` speaks x402 v2 (scheme exact, USDC on `sui:mainnet`). The price runs 0.010 to 0.050 USDC and rises with Grudge's confidence. The server checks the quote signature, the exact terms, the transaction signature, a Tatum simulation and the treasury amount, then claims the digest and executes. The server holds no key.

Six real payments have settled, 0.251 USDC in total, the latest 0.047 USDC at 10:36 UTC Nov 10 (digest 4WorYidoGj6HicCQpr44JAaHpssR5iJ8mUwJBSV3syHe, SUCCESS on Sui with 0 SUI gas; filmed in the video). A replay is refused. The open-source agent (`pnpm agent`) buys only when voices disagree and refuses to pay over 0.05 USDC a call. Every payment so far is from our own agent wallet; we claim no outside buyers.

## Social posts (bonus)

X and LinkedIn: [X POST URL], [LINKEDIN POST URL]. Tag @Tatum_io and @WalrusFoundation.
