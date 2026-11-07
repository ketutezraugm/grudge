# Research archive (2026-11-07)

Background for decisions. The facts the build depends on are distilled in PRD §4; this file keeps the competitive picture and sources.

## Hackathon

- **Total Recall** (Walrus x Tatum): build window 20 Oct – 10 Nov 2026, submissions close 17:00 UTC Nov 10, judging 11–16 Nov, winners announced 17 Nov.
- **Prizes:** each track pays $500 / $300 / $200. Specials: Best Walrus Memory $500, Best Tatum AI Builder $500, Best Agent Payments (x402 or MPP settled on Sui) $500.
- **Judging:** 30% Walrus + Tatum integration, 30% technical quality, 20% creativity, 20% presentation. Bonus for X/LinkedIn posts.
- **Requirements:**
  - Mainnet Walrus Memory with ≥ 10 memories.
  - Tatum RPC for onchain data.
  - A published blog post that covers how the project learned over time.
  - A demo and a public repo.
  - A 2–3 min video (per the draft rules repo).
- **Form fields:** Tatum account ID, Sui address, `MEMWAL_AGENT_ID`.
- **Rules notes:**
  - "One submission per person."
  - "Do not copy the brief verbatim."
  - Existing projects are allowed if the work in the window is new.
- **Sources:** tatum.io/hackathon/total-recall, recall-tatum-walrus.vercel.app, github.com/tatummarketing/total-recall-hackathon (`src/lib/content.ts`).

## Competitive landscape (~150 repos)

- Each track has roughly 40–50 entries.
- The top entries have 100–360 commits, real mainnet transactions, ablations and live demos.

**Strongest threats**

| Repo                                      | Track                  | Edge                                                                                                                              |
| ----------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| UyLeQuoc/walrus-session-10-remora         | T2 + Memory + Payments | 360 memories, own x402 facilitator, Tatum gRPC everywhere, 248 tests; payments mostly on testnet, video and blog are placeholders |
| PugarHuda/invoice-chaser                  | T3 + AI Builder + MPP  | Per-client memory namespaces, Tatum re-verification, video, deck, error falling 4→0 days                                          |
| ramakrishnanhulk20/ellai                  | T2 + Payments          | Native Sui allowance, "questions asked" chart falling, mainnet USDC, proof page                                                   |
| RaYYeR220/quits                           | T3 + Payments          | Eval harness (90/90), x402 + MPP, Tatum checkpoint stream + exchange-rate API                                                     |
| Maveri-Q/total-recall-hackathon (Vernier) | T1                     | Bookmakers vs Polymarket, Brier, Tatum gRPC                                                                                       |
| SammyCodes1/Veto · ALIPHATICHYD/RECEIPTS  | T1                     | Bookmaker vs prediction-market comparisons                                                                                        |
| nikola0x0/kdace                           | T1                     | LoL Worlds picks committed on Sui                                                                                                 |
| valeriusxix/Tuition                       | T1                     | Memory on/off Brier experiment                                                                                                    |

**Clichés:**

- "The pick journal that remembers who was right" (3× Hindsight, 3× Receipts).
- Bill splitting.
- Safe-to-spend.
- Pre-sign wallet guards.
- Agent allowances + x402 (~23 payment entries).
- Memory firewalls.
- "Memory ON vs OFF" charts are now table stakes.

**Gaps we exploit:**

- No entry compares against an _onchain Sui_ odds source; DeepBook Predict is unused.
- Few use Tatum beyond basic RPC.
- Several leaders are testnet-only for payments or have placeholder videos.

**What past Walrus/Sui hackathons rewarded:** AI plus verifiability or auditability (TradeArena, Kraterion, Carry, Praxis, Sup Wallet). In short, safety and proof around autonomous money and memory.

## Sources

- Walrus Memory: docs.wal.app/walrus-memory, github.com/MystenLabs/walrus-memory (SKILL.md, docs/, rate_limit.rs)
- Tatum: docs.tatum.io (sui-grpc, migration guide, plans-limits, exchange rate)
- DeepBook Predict: docs.sui.io/onchain-finance/deepbook-predict, unpkg.com/@mysten/deepbook-v3@2.11.1/PREDICT.md
- Gasless transfers: docs.sui.io/develop/transaction-payment/gasless-stablecoin-transfers
- x402: github.com/x402-foundation/x402 (specs/x402-specification-v2.md, transports-v2/http.md, schemes/exact/scheme_exact_sui.md)
- Polymarket Gamma: gamma-api.polymarket.com; Kalshi: api.elections.kalshi.com/trade-api/v2
