# repo-as-spec

A portable, harness-agnostic [Agent Skill](https://agentskills.io) that turns
**any repository into a "repository as spec"** workspace: a place where an AI
agent can answer every key question from the repo alone, without asking a human.

This repository is the distributable package for the skill. The skill itself
lives in [`skills/repo-as-spec/`](skills/repo-as-spec/).

## Install

```bash
# Latest from the default branch
npx skills add 0set0set/repo-as-spec-skill

# Pin to a released tag (reproducible)
npx skills add https://github.com/0set0set/repo-as-spec-skill/tree/v1.0.0/skills/repo-as-spec
```

`npx skills` ([vercel-labs/skills](https://github.com/vercel-labs/skills))
auto-detects your harness and installs into the right directory
(`.cursor/skills/`, `.claude/skills/`, `.codex/skills/`, and many more).

Manual install (no CLI): copy `skills/repo-as-spec/` into your harness skills
directory. See [`skills/repo-as-spec/INSTALL.md`](skills/repo-as-spec/INSTALL.md).

## What the skill does

Given a target repository, an agent using this skill will discover existing
knowledge, run a fresh-session audit, resolve gaps (asking the user for
human-only decisions), write a minimal map of co-located docs, verify with the
repo's real checks, and report. Full workflow:
[`skills/repo-as-spec/SKILL.md`](skills/repo-as-spec/SKILL.md).

## Repository layout

```
repo-as-spec/
├── skills/repo-as-spec/        # the skill (SKILL.md + references/ + docs)
├── scripts/                    # release version-sync + check:* validators (lib/ = pure logic)
├── test/                       # unit tests for the validators (node --test)
├── .releaserc.json             # semantic-release config
├── .npmrc                      # install hardening (ignore-scripts, min-release-age)
├── package.json                # npm metadata + local check/test scripts
├── package-lock.json
├── .gitignore
└── LICENSE
```

## Local checks

This package practises the mechanical-verification discipline the skill
recommends. Validate any edit before opening a PR:

```bash
cd poc
npm ci --ignore-scripts
npm run check
```

`npm run check` runs the unit tests plus content invariants: version
consistency across all sources, frontmatter rules, relative-link resolution,
`SKILL.md` size, and the `references/` index. See
[`CONTRIBUTING.md`](skills/repo-as-spec/CONTRIBUTING.md).

## Releases and versioning

Releases are driven by [semantic-release](https://semantic-release.gitbook.io/)
from Conventional Commits (config in [`.releaserc.json`](.releaserc.json)). On a
release it bumps `package.json`, runs [`scripts/sync-skill-version.mjs`](scripts/sync-skill-version.mjs)
to keep `SKILL.md` `metadata.version` in sync, updates the changelog, tags the
version, and publishes to npm.

The release **workflow** runs in the canonical upstream repository
([0set0set/repo-as-spec-skill](https://github.com/0set0set/repo-as-spec-skill)).
This `poc/` tree is the local working copy used to develop and review changes;
running `npm run release` here is not expected. Use `npm run release:dry` to
preview the next version locally.

Version history lives in [`skills/repo-as-spec/CHANGELOG.md`](skills/repo-as-spec/CHANGELOG.md).
Contributors: see [`CONTRIBUTING.md`](skills/repo-as-spec/CONTRIBUTING.md) for commit
conventions.

## License

[MIT](LICENSE).
