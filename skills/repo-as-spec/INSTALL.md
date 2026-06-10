# Installing repo-as-spec

This is a plain-Markdown Agent Skill: a folder with a `SKILL.md` plus
`references/`. The folder name must stay `repo-as-spec` (it must match the
`name` in `SKILL.md`).

## Quick install (recommended)

Use the `npx skills` CLI ([vercel-labs/skills](https://github.com/vercel-labs/skills)).
It auto-detects your harness and copies the skill into the right directory.

```bash
# Latest from the default branch
npx skills add 0set0set/repo-as-spec-skill

# Pin to a released tag for reproducibility
npx skills add https://github.com/0set0set/repo-as-spec-skill/tree/v1.1.2/skills/repo-as-spec
```

Then restart or reload the harness so it discovers the skill.

## Manual install (fallback)

If you cannot run the CLI, copy (or symlink) the skill folder into your
harness's skills directory.

### Common install paths

| Harness | Skills directory |
|---------|------------------|
| Claude Code / Claude | `.claude/skills/` (project) or `~/.claude/skills/` (personal) |
| Cursor | `.cursor/skills/` (project) or `~/.cursor/skills/` (personal) |
| Codex / AGENTS.md harnesses | `.agents/skills/`, or reference it from a root `AGENTS.md` |
| Windsurf | `.windsurf/skills/` |
| OpenCode | `.opencode/skills/` or `~/.config/opencode/skills/` |

Generic copy (replace `<skills-dir>` with a path above):

```bash
cp -R repo-as-spec <skills-dir>/repo-as-spec
```

Or symlink during development so edits stay in sync:

```bash
ln -s "$(pwd)/repo-as-spec" <skills-dir>/repo-as-spec
```

After installing, restart or reload the harness so it discovers the skill.

## Per-harness notes

### Claude / Claude Code
Place the folder under `.claude/skills/`. Claude reads `name` + `description`
into context and loads the `SKILL.md` body when the skill triggers.

### Cursor
Place the folder under `.cursor/skills/`. If you want the skill to load only
when named explicitly (not auto-invoked from ambient context), add this key to
the `SKILL.md` frontmatter in your local copy:

```yaml
disable-model-invocation: true
```

This key is Cursor-specific and is intentionally omitted from the shared
`SKILL.md` to keep it valid across all harnesses.

### Codex and other AGENTS.md-based agents
If your harness discovers capabilities via `AGENTS.md`, add a pointer in the
repository's root `AGENTS.md`, for example:

```markdown
## Skills
- repo-as-spec — see `.agents/skills/repo-as-spec/SKILL.md`
```

## Verifying the install

Ask the agent to apply `repo-as-spec` to the current repository. It should
begin with the discovery step and produce the fresh-session-test checklist.
