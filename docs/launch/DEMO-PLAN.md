# Live demo plan

Numbers: `docs/research/raw/facts-2026-11-09.md`. Re-read the live page before going on.

## Happy path

1. Open [LIVE URL]. Say the line: markets forget, Grudge doesn't. Point at the 5m tab and a struck wrong call.
2. Show the disagreement entry and its recalled lesson. Click the receipt tick to open Walruscan.
3. Open `/receipts`. Read the memory counts off the page.
4. Press "Rebuild from Walrus and compare". Wait for the result; the gap should read 0.
5. Run amnesia with the admin token. Return to the board and watch it refill. Say what was restored.
6. Show the learning chart. State the claim as it is: slightly ahead of an equal-weight average, not statistically clear, and level with the best single source.
7. Open `/agents`. Run `pnpm agent` in a terminal. Open the Suiscan digest.
8. If a window locks during the demo, stay on the board and let it resolve.
9. Close on [REPO URL] and [BLOG URL].

Time: five minutes. Cut step 8 first.

## Offline fallback

If Render is down:
- Play [VIDEO URL] from a local copy of the file.
- Open the Walruscan pages saved in tabs. Walrus is independent of Render.
- Show saved copies of `GET /api/board` and `GET /api/receipts`, captured before the demo and labeled with their capture time.

If Tatum is down:
- The board keeps serving the last windows but goes stale. Point at the stale-data state; say so.
- Skip step 7. Show the saved Suiscan page for the settled payment.

If Walrus is slow:
- Show the last memory check result from the recording. Do not press the button twice.

If the venues are DNS-blocked on the machine, turn on DNS-over-HTTPS (1.1.1.1) or a VPN.

## Pre-demo checklist

- [ ] `GET /api/health` returns 200 on [LIVE URL]
- [ ] Admin token available, not on screen
- [ ] Amnesia dry run done within the last day
- [ ] Agent wallet funded; `pnpm agent` runs
- [ ] Walruscan and Suiscan tabs open
- [ ] Local copy of the video; fresh saved copies of `/api/board` and `/api/receipts`
- [ ] Learning numbers recomputed from `/api/receipts`
- [ ] DNS-over-HTTPS or VPN on
- [ ] Notifications off, zoom 100%
- [ ] No "zero gas" in notes
