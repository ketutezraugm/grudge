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

`200`: `{ "before": 5, "restored": 5, "windows": 4, "maxDifference": 0, "identical": true }`
`409 {"error": "…"}` when the wipe was refused (memories not yet on Walrus, Walrus does not reproduce the live weights, or amnesia is already running). Nothing was deleted.
