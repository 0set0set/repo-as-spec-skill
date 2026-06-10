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
- `references/` — loaded on demand (see [references/README.md](references/README.md)):
  - Lite path: `reference.md`, `templates.md`, `checklists.md`, `examples.md`.
  - Deep path: `architecture-lens.md`, `history-mining.md`, `quality-lenses.md`.
- `README.md`, `INSTALL.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `LICENSE`.

The npm packaging (`package.json`, `.releaserc.json`, `scripts/`, checks) lives
one level up in the package root, not inside this skill folder. The skill itself
is plain Markdown with no build step.

This skill does only one thing: transform a repository into a spec for AI agents
(the 6-step audit-and-transform workflow). It is not a security, supply-chain, or
testing standard — when an audit surfaces those concerns, it records them as
repo-specific constraints/gates and links the repo's own enforcement, rather than
shipping a domain standard of its own.

## How to "run" it
There is nothing to execute in the skill. Install per [INSTALL.md](INSTALL.md),
then invoke the `repo-as-spec` skill in your harness.

## How to verify changes
Run the package checks from the package root:

```bash
cd ../..        # the package root that holds package.json
npm ci --ignore-scripts
npm run check   # unit tests + content/security invariants
```

`npm run check` mechanically enforces what used to be a manual checklist:
- `SKILL.md` body stays under 500 lines; frontmatter uses only `name`,
  `description`, `license`, `metadata` (no harness-specific keys).
- Version is consistent across all five sources: `package.json`, `SKILL.md`
  `metadata.version`, the README badge, and the `tree/vX.Y.Z` install pins in
  `README.md` and `INSTALL.md`.
- All relative Markdown links resolve and reference files stay one level deep.
- Every file in `references/` is indexed in `references/README.md` and linked
  from `SKILL.md`.

## Hard constraints
- Do not add tool-specific frontmatter keys to `SKILL.md` (keep it cross-harness).
- Do not hardcode any single project's stack/rules as universal guidance.
- Follow SemVer and the authoring rules in [CONTRIBUTING.md](CONTRIBUTING.md).

## Where to look next
- Authoring + versioning: [CONTRIBUTING.md](CONTRIBUTING.md)
- The skill itself: [SKILL.md](SKILL.md)
