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
Body `{ "question": "btc-15m:1794123000", "direction": "up" | "down", "confidence": 55 | 65 | 80 | 95 }`. Sets the `grudge_visitor` cookie on the first pick. `200 { question, p }`; `400` for a bad body; `409` when the window is locked or this visitor already picked it. The Crowd voice at lock is the mean of the window's picks. `429` after 3 picks from one address on a window (the address is the visitor's, read from `X-Forwarded-For` behind Cloudflare and Render).

## `GET /api/consensus?category=btc-5m|btc-15m` (x402)
Grudge's trust-weighted call for one category, paid per request in USDC on Sui (x402 v2, scheme `exact`, network `sui:mainnet`). Settled through Tatum gRPC; gasless for the buyer, who needs no SUI. `400` for an unknown category, `503` before any window has locked.

1. **Ask.** No payment header: `402` with the terms in the body and, base64, in the `PAYMENT-REQUIRED` header. `accepts[0]` is `{ scheme: "exact", network: "sui:mainnet", amount, asset: <USDC type>, payTo: <treasury>, maxTimeoutSeconds: 120, extra: { quote } }`. `amount` is atomic USDC (6 decimals), 10000 to 50000, and rises with Grudge's confidence. `extra.quote` is a signed price that holds for 120 seconds.
2. **Pay.** Build a transaction that sends exactly `amount` of the asset to `payTo` with `0x2::balance::send_funds` (gasless), sign it, and send `PAYMENT-SIGNATURE: base64({ x402Version: 2, accepted: <the terms, unchanged>, payload: { signature, transaction } })`, where `transaction` is the base64 transaction bytes.
3. **Receive.** `200` with the consensus and `PAYMENT-RESPONSE: base64({ success, transaction: <digest>, network, payer })`.

The server checks in this order: header shape, quote signature and expiry, that the terms are exactly those offered, the signature over the transaction, a simulation through Tatum, that the treasury receives exactly `amount` USDC, then claims the digest (a used digest returns `402`, "this payment was already used") and executes. Nothing executes until every check has passed. Any refusal returns a fresh `402` whose `error` names the reason. At most 20 payment attempts a minute reach the chain across all callers.

`200` body:
```json
{
  "question": "btc-5m:1794151500",
  "category": "btc-5m",
  "grudgeLine": 0.74,
  "calls": { "deepbook": 0.777, "polymarket": 0.495 },
  "weights": { "deepbook": 0.844, "polymarket": 0.156 },
  "confidence": 0.713,
  "disagreement": 0.282,
  "lesson": { "text": "…", "at": "…", "blobId": "…", "url": "https://walruscan.com/mainnet/blob/…" },
  "receipts": {
    "walrus": [{ "question": "…", "blobId": "…", "url": "…" }],
    "sui": { "digest": "…", "url": "https://suiscan.xyz/mainnet/tx/…" }
  }
}
```
`pnpm agent` is a client that does steps 1 to 3 (see the header of `scripts/agent.mts`).
