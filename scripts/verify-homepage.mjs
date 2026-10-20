/** Build a genuine two-commit teaching repository without touching the user's Git history. */
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";
import assert from "node:assert/strict";
const root = resolve(import.meta.dirname, "..");
const work = await mkdtemp("/tmp/opencode/prompt2ship-homepage-");
const git = (...args) =>
  execFileSync("git", args, {
    cwd: work,
    encoding: "utf8",
    env: {
      ...process.env,
      GIT_AUTHOR_DATE: "2026-10-20T12:00:00Z",
      GIT_COMMITTER_DATE: "2026-10-20T12:00:00Z",
    },
  }).trim();
git("init", "-q", "-b", "learn");
git("config", "user.name", "Prompt2Ship example");
git("config", "user.email", "example@example.invalid");
await writeFile(
  join(work, "需求单.md"),
  await readFile(join(root, "public/examples/需求单.md")),
);
await writeFile(
  join(work, "index.html"),
  await readFile(join(root, "public/examples/homepage-v1.html")),
);
git("add", "index.html", "需求单.md");
git("commit", "-qm", "v1 个人主页初稿");
const v1 = git("rev-parse", "--short=7", "HEAD");
await writeFile(
  join(work, "index.html"),
  await readFile(join(root, "public/examples/homepage-v2.html")),
);
git("diff", "--check");
assert.equal(git("diff", "--name-only"), "index.html");
git("add", "index.html");
git("commit", "-qm", "v2 修复手机端横向溢出");
const v2 = git("rev-parse", "--short=7", "HEAD");
const log = git("log", "-2", "--oneline");
git(
  "bundle",
  "create",
  join(root, "public/examples/homepage-history.bundle"),
  "--all",
);
const evidence = {
  checkedAt: "2026-10-20",
  v1,
  v2,
  log,
  changedFiles: ["index.html"],
  scope: "只改 CSS；浏览器验收见自动化交互测试。",
  command: "git log -2 --oneline",
  source:
    "scripts/verify-homepage.mjs 在一次性目录创建的真实 Git 仓库；不是读者本机的历史。",
};
await writeFile(
  join(root, "src/data/homepage-evidence.json"),
  JSON.stringify(evidence, null, 2) + "\n",
);
await writeFile(
  join(root, "public/examples/homepage-verification.json"),
  JSON.stringify(evidence, null, 2) + "\n",
);
console.log(log);
