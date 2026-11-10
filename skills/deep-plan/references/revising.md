# Revising a plan

A plan is accurate on the day it is accepted. After that, the owner changes
their mind, the repo moves, or implementation finds something the research
missed. This file covers what to do then, without starting over.

## Contents

- Where changes are recorded
- Decisions made during implementation
- Re-planning: how much to research again
- Re-checking after a revision

## Where changes are recorded

Section 11 of the plan, the change log, holds every change made after the
plan was accepted. One entry per change:

```
### R<N>: <title> (<date>)
- **Trigger:** what happened (owner request, failing check, repo change)
- **Evidence:** `file:line`, command output, or "owner decision in chat"
- **Change:** what the plan now says, and which sections or tasks it touched
- **Decision:** the choice, REVERSIBLE or ONE-WAY, and who confirmed it
```

Entries are appended, never edited or removed. The sections above the log
are updated to match, so a reader can trust sections 1–10 as current and
use section 11 to see how they got that way. Tasks and milestones that no
longer apply are marked `dropped (R<N>)`, not deleted. deep-plan-ingest
reads the change log as decision records, so keep the dates.

## Decisions made during implementation

The plan holds the decisions that were known when it was written. During
implementation three kinds of question come up:

| Kind | Example | Who decides | Record |
|------|---------|-------------|--------|
| Detail inside a task | Variable names, formatting, which equivalent API call | The implementer | Nothing; the commit shows it |
| A choice the plan does not cover, or a decision the code contradicts | The plan says to extend a class that turns out to be final | The implementer if it is REVERSIBLE and within the plan's scope, after checking the evidence; otherwise the owner | A change-log entry before the code that depends on it |
| A change of scope or a ONE-WAY choice | A schema change nobody planned for | The owner | Stop work on affected tasks, ask, then log it |

An implementer who cannot tell which row applies treats it as the next row
up. Until an entry exists, the plan still says what to build, and an
unlogged deviation is a defect in the work.

## Re-planning: how much to research again

Reuse everything that is still true. Decide how far back the change reaches:

| The change | Go back to | Redo |
|------------|-----------|------|
| A detail or a single task | Phase 6 | Edit the task; add an entry |
| One decision | Phase 5 for that gap | Re-open the evidence the decision rests on; compare alternatives again; update the Decision Brief item and the milestones that used it |
| The scope or the intent | Phase 0 | Update done-when and non-goals; mark Research Questions the change touches as open and add new ones; then research only those, and re-run the phases they feed |
| The repo moved under the plan | Phase 1 for the changed paths | `git log` on the paths the plan cites; re-open each cited line in changed files; fix what no longer holds and list it as a correction |

The plan's sections 2 and 3 carry the inventory and the ground truth, so a
revision can start from the plan alone when `.deep-plan/state.md` is gone:
read the plan's claims as unverified, re-check the ones the change touches
and the ones whose files changed, and rebuild the state file from them.
Research Questions the change does not touch keep their answers.

Ask the user only what the change leaves open; the framing interview is for
new plans, not revisions.

## Re-checking after a revision

Run goldfish only on what changed, and say so in the change-log entry:

- a revised task or decision: G1 on the affected tasks;
- a changed milestone order or a new milestone: G1 on its tasks and G3 on
  the first milestone that changed;
- a changed decision with wide reach, or a Heavy-tier plan: G2 as well.

For revision gates, append one scope line to the normal gate prompt:
`Scope: review only tasks <IDs> in milestones <IDs> and the evidence they
depend on; leave unaffected tasks out of this review.` Give IDs only, not
your findings or desired verdict. This replaces the normal first-two-
milestones scope; the reviewer still gets no conversation history.

Update the header line with the rounds, for example
`Goldfish: PASSED (G1 r1, G2 r2, G3 r1; revised R1: G1 r1)`.
