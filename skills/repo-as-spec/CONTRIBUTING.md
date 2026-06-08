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
3. Verify Markdown renders and that all relative links resolve.
4. Update [CHANGELOG.md](CHANGELOG.md) under `[Unreleased]`.

## Versioning policy

Follow [Semantic Versioning](https://semver.org/):

- PATCH: wording fixes, clarifications, link fixes.
- MINOR: new templates, checklists, or workflow steps that are backward compatible.
- MAJOR: changes that alter the workflow contract or remove/rename artifacts.

On release, move `[Unreleased]` entries under a new version heading in
`CHANGELOG.md`, bump `metadata.version` in `SKILL.md`, and tag `vX.Y.Z`.

## Reporting issues

Describe the target-repo scenario, what the skill produced, and what was
expected. Concrete before/after examples are most useful.
