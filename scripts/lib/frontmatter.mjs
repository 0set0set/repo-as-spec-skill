// Minimal, dependency-free reader for the skill's controlled SKILL.md
// frontmatter. It handles top-level `key: value` scalars and a single nested
// `metadata:` map (the only shape this skill uses). It is intentionally NOT a
// general-purpose YAML parser; keep SKILL.md frontmatter simple so this stays
// correct.

function stripQuotes(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

// Returns { block, inner, index } for the leading `---\n...\n---` block, or
// null when the source has no frontmatter. `block` includes the fences.
export function extractFrontmatter(src) {
  const match = src.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  return { block: match[0], inner: match[1], index: match.index };
}

// Parses the frontmatter into { ...topLevelScalars, metadata: {...},
// topLevelKeys: [...] }. Throws when no frontmatter is present.
export function parseFrontmatter(src) {
  const fm = extractFrontmatter(src);
  if (!fm) throw new Error("no YAML frontmatter found");

  const data = { metadata: {}, topLevelKeys: [] };
  let inMetadata = false;

  for (const line of fm.inner.split("\n")) {
    if (line.trim() === "") continue;

    const nested = line.match(/^(\s+)([A-Za-z0-9_-]+):\s?(.*)$/);
    const top = line.match(/^([A-Za-z0-9_-]+):\s?(.*)$/);

    if (top) {
      const key = top[1];
      data.topLevelKeys.push(key);
      if (key === "metadata") {
        inMetadata = true;
        data.metadata = {};
      } else {
        inMetadata = false;
        data[key] = stripQuotes(top[2]);
      }
    } else if (nested && inMetadata) {
      data.metadata[nested[2]] = stripQuotes(nested[3]);
    } else {
      inMetadata = false;
    }
  }

  return data;
}
