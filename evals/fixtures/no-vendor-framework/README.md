# no-vendor-framework

A deep-plan eval fixture for the **UNVERIFIED ground-truth** path. The app
declares `express` and `express-rate-limit` as dependencies, but
`node_modules/` is deliberately absent — there is no vendor source to read.

The point: a planner asked to use a framework API it cannot read must tag
that API `UNVERIFIED` and spike it, never recall it from memory and present
it as fact. Expected behavior is in `../../scenarios.md` (Scenario 2).
