# AGENTS.md Template

`AGENTS.md` is loaded into every agent session — it is the most expensive
real estate in the repo. **Hard budget: under 150 lines.** Every line must
change how an agent behaves; anything merely informative belongs in
`docs/ARCHITECTURE.md`.

Ingest from the plan: section 1 (context), section 3 (framework ground
truth — only the facts agents repeatedly need), section 5 (corrections — as
"common wrong assumptions"), section 10 (verification commands).

---

```markdown
# AGENTS.md

<One paragraph: what this system is and what it is NOT (non-goals). From plan section 1.>

## Ground rules

<Only rules that prevent real mistakes, each ideally with a one-line why.>
- Never <X> — <consequence, with citation if it came from the audit>.
- Always <Y> before <Z>.
- The framework blesses <mechanism> for <purpose> (`vendor/path/File.php:12`) — do not reimplement it.

## Common wrong assumptions

<From the plan's Corrections section — the mistakes the next agent WILL make
unless warned. This is the highest-value section.>
- <Old belief> is wrong: <corrected fact> (`file:line`).

## Commands

<Copy-paste-runnable, from plan section 10.>
- Build: `<command>`
- Test: `<command>`
- Lint/typecheck: `<command>`

## Where knowledge lives

- Architecture and data flow: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Current phase and what's next: [ROADMAP.md](ROADMAP.md)
- Full research and decisions record: [docs/PLAN.md](docs/PLAN.md)
```

---

## Merge notes

- If the repo already has `CLAUDE.md` or `AGENT.md`, merge into that file and
  do not create `AGENTS.md` alongside it.
- Sections this skill owns on re-ingest: "Common wrong assumptions",
  "Commands", "Where knowledge lives". Update "Ground rules" additively;
  never delete a human-authored rule without flagging it in the report.
- If the budget is exceeded, cut informative lines before behavioral ones.
