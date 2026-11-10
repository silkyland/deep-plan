# Research: Phases 0–3

## Contents

- Phase 0: Frame
- Framing questions
- Phase 1: Inventory
- Scouts
- Phase 2: Ground truth
- Phase 3: Audit

## Phase 0: Frame

1. Take a first look at the repo: its layout, manifest and lockfile, recent
   history, and the area the task names. This is what lets you ask useful
   questions and skip the ones the code already answers.
2. Restate the task in 2–5 lines: what the system is, what is being
   planned, what done means. If the user's wording and the repo disagree,
   say so now.
3. Ask the framing questions (next section), within the tier's budget. In
   a headless run, skip asking and record your recommendations as
   `assumed (framing default)`.
4. Write down the non-goals. Adjacent areas that are tempting to touch are
   where scope grows unnoticed.
5. Write the numbered Research Questions: what the design needs to know
   about extension points, contracts, invariants, data scale, and
   operational constraints. Every later finding cites the question it
   answers. Add questions as they come up.
6. Create the initial state file ([state-file.md](state-file.md)), including
   on Light; Light batches subsequent phase updates, not this initial save.

## Framing questions

Ask what the repo cannot tell you, and make answering cheap:

- Give each question 2–4 concrete options and mark the one you recommend,
  with a one-line reason drawn from what you saw in the repo.
- Ask them in one batch. Use the host's structured question tool if it has
  one; otherwise number them so the user can reply `1B 2A 3C`.
- If the repo already answers a question, state the answer as an assumption
  the user can override.
- If the user says "you decide" or cannot answer, take your recommendations
  and record each as `assumed (framing default)`. These reappear in the
  Decision Brief so the user sees them once more before the plan is written.

Pick from this bank, highest blast radius first. The tier sets how many:

| Topic | Ask when | Usual recommendation |
|-------|----------|----------------------|
| Scope boundary | The task could mean one subsystem or several | The narrowest slice that satisfies the task |
| Definition of done | Not stated | Match the repo's existing quality gates |
| Non-goals | Adjacent areas look tempting | Leave them out unless the task names them |
| One-way changes (schema, public API, destructive migration) | The task might need one | Avoid in this plan unless it is the point of the task |
| Backward compatibility | Existing APIs, data, or URLs are touched | Strict, unless the code is pre-release or internal |
| Data scale | Production volume is not visible in the repo | Unknown, so spike it; do not assume toy scale |
| Rollout | A hot path is touched | Behind a flag |
| Test depth | Not stated | The layers the repo already uses |
| Architecture stance | The repo shows mixed patterns or an abandoned refactor | Move incrementally toward what recent history favors |
| Ground-truth source | Ambiguous | The locally installed source, since that is the version that runs |
| House rules | Always worth one question on Standard and Heavy | Offer what the repo hints at (deploy quirks, forbidden dependencies) to confirm |

## Phase 1: Inventory

Map what exists, without judging it yet:

- entry points and the directories in scope;
- each relevant class or module: what it extends or implements, and where
  it is wired (DI, config, registration);
- data models and where the data is stored;
- the data flow end to end, both the write path and the read path;
- existing docs, ADRs, and TODO/FIXME markers;
- recent git history: what the team was building toward, and what was
  reverted or abandoned;
- operational reality: deploy pipeline, environments, data scale, and
  background jobs that touch the same paths. A migration over a hundred
  rows and one over a hundred million are different plans.

Classify each component as **works**, **half-wired**, or **dead**, with the
file path that shows it. Half-wired means one end exists without the other:
a setting the UI collects that nothing reads, a service registered but
never called.

## Scouts

Reading the code yourself is the default. A scout costs several times the
tokens of doing the read directly and returns only a summary, so use one
when the repo is large enough that independent areas can be read in
parallel, and follow the tier's count. For a small repo, search it yourself.

Give scouts non-overlapping scopes (for example structure, data flow,
config and wiring, git history) and launch a wave together. Each brief
contains all of this, because the scout knows nothing else:

```
Objective: answer Research Questions <numbers> for <project root>.
Scope: read only <paths>. Out of scope: <what other scouts cover>.
Sources, in order: installed vendor source, then official docs for the
locked version, then repo history and tests. Recalled API knowledge does
not count; tag it UNVERIFIED.
Output: write a table to <plan dir>/.deep-plan/findings/<scope>.md with
columns: claim | file:line or URL+version | VERIFIED or UNVERIFIED | RQ.
Reply with that path and at most 10 lines of summary.
Stop when every assigned question is answered or tagged UNVERIFIED.
Do not edit project files.
```

When a report comes back, read the findings file rather than only the
reply, open the cited line for anything surprising or load-bearing, and
send back or verify yourself any claim that has no path. A scout's wrong
belief is recorded as a correction like your own.

## Phase 2: Ground truth

For each framework mechanism the design might use, confirm the exact class
names, signatures, hook and event names, service tags, and config schema,
from the first source that has them:

1. the installed vendor source (`vendor/`, `node_modules/`, SDK
   directories), which is the version that will run;
2. the official documentation for the locked version (or, with no
   lockfile, the version range in the manifest), fetched now, cited with
   URL and version;
3. how this repo's own code and tests already use the mechanism.

If none is reachable, the claim stays `UNVERIFIED` and becomes a spike task
in the plan. A mechanism that does not exist in this version is a finding:
list it with the ground truth, and if you or the task description assumed
it existed, record that as a correction too.

A fact you establish by running something (a test runner's discovery
rules, the current output of a function) is `VERIFIED` with the command
and its output as the source.

## Phase 3: Audit

Now look for what is wrong. Trace the write, store, and read path through
the code in scope and check for whichever of these the code could have (a
pure function has no access control to audit):

- logic at the wrong scope or layer;
- user-controlled values reaching output, a query, or a shell;
- missing access control on paths that mutate or expose data;
- contract mismatches between layers (UI, API, storage, rendering);
- values collected but never consumed, or consumed but never validated;
- duplicated logic that has drifted apart;
- behavior on null, empty, concurrent, and oversized input.

Open the code before reporting. A suspicion you have not confirmed in the
source is listed as `UNVERIFIED`, not as a defect. Rank defects worst
first: security, data loss, correctness, reliability, maintainability.
Mark each one in scope or out of scope against the Phase 0 non-goals.

Record in the corrections ledger every belief that turned out wrong,
whether it was yours, a scout's, or the task description's. If nothing was
wrong, write "none" and list what you checked, so a reader can tell an
empty ledger from an unexamined one. Do not manufacture a correction to
fill it.
