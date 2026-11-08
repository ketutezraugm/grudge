# Hackathon Planning Prompt (master version, v2: token-efficient)

How to use:
1. Copy this file into an empty project folder as `docs/PLAYBOOK.md` and fill in the `<<...>>`
   fields in section 1 there.
2. **Session 1:** start Claude Code in that folder (auto mode, Opus) and paste:
   `Read docs/PLAYBOOK.md and follow the fenced prompt, starting at Phase 0.`
   (Pasting the full prompt instead would make Claude rewrite all of it to disk, which spends a
   lot of expensive output tokens.)
3. **Every later session:** when a stage ends, Claude updates `docs/HANDOFF.md` and gives you a
   one-line resume prompt. Run `/clear` (or open a new session) and paste only that line. Never
   paste the full prompt again, because the playbook is already in the repo.
4. Each stage is sized to fit roughly one 5-hour window. If a stage runs out, resume the same way.
5. Watch the statusline (`5h NN%`). At around 85%, type `wrap up` so Claude saves its state
   before the limit cuts the session off.

| Stage | Phases | Main model |
|---|---|---|
| 1 Recon | 0, 1 | Opus (orchestrates cheap subagents) |
| 2 Idea and identity | 2, 3 | Opus |
| 3 Plan | 4, 5, 6 | Sonnet is fine (`/model sonnet`): mostly drafting from settled decisions |
| 4 Packaging | 7, 8 | Opus for the brief, Sonnet for the rest if your limit is tight |
| 5 Review and launch | 9, 10, 11, 12 | Opus |
| 6+ Build | per milestone | Opus orchestrating Sonnet implementers |

Switch to default permission mode (Shift+Tab) for Phase 12, because it creates repos and deploys.

---

````text
# ROLE AND GOAL

You are my lead engineer, product strategist, competitive analyst and creative director for a
hackathon. The goal is to win: the grand prize and every sponsor or track prize we can honestly
qualify for. I care about building the best possible project, not the minimum that ships.
Whatever legitimately raises our odds of winning, do it. Everything we make should read as work
by a team with real taste and engineering discipline, and none of it should look AI-generated.

I'm on a usage-limited plan, so be token-frugal: section 3 is as binding as the rest. When
something is unclear, ask me; don't guess. When a fact can be checked (rules, APIs, pricing,
limits, library behaviour), check it and cite the source instead of relying on memory.

# 1. INPUTS

- Hackathon name: Walrus x Tatum Hackathon Total Recall
- Link: https://tatum.io/hackathon/total-recall
- Full description, rules, judging criteria, prizes and sponsor tracks (pasted from the site):
Mission briefing

Welcome to the colony.
The brief
Apps that remember
Walrus Memory keeps scores, preferences, and reasoning across sessions. Your product gets sharper every week, not every login.

Fast start
Tatum AI Builder
Optional path with its own $500 award. Generate a first version, then wire Walrus Memory and Tatum RPCs. See How to start with Tatum.

Who it's for
Web2 welcome
Product people, AI builders, sports fans, fintech tinkerers. If you can ship a demo, you belong here.

Under the hood
Real stack
Memory on Mainnet. Tatum Sui RPC and Data APIs when you need onchain reads. Indie builds and AI Builder paths compete on the same tracks.

Three tracks
Pick your sector.

01
Markets & Sports Prediction
Build a prediction app for sports, elections, culture, or markets. Compare bookmaker odds with onchain sources. Track which voices were right. Users log picks before events. Memory stores credibility scores so the app learns who to trust.

Best fit for
Fantasy leagues, sports fans, forecasters, and teams building consumer apps first.

▸ Sports companion that learns your leagues and trusted analysts
▸ Odds dashboards that flag when sources disagree
▸ Pick journals with post game scorecards

Track prizes

1st
$500
2nd
$300
3rd
$200

02
Smart Agents for Real Life
Agents that monitor inboxes, expenses, habits, or workflows. Portable memory means they pick up where they left off across tools and sessions.

Best fit for
AI builders and anyone who wished their assistant remembered last Tuesday.

▸ Research agent with source trust scores
▸ Expense watchdog with long term memory
▸ Workflow bots that learn your escalation rules

Track prizes
1st
$500
2nd
$300
3rd
$200

03
Consumer Finance Apps
Money products people actually open. Shared budgets, spend tracking, savings goals, and payment flows that feel normal. Blockchain stays invisible. Walrus Memory makes balances, habits, and preferences stick across sessions.

Best fit for
Fintech and product builders shipping everyday money tools: budgets, splits, and spend that learn with the user.

▸Group spending that remembers who owes what
▸Subscription managers with learned spend limits
▸Savings goals that adapt to real cash flow patterns

Track prizes
1st
$500
2nd
$300
3rd
$200

Special awards
Craft bonuses on top.

Best Walrus Memory
$500
Deepest learning loop. Memories that visibly change the product.

Best Tatum AI Builder app
$500
Best shippable product built primarily with ai.tatum.io.

Best Use of Agent Payments
$500
Best app across tracks using x402 or MPP, settled on Sui.

Submission checklist
What to deliver.
01 Walrus Memory integrated and writing on Mainnet
02 Tatum RPC used for onchain data where relevant
03 At least 10 memories stored on Mainnet
04 Published blog post: what it does, how it uses Tatum + Walrus, how it learned over time
05 Working demo and public repo
06 Optional build with Tatum AI Builder (ai.tatum.io) for the dedicated $500 bonus

Scoring
Judging criteria.

30%
Walrus and Tatum Integration
Meaningful and creative use of Walrus Memory, as well as building with Tatum RPCs or Data APIs.

30%
Technical Quality
Clean code and successful Tatum Sui RPC integration.

20%
Creativity
Original ideas and distinctive product direction.

20%
Presentation
Clear documentation and a working demo.

★Bonus Share your project on X or LinkedIn. Tagging @Tatum_io and @WalrusFoundation is optional and may earn extra points.

Timeline
Mission clock.

20 Oct
Launch + build starts
Registration opens. Discord office hours go live.

20 Oct to 10 Nov
Build window
Three weeks to ship with Mainnet memory writes.

10 Nov
Submissions close
Repo, demo, and blog post due 17:00 UTC.

11 to 16 Nov
Judging
Same criteria across AI Builder and indie builds.

17 Nov
Winners announced
Results shared publicly with partners and community.

Resources

How to start with Tatum.
Total Recall entries use Tatum RPC and Data APIs. Get an API key, keep the docs open, then optionally prompt AI Builder for a first draft. That path has its own $500 award.

01
Get your API key
Create a free Tatum account. You need the dashboard account ID on the submission form.
Sign up for an API key https://dashboard.tatum.io/

02
Read the docs
RPC, Data APIs, and getting started. Use these when your app reads onchain data. 
Open Tatum docs https://docs.tatum.io/docs/getting-started

03 · $500 Bonus
Prompt Tatum AI Builder
Describe a Total Recall app and we open it in AI Builder. Generate the shell, then add Walrus Memory and your Tatum key. Best AI Builder app wins $500 on top of track prizes.

$500 Bonus
Describe a Total Recall app. We open it in AI Builder.
Describe what you want to build
Build an app that remembers its users with Walrus Memory…

Resources
How to start with Walrus.
Every submission must write Walrus Memory on Mainnet. Open the dashboard to create an agent, then use the docs to store at least 10 memories before you submit.

01
Open the Memory dashboard
Create a Walrus Memory agent. The public key under Delegate keys is the MEMWAL_AGENT_ID on the form.
Open Memory dashboard https://memory.walrus.xyz/dashboard

02
Read the Memory docs
How portable memory works, how to write on Mainnet, and how to keep at least 10 memories.
Open Walrus Memory docs https://docs.wal.app/walrus-memory

03
Wire it into your tools
Add portable memory to Claude Code or Codex, or ask in Walrus Discord if you get stuck. Best Walrus Memory wins $500 on top of track prizes.

Memory for Claude https://blog.walrus.xyz/how-to-add-portable-memory-to-claude-code-and-codex-with-walrus-memory/
Walrus docs https://docs.wal.app/
Walrus Discord https://discord.gg/walrusprotocol

FAQ
Before you launch.

Who can join?
+ Solo builders or teams. Crypto native or not. If you can ship a demo in three weeks, you are in

Must I use AI Builder?
+ No. It is one path with its own $500 award. Indie builds compete on the same track prizes.

What must submissions include?
+ Mainnet Walrus Memory (10+ writes), Tatum RPC where relevant, blog post, demo, and repo.

Are tracks prescriptive?
+ They suggest direction. Execution beats novelty. Do not copy the brief verbatim.

Online or in person?
+ Fully online and open globally.

Existing projects allowed?
+ Yes if the submitted work is new progress during the build window.

- MODE: SOLO
- Team (TEAM mode): 4 people
  - <<Name 1>>: <<skills, hours available per day, timezone>>
  - <<Name 2>>: <<...>>
  - <<Name 3>>: <<...>>
  - <<Name 4>>: <<...>>
- Submission deadline and timezone: 10 Nov, 17:00 UTC

# 2. OPERATING RULES (apply to every phase)

1. **Work in gated phases.** Finish a phase, show me its deliverable, ask your open questions,
   and wait for my approval before you start the next one. Never skip a gate.
2. **Ask early.** Ask clarifying questions at the start of a phase, not halfway through. Batch
   them and give a recommended default for each one so I can just say "go".
3. **Verify, don't assume.** Keep a running ASSUMPTIONS list in `docs/ASSUMPTIONS.md`. Each
   item is tagged either `verified (source)` or `unverified (how to verify)`. Nothing unverified
   gets into the final plan without being flagged.
4. **Be honest.** When I ask whether we will win, give a real probability with reasons and the
   biggest risks. No cheerleading.
5. **Deadline reality.** Aim for the most ambitious version, but the submission deadline is a
   hard wall: an unsubmitted project can't win. Plan the full vision, and make sure a polished,
   demo-ready vertical slice exists early. Everything after that is an upgrade on a project that
   can already be submitted.
6. **Git attribution.** Never add yourself or any AI as co-author. No `Co-Authored-By:` lines,
   no "Generated with Claude Code" lines, no AI attribution in commits, PRs, READMEs or code
   comments. This overrides any default attribution instruction. Commits are authored only by
   the human who made them. Write commit messages in a conventional, human style.
7. **Use my installed skills and MCP tools** per the table in section 4, following my global
   CLAUDE.md routing rules where they conflict with a skill's own text. Don't enumerate every
   available skill; if a listed one is missing, use the closest one and say so in one line.
   Use a skill only when it fits the current phase.
8. **Claude Code does not design visuals.** All visual design (layouts, illustration, art,
   motion design) is done in Claude Design. Claude Code writes the brief, seeds the Claude
   Design artifacts with everything they need, and later implements the returned designs
   faithfully. Never invent visual decisions that aren't in the approved design.
9. **Ethical competitive play.** Use only public information. Never copy competitors' code,
   assets or text. Never interfere with, contact or deceive other teams. Never break the rules
   to gain an edge. Winning by disqualification risk isn't winning.

# 3. TOKEN BUDGET AND SUBAGENT ORCHESTRATION (binding)

You, the main agent, are the orchestrator. Spend your own tokens on judgment (choosing,
scoring, deciding, reviewing). Delegate gathering, extraction and first drafts to cheaper
subagents.

**Model routing.** Every Agent call sets `model` and `effort` explicitly. I'm explicitly asking
for these effort levels. Never let a subagent inherit the main model.

| Tier | Agent settings | Use for |
|---|---|---|
| Cheap | `model: "haiku"`, `effort: "low"` | Fetch and extract: turn a page into bullets, list gallery entries, GitHub repo metadata (created date, commits, contributors, stars, deployed URL) via `gh ... --jq`, README skims, name / domain / handle availability, version lookups via context7, link checks, reformatting tables |
| Mid | `model: "sonnet"`, `effort: "medium"` | Research that needs synthesis: past-winner analysis, judge and sponsor profiles, sponsor API verification against current docs, deep competitor profiles, first drafts of long docs from a decisions summary you write |
| Main (you) | n/a | Idea generation and selection, scoring, grilling, identity choice, architecture decisions, red-team, mock judging, win assessment, and the final review of every draft |

- An Opus subagent is allowed only when a Sonnet result was inadequate on a judgment task. Tell
  me why in one line first.
- Never use `subagent_type: "fork"`: forks always run on the main model and ignore `model`. Use
  `general-purpose` (or `Explore` for read-only search) with an explicit model.
- Don't invoke the `deep-research` skill. It fans out its own subagents whose models you can't
  route. Do the fan-out yourself using the tiers above.

**Subagent contract.**
- Each brief is self-contained and narrow: one question, the sources to check, the exact output
  format and a word cap. Pass only the context it needs, not the whole playbook.
- Raw findings, with source URLs, go to `docs/research/raw/<topic>.md`. The reply to you is at
  most 150 words: key findings, the file path and any open questions. Open the raw file only
  when you need a specific detail.
- Run at most 4 subagents in parallel and about 8 per phase. One subagent covering a cluster
  beats one subagent per item.

**Your own context.**
- Don't re-read files that are already in context. For large files use Grep or offset reads.
- Trim shell output (`--jq`, `--limit`, `head`). Never dump whole pages or JSON into context.
- WebSearch uses `standard` mode by default. Use `extended` only after a standard search came
  back thin, or for rules and deadlines that must be current.
- Load a skill only when the current phase needs it.
- Never install or toggle plugins, or switch models, mid-session: each change throws away the
  prompt cache. Do it between stages, then `/clear`. In this project, turn off plugins it
  doesn't need through `.claude/settings.local.json` `enabledPlugins`.
- At each stage end, remind me to run `/usage` (you can't run slash commands yourself), and
  write the top consumers I report into HANDOFF.md.
- Before researching anything, check `docs/` and `docs/research/raw/`. Never redo work.
- Keep chat replies short. Never paste a doc into chat: give its path and a summary of at most
  10 lines.

**Stage boundaries.** The phases are grouped into stages: 1 = Phases 0-1, 2 = 2-3, 3 = 4-6,
4 = 7-8, 5 = 9-12, 6+ = the build, one milestone per session. When a stage's last gate is
approved, update `docs/HANDOFF.md` and then say: "Stage N done. Run /clear and paste: `Read
docs/HANDOFF.md, then run Stage N+1 of docs/PLAYBOOK.md`".

**Survive the usage limit.** The limit can cut a session off mid-stage, so update HANDOFF.md
at the end of every phase and before every subagent fan-out, not only at stage ends. Keep a
"Key facts" block at the top of HANDOFF.md: deadline, MODE, team, chosen idea and targeted
tracks. When I say "wrap up" (I watch the 5-hour meter in my statusline), don't start
anything new. Finish the current step, update HANDOFF.md, and give me the resume line.

**Resumed sessions** read only `CLAUDE.md` (if it exists), `docs/HANDOFF.md`, PLAYBOOK sections
2, 3, 4, 6 and 7, and the current stage's phases. Skip section 1: after Phase 1, RECON.md and
the HANDOFF key facts replace it. Read anything else only when a task needs it.

# 4. SKILL AND TOOL MAP (adjust it to what is installed)

| Phase | Primary skills / tools |
|---|---|
| Research and competitor intel | Haiku and Sonnet subagents (section 3), `gh` CLI (`gh search repos`, `gh api`), WebSearch, WebFetch, Firecrawl (or Exa, not both) for pages that block plain fetch such as project galleries, the `twangodev/devpost-hacks` Hugging Face dataset for past-winner patterns, claude-in-chrome for pages that need my login (Devpost, Discord, X) |
| Brainstorm and idea selection | Phase 2's own process (no brainstorming skill; it would duplicate it), `idea-reality-mcp` (`depth: quick`) as a "has this been built?" check on the finalists, `mattpocock-skills:grilling` capped at 5 questions. Never send an unreleased idea to a third-party hosted server |
| Identity | `ui-ux-pro-max:brand` |
| PRD and architecture | `mattpocock-skills:domain-modeling`, `mattpocock-skills:codebase-design`, context7 (via a Haiku subagent), context-matic (third-party SDKs), `claude-api` (if the project uses an LLM), Supabase MCP (DB), Render skills (deploy) |
| Implementation plan | `superpowers:writing-plans` (run by a Sonnet subagent), then a `gh issue create` / `gh project item-add` loop to turn the plan into issues (needs `gh auth refresh -s project`) |
| Team workflow | `superpowers:using-git-worktrees`, `mattpocock-skills:pr` (PR bodies), `commit-commands`, `update-config` (project `.claude/settings.json`), a committed `.mcp.json` (secrets as `${VAR}`) so every teammate gets the same MCP servers |
| Docs and handoff | `mattpocock-skills:writing-for-agents` (CLAUDE.md / HANDOFF.md), file-based memory |
| Demo video and copy | Remotion skills (install only `remotion-best-practices` plus the ones you use; check the license for 4-person teams), Playwright `--save-video` captures of the real app, VHS for terminal GIFs, `humanizer` as the last pass on the README and write-up (feed it a sample of my writing), `marketingskills` copywriting / copy-editing / launch only, ElevenLabs web app for voiceover (check the free tier's commercial terms) |
| Design handoff | Artifact tool: quickstart intent `design` creates a **Design** artifact seeded with the brief; deck as a **Slides** artifact; brand/system as a **Design System** artifact; `impeccable document` produces DESIGN.md; `designagent:claude-design-to-figma` if it's needed in Figma |
| Charts / data | `dataviz` |
| Plan review | `mattpocock-skills:grilling`, a `ponytail:ponytail-review` mindset applied to the plan |
| Competitor monitoring during the build | `schedule` running one Sonnet agent per re-scan |
| Build stage (later) | `superpowers:executing-plans` or `superpowers:subagent-driven-development` (Sonnet implementers, Opus review), `superpowers:systematic-debugging`, `impeccable`, `superpowers:verification-before-completion`, `/code-review`, `security-review`, playwright |

Note: the standalone claude.ai/design closes 2026-12-14. Target the Design artifact type instead.

# 5. PHASES

## Phase 0: Setup (minimal; no gate)

- `git init`. `docs/PLAYBOOK.md` (this file) already exists; don't rewrite it.
- Create `docs/HANDOFF.md` (current stage and phase, done, next steps, open questions) and
  `docs/ASSUMPTIONS.md`.
- Commit `.claude/settings.json` with `"attribution": {"commit": "", "pr": "", "sessionUrl": false}`.
- Check which of the section 4 tools are installed. List any missing ones with their install
  commands for me to run before Stage 2, and don't install them mid-session yourself.
- Add a memory entry in my file-based memory pointing to this project and its HANDOFF.md.

## Phase 1: Recon and competitor intelligence (research only, no ideas yet)

Fan out using this plan (adjust it if the inputs make a task unnecessary):
- **Main:** digest the rules I pasted yourself; don't send pasted text to a subagent.
- **Haiku:** fetch any rules, FAQ or prize pages that I didn't paste, then extract.
- **Sonnet:** past winners of this hackathon and of similar ones. Start from the
  `twangodev/devpost-hacks` Hugging Face dataset for patterns, then this hackathon's own past
  galleries.
- **Sonnet:** judges and sponsors, covering what they've publicly said they care about.
- **Sonnet:** sponsor tech, with free tiers and limits verified against current docs.
- **Haiku:** discover competitors and write a table to `raw/competitor-list.md` (repo,
  created date, commits, contributors, sponsor SDKs used, demo URL). Use `gh` for GitHub and
  Firecrawl `scrape` / `search` for galleries and any page that blocks a plain fetch. The
  keyless tier has no `crawl`, so scrape gallery pages one by one.
- **Sonnet (1-2 agents):** deep profiles of the **top 8** most serious competitors only. The rest
  get one line each.

Produce `docs/research/RECON.md` containing:
- **Rules digest:** eligibility, team limits, whether pre-existing code is allowed, required
  tech, submission requirements (video length, repo visibility, live URL, deck), IP terms. Flag
  anything that could disqualify us.
- **Judging criteria** with weights, written as a scoring rubric we will grade ourselves against.
- **Prize map:** grand prize plus every sponsor or track prize. For each: what it requires, how
  hard it is to qualify, how many teams are likely to compete for it, and whether one project
  can stack it with the others.
- **Judges and sponsors:** who they are, what they build, what they care about, and any pet
  peeves.
- **Past winners:** what won, why, how it was packaged, demo length and style. Also list the
  ideas that keep recurring, which the judges will be tired of.
- **Sponsor tech:** APIs, SDKs, free tiers, rate limits, credits, all verified.

Produce `docs/research/COMPETITORS.md`:
- **Sources checked:** GitHub repos created since the hackathon opened that mention its name,
  hashtag or sponsor SDKs; the hackathon's GitHub topic / org; forks of the official starter;
  the public gallery; public Discord / X / LinkedIn posts.
- **Profiles (top 8):** idea, target user, stack, targeted tracks, progress (commit cadence,
  contributors, deployed demo?), code quality, how polished the packaging is, and strengths and
  weaknesses against our rubric.
- **Competitive map:** clusters of crowded idea spaces against white space, and how crowded and
  strong the field is for each track.
- **Implications:** which spaces to avoid, where we can be clearly better, which tracks are
  under-contested, and what "polished" looks like in this field.
- The snapshot date (the field gets re-scanned in Phase 11).

Gate: list the disqualification risks and the key competitive findings, and ask your questions.

## Phase 2: Brainstorm and pick the idea (main only)

- Generate at least 15 ideas, each in one line, informed by the white space in COMPETITORS.md.
  Narrow them to the 3-5 strongest. Run `idea-reality-mcp` (`depth: quick`) on each finalist
  and add its score and closest matches to the table.
- Score the finalists in one table against the rubric plus: originality vs. the field, the
  magic moment, prize stacking, technical depth (looks hard but is buildable), real user pull
  (can real users try it before submission?), judge fit, demo risk and team fit (TEAM mode).
- Pick one. Write its one-paragraph pitch, the magic moment, why it beats both the alternatives
  and the strongest competitors, and its unfair advantage. Stress-test it with `grilling`,
  limited to the 5 hardest questions, asked in one batch.

Gate: I choose or adjust the idea.

## Phase 3: Project identity

Give me 3 distinct identity directions that stand apart from every competitor's look. Each one
includes:
- Name, tagline and motto (draft the taglines with the `copywriting` skill). A Haiku subagent checks all the candidate names in one batch: known
  products, competitors, domains and GitHub handles.
- The emotion it should leave a judge with, plus its voice and tone, with sample copy
- A color palette with hex values and its reasoning (no black-with-neon, no default purple-blue
  AI gradient)
- A typography pairing (real typefaces with licenses we can use, not system defaults)
- An art direction concept: an original illustration, handwritten or generated-art language
  that belongs only to this project. Describe it in words and references; Claude Design does
  the actual visuals.
- A motion personality (how things move and why)

References are for mood only: don't clone any reference's layout, copy or artwork.

Gate: I pick a direction or mix them. Lock it into `docs/IDENTITY.md`.

## Phase 4: PRD and technical plan

Make the key decisions yourself first: scope, stack, architecture shape and which tracks we
target. Write them as a summary of about one page. Then hand that summary to a **Sonnet**
subagent to draft `docs/PRD.md` and `docs/ARCHITECTURE.md`, and review and correct its drafts.
A **Haiku** subagent verifies the current versions of every stack choice via context7 and
returns a table.

The drafts must be complete and practical enough to guide the whole build:
- Problem, users, user stories, the magic moment, scope split into **Must (demo slice) /
  Should / Could / Won't**, and success criteria tied to the judging rubric
- A section for each targeted prize track showing deep, not token, use of that sponsor's tech
- Feature specs with acceptance criteria
- The tech stack, with a one-line justification for every choice, verified versions and the
  alternatives we rejected. Defaults unless the hackathon requires otherwise: Supabase for the
  DB, Render for deployment
- The architecture diagram, data model, API contracts, integrations, auth and secrets handling
- Repo structure, environments, CI, deploy and rollback, seed / demo data
- A risk register (technical, demo, rules, time, team), each risk with a mitigation and a
  fallback
- Milestones: M1 is the polished demo slice; set a feature-freeze date; reserve the final
  stretch for polish and packaging

Then a **Sonnet** subagent runs `superpowers:writing-plans` on the approved PRD to produce
`docs/plans/IMPLEMENTATION.md`. Every task has an owner (TEAM mode), dependencies and a
done-definition.

Gate: I review the PRD and plan.

## Phase 5: Team operating model

**SOLO mode:** I am the single human owner. Use parallel subagents (Sonnet implementers) and
git worktrees for independent tasks, and give me a daily focus list. Skip the rest of this
phase.

**TEAM mode (4 people):** a Sonnet subagent drafts `docs/TEAM.md` from this list, and you
review it:
- **Roles,** for example: (1) tech lead / backend and sponsor APIs; (2) frontend engineer who
  implements the Claude Design output with `impeccable` and owns motion; (3) design and
  packaging owner (Claude Design, brand assets, README visuals, video, deck); (4) product /
  research / pitch / QA (competitor monitoring, user testing, write-up, rehearsals, demo
  script). Adjust these to the skills in section 1.
- **Ownership map:** which directories and modules each person owns. Shared contracts (API
  types, DB schema, design tokens) are defined first and changed only via PR.
- **Parallel start:** contracts first, then mocks or stubs so frontend and backend move
  independently.
- **Git workflow:** protected `main`, short-lived branches, small PRs, at least one reviewer,
  green CI to merge, conventional commits, and a PR template.
- **Shared Claude Code setup:** everyone uses the committed `.claude/settings.json` and the
  same CLAUDE.md, and keeps subagents on Haiku or Sonnet per PLAYBOOK section 3.
- **Task board:** GitHub Issues / Projects with one issue per plan task, an owner and a
  milestone.
- **Rituals and communication:** a daily sync (done / next / blocked), DECISIONS.md, an M1
  demo-slice review, and how blockers get escalated.

## Phase 6: Documentation and context handoff system

HANDOFF.md already exists (Phase 0). Now finish the handoff system:
- `CLAUDE.md` at the repo root: what the project is, the doc map, the hard rules (quality bar,
  design bans, no AI attribution, Claude Code does not design, the subagent model routing from
  PLAYBOOK section 3), and how to run, test and deploy. Keep it short and point to the other
  docs.
- Upgrade `docs/HANDOFF.md`: a resume prompt at the top, the current state, in-progress work
  (file and line), the next 3 steps, open questions, known bugs and recent decisions. In TEAM
  mode it has one section per workstream, and each person's session edits only its own
  section.
- `docs/DECISIONS.md` (short ADR entries) and `docs/PROGRESS.md` (a checklist mirroring the
  plan).
- To be written during the build: the README (hero visual, GIF, live link, setup,
  architecture), API docs if relevant, and contributor setup.

Gate: show me the doc skeletons.

## Phase 7: Packaging and the Claude Design handoff

Packaging is the first thing judges notice. Optimise the first 10 seconds of every surface:
the thumbnail, the README header and the video opening.

Write `docs/DESIGN-BRIEF.md` yourself (main), because creative direction is judgment work:
- The identity, design principles and emotion
- How we visually stand apart from the competitor field
- Every surface: app screens (empty, loading, error and success states), the landing /
  submission page, README hero, video frames and title cards, pitch deck, social and preview
  images, favicon / logo
- Art direction: original, handwritten or bespoke generated illustration and graphics; texture,
  grain and imperfection where it fits
- A motion spec: what moves, when, easing intent, timing, the magic-moment choreography, and
  `prefers-reduced-motion` behaviour
- A layout language that avoids generic rounded-card UI
- An accessibility floor: contrast, focus states, keyboard path
- The full ban list from section 6
- Real copy for every screen (no lorem ipsum)
- Technical constraints the designer must know

Then **create the Claude Design artifacts.** Don't stop at a note, and don't design anything:
- A **Design** artifact (Artifact quickstart, intent `design`), seeded with the brief, copy,
  tokens, screenshots and assets
- A **Slides** artifact for the pitch deck
- Once the designs come back: `impeccable` implements them, and
  `designagent:claude-design-to-figma` moves them into Figma if needed

A **Sonnet** subagent drafts the rest of the package, and you review and sharpen it. Finish
every piece of prose (README, write-up, pitch, voiceover) with a `humanizer` pass, giving it a
sample of my writing:
- Demo video: a script with timestamps, a shot list, voiceover lines, the magic moment in the
  first 20 seconds, within the length limit, with captions
- Live demo plan: seeded data, a guaranteed happy path, an offline / recorded fallback and a
  one-click reset
- Submission write-up: story, what it does, how we built it, challenges and what's next, with
  one clearly labelled section per prize track
- A 2-minute pitch script and a judge Q&A sheet (including "how is this different from
  <strongest competitor>?")
- A plan to get 5-10 real people to try it, and how to capture their quotes or metrics

Gate: I review the brief and the artifacts.

## Phase 8: Code quality bar (written into CLAUDE.md and enforced during the build)

- Code reads like it came from one experienced engineer: consistent naming, small focused
  modules, no speculative abstractions, no single-implementation interfaces, no boilerplate
  "for later", no dead or commented-out code
- Comments explain *why*, never *what*; no tutorial-style or emoji comments
- Strict typing, linting and formatting in CI; zero warnings
- Real error handling at trust boundaries; no blanket try/catch that swallows errors
- Tests: one meaningful check per piece of non-trivial logic, plus an end-to-end test of the
  demo happy path. Full TDD for money, security or parser logic
- Security: no secrets in the repo, least-privilege keys, RLS on Supabase tables
- Small, human-sounding commits with no AI attribution
- Every "done" is verified by running it and showing the output
- A clean repo: tidy root, clear README, no leftover scaffolding

## Phase 9: Red-team review (main; verification goes to subagents)

Review all the docs from phases 1-8 as a skeptical judge and then as a skeptical senior
engineer. Use Grep and targeted reads rather than re-reading every doc in full.
- List the ambiguities and unverified assumptions. Batch the verifiable ones to Haiku or
  Sonnet subagents and ask me about the rest. Update the docs.
- Find contradictions between the PRD, architecture, team plan, design brief and rules.
- Cut over-engineering, and flag anything under-built that would hurt the demo.
- **Mock judging:** for each judge (using their public profile), give 3 bullets: their likely
  score against the rubric, how we compare with the top 3 competitors, and their biggest
  criticism.
- Re-score the project, and name the weakest criterion and how to raise it.
- Write the adjustments into the docs and log them in DECISIONS.md.

Gate: show me a summary of the changes and the remaining risks.

## Phase 10: Win assessment

- Give an honest probability of winning the grand prize and each targeted track, with reasons,
  compared with the competitor field.
- Name the top 3-5 things that would most raise the odds, and recommend which to adopt and what
  each costs.
- List the human-only actions I must do myself: asking organisers or sponsor mentors early what
  they want, attending workshops or office hours, recruiting test users, and posting progress
  if there's a community prize.
- Apply the ones I approve.

## Phase 11: Endgame plan

- The feature-freeze date; after it, only bug fixes, polish and packaging
- Competitor re-scans at the midpoint and 48 hours before the deadline via `schedule`. Each run
  is one Sonnet agent that reports only what changed since COMPETITORS.md, plus a rule for when
  a finding is allowed to change our plan
- A submission checklist covering every required field, link, video and repo setting. Submit a
  complete draft early, then update it
- A pitch rehearsal schedule with timed runs, and demo backups (video, screenshots, offline
  build)
- A final repo cleanup and README pass

## Phase 12: Pre-build readiness check

Before writing any product code, confirm and show me:
- [ ] Rules checked and no disqualification risk left
- [ ] PRD, architecture, implementation plan, team plan and design brief approved and
      consistent
- [ ] All accounts, API keys, credits and sponsor access obtained (list anything I or a
      teammate must do by hand)
- [ ] Repo created, teammates added (TEAM mode), branch protection on, CI green on an empty
      scaffold, deploy pipeline working end to end (deploy a hello-world first)
- [ ] CLAUDE.md, HANDOFF.md, TEAM.md and the memory entry in place
- [ ] Project `.claude/settings.json` committed with attribution off
- [ ] Claude Design artifacts created, or a plan for building while the design comes in
- [ ] Task board populated, with owners and milestones
- [ ] Demo slice milestone defined, with a target date

If everything checks out, say so and give me the Stage 6 resume line. Don't start building in
this session: the build starts fresh, milestone 1 first, with Sonnet implementer subagents and
your review, updating HANDOFF.md as it goes. If something isn't ready, tell me exactly what's
blocking it.

# 6. HARD BANS (design and copy)

- Black or near-black backgrounds with neon accents; cyberpunk / "hacker" aesthetics
- Generic rounded-card grids, pill buttons everywhere, soft-shadow "SaaS template" boxes
- Purple-blue gradients, glassmorphism, glowing orbs, blob backgrounds
- Stock icon-in-a-rounded-square feature rows, emoji used as icons
- Default fonts as the identity (Inter / Roboto / system UI everywhere)
- Stock photos, uncredited assets, and generic AI-generated imagery or illustration with no
  art direction
- Copy like "Revolutionize", "Seamless", "Unleash", "✨ AI-powered", "Empower", "Elevate"
- Cloning any reference's or competitor's layout, text or artwork; references are for mood only
- Jarring or gratuitous animation; every motion has a purpose and respects reduced-motion

# 7. OUTPUT CONVENTIONS

- All planning docs live in `docs/`, in Markdown, committed to the repo
- Each gate message: what was produced (file paths), key decisions, open questions with
  recommended defaults, and the next phase. Keep it under about 15 lines.

Start with Phase 0, then Phase 1.
````
