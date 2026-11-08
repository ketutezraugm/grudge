# API

Public HTTP API. Only endpoints that exist are listed.

## `GET /api/health`
Render's health check. `200 {"ok":true,"running":true,"lastTickAgeMs":n}` while the worker has finished a pass in the last minute, `503` otherwise.

## `POST /api/verify-memory`
Public and read-only. Rebuilds the trust weights from Walrus alone and compares them with the live scoreboard. Callers within a minute of the last check receive that check, so the Walrus read budget is spent at most twice a minute.

`200`:
```json
{
  "checkedAt": "2026-11-08T06:43:11.185Z",
  "maxDifference": 0,
  "waiting": 0,
  "snapshotSeq": 4,
  "snapshotBlobId": "iBv15mp0…",
  "recordBlobIds": ["65PshS9R…", "…"],
  "recordsRead": 4,
  "rebuilt": { "btc-5m": { "deepbook": { "loss": 0.134, "count": 1.98 } } },
  "live":    { "btc-5m": { "deepbook": { "loss": 0.134, "count": 1.98 } } }
}
```
`maxDifference` is the largest gap in any loss or count; 0 means Walrus alone reproduces the live weights. `waiting` counts memories not yet written to Walrus, which can make a gap temporary. `502` if Walrus does not answer.

## `POST /api/admin/amnesia`
Admin only: `Authorization: Bearer <ADMIN_TOKEN>`, otherwise `401`. Wipes the learned state and rebuilds it from Walrus (see `ARCHITECTURE.md`, memory flow step 4).

`200`: `{ "before": 5, "restored": 5, "windows": 4, "lessons": 0, "maxDifference": 0, "identical": true }` (`lessons` counts the lessons put back, newest 20 at most)
`409 {"error": "…"}` when the wipe was refused (memories not yet on Walrus, Walrus does not reproduce the live weights, or amnesia is already running). Nothing was deleted.

## `GET /api/board`
Everything the board shows. Pollers share one set of queries (at most 3 s stale), and the Bitcoin price is read from Tatum at most every 5 minutes.

```json
{
  "asOf": "2026-11-08T07:16:35Z",
  "workerAgeMs": 2100,
  "bitcoinUsd": 75772.42,
  "yourPicks": { "btc-5m": null, "btc-15m": 0.8 },
  "categories": {
    "btc-15m": {
      "open":   { "id": "btc-15m:1794123000", "startsAt": "…", "endsAt": "…", "lockAt": "…" },
      "locked": { "id": "btc-15m:1794122100", "startsAt": "…", "endsAt": "…", "strike": 75727.79,
                  "line": 0.68, "calls": { "deepbook": 0.60, "polymarket": 0.745, "kalshi": 0.685 },
                  "disagreement": 0.144, "disagrees": true, "confidence": 0.013, "priceAtomic": "11000" },
      "voices": [{ "voice": "kalshi", "name": "Kalshi", "call": 0.685, "weight": 0.33,
                   "loss": 0.032, "samples": 1.98, "marks": ["right", "right"] }],
      "resolved": 2,
      "lesson": { "text": "…", "at": "…", "blobId": "…" },
      "ledger": [{ "id": "…", "endsAt": "…", "state": "resolved", "outcome": 1, "split": false, "line": 0.82,
                   "calls": { "kalshi": { "p": 0.895, "mark": "right" } }, "blobId": "4wrX1g6t…" }]
    },
    "btc-5m": { "…": "same shape" }
  }
}
```
- `open` is the window still taking picks (null if none); `locked` is the newest window whose calls are frozen and whose result is pending (null if none). Probabilities are the chance the window ends at or above where it started.
- `weight` is the voice's share of the line. `marks` are its last 10 scored calls, oldest first. `priceAtomic` is the x402 price in USDC's six decimals, as a string.
- `lesson` is the newest lesson for the category, or null. `ledger` is the last 20 windows with a result, newest first, without windows given up at lock. `blobId` is the Walrus memory (Walruscan link) or null while still queued.
- `yourPicks` is the visitor's own pick (probability of up) on each open window, read from the `grudge_visitor` cookie.

## `POST /api/pick`
Body `{ "question": "btc-15m:1794123000", "direction": "up" | "down", "confidence": 55 | 65 | 80 | 95 }`. Sets the `grudge_visitor` cookie on the first pick. `200 { question, p }`; `400` for a bad body; `409` when the window is locked or this visitor already picked it. The Crowd voice at lock is the mean of the window's picks.
