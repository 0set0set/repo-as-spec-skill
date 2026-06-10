#!/usr/bin/env node
// Verifies that every relative Markdown link in the package resolves to a file
// on disk, and that references linked from SKILL.md stay exactly one level deep
// (progressive-disclosure rule from CONTRIBUTING.md).

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

import { PACKAGE_ROOT } from "./lib/skill.mjs";
import { walk } from "./lib/fs-utils.mjs";

const LINK = /\[[^\]]*\]\(([^)]+)\)/g;
const EXTERNAL = /^(https?:|mailto:|#)/;

const errors = [];
const skillPath = join(PACKAGE_ROOT, "skills", "repo-as-spec", "SKILL.md");

for (const file of walk(PACKAGE_ROOT, ".md")) {
  const content = readFileSync(file, "utf8");
  for (const match of content.matchAll(LINK)) {
    const target = match[1].trim().split(/\s+/)[0]; // drop optional "title"
    if (EXTERNAL.test(target)) continue;

    const pathPart = target.split("#")[0];
    if (pathPart === "") continue; // pure in-page anchor

    const resolved = resolve(dirname(file), pathPart);
    if (!existsSync(resolved)) {
      errors.push(`${relative(PACKAGE_ROOT, file)} -> broken link: ${target}`);
    }

    if (file === skillPath && pathPart.startsWith("references/")) {
      const depth = pathPart.split("/").length - 1;
      if (depth > 1) {
        errors.push(`SKILL.md reference link is deeper than one level: ${target}`);
      }
    }
  }
}

if (errors.length) {
  console.error("check:links FAILED");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log("check:links OK");
