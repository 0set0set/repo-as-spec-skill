# Examples: Repository As Spec

Small, worked fragments that show what "good" looks like. They are illustrative,
not a fixed format — adapt to the target repo. The recurring lesson is restraint:
close the gap with the smallest discoverable, evidence-backed change.

## A fresh session test, before and after

A Node service whose docs were a thin README. Step 2 produced:

```
| # | Question                  | Status  | File(s) that answer it |
|---|---------------------------|---------|------------------------|
| 1 | What is this system?      | partial | README.md (one line)   |
| 2 | How is it organized?      | blank   | —                      |
| 3 | How do I run it?          | partial | package.json scripts   |
| 4 | How do I verify it?       | blank   | —                      |
| 5 | Where are we now (state)? | blank   | —                      |
```

After Step 4 (one root `AGENTS.md` plus a `PROGRESS.md`, nothing more):

```
| # | Question                  | Status   | File(s) that answer it      |
|---|---------------------------|----------|-----------------------------|
| 1 | What is this system?      | answered | AGENTS.md "What this is"    |
| 2 | How is it organized?      | answered | AGENTS.md + src/ layout note|
| 3 | How do I run it?          | answered | AGENTS.md "How to run"      |
| 4 | How do I verify it?       | answered | AGENTS.md "How to verify"   |
| 5 | Where are we now (state)? | answered | PROGRESS.md                 |
```

Note what did NOT happen: no `ARCHITECTURE.md` for a single-root service, no
ADRs, no `GATES.md`. The map plus durable state was enough.

## An "observed but not documented" pattern becoming a link, not prose

Reading three handlers in Step 1 showed every route file ends with a `registerRoutes(app)`
call and co-locates a `*.test.ts`. The lint config already enforces the test
co-location via `eslint-plugin-jest`'s `require-top-level-describe` plus a path
rule.

- Wrong fix: write a paragraph in `AGENTS.md` restating "every route needs a test".
- Right fix: one line in `AGENTS.md` — "Route conventions are enforced by ESLint
  (`.eslintrc.cjs`); run `npm run lint`." Link the enforced source; do not restate it.

The genuinely undocumented half — that `registerRoutes(app)` must be the last
call so middleware ordering holds — has no enforcement, so it earns a
`CONSTRAINTS.md` line plus a proposed fitness function (below).

## A human-only question (Step 3)

Gap: the service pins `node 18` in `.nvmrc` but CI runs `node 20`. The audit
cannot tell which is intended.

> **Runtime version conflict.** `.nvmrc` pins Node 18 but `.github/workflows/ci.yml`
> runs Node 20 (evidence: both files cited). I can align them, but the intended
> target is human-only knowledge. Which is canonical — 18 or 20? The answer goes
> into `AGENTS.md` "How to run" and the version pin.

It states the gap, the evidence found, and the artifact the answer lands in. It
does not guess.

## Choosing the artifact (decision tree in action)

- "We use Postgres, not DynamoDB." Reversible team preference, no long-term cost →
  a `DECISIONS.md` entry, cited to the PR that introduced it.
- "All inter-service calls must go through the gateway; direct calls are
  forbidden." Irreversible-ish boundary affecting reliability and security →
  `CONSTRAINTS.md` + an ADR + a dependency-direction fitness function.
- "Single-AZ to save cost, accepting lower availability." Multi-quality
  trade-off → a decision brief; promote to ATAM-lite only if it grows contested.

## A rule turned into a fitness function (not prose)

Constraint: "the `domain/` layer must not import `infrastructure/`."

```markdown
# Fitness function: domain must not import infrastructure

- Rule: code under `src/domain/**` must not import from `src/infrastructure/**`.
- Currently enforced by: nothing (review only).
- Proposed check: dependency-cruiser rule in CI.
- How it runs: `npx depcruise --config .dependency-cruiser.cjs src`
- Failure signal: CI fails listing the forbidden edge (file -> file).
- If automation is infeasible: n/a — this is automatable, so prose is the wrong tool.
```

This is preferred over a paragraph that says "remember not to import
infrastructure", which no check protects and which will drift.
