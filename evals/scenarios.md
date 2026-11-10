# Eval scenarios

Eleven scenarios: a query, a fixture, and the behavior to check for.
Scenarios 4 and 9 test `deep-plan-ingest`; the others test `deep-plan`.
See [README.md](README.md) for how to run them.

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
  - It tries to re-open affected citations. This fixture contains only the
    plan: missing sources must be reported and affected claims marked
    UNVERIFIED, with recovery spikes. Historical PASSED is not a fresh pass.
    Scenario 8 separately checks revision with complete source.
  - Section 11 gains revision entries starting at `R1`, with dates,
    triggers, evidence, changes and decisions. Decision 2 is marked
    `dropped (R<N>)`, not deleted, and the open question points to the
    revision that resolved it.
  - Sections 1–10 are updated to match: the new decision appears in
    section 7 with its tag, and any milestone task that depends on it is
    adjusted.
  - Goldfish run only on what changed (G1 on the affected tasks), and the
    header line records the revision.
  - It does not re-research Research Questions the change leaves alone.


## Scenario 8: revise with complete source

- **Fixture:** `fixtures/cart-service/`
- **Query:** `/deep-plan Revise docs/PLAN.md: the owner decides configured caps above 100 must be rejected through the existing cap-validation error contract, and Decision 2/database persistence is dropped. Preserve all other approved scope. root: . plan: docs/PLAN.md`
- **Expected behavior:**
  - Reuse the accepted plan. Revisit the affected invalid-cap policy and
    persistence scope without restarting the framing interview.
  - Re-open `src/cart/validateCap.js`: use its existing
    `RangeError('Invalid discount cap')`, not an invented error contract.
  - Update affected decisions, task descriptions and planned test cases;
    retain unchanged RQ answers. Mark obsolete decision/milestone/task IDs dropped, not deleted.
  - Append revision entries with owner request and source evidence. Earlier
    entries stay intact; do not invent implementation progress.
  - Fresh gates use the revision task scope. Source/vendor/tests remain
    unchanged; baseline `npm test` still passes two tests.

## Scenario 9: re-ingest after implementation, then repeat unchanged

- **Fixture:** `fixtures/cart-service/`
- **Query:** `/deep-plan-ingest docs/PLAN.md`
- **Setup and sequence:**
  1. Copy the fixture outside this repo. Initialize git, add all fixture
     files and create a local baseline commit. Run the query once.
  2. After the first ingest, add a human-maintained ground rule to AGENTS.md:
     `Human-maintained: release notes require reviewer initials.` Add this
     human section to all three outputs:

     ```markdown
     ## Human release notes

     Keep the release train on Tuesdays; this note is maintained by the owner.
     ```

  3. Save copies of all three documents. From the fixture root, apply
     `evals/changes/cart-service-implemented.patch` using its absolute path
     in the original skill repo. Do not copy the patch into the fixture or
     commit the implementation changes. The patch changes cap 50 to 20,
     integrates a new rule, and adds regressions; `npm test` must pass three
     tests. The plan deliberately stays unchanged.
  4. Run the query in a fresh session. Save the three outputs, then run it
     again in another fresh session without changing anything.
- **Expected behavior:**
  - Inspect uncommitted changes and the untracked new rule; passing old
    baseline tests alone must not prove implementation completion.
  - Remove or supersede stale current-state claims: cap 50, cap unenforced,
    validator unused, rule absent, and two-tests-only coverage. Keep source
    citations attached to current knowledge.
  - Preserve human text byte-for-byte, including the rule inside Ground
    rules. Keep original ADR text as history; make current implementation
    status clear without duplicating or rewriting past records.
  - Mark progress from actual source and named test evidence, recording
    deviations from exact planned assertions. Unconfirmed persistence must
    remain outside rules and ADRs.
  - The unchanged repeat adds no duplicate decisions or obsolete claims,
    loses no tasks, and leaves human content intact. No document rewrite is
    needed when there is no new evidence.
  - Run fresh reader checks; keep AGENTS.md within 150 lines. Source and
    plan remain unchanged by the ingest runs.

## Scenario 10: interactive framing and confirmed decisions

- **Fixture:** `fixtures/cart-pricing/`
- **Query:** `/deep-plan Enforce the discount cap in cart pricing using the rule engine; keep existing public calculator signatures. root: . truth: vendor/rule-engine plan: docs/PLAN.md`
- **Mode:** interactive; a real owner answers the questions and confirms or
  changes the Decision Brief. Do not substitute another agent for the owner.
- **Expected behavior:**
  - Read the repository before asking. Ask only choices whose answers alter
    scope or behavior; obey the tier's question budget. Do not ask for the
    cap value, public signatures or truth source already provided.
  - Present one batch with concrete options and evidence-based
    recommendations. Record actual answers as confirmed choices, not
    headless defaults. If the owner selects validation work, ask only for
    the new policy it requires.
  - Do not repeat framing after answers. Present one Decision Brief before
    writing the plan; wait for its answer. Goldfish run after the plan is
    written, with no access to the conversation/state.
  - If no person answers, report the interactive test incomplete. A
    headless continuation is a separate test, not proof of human usability.

## Scenario 11: Python credential-export planning

- **Fixture:** `fixtures/json-export/`
- **Query:** `/deep-plan Prevent credential values from leaking through the Python JSON exporter: top-level api_token and access_token fields must emit '[REDACTED]', keep other fields including token_count unchanged, preserve the export_record signature and do not mutate the caller's dictionary. Nested redaction and new credential-field discovery are outside scope. root: . plan: docs/PLAN.md`
- **Expected behavior:**
  - Find the leak in `src/exporter.py:5` and the existing exact-field helper
    in `src/redaction.py:1-8`; do not design an unrelated commerce workflow.
  - Observe that `make test` passes the existing public-data test despite
    the leak. Plan security regression tests and helper reuse in the first
    milestone, preserving sorting, public data and input dictionaries.
  - Ground framework/standard-library claims in available source or tag
    them UNVERIFIED; no dependency is needed for this fixture.
  - Fresh Light combined gate can explain concrete changes and tests.
    Leave source unchanged; a plan's passing gate is not an implemented fix.
