import { test } from "node:test";
import assert from "node:assert/strict";
import { changedLines, highlightPair } from "../src/lib/highlight.ts";
import { readFileSync } from "node:fs";

test("diff locates a changed repeated line instead of comparing text membership", () => {
  const result = changedLines(
    "a\nrepeated\nb\nrepeated\nc\n",
    "a\nrepeated\nb\nreplacement\nc\n",
  );
  assert.deepEqual([...result.removed], [4]);
  assert.deepEqual([...result.added], [4]);
});

test("diff preserves line positions when an insertion precedes a replacement", () => {
  const result = changedLines("a\nb\nc\n", "new\na\nb\nchanged\n");
  assert.deepEqual([...result.removed], [3]);
  assert.deepEqual([...result.added], [1, 4]);
});

test("unchanged stage does not manufacture modifications", async () => {
  const result = await highlightPair(
    "main { color: red; }",
    "main { color: red; }",
    "css",
  );
  assert.equal(result.additions, 0);
  assert.equal(result.deletions, 0);
  assert.match(result.unified, /本阶段没有代码变更/);
});

test("preview and downloadable final artifact retain the same content across the fix", () => {
  const before = readFileSync(
    new URL("../public/examples/homepage-v1.html", import.meta.url),
    "utf8",
  );
  const after = readFileSync(
    new URL("../public/examples/homepage-v2.html", import.meta.url),
    "utf8",
  );
  assert.equal(before.split("</head>")[1], after.split("</head>")[1]);
  assert.match(before, /main \{ width: 760px/);
  assert.match(after, /main \{ width: 100%; max-width: 760px/);
  assert.match(after, /grid-template-columns: 1fr;/);
  assert.doesNotMatch(after, /<script/);
});
