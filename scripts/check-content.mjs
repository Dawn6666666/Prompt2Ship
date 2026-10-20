import { readFile, readdir } from "node:fs/promises";
import assert from "node:assert/strict";
import path from "node:path";

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name),
      ),
    )
  ).flat();
}
for (const file of await walk("src")) {
  if (!/\.(tsx?|astro|mdx)$/.test(file)) continue;
  const text = await readFile(file, "utf8");
  assert(
    !/python3?\s+-m\s+http\.server|lin-portfolio|my-first-site|动态\s*\d|轻松上手|一键交付/.test(
      text,
    ),
    `旧文案/命令：${file}`,
  );
}
const data = await readFile("src/data/homepage.ts", "utf8");
for (const version of ["v1", "v2"]) {
  assert(
    data.includes(`../../public/examples/homepage-${version}.html?raw`),
    "代码/预览必须引用可下载的同一素材",
  );
  const html = await readFile(
    `public/examples/homepage-${version}.html`,
    "utf8",
  );
  assert(
    html.includes("周小满") && html.includes("mailto:xiaoman@example.com"),
    `人物与邮箱不一致：${version}`,
  );
}
for (const name of ["homepage", "todo"]) {
  const internal = JSON.parse(
    await readFile(`src/data/${name}-evidence.json`, "utf8"),
  );
  const published = JSON.parse(
    await readFile(`public/examples/${name}-verification.json`, "utf8"),
  );
  assert.deepEqual(internal, published, `${name} 页面与下载的证据不一致`);
}
console.log("内容检查通过：统一目录/命令、同源 HTML、同步验证证据。");
