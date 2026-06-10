# Reference: History Mining

Recover the *why* behind a codebase from Git and pull-request metadata. Read on
demand when the audit shows decision/rationale gaps that the current files do
not explain. This workflow is OPTIONAL and READ-ONLY.

History is evidence, not truth. A commit explains what someone said they did,
not necessarily why the architecture is correct. Treat every finding with an
explicit confidence level (see [checklists.md](checklists.md)) and cite the
commit hash or PR number. Never write a recovered motivation into a repo doc as
fact unless the source is specific and unambiguous.

## Hard rules

- READ-ONLY. Never commit, rewrite history, push, or change refs.
- Cite sources: every claim links to a commit SHA, PR number, or issue ID.
- Confidence required: label each finding direct / historical / derived (see
  checklists). A vague commit ("fix", "wip", "update") is NOT evidence of intent.
- No blame. Ownership/expertise findings describe knowledge risk, not fault.
- Ask before recording rationale that history only hints at.

Never run any state-changing Git command, including: `commit`, `push`, `pull`,
`fetch --prune`, `merge`, `rebase`, `reset`, `revert`, `checkout`/`switch` (to a
different ref), `cherry-pick`, `stash`, `tag`, `branch -d/-D`, `filter-branch`,
`filter-repo`, `gc`, or `reflog expire`. If a question needs a state change to
answer, stop and ask the user.

## Read-only commands

Git (always available in a repo):

```bash
git log --oneline -n 50                      # recent narrative
git log --follow -p -- <path>                # how one file evolved (with diffs)
git log --since="6 months ago" --stat        # recent change surface
git log -S "<symbol>" -- <path>              # when a symbol was added/removed
git show <sha>                               # full context of a key commit
git blame -L <start>,<end> -- <path>         # context for a specific block
git shortlog -sne -- <path>                  # contributor concentration
```

Forge metadata is optional — fall back to plain Git when no CLI is authenticated.
Resolve `{owner}/{repo}` from `git remote get-url origin` first.

GitHub (only when `gh` is authenticated; skip silently if not):

```bash
gh pr list --state merged --search "<path or term>" --limit 20
gh pr view <number> --comments               # rationale, review discussion
gh api repos/{owner}/{repo}/commits/<sha>/pulls   # PR that introduced a commit
```

GitLab (only when `glab` is authenticated; skip silently if not):

```bash
glab mr list --merged --search "<term>"       # merged MRs matching a term
glab mr view <id> --comments                  # rationale, review discussion
```

Git-only (no forge CLI, or Bitbucket/Gerrit/self-hosted): rely on merge commits
and tags, which usually carry the PR/MR number and release context.

```bash
git log --merges --oneline -n 50              # merge commits (often "Merge PR #123")
git tag -l --sort=-creatordate | head -20     # release boundaries
git log --grep="<term>" --oneline             # search messages for a topic
git rev-list --count HEAD -- <path>           # how often a path changed
```

## What to extract

- Motivation: why a boundary/dependency/config was introduced or changed.
- Rejected alternatives: reverted commits, abandoned branches, "instead of X"
  discussion in PRs. These prevent re-litigating settled decisions.
- Incident/drift fixes: commits that repair production drift or outages; these
  reveal real constraints worth recording as CONSTRAINTS or fitness functions.
- Recurring failures: the same area fixed repeatedly signals a design weakness.
- Ownership concentration / bus factor: a critical path touched by one person is
  a knowledge risk to flag (not a doc fact about the code).
- Current workstream / progress: open PRs, recent commits, and branch names feed
  `PROGRESS.md` (in-progress / blocked / next).

## Churn and hotspot signals

```bash
# Files changed most often in the last 6 months (change frequency)
git log --since="6 months ago" --name-only --pretty=format: \
  | sed '/^$/d' | sort | uniq -c | sort -rn | head -20
```

High churn + high complexity + low test coverage is a debt hotspot. Rank a path's
risk qualitatively by combining the signals, not churn alone:

- churn (change frequency, above) — the base rate of risk;
- test proximity — is there a co-located/covering test? distant or absent tests
  raise risk;
- privilege/sensitivity — secrets, auth, IAM, or deploy/migration paths raise it;
- fan-in — many dependents multiply the blast radius (see architecture-lens Step D).

A frequently changed, security-sensitive file with no nearby tests outranks a
noisier but well-tested, low-privilege file. Combine with
[architecture-lens.md](architecture-lens.md) Step D before recommending action,
and record findings in the architecture risk scan table in
[checklists.md](checklists.md).

## Turning findings into artifacts

- Strong, cited motivation for a still-true decision -> `DECISIONS.md` entry or
  an ADR (see [templates.md](templates.md)), with the commit/PR cited.
- A constraint learned from an incident -> `CONSTRAINTS.md`, ideally paired with
  a fitness function so it cannot silently regress.
- Active work -> `PROGRESS.md`.
- Knowledge-risk / hotspot -> a note for the user; do not overwrite code docs
  with speculative blame.

## Anti-patterns

- Mining the entire history "for completeness" — scope to the gaps the audit
  found.
- Recording a guessed rationale as if it were decided.
- Citing a vague commit message as proof of intent.
- Writing ownership findings as judgments of individuals.
