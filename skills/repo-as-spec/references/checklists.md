# Checklists: Repository As Spec

Fill these in during an audit. They produce the evidence for the Step 6 report.

## Evidence levels

Tag every claim before writing it down. This is the primary defense against
hallucination — a fact from code and a guess from a vague commit must not look
equally authoritative.

```
| Level      | Source                                              | May write as fact? |
|------------|-----------------------------------------------------|--------------------|
| Direct     | code, config, CI, tests, lockfiles, rules           | yes                |
| Historical | cited commit SHA / PR # / issue with clear rationale | yes, with citation |
| Derived    | a pattern consistent across several examples        | yes, labeled as inferred |
| Human-only | not in repo or history; rationale unknown           | no — ask the user  |
```

## Discovery inventory (Step 1)

Fill these before auditing. They capture what the repo already says, by
authority layer, and surface conflicts early.

```
| Authority layer (highest first) | File(s) found | What it governs |
|---------------------------------|---------------|-----------------|
| Agent/governance                |               |                 |
| CI/CD contracts                 |               |                 |
| Local quality gates             |               |                 |
| Tool policy / formatting        |               |                 |
| Version pins                    |               |                 |
| Ops entrypoints                 |               |                 |
| Human context (README/docs)     |               |                 |
```

```
| Project root | Builds/deploys as | Reference implementation chosen | Why this one |
|--------------|-------------------|---------------------------------|--------------|
|              |                   |                                 |              |
```

Reference-implementation selection (read at most 2-3 end to end): prefer, in
order, (1) a module the docs mark as example/template, (2) the one with the most
complete gates (CI + tests + lint), (3) a median-age module (neither legacy nor
experimental). Record why you picked each.

## Authority conflict log

When two sources disagree (e.g. README says one thing, CI enforces another),
log it. The authority order in SKILL.md Step 1 decides the winner; a conflict
that depends on human-only intent becomes a Step 3 question — never auto-resolve
it by preference.

```
| Topic | Source A (says) | Source B (says) | Winner (by authority) | Action |
|-------|-----------------|-----------------|-----------------------|--------|
|       |                 |                 |                       |        |
```

## Deep-path triggers

Run the deep path only when a box is checked; otherwise stay on the lite path.

```
Run architecture-lens.md if ANY:
- [ ] more than one project root, or a monorepo
- [ ] a CI path deploys to production
- [ ] more than three significant trade-offs are blank in the audit

Run history-mining.md (read-only) if ANY:
- [ ] rationale is blank for a listed trade-off
- [ ] a high-churn path has no ARCHITECTURE/DECISION doc
- [ ] recent incident/drift commits touch sensitive paths
Stop criterion: dig only the listed gaps; cap at a few commits/PRs per gap.
```

## Fresh session test

For each question, mark status and cite the file that answers it. A question is
only "answered" if a fresh session could resolve it from repo contents alone.

```
| # | Question                      | Status (answered/partial/blank) | File(s) that answer it |
|---|-------------------------------|---------------------------------|------------------------|
| 1 | What is this system?          |                                 |                        |
| 2 | How is it organized?          |                                 |                        |
| 3 | How do I run it?              |                                 |                        |
| 4 | How do I verify it?           |                                 |                        |
| 5 | Where are we now (state)?     |                                 |                        |
```

Goal: every row is "answered" with a concrete file. Each blank/partial becomes a
gap to resolve in Step 3.

## Knowledge visibility gap

List the decisions and constraints important to working in this repo. Mark each
as inside or outside the repo.

```
| Item (decision / constraint)        | In repo? (yes/no) | Where it lives now | Action |
|-------------------------------------|-------------------|--------------------|--------|
|                                     |                   |                    |        |
```

Gap protocol (so the number is not arbitrary):
- Source the list from real signals: blast-radius/high-risk paths, churn
  hotspots, the decision-visibility table, and the observed-but-not-documented
  list — not a casual handful.
- Sample at least ~15 items in a medium repo.
- Weight each item by irreversibility x how often it is touched; a `partial`
  counts as half. `gap = weighted_missing / weighted_total`. Target: below ~10%.
- For each "no": if derivable, write it; if human-only, ask the user.

## Decision visibility (the "why")

Separate from operational visibility above. For the architecturally significant
trade-offs (long-term cost, hard to reverse, multiple qualities affected),
record whether the rationale is captured and whether it is enforced. Use
[architecture-lens.md](architecture-lens.md) to find trade-off points and
[history-mining.md](history-mining.md) to recover rationale (cite the source).

```
| Significant decision / trade-off | Rationale in repo? | Evidence level | Enforced by? (test/CI/policy) | Action |
|----------------------------------|--------------------|----------------|-------------------------------|--------|
|                                  |                    |                |                               |        |
```

## Architecture risk scan

From [architecture-lens.md](architecture-lens.md) Step D, list hotspots. Keep
ownership findings as knowledge-risk notes, not judgments of people.

```
| Risk hotspot                    | Signal (churn/fan-in/privilege/no-tests/deploy path) | Evidence | Suggested mitigation |
|---------------------------------|------------------------------------------------------|----------|----------------------|
|                                 |                                                      |          |                      |
```

## Fitness-function candidates

For each rule worth keeping, classify enforcement (strongest first): already
enforced (link it), automatable (propose a check), or review-only (justify why).

```
| Rule / constraint            | Currently enforced by | Can be automated? | Proposed fitness function / check |
|------------------------------|-----------------------|-------------------|-----------------------------------|
|                              |                       |                   |                                   |
```

## Observed-but-not-documented patterns

Conventions the code follows consistently but that no rule, README, or config
states. Derived by reading reference implementations in Step 1. Each one is a
candidate to document (or to propose as an enforced rule).

```
| Pattern observed in code | Reference file(s) seen in | Already enforced? (rule/CI/lint) | Action (document / link / propose rule) |
|--------------------------|---------------------------|----------------------------------|-----------------------------------------|
|                          |                           |                                  |                                         |
```

If "already enforced" is yes, link to the source instead of restating it.

## ACID assessment (state management)

```
- [ ] Atomicity: can an agent operation be cleanly rolled back (one logical change per commit)?
- [ ] Consistency: is there a defined "consistent state" predicate (tests pass, lint clean)?
- [ ] Isolation: do concurrent agents avoid clobbering shared state (separate files/branches)?
- [ ] Durability: is all cross-session knowledge in git-tracked files (not memory)?
```

## Verification and decay prevention

```
- [ ] AGENTS.md exists, is short (~50-100 lines), and routes to deeper docs.
- [ ] Run/verify commands are real (match the repo's tooling) and discoverable.
- [ ] Architecture/constraint docs are co-located with the code they govern.
- [ ] Durable state (PROGRESS.md) and rationale (DECISIONS.md / ADRs) exist where needed.
- [ ] No invented architecture or unconfirmed decisions were written.
- [ ] Existing source-of-truth files (rules, CI, README) are linked, not duplicated.
- [ ] Every non-trivial claim is traceable to a specific repo file or command.
- [ ] Observed-but-not-documented patterns from Step 1 are now captured somewhere discoverable.
- [ ] No generic filler that would apply to any repository.
- [ ] CI/deploy/path-filter statements match the actual workflow files.
- [ ] Real non-destructive checks were run; destructive/deploy commands were not.
- [ ] Docs are bound to code (co-location + update-with-code expectation noted).
- [ ] Every non-obvious claim carries an evidence level; no guess stated as fact.
- [ ] Recovered rationale cites a commit/PR; weak commit messages were not used as proof of intent.
- [ ] No architecture style was prescribed as universal; inferred style is backed by evidence.
- [ ] Significant trade-offs have rationale recorded or an explicit ask to the user.
- [ ] Each documented rule links to enforcement, proposes a fitness function, or justifies staying review-only.
- [ ] History mining (if used) was read-only; no commit/push/state change.
```
