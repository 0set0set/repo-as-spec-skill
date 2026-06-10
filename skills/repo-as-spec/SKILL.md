---
name: repo-as-spec
description: Transform any repository into a "repository as spec" workspace for AI agents by auditing what knowledge is missing and writing it into discoverable, co-located files (AGENTS.md, ARCHITECTURE.md, CONSTRAINTS.md, DECISIONS.md, PROGRESS.md, verification gates). Use when the user wants to make a repo the single source of truth, run a fresh-session/repo-as-spec audit, reduce the knowledge visibility gap, set up an agent harness, or onboard agents to a codebase.
license: MIT
metadata:
  version: 1.1.2
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
- Label evidence strength. Every claim is direct (code/config/CI/tests),
  historical (cited commit/PR), derived (a pattern inferred from several
  examples), or human-only (must ask). Do not present a guess as a fact.

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

First, confirm scope. Audit the project root(s) the user named; if they only
said "this repo", default to the roots discovered below and state which ones you
will cover. In a monorepo, do not silently audit every package or expand to the
whole tree — name the scope and proceed.

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

For the detailed discovery method and discovery inventory forms see
[references/reference.md](references/reference.md) and
[references/checklists.md](references/checklists.md). Record source conflicts
(README vs rule vs CI) in the authority conflict log instead of resolving them
by preference; the order above decides the winner, and human-only conflicts go
to the user in Step 3.

This is the **lite path**. Run the **deep path** (architecture + history) only
when at least one trigger fires; otherwise skip it. Keep it scoped to the gaps
the audit finds and never impose a style:

- Run [architecture-lens.md](references/architecture-lens.md) if ANY: more than
  one project root or a monorepo; a CI path that deploys to production; or more
  than three significant trade-offs left blank in the audit.
- Run [history-mining.md](references/history-mining.md) (read-only) if ANY:
  rationale is blank for a listed trade-off; a high-churn path has no
  architecture/decision doc; or recent incident/drift commits touch sensitive
  paths. Stop criterion: mine only the specific gaps found — cap the dig at a
  few commits/PRs per gap and never mine the whole history "for completeness".
- Use [quality-lenses.md](references/quality-lenses.md) to judge a specific rule
  and decide its enforcement.

See [references/README.md](references/README.md) for which reference to open.

### Step 2: Audit

Run the fresh session test. Using ONLY repo contents, can you answer:

1. What is this system?
2. How is it organized?
3. How do I run it?
4. How do I verify it?
5. Where are we now (current state / progress)?

For each, record: answered / partial / blank, and which file answers it.
Then estimate the knowledge visibility gap (share of important decisions and
constraints that are NOT in the repo); the target is below ~10%. Sample at
least ~15 items in a medium repo and weight each by how irreversible and
how frequently touched it is, so three trivial items cannot mask a real gap.
Audit two dimensions: operational visibility (what / run / verify / state) and
decision visibility (why the significant trade-offs were made, and whether they
are enforced). Use [references/checklists.md](references/checklists.md) for the
audit forms and the gap protocol.

### Step 3: Resolve gaps

For each blank or stale item:

- If the answer is derivable from the repo (commands, structure, tooling),
  plan to write it.
- If the answer is human-only knowledge (why a decision was made, an undocumented
  constraint, deploy boundaries), ASK the user. Never guess architecture or
  invent constraints. Present concrete questions for the specific gaps found.

Format each question so the user can answer fast: state the gap, the evidence
you already found, and the artifact the answer will land in. Batch related
questions into one round. If the user does not answer, do not guess — record the
item as `human-only` and unresolved in `PROGRESS.md` and report it in Step 6.

### Step 4: Write the map

Add or update the SMALLEST useful set of files. Prefer editing existing files
over creating new ones. Pick artifacts with the decision tree in
[references/templates.md](references/templates.md) (which also has the
copy-ready templates) — do not emit every artifact for a small repo.

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
  down where the agent will see them — ideally referenced from `AGENTS.md`. Keep
  a short gate table in `AGENTS.md`; only add a separate `GATES.md` when the
  matrix is large (more than ~3 gates or a non-trivial init-first sequence).

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
- Record decisions and quality constraints only when evidence supports them.
  Cite the source (file, command, or commit/PR) and its evidence level; never
  write a recovered motivation as fact unless the source is specific.
- For every rule worth keeping, prefer a fitness function (an automated check)
  over prose. If it is already enforced, link to it; if it can be automated,
  propose the check; only fall back to a review-checklist item when neither is
  feasible. See [references/quality-lenses.md](references/quality-lenses.md).

### Step 5: Verify

- Re-fill the fresh session test table in [references/checklists.md](references/checklists.md)
  against the new files; every row must be `answered` with a concrete file path.
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
- Every non-obvious claim carries its evidence level; no guess is stated as fact.
- Recovered rationale (from history) cites a commit/PR; no architecture style is
  prescribed as universal.
- Documented architecture rules either link to an existing enforcement, propose a
  fitness function, or justify why they stay a review-checklist item.

### Step 6: Report

Report: what changed and why, validation results (commands run + outcomes),
remaining knowledge gaps and who must fill them, and the decay controls in
place (docs co-located with code, verification commands, update-with-code
expectation). Use the Step 6 report scaffold in
[references/templates.md](references/templates.md) so every report has the same
sections.

## Managing agent state (ACID)

Skip this for a one-shot audit. Apply it only on the long-running path — when
the skill also sets up state for ongoing, multi-session work:

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

- Which reference to read, and when: [references/README.md](references/README.md)
- Theory and discovery method: [references/reference.md](references/reference.md)
- Artifact decision tree and copy-ready templates: [references/templates.md](references/templates.md)
- Discovery, audit, gap, and report forms: [references/checklists.md](references/checklists.md)
- Worked before/after audit examples: [references/examples.md](references/examples.md)
- Architecture style, quality attributes, trade-offs, ATAM-lite: [references/architecture-lens.md](references/architecture-lens.md)
- Read-only Git/PR archaeology and evidence rules: [references/history-mining.md](references/history-mining.md)
- Quality lenses and fitness-function guidance: [references/quality-lenses.md](references/quality-lenses.md)
- Install across harnesses (Claude, Cursor, Codex, etc.): [INSTALL.md](INSTALL.md)
