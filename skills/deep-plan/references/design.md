# Design: Phases 4–6

## Phase 4: Gaps

Compare three things: the intent from Phase 0, what the code does (Phases 1
and 3), and what the framework supports (Phase 2). List each mismatch as a
numbered gap with the evidence behind it, and give it one class. Defects
the audit marked out of scope stay in the audit findings and do not become
gaps.

- **BROKEN**: exists but wrong (a bug, a security hole, drifted logic).
- **MISSING**: the intent requires it and the code does not have it.
- **FIGHTS-THE-FRAMEWORK**: works, but bypasses the mechanism the framework
  provides, so it breaks on upgrades.

One underlying problem can produce more than one gap; a cap that is defined
but not enforced (BROKEN) and has no rule wired for it (MISSING) is two
entries. Name the concrete mismatch in each. "Improve pricing" is not a
gap; "`applyDiscount` ignores `discountCapPercent`" is.

No existing code does not mean zero gaps: list what the intent requires
as MISSING, with the searched paths as evidence.

If the list is empty, the task is already done: stop here and report it
(SKILL.md, "Special cases").

## Phase 5: Decisions

For each gap, commit to one approach and say why. The implementer cannot
ask which of two options you meant, so the plan holds decisions rather than
menus.

- Where there is a real choice, compare the alternatives on complexity, fit
  with the existing architecture, what the framework provides (cite Phase
  2), migration and rollback cost, and blast radius. Note each rejected
  alternative in one line. Where a gap has only one sensible fix, say so
  and move on; do not invent a second option to reject.
- Prefer the smallest design that meets the task, and prefer keeping and
  hardening the existing architecture over rewriting it. A rewrite needs
  evidence that the current structure cannot do the job.
- Tag each decision **REVERSIBLE** (cheap to undo) or **ONE-WAY** (a schema
  change, a public API contract, a destructive migration, a database
  choice).

### Decision Brief

Before writing the document, show the user a brief of 10–20 lines:

- each gap, its one decision, a one-line rationale, and its tag;
- every `assumed (framing default)` from Phase 0;
- every claim still `UNVERIFIED` that a decision leans on.

Ask for confirmation once. In a headless run there is no one to show it
to: follow "Asking the user" in SKILL.md, and state in section 1 of the
plan that the brief was not confirmed.

Something only the owner can answer (a product choice, a target runtime
version nobody recorded) is an open question, listed in section 1 of the
plan. It is different from an `UNVERIFIED` claim, which an implementer can
settle by checking and which therefore becomes a spike.

## Phase 6: Write the plan

Write the document to the plan output path by filling in
[plan-template.md](plan-template.md). The template's guidance text is the
rule for each section. Write for a reader who has never seen this
conversation: name files, commands, and expected results rather than
referring to "the issue we found" or "as discussed".
