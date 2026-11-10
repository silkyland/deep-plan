# Eval scenarios

Seven scenarios: a query, a fixture, and the behavior to check for.
Scenarios 1–3 and 5–7 test `deep-plan`; Scenario 4 tests
`deep-plan-ingest`. See [README.md](README.md) for how to run them.

Each fixture's answer key is in this file only.

## Scenario 1: half-wired setting, defect, vendor fact

- **Fixture:** `fixtures/cart-pricing/`
- **Query:** `/deep-plan Enforce the discount cap in cart pricing using the rule engine. root: . truth: vendor/rule-engine plan: docs/PLAN.md`
- **Planted:** `discountCapPercent` is exported by `src/cart/config.js` and
  shown in `src/admin/Settings.vue`, but `src/cart/PriceCalculator.js`
  never reads it; `applyDiscount` applies any percentage with no upper
  bound; `vendor/rule-engine/RuleInterface.js` defines `match(scope)`
  returning a boolean and `apply(scope)` mutating the scope in place.
- **Expected behavior:**
  - The inventory classifies the cap setting as half-wired, citing where
    it is defined and collected and noting that the calculator never reads
    it.
  - The rule-engine contract is stated with a citation to the vendor file.
    A claim that rules return a modified value is a failure: it came from
    memory.
  - The audit lists the unbounded discount as a correctness defect at
    `applyDiscount` in `src/cart/PriceCalculator.js`.
  - The gaps include the unenforced cap (BROKEN) and the absent rule
    (MISSING).
  - Enforcing the cap is in the first milestone, ahead of any other work,
    and that milestone's exit criteria are a runnable command.
  - The plan notes that the vendored package has no runner, so pricing
    code has to invoke the rule itself.
  - No file under `src/` or `vendor/` was modified.

## Scenario 2: framework dependency with no installed source

- **Fixture:** `fixtures/express-api/`
- **Query:** `/deep-plan Add rate limiting using express-rate-limit. root: . plan: docs/PLAN.md`
- **Planted:** `package.json` declares `express` and `express-rate-limit`
  (`^7.1.0`); there is no `node_modules/`.
- **Expected behavior**, either of:
  - the planner fetched the official docs for the 7.x line, and each API
    claim is `VERIFIED` with the URL and version; or
  - the docs were not reachable, each API claim is `UNVERIFIED` with what
    was tried, and a spike task opens the milestone that depends on it.
- **Failure:** any `express-rate-limit` option or signature presented
  without a citation, or `VERIFIED` with no URL and version.

## Scenario 3: the feature already exists

- **Fixture:** `fixtures/http-service/`
- **Query:** `/deep-plan Add a /health endpoint. root: . plan: docs/PLAN.md`
- **Planted:** `src/index.js` already serves `/health`, and
  `test/health.test.js` covers it (`node --test` passes).
- **Expected behavior:**
  - The run finds the endpoint and its test, and cites both.
  - It stops after gap analysis, reports zero gaps, and recommends closing
    the task or a verification-only pass.
  - It writes no roadmap of invented work and no fabricated corrections.

## Scenario 4: ingest filters by tag (deep-plan-ingest)

- **Fixture:** `fixtures/cart-ingest/` (contains a finished `docs/PLAN.md`)
- **Query:** `/deep-plan-ingest docs/PLAN.md`
- **Expected behavior:**
  - The VERIFIED cap and rule facts land in `AGENTS.md` or
    `docs/ARCHITECTURE.md` with their citations intact
    (`src/cart/config.js:9`, `vendor/rule-engine/RuleInterface.js:16`).
  - The CORRECTED entry is ingested as a common wrong assumption; the
    original mistaken belief is not carried over as fact.
  - The UNVERIFIED production cart size never enters `AGENTS.md` or
    `ARCHITECTURE.md`; at most it is an open question in `ROADMAP.md`.
  - The `CORRECTED (goldfish)` entry is not ingested as a common wrong
    assumption.
  - Decision 2 (`UNCONFIRMED`, ONE-WAY), the `assumed (framing default)`
    item, and the open question about caps above 100 appear only in
    `ROADMAP.md` as open questions; none becomes a rule in `AGENTS.md` or a
    decision record in `docs/ARCHITECTURE.md`.
  - `AGENTS.md` is 150 lines or fewer.
  - A fresh goldfish given only `AGENTS.md` and the repo is asked how to
    build and test and what the wrong assumptions are; any guesses it
    reports are fixed in the file.

## Scenario 5: goldfish gates catch a phantom config key

- **Fixture:** `fixtures/cart-draft-plan/` (contains a draft `docs/PLAN.md`)
- **Query:** `/deep-plan Stress-test the existing plan at docs/PLAN.md; do not re-plan. root: .`
- **Planted:** task `M0-T1` reads `config.maxDiscountPct` and edits
  `src/cart/limits.js`, citing `VERIFIED: src/cart/config.js:8`. The real
  key is `discountCapPercent` (which is what line 8 holds), and
  `src/cart/limits.js` does not exist.
- **Expected behavior:**
  - The run goes to Phase 7 without redoing the research, and does not
    edit the plan before the first goldfish has read it.
  - The G1 goldfish is a fresh subagent given only the gate prompt with
    its paths filled in: no notes, Decision Brief, or summary.
  - It reports that `config.maxDiscountPct` does not exist, that the cited
    line does not support the claim, and that `src/cart/limits.js` is
    missing.
  - The key, citation, and file are fixed and G1 is repeated with a new
    goldfish; the plan is not presented as passing on the first round.
  - G2 and G3 also run, each with its own fresh agent, although the plan
    is small.
  - M1 ("per-channel caps", which nothing defines, and a task that is a
    no-op after M0) is reported as `OPEN (goldfish)` for the user rather
    than redesigned by the run.
  - The plan gains a Corrections entry `CORRECTED (goldfish):` for the
    phantom key, and the header line reports the outcome, for example
    `Goldfish: OPEN ITEMS (2, see Corrections)`.

## Scenario 6: resume from a state file

- **Fixture:** `fixtures/cart-resume/` (contains
  `docs/.deep-plan/state.md`, recording Phase 2 as complete)
- **Query:** `/deep-plan Enforce the discount cap. root: . plan: docs/PLAN.md`
- **Planted:** the state file cites `discountCapPercent` at
  `src/cart/config.js:2`; the key is now at line 6.
- **Expected behavior:**
  - The run finds the state file and reads it first. It does not restart
    at Phase 0 or redo the answered Research Questions.
  - It re-opens cited files, notices the stale line number, corrects it in
    the state file, and records the correction.
  - It tells the user it is resuming and continues at Phase 3.

## Scenario 7: revise an accepted plan

- **Fixture:** `fixtures/cart-ingest/` (contains a finished `docs/PLAN.md`
  with no state file)
- **Query:** `/deep-plan Revise the plan: the owner decided a cap above 100 must be rejected with an error, and the database change in Decision 2 is dropped. root: . plan: docs/PLAN.md`
- **Expected behavior:**
  - The run revises the existing plan and does not restart at Phase 0 or
    redo the framing interview.
  - It re-opens the citations the change touches (and no more than needed)
    and confirms they still hold.
  - Section 11 gains an `R1` entry with a date, trigger, evidence, change,
    and decision. Decision 2 is marked dropped (`dropped (R1)`), not
    deleted, and the open question is closed with a pointer to `R1`.
  - Sections 1–10 are updated to match: the new decision appears in
    section 7 with its tag, and any milestone task that depends on it is
    adjusted.
  - Goldfish run only on what changed (G1 on the affected tasks), and the
    header line records the revision.
  - It does not re-research Research Questions the change leaves alone.
