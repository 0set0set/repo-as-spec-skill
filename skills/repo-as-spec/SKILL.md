---
name: repo-as-spec
description: Transform any repository into a "repository as spec" workspace for AI agents by auditing what knowledge is missing and writing it into discoverable, co-located files (AGENTS.md, ARCHITECTURE.md, CONSTRAINTS.md, DECISIONS.md, PROGRESS.md, verification gates). Use when the user wants to make a repo the single source of truth, run a fresh-session/repo-as-spec audit, reduce the knowledge visibility gap, set up an agent harness, or onboard agents to a codebase.
license: MIT
metadata:
  version: 0.1.0
  author: repo-as-spec contributors
---

# Repository As Spec

Make the repository self-sufficient for an AI agent. An agent has only three
inputs: its prompt, repository file contents, and tool output. Anything in
Slack, Confluence, Jira, tickets, or someone's head does not exist for it.
This skill audits a repo for missing knowledge and writes that knowledge into
the right files so a fresh session can work without asking a human.

Core principles (apply throughout):

- Knowledge lives next to the code it governs. Proximity beats length.
- The entry file (`AGENTS.md`) is a short map, not an encyclopedia (~50-100 lines).
- Minimal but complete: every rule earns its place; every fresh-session question has an answer.
- Prefer mechanical checks (lint, tests, CI) over remembered prose rules.
- Do NOT invent architecture or decisions. If knowledge is human-only and not
  in the repo, ask the user before writing it down.
- Add only net-new signal. If a rule is already enforced by a rules file, CI, or
  lint, link to it as authoritative; do not restate it. Duplicated prose decays
  and ends up contradicting the source it copied.
- Ground every statement in a discovered file or command. If you cannot point to
  where a fact comes from in the repo, do not write it down.

## Workflow

Copy this checklist and track progress:

```
Repo-as-spec progress:
- [ ] Step 1: Discover (read-only inventory)
- [ ] Step 2: Audit (fresh session test + visibility gap)
- [ ] Step 3: Resolve gaps (ask user for human-only knowledge)
- [ ] Step 4: Write the map (minimal set of repo files)
- [ ] Step 5: Verify (re-run fresh session test, run real checks)
- [ ] Step 6: Report (what changed, gaps left, decay controls)
```

### Step 1: Discover (read-only)

Inventory existing knowledge before writing anything. Look for, in this order
of authority (highest wins on conflict):

1. Agent/governance files: `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, `.github/copilot-instructions.md`
2. CI/CD contracts: `.github/workflows/`, `Jenkinsfile`, `.gitlab-ci.yml`, `azure-pipelines.yml`
3. Local quality gates: `.pre-commit-config.yaml`, `Makefile`, `justfile`, `Taskfile.yml`, `package.json` scripts
4. Tool policy: `.eslintrc*`, `ruff.toml`, `.tflint.hcl`, `golangci.yml`, etc.
5. Formatting baseline: `.editorconfig`
6. Version pins: `.nvmrc`, `.python-version`, `.terraform-version`, `mise.toml`, `Dockerfile`
7. Ops entrypoints: wrapper scripts (`*-ops.sh`, `scripts/`, `bin/`), `Makefile`
8. Human context: `README*`, `CONTRIBUTING*`, `docs/`, module READMEs, `CODEOWNERS`
9. Structure: directory topology, project-root markers, reference implementations

Also detect: primary language/stack, project roots (the directory unit that
builds/deploys), and any high-risk/auto-deploy paths.

Then extract latent (undocumented) conventions. Explicit config rarely captures
how the repo is actually built. Read 2-3 reference implementations (the "golden"
module/package or the closest sibling project root) and record the patterns they
follow consistently but that are written down nowhere: file layout per concern,
naming, tagging, required blocks, protective/lifecycle patterns, alert/monitoring
wiring, shared-dependency lookups. Produce an explicit list titled "patterns
observed in code but not documented" — these are the highest-value items to
surface, because the audit's blanks alone will not reveal them.

For the detailed discovery method see [references/reference.md](references/reference.md).

### Step 2: Audit

Run the fresh session test. Using ONLY repo contents, can you answer:

1. What is this system?
2. How is it organized?
3. How do I run it?
4. How do I verify it?
5. Where are we now (current state / progress)?

For each, record: answered / partial / blank, and which file answers it.
Then estimate the knowledge visibility gap (share of important decisions and
constraints that are NOT in the repo). Use [references/checklists.md](references/checklists.md)
for the audit forms.

### Step 3: Resolve gaps

For each blank or stale item:

- If the answer is derivable from the repo (commands, structure, tooling),
  plan to write it.
- If the answer is human-only knowledge (why a decision was made, an undocumented
  constraint, deploy boundaries), ASK the user. Never guess architecture or
  invent constraints. Present concrete questions for the specific gaps found.

### Step 4: Write the map

Add or update the SMALLEST useful set of files. Prefer editing existing files
over creating new ones. Copy-ready templates are in [references/templates.md](references/templates.md).

- Root `AGENTS.md`: short router answering "what / run / verify" with links to
  deeper docs. Keep it ~50-100 lines. Do not duplicate content that already
  lives in `README` or rules; link instead.
- Co-located docs near important code:
  - `ARCHITECTURE.md` in a module/dir: responsibilities, interfaces, dependencies.
  - `CONSTRAINTS.md` near sensitive code: explicit MUST / MUST NOT.
- Durable state and rationale:
  - `PROGRESS.md`: done / in-progress / blocked / next steps.
  - `DECISIONS.md` or `docs/adr/ADR-XXX-*.md`: why decisions were made.
- Verification: ensure the real commands (test, lint, build, check) are written
  down where the agent will see them — ideally referenced from `AGENTS.md`.

Rules while writing:
- Reuse the repo's actual command names and tooling. Do not invent commands.
- If a wrapper/ops script is the canonical entrypoint, document that, not the
  raw underlying tool.
- In monorepos, use nested `AGENTS.md` per package; the nearest file to the
  edited code takes precedence.
- Do not migrate always-on rule files (e.g. `.cursor/rules/*`) into this skill's
  artifacts; reference them as authoritative instead.
- Link, do not restate. If `.cursor/rules/*`, CI workflows, lint configs, or
  `README` already define or enforce something, point to that file as the
  source of truth instead of copying its content. A new doc must contain only
  what is NOT already captured and enforced elsewhere.
- Every line must earn its place with net-new, repo-specific signal. Delete any
  sentence that would be equally true of an unrelated repository.
- Prioritize writing down the "observed but not documented" patterns from
  Step 1 — that is the knowledge the audit cannot otherwise recover.
- Verify claims about CI/deploy/path-filter behavior against the actual workflow
  files. Do not paraphrase pipeline behavior from memory.

### Step 5: Verify

- Re-run the fresh session test mentally against the new files; every question
  must now resolve to a file.
- Run the repo's real, non-destructive checks if available (format, lint,
  validate, tests). Use the canonical entrypoint discovered in Step 1.
- Do NOT run destructive or deploy commands (apply, push, migrations).
- If a required check cannot be run, report the blocker and the exact command a
  human must run.

Quality bar — reject and revise the draft if any of these fail:
- No artifact restates content already enforced by a rules file, CI, or lint; it
  links to that source instead.
- Every non-trivial claim is traceable to a specific repo file or command.
- The "observed but not documented" patterns from Step 1 are now captured in a
  discoverable file.
- No generic filler that would apply to any repository.
- All CI/deploy/path-filter statements match the actual workflow files.

### Step 6: Report

Report: what changed and why, validation results (commands run + outcomes),
remaining knowledge gaps and who must fill them, and the decay controls in
place (docs co-located with code, verification commands, update-with-code
expectation).

## Managing agent state (ACID)

When the skill also sets up state for long-running work, apply:

- Atomicity: one logical change = one commit; roll back cleanly if it fails.
- Consistency: define a "consistent state" predicate (tests pass, lint clean);
  don't leave the repo in a broken intermediate state.
- Isolation: concurrent agents use separate progress files or branches.
- Durability: cross-session knowledge must be in git-tracked files, not memory.

## Anti-patterns

- A monolithic `AGENTS.md` that lists everything ("when everything is important,
  nothing is").
- Writing decisions the user never confirmed (invented rationale).
- Docs that drift from code: stale docs are worse than none. Bind updates to code.
- Duplicating rule/CI content into prose instead of linking to the enforced source.

## Additional resources

- Theory and discovery method: [references/reference.md](references/reference.md)
- Copy-ready file templates: [references/templates.md](references/templates.md)
- Audit and verification checklists: [references/checklists.md](references/checklists.md)
- Install across harnesses (Claude, Cursor, Codex, etc.): [INSTALL.md](INSTALL.md)
