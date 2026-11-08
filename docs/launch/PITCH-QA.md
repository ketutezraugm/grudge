# Pitch and judge Q&A (draft, not final)

Numbers from `research/raw/facts-2026-11-08.md`. Recheck against `/api/receipts` before recording.

## Two-minute pitch

Markets forget. Grudge doesn't.

Every five and fifteen minutes there is a question: will Bitcoin end this window higher than it started? Four voices answer it. DeepBook, an onchain prediction market on Sui. Polymarket. Kalshi. And the Crowd, which is whoever visits and picks.

Grudge freezes their answers at a lock time. When the window ends, it writes down who was right and who was wrong, and it weights each voice by how right it has been. That record is the product, and it lives in Walrus Memory on mainnet. 267 memories so far: 148 records, 114 scoreboard snapshots, 5 lessons. None refused.

Here is the part we tested. We wiped the database, then rebuilt the weights from Walrus alone. They came back identical, a gap of zero.

Here is what the memory has taught it. Over 54 disagreements of seven points or more on the five-minute market, DeepBook was closer 72% of the time. The board shows that lesson, and it reads it back from Walrus when you look.

Does the learning work? Slightly. Over the last 100 windows Grudge scores a little better than an equal-weight average, and the gain is not statistically clear. DeepBook alone scores better than Grudge. We publish all three numbers.

Agents can buy the result. `GET /api/consensus` costs 0.012 to 0.04 USDC on Sui mainnet, rising with Grudge's confidence. The payer needs no SUI. We settled one real payment of 0.038 USDC, and a replay was refused. Our own agent buys only when voices disagree.

Every read of the market and the chain goes through Tatum gRPC, throttled to three requests a second.

[LIVE URL] [REPO URL] [VIDEO URL]

## Questions

**1. Does Grudge actually learn?**
A little. Last 100 btc-5m windows, mean Brier: Grudge 0.1788, equal weights 0.1856, DeepBook alone 0.1736. The gain over equal weights is +0.0068 ± 0.0071, so the 95% interval includes zero. On btc-15m it is +0.0012 ± 0.0036. We call it slightly ahead, not proven.

**2. Why not just use DeepBook alone, if it scores better?**
For these last 100 windows that would have scored better, and we do not claim otherwise. Grudge's job is to decide how much to trust each voice as they change, and DeepBook carries 0.84 of the btc-5m weight. Whether weighting pays off over a longer run is not shown yet.

**3. Why DeepBook?**
It is an onchain market on Sui, readable through Tatum gRPC, so it fits both sponsors. It also gives a settled, public price to set against two offchain venues on the same window.

**4. What if Walrus is down?**
The board keeps running from Postgres. Lesson recall times out after 3 seconds and falls back to the stored lesson. Writes wait in an outbox and retry; a memory refused five times is marked failed. The wipe-and-rebuild refuses to delete anything while memories are unwritten.

**5. Is Walrus just a backup?**
Partly, and we say so. In normal running the board reads Postgres. Walrus is read at cold boot, by the public verify check, and for lesson recall at view time. Memory changes the weights, not what Grudge asks.

**6. How real are the payments?**
One mainnet USDC payment settled, 0.038 USDC, digest 4f3bXYdmR1XYJTvVrm17HEat4aDSePvShTcqAZmeSnTY. We do not claim outside buyers. The volume is tiny.

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
Real: the mainnet memories, the 137 resolved windows (100 btc-5m, 37 btc-15m), the wipe-and-rebuild, the lessons, one settled payment. Not shown: a learning gain with a clear margin, outside buyers, any Crowd calls. Live odds before the lock are not built.
