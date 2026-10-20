/** Reproduce the notes lesson in a disposable copy. Never edits the reference repository. */
import { cp, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { chromium, expect } from "@playwright/test";

const root = resolve(import.meta.dirname, "..");
const source = resolve(
  process.argv[2] || join(root, "../FrontendFramework/todo-app"),
);
const upstream = execFileSync("git", ["rev-parse", "--short=7", "HEAD"], {
  cwd: source,
  encoding: "utf8",
}).trim();
assert.equal(
  upstream,
  "a5a648a",
  "The lesson is pinned to upstream a5a648a. Review a different baseline explicitly.",
);
const work = await mkdtemp("/tmp/opencode/prompt2ship-todo-");
for (const item of ["package.json", "package-lock.json", "client", "server"])
  await cp(join(source, item), join(work, item), {
    recursive: true,
    filter: (path) =>
      !/(^|\/)(node_modules|dist|todos\.db(?:-shm|-wal)?)($|\/)/.test(path),
  });
const commands = [];
const run = (program, args, opts = {}) => {
  const output = execFileSync(program, args, {
    cwd: work,
    encoding: "utf8",
    ...opts,
  });
  if (output) process.stdout.write(output);
  // Store reproducible summaries, excluding temporary paths and install noise.
  if (program === "npm")
    commands.push({
      command: [program, ...args].join(" "),
      output: output.replaceAll(work, "<case-project>").trim().slice(-2200),
    });
  return output;
};
run("git", ["init", "-q"]);
run("git", ["config", "user.name", "Prompt2Ship verification"]);
run("git", ["config", "user.email", "verification@example.invalid"]);
await writeFile(
  join(work, ".gitignore"),
  "node_modules/\ndist/\n*.db\n*.db-shm\n*.db-wal\n",
);
run("git", ["add", "."]);
run("git", [
  "-c",
  "user.name=Prompt2Ship verification",
  "-c",
  "user.email=verification@example.invalid",
  "commit",
  "-qm",
  "upstream baseline",
]);
console.log(`Verification copy: ${work}`);
const baseline = run("git", ["rev-parse", "HEAD"]).trim();
run("npm", ["ci", "--no-audit", "--no-fund"]);
const require = createRequire(join(work, "server/package.json"));
const originalDb = require(join(work, "server/db.js"));
originalDb
  .prepare("INSERT INTO todos (title, category, priority) VALUES (?, ?, ?)")
  .run("已有任务", "study", "high");
originalDb.close();
delete require.cache[require.resolve(join(work, "server/db.js"))];

async function edit(file, transform) {
  const path = join(work, file);
  const before = await readFile(path, "utf8");
  const after = transform(before);
  assert.notEqual(after, before, `Expected modification in ${file}`);
  await writeFile(path, after);
}
await edit("server/db.js", (text) =>
  text.replace(
    "module.exports = db;",
    `// Add the field once, preserving existing tasks.
const columns = db.prepare('PRAGMA table_info(todos)').all();
if (!columns.some(column => column.name === 'notes')) {
  db.exec("ALTER TABLE todos ADD COLUMN notes TEXT NOT NULL DEFAULT ''");
}

module.exports = db;`,
  ),
);
await edit("server/routes/todos.js", (text) =>
  text
    .replace(
      "const { title, category = '', priority = 'medium' } = req.body;",
      "const { title, category = '', priority = 'medium', notes = '' } = req.body;\n\n  if (typeof notes !== 'string') {\n    return res.status(400).json({ error: 'Notes must be a string' });\n  }",
    )
    .replace(
      "INSERT INTO todos (title, category, priority, sort_order) VALUES (?, ?, ?, ?)",
      "INSERT INTO todos (title, category, priority, sort_order, notes) VALUES (?, ?, ?, ?, ?)",
    )
    .replace(
      ".run(title.trim(), category, priority, sort_order);",
      ".run(title.trim(), category, priority, sort_order, notes.trim());",
    )
    .replace(
      "const { title, completed, category, priority } = req.body;",
      "const { title, completed, category, priority, notes } = req.body;\n\n  if (notes !== undefined && typeof notes !== 'string') {\n    return res.status(400).json({ error: 'Notes must be a string' });\n  }",
    )
    .replace(
      "priority: priority !== undefined ? priority : existing.priority,",
      "priority: priority !== undefined ? priority : existing.priority,\n    notes: notes !== undefined ? notes.trim() : existing.notes,",
    )
    .replace(
      "UPDATE todos SET title = ?, completed = ?, category = ?, priority = ? WHERE id = ?",
      "UPDATE todos SET title = ?, completed = ?, category = ?, priority = ?, notes = ? WHERE id = ?",
    )
    .replace(
      ".run(updated.title, updated.completed, updated.category, updated.priority, id);",
      ".run(updated.title, updated.completed, updated.category, updated.priority, updated.notes, id);",
    ),
);
await edit("client/src/components/TodoForm.jsx", (text) =>
  text
    .replace(
      "const [priority, setPriority] = useState('medium');",
      "const [priority, setPriority] = useState('medium');\n  const [notes, setNotes] = useState('');",
    )
    .replace(
      "setPriority(editingTodo.priority || 'medium');",
      "setPriority(editingTodo.priority || 'medium');\n      setNotes(editingTodo.notes ?? '');",
    )
    .replaceAll(
      "setPriority('medium');",
      "setPriority('medium');\n      setNotes('');",
    )
    .replace(
      "onSubmit({ title, category, priority });",
      "onSubmit({ title, category, priority, notes });",
    )
    .replace(
      "      <div className={styles.row}>",
      `      <label htmlFor="task-notes">任务备注（可选）</label>
      <textarea id="task-notes" className={styles.input}
        value={notes} onChange={event => setNotes(event.target.value)}
        placeholder="补充背景、链接或下一步…" rows={3} />
      <div className={styles.row}>`,
    ),
);
await edit("client/src/components/TodoItem.jsx", (text) =>
  text.replace(
    "<span className={styles.title}>{todo.title}</span>",
    `<span className={styles.title}>{todo.title}</span>
        {todo.notes && <p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
          fontSize: 13, color: '#6b7280', margin: '6px 0' }}>{todo.notes}</p>}`,
  ),
);
// Save and exercise a real defective v1 before restoring the one-line fix.
const routePath = "server/routes/todos.js";
const fixedRoute = await readFile(join(work, routePath), "utf8");
assert.ok(
  fixedRoute.includes("notes !== undefined ? notes.trim() : existing.notes"),
);
await writeFile(
  join(work, routePath),
  fixedRoute.replace(
    "notes !== undefined ? notes.trim() : existing.notes",
    "(notes ?? '').trim()",
  ),
);
run("git", [
  "add",
  "server/db.js",
  routePath,
  "client/src/components/TodoForm.jsx",
  "client/src/components/TodoItem.jsx",
]);
run("git", ["commit", "-qm", "v1 添加任务备注（待检查）"]);
const v1 = run("git", ["rev-parse", "--short=7", "HEAD"]).trim();
const express = require("express");
const brokenApp = express();
brokenApp.use(express.json());
brokenApp.use("/api/todos", require(join(work, routePath)));
const brokenServer = brokenApp.listen(0, "127.0.0.1");
await new Promise((resolve) => brokenServer.once("listening", resolve));
let defect;
try {
  const url = `http://127.0.0.1:${brokenServer.address().port}/api/todos`;
  const post = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "v1 缺陷复现", notes: "这条备注应该保留" }),
  });
  const created = await post.json();
  const put = await fetch(`${url}/${created.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: true }),
  });
  const toggled = await put.json();
  assert.equal(created.notes, "这条备注应该保留");
  assert.equal(toggled.notes, "");
  await fetch(`${url}/${created.id}`, { method: "DELETE" });
  defect = {
    commit: v1,
    request: { completed: true },
    before: created.notes,
    after: toggled.notes,
    reproduced: true,
  };
} finally {
  await new Promise((resolve) => brokenServer.close(resolve));
}
require(join(work, "server/db.js")).close();
delete require.cache[require.resolve(join(work, routePath))];
delete require.cache[require.resolve(join(work, "server/db.js"))];
await writeFile(join(work, routePath), fixedRoute);
const checks = [];
let browserEvidence;
let browserVersion = "";
function check(name, detail, fn) {
  fn();
  checks.push({ name, detail, passed: true });
  console.log(`PASS ${name}`);
}
const db = require(join(work, "server/db.js"));
check("旧数据迁移", "已有任务保留，新增 notes 列的默认值为空字符串。", () =>
  assert.equal(
    db.prepare("SELECT notes FROM todos WHERE id = 1").get().notes,
    "",
  ),
);
db.close();
delete require.cache[require.resolve(join(work, "server/db.js"))];
const migrated = require(join(work, "server/db.js"));
check("重复运行迁移", "再次初始化数据库，不重复加列，不删除旧任务。", () => {
  assert.equal(
    migrated
      .prepare("PRAGMA table_info(todos)")
      .all()
      .filter((x) => x.name === "notes").length,
    1,
  );
  assert.equal(migrated.prepare("SELECT count(*) AS n FROM todos").get().n, 1);
});
const app = express();
app.use(express.json());
app.use("/api/todos", require(join(work, "server/routes/todos.js")));
const server = app.listen(0, "127.0.0.1");
await new Promise((resolve) => server.once("listening", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
async function api(path = "", method = "GET", body) {
  const res = await fetch(`${origin}/api/todos${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const data = await res.json();
  if ((method === "POST" || method === "PUT") && path !== "/reorder") {
    commands.push({
      command: `${method} /api/todos${path}`,
      output: `Request: ${JSON.stringify(body)}\nHTTP ${res.status}\nResponse: ${JSON.stringify(data)}`,
    });
  }
  return { status: res.status, data };
}
try {
  const created = await api("", "POST", {
    title: "交付作品网站",
    notes: "  补充手机截图，检查联系入口。  ",
    category: "web",
    priority: "high",
  });
  const id = created.data.id;
  check(
    "新增与重新读取",
    "POST 保存备注；独立 GET 请求能读取修剪后的内容。",
    () => assert.equal(created.data.notes, "补充手机截图，检查联系入口。"),
  );
  assert.equal(
    (await api()).data.find((x) => x.id === id).notes,
    "补充手机截图，检查联系入口。",
  );
  const edited = await api(`/${id}`, "PUT", {
    notes: "手机截图已补充，等待最后检查。",
  });
  check("编辑备注", "只更新 notes，任务标题、分类和优先级保持原值。", () => {
    assert.equal(edited.data.notes, "手机截图已补充，等待最后检查。");
    assert.equal(edited.data.title, "交付作品网站");
    assert.equal(edited.data.category, "web");
    assert.equal(edited.data.priority, "high");
  });
  const toggled = await api(`/${id}`, "PUT", { completed: true });
  check("切换状态保留备注", "PUT 只传 completed 时，保留已有 notes。", () => {
    assert.equal(toggled.data.notes, edited.data.notes);
    assert.equal(toggled.data.completed, 1);
  });
  await api(`/${id}`, "PUT", { notes: "" });
  check("主动清空备注", "传空字符串后，独立 GET 返回的备注仍为空。", () => {});
  assert.equal((await api()).data.find((x) => x.id === id).notes, "");
  const invalid = await api(`/${id}`, "PUT", { notes: 42 });
  const invalidCreate = await api("", "POST", {
    title: "非法备注",
    notes: null,
  });
  check("备注输入校验", "创建与更新均拒绝非字符串备注，返回 400。", () => {
    assert.equal(invalid.status, 400);
    assert.equal(invalidCreate.status, 400);
  });
  const filtered = await api("?category=web&priority=high&search=交付");
  await api("/reorder", "PUT", { orderedIds: [id, 1] });
  const ordered = await api();
  check(
    "筛选与排序回归",
    "分类、优先级、标题搜索和拖拽排序接口仍可用。",
    () => {
      assert.equal(filtered.data.length, 1);
      assert.equal(ordered.data[0].id, id);
    },
  );
  const removed = await api(`/${id}`, "DELETE");
  check("删除与旧任务保留", "删除新增任务成功，原有任务仍存在。", () =>
    assert.equal(removed.status, 200),
  );
  assert.equal((await api()).data.length, 1);
  run("npm", ["run", "build", "--workspace=todo-client"]);
  app.use(express.static(join(work, "client/dist")));
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    browserVersion = browser.version();
    const page = await browser.newPage({
      viewport: { width: 1280, height: 960 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(origin);
    const title = page.getByPlaceholder("What needs to be done?");
    const notes = page.getByLabel("任务备注（可选）");
    const task = page
      .locator('[draggable="true"]')
      .filter({ hasText: "浏览器验证任务" });
    await title.fill("浏览器验证任务");
    await notes.fill("第一条备注：完成手机截图。\n确认邮件入口。");
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await expect(task).toContainText("第一条备注");
    await expect(notes).toHaveValue("");
    await page.reload();
    await expect(task).toContainText("确认邮件入口");
    const steps = [
      "通过原项目表单新增多行备注，提交后输入框清空；刷新后备注仍存在。",
    ];
    await task.locator('button[title="Edit"]').click();
    await expect(notes).toHaveValue(
      "第一条备注：完成手机截图。\n确认邮件入口。",
    );
    await notes.fill("编辑后的备注：手机截图已补充。");
    await page.getByRole("button", { name: "Update", exact: true }).click();
    await expect(task).toContainText("编辑后的备注");
    await page.reload();
    await expect(task).toContainText("手机截图已补充");
    steps.push("点击编辑时正确回填；更新备注并刷新，显示新内容。");
    await task.locator('button[title="Edit"]').click();
    await notes.fill("这条修改应被取消");
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(notes).toHaveValue("");
    await expect(task).not.toContainText("这条修改应被取消");
    steps.push("取消编辑不会保存草稿，新建表单不残留上次备注。");
    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes("/api/todos/") &&
          response.request().method() === "PUT" &&
          response.status() === 200,
      ),
      task.getByRole("checkbox").click(),
    ]);
    await expect(task.getByRole("checkbox")).toBeChecked();
    await page.reload();
    await expect(task.getByRole("checkbox")).toBeChecked();
    await expect(task).toContainText("编辑后的备注");
    steps.push("仅切换完成状态，刷新后完成状态和原备注均保留。");
    await mkdir(join(root, "public/examples"), { recursive: true });
    await page.screenshot({
      path: join(root, "public/examples/todo-browser-verified.png"),
      fullPage: true,
    });
    await task.locator('button[title="Edit"]').click();
    await expect(notes).toHaveValue("编辑后的备注：手机截图已补充。");
    await notes.fill("");
    await page.getByRole("button", { name: "Update", exact: true }).click();
    await expect(task.locator("p")).toHaveCount(0);
    await page.reload();
    await expect(task.locator("p")).toHaveCount(0);
    const persisted = (await api()).data.find(
      (item) => item.title === "浏览器验证任务",
    );
    assert.equal(persisted.notes, "");
    assert.equal(
      migrated.prepare("SELECT notes FROM todos WHERE id = ?").get(persisted.id)
        .notes,
      "",
    );
    await expect(page.getByText("已有任务", { exact: true })).toBeVisible();
    assert.deepEqual(errors, []);
    steps.push(
      "主动清空备注后刷新，列表、GET 响应与 SQLite 均为空字符串；旧任务仍存在。",
    );
    browserEvidence = {
      passed: true,
      steps,
      screenshot: "/examples/todo-browser-verified.png",
    };
    commands.push({
      command: "浏览器实际操作 → GET /api/todos → SELECT notes FROM todos",
      output: steps.map((step) => `PASS ${step}`).join("\n"),
    });
  } finally {
    await browser.close();
  }
} finally {
  await new Promise((resolve) => server.close(resolve));
  migrated.close();
}
const patch = execFileSync(
  "git",
  [
    "diff",
    baseline,
    "--",
    "server/db.js",
    "server/routes/todos.js",
    "client/src/components/TodoForm.jsx",
    "client/src/components/TodoItem.jsx",
  ],
  { cwd: work, encoding: "utf8" },
);
await mkdir(join(root, "public/examples"), { recursive: true });
await writeFile(join(root, "public/examples/todo-notes.patch"), patch);
// Check that the downloadable artifact applies cleanly to the pinned source.
run("git", ["apply", "--reverse", "--check", "-"], { input: patch });
const changedFiles = run("git", ["diff", "--name-only", baseline])
  .trim()
  .split("\n")
  .sort();
check("修改范围", "相对基线恰好只改动数据库、接口、表单和列表四个文件。", () =>
  assert.deepEqual(changedFiles, [
    "client/src/components/TodoForm.jsx",
    "client/src/components/TodoItem.jsx",
    "server/db.js",
    "server/routes/todos.js",
  ]),
);
run("git", ["diff", "--check"]);
run("git", ["add", routePath]);
run("git", ["commit", "-qm", "v2 修复切换完成状态清空备注"]);
const v2 = run("git", ["rev-parse", "--short=7", "HEAD"]).trim();
const gitLog = run("git", ["log", "-2", "--oneline"]).trim();
assert.equal(run("git", ["status", "--porcelain"]).trim(), "");
const apiResults = checks
  .map((entry) => `PASS ${entry.name}: ${entry.detail}`)
  .join("\n");
commands.push({
  command: "SQLite 迁移 + Express 实际 HTTP 请求断言",
  output: apiResults,
});
const evidence = {
  checkedAt: new Date().toISOString().slice(0, 10),
  upstream,
  checks,
  defect,
  git: { v1, v2, log: gitLog, changedFiles },
  frontendBuild: true,
  browser: browserEvidence,
  environment: {
    node: process.version,
    npm: execFileSync("npm", ["--version"], { encoding: "utf8" }).trim(),
    browser: `Chrome ${browserVersion}`,
    platform: `${process.platform} ${process.arch}`,
  },
  commands: [
    {
      command: "npm run verify:todo",
      output: `${checks.length} API/SQLite checks passed; frontend build passed; ${browserEvidence.steps.length} browser scenarios passed.`,
    },
    ...commands,
  ],
  patchSha256: createHash("sha256").update(patch).digest("hex"),
};
await writeFile(
  join(root, "src/data/todo-evidence.json"),
  JSON.stringify(evidence, null, 2) + "\n",
);
await writeFile(
  join(root, "public/examples/todo-verification.json"),
  JSON.stringify(evidence, null, 2) + "\n",
);
console.log(
  `Verified ${checks.length} checks, frontend build, and downloadable patch.`,
);
