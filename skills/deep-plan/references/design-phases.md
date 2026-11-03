# Design Phases (4–6)

## Contents

- Phase 4 — Gap analysis
- Phase 5 — Design decisions
- Phase 6 — Write the plan document

Start only after Phases 0–3 pass ([research-phases.md](research-phases.md)).
Phase 7 is in [goldfish-gates.md](goldfish-gates.md).

---

## Phase 4 — Gap analysis

Three-way compare: **(a)** the intent from Phase 0, **(b)** what the code
does (Phases 1 and 3), **(c)** what the framework supports (Phase 2).

Output a numbered gap list. Classify each gap as exactly one of:

- **BROKEN** — exists but wrong (bugs, security, drift).
- **MISSING** — required by intent, absent from the code.
- **FIGHTS-THE-FRAMEWORK** — works, but bypasses what the framework blesses;
  will rot on every upgrade.

Each gap cites the Phase 1/2/3 evidence behind it.

**Exit criteria:** numbered, classified, evidence-linked. No gap is vague
("improve X") — each names the concrete mismatch.

---

## Phase 5 — Design decisions

For each gap:

1. Consider **at least 2 genuinely different approaches** (no strawmen).
2. Weigh complexity, fit with the existing architecture, what the framework
   blesses (cite Phase 2), migration/rollback cost, and blast radius. Prefer
   the smallest design that meets the task.
3. **Commit to ONE recommendation** with a short rationale. "Do A or B" is a
   Phase 5 failure.
4. Tag it **REVERSIBLE** (cheap to undo) or **ONE-WAY** (database choice,
   public API contract, destructive migration).

Constraints:

- Respect the existing architecture unless you can **prove** it wrong;
  prefer keep / harden / integrate over rewrite.
- Every decision that rests on a framework mechanism cites the Phase 2
  evidence.
- Note rejected alternatives in one line each.

**Decision Brief Gate** — before writing the document, present a 10–20 line
brief in chat: numbered gaps, the ONE decision per gap with a one-line
rationale, and its tag. Ask for confirmation **once**. If the user cannot
respond (headless/CI), proceed on REVERSIBLE decisions and carry every
ONE-WAY decision into the document marked `UNCONFIRMED`.

**Exit criteria:** one committed decision per gap, with rationale, evidence,
and tag; zero menus; the Brief was presented and every ONE-WAY decision is
confirmed or `UNCONFIRMED`.

---

## Phase 6 — Write the plan document

Write to the plan output path following [plan-template.md](plan-template.md).
You are writing for a reader who has never seen this conversation — the
goldfish will be exactly that reader. Non-negotiables:

- The roadmap is a list of **milestones** (`M0`, `M1`, …), dependency-ordered.
  **M0 is always shippable security/correctness fixes.** ("Phase" always
  means a protocol phase; never use it for roadmap items.)
- If the plan builds new functionality, **M1 is a walking skeleton** — the
  thinnest end-to-end slice that runs — never a layer-by-layer buildout.
- Every surviving **`UNVERIFIED`** becomes a named **spike task**, placed
  FIRST in the milestone that depends on it.
- Every milestone has objective, entry criteria, exit criteria, effort
  (S/M/L), and dependencies. Exit criteria name a **runnable command or an
  explicit manual step** — never "works well".
- Every task has an ID (`M1-T2`) and names the **concrete
  files/classes/migrations** it touches. "Improve the X system" is banned.
- The **Corrections** section is mandatory content: proof the research
  happened.
- The **risk register** comes from a **pre-mortem**: assume the plan failed
  in three months and write the top three causes, each with mitigation and
  rollback. Generic risks are a checklist failure.
- **Verification** has exact copy-paste commands and a manual E2E checklist.
- Write the header line `Goldfish: NOT RUN` now; Phase 7 updates it.

**Exit criteria:** the document exists at the agreed path with every
template section filled with real content.
