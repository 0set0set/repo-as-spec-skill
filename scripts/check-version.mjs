#!/usr/bin/env node
// Fails if the version drifts across the sources that must agree:
//   - package.json `version`
//   - SKILL.md `metadata.version`
//   - the README version badge
//   - every pinned `tree/vX.Y.Z` install example in the docs
// This is the mechanical guard against the drift this package used to ship
// (badge said 0.1.0 while the skill said 1.1.2).

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { PACKAGE_ROOT, isValidSemver, readSkillVersion } from "./lib/skill.mjs";

const read = (rel) => readFileSync(join(PACKAGE_ROOT, rel), "utf8");

const errors = [];
const sources = [];

const pkgVersion = JSON.parse(read("package.json")).version;
sources.push(["package.json", pkgVersion]);

const skillVersion = readSkillVersion(read("skills/repo-as-spec/SKILL.md"));
sources.push(["SKILL.md metadata.version", skillVersion]);

const badgeMatch = read("skills/repo-as-spec/README.md").match(
  /badge\/version-([^-)\s]+)-informational/
);
if (!badgeMatch) {
  errors.push("README version badge not found (expected badge/version-X.Y.Z-informational)");
} else {
  sources.push(["README badge", badgeMatch[1]]);
}

const pinFiles = ["README.md", "skills/repo-as-spec/INSTALL.md"];
for (const file of pinFiles) {
  const pins = [...read(file).matchAll(/tree\/v(\d+\.\d+\.\d+)\//g)];
  for (const pin of pins) sources.push([`${file} install pin`, pin[1]]);
}

if (!isValidSemver(pkgVersion)) {
  errors.push(`package.json version is not valid semver: ${pkgVersion}`);
}

const distinct = new Set(sources.map(([, v]) => v));
if (distinct.size > 1) {
  errors.push(
    `version mismatch across sources:\n` +
      sources.map(([name, v]) => `    ${v}  <- ${name}`).join("\n")
  );
}

if (errors.length) {
  console.error("check:version FAILED");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`check:version OK (${pkgVersion}) across ${sources.length} sources`);
