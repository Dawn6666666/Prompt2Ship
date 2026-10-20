import { test, expect, type Page } from "@playwright/test";
import { gzipSync } from "node:zlib";
import AxeBuilder from "@axe-core/playwright";

async function open(page: Page, url: string) {
  await page.goto(url);
  await expect(page.locator('astro-island[client="load"][ssr]')).toHaveCount(0);
  await expect(page.locator(".case-skeleton")).toHaveCount(0);
}
async function next(page: Page) {
  await page
    .locator(".substep-controls")
    .getByRole("button", { name: "下一小步" })
    .click();
}
test.beforeEach(({ page }) => {
  page.on("pageerror", (error) => {
    throw error;
  });
});

test("home demo uses real HTML and exposes the mobile defect and repair", async ({
  page,
}) => {
  await open(page, "/");
  const buttons = page.locator(".home-demo-story > button");
  await buttons.nth(1).click();
  const frame = page.frameLocator(".home-demo iframe");
  await expect(frame.locator("h1")).toContainText("周小满");
  await expect(page.locator(".preview-footer")).toContainText("检测到横向溢出");
  expect(
    await frame.locator("html").evaluate((el) => el.scrollWidth > innerWidth),
  ).toBe(true);
  await buttons.nth(2).click();
  await expect(page.locator(".preview-footer")).toContainText("无横向溢出");
  expect(
    await frame.locator("html").evaluate((el) => el.scrollWidth <= innerWidth),
  ).toBe(true);
});

test("five-question draft changes the brief, survives reload, and generates a bounded prompt", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await open(page, "/case/homepage/");
  await next(page);
  const first = page.locator(".question-content").first();
  await first.getByRole("checkbox").first().check();
  await first.getByRole("textbox").fill("给摄影社同学看");
  await expect(page.locator(".live-brief")).toContainText("给摄影社同学看");
  await page.reload();
  await next(page);
  await expect(first.getByRole("textbox")).toHaveValue("给摄影社同学看");
  await page.getByRole("button", { name: "填入示例", exact: true }).click();
  await next(page);
  await next(page);
  await expect(page.locator(".prompt-lesson")).toContainText("已回答 5/5");
  await expect(page.locator(".prompt-block pre")).toContainText(
    "请先不要写代码",
  );
  await page
    .locator(".prompt-block")
    .getByRole("button", { name: "复制", exact: true })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "不用框架",
  );
  await expect(
    page.getByRole("link", { name: "下载我的需求单" }),
  ).toHaveAttribute("download", "需求单.md");
});

test("reply, saved file, running server and user completion remain separate", async ({
  page,
}) => {
  await open(page, "/case/homepage/?step=3");
  const states = page.locator(".status-track > span");
  await expect(states.nth(0)).toHaveAttribute("data-on", "true");
  await expect(states.nth(1)).toHaveAttribute("data-on", "false");
  await expect(
    page.locator(".file-tree button").filter({ hasText: "index.html" }),
  ).toHaveCount(0);
  await page.getByRole("tab", { name: "预览", exact: true }).click();
  await expect(page.locator(".empty-state")).toContainText("文件还没有运行");
  await expect(page.locator("iframe")).toHaveCount(0);
  await next(page);
  await expect(page.locator(".file-tree")).toContainText("index.html");
  await expect(page.locator(".code-view")).toContainText("周小满");
  await expect(states.nth(1)).toHaveAttribute("data-on", "true");
  await expect(states.nth(2)).toHaveAttribute("data-on", "false");
  await next(page);
  await expect(page.locator(".terminal-output")).toContainText(
    "localhost:3000",
  );
  await page.getByRole("button", { name: /打开示例预览/ }).click();
  await expect(page.frameLocator("iframe").locator("main")).toBeVisible();
  await expect(states.nth(2)).toHaveAttribute("data-on", "true");
  await expect(states.nth(3)).toHaveAttribute("data-on", "false");
  await next(page);
  await expect(page.locator(".done-check input")).not.toBeChecked();
  await page.locator(".done-check input").check();
  await expect(
    page.locator(".desktop-steps .step-button").nth(2).locator("svg"),
  ).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".done-check input")).toBeChecked();
});

test("versions retain viewport and scroll, width detection updates, and diff links code to effect", async ({
  page,
}) => {
  await open(page, "/case/homepage/?step=4");
  const preview = page.locator('[role="tabpanel"][data-state="active"]');
  const frame = page.frameLocator(
    '[role="tabpanel"][data-state="active"] iframe',
  );
  await expect(preview.locator(".preview-footer")).toContainText(
    "检测到横向溢出",
  );
  await preview.getByRole("button", { name: "1280px 预览" }).click();
  await expect(preview.locator(".preview-footer")).toContainText("无横向溢出");
  await preview.getByRole("button", { name: "375px 预览" }).click();
  await expect(preview.locator(".preview-footer")).toContainText(
    "检测到横向溢出",
  );
  await page
    .locator("iframe")
    .evaluate((el) =>
      (el as HTMLIFrameElement).contentWindow!.scrollTo(0, 100),
    );
  await expect
    .poll(() =>
      frame
        .locator("html")
        .evaluate((el) => el.ownerDocument.defaultView!.scrollY),
    )
    .toBe(100);
  await page.waitForTimeout(50); // Let the browser's scroll event update the retained position.
  await preview.getByRole("button", { name: "修改后", exact: true }).click();
  await expect(frame.locator("main")).toHaveCSS("max-width", "760px");
  await expect
    .poll(() =>
      frame
        .locator("html")
        .evaluate((el) => el.ownerDocument.defaultView!.scrollY),
    )
    .toBe(100);
  await expect(preview.locator(".preview-footer")).toContainText("375px");
  await next(page);
  await next(page);
  await page.getByRole("button", { name: /容器不再固定/ }).click();
  await expect(page.locator(".line.is-code-focused").first()).toContainText(
    "main",
  );
  await expect(
    page
      .frameLocator('[role="tabpanel"][data-state="active"] iframe')
      .locator("main"),
  ).toHaveCSS("outline-style", "solid");
  await page.getByRole("button", { name: "并排代码视图" }).click();
  await expect(page.locator(".code-columns > section")).toHaveCount(2);
});

test("URL state, browser back, fixed-example brief, delivery and real history", async ({
  page,
  request,
}) => {
  await open(page, "/case/homepage/?step=5");
  await expect(page.locator(".lesson-aside h2")).toHaveText("检查并交付");
  await page.getByRole("button", { name: "需求单", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("个人主页需求单");
  await page.keyboard.press("Escape");
  await next(page);
  await next(page);
  await expect(page.locator(".terminal-output")).toContainText(
    /[0-9a-f]{7} v2/,
  );
  await expect(
    page.getByRole("link", { name: "下载 index.html" }),
  ).toHaveAttribute("download", "index.html");
  expect((await request.get("/examples/homepage-history.bundle")).ok()).toBe(
    true,
  );
  await page.locator(".desktop-steps .step-button").nth(2).click();
  await expect(page).toHaveURL(/step=3/);
  await page.goBack();
  await expect(page.locator(".lesson-aside h2")).toHaveText("检查并交付");
});

test("Todo reproduces the defect, resets version comparison and exposes real evidence", async ({
  page,
  request,
}) => {
  await open(page, "/case/todo/?step=4");
  await page.getByRole("checkbox", { name: "完成任务", exact: true }).check();
  await expect(page.locator(".todo-item")).toContainText("没有备注");
  await page.getByRole("button", { name: "修改后", exact: true }).click();
  await page.getByRole("checkbox", { name: "完成任务", exact: true }).check();
  await expect(page.locator(".todo-item")).toContainText("带学生证");
  await page.getByRole("textbox", { name: "编辑备注" }).fill("");
  await page.getByRole("button", { name: "保存备注" }).click();
  await expect(page.locator(".todo-item")).toContainText("没有备注");
  await open(page, "/case/todo/?step=5");
  await page.locator(".evidence > summary").click();
  await expect(page.locator(".evidence")).toContainText("修改范围");
  const evidence = await (
    await request.get("/examples/todo-verification.json")
  ).json();
  expect(evidence.defect.reproduced).toBe(true);
  expect(evidence.git.changedFiles).toHaveLength(4);
  expect(evidence.checks.every((c: { passed: boolean }) => c.passed)).toBe(
    true,
  );
  await page.locator(".follow-along > summary").click();
  await expect(page.locator(".follow-along")).toContainText(
    "a5a648a426d46f1576caf920d40c738455023e7e",
  );
  await expect(page.locator(".follow-along")).toContainText(
    "git apply --check",
  );
});

test("readiness changes files/path, preserves OS, and does not auto-complete", async ({
  page,
}) => {
  await open(page, "/start/check/");
  await page.getByRole("button", { name: "Linux", exact: true }).click();
  await page.getByRole("button", { name: "演示执行" }).click();
  await expect(page.locator(".ready-pane")).toContainText("~/my-homepage");
  await page
    .getByRole("button", { name: "2. 初始化 Git", exact: true })
    .click();
  await page.getByRole("button", { name: "演示执行" }).click();
  await page.getByRole("checkbox", { name: "显示隐藏的 .git 目录" }).check();
  await expect(page.locator(".file-tree")).toContainText("隐藏目录");
  await expect(page.locator(".done-check input")).not.toBeChecked();
  await open(page, "/start/agent/");
  await expect(
    page.getByRole("button", { name: "Linux", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".ready-scene")).toContainText(
    "npm install -g @opencode/cli",
  );
});

test("documentation search and theme work across page types", async ({
  page,
}) => {
  await open(page, "/");
  await page.getByRole("button", { name: "切换深色主题" }).click();
  await open(page, "/start/editor/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator(".editor-map")).toBeVisible();
  await page.locator("button[data-open-modal]").click();
  await page.locator(".pagefind-ui__search-input").fill("需求");
  await expect(page.locator(".pagefind-ui__result").first()).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "切换浅色主题" }).click();
  await open(page, "/case/todo/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

for (const width of [390, 768])
  test(`${width}px all routes and every substep fit without page overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of [
      "/",
      "/start/",
      "/start/editor/",
      "/start/tools/",
      "/start/agent/",
      "/start/check/",
      "/guide/",
    ]) {
      await open(page, route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
    }
    for (const route of ["/case/homepage/", "/case/todo/"]) {
      for (let step = 1; step <= 5; step++) {
        await open(page, `${route}?step=${step}`);
        if (width === 390) {
          const scene = await page.locator(".scene-body").boundingBox();
          expect(scene!.y).toBeLessThan(600);
        }
        const controls = page.locator(
          width === 390 ? ".mobile-sub-controls" : ".substep-controls",
        );
        for (let sub = 0; sub < 4; sub++) {
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
            `${route} ${step}/${sub}`,
          ).toBe(true);
          const next = controls.getByRole("button", { name: "下一小步" });
          if (await next.isDisabled()) break;
          await next.click();
        }
      }
    }
  });

test("mobile drawers support focus restoration, Escape and selecting a step", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, "/case/homepage/");
  const trigger = page.getByRole("button", { name: "打开导航菜单" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.locator(".step-mobile-trigger").click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /4 发现问题并修改/ })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".step-mobile-trigger")).toContainText("第 4 步");
});

test("legacy routes redirect and old progress never silently completes the new lesson", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "p2s-practice-case-portfolio",
      JSON.stringify({ complete: true, checked: ["旧练习"] }),
    ),
  );
  await open(page, "/case/from-scratch/");
  await expect(page).toHaveURL(/\/case\/homepage\//);
  await expect(page.locator(".done-check input")).not.toBeChecked();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("p2s:progress:v2") || "{}").legacy,
    ),
  ).toBeTruthy();
});

test("scene patches reset correctly and keyboard steps do not hijack editing", async ({
  page,
}) => {
  await open(page, "/case/homepage/?step=4");
  const nextButton = page
    .locator(".substep-controls")
    .getByRole("button", { name: "下一小步" });
  await nextButton.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".feedback-picker")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "改动", exact: true }),
  ).toHaveAttribute("data-state", "active");
  await page.keyboard.press("ArrowLeft");
  await expect(
    page
      .locator('[role="tabpanel"][data-state="active"]')
      .getByRole("button", { name: "修改前", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.locator(".desktop-steps .step-button").nth(2).click();
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.locator(".status-track > span").nth(1)).toHaveAttribute(
    "data-on",
    "false",
  );
});

test("Todo request walkthrough distinguishes omitted notes from an explicit empty value", async ({
  page,
}) => {
  await open(page, "/case/todo/?step=4");
  await next(page);
  await next(page);
  await expect(page.locator(".flow-inspector")).toBeVisible();
  await page.getByRole("button", { name: "3. 后端", exact: true }).click();
  await expect(page.locator(".flow-inspector")).toContainText("没有传入");
  await page
    .locator('.flow-choices[aria-label="选择备注操作"] button')
    .nth(2)
    .click();
  await expect(page.locator(".flow-inspector")).toContainText('""');
});

test("case first-screen JavaScript remains below the gzip budget", async ({
  page,
  request,
}) => {
  await open(page, "/case/homepage/");
  const urls = await page.evaluate(() => [
    ...new Set(
      performance
        .getEntriesByType("resource")
        .map((r) => r.name)
        .filter((n) => new URL(n).pathname.endsWith(".js")),
    ),
  ]);
  let bytes = 0;
  for (const url of urls)
    bytes += gzipSync(await (await request.get(url)).body()).length;
  console.log(
    `Case JavaScript: ${(bytes / 1024).toFixed(1)} KiB gzip (${urls.length} resources)`,
  );
  expect(bytes).toBeLessThan(200 * 1024);
});

test("mobile documentation keeps search, theme and chapter navigation separately usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, "/start/check/");
  await page.getByRole("button", { name: "搜索教程" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /切换.*主题/ }).click();
  await page.getByRole("button", { name: "打开章节导航" }).click();
  const link = page
    .locator("nav.sidebar")
    .getByRole("link", { name: "2. 运行与版本工具" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/start\/tools\//);
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});

for (const theme of ["light", "dark"] as const) {
  test(`${theme} pages and case scenes meet automated WCAG checks`, async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    await page.addInitScript((value) => {
      localStorage.setItem("theme", value);
      localStorage.setItem("starlight-theme", value);
    }, theme);
    // Audit the sandboxed preview document separately: it deliberately cannot execute axe scripts.
    const routes = [
      "/",
      "/start/",
      "/start/editor/",
      "/start/tools/",
      "/start/agent/",
      "/start/check/",
      "/guide/",
      "/examples/homepage-v2.html",
    ];
    for (const name of ["homepage", "todo"])
      for (let step = 1; step <= 5; step++)
        routes.push(`/case/${name}/?step=${step}`);
    for (const route of routes) {
      await open(page, route);
      if (route.includes("step=4")) {
        await next(page);
        await next(page);
      }
      for (const frame of await page.locator("iframe").all())
        await expect(frame).toHaveAttribute("title", /\S/);
      const result = await new AxeBuilder({ page })
        .setLegacyMode()
        .exclude("iframe")
        .options({ iframes: false })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect
        .soft(
          result.violations.map(({ id, nodes }) => ({
            id,
            nodes: nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          })),
          `${theme} ${route}`,
        )
        .toEqual([]);
    }
  });
}
