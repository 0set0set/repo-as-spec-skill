# Changelog

All notable changes to this skill are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-06-08

### Added
- Initial `repo-as-spec` skill with the 6-step audit-and-transform
  workflow (Discover, Audit, Resolve gaps, Write the map, Verify, Report).
- Output-quality core principles: add only net-new signal (link enforced
  sources instead of restating them) and ground every statement in a discovered
  file or command.
- Step 1 (Discover): extract latent, undocumented conventions by reading
  reference implementations and emitting an explicit "observed but not
  documented" list.
- Step 4 (Write the map): link-don't-restate rule, net-new-signal requirement,
  prioritize capturing observed-but-undocumented patterns, and verify CI/deploy
  claims against actual workflow files.
- Step 5 (Verify): a quality bar that rejects drafts which duplicate enforced
  content, make untraceable claims, leave Step 1 patterns uncaptured, contain
  generic filler, or misstate CI/deploy behavior.
- `references/reference.md`: theory, core concepts, and the detailed discovery
  method (Phase D derives structural conventions from real reference
  implementations, not config alone).
- `references/templates.md`: copy-ready templates for `AGENTS.md`,
  `ARCHITECTURE.md`, `CONSTRAINTS.md`, `DECISIONS.md`, ADR, `PROGRESS.md`, and
  `GATES.md`, plus monorepo guidance.
- `references/checklists.md`: fresh session test, knowledge visibility gap
  audit, "observed-but-not-documented patterns" inventory, ACID assessment, and
  verification/decay-prevention checklist.
- Open-source packaging: `README.md`, `LICENSE` (MIT), `CONTRIBUTING.md`,
  `INSTALL.md`, `AGENTS.md`, and this changelog.
- Harness-agnostic frontmatter (`name`, `description`, `license`,
  `metadata.version`) compatible with Claude, Cursor, Codex, and other agents.

[Unreleased]: https://example.com/repo-as-spec/compare/v0.1.0...HEAD
[0.1.0]: https://example.com/repo-as-spec/releases/tag/v0.1.0
