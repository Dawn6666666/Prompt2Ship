import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import starlight from "@astrojs/starlight";

export default defineConfig({
  redirects: {
    "/examples/folio.html": "/examples/homepage-v2.html",
    "/examples/folio-v1.html": "/examples/homepage-v1.html",
    "/case/from-scratch": "/case/homepage/",
    "/case/todo-app": "/case/todo/",
    "/review": "/guide/",
    "/setup": "/start/",
    "/learn": "/start/",
    "/learn/setup/vscode": "/start/editor/",
    "/learn/setup/runtime": "/start/tools/",
    "/learn/setup/agent": "/start/agent/",
    "/learn/workflow/first-task": "/guide/",
    "/learn/workflow/run-and-feedback": "/guide/",
    "/learn/workflow/git": "/guide/",
  },
  integrations: [
    react(),
    starlight({
      title: "Prompt2Ship",
      defaultLocale: "root",
      locales: { root: { label: "简体中文", lang: "zh-CN" } },
      description: "从环境搭建到项目交付，读懂 AI 编程的完整过程。",
      disable404Route: true,
      customCss: [
        "./src/styles/tokens.css",
        "./src/styles/base.css",
        "./src/styles/workbench.css",
        "./src/styles/reading.css",
      ],
      components: { Header: "./src/components/docs/DocsHeader.astro" },
      sidebar: [
        { label: "准备", items: [{ label: "从这里开始", slug: "start" }] },
        {
          label: "把工具连起来",
          items: [
            { label: "1. 编辑器", slug: "start/editor" },
            { label: "2. 运行与版本工具", slug: "start/tools" },
            { label: "3. 连接 Agent", slug: "start/agent" },
            { label: "4. 开工检查", slug: "start/check" },
          ],
        },
        {
          label: "开始做项目",
          items: [
            { label: "案例一：个人主页", link: "/case/homepage/" },
            { label: "案例二：Todo 备注", link: "/case/todo/" },
            { label: "方法速查", slug: "guide" },
          ],
        },
      ],
      editLink: {
        baseUrl: "https://github.com/Dawn6666666/Prompt2Ship/edit/main/",
      },
      expressiveCode: {
        themes: ["github-light", "github-dark"],
        defaultProps: { wrap: true },
      },
      pagination: true,
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
});
