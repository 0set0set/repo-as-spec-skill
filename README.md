# repo-as-spec

[![npm version](https://img.shields.io/npm/v/repo-as-spec.svg)](https://www.npmjs.com/package/repo-as-spec)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![semantic-release](https://img.shields.io/badge/semantic--release-conventional%20commits-e10079.svg)](https://semantic-release.gitbook.io/)
[![Agent Skill](https://img.shields.io/badge/Agent-Skill-blue.svg)](https://agents.md/)

A portable, harness-agnostic [Agent Skill](https://agentskills.io) that turns
**any repository into a "repository as spec"** workspace: a place where an AI
agent can answer every key question from the repo alone, without asking a human.

> An agent only sees three things: its prompt, repository file contents, and
> tool output. Knowledge in Slack, Confluence, tickets, or people's heads does
> not exist for it. This skill audits a repo for that missing knowledge and
> writes it into the right files, close to the code it governs.

This repository is the **distributable package** for the skill. The skill
itself — plain Markdown, no build step, no runtime dependencies — lives in
[`skills/repo-as-spec/`](skills/repo-as-spec/).

## Table of contents

- [Quick start](#quick-start)
- [What the skill does](#what-the-skill-does)
- [Design principles](#design-principles)
- [Repository layout](#repository-layout)
- [Developing the skill](#developing-the-skill)
- [Releases and versioning](#releases-and-versioning)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

## Quick start

Install with the [`npx skills` CLI](https://github.com/vercel-labs/skills),
which auto-detects your harness and copies the skill into the right directory
(`.cursor/skills/`, `.claude/skills/`, `.codex/skills/`, and many more):

```bash
# Latest from the default branch
npx skills add 0set0set/repo-as-spec-skill

# Pin to a released tag (reproducible)
npx skills add https://github.com/0set0set/repo-as-spec-skill/tree/v1.0.0/skills/repo-as-spec
```

No CLI? Copy `skills/repo-as-spec/` into your harness skills directory — see
[`INSTALL.md`](skills/repo-as-spec/INSTALL.md) for per-harness paths and notes.

Then ask your agent to apply `repo-as-spec` to the current repository. It will
start with the read-only discovery step and produce a fresh-session-test
checklist.

## What the skill does

Given a target repository, an agent using this skill runs a 6-step
audit-and-transform workflow:

| Step | What happens |
|------|--------------|
| 1. Discover | Read-only inventory of existing knowledge: agent files, CI contracts, quality gates, docs, structure, and the patterns the code follows but nothing documents |
| 2. Audit | The *fresh session test*: can the repo alone answer what / how organized / how to run / how to verify / where are we? Estimate the knowledge visibility gap |
| 3. Resolve gaps | Derive what the repo can prove; **ask the user** for human-only knowledge instead of guessing |
| 4. Write the map | The smallest useful set of files: a short root `AGENTS.md` router plus co-located `ARCHITECTURE.md` / `CONSTRAINTS.md` / `DECISIONS.md` / `PROGRESS.md` |
| 5. Verify | Re-run the fresh session test; run the repo's real, non-destructive checks |
| 6. Report | What changed, gaps left and who must fill them, decay controls in place |

Full workflow and rules: [`skills/repo-as-spec/SKILL.md`](skills/repo-as-spec/SKILL.md).

## Design principles

These govern both the skill's output *and* how this repository is built:

- **Repo as the system of record.** If knowledge is not in a versioned file,
  the agent cannot see it — so for practical purposes it does not exist.
- **Progressive disclosure.** `SKILL.md` is a short entry point; detailed
  material lives in `references/` and is loaded only when a step needs it.
- **Link, don't restate.** If a rule is already enforced by CI, lint, or a
  rules file, the skill points at that source instead of copying it. Duplicated
  prose decays and ends up contradicting what it copied.
- **Evidence over assertion.** Every claim the skill writes is tagged direct /
  historical / derived / human-only. Guesses are never recorded as facts.
- **Mechanical checks over remembered rules.** Everything that can be enforced
  by a script is (`npm run check`); prose conventions are the fallback, not the
  default.
- **Harness-agnostic.** Plain Markdown following the
  [agents.md](https://agents.md) / [agentskills.io](https://agentskills.io)
  conventions; no tool-specific frontmatter keys in `SKILL.md`.

## Repository layout

```
repo-as-spec/
├── skills/repo-as-spec/        # the skill itself (what gets installed)
│   ├── SKILL.md                # entry point: metadata + the 6-step workflow
│   ├── references/             # on-demand material (theory, templates, checklists, lenses)
│   ├── AGENTS.md               # map for agents editing this skill repo
│   ├── INSTALL.md              # per-harness install guide
│   ├── CONTRIBUTING.md         # authoring rules + commit conventions
│   └── CHANGELOG.md            # generated by semantic-release — do not edit
├── scripts/                    # check:* validators + release version-sync (lib/ = pure logic)
├── test/                       # unit tests for the validators (node --test, zero deps)
├── .releaserc.json             # semantic-release config
├── .npmrc                      # install hardening (ignore-scripts, min-release-age)
├── package.json                # npm metadata + check/test scripts
└── LICENSE
```

The package boundary is deliberate: everything under `skills/repo-as-spec/` is
content an agent consumes; everything outside it is tooling that keeps that
content consistent and releasable.

## Developing the skill

Requirements: Node >= 22 (see `engines` in [`package.json`](package.json)).

```bash
npm ci --ignore-scripts   # the repo's .npmrc enforces ignore-scripts anyway
npm run check             # the full gate: unit tests + content invariants
```

`npm run check` is the single pre-PR gate. It runs the unit tests plus the
content invariants that keep the skill coherent:

| Check | Enforces |
|-------|----------|
| `test` | Unit tests for the validator/release logic (`node --test`, no test framework dependency) |
| `check:version` | One version across all five sources: `package.json`, `SKILL.md` metadata, the README badge, and every pinned install example |
| `check:frontmatter` | `SKILL.md` frontmatter uses only cross-harness keys (`name`, `description`, `license`, `metadata`) |
| `check:links` | Every relative Markdown link resolves; references stay one level deep from `SKILL.md` |
| `check:skill-size` | `SKILL.md` body stays under 500 lines (progressive-disclosure budget) |
| `check:references` | Every file in `references/` is indexed in its README and linked from `SKILL.md` |

These checks exist because this package practises the discipline the skill
recommends: prefer a mechanical check over a rule someone has to remember.

Authoring rules (frontmatter constraints, terminology, when to add a reference
file) live in [`CONTRIBUTING.md`](skills/repo-as-spec/CONTRIBUTING.md).

## Releases and versioning

Releases are fully automated — **never bump versions, edit the changelog, or
tag by hand.**

- [semantic-release](https://semantic-release.gitbook.io/) computes the next
  [SemVer](https://semver.org/) version from
  [Conventional Commits](https://www.conventionalcommits.org/):
  `fix:` → patch, `feat:` → minor, `BREAKING CHANGE` → major.
- On release it updates the changelog, runs
  [`scripts/sync-skill-version.mjs`](scripts/sync-skill-version.mjs) to rewrite
  every versioned source in lockstep (so a tag can never ship a half-updated
  set of version strings), tags `vX.Y.Z`, and publishes to npm.
- The release workflow runs only in the canonical upstream repository
  ([0set0set/repo-as-spec-skill](https://github.com/0set0set/repo-as-spec-skill)).
  Preview the next version locally with `npm run release:dry`.

Version history: [`CHANGELOG.md`](skills/repo-as-spec/CHANGELOG.md).

## Contributing

Contributions are welcome — the skill is plain Markdown, so changes are small
and reviewable.

1. Read [`CONTRIBUTING.md`](skills/repo-as-spec/CONTRIBUTING.md) for authoring
   and commit conventions.
2. Make your change; keep `SKILL.md` lean and put detail in `references/`.
3. Run `npm run check` and fix anything it flags.
4. Open a PR with a Conventional Commit title — the commit type drives the
   release.

Good first contributions: sharpening a checklist, adding a worked example to
[`references/examples.md`](skills/repo-as-spec/references/examples.md), or
improving a template in
[`references/templates.md`](skills/repo-as-spec/references/templates.md).

## Credits

Built on the "repo as spec" / system-of-record ideas from:

- OpenAI — Harness Engineering: repo as spec, progressive disclosure,
  `AGENTS.md` as a table of contents, mechanical invariant enforcement.
- Anthropic — Effective harnesses for long-running agents: persistent state,
  handoff files, incremental progress.
- The [AGENTS.md](https://agents.md) open standard and ADR/MADR practices.

## License

[MIT](LICENSE).
