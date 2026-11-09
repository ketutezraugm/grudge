# Video script: 2:30

Numbers come from `docs/research/raw/facts-2026-11-09.md`. Recompute from `/api/receipts` before recording.

| Time | On screen | Voiceover | Caption |
| --- | --- | --- | --- |
| 0:00-0:08 | Board, 5m tab. Polymarket row with red strike through a wrong call, trust bar at 0.16. DeepBook at 0.84. | Polymarket called this window wrong. Grudge wrote it down. Over the last 100 windows it has learned to trust Polymarket 0.16 and DeepBook 0.84. | Markets forget. Grudge doesn't. |
| 0:08-0:20 | Run the amnesia endpoint. Board empties, then refills. The lesson appears with its receipt tick. | Now I wipe the server. Everything it learned is gone. It reads Walrus and comes back: "DeepBook was closer 72% of the time" over 130 disagreements. | Wiped, then rebuilt from Walrus |
| 0:20-0:40 | Gauge, four voices, countdown. | Four voices call the same Bitcoin move over five and fifteen minutes: DeepBook on Sui, Polymarket, Kalshi, and the Crowd. | Four voices, one question |
| 0:40-1:05 | Window locks, resolves. The resolve moment as the approved design draws it: each source's record row takes its mark and the trust shares and the Grudge line update. (Shot details come from the Claude Design output.) | At the lock the calls freeze. When the window resolves, each wrong call is marked against its source. Trust moves. Nothing forgiven until a voice earns it. | Nothing forgiven |
| 1:05-1:30 | Receipts page. Counts: 724 memories, 0 refused. Click a Walruscan link. | Every grudge is a Walrus blob on mainnet. 724 memories: 403 records, 307 scoreboard snapshots, 14 lessons. | Every grudge is a Walrus blob |
| 1:30-1:50 | Press "Rebuild from Walrus and compare". Result: gap 0. | This button rebuilds the trust weights from Walrus alone and compares them with the live ones. The gap is 0. | Rebuilt from Walrus. Gap 0. |
| 1:50-2:10 | Learning chart. | Does it learn? Slightly. Over the last 100 5-minute windows Grudge scored 0.1823 against 0.1860 for an equal-weight average. The interval includes zero, and DeepBook alone scores 0.1838, about level with Grudge. | Brier score, lower is better |
| 2:10-2:25 | Terminal: `pnpm agent`, then Suiscan. | Agents can buy the consensus. 0.038 USDC, settled on Sui, and the payer needs no SUI. A replayed payment is refused. Reads go through Tatum. | Paid over x402 |
| 2:25-2:30 | Closing card, [LIVE URL]. | Grudge. Live at [LIVE URL]. | Walrus x Tatum |

## Shot list

1. Board 5m, wrong call struck (0:00).
2. Amnesia run, then board refill (0:08).
3. Gauge and countdown (0:20).
4. Lock and resolve, screen capture at full speed (0:40).
5. Receipts counts and one Walruscan page (1:05).
6. Memory check result (1:30).
7. Learning chart (1:50).
8. Terminal agent run, Suiscan digest page (2:10).
9. Title and closing cards from Claude Design.

## Recording checklist

- Record a window that is wrong for Polymarket before you start; do not fake the strike.
- Admin token set, amnesia dry run done once the day before.
- Render worker awake. Health returns 200.
- 1920 by 1080, browser zoom 100%, notifications off.
- Light theme only, as designed. No cursor wandering.
- Read each number off the live page, never from this file.
- No "zero gas" anywhere. Say "needs no SUI".
- Captions burned in. Export, upload, paste into [VIDEO URL].
