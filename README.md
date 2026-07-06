# deep-plan

**Research-first, evidence-first implementation planning for AI coding agents.**

`deep-plan` is an [agent skill](https://vercel.com/docs/agent-resources/skills)
that turns "just start coding" agents into disciplined planners. It enforces
seven gated phases — frame, inventory, ground truth, adversarial audit, gap
analysis, decisions, plan document — with one non-negotiable law:

> **No claim without evidence. No design before research.**

Every statement in the resulting plan is tagged `VERIFIED` (with a `file:line`,
vendor path, or versioned doc URL), `UNVERIFIED` (explicitly), or `CORRECTED`
(a wrong belief, fixed with proof). Framework knowledge from training-data
memory is never accepted as a source — the agent must read the vendor code or
fetch the versioned docs.

## Install

With the [skills CLI](https://github.com/vercel-labs/skills) (works with
Claude Code, Cursor, Copilot, Codex, OpenCode, and 15+ other agents):

```bash
npx skills add <your-github-user>/deep-plan
```

Or manually: copy this directory to your agent's skills folder
(e.g. `~/.claude/skills/deep-plan/` or `.claude/skills/deep-plan/`).

## Use

Ask your agent to plan before implementing:

```
/deep-plan Refactor cart pricing to use the rule engine — root: ., vendor: vendor/shopware, plan: docs/PLAN.md
```

or simply mention "deep-plan" / ask for an implementation plan. The agent will:

1. **Frame** the task, scope, and non-goals (Phase 0)
2. **Inventory** the real codebase — every claim with a file path, everything
   classified works / half-wired / dead (Phase 1)
3. **Verify ground truth** against vendor source or versioned official docs —
   never memory (Phase 2)
4. **Adversarially audit** the existing code — defects with `file:line`,
   wrong assumptions recorded as Corrections (Phase 3)
5. **Analyze gaps** — broken vs missing vs fights-the-framework (Phase 4)
6. **Commit to decisions** — one recommendation per gap, evidence-cited, no
   menus (Phase 5)
7. **Write the plan** — dependency-ordered phased roadmap with entry/exit
   criteria, effort estimates, risk register, and copy-paste-runnable
   verification (Phase 6), then self-grade it against the acceptance
   checklist (Phase 7)

The bar: **a junior implementer agent can execute the plan without asking a
single question.**

## Structure

```
deep-plan/
├── SKILL.md                      # Entry point: prime directive, gates, progress checklist
└── references/
    ├── protocol.md               # The 7-phase protocol with exit criteria per phase
    ├── plan-template.md          # Exact structure of the output plan document
    └── review-checklist.md       # Acceptance checklist + rejection protocol
```

Follows the [Vercel skills](https://github.com/vercel-labs/skills) repository
layout and [Anthropic's skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
(progressive disclosure, references one level deep, copyable progress
checklist, SKILL.md well under 500 lines).

## Why

Agents fail at planning in predictable ways: they design from stale
training-data memory of framework APIs, report suspicions as findings, offer
"A or B" menus instead of decisions, and write roadmaps like "improve the X
system". This skill makes each of those failure modes a hard gate violation —
the agent must go back and do the research instead of talking past it.

## License

[MIT](LICENSE)
