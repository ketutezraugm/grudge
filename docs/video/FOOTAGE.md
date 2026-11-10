# Footage log (Phase V4, 2026-11-10)

Every take is the live production app (https://grudge-l19c.onrender.com), recorded by `video/capture/take.cjs <shot>` (shot scripts in `video/capture/shots.cjs`). Files in `video/capture/out/` (gitignored media): `<shot>.mp4` plus `<shot>.actions.json` (cursor path and marks, t in ms from the take's first frame, x/y in CSS px of the 1920x1080 viewport). Terminal runs are recorded by `video/capture/term.cjs` into `<shot>.term.json` (real output lines with timings) and set in the designed terminal panel.

**Format:** 3840x2160 (2x device pixels, so 1.6x push-ins stay sharp), H.264 CRF 14, 30 fps constant, keyframe every 30 frames, no audio. Built from Chrome's screencast (one JPEG per paint at quality 92, held until the next paint), because Playwright's recorder only gives CSS-pixel frames at 25 fps.

| Shot | Script beat | Duration (s) | What it shows | Notes |
| --- | --- | --- | --- | --- |
| s01-resolve-5m | 0:00 hook (and 0:38 resolve if needed) | 314.567 | Board, 5m tab, window `btc-5m:1794305400` (10:10-10:15 UTC) from its end to its result: **Polymarket wrong** (called 0.505 up, Bitcoin went down), DeepBook right (0.423). The result lands at about 309.5 s: Polymarket's record row takes an empty mark, DeepBook's a filled one, trust DeepBook 94% to 93%, Polymarket 6% to 7% | Use 300-314 s. Trust moved toward Polymarket (its Brier relative to DeepBook's), so the VO claims no direction. VO hook number: Polymarket's call reads 0.505; set "51%" or "50%" to what the ledger row shows |
| s06-voices-15m | 0:28 four voices | 14.000 | Board, 15m tab: DeepBook, Kalshi, Polymarket, the Crowd; countdown running | Still take; the composition pans |
| s08-receipts | 0:50 counts | 5.833 | Receipts: 520 records, 614 scoreboards, 29 lessons; pointer settles on the newest blob link | Taken before the wipe |
| s09-walruscan | 1:05 Walruscan | 9.033 | Walruscan mainnet page for blob `pLPZSOuJ…` (scoreboard-614), the blob s08 points at | Held still |
| s10-gap0 | 1:12 gap 0 | 14.867 | "Rebuild from Walrus and compare" pressed; result "Largest gap against the live weights: 0.000" | Read-only POST; result lands about 6 s after the press |
| s11-learning | 1:30 learning | 12.033 | "Is Grudge learning?" figures. 5m: Grudge 0.140, equal weights 0.157, DeepBook alone 0.139 (interval excludes zero vs equal weights). 15m: 0.128 / 0.133 / 0.120 | VO numbers come from this take |
| s14-tatum | 2:15 Tatum | 8.000 | Receipts Tatum block: 49 gRPC calls, 1 Data API call since the 09:42 deploy | Count resets on deploy |
| s07-resolve-15m | 0:38 resolve | 279.867 | Board, 15m tab, window `btc-15m:1794305700` from its end to its result (lands at about 273.9 s): outcome down, DeepBook, Polymarket and Kalshi all right | Use 268-280 s. All three right: the VO line ("each wrong call is marked") still holds for the record rows taking marks; s01 has a wrong call if one is wanted here |
| s07-lock-15m | 0:38 lock | 14.000 | Board, 15m tab, across a window's lock moment (rolled 6 s before `lockAt`) | Lock at about 6 s |
| s12-agent (terminal) | 1:55 agent | 2.6 s of output | `s12-agent.term.json`: real `pnpm agent` run at 10:36 UTC. Lines at 0.12 s (command), 1.24 s (`402: 0.047 USDC to 0x257c40ed…`), 2.61 s (`200`, Grudge line, the corrected lesson n=288, `settled: 4WorYido…`, the Suiscan URL). Panel shows the command as `pnpm agent` | Real mainnet USDC payment from our own agent wallet |
| s13-suiscan | 2:08 Suiscan | 9.033 | Suiscan page for tx `4WorYidoGj6HicCQpr44JAaHpssR5iJ8mUwJBSV3syHe`: Success, 10:36 UTC, **Total gas fee 0 SUI** (on-screen proof of "needs no SUI") | Same digest as the terminal |
| s03-wipe | 0:06-0:28 wipe | 41.467 | Board, 5m tab. Amnesia sent at 3.0 s; the Board clears at about 10 s ("No windows yet. Give it five minutes.", empty stations and chart) and refills at about 29 s with trust, records and the lesson ("Recalled from Walrus"). Response at 26.4 s: `200 {"before":7,"restored":7,"windows":123,"lessons":20,"maxDifference":0,"identical":true}` | Filmed last (10:37 UTC). The cleared stretch is about 18 s; the edit shows 6 s of it (a cut, not a speed-up). Terminal panel shows `curl -X POST …/api/admin/amnesia` without the token, then the real response |

The first agent run at 10:16 UTC (tx `6B7ri5Y4mPD3F5SEFoS5qpWR5f3uuTroKpC63NrbraRD`, 0.047 USDC, real) printed the pre-fix "Crowd was closer 100%" lesson, so its output is not used. Total spent on camera: 0.094 USDC.

**Audio:** voiceover voice locked: Kokoro `af_heart` (owner's blind pick of three, 10:40 UTC), generated locally by `npx hyperframes tts` with `HYPERFRAMES_PYTHON=video/.venv/Scripts/python.exe`.
