// Small filesystem helpers shared by the check scripts.

import { readdirSync } from "node:fs";
import { join } from "node:path";

const IGNORED_DIRS = new Set(["node_modules", ".git", "coverage"]);

// Recursively collects files under `dir` whose name ends with `ext`.
export function walk(dir, ext = ".md", found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.isDirectory()) continue;
    if (IGNORED_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, ext, found);
    } else if (entry.name.endsWith(ext)) {
      found.push(full);
    }
  }
  return found;
}
