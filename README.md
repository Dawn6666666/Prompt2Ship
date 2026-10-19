# Prompt2Ship — AI Coding 交互式教程网站

> **让刚接触 Vibe Coding 的同学，看懂从工具准备到作品交付的完整流程。**

Prompt2Ship 是一个面向大一下学期、刚接触 Vibe Coding 的同学的流程展示网站。从安装 IDE、安装并连接编程 Agent、初始化项目开始，再通过两个预设开发案例，理解需求分析、生成代码、检查与迭代的全过程。不提供动手练习或真实 AI 执行环境。

网站不只是展示教程文章，而是通过**提示词卡片、代码变更对比、网页预览沙盒和交互演示**，让读者直观理解 AI Coding 的实际开发流程。

---

## 本地运行

已实现：流程首页、从工具到需求的四阶段入门演示、七阶段网站案例、Todo 备注全栈流程回放、方法复盘。使用 Astro + React Islands；展示内容静态生成，无需 API Key 或后端服务。

```bash
# Node.js 24（与 Vercel 构建环境一致）
npm ci
npm run dev
```

打开终端显示的本地地址（默认 `http://localhost:4321`，端口占用时自动递增）。

```bash
npx tsc --noEmit  # TypeScript 检查
npm run build    # 构建静态站点到 dist/
npm run preview  # 本地检查生产构建
```

部署时将 `dist/` 发布到任意静态托管平台即可。

### Vercel 自动部署

在 [Vercel 新建项目](https://vercel.com/new)中导入 `Dawn6666666/Prompt2Ship`，根目录保持仓库根目录，生产分支选择 `main`，然后部署。若已关联该仓库，本次推送会触发自动构建。

仓库中的 `vercel.json` 已配置 Astro、`npm ci`、`npm run build` 和输出目录 `dist`；`package.json` 固定使用 Node.js 24。无需环境变量、Vercel adapter 或 GitHub Actions。

关联后，推送 `main` 自动更新生产站点，其他分支及 PR 使用 Vercel 默认的预览部署。实际部署地址和构建状态见 Vercel 控制台及 GitHub 提交检查。

### 内容与组件入口

- `src/data/course.ts`：案例一的七阶段提示词、代码片段、模拟终端，以及预览/下载共用的完整 HTML。
- `src/data/todo.ts`：Todo 备注的数据库迁移、接口、表单和展示修改。
- `src/components/LessonStudio.tsx`：多轮聊天工作区，预设对话 → 工具调用 → 流式响应 / 代码 → 结果；保留历史对话，支持跳过、重播和自由切换。
- `src/data/tool-calls.ts` 与 `src/components/ui/tool-trace.tsx`：预设工具参数、逐次调用与流式返回，完成后可展开查看；不实际执行命令或访问用户文件。
- `src/components/CaseWorkbench.tsx`、`TodoLesson.tsx`：两个案例的场景与结果配置。
- `src/components/RequirementWorkshop.tsx`：案例一的需求分析展示，围绕“给谁看、看完做什么、先放什么、先不做什么、怎样算做好”分步解释固定案例，并比较两种情况。展示完整任务示例，不收集访问者回答，不提供填写练习或个性化任务生成。
- 案例页采用铺满可用视口的工作区；需求分析在桌面用 shadcn Resizable 拖动分栏，手机用 Radix Tabs 切换过程讲解和案例需求。其余阶段在手机切换对话与成果，避免上下堆叠。
- `src/components/PromptDemo.tsx`：首页可操作的提示词到预览演示。
- `src/data/onboarding.ts` 与 `src/components/SetupGuide.tsx`：安装 IDE → 安装编程 Agent → 初始化项目 → 需求分析的全屏演示工作区。每个阶段有三幅可切换画面，支持播放、跳过与重播；保留 Windows / macOS / Linux 安装路线和五种 Agent 的官方资料。首页路线链接可直接定位 `/setup#ide`、`#agent`、`#project`、`#requirements`。命令、安装和连接状态均为示意，不检测本机，不收集账号或密钥。项目沿用案例一的纯 HTML 方案，不要求安装框架。
- `src/components/ReviewPlayground.tsx`：通过固定提示词对比进行方法复盘。
- `src/styles/global.css`：响应式布局与明暗主题。
- `THIRD_PARTY_NOTICES.md`：复用组件来源与许可。

**演示边界**：这是流程展示网站，不提供动手练习或本地跟做任务。站点不调用真实 AI；终端日志为标注的教学模拟。案例一的浏览器预览运行实际 HTML，最后可以查看或下载示例 `index.html`；其中的联系邮箱是占位内容。案例二仅回放固定备注的数据流程，不保存访问者数据，不连接 Express / SQLite，不能代替真实项目验证。Todo 上游未声明许可证，因此未随本站分发其完整源码。

安装命令与官方链接核对日期：2026-10-19。工具升级后以对应官方文档为准。保留以下原始产品规划，供后续开发参考。

---

## 🤖 AI 开发 Agent 必读准则 (Agent Guide)

本项目的所有成熟参考模板、UI 原子组件、特色动效与案例代码，**均已预先准备在同级本地目录**：

- **组件与模板索引**：[`../FrontendFramework/AI_INDEX.md`](../FrontendFramework/AI_INDEX.md)（绝对路径：`/home/yoake/Code/FrontendFramework/AI_INDEX.md`）
- **通用参考库根目录**：[`../FrontendFramework/`](../FrontendFramework/)（绝对路径：`/home/yoake/Code/FrontendFramework/`）

> ⚠️ **开发原则**：
>
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
