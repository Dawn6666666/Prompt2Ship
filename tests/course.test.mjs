import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { stages, portfolioHtml } from "../src/data/course.ts";

test("following the published commands records v1 before diffing and committing v2", async () => {
  const directory = await mkdtemp(join(tmpdir(), "p2s-course-git-"));
  const env = {
    ...process.env,
    GIT_AUTHOR_NAME: "Tutorial test",
    GIT_AUTHOR_EMAIL: "test@example.invalid",
    GIT_COMMITTER_NAME: "Tutorial test",
    GIT_COMMITTER_EMAIL: "test@example.invalid",
  };
  const git = (...args) =>
    execFileSync("git", args, { cwd: directory, env, encoding: "utf8" });
  try {
    git("init", "-q");
    await writeFile(join(directory, "index.html"), portfolioHtml(2));
    execFileSync("bash", ["-eu", "-c", stages[2].command], {
      cwd: directory,
      env,
    });
    assert.equal(git("rev-list", "--count", "HEAD").trim(), "1");
    assert.equal(git("status", "--short"), "");
    await writeFile(join(directory, "index.html"), portfolioHtml(4));
    const diff = git("diff", "--", "index.html");
    assert.match(diff, /-main \{ width: 760px/);
    assert.match(diff, /\+main \{ max-width: 760px/);
    execFileSync("bash", ["-eu", "-c", stages[5].command], {
      cwd: directory,
      env,
    });
    assert.equal(git("rev-list", "--count", "HEAD").trim(), "2");
    assert.equal(git("status", "--short"), "");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
