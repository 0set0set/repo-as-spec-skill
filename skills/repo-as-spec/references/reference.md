# Reference: Repository As Spec

Theory and discovery method behind the skill. Read on demand.

## Why the repo must be the system of record

An AI agent has exactly three sources of input: its system prompt and task
description, file contents from the repository, and tool execution output. It
cannot ask a colleague, search chat logs, or open a Confluence page. If a rule
is not in the repository, the agent cannot see it, so for practical purposes it
does not exist.

OpenAI's harness engineering work calls this "repo as spec": the repository is
the highest-authority specification. Anthropic's long-running agent work makes
the complementary point: persistent, recoverable state in the repository is a
necessary condition for continuity across sessions. Both converge on the same
conclusion: push team knowledge into versioned, co-located repository artifacts.

## Core concepts

- Knowledge visibility gap: the share of important project knowledge that is NOT
  in the repo. Bigger gap, higher failure rate. Target: below ~10%.
- System of record: the repo is the authoritative source for decisions,
  architecture constraints, execution state, and verification standards.
- Fresh session test: can a brand-new session, given only the repo, answer the
  five questions (what / organized / run / verify / where are we)?
- Discovery cost: context budget burned to find a key fact. Critical info should
  be seen first, not buried ten directories deep.
- Knowledge decay rate: share of repo knowledge that goes stale per unit time.
  Out-of-date docs are worse than none; they mislead confidently.
- Progressive disclosure: a small stable entry point (`AGENTS.md`) points to
  deeper docs the agent reads only when the task needs them.
- Evidence level: the strength behind a claim — direct (code/config/CI/tests),
  historical (cited commit/PR), derived (inferred from several examples), or
  human-only (must ask). Writing a guess as a fact is the main hallucination
  risk; tag claims before recording them (see [checklists.md](checklists.md)).
- Decision visibility: separate from operational visibility — whether the *why*
  behind significant trade-offs is captured and enforced, not just how to run.

## Principles for drawing the map

1. Knowledge lives next to code. A rule about API auth belongs next to the API
   code. The module directory is a natural index — reaching the code reaches the
   constraint, no searching required.
2. Standardized entry file. `AGENTS.md` (or `CLAUDE.md`) is the landing page.
   It must let the agent answer "what is this", "how do I run it", "how do I
   verify it". 50-100 lines.
3. Minimal but complete. If removing a rule does not change decision quality, it
   should not exist. But every fresh-session question must have an answer.
4. Update with code. Bind knowledge updates to code changes. Co-locating docs in
   the module directory means editing the code surfaces the doc; CI can remind.

## AGENTS.md conventions

- Plain Markdown, no required fields. Filename is exactly `AGENTS.md`.
- Lives at repo root and/or any subdirectory/package root.
- Precedence (highest first): explicit user chat instruction > nearest
  `AGENTS.md` to the edited file > parent directory `AGENTS.md` > repo root.
- Monorepos use many nested files; the closest to the edited code wins.
- Vendor-neutral and read by many agents (Codex, Cursor, Copilot, Gemini, etc.).
- List the real verification commands; agents will run them and fix failures.

## Discovery method (Step 1 detail)

Phase A — Inventory (read-only):
- List root and hidden config: agent files, `.github/`, pre-commit, editorconfig,
  version pins, ops scripts.
- Detect primary language/stack from extensions and manifests.
- Map directory topology and infer project roots (the unit that builds/deploys).
- Find reference implementations (golden module, example service, sibling app).

Phase B — Extract enforceable contracts:
- Parse CI workflows: triggers (branch, path filters), jobs, required checks,
  deploy-on-merge behavior, secrets/roles used.
- Parse pre-commit/lint configs: exact hooks, args, config paths.
- Identify the canonical CLI/entrypoint (use the wrapper if one exists; do not
  call the underlying tool directly when a wrapper is canonical).

Phase C — Safety and blast radius:
- Extract high-risk/production paths and auto-deploy rules.
- Note protective settings (e.g. delete protection, ignored/managed attributes,
  import/adoption blocks) and secret handling.

Phase D — Structural conventions (derive from real code, not just config):
- Open 2-3 reference implementations (golden module, example service, closest
  sibling project root) and read them end to end.
- Derive the conventions they consistently follow: file-placement rules per
  concern, naming/tagging standards, required files/blocks for a new component,
  protective/lifecycle patterns, shared-dependency lookups, alert/monitoring
  wiring.
- Emit an explicit "observed but not documented" list: conventions the code
  obeys uniformly that no rule, README, or config states. These are the
  highest-value items to capture, since the fresh-session audit will not surface
  them. Anything already enforced by a rule/CI/lint is linked, not re-derived.

Phase E — Quality gate matrix:
- Build a table: Gate -> local command -> CI job -> when required.
- Record any init-first requirement before other operations.

Phase F — Architecture and decision intelligence (deep path; run only when a
trigger in SKILL.md Step 1 fires, e.g. multiple roots, production-deploy CI, or
unexplained trade-offs/rationale gaps):
- Infer the architecture style, boundaries, optimized quality attributes, risk
  hotspots, and trade-off points with [architecture-lens.md](architecture-lens.md).
  Do not prescribe a style the repo does not use.
- Quality attribute discovery: read where the repo spends effort (tests, alarms,
  guards, reviews, IaC policy) to infer which qualities it actually optimizes
  for; state the priorities and their evidence, and ask the user when priorities
  depend on business goals.
- Decision mining: recover the *why* behind significant trade-offs read-only
  from Git/PR metadata using [history-mining.md](history-mining.md); cite
  commit SHAs / PR numbers and label evidence strength. Never write a recovered
  motivation as fact when the source is vague.
- Architecture drift detection: compare the documented/intended boundaries and
  constraints against what the code and history actually show (e.g. a rule that
  code violates, an incident that recurs, a boundary bypassed). Flag drift and
  prefer a fitness function over prose (see [quality-lenses.md](quality-lenses.md)).

Phase G — Discovery outputs (intermediate, not the final spec):
Discovery ends with work products, not published docs. Writing the spec happens
in SKILL.md Step 4, after the user has answered any human-only gaps in Step 3.
Produce only:
- The filled discovery inventory and fresh session test (see checklists.md).
- The "observed but not documented" list and the knowledge visibility gap.
- The authority conflict log: where README, a rule, CI, or code disagree. Record
  the conflict and the winner per the authority order; never auto-resolve a
  human-only conflict — it becomes a Step 3 question.
- For deep-path runs, the architecture/trade-off and decision-gap findings with
  evidence levels, ready to feed templates in Step 4.

## Decay controls

Docs that drift are worse than none. Bind knowledge to code so it cannot rot
silently:

- Co-locate: a doc next to the code it governs is edited when the code is.
- Own it: put docs under the same `CODEOWNERS` entry as their code so review
  catches stale docs.
- Enforce freshness mechanically where it matters: a CI check that fails when a
  sensitive path changes without its co-located doc beats a "remember to update"
  note.
- Prefer fitness functions over prose for any rule that must not regress (see
  [quality-lenses.md](quality-lenses.md)).
- Give `PROGRESS.md` a review cadence; deprecate ADRs explicitly (Status:
  Superseded) rather than deleting them.

## Stack signals (optional discovery hints)

The discovery method is stack-agnostic. These hints speed up Phase A; they are
not rules and not exhaustive. Confirm against the actual repo.

- Monorepo tooling: `nx.json`, `turbo.json`, `pnpm-workspace.yaml`, `lerna.json`,
  Cargo/Go workspaces, Bazel `WORKSPACE` — each marks project roots.
- IaC / Terraform: `*.tf`, `backend`/state config, `modules/`, provider pins,
  plan/apply wrappers; high-risk auto-deploy paths.
- Node: `package.json` scripts, `.nvmrc`, lockfile, workspaces.
- Python: `pyproject.toml`, `ruff.toml`, `tox.ini`, `.python-version`.
- Go: `go.mod`, `golangci.yml`, `cmd/` vs `internal/` layout.
- Data / ML: `dvc.yaml`, pipeline/DAG configs, model registries, dataset dirs.
- Frontend: component tree, router, state store, design-system package.

## Real transformation pattern (illustrative)

The figures below are illustrative, not a benchmark. A platform of roughly 30
microservices had decisions scattered across Confluence, Slack, engineers'
heads, and sporadic comments. After adding agents, a large share of tasks needed
human intervention, almost always because the agent violated an implicit,
unwritten constraint. The fix: a root `AGENTS.md` with overview, stack versions,
and global hard constraints; an `ARCHITECTURE.md` per service; a centralized
`CONSTRAINTS.md` in MUST/MUST NOT language; a `PROGRESS.md` per service. After
that, a fresh session could answer every key question and quality improved
sharply.

## Further reading

- OpenAI: Harness Engineering (repo as spec, progressive disclosure, AGENTS.md
  as a table of contents, mechanical invariant enforcement).
- Anthropic: Effective harnesses for long-running agents (initializer + coding
  agent, incremental progress, clean state, handoff/state files).
- AGENTS.md open standard (agents.md).
- ADR / MADR: Architecture Decision Records.
- CMU SEI ATAM: evaluating architecture via quality attribute scenarios, risks,
  sensitivity points, and trade-off points.
- Clean Architecture (dependency rule) and DDD strategic design (bounded
  contexts, ubiquitous language, context maps) — used as lenses, not doctrine.
- Building Evolutionary Architectures (Thoughtworks): turning architecture rules
  into automated fitness functions.
- Mining Software Repositories: recovering rationale, ownership, and churn/debt
  signals from history — treated as evidence with confidence, not as truth.

## Prior art (agent skills and standards this skill borrows from)

Mapped to the part of `repo-as-spec` each one informs. We link these rather than
copy them; where a tool is available in the harness, defer to it as enforcement.

| Source | Informs |
|--------|---------|
| `PanGan21/clean-architecture-claude-skills` (Uncle Bob primitives) | [architecture-lens.md](architecture-lens.md) dependency rule and review primitives |
| `anthropics/skills` + `agents.md` spec | SKILL.md authoring conventions, progressive disclosure |
