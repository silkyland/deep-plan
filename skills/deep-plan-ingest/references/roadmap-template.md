# ROADMAP.md Template

The living answer to "where are we and what's next?". Ingested from plan
section 8 (phased roadmap) and section 9 (risk register), then kept current:
re-running deep-plan-ingest updates statuses instead of rewriting the file.

Status vocabulary (use exactly these): `done` / `in-progress` / `blocked` /
`todo` / `dropped`.

---

```markdown
# Roadmap

> Source of truth for sequencing. Detail lives in [docs/PLAN.md](docs/PLAN.md);
> architecture in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Last updated: <date>.

## Status

| Phase | Name | Status | Effort | Depends on |
|-------|------|--------|--------|------------|
| 0 | <security/correctness fixes> | done | S | — |
| 1 | <...> | in-progress | M | 0 |
| 2 | <...> | todo | L | 1 |

## Phase details

### Phase <N>: <name> — <status>
- **Objective:** <one line>
- **Exit criteria:** <verifiable statement — a command passes, a behavior is observable>
- **Tasks:**
  - [x] <completed task — keep, it is the changelog>
  - [ ] <open task naming the concrete files it touches>
- **Notes:** <deviations from the original plan, and why — dated>

<Repeat per phase.>

## Open questions

<UNVERIFIED items from the plan land here and ONLY here — each with what
would resolve it. Nothing unverified is allowed into AGENTS.md or
ARCHITECTURE.md.>

- [ ] <question> — resolve by <reading X / testing Y>

## Risks

<From plan section 9 — only risks still live; move materialized or retired
risks to Notes of the phase that handled them.>

| Risk | Likelihood | Impact | Mitigation / rollback |
|------|-----------|--------|----------------------|
```

---

## Merge notes

- On re-ingest, **update statuses and check off tasks based on evidence**
  (git log, file existence, tests passing) — not on optimism. A task is
  `done` only if you can cite the commit or the passing command.
- Never delete completed tasks or phases — they are the project's changelog.
- If implementation diverged from the plan, record the deviation in the
  phase's Notes with a date; if the divergence is large, recommend a fresh
  deep-plan run instead of bending the roadmap to fit.
