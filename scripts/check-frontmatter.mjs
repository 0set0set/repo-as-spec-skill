#!/usr/bin/env node
// Enforces the SKILL.md frontmatter contract from CONTRIBUTING.md so the skill
// loads in every harness:
//   - only widely-supported top-level keys (no harness-specific keys)
//   - name matches the folder and the lowercase/hyphen rule
//   - description present, <= 1024 chars, no angle brackets
//   - license present
//   - metadata.version is valid semver

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { extractFrontmatter, parseFrontmatter } from "./lib/frontmatter.mjs";
import { PACKAGE_ROOT, isValidSemver } from "./lib/skill.mjs";

const SKILL_DIR = "repo-as-spec";
const ALLOWED_TOP_LEVEL = new Set(["name", "description", "license", "metadata"]);
const FORBIDDEN_KEYS = ["disable-model-invocation", "allowed-tools", "model"];

const src = readFileSync(join(PACKAGE_ROOT, "skills", SKILL_DIR, "SKILL.md"), "utf8");
const errors = [];

const data = parseFrontmatter(src);
const fm = extractFrontmatter(src);

for (const key of data.topLevelKeys) {
  if (!ALLOWED_TOP_LEVEL.has(key)) {
    errors.push(`unsupported top-level frontmatter key: ${key}`);
  }
}

for (const key of FORBIDDEN_KEYS) {
  if (new RegExp(`(^|\\n)\\s*${key}:`, "m").test(fm.inner)) {
    errors.push(`harness-specific key must stay out of the shared SKILL.md: ${key}`);
  }
}

if (data.name !== SKILL_DIR) {
  errors.push(`name (${data.name}) must match the folder name (${SKILL_DIR})`);
}
if (data.name && !/^[a-z0-9-]{1,64}$/.test(data.name)) {
  errors.push(`name must be lowercase, hyphenated, <= 64 chars: ${data.name}`);
}

if (!data.description) {
  errors.push("description is required");
} else {
  if (data.description.length > 1024) {
    errors.push(`description is ${data.description.length} chars (max 1024)`);
  }
  if (/[<>]/.test(data.description)) {
    errors.push("description must not contain angle brackets (< or >)");
  }
}

if (!data.license) errors.push("license is required");

if (!isValidSemver(data.metadata.version)) {
  errors.push(`metadata.version is not valid semver: ${data.metadata.version}`);
}

if (errors.length) {
  console.error("check:frontmatter FAILED");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log("check:frontmatter OK");
