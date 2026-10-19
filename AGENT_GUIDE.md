# Prompt2Ship 开发 Agent 执行指南 (AGENT_GUIDE.md)

> 本文档专为后续接入开发 Prompt2Ship 的 AI Agent 准备。请在动工前通读此文档。

---

## 1. 核心目标与原则

- **目标**：打造一个高质感、交互流畅、内容扎实的 AI Coding 教程网站。
- **设计感**：层次清晰、视觉统一，避免机械拼接或粗糙的模板化风格。
- **杜绝手搓**：所有基础 UI、动效、浏览器外壳、终端模拟器均在 `../FrontendFramework/` 中有成品。先查后用！
- **静态数据驱动**：教程内容、阶段变更、代码 Diff、提示词内容均使用静态数据结构驱动，无需编写复杂后端。

---

## 2. 推荐项目脚手架快速启动方案

后续 Agent 可以直接借鉴 `../FrontendFramework/astro-shadcn-template` 的结构初始化项目：

```bash
# 核心依赖清单推荐
pnpm add astro @astrojs/react @astrojs/tailwind @astrojs/mdx
pnpm add react react-dom
pnpm add tailwindcss @tailwindcss/typography
pnpm add motion clsx tailwind-merge lucide-react
pnpm add @shikijs/transformers shiki
```

---

## 3. 页面模块与组件映射清单

| 页面 / 功能模块 | 页面路由建议 | 推荐复用的本地成品组件与路径 |
| :--- | :--- | :--- |
| **首页 (Landing)** | `/` | 顶部导航：`astro-shadcn-template/.../Header.tsx`<br>Hero 动效：`aceternity-ui/lamp.tsx`<br>特性卡片：`magicui/.../bento-grid.tsx`<br>流动光束：`magicui/.../animated-beam.tsx` |
| **环境搭建教程** | `/setup` | 教程步骤排版：`astro-starlight/.../Steps.astro`<br>终端命令演示：`magicui/.../terminal.tsx`<br>提示框：`astro-starlight/.../Aside.astro` |
| **案例一：从零构建网站** | `/case/from-scratch` | **7 阶段时间轴**：`aceternity-ui/timeline.tsx`<br>**阶段网页预览**：`magicui/.../safari.tsx`<br>**代码修改对比**：`magicui/.../code-comparison.tsx`<br>**AI 提示词卡片**：`origin-ui/.../chat/chat-message-bubble.tsx`<br>**目录树变迁**：`astro-starlight/.../FileTree.astro` |
| **案例二：全栈 Todo 实战** | `/case/todo-app` | **基准项目源码**：`../FrontendFramework/todo-app`<br>跨端文件修改对比：`magicui/.../code-comparison.tsx`<br>数据库与后端联动展示：`origin-ui` 对话气泡 + 终端调用日志 |
| **工程实践复盘** | `/review` | 总结卡片：`shadcn-ui/.../card.tsx`<br>对比图表/表格：`shadcn-ui/.../table.tsx` |

---

## 4. 推荐开发顺序

1. **第一步（脚手架与全站布局）**：
   - 配置 `astro.config.mjs` 与 `tailwind.config.mjs`。
   - 引入 Header、MainNav、ThemeToggle（深浅模式）与 Footer。
2. **第二步（案例一：从零构建网站 - 最核心页面）**：
   - 编写 7 个阶段的结构化静态数据（每个阶段包含：阶段名称、目标、自然语言需求、提示词 Prompt、AI 回复分析、前后代码 Diff、对应预览界面 HTML/图片、终端日志）。
   - 实现**阶段切换联动组件**：切换阶段时，提示词、代码对比、Safari 网页预览与执行日志同步平滑联动。
3. **第三步（环境搭建教程与工具对比）**：
   - 整理 VS Code + OpenCode / Claude Code / Codex / Pi 通用工作流与配置指南。
4. **第四步（案例二：全栈 Todo 增加备注）**：
   - 梳理 `../FrontendFramework/todo-app` 的前后端和 SQLite 数据库修改点，组织多文件联动变更教学。
5. **第五步（工程实践复盘与整体润色）**：
   - 检查全站响应式适配（移动端/平板/桌面端）、视觉动效质感与代码高亮效果。
