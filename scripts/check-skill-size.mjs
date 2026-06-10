#!/usr/bin/env node
// SKILL.md body (everything after the frontmatter) must stay under 500 lines so
// the entry point keeps using progressive disclosure instead of growing into an
// encyclopedia.

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { extractFrontmatter } from "./lib/frontmatter.mjs";
import { PACKAGE_ROOT } from "./lib/skill.mjs";

const MAX_BODY_LINES = 500;

const src = readFileSync(join(PACKAGE_ROOT, "skills", "repo-as-spec", "SKILL.md"), "utf8");
const fm = extractFrontmatter(src);
const body = fm ? src.slice(fm.index + fm.block.length) : src;
const lineCount = body.split("\n").filter((_, i, arr) => i < arr.length - 1 || arr[i] !== "").length;

if (lineCount >= MAX_BODY_LINES) {
  console.error(`check:skill-size FAILED: body is ${lineCount} lines (max ${MAX_BODY_LINES - 1})`);
  process.exit(1);
}

console.log(`check:skill-size OK (${lineCount}/${MAX_BODY_LINES} body lines)`);
