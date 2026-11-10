# Video script (Phase V2, 2026-11-10)

2:30, 1920x1080, one flow told as a single grudge (structure approved at the V1 gate, `VIDEO-RECON.md`). AI voiceover (owner's choice, V1 gate). Supersedes `docs/launch/VIDEO-SCRIPT.md` for timing; that file's recording checklist still holds.

**Numbers** in `{braces}` are the 2026-11-10 09:15 UTC snapshot from `/api/board` and `/api/receipts`. They drift. Read each one off the live page in the take and set the VO line to match the screen before the voice is generated.

**Shot types:** D designed scene (Claude Design), F real footage, H footage framed inside a designed scene.

| Time | VO (words) | On screen | Text on screen (max 7 words) | Shot | Sound |
| --- | --- | --- | --- | --- | --- |
| 0:00-0:03 | "Polymarket said {51}% up. Bitcoin went down. Noted." (8) | Live Board, 5m tab. Push-in to Polymarket's station: its record row takes an empty mark. | none | F | Room tone only; a dry tick on the empty mark |
| 0:03-0:06 | (none) | Logo reveal, released from that empty mark (concept chosen in V3). Holds on mark, wordmark, motto. | Markets forget. Grudge doesn't. | D | The reveal's own sound (V3); music enters on the hold |
| 0:06-0:14 | "Every wrong call goes into Grudge's memory on Walrus. So let's wipe the server." (14) | Terminal framed beside the Board: the amnesia call runs. | Wipe the server | H | Key click on Enter |
| 0:14-0:20 | (none: the payoff) | The Board's trust, records and lesson clear. | none | H | Music drops out; silence |
| 0:20-0:28 | "It reads Walrus and comes back. Same trust. Same lesson. Nothing forgiven." (12) | The Board refills. The lesson returns with its "On Walrus" link; trust reads {0.94} / {0.06} again. | Rebuilt from Walrus | H | Music back in on the refill |
| 0:28-0:38 | "Four voices call the same Bitcoin move: DeepBook on Sui, Polymarket, Kalshi, and the Crowd." (15) | The stations and the countdown to the lock; pan across the voices. | Four voices, one question | H | |
| 0:38-0:50 | "At the lock the calls freeze. When the window ends, each wrong call is marked against its voice, and trust moves." (21) | The lock, then a cut to the same window resolving: status "resolved ▲/▼", record rows take their marks, trust figures change. | Trust moves | H | A tick per mark, nothing else |
| 0:50-1:05 | "Every grudge is a Walrus blob on mainnet. {1,137} memories so far: records, scoreboards, lessons." (15) | Receipts page: the counts, then click a blob link. | Every grudge is a Walrus blob | H | |
| 1:05-1:12 | (none) | Walruscan blob page, held still enough to read. | Walrus mainnet | F | |
| 1:12-1:30 | "This button rebuilds trust from Walrus alone and compares it with the live numbers." (14) then, after the result lands, "Gap: zero." (2) | Press "Rebuild from Walrus and compare". The result lands: gap 0. | Gap 0 | H | Silence on the result, then the line |
| 1:30-1:55 | "Is it learning? Over the last {100} five-minute windows Grudge scored {0.135}, against {0.154} for a plain average. DeepBook alone scores {0.134}, so it hasn't beaten its best voice yet." (32) | Receipts, the "Is Grudge learning?" figure. Push-in to the bars as each number is said. | Brier score, lower is better | D + F | |
| 1:55-2:08 | "Agents can buy that consensus. {0.047} USDC a call over x402, settled on Sui. The agent needs no SUI." (19) | Terminal: `pnpm agent` runs a purchase. | Paid over x402 | H | Key click; a settle tick |
| 2:08-2:15 | (none) | Suiscan transaction page for that payment. | Settled on Sui | F | |
| 2:15-2:20 | "DeepBook's odds and every payment are read from Sui through Tatum." (11) | Receipts, the Tatum block: gRPC and data counts. | Read through Tatum | H | |
| 2:20-2:30 | "Markets forget. Grudge doesn't." (4) | Close: the mark and the live URL, held. | grudge-l19c.onrender.com | D | Music resolves; ends clean on the cut |

**VO total:** about 189 words over 150 s (76 wpm), against a 150 wpm ceiling. The silent beats (0:03, 0:14, 1:05, 2:08) are on purpose: the payoff and each on-chain proof get air.

## Hook and close (copywriting pass)

- **Hook, chosen:** "Polymarket said {51}% up. Bitcoin went down. Noted." It is the copy bank's wrong-call line, proven on screen in the same 3 seconds. Alternatives: "Polymarket called this window wrong. Grudge wrote it down." (the old script's line, slower to the point); "Polymarket was wrong at {09:15}. Grudge will remember." (adds a time but explains itself).
- **Close, chosen:** the motto spoken once, over the URL. The motto was on screen silently at 0:06, so the close completes it in voice and the VO never reads the screen aloud. Alternatives: "Every grudge is a Walrus blob. Grudge is live." (repeats 0:50); "Polymarket's trust: {0.06}. Still counting." (funnier, but it names a third party as the last word).

## Honesty pass

| Claim or shot | Status | Label |
| --- | --- | --- |
| Wrong call at 0:00 | Real. Wait for a live window Polymarket gets wrong; never stage it | none |
| Wipe and rebuild, 0:06-0:28 | Real production call (`POST /api/admin/amnesia`), filmed last per the recording checklist; the refill is shown at real speed | none |
| Lock to resolve, 0:38-0:50 | Real, but the minutes between lock and resolve are cut out. A cut is not a speed-up; the Board's own times stay on screen so the jump is visible | none needed; the times show it |
| Memory count, gap 0, learning numbers | Real, read off the live page in the take | none |
| x402 purchase | Real mainnet USDC payment by our own agent script; the payer is our wallet, not a customer | VO says "agents can", not "agents do" |
| The Crowd | Its 4 picks are the owner's; on screen it may show no call | VO names it as a voice and claims nothing about its activity |
| Learning claim | Grudge beats a plain average but not its best source; the VO says both | none |
| Kalshi | On the 15m tab only (checked 09:20 UTC: 15m has DeepBook, Polymarket, Kalshi, Crowd) | Film the 0:28 pan on the 15m tab |
| Tatum line | Verified: `src/server/tatum/sui.ts` is used by the DeepBook voice and by x402 payment checks. The on-screen count runs from the last server restart, so the VO gives no number | none |
| AI voiceover | Synthetic voice | Credit it in the YouTube description and CREDITS.md; no on-screen label |

## Open for the owner

- **The agent loop looks stopped:** `/api/receipts` lists 4 settled payments, the last at 2026-11-09 10:53 UTC, though the handoff says it buys every 30 minutes. The 1:55 beat needs a fresh on-camera `pnpm agent` purchase anyway; whether to restart the loop before judging is a separate call.
- Humanizer pass skipped (owner's standing choice, 2026-11-09).
