# Contributing

Thanks for improving `repo-as-spec`. This skill is plain Markdown, so
contributions are small and reviewable.

## Principles

- Concise is key. The agent is already smart — only add context it lacks.
- `SKILL.md` is the entry point; keep its body under 500 lines.
- Use progressive disclosure: detailed material lives in `references/`, loaded
  on demand. Keep reference links one level deep from `SKILL.md`.
- Stay harness-agnostic. Do not depend on a single tool's features in `SKILL.md`.
- Do not hardcode any specific project's stack or rules as universal guidance.

## SKILL.md frontmatter rules

Use only widely-supported keys so the skill loads in every harness:

- `name` (required): lowercase, hyphens, max 64 chars, must match the folder name.
- `description` (required): what it does AND when to use it, max 1024 chars, no
  angle brackets.
- `license` (optional): e.g. `MIT`.
- `metadata` (optional): string key/value pairs, e.g. `version`, `author`.

Avoid tool-specific frontmatter keys in `SKILL.md` (for example Cursor's
`disable-model-invocation`); document those as optional per-harness tweaks in
[INSTALL.md](INSTALL.md) instead.

## Making a change

1. Edit `SKILL.md` and/or files under `references/`.
2. Keep terminology consistent (e.g. always "AGENTS.md", "fresh session test").
3. If you add a file under `references/`, link it from
   [references/README.md](references/README.md) and `SKILL.md` (the checks
   enforce this).
4. Run the package checks from the package root and fix anything they flag:

   ```bash
   cd ../..            # the directory that holds package.json
   npm ci --ignore-scripts
   npm run check
   ```

You do not edit the changelog or the version by hand — see below.

## Versioning and releases

Releases are automated with [semantic-release](https://semantic-release.gitbook.io/)
driven by [Conventional Commits](https://www.conventionalcommits.org/). The
version follows [Semantic Versioning](https://semver.org/); your commit type
decides the bump:

- `fix:` -> PATCH (wording fixes, clarifications, link fixes).
- `feat:` -> MINOR (new templates, checklists, references, or backward-compatible
  workflow steps).
- `feat!:` / `fix!:` or a `BREAKING CHANGE:` footer -> MAJOR (alters the workflow
  contract or removes/renames artifacts).

On a release, semantic-release computes the next version, updates
[CHANGELOG.md](CHANGELOG.md), runs `scripts/sync-skill-version.mjs` to set
`metadata.version` in `SKILL.md`, commits, tags `vX.Y.Z`, and publishes to npm.
Do not bump the version, edit version sections of the changelog, or create tags
manually. The release workflow runs in the canonical upstream repository; this
tree is a working copy. Preview the next version locally with `npm run release:dry`.

## Supply chain

- Install with `npm ci --ignore-scripts` (the repo's `.npmrc` sets
  `ignore-scripts=true`). The checks and tests need no dependency lifecycle scripts.
- When pinning the skill for a consumer, pin a released tag rather than the
  default branch (`npx skills add .../tree/vX.Y.Z/skills/repo-as-spec`).

## Reporting issues

Describe the target-repo scenario, what the skill produced, and what was
expected. Concrete before/after examples are most useful.
