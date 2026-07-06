# docs/ARCHITECTURE.md Template

The system map for anyone (agent or human) who needs to understand the code
before touching it. Depth lives here so `AGENTS.md` can stay lean.

Ingest from the plan: section 2 (current state inventory), section 3
(framework ground truth), section 7 (design decisions — as ADR-style
records). **Keep citations.** An architecture doc without file paths degrades
into folklore within weeks.

---

```markdown
# Architecture

> Maintained by deep-plan-ingest from [PLAN.md](PLAN.md). Last ingested: <date>.
> Facts carry citations; if a citation no longer matches the code, the fact is stale — re-verify before relying on it.

## System overview

<5–10 lines: what the system does, major subsystems, where data lives.
A mermaid or ASCII diagram if the topology is non-obvious.>

## Components

<From plan section 2 — keep the status classification, drop entries that were
removed during implementation.>

| Component | Responsibility | Status | Evidence |
|-----------|----------------|--------|----------|
| `src/...` | <one line> | works / half-wired / dead | `file:line` |

## Data flow

<The write path AND the read path, end to end, as numbered steps.
Each step names the file/class that performs it.>

## Framework mechanisms in use

<From plan section 3 — the extension points this project relies on.>

| Mechanism | How this project uses it | Source |
|-----------|--------------------------|--------|
| <hook/event/interface> | <one line> | `vendor/...:line` or docs URL + version |

## Decision records

<From plan section 7 — one compact entry per committed decision.>

### <N>. <Decision title> (<date>)
- **Decision:** <the committed choice>
- **Why:** <one-line rationale>
- **Rejected:** <alternative — one-line reason>

## Known constraints and sharp edges

<Anything from the audit that survives as a permanent caution — quirks,
load-bearing hacks, ordering requirements — each with a citation.>
```

---

## Merge notes

- Sections this skill owns on re-ingest: "Components", "Data flow",
  "Framework mechanisms in use". Decision records are **append-only** — new
  decisions get new numbers; never rewrite history (add a superseding entry
  instead).
- Human-added sections (e.g. deployment notes) stay untouched.
