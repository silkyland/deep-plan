# Eval Scenarios

Four scenarios, following Anthropic's skill-eval format (query + fixture +
expected_behavior). There is no automated pass/fail harness — run the skill
against a fixture and check its output against the `expected_behavior` list
by hand. Scenarios 1–3 test `deep-plan`; Scenario 4 tests `deep-plan-ingest`.

deep-plan writes only a plan document (it runs in Plan mode and edits no
project files), so these fixtures are planning targets with a known answer
key baked into code comments — grading is comparing the plan against that key.

## Scenario 1 — planted defect, half-wired setting, verifiable vendor fact

- **Fixture:** `fixtures/half-wired-cart/`
- **Query:** `/deep-plan Enforce the discount cap in cart pricing using the rule engine — root: ., vendor: vendor/rule-engine, plan: docs/PLAN.md`
- **Expected behavior:**
  - Phase 1 classifies `discountCapPercent` as **half-wired**, citing
    `src/cart/config.js` / `src/admin/Settings.vue` (collected) and
    `src/cart/PriceCalculator.js` (never read).
  - Phase 2 states the rule-engine contract (`match`/`apply`, `apply` mutates
    in place) citing `vendor/rule-engine/RuleInterface.js` — a **vendor path**,
    not a memory claim.
  - Phase 3 flags the unbounded discount as a correctness defect at
    `src/cart/PriceCalculator.js` (the `applyDiscount` line).
  - Phase 4 records the gap BROKEN (cap unenforced) + MISSING (no rule wired).
  - Roadmap Phase 0 is the shippable correctness clamp; the rule-engine
    wiring comes after.

## Scenario 2 — framework API with no vendor source → UNVERIFIED, not memory

- **Fixture:** `fixtures/no-vendor-framework/`
- **Query:** `/deep-plan Add rate limiting using express-rate-limit — root: ., plan: docs/PLAN.md`
- **Expected behavior:**
  - Phase 2 finds no `node_modules/` to read and does not fetch docs
    in-session, so every claim about `express-rate-limit`'s API is tagged
    **UNVERIFIED** with the path/version it tried.
  - That unknown becomes a **spike task**, placed first in the roadmap phase
    that depends on it.
  - No `express-rate-limit` API is presented as VERIFIED from memory — a
    confident API signature with no citation is a Scenario-2 failure.

## Scenario 3 — the feature already exists

- **Fixture:** `fixtures/already-done/`
- **Query:** `/deep-plan Add a /health endpoint — root: ., plan: docs/PLAN.md`
- **Expected behavior:**
  - Phase 1 finds `/health` already served in `src/index.js` and covered by
    `test/health.test.js` (`node --test` passes).
  - The run stops at Phase 4 reporting **zero gaps** and recommends a
    verification-only plan or closure — it does not invent work to look busy.

## Scenario 4 — ingest filters by tag (deep-plan-ingest)

- **Fixture:** `fixtures/ingest-sample/` (contains a finished `docs/PLAN.md`)
- **Query:** `/deep-plan-ingest docs/PLAN.md`
- **Expected behavior:**
  - The VERIFIED cap/rule facts land in `AGENTS.md` / `docs/ARCHITECTURE.md`
    **with their citations intact** (`src/cart/config.js:9`,
    `vendor/rule-engine/RuleInterface.js:16`).
  - The CORRECTED entry is ingested as a *common wrong assumption*; the
    original mistaken belief is **not** carried over.
  - The UNVERIFIED "prod cart size" claim never enters `AGENTS.md` or
    `ARCHITECTURE.md` — at most it appears in `ROADMAP.md` as an open question.
  - `AGENTS.md` is 150 lines or fewer.
