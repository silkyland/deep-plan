# Evals

Test scenarios for the two skills in this repo. There is no automated
harness: run each scenario against a copy of its fixture and compare the
result with the expected behavior in [scenarios.md](scenarios.md).
[trigger-queries.json](trigger-queries.json) lists prompts that should and
should not activate `deep-plan`, for checking the description.

## Running a scenario

1. Copy the fixture directory somewhere outside this repo, so the run
   cannot see `scenarios.md` and its state files do not land here.
2. Start a fresh session in the copy and send the scenario's query.
3. Grade the plan (or the ingested files) against the expected behavior.
4. For a baseline, repeat with the skill disabled and compare.

The fixtures contain no hints: the answer key lives only in
`scenarios.md`. Keep it that way when adding one, because a planner that
reads "this setting is half-wired" in a comment has not been tested.

`deep-plan` writes the plan document and a `.deep-plan/` state directory
and edits no project source, so a run that modified anything under `src/`
has failed regardless of the plan's content.

## Fixtures

| Fixture | Exercises | Scenario |
|---------|-----------|----------|
| `cart-pricing/` | Inventory, vendor contract, milestone order; interactive framing | 1, 10 |
| `express-api/` | Framework dependency with no installed source: cite fetched docs or tag `UNVERIFIED` and spike | 2 |
| `http-service/` | The requested feature exists and is tested: stop with zero gaps | 3 |
| `cart-ingest/` | Ingest filtering and citation carry-over; accepted-plan revision | 4, 7 |
| `cart-draft-plan/` | A draft plan that cites a config key and a file that do not exist: the goldfish gates | 5 |
| `cart-resume/` | A state file whose citation has gone stale: resume and re-verify | 6 |
| `cart-service/` | Complete-source revision; re-ingest with working-tree changes and human documents | 8, 9 |
| `json-export/` | Python security fix planning using an existing helper | 11 |

## Validation record — 2026-11-10

Continuation of the interrupted tuning session. Fresh runs used isolated
fixture copies outside this repository. Reviewers started without the
planner's conversation history; temporary agent-capacity limits were
handled by dispatching reviewers from the parent session.

| Scenario | Evidence / outcome |
|----------|--------------------|
| 1 | Fresh run: half-wired cap, unbounded-discount defect, vendor mutation contract and missing runner found. One releasable M0; `G1+G3 r1` passed, GO. Source/vendor files byte-identical to fixture. |
| 2 | Fresh run: versioned upstream v7.1.0 sources cited; exact resolved versions remain UNVERIFIED with a first-task verification spike. `G1+G3 r1` passed, GO. Source/manifest unchanged. Production quota and topology remain owner questions. |
| 3 | Fresh final run: stopped after Phase 4 with zero gaps, no plan document, only state created. `npm test`: 1 passed, 0 failed. |
| 4 | Fresh final run after removing ingest-answer hints from the fixture: three files generated, AGENTS.md 26 lines. Citations and dated missing-source caveats preserved; unsettled items only in ROADMAP. Fresh goldfish passed without guesses. No application test success inferred from the source-free checkout. |
| 5 | Earlier Claude stress-test evidence retained; not re-run in this continuation. G1 caught phantom key/file, G2 and G3 ran, unresolved design questions stayed OPEN. That run reported G2 concurrent with G1 round 2, a sequence deviation; it is not proof of strict sequential gate conformance. |
| 6 | Fresh final run: read phase-2 state first, resumed at Phase 3, retained answered RQs, corrected config citation from line 2 to 6, and stopped after Phase 4 as requested. Only state updated. |
| 7 | Fresh revision retained Decision 2 as dropped, resolved above-100 policy, and logged R1. Fresh G1 found missing source/error-contract/performance evidence; final header OPEN ITEMS (3). G2/G3 withheld under the first-milestone-blocked exception. This tests honest revision handling, not implementation readiness. |

Structural checks: reference links resolve; trigger-query JSON parses
(18 cases, not a behavioral trigger evaluation); `git diff --check` passes.
Both skills pass the Codex quick validator in temporary copies with the
Claude-specific `argument-hint` field omitted. The real field is preserved
for cross-agent compatibility. No baseline comparison or trigger-accuracy
benchmark was run.


## Follow-up validation — 2026-11-10

All runs started from the committed `558c559` skill instructions, frozen
outside this repository. These are Codex agent runs, not a Claude model
benchmark. No behavioral skill edit was justified by the completed tests.

| Scenario | Observed result |
|----------|-----------------|
| 5, repeated | Strictly sequential fresh G1 r1 → G1 r2 → G2 r1 → G3 r1. First reader saw the original phantom key before fixes. M0 became implementable; undefined M1 stayed OPEN and G3 said NO-GO. No source changes. |
| 8 | Complete-source revision passed scoped G1+G3 r1. Existing RangeError contract reused; old RQ1/RQ2 answers retained verbatim; database work marked dropped. Revision entries remained append-only; source unchanged. |
| 9, second ingest | Current cap20, integrated untracked rule and three-test evidence replaced stale knowledge. Human sections and human ground rule preserved. Original ADR retained verbatim with a superseding implementation observation; unconfirmed persistence stayed open. |
| 9, unchanged repeat | All three documents byte-identical to the preceding outputs; no new ADR or status changes. Fresh reader passed without guesses. AGENTS.md 36 lines. |
| 10 | Real owner answered three framing choices and confirmed one Decision Brief; no repeated framing. Final plan passed fresh G1+G3 r1, GO; choices recorded as user-confirmed with no framing defaults. This exercises the interaction protocol; it is not a scored satisfaction study. |
| 11 | Python JSON exporter: existing helper reused, leak identified despite passing baseline, first milestone includes security regressions. Fresh G1+G3 r1 passed, GO; source unchanged. |

Fixtures are synthetic inputs. Their historical plan headers are scenario
data, not evidence of previous implementation or gate execution. The source
patch in `changes/` makes Scenario 9's staged implementation repeatable.
The second ingest recorded supplemental exact planned assertions in addition
to the three-test suite, rather than presenting those as permanent tests.

This coverage tests a planning procedure across JavaScript and Python and
several workflow states. It does not validate production CMSs, games,
trading systems, driver ports, or every target OS/hardware combination.
Those uses need their own source, contracts, environments and validation.
