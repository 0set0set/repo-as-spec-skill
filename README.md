# repo-as-spec

[![Skill](https://img.shields.io/badge/Agent-Skill-blue.svg)](https://agents.md/)
[![Version](https://img.shields.io/badge/version-0.1.0-informational.svg)](CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A portable, harness-agnostic Agent Skill that turns **any repository into a
"repository as spec"** workspace: a place where an AI agent can answer every key
question from the repo alone, without asking a human.

An agent only sees three things: its prompt, repository file contents, and tool
output. Knowledge in Slack, Confluence, tickets, or people's heads does not
exist for it. This skill audits a repo for missing knowledge and writes that
knowledge into the right files, close to the code it governs.

## What it does

Given a target repository, an agent using this skill will:

1. **Discover** existing knowledge (agent files, CI, quality gates, docs, structure).
2. **Audit** with the fresh session test — can the repo alone answer: what is
   this / how is it organized / how do I run it / how do I verify it / where are we?
3. **Resolve gaps** — derive what it can from the repo, and ask the user for
   human-only decisions instead of guessing.
4. **Write the map** — a short root `AGENTS.md`, co-located `ARCHITECTURE.md` /
   `CONSTRAINTS.md`, and durable state (`PROGRESS.md`, `DECISIONS.md` / ADRs).
5. **Verify** by re-running the fresh session test and the repo's real checks.
6. **Report** what changed, gaps left, and decay controls.

## Works with any harness

This is a plain-Markdown Agent Skill ([agents.md](https://agents.md) /
[agentskills.io](https://agentskills.io) conventions). It is not tied to any
single tool. See [INSTALL.md](INSTALL.md) for per-harness setup:

- Claude Code / Claude — `.claude/skills/`
- Cursor — `.cursor/skills/`
- Codex / AGENTS.md harnesses — `.agents/skills/` or reference from `AGENTS.md`
- Windsurf, OpenCode, and other agents that read Markdown skills

## Structure

```
repo-as-spec/
├── SKILL.md            # Entry point: metadata + the 6-step workflow
├── references/         # Loaded on demand (progressive disclosure)
│   ├── reference.md    # Theory + detailed discovery method
│   ├── templates.md    # Copy-ready AGENTS.md / ARCHITECTURE.md / etc.
│   └── checklists.md   # Fresh session test, gap audit, ACID, verification
├── AGENTS.md           # Map for contributors editing this skill repo
├── INSTALL.md          # Install across harnesses
├── CONTRIBUTING.md     # How to contribute and author changes
├── CHANGELOG.md        # Versioned history (SemVer + Keep a Changelog)
└── LICENSE             # MIT
```

## Usage

In any harness that has loaded the skill, ask it to apply `repo-as-spec`
to the current repository (or invoke by name where supported). The skill drives
the audit-and-transform workflow and asks you for any human-only knowledge it
cannot derive from the repo.

## Versioning

This skill follows [Semantic Versioning](https://semver.org/). The current
version lives in `SKILL.md` frontmatter (`metadata.version`) and in
[CHANGELOG.md](CHANGELOG.md).

## Credits and references

Built on the "repo as spec" / system-of-record ideas from:

- OpenAI — Harness Engineering (repo as spec, progressive disclosure, AGENTS.md
  as a table of contents).
- Anthropic — Effective harnesses for long-running agents (persistent state,
  handoff files, clean state, incremental progress).
- The [AGENTS.md](https://agents.md) open standard and ADR/MADR practices.

## License

[MIT](LICENSE).
