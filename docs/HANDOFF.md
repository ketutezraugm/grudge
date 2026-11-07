# Handoff

> Living state of the build. Overwritten (not appended) by `/handoff`. A new session reads this first, then the PRD sections named under **Next**.
> Last updated: 2026-11-07 14:00 UTC · Session 1 (planning done, build starting)

## Now

- **Phase:** Day 0. Planning is complete and approved. Docs are up to date. Code has not been started.
- **Next gate:** GATE 1 at 16:00 UTC Nov 7. `pnpm probe` must be green on mainnet via Tatum (PRD §12).
- **Deadline:** submissions close 2026-11-10 17:00 UTC. Our own cutoff is 14:00 UTC.
- **Visual world:** Grudge Book (paper, ink, red pencil). The dark/neon v1 is retired. See `docs/brand-guidelines.md` (v2) and PRD §15.

## Done

- Research: hackathon rules, ~150 competitors, Walrus Memory SDK, Tatum Sui, x402 v2 Sui spec, DeepBook Predict, Polymarket, Kalshi. Verified live → PRD §4, `docs/RESEARCH.md`.
- Plan review: Tatum's gRPC method list confirmed, DeepBook market lead times measured, SDK APIs for x402 confirmed. Findings are in PRD §4 and `docs/DECISIONS.md`.
- Docs: `docs/PRD.md` (spec, schedule, §15 authenticity + packaging), `docs/brand-guidelines.md` v2, `docs/DECISIONS.md`, `docs/RESEARCH.md`, `CLAUDE.md`, `assets/tokens.css`, `assets/logo-mark.svg`.
- Session system: the `handoff` skill, the SessionStart hook that prints this file, and `attribution` blanked in `.claude/settings.json`.

## Next (in order)

1. **Scaffold** (PRD §7–8): `create-next-app@16.4.5` with TypeScript + Tailwind + Biome + App Router + `src/`. Pin the versions in PRD §7. Add strict `tsconfig`, `src/server/env.ts`, `src/server/log.ts`, the Drizzle schema (PRD §8.1) with its first migration, `.env.example`, `.gitignore`, `git init`, and a first commit.
   Done when `pnpm build`, `pnpm lint` and `pnpm typecheck` all pass on an empty board page.
2. **Tatum Sui client** (`src/server/sui/transport.ts`, `client.ts`): a `ThrottledTransport` wrapping `GrpcTransport`, plus the `predict` extension.
   Done when a DeepBook `read.markets()` call goes through Tatum.
3. **Sources** (`src/server/sources/*`) and **`scripts/probe.ts`**.
   Done when the probe prints a fresh DeepBook probability (asOf < 30 s), Polymarket and Kalshi calls, the BTC rate, one Walrus `blob_id`, and the Tatum call count. That is **GATE 1**.
4. Continue with PRD §12, Day 0 from 16:00: engine (TDD), worker, memory outbox, then a bare deploy by GATE 2.

## Waiting on the user

- [ ] Tatum API key + dashboard account ID
- [ ] Walrus Memory mainnet: account ID, delegate private key, `MEMWAL_AGENT_ID` (public key)
- [ ] A wallet with about 0.5 SUI (Walrus Memory account creation may need gas)
- [ ] Treasury Sui address (receive only) and an agent payer keypair holding about 1 USDC (needs no SUI)
- [ ] Supabase project in `eu-central-1`: session-pooler `DATABASE_URL`
- [ ] Render account (Starter plan, $7/mo; approved?) and the GitHub repo `grudge`
- [ ] Windows DNS-over-HTTPS on (1.1.1.1) so Polymarket and Kalshi resolve locally
- [ ] Decide on a paid Tatum plan after the probe measures credit burn

Secrets go in `.env.local` only, never in docs or chat.

## Gotchas learned

- Gamma `markets?slug=` returns open markets only; add `&closed=true` for resolved ones. Resolution lands about 80 s after the window ends.
- DeepBook mainnet has 1m and 5m markets only. `referencePrice` is `null` until the window opens, but `pricer()` still works then. The 5m market for T is listed 6.5–10 min ahead.
- Local `curl` to Polymarket and Kalshi needs `--doh-url https://1.1.1.1/dns-query`.
- The Walrus Memory relayer picks its own Sui RPC; it can't be routed through Tatum.
- `create-next-app` pins TypeScript `^5`. Use 5.9.3, not 7.x.
- `postgres` 4.x is days old. Use 3.4.9.

## Open questions

- Does `GrpcTransport`'s `meta` option attach `x-api-key` to every call? The probe decides. Fallback: a metadata-generator credential.
- What does a Tatum gRPC call cost in credits? The probe plus the Tatum dashboard decide.
- The `btc-5m` void rate (only two venues resolve) needs measuring overnight. Above 15%, use DeepBook settlement as the tie-break.
