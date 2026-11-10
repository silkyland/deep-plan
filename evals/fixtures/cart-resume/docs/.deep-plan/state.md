# deep-plan state

phase: 2
tier: Light
task: Enforce the discount cap in cart pricing.
done when: no line can exceed the cap
non-goals: admin UI changes
inputs: root=. ground-truth=none plan=docs/PLAN.md
framing defaults: none

## Research Questions
| RQ | Question | Status | Answer + citation |
|----|----------|--------|-------------------|
| 1 | Where is the cap defined? | answered | `discountCapPercent` at `src/cart/config.js:2` — VERIFIED |
| 2 | Is the cap read anywhere? | answered | no reader found in `src/` — VERIFIED |

## Inventory
| Component | works / half-wired / dead | Evidence (path:line) |
|-----------|---------------------------|----------------------|
| `discountCapPercent` setting | half-wired | defined `src/cart/config.js:2`, no reader in `src/` |

## Ground truth
(no framework in scope)

## Defects
(Phase 3 not started)

## Corrections
- none so far

## Gaps and decisions
(not started)

## Goldfish log
| Gate | Round | Verdict | Findings and triage |
|------|-------|---------|---------------------|
