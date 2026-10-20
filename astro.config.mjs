import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import starlight from "@astrojs/starlight";

export default defineConfig({
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
        "./src/styles/teaching.css",
        "./src/styles/docs.css",
        "./src/styles/completion.css",
      ],
      components: { Header: "./src/components/docs/DocsHeader.astro" },
      sidebar: [
        { label: "从这里开始", items: [{ label: "学习路线", slug: "learn" }] },
        {
          label: "01 · 准备开发环境",
          items: [
            { label: "安装与认识 VS Code", slug: "learn/setup/vscode" },
            { label: "准备本地运行环境", slug: "learn/setup/runtime" },
            { label: "选择一个编程 Agent", slug: "learn/setup/agent" },
          ],
        },
        {
          label: "02 · 学会与 Agent 协作",
          items: [
            {
              label: "发出第一个清楚的任务",
              slug: "learn/workflow/first-task",
            },
            {
              label: "运行、观察与反馈",
              slug: "learn/workflow/run-and-feedback",
            },
            { label: "用 Git 看清每一次修改", slug: "learn/workflow/git" },
          ],
        },
        {
          label: "03 · 进入交互案例",
          items: [
            { label: "从零做一个作品网站 ↗", link: "/case/from-scratch" },
            { label: "给 Todo 增加任务备注 ↗", link: "/case/todo-app" },
            { label: "方法与提示词速查 ↗", link: "/review" },
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
