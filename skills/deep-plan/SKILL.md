---
name: deep-plan
description: >-
  Plans a feature, refactor, migration, or system before any code is written,
  using evidence-first research and a long-memory "elephant" planner checked
  by fresh no-context "goldfish" agents. Seven gated phases: frame the task,
  inventory the real codebase, verify ground truth from vendor source or
  official docs, audit existing code adversarially, analyze gaps, commit to
  design decisions, and write a phased plan that three goldfish gates prove
  executable without questions. Use when the user asks to plan, design,
  architect, audit, or review before implementing, or mentions deep-plan,
  /deep-plan, elephant/goldfish, or Plan mode.
license: MIT
argument-hint: "[task] [project-root] [ground-truth-source] [plan-output-path]"
---

# Deep Plan

Audit-grade planning: **evidence first, design later, never guess.** The
bar is a plan a junior implementer agent can execute **without asking a
single question** — and a fresh agent proves it, not you.

## The Prime Directive

> **No claim without evidence. No design before research.**

Every statement in the plan is exactly one of:

| Tag | Meaning | Required proof |
|-----|---------|----------------|
| `VERIFIED` | You read it yourself, this session | `file:line`, vendor path, or URL + version |
| `UNVERIFIED` | You could not confirm it | Explicit label + what would confirm it |
| `CORRECTED` | You believed it and were wrong | The old belief AND the new evidence |

Training-data memory of framework APIs is a hypothesis, never evidence.

## Two kinds of agent: elephant and goldfish

Based on Rensin's elephant/goldfish model. The planner that knows everything
is the worst judge of whether the plan stands on its own.

| Role | Who | Memory | Job |
|------|-----|--------|-----|
| **Elephant** | You, the planning session | Long — Phases 0–6 | Research, decide, write the plan. Never implements. |
| **Scout** | Exploration subagent with a written brief | Brief only | Answers named Research Questions in Phases 1–3. |
| **Goldfish** | Fresh subagent, zero history | Plan path + repo only | Tests the plan in Phase 7. Its ignorance is the test. |

Two rules follow:

1. **Make the elephant's memory durable.** Keep a state file so a new
   session can resume ([references/state-file.md](references/state-file.md)).
2. **Never brief a goldfish.** It gets the plan path and read access to the
   project root — no notes, no Decision Brief, no summary in your words.

## Before you start

1. Read [references/research-phases.md](references/research-phases.md) now;
   read each later reference when you reach its phase (table below).
2. Use **Plan mode** if the tool supports it. Write only the plan document
   and the state file. If edits are blocked, present the plan in chat and
   write the files after approval.
3. Pick an **effort tier** in Phase 0 and record it in the state file:

   | Tier | Signal | Scouts | Goldfish gates |
   |------|--------|--------|----------------|
   | Light | one subsystem, few files, all REVERSIBLE | 0–1 | one combined pass (G1+G3) |
   | Standard | multi-file, one boundary crossed | 2–3 | G1, G2, G3 — one goldfish each |
   | Heavy | cross-cutting, ONE-WAY decisions, prod data | 3–5 per wave | G2 with 2–3 critics, distinct lenses |

   A single-file fix does not need deep-plan — say so and stop.
4. **Preflight:** no git repo means no trajectory research. Note
   `UNVERIFIED: no git history` and use timestamps and code archaeology.

## Progress checklist

Copy into your response and check off as you go. **A phase is complete only
when its exit criteria pass.**

```
Deep Plan Progress:
- [ ] Phase 0: Frame — task, scope, done, inputs, tier, Research Questions, state file created
- [ ] Phase 1: Inventory — file paths, works/half-wired/dead (scouts briefed)
- [ ] Phase 2: Ground truth — vendor path or versioned doc URL per framework claim
- [ ] Phase 3: Audit — defects with file:line, Corrections recorded
- [ ] Phase 4: Gaps — numbered: BROKEN / MISSING / FIGHTS-THE-FRAMEWORK
- [ ] Phase 5: Decisions — one per gap, reversibility-tagged; Decision Brief confirmed
- [ ] Phase 6: Plan document — milestones, spikes, pre-mortem risks, verification
- [ ] Phase 7: Goldfish gates — 7a checklist, G1 comprehension, G2 critic, G3 readiness
```

**GATE:** Phases 0–3 are research, 5–6 are design. Design written before
Phases 1–3 pass must be deleted and redone.

## Phases

| Phase | Read before starting |
|-------|----------------------|
| 0 Frame, 1 Inventory, 2 Ground truth, 3 Audit | [research-phases.md](references/research-phases.md); Phase 0 also [framing-interview.md](references/framing-interview.md) |
| 1 (fan-out) | [subagent-briefs.md](references/subagent-briefs.md) |
| 4 Gaps, 5 Decisions, 6 Write | [design-phases.md](references/design-phases.md), [plan-template.md](references/plan-template.md) |
| 7 Goldfish gates | [goldfish-gates.md](references/goldfish-gates.md), [review-checklist.md](references/review-checklist.md) |
| Every phase exit | [state-file.md](references/state-file.md) |

## Inputs (Phase 0)

Use the invocation arguments (some platforms substitute `$ARGUMENTS`);
otherwise infer from the repo.

| Field | Example |
|-------|---------|
| Task (2–5 lines: what, why, done-when) | Refactor cart pricing to use the framework's rule engine |
| Project root | `/Users/me/Sites/my-shop` |
| Ground-truth source | `vendor/shopware/core`, `node_modules/next`, or a docs URL |
| Plan output path | `docs/PLAN.md` |

## Execution rules

- Phases run **in order**. Research ends when every Research Question is
  answered or tagged `UNVERIFIED`, not when every file has been read.
- Scouts get a written brief; never fan out with "go look at X".
- Update the state file at every phase exit; it is your memory, the chat is
  not.
- Every finding needs `file:line`; every framework claim a vendor path or
  versioned URL.
- Record every wrong assumption in the Corrections ledger. An empty ledger
  means you did not look hard enough.
- The plan contains **decisions, not menus**.

## After acceptance

1. **Implement from a fresh session** given only the plan file and the
   instruction to follow it exactly. If reality forces a deviation, update
   the plan first, then the code.
2. Run **deep-plan-ingest** to distill the verified knowledge into
   `AGENTS.md`, `docs/ARCHITECTURE.md`, and `ROADMAP.md`.

## If the plan is rejected

Reply briefly: `Checklist item <N> failed acceptance — returning to Phase <X>
to do the research for real.` Then actually do it.

## When things go wrong

| Situation | Response |
|-----------|----------|
| Ground-truth source unavailable | Tag every framework claim `UNVERIFIED` with the version/path tried; convert to spike tasks in milestone M0 |
| Not a git repo | Skip git research; note `UNVERIFIED: no git history` |
| User unavailable for the Decision Brief (headless) | Proceed on REVERSIBLE decisions; mark every ONE-WAY decision `UNCONFIRMED` |
| Task is already done | Stop at Phase 4; present zero gaps; recommend verification-only or closure |
| No subagent support | Do 7a only; mark the plan `GOLDFISH: NOT RUN`; tell the user to open a fresh session with only the plan file and ask it to explain milestone M0 — that is the manual goldfish |
| Context is heavy or the session died | Start a new elephant from the state file ([state-file.md](references/state-file.md)) |
| Goldfish gates still fail after 2 rounds | Present the open items honestly; ask whether to lower the bar or abort |
