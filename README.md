# repo-as-spec

A portable, harness-agnostic [Agent Skill](https://agentskills.io) that turns
**any repository into a "repository as spec"** workspace: a place where an AI
agent can answer every key question from the repo alone, without asking a human.

This repository is the distributable package for the skill. The skill itself
lives in [`skills/repo-as-spec/`](skills/repo-as-spec/).

## Install

```bash
# Latest from the default branch
npx skills add 0set0set/repo-as-spec

# Pin to a released tag (reproducible)
npx skills add https://github.com/0set0set/repo-as-spec/tree/v0.1.0/skills/repo-as-spec
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
├── scripts/sync-skill-version.mjs
├── .releaserc.json             # semantic-release config
├── .github/workflows/release.yml
├── package.json
└── LICENSE
```

## Releases and versioning

Version history lives in [`skills/repo-as-spec/CHANGELOG.md`](skills/repo-as-spec/CHANGELOG.md).
Contributors: see [`CONTRIBUTING.md`](skills/repo-as-spec/CONTRIBUTING.md) for commit
conventions.

## License

[MIT](LICENSE).
