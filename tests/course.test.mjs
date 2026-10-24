import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, mkdtemp, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";

test("downloaded history contains exactly v1 and v2, and only styles change", async () => {
  await mkdir("/tmp/opencode", { recursive: true });
  const work = await mkdtemp("/tmp/opencode/p2s-history-test-");
  const bundle = new URL(
    "../public/examples/homepage-history.bundle",
    import.meta.url,
  ).pathname;
  execFileSync("git", ["clone", "-q", bundle, work]);
  const git = (...args) =>
    execFileSync("git", args, { cwd: work, encoding: "utf8" }).trim();
  assert.equal(git("rev-list", "--count", "HEAD"), "2");
  const v1 = git("show", "HEAD~1:index.html");
  const v2 = git("show", "HEAD:index.html");
  assert.equal(v1.split("</head>")[1], v2.split("</head>")[1]);
  assert.equal(
    v2,
    (
      await readFile(
        new URL("../public/examples/homepage-v2.html", import.meta.url),
        "utf8",
      )
    ).trim(),
  );
  assert.equal(git("diff", "--name-only", "HEAD~1", "HEAD"), "index.html");
  assert.match(git("log", "--oneline"), /v2 修复手机端/);
});
