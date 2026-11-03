# State file — the elephant's durable memory

## Contents

- Purpose and location
- Template
- Update rules
- Resuming

## Purpose and location

Phases 1–5 produce research that would otherwise exist only in chat. A
context reset or crashed session would lose it. The state file keeps it on
disk so a new elephant can pick up where the old one stopped.

Default path: `docs/.deep-plan/state.md` (scout findings go in
`docs/.deep-plan/findings/`). If edits are blocked (Plan mode), keep the
same content in chat and write it after approval. It is working memory, not
a deliverable: deep-plan-ingest does not read it.

## Template

```markdown
# deep-plan state

phase: <last completed phase>   exit criteria passed: yes|no
tier: Light|Standard|Heavy
task: <2–5 lines>
inputs: root=<…> ground-truth=<…> plan=<…>

## Research Questions
| RQ | Question | Status | Answer + citation |
|----|----------|--------|-------------------|

## Corrections ledger
- CORRECTED: <old belief> → <new fact> (`file:line`)

## Gaps and decisions
(filled in Phases 4–5: gap | class | decision | tag)

## Goldfish log
| Gate | Round | Verdict | Findings and triage |
|------|-------|---------|---------------------|
```

## Update rules

- Update at **every phase exit**, before starting the next phase.
- Store citations as `path:line` plus a one-line fact — never pasted code.
- After a phase exits, its raw exploration output may be dropped from
  context; the state file is the record.
- If context is heavy, start a fresh session from this file rather than
  pushing on.

## Resuming

A session that finds an existing state file does this before anything else:

1. Read it; confirm the last completed phase.
2. Re-open 2–3 cited files and re-verify their claims (the repo may have
   moved).
3. Continue at the next phase. Do not redo answered Research Questions.
