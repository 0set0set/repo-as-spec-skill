# repo-as-spec

A portable, harness-agnostic Agent Skill that transforms any repository into a
"repository as spec" workspace for AI agents. This file is the map for anyone
(human or agent) editing this skill repo itself.

## What this is
- An Agent Skill: a folder with `SKILL.md` (entry point) plus `references/`.
- Plain Markdown, no build step, no runtime dependencies.
- Harness-agnostic: works with Claude, Cursor, Codex, and other agents.

## How it is organized
- `SKILL.md` — metadata + the 6-step audit-and-transform workflow.
- `references/` — loaded on demand: `reference.md`, `templates.md`, `checklists.md`.
- `README.md`, `INSTALL.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `LICENSE`.

## How to "run" it
There is nothing to execute. Install per [INSTALL.md](INSTALL.md), then invoke
the `repo-as-spec` skill in your harness.

## How to verify changes
- `SKILL.md` body stays under 500 lines; frontmatter uses only `name`,
  `description`, `license`, `metadata`.
- All relative links resolve and reference files stay one level deep.
- Markdown renders cleanly; terminology is consistent.
- `CHANGELOG.md` updated under `[Unreleased]`.

## Hard constraints
- Do not add tool-specific frontmatter keys to `SKILL.md` (keep it cross-harness).
- Do not hardcode any single project's stack/rules as universal guidance.
- Follow SemVer and the authoring rules in [CONTRIBUTING.md](CONTRIBUTING.md).

## Where to look next
- Authoring + versioning: [CONTRIBUTING.md](CONTRIBUTING.md)
- The skill itself: [SKILL.md](SKILL.md)
