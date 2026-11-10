# I built an app that holds grudges, on mainnet (draft, not final)

[BLOG URL] / https://grudge-l19c.onrender.com / https://github.com/ketutezraugm/grudge / Demo video: https://youtu.be/3QriWD1SdVA

Cover image: `docs/launch/assets/blog-cover.png` (1600x900, no title text; upload it with the post). Learning figure: `docs/launch/assets/learning-figure.png`, with Nov 9 numbers; recompute before it is used.

I built Grudge for the Walrus x Tatum Total Recall hackathon. It asks four voices the same question every five and every fifteen minutes: will Bitcoin end this window higher than it started? The voices are DeepBook (an onchain prediction market on Sui), Polymarket, Kalshi and the Crowd, which is visitors' picks. It writes down who was right.

## The loop

A worker wakes every five seconds. At each window's lock time (180 seconds before the end for btc-5m, 480 for btc-15m) it reads every voice and freezes their calls. After the window ends it asks each venue for the result, resolves the window, and scores each voice with a discounted Brier loss. Trust weights come from those losses (a Hedge-style softmax), and the line is a logit pool of the calls under those weights.

A window with fewer than two voices, or locked more than 30 seconds late, is voided. A 1-1 split between venues stays void. I dropped a tie-break because it would have graded Polymarket against DeepBook's own feed.

## What goes into Walrus

Every resolved window becomes a record. Records are queued in a Postgres outbox and sent to Walrus Memory in bulk, 20 at most, every five minutes or sooner once 15 are waiting. Records and snapshots go into one namespace per hour, because recall returns the memories most similar to a query, not the newest ones. Before a flush the worker queues a scoreboard snapshot taken in one repeatable-read transaction. Every 25 windows, the voices' disagreements of 7+ points are counted and the result is stored as a lesson. At 10:10 UTC on 10 November: 1,163 memories on mainnet, 520 records, 614 snapshots, 29 lessons, none refused.

Each memory is a readable sentence followed by `#grudge {json}`, so a person can read it and the decoder can parse it exactly.

The test I cared about was the wipe. The amnesia endpoint writes everything pending, checks that Walrus alone reproduces the live weights, and only then deletes the learned state. Then it rebuilds from the latest snapshot plus later records. The weights came back identical. I ran it on production twice. The second run, at 10:37 UTC on 10 November, is in the video: 7 of 7 pending memories restored, 123 windows and 20 lessons came back, with a largest difference of 0. A fresh process gets empty recall answers for its first seconds, so the restore asks again after 2 seconds, up to four times.

## What it learned

The main lesson on btc-5m reads "DeepBook was closer 83% of the time" over 121 disagreements of 7+ points. On btc-15m it is "Kalshi 41%, DeepBook 39%" over 109. At 11:20 UTC on 10 November, btc-5m trust was DeepBook 0.87, Polymarket 0.13. The board reads that lesson back from Walrus when you view a disagreement, and falls back to the stored copy if Walrus takes more than 3 seconds.

## Did learning help?

Barely. I scored the line that was stored at lock time against the same calls averaged with equal trust, and against each voice alone, over the last 100 windows at 10:12 UTC on 10 November (Brier, lower is better):

| | Grudge | Equal weights | Best source alone |
| --- | --- | --- | --- |
| btc-5m | 0.140 | 0.157 | DeepBook 0.139 |
| btc-15m | 0.128 | 0.133 | DeepBook 0.120 |

The gain over equal weights is +0.0171 on 5m, where the 95% interval excludes zero, and +0.0052 on 15m, where it includes zero. Against the best single source, DeepBook, Grudge is 0.0008 behind on 5m and 0.0045 behind on 15m, so it has not beaten its best voice. After my wipe test the live Receipts page counts only the windows since, so its intervals are wider. I have not shown that weighting by track record pays here.

Two limits. Memory only changes weights; it does not change what Grudge asks. And in normal running the board reads Postgres, with Walrus used at cold boot, in the public verify check and for lesson recall.

## Tatum and the throttle

All market and chain reads go through Tatum gRPC, and BTC/USD comes from the Data API. The free plan allows 3 requests per second, so one budget spaces every call 350 ms apart and wraps the gRPC transport.

## Paying for the result

`GET /api/consensus` is an x402 v2 endpoint on Sui mainnet. It returns a 402 with a signed quote, so the server stores nothing between the ask and the payment. The price runs 0.010 to 0.050 USDC and rises with confidence. The buyer builds a gasless USDC transfer and signs it; the payer needs no SUI. The server checks the quote, the terms, the signature, a Tatum simulation and the treasury amount, claims the digest as a primary key so a replay fails, then executes.

Six real payments have settled, 0.251 USDC in total, the latest 0.047 USDC at 10:36 UTC on 10 November (digest 4WorYidoGj6HicCQpr44JAaHpssR5iJ8mUwJBSV3syHe), filmed in the video and costing 0 SUI in gas. Every one came from my own agent wallet. The agent in the repo (`pnpm agent`) buys only when voices disagree. Volume is tiny, and I am not claiming outside buyers.

## What is not done

No visitor has picked yet, so the Crowd has not called. There are no live odds before the lock. The learning gain is not statistically clear.

Walrus delegate key: 69ca178fa1c3a285164ca434d601e9bae6be2cc183ec376e1be3988b993c29f6. Tatum account: 6aeee02146ca44fe36bd2e92.
