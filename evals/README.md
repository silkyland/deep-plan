# Evals

Manual test scenarios for the two skills in this repo, per Anthropic's
guidance to build evaluations before writing extensive documentation. There
is no automated harness — run each scenario against its fixture and check the
result against [scenarios.md](scenarios.md).

`deep-plan` edits no project files (it runs in Plan mode and writes only the
plan document), so each fixture is a planning target with a known answer key
written into its code comments. Grading = comparing the produced plan against
that key.

## Fixtures

- `fixtures/half-wired-cart/` — a cart module with a planted half-wired
  setting, a correctness defect, and a vendored framework file. Exercises the
  core deep-plan flow: inventory classification, vendor-sourced ground truth,
  adversarial audit, gap analysis, skeleton-first roadmap. (Scenario 1)
- `fixtures/no-vendor-framework/` — declares framework deps with no
  `node_modules/` present. Exercises the UNVERIFIED-not-memory rule and spike
  tasks. (Scenario 2)
- `fixtures/already-done/` — the requested feature already exists and passes
  its test. Exercises the zero-gaps stop-and-recommend path. (Scenario 3)
- `fixtures/ingest-sample/` — a finished `docs/PLAN.md` with VERIFIED,
  UNVERIFIED, and CORRECTED claims. Exercises `deep-plan-ingest`'s tag
  filtering, citation carry-over, and 150-line budget. (Scenario 4)
