# Video script: 2:30

Numbers below are the Nov 10 ~05:30 UTC snapshot (`docs/HANDOFF.md`, Open questions); the older `docs/research/raw/facts-2026-11-09.md` is superseded. They drift daily: read each one off the live page in the same take, and change the sentence to match the screen.

| Time | On screen | Voiceover | Caption |
| --- | --- | --- | --- |
| 0:00-0:08 | Board, 5m tab. Polymarket's record row ends in an empty mark (a wrong call). Its station reads trust 7%, DeepBook's 93%. | Polymarket called this window wrong. Grudge wrote it down. It has learned to trust DeepBook 0.93 and Polymarket 0.07. | Markets forget. Grudge doesn't. |
| 0:08-0:20 | Run the amnesia endpoint. The Board's records, trust and lesson clear, then refill. The lesson comes back with its "On Walrus" link. (Rehearse first and film whatever the Board really shows while it rebuilds.) | Now I wipe the server. Everything it learned is gone. It reads Walrus and comes back: "DeepBook was closer 73% of the time" over 215 disagreements. | Wiped, then rebuilt from Walrus |
| 0:20-0:40 | The four stations (DeepBook, Kalshi, Polymarket, the Crowd, still silent) and the countdown to the lock. | Four voices call the same Bitcoin move over five and fifteen minutes: DeepBook on Sui, Polymarket, Kalshi, and the Crowd. | Four voices, one question |
| 0:40-1:05 | A window ends and resolves on the Board: the status reads "resolved ▲" or "▼", each source's record row takes its new mark, and the trust figures and the Grudge line update. There is no resolve animation in the build, so film the real change at full speed. | At the lock the calls freeze. When the window resolves, each wrong call is marked against its source. Trust moves. Nothing forgiven until a voice earns it. | Nothing forgiven |
| 1:05-1:30 | Receipts page. Counts: 1,015 memories (437 records, 552 scoreboard snapshots, 26 lessons), none pending or failed. Click a Walruscan link. | Every grudge is a Walrus blob on mainnet. Over a thousand memories: records, scoreboard snapshots and lessons. | Every grudge is a Walrus blob |
| 1:30-1:50 | Press "Rebuild from Walrus and compare". Result: gap 0. | This button rebuilds the trust weights from Walrus alone and compares them with the live ones. The gap is 0. | Rebuilt from Walrus. Gap 0. |
| 1:50-2:10 | Receipts, the "Is Grudge learning?" figure for 5 min. | Does it learn? Over the last 100 5-minute windows Grudge scored 0.137 against 0.159 for an equal-weight average, and the interval says that gap is real. DeepBook alone scores 0.135, about level with Grudge, so it has not beaten its best source. | Brier score, lower is better |
| 2:10-2:25 | Terminal: `pnpm agent`, then Suiscan. | Agents can buy the consensus. About four cents of USDC a call, four settled so far, and the payer needs no SUI. A replayed payment is refused. Reads go through Tatum. | Paid over x402 |
| 2:25-2:30 | Closing card, https://grudge-l19c.onrender.com. | Grudge. Live at https://grudge-l19c.onrender.com. | Walrus x Tatum |

## Shot list

1. Board 5m, a wrong call shown as an empty mark in the record row (0:00).
2. Amnesia run, then board refill (0:08).
3. The four stations and the countdown (0:20).
4. Lock and resolve, screen capture at full speed, no animation to wait for (0:40).
5. Receipts counts and one Walruscan page (1:05).
6. Memory check result (1:30).
7. Receipts learning figure, 5 min (1:50).
8. Terminal agent run, Suiscan digest page (2:10).
9. Title and closing cards from Claude Design: `docs/launch/assets/video-title.png` (0:00) and `docs/launch/assets/video-close.png` (2:25), both 1920x1080.

## Recording checklist

- Wait for a window that is wrong for Polymarket before you start, so its record row ends in an empty mark; do not fake it.
- The Crowd has no call from outside visitors (the 4 picks are the owner's), so say it is still silent. If outside picks arrive before you record, re-read the Crowd station.
- The agent loop is already buying every 30 minutes. For the terminal shot run `pnpm agent` once more yourself, on screen, so the purchase is filmed.
- The amnesia run passed on Nov 9 08:49 UTC (identical: true, 124 windows, 15 lessons). The admin token is in `.env` and matches Render. **Film the wipe last.** A restore keeps the latest snapshot and the records after it, so Receipts' record count drops right after it; take the Receipts counts shot (1:05) and the memory check (1:30) before the wipe, then edit in script order. The Board refills almost at once, so there is little to wait for: show it clear and refill honestly, do not slow it down.
- Render worker awake. Health returns 200.
- 1920 by 1080, browser zoom 100%, notifications off.
- Cobalt ground and chart paper, as designed. No cursor wandering.
- Read each number off the live page, never from this file.
- No "zero gas" anywhere. Say "needs no SUI".
- Captions burned in. Export, upload, paste into https://youtu.be/3QriWD1SdVA.
