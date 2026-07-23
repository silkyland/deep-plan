# Framing Interview Guide (Phase 0)

The recon tells you what the code IS; this interview pins down what the user
wants the plan to DO before you spend tokens researching the wrong thing.
Wrong scope caught here costs one round of questions; caught in Phase 6 it
costs a rewrite. So in Phase 0, **ask generously.**

## Rules

- **Every question is decision-ready:** phrase it as a choice with **2–4
  concrete options AND a recommended option**, each recommendation carrying a
  one-line reason grounded in what recon already showed (e.g. "Recommended: B
  — the git log shows the team already migrating toward the rule engine").
  A question with no options and no recommendation is banned here.
- **Ask a lot, but make answering cheap.** Prefer a batch of tappable
  multiple-choice questions over one open-ended prompt. On platforms with a
  structured question tool (e.g. Claude Code's AskUserQuestion), present up to
  ~4 at once; otherwise number them so the user can answer `1B 2A 3C` in one
  line. The user must be able to reply **"use your recommendations"** and get
  a complete, self-consistent framing.
- **Never ask what the code already answers.** Recon first; a question whose
  answer is sitting in the repo erodes trust. Skip it and state the inferred
  answer as a recommendation the user can override.
- **Recommendations are defaults, not decisions.** If the user goes silent or
  says "you decide," take every recommended option and record each in the plan
  as `assumed (framing default)` so it is visible and overridable.

## This does NOT lower the implementer bar

These questions are for the **user, now, at framing**. The finished plan must
still be executable by a junior implementer **without a single question** —
asking the user more up front is how you *reach* that bar, not an excuse to
push ambiguity downstream. Every framing answer removes an unknown from the
plan; it never adds one.

## Question bank (pick every one that applies; skip what recon settled)

Ask these as choices + recommendation. Order roughly by blast radius.

1. **Scope boundary** — "Which of these is in scope for this plan?"
   Options: just <subsystem A> / A plus <adjacent B> / the whole <area>.
   Recommend the narrowest slice that satisfies the stated task.
2. **Definition of done** — "Done means…?" Options: behavior X observable /
   X plus tests green / X plus docs + rollout. Recommend based on the repo's
   existing quality gates (if CI runs tests, include tests).
3. **Non-goals** — "Anything explicitly OUT of scope so the plan doesn't
   drift there?" Options: list the 2–3 tempting-but-adjacent areas recon
   surfaced, each as a "leave alone" toggle. Recommend leaving all out unless
   the task names them.
4. **Risk / reversibility appetite** — "For unavoidable ONE-WAY changes
   (schema, public API, destructive migration), prefer…?" Options: avoid them
   entirely this phase / allow with a migration+rollback / allow freely.
   Recommend "avoid this phase" unless the task's whole point is such a change.
5. **Backward compatibility** — "Must existing <API/data/URLs> keep working?"
   Options: strict compat / compat with a deprecation window / clean break.
   Recommend strict unless recon shows this is pre-release/internal.
6. **Data scale to plan for** — "Design against roughly what volume?" Options:
   current dev/seed size / a stated prod figure / unknown → spike it first.
   Recommend "unknown → spike" whenever prod metrics aren't in the repo; never
   silently assume toy scale.
7. **Rollout** — "How should this ship?" Options: single deploy / behind a
   feature flag / staged (canary/percentage). Recommend a flag for anything
   touching a hot path recon flagged.
8. **Testing depth** — "Verification bar for the plan's exit criteria?"
   Options: unit only / unit + integration / add E2E. Recommend matching the
   repo's existing test layers — don't invent a level the repo doesn't use.
9. **Architecture stance** — only if recon found tension (mixed patterns, an
   abandoned refactor): "Keep the current <pattern> or adopt <the newer one>?"
   Options: keep / migrate incrementally / full switch. Recommend incremental
   toward whatever the recent git trajectory favors.
10. **Ground-truth source** — if ambiguous: "Verify framework facts against…?"
    Options: `vendor/…` / `node_modules/…` / official docs <version>.
    Recommend the locally installed source — it is the version that runs.
11. **Timeline / effort ceiling** — "Any cap I should plan within?" Options:
    smallest shippable first / balanced / thorough. Recommend
    "smallest shippable first" — it maps to the skeleton-first roadmap rule.
12. **House rules not visible in code** — "Any deploy quirks, forbidden
    dependencies, or review rules I should encode as constraints?" Open, but
    offer the ones recon hinted at as pre-filled options to confirm.

## Output

Fold the answers into the Phase 0 deliverables: task statement, non-goals,
definition of done, risk profile, and the numbered Research Questions. Any
answer taken as a recommendation-default is tagged `assumed (framing default)`
so Phase 5's Decision Brief can surface it for a final confirmation.
