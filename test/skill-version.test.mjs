import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { test } from "node:test";

import {
  isValidSemver,
  readSkillVersion,
  updateSkillVersion,
  updateBadgeVersion,
  updateInstallPins,
  syncVersionFiles,
} from "../scripts/lib/skill.mjs";

const SCRIPT = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "scripts",
  "sync-skill-version.mjs"
);

const FIXTURE = `---
name: repo-as-spec
description: A test skill description.
license: MIT
metadata:
  version: 1.1.2
  author: repo-as-spec contributors
---

# Repository As Spec

Body text that mentions version: 9.9.9 in prose and must NOT be rewritten.
`;

test("readSkillVersion reads metadata.version", () => {
  assert.equal(readSkillVersion(FIXTURE), "1.1.2");
});

test("readSkillVersion throws without a version", () => {
  const noVersion = FIXTURE.replace("  version: 1.1.2\n", "");
  assert.throws(() => readSkillVersion(noVersion), /metadata.version not found/);
});

test("updateSkillVersion rewrites only metadata.version", () => {
  const updated = updateSkillVersion(FIXTURE, "2.0.0");
  assert.equal(readSkillVersion(updated), "2.0.0");
  // Prose `version:` is untouched.
  assert.match(updated, /version: 9\.9\.9 in prose/);
  // Surrounding metadata survives.
  assert.match(updated, /author: repo-as-spec contributors/);
});

test("updateSkillVersion rejects invalid semver", () => {
  assert.throws(() => updateSkillVersion(FIXTURE, "not-a-version"), /invalid semver/);
  assert.throws(() => updateSkillVersion(FIXTURE, "1.2"), /invalid semver/);
});

test("updateSkillVersion throws when frontmatter is missing", () => {
  assert.throws(() => updateSkillVersion("# no frontmatter\n", "2.0.0"), /no YAML frontmatter/);
});

test("updateSkillVersion throws when metadata.version line is absent", () => {
  const noVersion = FIXTURE.replace("  version: 1.1.2\n", "");
  assert.throws(() => updateSkillVersion(noVersion, "2.0.0"), /no metadata.version line/);
});

test("updateBadgeVersion rewrites the README version badge and is idempotent", () => {
  const src = "[![Version](https://img.shields.io/badge/version-1.1.2-informational.svg)](CHANGELOG.md)";
  const once = updateBadgeVersion(src, "2.0.0");
  assert.match(once, /badge\/version-2\.0\.0-informational/);
  assert.equal(updateBadgeVersion(once, "2.0.0"), once);
});

test("updateBadgeVersion leaves a source without a badge unchanged", () => {
  const src = "no badge here";
  assert.equal(updateBadgeVersion(src, "2.0.0"), src);
});

test("updateBadgeVersion rejects invalid semver", () => {
  assert.throws(() => updateBadgeVersion("badge/version-1.0.0-informational", "nope"), /invalid semver/);
});

test("updateInstallPins rewrites every tree/vX.Y.Z pin and is idempotent", () => {
  const src = [
    "npx skills add https://github.com/0set0set/repo-as-spec-skill/tree/v1.1.2/skills/repo-as-spec",
    "see .../tree/v1.1.2/skills/repo-as-spec too",
  ].join("\n");
  const once = updateInstallPins(src, "2.0.0");
  assert.ok(!/tree\/v1\.1\.2\//.test(once));
  assert.equal((once.match(/tree\/v2\.0\.0\//g) || []).length, 2);
  assert.equal(updateInstallPins(once, "2.0.0"), once);
});

test("updateInstallPins leaves a source without pins unchanged", () => {
  const src = "npx skills add 0set0set/repo-as-spec-skill";
  assert.equal(updateInstallPins(src, "2.0.0"), src);
});

test("isValidSemver accepts and rejects expected forms", () => {
  assert.ok(isValidSemver("1.0.0"));
  assert.ok(isValidSemver("10.20.30-rc.1"));
  assert.ok(!isValidSemver("1.0"));
  assert.ok(!isValidSemver("v1.0.0"));
  assert.ok(!isValidSemver(undefined));
});

test("CLI updates a temp copy and is idempotent", () => {
  const dir = mkdtempSync(join(tmpdir(), "repo-as-spec-"));
  const file = join(dir, "SKILL.md");
  writeFileSync(file, FIXTURE);

  execFileSync("node", [SCRIPT, "3.4.5", file]);
  assert.equal(readSkillVersion(readFileSync(file, "utf8")), "3.4.5");

  execFileSync("node", [SCRIPT, "3.4.5", file]);
  assert.equal(readSkillVersion(readFileSync(file, "utf8")), "3.4.5");
});

test("CLI exits non-zero on invalid semver", () => {
  const dir = mkdtempSync(join(tmpdir(), "repo-as-spec-"));
  const file = join(dir, "SKILL.md");
  writeFileSync(file, FIXTURE);

  assert.throws(() => execFileSync("node", [SCRIPT, "nope", file], { stdio: "pipe" }));
});

test("syncVersionFiles updates SKILL.md, the badge, and every install pin", () => {
  const root = mkdtempSync(join(tmpdir(), "repo-as-spec-root-"));
  const skillDir = join(root, "skills", "repo-as-spec");
  mkdirSync(skillDir, { recursive: true });

  writeFileSync(join(skillDir, "SKILL.md"), FIXTURE);
  writeFileSync(
    join(skillDir, "README.md"),
    "[![Version](https://img.shields.io/badge/version-1.1.2-informational.svg)](CHANGELOG.md)\n"
  );
  writeFileSync(
    join(root, "README.md"),
    "npx skills add https://github.com/0set0set/repo-as-spec-skill/tree/v1.1.2/skills/repo-as-spec\n"
  );
  writeFileSync(
    join(skillDir, "INSTALL.md"),
    "npx skills add https://github.com/0set0set/repo-as-spec-skill/tree/v1.1.2/skills/repo-as-spec\n"
  );

  const changed = syncVersionFiles("2.0.0", root);
  assert.equal(changed.length, 4);

  assert.equal(readSkillVersion(readFileSync(join(skillDir, "SKILL.md"), "utf8")), "2.0.0");
  assert.match(readFileSync(join(skillDir, "README.md"), "utf8"), /badge\/version-2\.0\.0-informational/);
  assert.match(readFileSync(join(root, "README.md"), "utf8"), /tree\/v2\.0\.0\//);
  assert.match(readFileSync(join(skillDir, "INSTALL.md"), "utf8"), /tree\/v2\.0\.0\//);

  // Idempotent: a second run changes nothing.
  assert.equal(syncVersionFiles("2.0.0", root).length, 0);
});
