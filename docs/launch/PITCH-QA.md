# Pitch and judge Q&A (draft, not final)

Numbers from `research/raw/facts-2026-11-09.md`. Recheck against `/api/receipts` before recording.

## Two-minute pitch

Markets forget. Grudge doesn't.

Every five and fifteen minutes there is a question: will Bitcoin end this window higher than it started? Four voices answer it. DeepBook, an onchain prediction market on Sui. Polymarket. Kalshi. And the Crowd, which is whoever visits and picks.

Grudge freezes their answers at a lock time. When the window ends, it writes down who was right and who was wrong, and it weights each voice by how right it has been. That record is the product, and it lives in Walrus Memory on mainnet. 1,163 memories by 10:10 UTC on 10 November: 520 records, 614 scoreboard snapshots, 29 lessons. None refused.

Here is the part we tested. We wiped the database, then rebuilt the weights from Walrus alone. They came back identical, a gap of zero.

Here is what the memory has taught it. Over 130 disagreements of seven points or more on the five-minute market, DeepBook was closer 72% of the time. The board shows that lesson, and it reads it back from Walrus when you look.

Does the learning work? Slightly. Over the last 100 windows Grudge scores a little better than an equal-weight average, and the gain is not statistically clear. The best single source scores about the same: Grudge is a little ahead of DeepBook alone on the five-minute market and a little behind Kalshi alone on the fifteen-minute one, and neither gap is clear. We publish all the numbers.

Agents can buy the result. `GET /api/consensus` costs 0.010 to 0.050 USDC on Sui mainnet, rising with Grudge's confidence. The payer needs no SUI. We settled one real payment of 0.038 USDC, and a replay was refused. Our own agent buys only when voices disagree.

Every read of the market and the chain goes through Tatum gRPC, throttled to three requests a second.

https://grudge-l19c.onrender.com https://github.com/ketutezraugm/grudge https://youtu.be/3QriWD1SdVA

## Questions

**1. Does Grudge actually learn?**
A little. Last 100 btc-5m windows at 10:12 UTC on 10 November, mean Brier: Grudge 0.140, equal weights 0.157, DeepBook alone 0.139. The gain over equal weights is +0.0171 and its 95% interval excludes zero, but DeepBook alone is 0.0008 better than Grudge. On btc-15m the gain is +0.0052 with an interval that includes zero, and DeepBook alone scores 0.120 against Grudge's 0.128. We call it ahead of an equal-weight average, not ahead of its best voice.

**2. Why not just use the best single source, if it scores about the same?**
On the fifteen-minute market Kalshi alone has scored a little better than Grudge over the last 100 windows, and we do not claim otherwise. Grudge's job is to decide how much to trust each voice as they change, and DeepBook carries 0.81 of the btc-5m weight. Whether weighting pays off over a longer run is not shown yet.

**3. Why DeepBook?**
It is an onchain market on Sui, readable through Tatum gRPC, so it fits both sponsors. It also gives a settled, public price to set against two offchain venues on the same window.

**4. What if Walrus is down?**
The board keeps running from Postgres. Lesson recall times out after 3 seconds and falls back to the stored lesson. Writes wait in an outbox and retry; a memory refused five times is marked failed. The wipe-and-rebuild refuses to delete anything while memories are unwritten.

**5. Is Walrus just a backup?**
Partly, and we say so. In normal running the board reads Postgres. Walrus is read at cold boot, by the public verify check, and for lesson recall at view time. Memory changes the weights, not what Grudge asks.

**6. How real are the payments?**
Six mainnet USDC payments settled, 0.251 USDC in total, the latest 0.047 USDC with digest 4WorYidoGj6HicCQpr44JAaHpssR5iJ8mUwJBSV3syHe. All came from our own agent wallet. We do not claim outside buyers. The volume is tiny.

**7. What does the server check before it executes?**
Header shape, quote signature and expiry, exact terms, the transaction signature, a Tatum simulation, and that the treasury receives exactly the amount. Then it claims the digest, so a replay fails, and only then executes. The server holds no key.

**8. Is it gasless?**
The payer needs no SUI. We have not verified a stronger claim, so we say nothing stronger.

**9. Where is Tatum used?**
All market and chain reads go through Tatum gRPC behind one 3 rps throttle, BTC/USD comes from the Data API, and payments are simulated and executed through gRPC. Counts reset on each deploy, so we quote no total.

**10. How do you know the memory is real?**
`POST /api/verify-memory` is public. It rebuilds the weights from Walrus and returns the largest gap against the live scoreboard, with the blob ids it read. Ours is 0.

**11. Has the Crowd voice done anything?**
No visitor has picked yet, so the Crowd has not called. Today the line rests on the market voices.

**12. What is real and what is not?**
Real: the mainnet memories, the 374 resolved windows (273 btc-5m, 101 btc-15m), the wipe-and-rebuild, the lessons, one settled payment. Not shown: a learning gain with a clear margin, outside buyers, any Crowd calls. Live odds before the lock are not built.
