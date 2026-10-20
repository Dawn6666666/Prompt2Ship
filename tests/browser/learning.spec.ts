import { test, expect, type Page } from "@playwright/test";

async function openPage(page: Page, url: string) {
  await page.goto(url);
  await expect(page.locator('astro-island[client="load"][ssr]')).toHaveCount(0);
}

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (error) => {
    throw error;
  });
});

test("homepage previews a real overflow and its repair", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await openPage(page, "/");
  await expect(page.locator('astro-island[client="load"][ssr]')).toHaveCount(0);
  await page.getByRole("button", { name: "02 发现问题" }).click();
  const frame = page.frameLocator(".hero-demo iframe");
  await expect(frame.locator("h1")).toContainText("让复杂的事情");
  expect(
    await frame.locator("html").evaluate((el) => el.scrollWidth > innerWidth),
  ).toBe(true);
  await page.getByRole("button", { name: "03 反馈修复" }).click();
  await expect(frame.locator("main")).toHaveCSS("max-width", "760px");
  expect(
    await frame.locator("html").evaluate((el) => el.scrollWidth <= innerWidth),
  ).toBe(true);
  await expect(page.locator(".hero-demo a")).toHaveAttribute(
    "href",
    "/case/from-scratch#iterate",
  );
  expect(errors).toEqual([]);
});

test("portfolio stages link prompt, code and preview without waiting for playback", async ({
  page,
}) => {
  await openPage(page, "/case/from-scratch#iterate");
  await expect(page.locator(".case-stage-heading h2")).toContainText(
    "给具体反馈",
  );
  await expect(page.locator("iframe")).toBeVisible();
  await page.getByRole("button", { name: "01 容器宽度" }).click();
  await expect(page.frameLocator("iframe").locator("main")).toHaveCSS(
    "outline-style",
    "solid",
  );
  await page.getByRole("tab", { name: "代码差异" }).click();
  await expect(page.locator(".code-comparison")).toContainText(
    "max-width: 760px",
  );
  await expect(
    page.locator('.line.is-code-focused[data-after-line="2"]'),
  ).toContainText("max-width");
  await page.getByRole("button", { name: "03 项目网格" }).click();
  await expect(
    page.locator('.line.is-code-focused[data-after-line="9"]'),
  ).toContainText("grid-template-columns: 1fr;");
  await page.getByRole("button", { name: "并排代码视图" }).click();
  await expect(page.locator(".code-columns>section")).toHaveCount(2);
  await expect(
    page.locator('.line.is-code-focused[data-after-line="9"]'),
  ).toContainText("grid-template-columns: 1fr;");
  await page.getByRole("tab", { name: "运行效果" }).click();
  await expect(page.frameLocator("iframe").locator(".projects")).toHaveCSS(
    "outline-style",
    "solid",
  );
  await page.getByRole("button", { name: "768px 平板预览" }).click();
  await expect(page.locator(".preview-dimension")).toContainText("768px");
  await page
    .getByRole("button", { name: "完成交付", exact: false })
    .first()
    .click();
  await expect(page.locator(".download-card")).toHaveAttribute(
    "href",
    "/examples/folio.html",
  );
  await page.reload();
  await expect(page.locator(".delivery-document")).toBeVisible();
});

test("Todo traces clear and omitted notes and exposes real verification evidence", async ({
  page,
  request,
}) => {
  await openPage(page, "/case/todo-app#flow");
  await page.getByRole("button", { name: "清空备注", exact: true }).click();
  await page.locator(".flow-nodes button").nth(1).click();
  await expect(page.locator(".flow-json")).toContainText('"notes": ""');
  await page
    .getByRole("button", { name: "只切换完成状态", exact: true })
    .click();
  await page.locator(".flow-nodes button").nth(2).click();
  await expect(page.locator(".flow-server")).toContainText(
    "undefined · 没有传入",
  );
  await page.locator(".flow-nodes button").nth(4).click();
  await expect(page.locator(".flow-task p")).toContainText("手机截图");
  await page
    .getByRole("button", { name: "验证", exact: false })
    .first()
    .click();
  await expect(page.locator(".verification-list>div")).toHaveCount(9);
  await expect(page.locator(".verification-summary")).toContainText(
    "前端构建通过",
  );
  await expect(page.locator(".browser-evidence")).toContainText(
    "真实界面验证通过",
  );
  await page.getByText("展开验证环境、命令与关键输出", { exact: true }).click();
  await expect(page.locator(".evidence-details")).toContainText("HTTP 200");
  expect((await request.get("/examples/todo-notes.patch")).status()).toBe(200);
});

test("switching versions and views preserves the preview viewport and reading position", async ({
  page,
}) => {
  await openPage(page, "/case/from-scratch#iterate");
  const frame = page.frameLocator("iframe");
  await expect(frame.locator("main")).toHaveCSS("max-width", "760px");
  await page.locator("iframe").evaluate(async (element) => {
    const win = (element as HTMLIFrameElement).contentWindow!;
    await new Promise<void>((resolve) =>
      window.requestAnimationFrame(() =>
        window.requestAnimationFrame(() => resolve()),
      ),
    );
    win.scrollTo(0, 150);
  });
  await expect
    .poll(() =>
      frame
        .locator("html")
        .evaluate((element) => element.ownerDocument.defaultView!.scrollY),
    )
    .toBe(150);
  await page.getByRole("tab", { name: "代码差异" }).click();
  await page.getByRole("tab", { name: "运行效果" }).click();
  await expect
    .poll(() =>
      frame
        .locator("html")
        .evaluate((element) => element.ownerDocument.defaultView!.scrollY),
    )
    .toBe(150);
  await page.getByRole("button", { name: "修改前", exact: true }).click();
  await expect(frame.locator("main")).toHaveCSS("width", "760px");
  await expect
    .poll(() =>
      frame
        .locator("html")
        .evaluate((element) => element.ownerDocument.defaultView!.scrollY),
    )
    .toBe(150);
  await expect(page.locator(".preview-dimension")).toContainText("375px");
});

test("editor references zoom with keyboard dismissal and OS preference persists", async ({
  page,
}) => {
  await openPage(page, "/learn/setup/vscode/");
  await expect(page.locator('astro-island[client="load"][ssr]')).toHaveCount(0);
  await page.getByRole("button", { name: "Linux", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Linux", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "02 打开编辑器" }).click();
  await page.locator(".reference-image summary").click();
  const trigger = page.getByRole("button", {
    name: "放大参考图：文件区、编辑区与终端的位置",
  });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "终端", exact: true }).click();
  await expect(page.locator(".reference-viewport img")).toHaveAttribute(
    "style",
    /200%/,
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await openPage(page, "/learn/setup/agent/");
  await expect(
    page.getByRole("button", { name: "Linux", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".agent-setup")).toContainText(
    "npm install -g @opencode/cli",
  );
  await page.getByRole("button", { name: "02 连接模型" }).click();
  await expect(page.locator(".agent-command")).toContainText("/connect");
  await expect(page.locator(".agent-command")).toContainText("/models");
});

test("local practice progress requires explicit self-check and persists", async ({
  page,
}) => {
  await openPage(page, "/learn/setup/vscode/");
  await expect(page.locator('astro-island[client="load"][ssr]')).toHaveCount(0);
  await page.getByRole("button", { name: "04 找到终端" }).click();
  await expect(page.locator(".practice-title")).toContainText("本地练习");
  const checks = page.locator(".practice-task input");
  await checks.nth(0).check();
  await checks.nth(1).check();
  await expect(page.locator(".practice-title")).toContainText("已自查");
  await page.reload();
  await expect(checks.nth(0)).toBeChecked();
  await expect(checks.nth(1)).toBeChecked();
  await openPage(page, "/learn/");
  await expect(page.locator(".practice-progress")).toContainText("1 / 8");
});

test("case commands follow the displayed stage and Todo follow-along pins the baseline", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await openPage(page, "/case/from-scratch#build");
  await page.getByRole("tab", { name: "运行命令" }).click();
  await expect(page.locator(".terminal-scene pre")).toContainText(
    'git commit -m "feat: add portfolio draft"',
  );
  await page.getByRole("button", { name: "复制当前命令" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    'git commit -m "feat: add portfolio draft"',
  );
  await openPage(page, "/case/from-scratch#iterate");
  await page.getByRole("tab", { name: "运行命令" }).click();
  await page.getByRole("button", { name: "复制当前命令" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "git diff -- index.html",
  );
  await openPage(page, "/case/todo-app#understand");
  await page.locator(".todo-follow-along > summary").click();
  await expect(page.locator(".follow-body")).toContainText(
    "a5a648a426d46f1576caf920d40c738455023e7e",
  );
  await page.getByRole("button", { name: "应用参考补丁", exact: true }).click();
  await expect(page.locator(".follow-body")).toContainText(
    "git apply --check todo-notes.patch",
  );
  await expect(page.locator(".follow-body")).toContainText(
    "npm start --workspace=todo-server",
  );
});

test("reduced motion offers manual frames and checklists retain pending states", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openPage(page, "/learn/setup/vscode/");
  await page.getByRole("button", { name: "前进一帧（减少动态效果）" }).click();
  await expect(
    page.getByRole("button", { name: "02 打开编辑器" }),
  ).toHaveAttribute("aria-pressed", "true");
  await openPage(page, "/case/from-scratch#verify");
  await expect(
    page.locator(".verification-list .verify-icon.warn"),
  ).toHaveCount(4);
  await expect(page.locator(".verification-list")).toContainText("需要观察");
});

test("documentation keeps the editor tour and indexed search functional", async ({
  page,
}) => {
  await openPage(page, "/learn/setup/vscode/");
  await expect(page.locator(".sl-steps li")).toHaveCount(4);
  await page.getByRole("button", { name: "macOS", exact: true }).click();
  await expect(page.locator(".editor-download")).toContainText("Apple 芯片");
  await page.getByRole("button", { name: "04 找到终端" }).click();
  await expect(page.locator(".editor-terminal")).toBeVisible();
  await page.locator("button[data-open-modal]").click();
  await page.locator(".pagefind-ui__search-input").fill("备注");
  await expect(page.locator(".pagefind-ui__result").first()).toBeVisible();
});

test("theme choice persists between custom and Starlight pages", async ({
  page,
}) => {
  await openPage(page, "/");
  await page.getByRole("button", { name: "切换深色主题", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await openPage(page, "/learn/setup/vscode/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "切换浅色主题", exact: true }).click();
  await openPage(page, "/case/todo-app");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("mobile chapter navigation and every case stage fit the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 850 });
  await openPage(page, "/learn/setup/vscode/");
  await expect(page.locator(".p-mobile-menu")).toBeHidden();
  const themeBox = await page
    .getByRole("button", { name: "切换深色主题", exact: true })
    .boundingBox();
  const searchBox = await page.locator("button[data-open-modal]").boundingBox();
  expect(themeBox!.x + themeBox!.width).toBeLessThanOrEqual(searchBox!.x);
  await page.locator(".sl-menu-button").click();
  await expect(page.locator("#starlight__sidebar")).toBeVisible();
  await page
    .locator("#starlight__sidebar a")
    .filter({ hasText: "用 Git" })
    .click();
  await expect(page.locator("h1")).toContainText("Git");
  for (const route of [
    "/",
    "/case/from-scratch",
    "/case/todo-app",
    "/review",
    "/learn/setup/agent/",
    "/learn/workflow/run-and-feedback/",
  ]) {
    await openPage(page, route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBe(true);
    const stages = page.locator(".case-stage-nav>button");
    for (let i = 0; i < (await stages.count()); i++) {
      await stages.nth(i).click();
      const checkpoint = await page
        .locator(".case-artifact > .scene-checkpoint")
        .boundingBox();
      const footer = await page.locator(".case-stage-footer").boundingBox();
      expect(checkpoint!.y + checkpoint!.height).toBeLessThanOrEqual(
        footer!.y + 1,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} stage ${i}`,
      ).toBe(true);
    }
  }
  await openPage(page, "/case/todo-app#understand");
  await page.locator(".todo-follow-along > summary").click();
  await page.getByRole("button", { name: "应用参考补丁", exact: true }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
