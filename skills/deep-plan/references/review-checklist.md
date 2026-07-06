# Plan Acceptance Checklist

A plan is presentable only when **every** item is a YES. Grade honestly, item
by item, before presenting. If any item fails, return to the phase in
[protocol.md](protocol.md) that produces it — do not patch the wording.

## Evidence

- [ ] Every bug/finding has a **file:line** citation — no floating descriptions.
- [ ] Every framework/API claim has a **vendor path** or a **versioned doc URL**.
- [ ] Zero framework facts sourced from training-data memory.
- [ ] Every remaining unknown is tagged **UNVERIFIED** with what would confirm it
      — nothing "probably" works.

## Research depth

- [ ] The **Corrections** section exists and has content — a plan that never
      found itself wrong did not explore for real. (If genuinely empty, it
      says why the research still qualifies as adversarial.)
- [ ] Inventory classifies components as works / half-wired / dead, each with
      a proving file path.
- [ ] The write path AND the read path were both traced end to end.

## Decisions

- [ ] Every gap has **one committed decision with rationale** — no "A or B
      both fine" menus anywhere in the document.
- [ ] Rewrites (if any) are justified by evidence, not preference; otherwise
      the plan keeps/hardens/integrates the existing architecture.

## Roadmap

- [ ] Roadmap Phase 0 is shippable **security/correctness** fixes, not features.
- [ ] Phases are dependency-ordered; each has objective, entry criteria,
      verifiable exit criteria, and an effort estimate.
- [ ] Every checklist item names concrete files/classes/migrations — no
      "improve system X".
- [ ] A risk register exists with mitigation/rollback per risk.

## Verification

- [ ] Automated verification gives exact copy-paste-runnable commands.
- [ ] Manual E2E checklist exists that a human can follow step by step.

## Final bar

> **Could a junior implementer agent execute this plan without asking a
> single question?**

Walk the roadmap as that implementer. Every "they'd have to figure out…" is a
failing item. Do not present the plan until the answer is an honest yes.

## Rejection protocol

If the user rejects the plan, reply briefly:

> `Checklist item <N> failed acceptance — returning to Phase <X> to do the research for real.`

Then re-run that phase properly. Never argue the plan into acceptance.
