import assert from "node:assert/strict";
import { test } from "node:test";

import { extractFrontmatter, parseFrontmatter } from "../scripts/lib/frontmatter.mjs";

const SRC = `---
name: repo-as-spec
description: Does a thing, and: handles colons (and parens) fine.
license: MIT
metadata:
  version: 1.1.2
  author: repo-as-spec contributors
---

# Body
`;

test("extractFrontmatter returns the fenced block", () => {
  const fm = extractFrontmatter(SRC);
  assert.ok(fm.block.startsWith("---\n"));
  assert.ok(fm.block.endsWith("---"));
});

test("extractFrontmatter returns null without frontmatter", () => {
  assert.equal(extractFrontmatter("# no frontmatter"), null);
});

test("parseFrontmatter reads scalars and nested metadata", () => {
  const data = parseFrontmatter(SRC);
  assert.equal(data.name, "repo-as-spec");
  assert.equal(data.license, "MIT");
  assert.equal(data.metadata.version, "1.1.2");
  assert.equal(data.metadata.author, "repo-as-spec contributors");
  assert.deepEqual(data.topLevelKeys, ["name", "description", "license", "metadata"]);
});

test("parseFrontmatter preserves colons in scalar values", () => {
  const data = parseFrontmatter(SRC);
  assert.match(data.description, /handles colons \(and parens\) fine\./);
});

test("parseFrontmatter throws without frontmatter", () => {
  assert.throws(() => parseFrontmatter("# nope"), /no YAML frontmatter/);
});
