import { chromium } from "@playwright/test";
import { fork } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const outDir = process.env.SCREENSHOT_DIR || "/tmp/p2s-screenshots";
await mkdir(outDir, { recursive: true });

// Start test server
const server = fork(resolve("scripts/serve-test.mjs"), [], {
  env: { ...process.env, PORT: "4399" },
  stdio: "ignore",
});

await new Promise((r) => setTimeout(r, 1000));

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const routes = [
  { name: "start-overview", path: "/start/" },
  { name: "start-editor", path: "/start/editor/" },
  { name: "start-tools", path: "/start/tools/" },
  { name: "start-agent", path: "/start/agent/" },
  { name: "start-check", path: "/start/check/" },
];

for (const route of routes) {
  await page.goto(`http://127.0.0.1:4399${route.path}`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${outDir}/${route.name}.png`, fullPage: true });
  console.log(`Saved screenshot: ${route.name}.png`);
}

// Also capture check page with terminal step active
await page.goto("http://127.0.0.1:4399/start/check/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "4. 初始化 Git", exact: true }).click();
await page.getByRole("button", { name: "演示执行" }).click();
await page.screenshot({ path: `${outDir}/start-check-terminal.png`, fullPage: true });
console.log("Saved screenshot: start-check-terminal.png");

await browser.close();
server.kill();
console.log("Screenshots captured successfully.");
