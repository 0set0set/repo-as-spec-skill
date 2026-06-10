// Shared helpers for reading and rewriting the skill version. Used by both the
// release-time sync script and the local consistency checks so the two can
// never disagree about where the version lives.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { extractFrontmatter, parseFrontmatter } from "./frontmatter.mjs";

// Package root (the directory that holds package.json), derived relative to
// this file so the scripts work regardless of the caller's cwd.
export const PACKAGE_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const SKILL_PATH = join(PACKAGE_ROOT, "skills", "repo-as-spec", "SKILL.md");

// Stricter than npm's loose coercion: require a clean MAJOR.MINOR.PATCH with
// optional prerelease/build metadata, matching what semantic-release emits.
const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

export function isValidSemver(value) {
  return typeof value === "string" && SEMVER.test(value);
}

// Reads `metadata.version` from SKILL.md source. Throws when it is absent.
export function readSkillVersion(src) {
  const data = parseFrontmatter(src);
  const version = data.metadata && data.metadata.version;
  if (!version) {
    throw new Error("metadata.version not found in SKILL.md frontmatter");
  }
  return version;
}

// Returns a new SKILL.md source with `metadata.version` set to `version`.
// Only the version line nested under `metadata:` is touched, so a `version:`
// appearing later in prose or a code example is never rewritten. Throws on an
// invalid version, missing frontmatter, or a missing metadata.version line.
export function updateSkillVersion(src, version) {
  if (!isValidSemver(version)) {
    throw new Error(`invalid semver version: ${JSON.stringify(version)}`);
  }

  const fm = extractFrontmatter(src);
  if (!fm) throw new Error("no YAML frontmatter found in SKILL.md");

  const lines = fm.block.split("\n");
  let inMetadata = false;
  let replaced = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^metadata:\s*$/.test(line)) {
      inMetadata = true;
      continue;
    }

    if (inMetadata) {
      const match = line.match(/^(\s+version:\s*).*$/);
      if (match) {
        lines[i] = `${match[1]}${version}`;
        replaced = true;
        break;
      }
      // A non-indented, non-fence line ends the metadata block.
      if (/^\S/.test(line) && !line.startsWith("---")) inMetadata = false;
    }
  }

  if (!replaced) {
    throw new Error("no metadata.version line to update in SKILL.md frontmatter");
  }

  return src.replace(fm.block, lines.join("\n"));
}

// Returns a new source with the README version badge set to `version`. Matches
// the same `badge/version-X.Y.Z-informational` shape check-version.mjs reads, so
// the release-time rewrite and the consistency check can never disagree.
// Idempotent; a source with no badge is returned unchanged. Throws on invalid
// semver.
export function updateBadgeVersion(src, version) {
  if (!isValidSemver(version)) {
    throw new Error(`invalid semver version: ${JSON.stringify(version)}`);
  }
  return src.replace(/(badge\/version-)[^-)\s]+(-informational)/g, `$1${version}$2`);
}

// Returns a new source with every pinned `tree/vX.Y.Z/` install example set to
// `version`, matching the pins check-version.mjs validates. Idempotent; a source
// with no pins is returned unchanged. Throws on invalid semver.
export function updateInstallPins(src, version) {
  if (!isValidSemver(version)) {
    throw new Error(`invalid semver version: ${JSON.stringify(version)}`);
  }
  return src.replace(/(tree\/v)\d+\.\d+\.\d+(\/)/g, `$1${version}$2`);
}

// Docs (relative to the package root) that carry a version badge and/or pinned
// install examples. Both rewrites are no-ops where the pattern is absent, so
// each file is processed with both.
export const VERSIONED_DOCS = [
  "README.md",
  join("skills", "repo-as-spec", "README.md"),
  join("skills", "repo-as-spec", "INSTALL.md"),
];

// Rewrites the version in every source the consistency check guards: SKILL.md
// metadata, the README badge, and the `tree/vX.Y.Z` install pins. Returns the
// list of files actually changed. The release runs this so a tag cannot ship a
// half-updated set of version strings (which prepublishOnly's check would then
// reject). Idempotent. Throws on invalid semver.
export function syncVersionFiles(version, root = PACKAGE_ROOT) {
  if (!isValidSemver(version)) {
    throw new Error(`invalid semver version: ${JSON.stringify(version)}`);
  }
  const changed = [];

  const skillPath = join(root, "skills", "repo-as-spec", "SKILL.md");
  const skillSrc = readFileSync(skillPath, "utf8");
  const skillUpdated = updateSkillVersion(skillSrc, version);
  if (skillUpdated !== skillSrc) {
    writeFileSync(skillPath, skillUpdated);
    changed.push(skillPath);
  }

  for (const rel of VERSIONED_DOCS) {
    const path = join(root, rel);
    const src = readFileSync(path, "utf8");
    const updated = updateInstallPins(updateBadgeVersion(src, version), version);
    if (updated !== src) {
      writeFileSync(path, updated);
      changed.push(path);
    }
  }

  return changed;
}
