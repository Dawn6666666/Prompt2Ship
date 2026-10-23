# Prompt2Ship

给大一下学期、刚接触 Vibe Coding 的同学的交互入门指南。先准备 VS Code 和编程 Agent，再通过两个案例练习：想清楚 → 定计划 → 生成并运行 → 发现问题并修改 → 检查并交付。需求分析是主线，不把生成代码当成完成任务。

## 本地开发

需要 Node.js 24；浏览器测试使用本机 Chrome。

```sh
npm ci
npm run dev
```

打开终端显示的地址。生产搜索需要构建后使用。

```sh
npm run check          # Astro / MDX / TypeScript
npm run lint:styles    # 禁止微小字号和令牌外圆角
npm test               # 真实 Diff、Git bundle 和案例素材检查
npm run test:e2e       # 构建 + Chrome 全流程、移动端与键盘检查
npm run build          # 内容校验 + 静态输出 dist/
npm run preview
```

端到端测试用独立 Node 静态服务器（4399），不依赖 Python、不复用开发服务器。不具备 Chrome 的环境可调整 `playwright.config.ts` 的浏览器配置。

## 页面

| 路由              | 内容                                            |
| ----------------- | ----------------------------------------------- |
| `/`               | 三步真实网页演示、学习入口                      |
| `/start/`         | 准备总览                                        |
| `/start/editor/`  | VS Code 安装与界面地图                          |
| `/start/tools/`   | Node、Git 检查与系统差异                        |
| `/start/agent/`   | OpenCode V2 安装、连接、首次只读任务            |
| `/start/check/`   | 从空目录开始的工作台就绪检查                    |
| `/case/homepage/` | 周小满的单文件个人主页；手机溢出与局部 CSS 修复 |
| `/case/todo/`     | 已有 Todo 增加备注；勾选完成清空备注的回归修复  |
| `/guide/`         | 需求单五问、反馈四要素、常见问题和清除记录      |
| `/dev/workbench/` | 不索引的内部联动检查页                          |

案例用 `?step=3` 分享当前步骤，浏览器后退有效。静态页面先显示骨架再水合，不闪现错误步骤。需求草稿、自查进度仅存当前浏览器；旧进度保留在 legacy 命名空间，不替代新版验收。

## 内容与组件

- `docs/README.md`：已批准的重构指南；`docs/10-roadmap.md`：实施勾选；`docs/11-implementation.md`：当前验证与待办。
- `components/workbench/`：`CaseShell`、文件树、终端、真实 iframe、状态条和需求单抽屉。
- `components/lessons/`：需求拆解器、反馈选择、Todo 演示与数据流。
- `data/homepage.ts`、`requirement.ts`、`scenes.ts`：步骤文案、两套五问、声明式场景 patch。
- `lib/scene-state.ts`：集中状态；跳转小步累积应用 patch。自查记录与示例状态独立。
- `lib/case-assets.ts`、`highlight.ts`：构建时 Shiki 与真实 Diff，不把高亮引擎发送到浏览器。
- `public/examples/homepage-v1.html`、`homepage-v2.html`：预览、代码与下载共同的真实素材源。
- `styles/tokens.css`、`base.css`、`reading.css`：令牌、基础排版、Starlight 适配；站点与场景样式分别在 `components/site/site.css` 和 `components/workbench/workbench.css`，由公共样式入口引入。

## 真实验证记录

```sh
npm run verify:homepage
npm run verify:todo
# Todo 的参考库可以显式指定
npm run verify:todo -- /path/to/todo-app
```

两个脚本在 `/tmp/opencode` 的一次性目录工作，不修改参考项目。主页生成真实 v1/v2 提交和可下载 Git bundle，并检查修改仅涉及 CSS、正文不变。Todo 以 `../FrontendFramework/todo-app` 的 `a5a648a` 为基线，先复现勾选完成清空备注，再实际检查 SQLite、Express、构建、原项目 Chrome 操作与四文件范围；输出补丁、JSON、截图和真实 Git 记录。浏览器内的 Todo 是预设交互，不连接这些验证后端。

安装教程以官方文档为准，OpenCode V2 命令核对于 2026-10-20。网页不调用实时 AI、不操作读者终端、不检测本机安装状态。“示例检查通过”不代表读者已完成操作。交付前需要自行替换人物、邮箱和项目链接。

## 参考与部署

组件来源见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)，接续开发见 [AGENT_GUIDE.md](./AGENT_GUIDE.md)。优先按需复用 `../FrontendFramework/AI_INDEX.md` 中的 Starlight、shadcn/Radix、Magic UI、Motion，不整套复制。

`dist/` 是纯静态产物。Vercel 的 `vercel.json` 提供永久重定向（308）；Netlify/Cloudflare Pages 可使用 `public/_redirects`（301）。其他静态托管由 Astro 生成的 HTML 刷新页兜底，若要求 HTTP 301，需配置托管层。旧 hash 不属于服务器请求，旧阶段链接落到新案例默认步骤。正式域名确认后配置 `astro.config.mjs` 的 `site`；目前不猜测域名。
