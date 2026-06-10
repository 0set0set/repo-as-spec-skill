# Reference: Architecture Lens

How to reason about a repository's architecture before writing anything down.
Read this on demand, when the target repo is large or decision-heavy enough that
operational docs alone do not capture how it is built and why.

This is a lens, not a doctrine. Do NOT impose Clean Architecture, DDD, or any
single style on a repo that does not use it. Infer what the repo already is,
judge it against the qualities IT optimizes for, and surface trade-offs the user
must decide. Every observation must be grounded in a discovered file (see the
evidence levels in [checklists.md](checklists.md)).

## Step A: Infer the architecture style

Classify from real signals, not assumptions:

- Layered / n-tier: folders like `controllers/`, `services/`, `repositories/`.
- Hexagonal / clean / ports-and-adapters: `domain/`, `application/`,
  `adapters/`, `infrastructure/`; dependency inversion at boundaries.
- Modular monolith: one deployable, internal module boundaries enforced by
  package structure or build rules.
- Microservices: many independently deployable roots, per-service pipelines.
- Event-driven / pipeline: queues, topics, stream processors, DAGs.
- Library / SDK: published package, public API surface, semver discipline.
- Frontend app: component tree, routing, state management, design system.
- Infrastructure as Code: stacks/modules, providers, state backends, plan/apply.
- Data / ML: datasets, feature stores, training/eval, model registries.

Record the evidence: which directories, manifests, or configs prove the style.

## Step B: Map boundaries

- Dependency boundaries: what is allowed to depend on what. Look for the
  intended direction (e.g. inner policy must not import outer detail) and check
  whether the code actually obeys it.
- Ownership boundaries: `CODEOWNERS`, team directories, per-service owners.
- Deployment boundaries: what ships together; what the blast radius of a change
  is. High-risk/auto-deploy paths are the most important to document.
- Data boundaries: who owns which store; cross-store coupling.

### The dependency rule (when the repo aims for clean/hexagonal layering)

Apply this only to a repo whose structure already implies it (Step A found
`domain/`/`application/`/`adapters/`, ports-and-adapters, or an explicit layer
doc). Do not impose it elsewhere.

- Source code dependencies point inward: outer layers (frameworks, DB, transport,
  UI) depend on inner layers (use cases, domain); inner code never imports outer
  detail. Names and types crossing inward are owned by the inner layer.
- Verify against reality, not the diagram: grep the inner layer's imports for
  framework/DB/transport packages. Each inward-pointing violation is a finding.
- Prefer a fitness function over prose: a layering test that fails the build on a
  forbidden import (`import-linter` contracts in Python, `dependency-cruiser` or
  ESLint `no-restricted-imports` in JS/TS, ArchUnit in the JVM, `go-arch-lint`
  in Go). Propose it with the fitness-function template in
  [templates.md](templates.md); see also `PanGan21/clean-architecture-claude-skills`
  for review primitives. Fall back to a `CONSTRAINTS.md` rule only when no check
  is feasible.

## Step C: Identify the optimized quality attributes

Infer which qualities the repo actually prioritizes, from where it spends
effort (tests, alarms, guards, reviews), not from aspiration:

- Security, reliability/availability, modifiability/maintainability,
  performance/latency, cost, operability, testability, portability.

A repo with extensive alerting and rollback prioritizes reliability/operability.
A repo with strict lint/type/architecture tests prioritizes modifiability. State
the inferred priorities and the evidence; ask the user when priorities are
ambiguous and the decision depends on business goals.

## Step D: Find risk hotspots

- High-churn files (see [history-mining.md](history-mining.md)).
- Broad fan-in/fan-out modules (many dependents or dependencies).
- Privileged or security-sensitive code and secrets handling.
- Production / deploy / migration paths.
- Code with no tests around critical behavior.
- Rules that exist only in people's heads (undocumented conventions).

## Step E: Name the trade-off points

A trade-off point is a decision that improves one quality while worsening
another. Examples: caching (performance vs consistency), single-AZ (cost vs
availability), shared library (DRY vs coupling), sync call (simplicity vs
resilience). List them explicitly; these are the decisions worth recording.

## ATAM-lite evaluation (for significant trade-offs)

Borrowed from CMU SEI's ATAM, compressed for an agent. Use it when a change or
finding is architecturally significant (long-term cost, hard to reverse, affects
multiple qualities). Capture, grounded in evidence:

1. Business driver: the goal the architecture serves (ask if not in the repo).
2. Quality attributes affected, with concrete scenarios (stimulus -> response
   -> measure), e.g. "node fails -> requests reroute -> < 1s added latency".
3. Options considered.
4. Decision and why.
5. Risks and non-risks.
6. Sensitivity points (small change, large quality impact).
7. Trade-offs accepted.
8. Verification: the fitness function or check that protects the decision
   (see [quality-lenses.md](quality-lenses.md)).

Write the result with the ATAM-lite or ADR template in
[templates.md](templates.md). Use a full ADR only for decisions with long-term
cost; use the lightweight `DECISIONS.md` log for smaller, reversible choices.

## Guardrails

- Infer; do not prescribe. The repo's existing style wins over your preference.
- Ground every claim in a file/command; label evidence strength.
- Escalate priority conflicts to the user; never invent a business driver.
- Prefer turning a documented rule into an enforced fitness function over
  leaving prose that will drift.
