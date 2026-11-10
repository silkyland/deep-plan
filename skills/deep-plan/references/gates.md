# Phase 7: Gates

## Contents

- Self-check
- Running a goldfish
- G1 Comprehension
- G2 Critic
- G3 Readiness
- Light: combined pass
- Triage and repeat rounds
- Finishing
- Testing a plan you did not write

## Self-check

Before spending a goldfish, go through the plan yourself and fix what
fails. Repair a failure in the phase that should have produced the
content; rewording the plan does not fix missing research. Skip items
that do not apply to a plan this size.

Evidence
- [ ] Every defect and finding has a `file:line`.
- [ ] Every framework claim has a source and a tag.
- [ ] Every Research Question is answered or tagged `UNVERIFIED`.
- [ ] Section 5 lists the corrections, or says "none" with what was checked.

Decisions
- [ ] Every gap has exactly one decision, with rationale and a
      REVERSIBLE / ONE-WAY tag.
- [ ] Every ONE-WAY decision was confirmed by the user or is marked
      `UNCONFIRMED`.

Roadmap
- [ ] The roadmap follows the ordering rules in section 8 of the template.
- [ ] Every `UNVERIFIED` claim a milestone depends on has a spike task.
- [ ] Every task has an ID and names the files it touches.
- [ ] Every milestone's exit criteria are a command with expected output or
      a manual step with an observable result.
- [ ] Each risk is specific to this plan and has a mitigation and rollback.

Standalone
- [ ] Nothing refers to this conversation ("as discussed", "the issue
      above"), and the commands in section 10 run as written.

## Running a goldfish

Each gate, and each repeat round, uses a new subagent that starts with no
conversation history. A fork of this session will not do, because it
inherits everything you know. Project instruction files the host loads
automatically (`AGENTS.md`, `CLAUDE.md`) are fine, since the implementer
will have them too.

Before the first gate, set the plan's header line to
`Goldfish: IN PROGRESS`, so the plan does not claim the gates were never
run while its section 5 fills with their findings.

Send the gate prompt with only its three placeholders filled in, as
absolute paths: `<PLAN_PATH>`, `<PROJECT_ROOT>`, and `<STATE_DIR>` (the
`.deep-plan/` directory, which holds your notes). Add nothing about the
task, your decisions, or what you expect it to find. For a revision only,
append the scope line described in [revising.md](revising.md).

Standard and Heavy run G1, then G2, then G3. Light runs the combined pass
instead.

## G1 Comprehension

```
You are reviewing the implementation plan at <PLAN_PATH> for the project
at <PROJECT_ROOT>. You have no other context. You may read any file in
the project except those under <STATE_DIR>. Do not change any file in the
project; if you want to try a step, do it in a temporary copy elsewhere.

For every task in the first two milestones (all tasks if the plan has
fewer): explain in your own words which file you would open, what you
would change, and how you would verify it. List each point where you had
to guess and each question you would need answered before starting. Mark
each one MATERIAL if a different answer would change which files are
touched, a command, or an observable result, and COSMETIC otherwise
(naming, formatting, equivalent ways to write the same thing).

Then pick up to three claims tagged VERIFIED, open each cited file and
line, and say whether the source supports the claim.

Reply with a table: task id | what you would do | guesses and questions |
PASS or FAIL. Then the citation checks.
```

Pass: every task PASS, no MATERIAL guess or question, and every checked
citation holds. Cosmetic guesses are the implementer's to settle and do
not fail the gate.

## G2 Critic

```
You are reviewing the implementation plan at <PLAN_PATH> for the project
at <PROJECT_ROOT>, looking for defects in the plan. You have no other
context. You may read any file in the project except those under
<STATE_DIR>. Do not change any file in the project; if you want to try a
step, do it in a temporary copy elsewhere.

Look for what would make this plan fail when followed exactly: steps in
the wrong order, missing dependencies, claims the code contradicts,
changes with no rollback, assumptions stated as fact, and files a task
must touch that the plan never mentions. Report only issues whose fix
would change a file, step, command, or decision in the plan; skip wording
and style.

For each issue give: severity (blocker or major), the plan section, and
the evidence as file:line. If you find none, say so.
```

For Heavy, run two or three critics in parallel and append one focus line
to each prompt: `Focus on security and data loss.` / `Focus on ordering
and rollback.` / `Focus on deployment and operations.`

Pass: no blocker or major issue remains after triage.

## G3 Readiness

```
You are about to implement the plan at <PLAN_PATH> for the project at
<PROJECT_ROOT>. You have no other context. You may read any file in the
project except those under <STATE_DIR>. Do not change any file in the
project; if you want to try a step, do it in a temporary copy elsewhere.

Could you implement the first two milestones (all of them if the plan has
fewer) correctly on the first attempt by following the plan exactly?
Answer GO or NO-GO. If NO-GO, list every question you would need answered.
```

Pass: GO.

## Light: combined pass

One goldfish, one prompt: the G1 prompt above with this paragraph added at
the end.

```
Finally: could you implement these milestones correctly on the first
attempt by following the plan exactly? Answer GO or NO-GO.
```

Pass: the G1 criteria and GO. It is logged as `G1+G3`.

## Triage and repeat rounds

A reviewer asked to find problems will usually find some, and not all of
them are real. Check each finding against the code, then record one
outcome in section 5 of the plan:

- **Accept**: fix the plan and add `CORRECTED (goldfish): <gap>`.
- **Reject**: add `REJECTED (goldfish): <issue> — <reason>`.
- **Open**: the fix needs a decision only the user can make. Add
  `OPEN (goldfish): <issue>` straight away; another round cannot settle it.

A citation that fails means the research behind it was wrong, so re-verify
the claim in its phase. Correcting only the line number hides the problem.

Repeat a gate with a new goldfish when an accepted fix changed a decision,
a task, the order, a command, or a cited fact. Fixes that only add detail
to an otherwise correct task do not need a repeat; log them and move on.
Neither does a gate whose only remaining failures are open items, since
it would fail again for the same reason.
Two rounds per gate is the limit: an accepted finding that is still not
resolved after the second round becomes `OPEN (goldfish)`.

Open items do not stop the next gate from running, unless they leave the
first milestone unimplementable. A fix made after G2 does not send you
back to G1; G3 reads the fixed plan. Later goldfish see the triage notes
in section 5, which is intended: they are part of the plan the implementer
will read.

## Finishing

Log each round in the state file and set the plan's header line:

    > Goldfish: PASSED (G1 r1, G2 r2, G3 r1)
    > Goldfish: PASSED (G1+G3 r1)
    > Goldfish: OPEN ITEMS (<n>, see section 5)
    > Goldfish: NOT RUN

`r2` means the gate passed on its second round. Then present the plan as
described under "Handing over" in SKILL.md.

## Testing a plan you did not write

When the user asks only for an existing plan to be stress-tested, you are
not its author, and the point is to test it as delivered:

- Skip Phases 0–6 and the self-check. Apart from setting the header line
  to `IN PROGRESS`, change nothing before the first goldfish has read the
  plan, or the test measures your edits instead.
- Run G1, G2, and G3 whatever the size of the plan; a stress test without
  the critic is not one.
- In triage, accept and fix only what the code settles: a wrong name,
  path, citation, or command, or an omitted detail with one possible
  answer (a file that must be created, a missing import). Anything that
  needs a design decision or a missing requirement is `OPEN (goldfish)`.
- Leave the plan's structure as it is. If it has no section 5, add a
  "Corrections" section at the end and point the header line at it. If it
  lacks sections that deep-plan-ingest needs, say so in the hand-over.
- The state file holds only the task, the inputs, `tier: stress test`,
  and the goldfish log.
