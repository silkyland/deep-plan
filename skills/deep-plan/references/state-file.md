# State file

The state file keeps the research from Phases 0–5 on disk, so that a new
session can continue after a context reset.

## Location

`.deep-plan/state.md` in the same directory as the plan document
(`docs/PLAN.md` gives `docs/.deep-plan/state.md`); create the directory if
needed. Scout findings go in `.deep-plan/findings/`. It is working memory:
deep-plan-ingest does not read it and it is not committed.

## Template

```markdown
# deep-plan state

phase: <last completed phase; 7 only once the gates have finished>
tier: Light | Standard | Heavy
task: <2–5 lines>
done when: <definition of done>
non-goals: <list>
inputs: root=<…> ground-truth=<…> plan=<…>
history: <commit checked, or UNVERIFIED: no git history>
framing defaults: <answers taken as assumed (framing default), or none>

## Research Questions
| RQ | Question | Status | Answer + citation |
|----|----------|--------|-------------------|

## Inventory
| Component | works / half-wired / dead | Evidence (path:line) |
|-----------|---------------------------|----------------------|

## Ground truth
| Mechanism | Fact | Source (vendor path or URL + version) | Tag |
|-----------|------|---------------------------------------|-----|

## Defects
| # | Severity | What | file:line |
|---|----------|------|-----------|

## Corrections
- CORRECTED: <old belief> → <new fact> (`file:line`)

## Gaps and decisions
| Gap | Class | Decision | Tag | Confirmed |
|-----|-------|----------|-----|-----------|

## Goldfish log
| Gate | Round | Verdict | Findings and triage |
|------|-------|---------|---------------------|
```

If the task is already done, record `phase: 4`, zero gaps, no decisions,
and `Goldfish: NOT RUN (already done)`; do not create a plan. Inventory
classifications describe existing components only; absent components are
MISSING gaps, not dead code.

## Keeping it

- Update it at each phase exit, before starting the next phase (Light:
  after Phases 3 and 5).
- Store each fact as one line plus its citation. Do not paste code.
- Keep it to facts. Reminders and cautions written here are re-read as
  instructions by the next session. When a fact is superseded, replace
  its row and add the old belief to Corrections.

## Resuming

A session that finds an existing state file:

1. Reads it and notes the last completed phase.
2. Re-opens every citation whose file changed since the state file was
   written (`git log` on the cited paths); without git, or when there are
   only a handful, re-opens them all. A citation that no longer matches is
   fixed in the file and recorded as a correction; if the fact itself
   changed, redo the part of the phase that produced it.
3. Tells the user in one line where it is resuming from, then continues at
   the next phase without redoing answered Research Questions.
