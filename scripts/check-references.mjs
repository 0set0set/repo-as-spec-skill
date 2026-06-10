#!/usr/bin/env node
// Guarantees that every file under references/ is discoverable: indexed in
// references/README.md and linked from SKILL.md. This is the guard against the
// drift where v1.1.x added three reference files that the docs never listed.

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { PACKAGE_ROOT } from "./lib/skill.mjs";

const refDir = join(PACKAGE_ROOT, "skills", "repo-as-spec", "references");
const indexPath = join(refDir, "README.md");

const errors = [];

let index;
try {
  index = readFileSync(indexPath, "utf8");
} catch {
  console.error("check:references FAILED: references/README.md index is missing");
  process.exit(1);
}

const skill = readFileSync(join(PACKAGE_ROOT, "skills", "repo-as-spec", "SKILL.md"), "utf8");

const refFiles = readdirSync(refDir)
  .filter((name) => name.endsWith(".md") && name !== "README.md")
  .sort();

for (const file of refFiles) {
  if (!index.includes(`(${file})`) && !index.includes(`(./${file})`)) {
    errors.push(`references/${file} is not indexed in references/README.md`);
  }
  if (!skill.includes(`references/${file}`)) {
    errors.push(`references/${file} is not linked from SKILL.md`);
  }
}

if (errors.length) {
  console.error("check:references FAILED");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`check:references OK (${refFiles.length} reference files indexed)`);
