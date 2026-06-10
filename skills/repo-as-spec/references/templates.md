# Templates: Repository As Spec

Copy-ready file templates. Adapt to the target repo; replace every `{...}`
placeholder with real values discovered in Step 1. Do not invent values —
ask the user when a value is human-only knowledge.

## Artifact decision tree (pick the minimum)

Emit the fewest artifacts that close the gaps. Most repos need only a root
`AGENTS.md` plus, where warranted, one or two co-located docs. Match the signal
to the smallest artifact; escalate only when the signal demands it.

| Signal from the audit | Minimum artifact | Escalate to |
|-----------------------|------------------|-------------|
| Fresh session test has any blank/partial row | Root `AGENTS.md` (the map) | nested `AGENTS.md` per package in a monorepo |
| A module's responsibilities/interfaces are unclear | `ARCHITECTURE.md` co-located with that module | context map when several domains overlap |
| A MUST/MUST NOT rule is unenforced | `CONSTRAINTS.md` + a fitness-function proposal | ADR if the constraint is irreversible/costly |
| A reversible choice needs a record | `DECISIONS.md` entry | ADR once it is accepted and long-lived |
| A multi-quality trade-off needs reasoning | decision brief | ATAM-lite, then ADR |
| Verification gates are non-trivial | gate table inside `AGENTS.md` | `GATES.md` when >3 gates or init-first sequence |
| Long-running / multi-session work | `PROGRESS.md` | per-package `PROGRESS.md` |

Size ceiling: for a small repo (roughly < 5k LOC or a single root), do not exceed
a root `AGENTS.md`, at most one `ARCHITECTURE.md`/`CONSTRAINTS.md`, and a
`PROGRESS.md` only if work is ongoing. If an artifact would only restate enforced
content, link the source instead of creating the file.

## Root AGENTS.md (the map, ~50-100 lines)

Keep it short. It is a router, not an encyclopedia. Link to deeper docs.

```markdown
# {Project name}

{One or two sentences: what this system is and who/what it serves.}

## What this is
- Purpose: {what problem it solves}
- Stack: {language(s), framework(s), key tooling} {versions if pinned}
- Topology: {monorepo / service / library}; project roots live in {path pattern}

## How to run
- Setup: `{setup command}`
- Run locally: `{run command}`
- Build: `{build command}`

## How to verify
- Format: `{format command}`
- Lint: `{lint command}`
- Test: `{test command}`
- {Other required gates}: `{command}`
> Run these before finishing a change and fix failures.

## Safety / hard constraints
- {e.g. merging to `main` auto-deploys to production}
- {high-risk paths and what extra care they need}

## Where to look next
- Architecture: {links to ARCHITECTURE.md files}
- Constraints: {links to CONSTRAINTS.md}
- Decisions: {DECISIONS.md or docs/adr/}
- Current state: PROGRESS.md
- Conventions/rules: {link to rules dir or contributing guide}
```

## Module ARCHITECTURE.md (co-located with code)

```markdown
# {Module} architecture

## Responsibility
{What this module owns. What it explicitly does not own.}

## Interfaces
- Inputs: {APIs, events, inputs it accepts}
- Outputs: {what it produces / exposes}

## Dependencies
- Depends on: {modules/services} ({why})
- Depended on by: {callers}

## Constraints specific to this module
- {MUST / MUST NOT items unique to this code}

## Notes
{Non-obvious intent, trade-offs, gotchas.}
```

## CONSTRAINTS.md (hard rules in MUST / MUST NOT language)

```markdown
# Constraints: {scope}

## MUST
- MUST {non-negotiable rule, with the reason if non-obvious}

## MUST NOT
- MUST NOT {forbidden action, with the consequence it prevents}

## Verification
- Enforced by: {lint rule / test / CI job / review}
```

## DECISIONS.md (lightweight running log)

```markdown
# Decisions

## {YYYY-MM-DD} {short decision title}
- Decision: {what was decided}
- Why: {the reason / constraint it satisfies}
- Alternatives rejected: {options and why not}
- Consequences: {trade-offs accepted}
```

## ADR (MADR-style, one file per decision in docs/adr/)

Filename: `docs/adr/ADR-{NNN}-{kebab-title}.md`

```markdown
# ADR-{NNN} {Title}

Status: {Proposed | Accepted | Deprecated | Superseded by ADR-YYY}
Date: {YYYY-MM-DD}

## Context and problem statement
{Two or three sentences. Make the scope explicit.}

## Considered options
- {option 1}
- {option 2}

## Decision outcome
Chosen: "{option}", because {justification}.

### Consequences
- Good, because {positive consequence}
- Bad, because {negative consequence}
```

## Architecture decision brief (significant, evidence-backed change)

Use when a change is architecturally significant but a full ADR is not yet
warranted. Promote to an ADR once accepted. Cite sources and evidence levels.

```markdown
# Decision brief: {title}

- Business driver: {goal the change serves; ASK the user if not in the repo}
- Qualities affected: {security / reliability / modifiability / performance / cost / operability / testability}
- Options considered: {option A; option B; do nothing}
- Recommendation: {option}, because {reason grounded in evidence}
- Evidence: {file / command / commit SHA / PR #} ({direct | historical | derived})
- Risks / non-risks: {what could go wrong; what is explicitly fine}
- Verification: {fitness function or check that protects the decision}
```

## ATAM-lite evaluation (large trade-offs)

For decisions touching several quality attributes. Based on CMU SEI's ATAM,
compressed. See [architecture-lens.md](architecture-lens.md).

```markdown
# ATAM-lite: {decision}

- Business driver: {the goal architecture serves}
- Quality attribute scenarios:
  - {quality}: {stimulus} -> {response} -> {measure}
- Options considered: {list}
- Decision: {chosen option and why}
- Risks: {decisions that may not meet a scenario}
- Non-risks: {concerns confirmed safe}
- Sensitivity points: {small change, large quality impact}
- Trade-offs accepted: {improving X worsened Y, and why that is acceptable}
- Verification: {fitness function(s) / checks}
```

## Context map / bounded context inventory (DDD strategic design)

Use when multiple domains or teams meet and semantics drift. Each context has an
owner and a ubiquitous language; relationships explain how they integrate.

```markdown
# Context map

| Bounded context | Owner | Core concepts (ubiquitous language) | Integrates with | Relationship |
|-----------------|-------|-------------------------------------|-----------------|--------------|
| {context}       | {team}| {terms that mean one thing here}    | {context}       | {upstream/downstream, shared kernel, anti-corruption layer} |

## Shared / overloaded terms to resolve
- {term}: means {A} in {context X}, {B} in {context Y} — {resolution}
```

## Fitness function proposal (turn a rule into an enforced check)

For each documented architecture rule that is not already enforced. See
[quality-lenses.md](quality-lenses.md).

```markdown
# Fitness function: {rule it protects}

- Rule: {the constraint, e.g. "domain must not import infrastructure"}
- Currently enforced by: {nothing | review | partial}
- Proposed check: {dependency test / lint rule / CI job / IaC policy / contract test}
- How it runs: `{command or CI job}`
- Failure signal: {what a violation looks like in CI}
- If automation is infeasible: {why, and the review-checklist fallback}
```

## PROGRESS.md (durable cross-session state)

```markdown
# Progress

## Current focus
{The active objective in one or two sentences.}

## Done
- {completed item}

## In progress
- {item} — {state / where it stands}

## Blocked
- {item} — {blocker and what is needed to unblock}

## Next steps
1. {next concrete action}
```

## GATES.md (optional: the verification matrix)

```markdown
# Verification gates

| Gate | Local command | CI job | When required |
|------|---------------|--------|---------------|
| Format | `{cmd}` | `{job}` | every change |
| Lint | `{cmd}` | `{job}` | every change |
| Test | `{cmd}` | `{job}` | every change |
| {Security} | `{cmd or —}` | `{job}` | {condition} |
| {Build/Plan} | `{cmd}` | `{job}` | {condition} |

> Init-first: run `{init command}` before other operations, if required.
```

## Step 6 audit report (what to hand back)

Use this as the final message, not a committed file (unless the user wants it in
`PROGRESS.md`). Keep every claim traceable.

```markdown
# repo-as-spec audit report

## Scope
{project root(s) audited; lite or deep path; what was explicitly out of scope}

## Changes
- {file created/edited} — {one-line why, with the gap it closes}

## Verification
- Commands run: `{cmd}` -> {result}
- Fresh session test: {N}/5 answered (was {M}/5)
- Knowledge visibility gap: {before}% -> {after}%

## Still open (who must fill it)
- {gap} — human-only; needs {role/owner}

## Decay controls in place
- {co-location / verification command / update-with-code / proposed fitness function}

## Deferred (deep path)
- {architecture/history finding or fitness function proposed but not yet enforced}
```

## Monorepo guidance

- Put a nested `AGENTS.md` in each package/service root. The nearest file to the
  edited code wins, so each subproject ships tailored instructions.
- Keep the root `AGENTS.md` as the global map; let nested files cover specifics.
- Co-locate `ARCHITECTURE.md` / `CONSTRAINTS.md` / `PROGRESS.md` per package when
  the package is large enough to warrant its own state.
