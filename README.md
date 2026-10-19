# Prompt2Ship — AI Coding 交互式教程网站

> **让读者直观看见 AI Coding 如何从需求分析走向最终交付。**

Prompt2Ship 是一个面向开发者和编程初学者的 AI Coding 交互式教程网站。核心目标是帮助读者搭建 **Vibe Coding** 开发环境，并通过两个真实开发案例，理解 AI 如何参与项目从需求分析到最终交付的全过程。

网站不只是展示教程文章，而是通过**提示词卡片、代码变更对比、网页预览沙盒和交互演示**，让读者直观理解 AI Coding 的实际开发流程。

---

## 🤖 AI 开发 Agent 必读准则 (Agent Guide)

本项目的所有成熟参考模板、UI 原子组件、特色动效与案例代码，**均已预先准备在同级本地目录**：
- **组件与模板索引**：[`../FrontendFramework/AI_INDEX.md`](../FrontendFramework/AI_INDEX.md)（绝对路径：`/home/yoake/Code/FrontendFramework/AI_INDEX.md`）
- **通用参考库根目录**：[`../FrontendFramework/`](../FrontendFramework/)（绝对路径：`/home/yoake/Code/FrontendFramework/`）

> ⚠️ **开发原则**：
> 1. **严禁从零手搓基础组件或复杂动效**！如需导航栏、暗黑模式切换、Safari 浏览器外壳、代码 Diff 对比、终端打字动效、气泡对话、时间轴等，请直接查阅 `../FrontendFramework/AI_INDEX.md`，按索引在本地提取成熟实现。
> 2. **优先使用成熟依赖包**：如 `motion`, `lucide-react`, `tailwind-merge`, `clsx`, `@shikijs/transformers`。
> 3. **静态数据驱动交互**：教程网站本身不需要复杂后端或真实 AI API，使用结构化数据（JSON/TS）驱动交互展示。

---

## 一、核心内容规划

### 1. Vibe Coding 环境搭建
- **代码编辑器**：VS Code 安装、配置、项目管理与集成终端。
- **AI 编程 Agent**：OpenCode、Claude Code、Codex、ZCode、Pi 通用工作流与必要差异。
- **本地运行环境**：依赖安装、启动排错与效果预览。
- **Git 版本控制**：检查 AI 变更、版本提交与代码恢复。

### 2. 案例一：从零构建一个网站（过程可视化）
通过 7 个开发阶段逐步演进：
1. **自然语言描述需求**
2. **AI 分析需求并规划方案**
3. **编写提示词让 AI 生成代码**
4. **启动项目查看实际运行效果**
5. **发现问题并通过反馈让 AI 修改**
6. **检查代码变更，验证功能并提交 Git**
7. **完成项目交付**

读者可自由切换阶段，联动查看：**提示词 ↔ 代码 Diff ↔ 网页预览 (Safari Mockup) ↔ 终端日志**。

### 3. 案例二：在已有全栈 Todo 项目中使用 Vibe Coding
- **基础项目**：[`../FrontendFramework/todo-app`](../FrontendFramework/todo-app)（React + Vite 前端，Express + SQLite 后端）。
- **实战任务**：让 AI 理解已有项目结构并增加**“任务备注”**功能，走通前后端与数据库联动。

### 4. 工程实践复盘
- 从零开发与修改已有项目的区别。
- 高效提示词工程与上下文控制。
- 为什么 AI 生成代码后仍需运行验证与 Git 兜底。

---

## 二、推荐技术栈

- **框架基座**：Astro + TypeScript + MDX
- **交互组件**：React (Islands 架构)
- **样式与基础组件**：Tailwind CSS + shadcn/ui
- **动画过渡**：Motion (`motion/react`)
- **特色视觉**：React Bits / Magic UI / Aceternity UI
- **代码高亮与 Diff**：Shiki / Expressive Code
- **在线沙盒**：Sandpack (按需引入)

---

## 三、项目文档索引

- [**`PRD.md`**](./PRD.md)：详细需求规格说明书 (Product Requirement Document)
- [**`AGENT_GUIDE.md`**](./AGENT_GUIDE.md)：给接续开发 AI Agent 的详细架构规划与实施步骤
