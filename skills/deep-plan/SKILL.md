---
name: deep-plan
description: >-
  Plans a feature, refactor, migration, or system before any code is written.
  Researches the real codebase and the installed framework source first, tags
  every claim VERIFIED or UNVERIFIED with a citation, commits to one decision
  per gap, and writes a milestone plan that fresh no-context "goldfish"
  subagents must be able to explain, attack, and start implementing without
  asking a question. Use when the user asks to plan, design, architect, or
  audit a multi-file code change before implementing it, wants an existing
  implementation plan stress-tested, or mentions deep-plan, /deep-plan, or
  elephant/goldfish. Not for a fix whose whole design fits in one sentence.
license: MIT
argument-hint: "[task] [root: path] [truth: vendor path or docs URL] [plan: output path]"
---

# Deep Plan

Produce a plan that an implementer with no access to this conversation can
execute without asking a question. Research comes before design, and a
reader who knows nothing judges the result.

## Evidence tags

Every claim about the code or the framework, in the state file and in the
plan, carries one tag:

| Tag | Meaning | Carries |
|-----|---------|---------|
| `VERIFIED` | You opened the source or ran the command yourself | `file:line`, vendor path, docs URL + version, or the command and its output |
| `UNVERIFIED` | You could not confirm it | What you tried and what would confirm it |
| `CORRECTED` | A belief that turned out wrong | The old belief and the evidence against it |

What you remember about a framework's API is a hypothesis: the installed
version may differ from the one you learned. Open the source, or tag the
claim `UNVERIFIED`. Uncertainty is fine as long as it is tagged; the failure
is an untagged guess that reads like a fact.

## Roles

| Role | Who | Knows | Job |
|------|-----|-------|-----|
| Elephant | You, this session | Everything from Phases 0–6 | Research, decide, write the plan |
| Scout | Research subagent | Its written brief | Answers assigned Research Questions (Phases 1–3) |
| Goldfish | Fresh subagent, not a fork of this conversation | The plan path and the repo | Tests the plan (Phase 7) |

You cannot judge whether your own plan stands alone, because you fill its
gaps from memory without noticing. The goldfish cannot, so it gets no notes
and no summary from you: anything you tell it is something the real
implementer will not have.

## Before Phase 0

1. **Inputs.** Take the task, project root, ground-truth source, and plan
   output path from the invocation text; infer the rest from the repo
   (default plan path `docs/PLAN.md`; in a monorepo the root is the package
   the task lives in, with cross-package dependencies noted).
2. **Existing plan or resume.** An explicit request to revise or stress-test
   an existing plan uses its "Special cases" route below, even if a state
   file exists. Otherwise, look for `<plan directory>/.deep-plan/state.md`
   (`docs/PLAN.md` gives `docs/.deep-plan/state.md`). If it exists, follow "Resuming" in
   [references/state-file.md](references/state-file.md) instead of starting
   over. A completed state (`phase: 7`) with a requested change
   uses [revising.md](references/revising.md), not a nonexistent Phase 8.
3. **Tier.** Size the effort to the task and record the tier in the state
   file. Between two tiers, take the lower one and say so.

   | Tier | Signal | Framing questions | Scouts | Goldfish |
   |------|--------|-------------------|--------|----------|
   | Light | One subsystem, a few files, everything reversible | 0–3 | none | one combined pass |
   | Standard | Several files, one boundary crossed | up to 6 | 0–3 | G1, G2, G3 |
   | Heavy | Cross-cutting, one-way decisions, production data | as many as apply | 3–5 | G1, G2 with 2–3 critics, G3 |

   If the whole design fits in one sentence, say that deep-plan is more
   than the task needs and offer to skip the plan. If the user invoked the
   skill explicitly, run Light instead.

## What you may touch

In the project, write only the plan document and the `.deep-plan/` state
directory. Read anything, and run read-only commands and the project's own
build and test commands when the result is evidence. To try something that
would modify files, do it in a throwaway copy outside the project.

If the host is in a mode that blocks file writes (such as Claude Code's
Plan mode), keep the state-file content in your working notes, have scouts
return findings in their replies, and present the plan through the host's
plan approval. Write the files once writing is allowed, and run the
goldfish gates then, since a goldfish needs the plan on disk.

## Phases

Run them in order. Track them in the host's task list if there is one,
otherwise as a checklist in your replies. Read each reference when you
reach its phase.

| Phase | Produces | Done when | Read |
|-------|----------|-----------|------|
| 0 Frame | Task, non-goals, definition of done, tier, numbered Research Questions | All of it is in the state file | [research.md](references/research.md), [state-file.md](references/state-file.md) |
| 1 Inventory | Map of the relevant code, each component works / half-wired / dead | Every entry has a file path | research.md |
| 2 Ground truth | Framework facts the design may rely on | Each has a source, or is `UNVERIFIED` | research.md |
| 3 Audit | Defects ranked worst-first; corrections | Each defect has `file:line` | research.md |
| 4 Gaps | Numbered gaps: BROKEN / MISSING / FIGHTS-THE-FRAMEWORK | Each cites its evidence | [design.md](references/design.md) |
| 5 Decisions | One decision per gap, REVERSIBLE or ONE-WAY | The Decision Brief is confirmed, or recorded as unconfirmed | design.md |
| 6 Write | The plan document | Every template section holds real content | [plan-template.md](references/plan-template.md) |
| 7 Gates | Self-check, then goldfish verdicts | Gates passed, or open items listed | [gates.md](references/gates.md) |

Save to the state file at each phase exit; on Light, once after Phase 3
and once after Phase 5 is enough.

Phases 0–3 are research and 4–6 are design. Research ends when every
Research Question is answered or tagged `UNVERIFIED`, not when every file
has been read. If you notice you have designed something that rests on code
or an API you have not opened, go back and open it before keeping the
design.

## Asking the user

- Phase 0: batch the framing questions, each with options and a recommended
  pick, so the user can answer in one line or say "use your
  recommendations".
- Phase 5: one confirmation of the Decision Brief.
- Anywhere else: ask only when the answer changes the plan and the repo
  cannot supply it; one question, with your recommendation.

When no user can answer (a headless run), do not compose questions. Record
your recommended framing answers as `assumed (framing default)`, proceed on
REVERSIBLE decisions, mark each ONE-WAY decision `UNCONFIRMED`, and note in
the plan that the Decision Brief was not confirmed. A requirement the task
and the repo do not state is an open question for the owner, listed in the
plan; do not settle it by inventing one.

## Special cases

| Situation | What to do |
|-----------|------------|
| Ground-truth source missing and docs unreachable | Tag the framework claims `UNVERIFIED` with what you tried; each becomes a spike task at the start of the milestone that depends on it |
| Not a git repo | Skip the history research; record `UNVERIFIED: no git history` in the state file |
| Greenfield, nothing to inventory | Phases 1 and 3 record "no existing code in scope"; Phase 2 carries the research |
| The task is already done | Stop after Phase 4 and write no plan document. Report zero gaps with the evidence and recommend closing the task or a verification-only pass. Do not invent work |
| A plan already exists at the output path | If the user only wants it tested, follow "Testing a plan you did not write" in [gates.md](references/gates.md). If something changed (a new decision, a different scope, the repo moved, implementation hit a contradiction), follow [revising.md](references/revising.md) instead of re-planning from scratch |
| No subagent support | Do the Phase 7 self-check, set the header to `Goldfish: NOT RUN`, and tell the user how to run the check by hand: a fresh session, given only the plan file, asked to explain the first milestone |
| Context is getting heavy | Bring the state file up to date and continue in a fresh session from it |

## Handing over

End with a message that contains:

- the plan path and its `Goldfish:` header line;
- what still needs the user: open goldfish items, `UNCONFIRMED` decisions,
  framing defaults taken on their behalf, open questions, and `UNVERIFIED`
  spikes. Say "none" for a category that is empty;
- the next step: implement from a fresh session that is given only the plan
  file. Section 11 of the plan says how to log a deviation, and
  [revising.md](references/revising.md) covers decisions that come up
  during implementation.
- optionally, deep-plan-ingest once the work has landed (see below).

deep-plan-ingest copies the plan's verified knowledge into `AGENTS.md`,
`docs/ARCHITECTURE.md`, and `ROADMAP.md`. Suggest it after a Standard or
Heavy plan has been implemented (or after each milestone of a long one),
when the facts it records are final. For a Light plan, mention it only if
the repo has no agent knowledge files yet.

The `.deep-plan/` directory is working memory and should not be committed.
Keep it until the work lands, since revisions reuse it; then offer to
delete it. In a headless run, leave it.

If the user rejects the plan, find out which kind of problem it is. A
disputed decision means revising Phase 5 with their input. A wrong or
missing fact means returning to the research phase that should have
produced it. Either way, revise the plan rather than defending it.
