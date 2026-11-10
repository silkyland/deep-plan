![deep-plan social preview](assets/social-preview.png)

# deep-plan

**Research-first, evidence-first implementation planning for AI coding agents —
and a knowledge pipeline that keeps the research paying off.**

This repo ships two [agent skills](https://vercel.com/docs/agent-resources/skills)
that share one non-negotiable law:

> **No claim without evidence. No design before research.**

| Skill | What it does |
|-------|--------------|
| [`deep-plan`](skills/deep-plan/SKILL.md) | Produces an audit-grade plan through eight gated phases, then tests it with fresh no-context agents |
| [`deep-plan-ingest`](skills/deep-plan-ingest/SKILL.md) | Distills the finished plan into `AGENTS.md`, `docs/ARCHITECTURE.md`, and `ROADMAP.md` |

The workflow applies to planning across domains: new systems, reverse
engineering, cross-platform work, and legacy modernization all use the same
evidence and review gates. Each still needs its own target-specific source,
contracts and validation environment. The [evals](evals/README.md) distinguish
what has actually been exercised from broader intended uses.

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
/deep-plan Refactor cart pricing to use the rule engine. root: . truth: vendor/shopware plan: docs/PLAN.md
```

The planner is an **elephant**: a long-memory session that researches and
decides but edits no project source, and keeps a state file so a new session
can resume. The plan is tested by **goldfish**: fresh agents with no history,
given only the plan and the repo (after Dave Rensin's
[Elephants, Goldfish and the New Golden Age of Software Engineering](https://research.google/pubs/elephants-goldfish-and-the-new-golden-age-of-software-engineering/)).
Eight phases, numbered 0–7:

0. **Frame** the task, non-goals, definition of done, and the numbered
   **Research Questions** the design needs answered. Framing questions come
   as multiple choice with a recommended pick, so you can answer in one line
   or say "use your recommendations".
1. **Inventory** the real codebase: every component classified works /
   half-wired / dead with a file path, plus operational reality (deploys,
   data scale, background jobs).
2. **Verify ground truth** against the installed vendor source or the
   official docs for the locked version. Recalled API knowledge is tagged
   `UNVERIFIED`.
3. **Audit** the existing code: defects with `file:line`, wrong beliefs
   recorded as corrections.
4. **Analyze gaps**: BROKEN, MISSING, or FIGHTS-THE-FRAMEWORK.
5. **Commit to decisions**: one per gap, tagged REVERSIBLE or ONE-WAY, then
   a short **Decision Brief** for you to confirm before the document is
   written.
6. **Write the plan**: dependency-ordered milestones (in-scope defects fixed
   first, new functionality as a walking skeleton, a spike task for every
   remaining `UNVERIFIED`), a plan-specific risk register, and runnable
   verification.
7. **Gates**: a self-check, then fresh agents. **G1** explains each task and
   reports every guess, **G2** looks for what would make the plan fail,
   **G3** says GO or NO-GO on implementing it. Findings are triaged and
   logged; two rounds per gate at most.

Effort scales with the task: a Light plan asks at most three questions, uses
no scouts, and runs one goldfish; a Heavy plan fans out research and runs
parallel critics.

The bar: **an implementer with no access to the planning conversation can
execute the plan without asking a question.**

To revise an accepted plan, tell `deep-plan` what changed and give the
existing plan path. It reopens affected evidence, updates the decisions and
dependent tasks, appends an `R<N>` entry in section 11, and rechecks only the
changed scope. It reuses research that still holds. During implementation,
equivalent details are the implementer's choice; an unplanned reversible
choice within scope is checked and logged before the dependent code, while
scope changes and ONE-WAY decisions go to the owner. See
[revising a plan](skills/deep-plan/references/revising.md).

Ingest is optional: use it after implementation (or a landed milestone of a
long plan) when durable knowledge files would help future sessions.

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
├── skills/
│   ├── deep-plan/
│   │   ├── SKILL.md                      # Evidence tags, roles, tiers, phase table, special cases
│   │   └── references/
│   │       ├── research.md               # Phases 0–3: framing questions, inventory, scouts, ground truth, audit
│   │       ├── design.md                 # Phases 4–6: gaps, decisions, Decision Brief
│   │       ├── plan-template.md          # Structure and rules of the output plan
│   │       ├── gates.md                  # Phase 7: self-check, G1/G2/G3 prompts, triage
│   │       ├── revising.md               # Changes after acceptance: change log, decisions during implementation
│   │       └── state-file.md             # Durable state template and resume protocol
│   └── deep-plan-ingest/
│       ├── SKILL.md                      # Ingest workflow, staleness check, goldfish check
│       └── references/
│           ├── agents-template.md        # AGENTS.md structure + merge rules
│           ├── architecture-template.md  # docs/ARCHITECTURE.md structure + merge rules
│           └── roadmap-template.md       # ROADMAP.md structure + status vocabulary
└── evals/
    ├── scenarios.md                      # 7 scenarios: query, planted facts, expected behavior
    ├── trigger-queries.json              # Prompts that should and should not activate deep-plan
    └── fixtures/                         # Planning-target repos (answer keys live in scenarios.md)
```

Follows the [Vercel skills](https://github.com/vercel-labs/skills) multi-skill
repository layout (`skills/<name>/SKILL.md`) and
[Anthropic's skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
(progressive disclosure, references one level deep, SKILL.md well under 500
lines, each rule stated once with its reason).

## The skill family

| Skill | Moment |
|-------|--------|
| [know-my-repo](https://github.com/silkyland/know-my-repo) | Day one: onboard onto a repo with zero knowledge |
| **deep-plan** | Plan the next feature/refactor — evidence-gated, 8 phases |
| **deep-plan-ingest** | Distill an implemented plan into living knowledge files |
| [scaffold-my-plan](https://github.com/silkyland/scaffold-my-plan) | Turn a plan's first milestone into a running first slice |
| [clean-slate](https://github.com/silkyland/clean-slate) | Reset rotten knowledge files — backup-gated |
| [transform-my-repo](https://github.com/silkyland/transform-my-repo) | Change the architecture: migration feasibility + strategy |
| [reproduce-my-bug](https://github.com/silkyland/reproduce-my-bug) | Prove the bug before anyone fixes it |
| [audit-my-layout](https://github.com/silkyland/audit-my-layout) | Measure a live page's visual consistency, viewport by viewport |
| [ground-my-ui](https://github.com/silkyland/ground-my-ui) | Prove the UI's contracts before anyone redesigns |
| [ground-my-shopware](https://github.com/silkyland/ground-my-shopware) | Shopware 6 admin/storefront UI grounded in installed vendor source |
| [seed-ah](https://github.com/silkyland/seed-ah) | A world of ONE company that reads like it has been in use for a year |
| [love-my-love-my-docs](https://github.com/silkyland/love-my-love-my-docs) | A user manual that regenerates itself |

Shared law: **no claim without evidence** — every skill in the family is
gated on citations, verification, and honest degraded modes.

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
