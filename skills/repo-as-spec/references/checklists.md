# Checklists: Repository As Spec

Fill these in during an audit. They produce the evidence for the Step 6 report.

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

Gap = (items not in repo) / (total items). Target: below ~10%.
For each "no": if derivable, write it; if human-only, ask the user.

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
```
