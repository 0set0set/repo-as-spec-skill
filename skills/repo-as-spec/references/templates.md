# Templates: Repository As Spec

Copy-ready file templates. Adapt to the target repo; replace every `{...}`
placeholder with real values discovered in Step 1. Do not invent values —
ask the user when a value is human-only knowledge.

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

## Monorepo guidance

- Put a nested `AGENTS.md` in each package/service root. The nearest file to the
  edited code wins, so each subproject ships tailored instructions.
- Keep the root `AGENTS.md` as the global map; let nested files cover specifics.
- Co-locate `ARCHITECTURE.md` / `CONSTRAINTS.md` / `PROGRESS.md` per package when
  the package is large enough to warrant its own state.
