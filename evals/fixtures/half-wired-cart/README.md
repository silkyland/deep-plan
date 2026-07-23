# half-wired-cart

A deep-plan eval fixture. Small cart-pricing module with three planted facts
the planner must discover from the code (not from memory):

- **Half-wired setting:** `discountCapPercent` is collected in
  `src/admin/Settings.vue` and exported by `src/cart/config.js`, but
  `src/cart/PriceCalculator.js` never reads it.
- **Correctness defect:** `applyDiscount` enforces no upper bound, so the
  intended 50% cap is unenforceable.
- **Vendor ground truth:** `vendor/rule-engine/RuleInterface.js` defines the
  real `match`/`apply` contract, so Phase 2 can cite a vendor path instead of
  guessing.

Expected behavior lives in `../../scenarios.md` (Scenario 1).
