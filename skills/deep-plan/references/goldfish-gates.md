# Phase 7 — Goldfish gates

## Contents

- Why a goldfish
- 7a — Checklist pass (you)
- The goldfish protocol (G1, G2, G3)
- Triage and the ledger
- Exit criteria

## Why a goldfish

You are the elephant: you cannot un-know Phases 0–6, so you silently fill
every gap in your own plan. A fresh agent with no history cannot. If it can
explain the plan, attack it, and say it could implement it on the first
pass, the zero-questions bar is proven rather than asserted.

## 7a — Checklist pass (you)

Grade the plan against [review-checklist.md](review-checklist.md), item by
item, honestly. Fix every failure first — do not spend a goldfish on known
holes.

## The goldfish protocol

Run the gates in order. **Each gate uses a NEW goldfish**; never reuse one
across gates or rounds. Give it ONLY:

- the plan document path
- read access to the project root (it may open files the plan cites)

Do NOT give it your notes, the state file, the Decision Brief, chat history,
or a summary in your words. Paste the gate prompt below verbatim.

**G1 — Comprehension.** Can it understand the plan from the page alone?

```
You are reviewing an implementation plan at <PLAN_PATH>. You have no other
context. You may read any file in the repo. For milestone M0 and milestone
M1, for every task: (1) explain in your own words which file you would open,
what you would change, and how you would verify it; (2) list every point
where you had to guess, and every question you would ask before starting.
Then spot-check 3 VERIFIED citations: open each cited file:line and say
whether it supports the claim. Reply with a table: task id | explanation |
guesses/questions | PASS or FAIL. Do not edit any file.
```

Pass = every task PASS, zero guesses, zero questions, 3 of 3 citations hold.

**G2 — Critic.** Can it break the plan? (Run after G1 passes.)

```
You are a hostile reviewer of the implementation plan at <PLAN_PATH>. You
have no other context. You may read any file in the repo. Find what would
make this plan fail: wrong ordering, missing dependencies, claims the code
contradicts, rollback gaps, unverified assumptions presented as fact, tasks
that touch files the plan never mentions. For each issue give: severity
(blocker / major / nitpick), the plan section, and the evidence (file:line).
Do not edit any file.
```

Heavy tier: run 2–3 critics in parallel, each with an added lens (security
and data loss / ordering and rollback / operational reality).

Pass = no blocker or major issues remain; only nitpicks. A nitpick is
anything whose fix would not change a file, step, command, or decision in
the plan.

**G3 — Readiness.** Would it start coding? (Run after G2 passes.)

```
You are about to implement the plan at <PLAN_PATH>, with no other context.
You may read any file in the repo. Answer: could you implement milestone M0
and M1 correctly on the first pass, following the plan exactly? Reply GO or
NO-GO. If NO-GO, list every question you would need answered. Do not edit
any file.
```

Pass = `GO` with zero questions. Light tier: run G1 and G3 as one pass.

## Triage and the ledger

Goldfish output is advice, not orders — critics in particular over-report.
For each finding, decide and record:

- **Accept** — fix it in the document, then add
  `CORRECTED (goldfish): <gap>` to the Corrections ledger.
- **Reject** — one-line reason, recorded as `REJECTED (goldfish): <issue> —
  <reason>`. Never ignore a finding silently.
- A **failed citation** returns you to the phase that produced it
  (re-verify; do not just patch the line number).

After fixing, re-run that gate with a NEW goldfish. **Max 2 rounds per
gate.** If holes remain, stop looping: list them as open items in the plan
and present them honestly.

Log each gate round in the state file and set the plan's header line:
`Goldfish: PASSED (G1 r1, G2 r2, G3 r1)`, `Goldfish: OPEN ITEMS (<n>)`, or
`Goldfish: NOT RUN`.

## Exit criteria

Every checklist item passes AND every gate passed on its last round (or its
remaining findings are listed openly in the presented plan). Only then
present the plan.
