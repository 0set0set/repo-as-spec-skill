# References index

Detailed material for `repo-as-spec`, loaded on demand. Read only what the
current step needs — `SKILL.md` stays the entry point. Each file below states
what it is for and when to open it.

## Lite path (most audits)

Use these for every repo. They cover discovery, the audit, the minimal write,
and verification.

| File | Read it when | Covers |
|------|--------------|--------|
| [reference.md](reference.md) | You need the full discovery method or the theory behind the skill | Why the repo is the system of record; discovery Phases A-E; AGENTS.md conventions |
| [checklists.md](checklists.md) | During Steps 1, 2, 5, 6 to fill in evidence | Evidence levels, discovery inventory, fresh session test, gap protocol, authority conflicts, Step 6 report |
| [templates.md](templates.md) | In Step 4, before writing any artifact | The artifact decision tree and copy-ready templates |
| [examples.md](examples.md) | You are unsure what "good" output looks like | Worked before/after audit fragments, human-only questions, artifact choices |

## Deep path (mature or decision-heavy repos)

Open these only when the deep-mode triggers in `SKILL.md` Step 1 fire. They are
optional and scoped to the gaps the audit found — do not run them "for
completeness".

| File | Read it when | Covers |
|------|--------------|--------|
| [architecture-lens.md](architecture-lens.md) | The repo's structure and trade-offs are not captured by operational docs alone | Inferring style, boundaries, optimized qualities, hotspots, ATAM-lite |
| [history-mining.md](history-mining.md) | Rationale/constraint gaps remain that current files do not explain | Read-only Git/PR archaeology, evidence rules, platform adapters |
| [quality-lenses.md](quality-lenses.md) | You must judge a specific rule and decide its enforcement | Review lenses and the rule-to-fitness-function ladder |

## How the files relate

`reference.md` is the method; `checklists.md` is the set of forms you fill while
running it; `templates.md` is what you emit at the end. The three deep-path
lenses feed findings back into those forms and templates. Keep each reference
focused and one level deep from `SKILL.md`; the template catalog runs longer
because it is copy-ready material.
