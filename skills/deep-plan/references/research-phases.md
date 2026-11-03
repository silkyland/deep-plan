# Research Phases (0–3) — MANDATORY, in this order

## Contents

- Phase 0 — Frame the task
- Phase 1 — Inventory reality (no design allowed)
- Phase 2 — Establish ground truth
- Phase 3 — Adversarial audit
- Interaction rules

Each phase ends with **Exit criteria**; do not start the next phase until
they pass, then update the [state file](state-file.md). Phases 4–7 are in
[design-phases.md](design-phases.md) and [goldfish-gates.md](goldfish-gates.md).

---

## Phase 0 — Frame the task

1. Restate the task in 2–5 lines: what the system is, what must be planned,
   what "done" means. If the user's wording and the repo disagree, say so.
2. Confirm the four inputs (task, project root, ground-truth source, plan
   output path). Infer from the repo before asking.
3. Run the **framing interview** ([framing-interview.md](framing-interview.md)):
   after a first recon pass, ask generously. **Every question is a choice with
   2–4 concrete options and a recommended pick.** Skip what recon settled.
   This front-loads ambiguity; it does not lower the implementer's
   zero-question bar.
4. State explicit **non-goals**. Scope creep starts where they are missing.
5. Identify the risk profile (what breaks, who is affected, how reversible)
   and pick the **effort tier** (Light / Standard / Heavy, see SKILL.md).
6. Write the **Research Questions** — numbered: extension points,
   contracts, invariants, data scale, operational constraints. Every
   finding cites the question it answers; questions found mid-research are
   appended.
7. Create the **state file** ([state-file.md](state-file.md)) with the
   above.

**Exit criteria:** task, inputs, non-goals, definition of done, tier, and a
numbered Research Question list are in the state file. Framing answers taken
as defaults are tagged `assumed (framing default)`.

---

## Phase 1 — Inventory reality (no design allowed)

Build a map, not a judgment:

- Directory structure and entry points.
- Every relevant class/module: what it extends, implements, and is wired to
  (DI/config/registration files).
- Data models and where data is actually stored.
- The full data flow: **write path AND read path**, end to end.
- Existing docs, ADRs, TODO/FIXME markers.
- Git trajectory: last ~30 commits — what was the team building toward, and
  what was touched, reverted, or abandoned?
- **Operational reality:** deploy pipeline, environments, real data scale
  (a migration for 100 rows and for 100M rows are different plans), and
  background jobs touching the same paths.

Classify every component **works / half-wired / dead**, each with the file
path that proves it. "Half-wired" (UI collects a value nothing consumes, a
service registered but never called) is the highest-signal category.

Fan out scouts only when the tier calls for it, using the brief template in
[subagent-briefs.md](subagent-briefs.md). Spot-check any surprising claim
before accepting it.

**Exit criteria:** every inventory entry has a file path and a classification.
No entry says "probably" or "seems to".

---

## Phase 2 — Establish ground truth

Never trust training-data memory for framework APIs, config formats, or
extension points. Verify in this order:

1. **Local vendor source** (`vendor/`, `node_modules/`, SDK dirs) — the
   version that will run. Read the real class/signature; cite the path.
2. **Official documentation** — only when vendor source is absent. Fetch it
   now; cite URL **and the version** the page documents; confirm it matches
   the lockfile.
3. **Repo history and tests** — how this project used the mechanism before.

For every extension point the plan might use, verify exact class names,
signatures, hook/event names, service tags, template conventions, config
schemas. A mechanism you assumed that **does not exist in this version** is
a finding — it goes in the Corrections ledger.

**Exit criteria:** every framework fact carries a vendor path or versioned
doc URL. Zero facts from memory.

---

## Phase 3 — Adversarial audit

Switch from mapping to attacking. Trace the full write → store → render path
and try to break it:

- Logic at the wrong scope or layer.
- Injection/XSS: user-controlled values reaching output, query, or shell.
- Missing access control on mutating or data-exposing paths.
- Schema/contract mismatches between layers (UI ↔ API ↔ storage ↔ render).
- Values collected but never consumed — and consumed but never validated.
- Duplicated logic that has drifted.
- Failure modes: null, empty, concurrent, oversized input.

Rules:

- Every finding needs `file:line`. **Read the code before reporting a
  suspicion** — a suspicion is not a finding.
- A belief (yours, a scout's, a prior report's) that proves WRONG is
  recorded as a correction. Corrections are more valuable than
  confirmations.
- Rank worst-first: security > data loss > correctness > reliability >
  maintainability.

**Exit criteria:** a ranked defect list with `file:line` per entry, plus a
Corrections ledger. An empty ledger is a red flag — re-examine Phase 1.

---

## Interaction rules

- **Framing (Phase 0):** batch decision-ready questions; the user can reply
  "use your recommendations."
- **Phases 1–7:** ask sparingly, **one question at a time**, always with a
  recommended answer and a one-line reason.
- Report honestly: unverified means `UNVERIFIED`; failing tests are reported
  with output. Never round "probably fine" up to "fine".
- **Stop-and-verify triggers** — halt and return to the right phase if you:
  - write an API/class/config name you have not read this session;
  - use "probably", "should", "typically", or "I believe" about this repo or
    framework version;
  - design a fix for code you have not opened;
  - copy a scout's claim without a file path attached.
