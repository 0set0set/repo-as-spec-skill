#!/usr/bin/env node
// Rewrites the `version:` field in SKILL.md's YAML frontmatter to match the
// version semantic-release is about to release. Runs as the `prepareCmd` via
// @semantic-release/exec (see .releaserc.json), before @semantic-release/git
// stages the release commit.
//
// Exit 0 = success. Any non-zero exit aborts the release run; no tag or GitHub
// release is created on failure, so recovery is just re-running.

import { readFileSync, writeFileSync } from "node:fs";

const version = process.argv[2];
const path = "skills/repo-as-spec/SKILL.md";

if (!version) {
  console.error("sync-skill-version: missing version argument");
  process.exit(1);
}

const src = readFileSync(path, "utf8");

// Isolate the YAML frontmatter block so we never touch a `version:` that may
// appear later in prose or a code example.
const fmMatch = src.match(/^---\n([\s\S]*?)\n---/);
if (!fmMatch) {
  console.error(`sync-skill-version: no YAML frontmatter found in ${path}`);
  process.exit(1);
}

const frontmatter = fmMatch[0];
const updatedFrontmatter = frontmatter.replace(
  /^(\s*version:\s*).*$/m,
  `$1${version}`
);

if (updatedFrontmatter === frontmatter) {
  console.error(
    `sync-skill-version: no 'version:' line in ${path} frontmatter to update`
  );
  process.exit(1);
}

writeFileSync(path, src.replace(frontmatter, updatedFrontmatter));
console.log(`sync-skill-version: ${path} -> ${version}`);
