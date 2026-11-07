# Grudge

Walrus x Tatum "Total Recall" hackathon entry. Submission closes **2026-11-10 17:00 UTC**; our own cutoff is 14:00 UTC.

## Session protocol

- **Start:** the SessionStart hook prints `docs/HANDOFF.md`. Continue from its **Next** list, and read only the PRD sections it names.
- **Handoff:** run the `handoff` skill after every PRD gate, when context runs long, and before a session ends. `docs/HANDOFF.md` must always let a cold session continue.

## Documentation map

| Doc                        | Holds                                                                                 | Update when                                                               |
| -------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `docs/PRD.md`              | Spec: scope, verified facts (§4), architecture, stack, schedule, acceptance criteria  | Scope or design changes. Same commit as the code change.                  |
| `docs/HANDOFF.md`          | Live build state                                                                      | Every handoff (overwrite)                                                 |
| `docs/DECISIONS.md`        | Why we chose X over Y                                                                 | Any decision that changes what or how we build (append)                   |
| `docs/brand-guidelines.md` | Name, voice, colors, type, copy bank                                                  | Copy or visual changes                                                    |
| `docs/RESEARCH.md`         | Competitors, hackathon rules, sources                                                 | Rarely; new competitive intel                                             |
| `docs/ARCHITECTURE.md`     | As-built technical reference: modules, data flow, memory format, x402 flow, runbook   | A module lands or changes. Describe the code that exists, never the plan. |
| `docs/API.md`              | Public HTTP API, including the x402 flow for agents                                   | An endpoint's contract changes                                            |
| `README.md`                | Judge-facing overview, live links, how it uses Walrus and Tatum, learning results     | Day 2 draft; final on Day 3                                               |
| `docs/SUBMISSION.md`       | Ready-to-paste answers for every submission form field, plus 50- and 150-word pitches | Day 2; final on Day 3                                                     |
| `PRODUCT.md` / `DESIGN.md` | Design context for `impeccable` (created by `init` and `document`)                    | `init` on Day 0 evening; `document` after the UI is built                 |

`docs/ARCHITECTURE.md` and `docs/API.md` are created with the first code that needs them.

## Authenticity (PRD §15)

Nothing may read as generic AI output.

- **Visual:** Grudge Book (paper, ink, red pencil). Marks are hand-built SVG. No dark/neon, gradients, glows, emoji icons or default card grids. Run `impeccable` for any UI work.
- **Code:**
  - Domain vocabulary only: `voice`, `call`, `grudge`, `ledger`, `receipt`, `window`, `lock`, `resolve`.
  - No `utils`, `helpers`, `manager`, or wrapper services.
  - Tests assert behavior with real fixtures.
- **Writing:** no AI-tell phrasing (list in `docs/brand-guidelines.md` §5). Real numbers and moments. The user does a final pass on prose.

## Rules

- **Git:** commit messages and PR bodies are plain Conventional Commits authored by the user alone, with no AI co-author or "Generated with" lines. Project settings enforce this through `attribution`.
- TypeScript strict. Zod at every boundary. USDC is `bigint` atomic units. Types are explicit (`unknown`, then narrow).
- `src/server/engine/*` and `src/server/memory/codec.ts` stay pure (time is passed in) and fully tested. The x402 money path (`src/server/x402/*`) is written test-first.
- Comments explain why. Delete dead code; track follow-ups as GitHub issues.
- Secrets live only in `.env` and in `src/server/*` (`server-only`). Docs record whether a secret is set, never its value.
- Every Tatum gRPC call goes through `ThrottledTransport` (3 rps free plan).
- Walrus Memory writes go through the `memories` outbox and are flushed in bulk (≤ 20 items).

## Commands

`pnpm dev` · `pnpm build` · `pnpm test` · `pnpm lint` · `pnpm typecheck` · `pnpm probe` · `pnpm agent`

## Local network

Polymarket and Kalshi are DNS-blocked on the dev machine. Turn on Windows DNS-over-HTTPS (1.1.1.1) or a VPN. For `curl`, use `--doh-url https://1.1.1.1/dns-query`.
