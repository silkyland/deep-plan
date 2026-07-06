# Deep Plan Protocol — MANDATORY, in this order

## Contents

- Phase 0 — Frame the task
- Phase 1 — Inventory reality (no design allowed)
- Phase 2 — Establish ground truth (vendor source, not memory)
- Phase 3 — Adversarial audit of the existing code
- Phase 4 — Gap analysis
- Phase 5 — Design decisions
- Phase 6 — Write the plan document
- Phase 7 — Self-review gate
- Interaction rules (apply to every phase)

Each phase ends with **Exit criteria**. Do not start the next phase until they
pass. Phases 0–3 are research; Phases 5–6 are design; Phase 4 is the bridge.
**Design written before research is complete must be deleted and redone.**

---

## Phase 0 — Frame the task

Pin down what is actually being asked before touching anything:

1. Restate the task in 2–5 lines: what the system is, what must be planned,
   and what "done" means. If the user's wording and the repo disagree, note it.
2. Confirm the four inputs (task, project root, ground-truth source, plan
   output path). Infer aggressively from the repo before asking.
3. State explicit **non-goals** — what this plan will NOT cover. Scope creep
   begins where non-goals are missing.
4. Identify the risk profile: what breaks, who is affected, and how reversible
   the change is. This calibrates how deep Phases 1–3 must go.

**Exit criteria:** task statement, inputs, non-goals, and definition of done
are written down. Any open question was asked one-at-a-time with a
recommended answer.

---

## Phase 1 — Inventory reality (no design allowed)

Explore the ACTUAL codebase exhaustively. You are building a map, not judging
yet:

- Directory structure and entry points.
- Every relevant class/module: what it extends, implements, and is wired to
  (DI/config/registration files).
- Data models and where data is actually stored.
- The full data flow: **write path AND read path**, end to end.
- Existing docs, ADRs, TODO/FIXME markers.
- Git trajectory: last ~30 commits — what was the team building toward? What
  was recently touched, reverted, or abandoned?

Classify every component as **works / half-wired / dead code**, each with the
file path that proves it. "Half-wired" (UI collects a value nothing consumes,
a service registered but never called) is the highest-signal category — it
reveals intent that never shipped.

If exploration subagents are available, launch them **in parallel with
distinct, non-overlapping scopes** (e.g. structure, data flow, config/DI,
git history). Merge their reports and spot-check any claim that sounds
surprising before accepting it.

**Exit criteria:** an inventory where every entry has a concrete file path and
a works/half-wired/dead classification. No entry says "probably" or "seems to".

---

## Phase 2 — Establish ground truth (vendor source, not memory)

NEVER trust training-data memory for framework APIs, config formats, or
extension points. Verify against sources in this strict order of preference:

1. **Local vendor source** — the framework code actually installed in this
   repo (`vendor/`, `node_modules/`, SDK dirs). This is the version that will
   run. Read the real class/interface/signature and cite the exact file path.
2. **Official documentation** — only when vendor source is absent or
   impractical. Fetch it now (do not recall it); cite URL **and the version**
   the page documents. Confirm the version matches the project's lockfile.
3. **Repo history and tests** — how this project has successfully used the
   mechanism before.

Training-data memory is not on the list. It is a hypothesis generator, never
a source.

For every extension point the plan might rely on, verify: exact class names,
interface signatures, hook/event names, service tags, template conventions,
config schemas. If a mechanism you assumed **does not exist in this version,
say so explicitly — that IS a finding** and goes in the Corrections ledger.

**Exit criteria:** every framework fact carries a vendor path or versioned
doc URL. Zero facts sourced from memory.

---

## Phase 3 — Adversarial audit of the existing code

Switch from mapping to attacking. Hunt for real defects, not style nits.
Trace the full write → store → render path and actively try to break it:

- Logic applied at the wrong scope or wrong layer.
- Injection/XSS: any user-controlled value that reaches output, query, or
  shell without sanitization.
- Missing access control on any mutating or data-exposing path.
- Schema/contract mismatches between layers (UI ↔ API ↔ storage ↔ render).
- Values collected but never consumed (dead settings) — and consumed values
  never validated.
- Duplicated logic that has drifted between implementations.
- Failure modes: what happens on null, empty, concurrent, or oversized input?

RULES:

- Every finding needs `file:line` evidence.
- **Verify each suspicion by reading the code before reporting it.** A
  suspicion is not a finding.
- If something you (or a previous report, or a subagent) believed turns out
  WRONG, record the correction explicitly. **Corrections are more valuable
  than confirmations** — they are proof the audit was real.
- Rank findings worst-first: security > data loss > correctness > reliability
  > maintainability.

**Exit criteria:** a ranked defect list, every entry with `file:line`, plus a
Corrections ledger (an empty ledger is a red flag — re-examine your Phase 1
assumptions before accepting it).

---

## Phase 4 — Gap analysis

Three-way compare:

- **(a)** the stated intent from Phase 0,
- **(b)** what the code actually does (Phases 1 and 3),
- **(c)** what the framework properly supports (Phase 2).

Output a numbered gap list. Classify each gap as exactly one of:

- **BROKEN** — exists but wrong (bugs, security, drift).
- **MISSING** — required by intent, not present in code.
- **FIGHTS-THE-FRAMEWORK** — works, but bypasses or reimplements what the
  framework blesses; will rot on every upgrade.

Each gap cites the Phase 1/2/3 evidence that establishes it.

**Exit criteria:** numbered, classified, evidence-linked gap list. No gap is
vague ("improve X") — each names the concrete mismatch.

---

## Phase 5 — Design decisions

For each gap:

1. Consider **at least 2 genuinely different approaches** (not one approach
   and a strawman).
2. Weigh: complexity, fit with the existing architecture, what the framework
   blesses (citing Phase 2 vendor evidence), migration/rollback cost, blast
   radius.
3. **Commit to ONE recommendation** with a short rationale. The final plan
   contains decisions, not menus. "Do A or B" is a Phase 5 failure.

Constraints:

- Respect the existing architecture unless you can **prove** it is wrong —
  prefer keep / harden / integrate over rewrite. Rewrites need evidence-based
  justification, not aesthetic preference.
- Every decision that depends on a framework mechanism cites the Phase 2
  evidence that the mechanism exists and behaves as assumed.
- Note rejected alternatives in one line each — enough that a reviewer knows
  they were considered.

**Exit criteria:** one committed decision per gap, each with rationale and
evidence citations. Zero menus.

---

## Phase 6 — Write the plan document

Write to the plan output path (e.g. `docs/PLAN.md`) following the exact
structure in [plan-template.md](plan-template.md). Non-negotiables:

- The **phased roadmap** is dependency-ordered. **Phase 0 of the roadmap is
  always shippable security/correctness fixes** — small, independent,
  mergeable first. Features come after the ground is solid.
- Every roadmap phase has: objective, entry criteria, exit criteria
  (verifiable, not "works well"), effort estimate (S/M/L), and dependencies.
- Every checklist item names the **concrete files/classes/migrations** it
  touches. "Improve the X system" is banned.
- The **Corrections** section is mandatory content, not an apology — it is
  the proof the research happened.
- **Verification** includes both exact automated commands (copy-paste
  runnable) and a manual E2E checklist a human can follow step by step.

**Exit criteria:** the document exists at the agreed path and contains every
template section with real content.

---

## Phase 7 — Self-review gate

Grade the plan against [review-checklist.md](review-checklist.md), item by
item, honestly. Then apply the final bar:

> **Could a junior implementer agent execute this plan without asking a
> single question?**

Walk the roadmap as if you were that implementer: for each item, do you know
which file to open, what to change, and how to verify it? Every "well, they
would have to figure out…" is a hole — go back to the phase that should have
filled it.

**Exit criteria:** every checklist item passes. Only then present the plan.

---

## Interaction rules (apply to every phase)

- Ask **ONE question at a time**, and ALWAYS attach your recommended answer
  with a one-line reason. Never present a wall of questions.
- Report honestly: if something is unverified, tag it `UNVERIFIED`; if tests
  fail, say so plainly with output. Never round "probably fine" up to "fine".
- Stop-and-verify triggers — if you catch yourself doing any of these, halt
  and return to the relevant phase:
  - Writing an API/class/config name you have not read this session.
  - Using "probably", "should", "typically", or "I believe" about this repo
    or this framework version.
  - Designing a fix for code you have not opened.
  - Copying a subagent's claim without a file path attached.
