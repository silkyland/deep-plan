# goldfish-gap

A deep-plan eval fixture for the **goldfish gates** (Phase 7). The repo is
tiny and consistent; the draft `docs/PLAN.md` is not. Its milestone M0
cites `config.maxDiscountPct` (the real key is `discountCapPercent`) and
creates `src/cart/limits.js` while claiming a `VERIFIED` citation at
`src/cart/config.js:8` that does not say that. An author who wrote the plan
silently fills those gaps; a fresh agent cannot.

Expected behavior is in `../../scenarios.md` (Scenario 5).
