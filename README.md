![deep-plan social preview](assets/social-preview.png)

# deep-plan

**Research-first, evidence-first implementation planning for AI coding agents —
and a knowledge pipeline that keeps the research paying off.**

This repo ships two [agent skills](https://vercel.com/docs/agent-resources/skills)
that share one non-negotiable law:

> **No claim without evidence. No design before research.**

| Skill | What it does |
|-------|--------------|
| [`deep-plan`](skills/deep-plan/SKILL.md) | Produces an audit-grade plan document through seven gated phases |
| [`deep-plan-ingest`](skills/deep-plan-ingest/SKILL.md) | Distills the finished plan into `AGENTS.md`, `docs/ARCHITECTURE.md`, and `ROADMAP.md` |

Every statement in a deep-plan output is tagged `VERIFIED` (with a `file:line`,
vendor path, or versioned doc URL), `UNVERIFIED` (explicitly), or `CORRECTED`
(a wrong belief, fixed with proof). Framework knowledge from training-data
memory is never accepted as a source — the agent must read the vendor code or
fetch the versioned docs.

## Install

With the [skills CLI](https://github.com/vercel-labs/skills) (works with
Claude Code, Cursor, Copilot, Codex, OpenCode, and 15+ other agents):

```bash
npx skills add silkyland/deep-plan                     # both skills
npx skills add silkyland/deep-plan -s deep-plan-ingest # just one
```

Or manually: copy `skills/<name>/` into your agent's skills folder
(e.g. `~/.claude/skills/`).

## The workflow

### 1. `deep-plan` — plan before touching code

```
/deep-plan Refactor cart pricing to use the rule engine — root: ., vendor: vendor/shopware, plan: docs/PLAN.md
```

Seven gated phases, each with exit criteria:

1. **Frame** the task, scope, and non-goals
2. **Inventory** the real codebase — every claim with a file path, everything
   classified works / half-wired / dead
3. **Verify ground truth** against vendor source or versioned official docs —
   never memory
4. **Adversarially audit** the existing code — defects with `file:line`,
   wrong assumptions recorded as Corrections
5. **Analyze gaps** — broken vs missing vs fights-the-framework
6. **Commit to decisions** — one recommendation per gap, evidence-cited, no menus
7. **Write the plan** — dependency-ordered phased roadmap with entry/exit
   criteria, effort estimates, risk register, copy-paste-runnable verification —
   then self-grade against the acceptance checklist

The bar: **a junior implementer agent can execute the plan without asking a
single question.**

### 2. `deep-plan-ingest` — turn the plan into living knowledge

```
/deep-plan-ingest docs/PLAN.md
```

A plan document is a snapshot; it goes stale the day implementation starts.
Ingest moves the verified knowledge into the files future agents actually load:

- **`AGENTS.md`** — operating rules, common wrong assumptions (from the plan's
  Corrections), and verified commands. Hard budget under 150 lines.
- **`docs/ARCHITECTURE.md`** — component map, data flow, framework mechanisms,
  and append-only decision records — all with citations.
- **`ROADMAP.md`** — the phased roadmap with live statuses, open questions,
  and surviving risks.

Ingest re-verifies any claim whose cited files changed since the plan was
written (stale facts are dropped and reported, never silently copied), merges
into existing files section-by-section instead of overwriting, and refuses to
let `UNVERIFIED` content into `AGENTS.md` or `ARCHITECTURE.md`. Re-run it as
implementation progresses to update roadmap statuses from evidence (commits,
passing tests) — not optimism.

## Structure

```
deep-plan/
└── skills/
    ├── deep-plan/
    │   ├── SKILL.md                      # Prime directive, gates, progress checklist
    │   └── references/
    │       ├── protocol.md               # The 7-phase protocol with exit criteria
    │       ├── plan-template.md          # Exact structure of the output plan
    │       └── review-checklist.md       # Acceptance checklist + rejection protocol
    └── deep-plan-ingest/
        ├── SKILL.md                      # Ingest workflow, staleness check, merge policy
        └── references/
            ├── agents-template.md        # AGENTS.md structure + merge rules
            ├── architecture-template.md  # docs/ARCHITECTURE.md structure + merge rules
            └── roadmap-template.md       # ROADMAP.md structure + status vocabulary
```

Follows the [Vercel skills](https://github.com/vercel-labs/skills) multi-skill
repository layout (`skills/<name>/SKILL.md`) and
[Anthropic's skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
(progressive disclosure, references one level deep, copyable progress
checklists, SKILL.md well under 500 lines).

## Why

Agents fail at planning in predictable ways: they design from stale
training-data memory of framework APIs, report suspicions as findings, offer
"A or B" menus instead of decisions, and write roadmaps like "improve the X
system". Then the plan that avoided all of that rots in `docs/` while future
sessions rediscover everything from scratch. These two skills close the loop:
evidence-gated planning, then ingestion of that evidence into the context
files every future session loads.

## License

[MIT](LICENSE)
