# Reference: Quality Lenses

A senior-engineer review lens for judging code and documenting durable
constraints. Read on demand when evaluating design quality or deciding which
rules deserve to be written down or enforced.

Use these as lenses, not as a scorecard to impose. Apply the ones the target
repo actually cares about (see the optimized qualities in
[architecture-lens.md](architecture-lens.md)). For each finding, prefer turning
the rule into an enforced check over writing prose that will drift.

Scope, so the two lenses do not overlap: [architecture-lens.md](architecture-lens.md)
answers "how is the system organized and which structural trade-offs exist?" and
owns the optimized-qualities call (its Step C). This file answers "does this
specific rule or pattern deserve to be written down, and how should it be
enforced?" Start from the priorities architecture-lens identified and apply the
two or three lenses most relevant to them — do not run all eight by default.

## Semantics and naming

- Names map to domain concepts; the same term means the same thing everywhere
  (a ubiquitous language). Flag overloaded or contradictory terms.
- A glossary or context map exists where multiple domains/teams meet.
- Public interfaces read as intent, not implementation.

## Boundaries (dependency direction)

- Dependencies point in the intended direction; inner policy does not import
  outer detail (framework, DB, transport).
- Cross-boundary data uses simple structures, not leaked internal entities.
- No boundary is bypassed "just this once" without a recorded reason.

## Cohesion and coupling

- A module changes for one reason; related behavior lives together.
- No hidden cross-module contracts; no circular dependencies.
- Shared code represents a shared *concept*, not coincidental similarity.

## DRY with judgment

- Remove duplication when both copies express the SAME concept and must change
  together (semantic duplication). That is the duplication DRY targets.
- Tolerate duplication that only looks alike but changes for different reasons
  (incidental duplication); deduplicating it creates coupling worse than the
  duplication it removed.
- Rule of three: two occurrences are often a coincidence; extract a shared
  abstraction on the third, when the shared concept is clear. Premature
  extraction guesses the abstraction and is costly to unwind.
- Recommend, do not impose: flag duplication as a finding with evidence; let the
  user decide whether the copies are truly one concept before extracting.

## SOLID (as a lens, language-appropriate)

- Single responsibility, open/closed, Liskov substitution, interface
  segregation, dependency inversion — applied where they reduce real change
  cost, not as ceremony.

## Tests (strategy, not coverage number)

- Unit tests for domain rules and edge cases.
- Integration tests at boundaries (DB, queue, external API).
- Contract tests for interfaces other systems depend on.
- Smoke / acceptance tests for critical user or deploy flows.
- The fastest, most specific test that can catch a given regression is the one
  to recommend.

## Operability

- Actionable logs, metrics, and alerts on the paths that matter.
- Safe deploy and rollback; changes have a recovery path.
- Failure modes are explicit and bounded (timeouts, retries, circuit breaking).

## Security

- Least privilege for identities, policies, and trust relationships.
- Secrets are referenced, never hardcoded; sensitive data is protected in
  transit and at rest.
- Trust boundaries are explicit; no accidental public exposure.
- Treat security as one quality lens here: record what the repo enforces (secret
  scan, dependency/IaC policy, auth tests) and link that enforcement; do not
  invent a vulnerability or impose a framework the repo does not use.

## Cost and performance

- Resources are right-sized; scaling is deliberate and has alarm coverage.
- Latency/throughput budgets exist for critical paths.
- Cost trade-offs (e.g. redundancy vs spend) are recorded as decisions.

## From rule to fitness function

For every quality rule worth keeping, classify enforcement (strongest first):

1. Already enforced — by type system, lint, test, CI, or policy. Link to it; do
   not restate.
2. Make it a fitness function — an automated, objective check that fails the
   build on violation (dependency-direction test, boundary test, latency budget,
   contract test, IaC policy). Propose it with the template in
   [templates.md](templates.md).
3. Review checklist item — only when no automated check is feasible; keep it in
   a discoverable doc and note why it cannot be automated.

A rule that matters enough to document usually matters enough to enforce. Prose
that no check protects will drift; flag it as the weakest option.

## Fitness-function catalog (examples, not prescriptions)

Starting points for common rule types. Use the repo's own tooling and name the
actual command; these are illustrative, not a required stack.

| Rule type | Example check |
|-----------|---------------|
| Dependency direction / layering | dependency-cruiser, ArchUnit, import-linter, ESLint `no-restricted-imports` |
| Public API / contract stability | OpenAPI/JSON-schema diff, consumer-driven contract tests, semver lint |
| IaC blast radius / policy | CI path filters, OPA/Conftest, Sentinel, `tflint`, Checkov |
| Secret leakage | gitleaks / trufflehog as a CI job (link it, do not restate the rule) |
| Performance / latency budget | k6/Lighthouse threshold gate, benchmark regression check |
| Test proximity / critical-path coverage | coverage gate scoped to the sensitive path, not a global number |
| Docs freshness | CI check that fails when code changes without its co-located doc |
