# Past winners: comparable hackathons (research, 2026-11-08)

Public sources only. Organizer posts rarely state why a project won; "why" lines are marked **stated** or **inferred**. Prize amounts mostly not published per project. Not reachable/unverified: Coinbase Agents in Action winner list, Phemex/Skale recaps (connection refused/429), Notion handbooks (JS-rendered, no content), Walrus Sessions (403), `twangodev/devpost-hacks` (not tried), any earlier Tatum hackathon (none found).

## Winners

1. **Spectra** - Walrus Haulout 2025, AI x Data, 1st. Content moderation in a private, transparent AI environment. Why: judges said "innovation, technical execution, and potential to shape the future of data" (**stated**, generic). Memory/payments: none described. https://walrus.xyz/blog/haulout-hackathon-winners-2025/
2. **TradeArena** - Haulout, AI x Data, 3rd. AI models make real crypto trades; every decision and on-chain action logged on Walrus. Why (**inferred**): Walrus as an auditable record of agent behavior. Same source.
3. **Delphi** - Haulout, Provably Authentic, 3rd. Yes/no prediction market with oracle resolution. Only prediction-market placer found at Haulout; placed 3rd in a non-obvious track. Same source.
4. **KrillTube** - Haulout, Data Economy, 2nd. Pay-per-second video micropayments to creators. Payments as core mechanic. Same source.
5. **Suithetic** - Sui Overflow 2025, AI, 1st (prize band $7.5k-$30k per track, per-place not published). Verifiable LLM-made synthetic datasets stored on-chain plus a marketplace. Why (**inferred**): Walrus/Sui-native data product with a marketplace. Overflow ranking used community vote, judging and demo days (**stated**). https://www.sui.io/blog/2025-sui-overflow-hackathon-winners
6. **Magma Finance** - Overflow 2025, DeFi, 1st (per MEXC/PANews report, unconfirmed on official page). Modular vaults with AI rebalancing. https://www.mexc.com/news/28498
7. **Sup Wallet** - Sui Overflow 2026, The Agentic Web, 1st. Self-custodial wallet; agent trades and pays within limits you set once, never holds the key. Why (**inferred**): solves the trust problem of agents spending money. https://www.sui.io/blog/sui-overflow-2026-winners
8. **Quay** - Overflow 2026, DeFi & Payments, 1st. Web2 merchants accept crypto via existing QR codes; **live in Singapore**. Organizer's own "stands out": merchants need no crypto knowledge and it is already live. Same source.
9. **PIPS / Skew / Flicky** - Overflow 2026, DeepBook (prediction) track, 1st / 3rd / 4th. PIPS: 3D phone trading console, game-like. Skew: click the live volatility surface to mint that bet. Flicky: head-to-head swipe-YES/NO game, better reader wins the pot. 16 submissions built on DeepBook Predict. Pattern: interaction design beat plain market UIs. Same source.
10. **Capitola** - Solana Cypherpunk 2025, Consumer, 1st, $25k. Prediction-market meta-aggregator (Fora, a group-chat prediction protocol, took 3rd). https://blog.colosseum.com/announcing-the-winners-of-the-solana-cypherpunk-hackathon/
11. **MCPay** - Cypherpunk, Stablecoin, 1st, $25k. Open payment infrastructure joining MCP and x402; Corbits (x402 merchant dashboard) 2nd Infrastructure; Mercantill (agent banking) 4th. x402 appears as infrastructure, not demo toy. Same source.
12. **RequestTap** - SKALE SF Agentic Commerce x402 hackathon, Coinbase track 1st. Open-source x402 router for AI agents. https://skale.space/blog/san-francisco-agentic-commerce-x402-hackathon-recap-winners (via search snippet; page not fetched)
13. **Solana x402 hackathon partner-track winners**: Sentinel Agent, Galaksio, Learn Earn ("self-learning module"), ParallaxPay (agent marketplace). https://phemex.com/news/article/solana-x402-hackathon-announces-winners-in-micropayments-and-ai-41757 (snippet only)

Memory/learning specifically: no Haulout or Overflow winner was described as agent memory or learning from outcomes. Walrus was used as storage/audit log. Walrus Memory is newer (Walrus Sessions 2026, sources blocked), so a real memory entry is uncommon.

## (a) Patterns in what won
- Walrus used as the load-bearing layer (data marketplace, audit trail, archive), not a bolt-on.
- Agents + money with a trust story (limits, proofs, logs): Sup Wallet, TradeArena, Mercantill.
- Already working for real users: Quay (live), Brisk, Talise.
- Prediction markets win when the interaction is distinctive (PIPS, Skew, Flicky) or aggregate existing markets (Capitola).
- x402 wins as plumbing others can reuse (MCPay, RequestTap, Corbits), usually open source.

## (b) Packaging norms
Evidence is thin. Organizers' own text: submissions need a demo video link (DeepSurge guide, via search summary); demo days and community votes fed Overflow rankings. I could not confirm video length limits. Winner blurbs emphasize "live", "already in X", open source. Treat video length as unknown; check the Total Recall rules page.

## (c) Recurring ideas judges are likely tired of
Prediction market clones; AI trading bots on a chain; generic data/AI-training-data marketplaces (Suithetic, Hyvve, OpenGraph all in one top-4); "AI agent wallet"; storage marketplaces; micropayment video. Evidence: several of each appeared in single top-4 lists (inferred).

## (d) Implications for our entry
1. Make Walrus Memory the product, not storage: show the memory changing a later decision (source weight before/after a resolved call). No past winner did this, so it is the open lane.
2. Publish one verifiable record: every call, resolution and weight update readable from Walrus by anyone (TradeArena/perma.ws pattern), linked in the README.
3. Run it live with real settled markets and real numbers before the cutoff; "live" is the strongest recurring signal.
4. Make x402 the consumer-facing endpoint with a working agent client that pays and uses the consensus; keep the client open source (MCPay/RequestTap pattern).
5. Avoid the tired framing: don't pitch a prediction market or trading bot; pitch "which sources deserve trust", with a distinctive, hand-built interaction (Skew/Flicky show interaction design is rewarded).
