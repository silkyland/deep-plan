# Scout briefs (Phases 1–3)

## Contents

- When to fan out
- The brief template
- Handling reports

Scouts are not goldfish: they get a brief so they can do real research. A
vague brief ("go look at the cart code") gets misread and duplicated, so
every scout gets all five parts below.

## When to fan out

Follow the effort tier from Phase 0. Fan out only for read-only research in
large or multi-area repos. For a small repo a direct grep is faster and
cheaper — do not spawn a scout for it. Launch 3–5 scouts per wave, in
parallel, with non-overlapping scopes (structure / data flow / config and DI
/ git history). Tell each to batch independent reads and to start with broad
searches before narrowing.

## The brief template

```
Objective: answer Research Questions <RQ numbers> for <project root>.
Scope: read only <paths/areas>. Out of scope: <areas other scouts own>.
Sources, in order: local vendor source, then versioned official docs, then
repo history. Memory is not a source.
Output: write findings to <state-dir>/findings/<scope>.md and reply with
that path plus at most 10 lines. Findings are a table: claim | file:line or
URL+version | VERIFIED or UNVERIFIED | RQ number. No prose, no pasted code.
Stop when: every assigned RQ is answered or tagged UNVERIFIED, or after
<N> searches per question. Do not edit project files.
```

## Handling reports

- Read the findings file, not just the reply.
- A claim without a path is not accepted — send the scout back or verify
  it yourself.
- Spot-check anything surprising by opening the cited line.
- Beliefs a scout got wrong go in the Corrections ledger.
- Raw exploration output can be discarded once the findings are in the
  state file (compaction point).
