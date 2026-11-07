---
name: handoff
description: Snapshot the build state into docs/HANDOFF.md so a fresh conversation can continue cold. Use when the user says handoff, wrap up, "save progress", or is about to start a new chat; after passing any PRD gate; when context is long or compaction is near; and before ending a work session.
---

# Handoff

A **cold reader** is a new Claude session that knows only `CLAUDE.md` and `docs/HANDOFF.md` (the SessionStart hook loads both). Write for that reader.

## Steps

1. **Gather the facts.** Run `git status --short`, `git log --oneline -15`, and the checks that exist (`pnpm lint`, `pnpm typecheck`, `pnpm test`). Note real pass/fail output, not assumptions. Read the current `docs/HANDOFF.md` and PRD §12 to locate the schedule position.
   Done when you know: the last gate passed, what changed this session, what is half-done, and the check results.

2. **Rewrite `docs/HANDOFF.md`** in place. Keep its sections and replace their contents:
   - **Now:** phase, next gate with its UTC time, and the deadline.
   - **Done:** newly finished work since the last handoff, plus the file paths it touched.
   - **Next (in order):** 3–5 steps. Each names the files, the PRD section, and a checkable _done when_ line. A half-finished task comes first, with the exact point where it stopped.
   - **Waiting on the user:** checkboxes for credentials, approvals, decisions.
   - **Gotchas learned:** API quirks and dead ends this session paid for. Keep earlier gotchas that still hold; drop stale ones.
   - **Open questions.**
   - Update the "Last updated" line with the UTC time and session number.
     Done when a cold reader could start the first Next step without asking anything or re-reading the transcript.

3. **Log decisions.** For every choice this session that changed what or how we build, append an entry to `docs/DECISIONS.md`. If it changed the spec, edit `docs/PRD.md` in the same change.

4. **Commit** the docs with a plain Conventional Commit message, e.g. `docs: handoff after gate 2`. The message carries no attribution trailer. Skip this step if the folder is not yet a git repo.

5. **Reply to the user** in at most five lines:
   - where things stand;
   - the next step;
   - anything they must do;
   - the line to paste into a new chat: `Continue the Grudge build from docs/HANDOFF.md.`

Secrets never enter HANDOFF.md. Record only _whether_ a credential is set, never its value.
