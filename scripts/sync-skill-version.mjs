#!/usr/bin/env node
// Rewrites `metadata.version` in SKILL.md's YAML frontmatter to match the
// version semantic-release is about to release. Runs as the `prepareCmd` via
// @semantic-release/exec (see .releaserc.json), before @semantic-release/git
// stages the release commit.
//
// Usage: node scripts/sync-skill-version.mjs <version> [skill-path]
//
// With no second argument (the release case) it rewrites every source the
// version consistency check guards: SKILL.md metadata, the README badge, and the
// `tree/vX.Y.Z` install pins in README.md and INSTALL.md. Updating only SKILL.md
// would leave the badge/pins stale and make prepublishOnly's `check:version`
// fail the release.
//
// With an explicit skill-path it updates only that file's metadata.version, so
// tests can run against a temporary copy without touching the real tree.
//
// Exit 0 = success. Any non-zero exit aborts the release run; no tag or GitHub
// release is created on failure, so recovery is just re-running.

import { readFileSync, writeFileSync } from "node:fs";

import { syncVersionFiles, updateSkillVersion } from "./lib/skill.mjs";

const version = process.argv[2];
const skillPathOverride = process.argv[3];

if (!version) {
  console.error("sync-skill-version: missing version argument");
  process.exit(1);
}

try {
  if (skillPathOverride) {
    const src = readFileSync(skillPathOverride, "utf8");
    const updated = updateSkillVersion(src, version);
    if (updated !== src) writeFileSync(skillPathOverride, updated);
    console.log(`sync-skill-version: ${skillPathOverride} -> ${version}`);
  } else {
    const changed = syncVersionFiles(version);
    console.log(
      `sync-skill-version: ${version} (${changed.length} file(s) updated:` +
        ` ${changed.length ? changed.join(", ") : "none"})`
    );
  }
} catch (error) {
  console.error(`sync-skill-version: ${error.message}`);
  process.exit(1);
}
