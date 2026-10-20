# Prompt2Ship

面向初学者的 AI Coding 交互式教程。沿着「搭建环境 → 与 Agent 协作 → 从零做网站 → 修改已有全栈项目 → 验证交付」学习，每个动态只解释一个明确动作。

## 本地运行

需要 Node.js 24。

```sh
npm ci
npm run dev
```

访问终端打印的地址。更新依赖后，重启已运行的开发服务器。

```sh
npm run check       # Astro、MDX 与 TypeScript 检查
npm test            # 差异计算与阶段快照检查
npm run test:e2e    # 构建后检查浏览器交互、主题与移动端布局
npm run build       # 静态产物 dist/
npm run preview     # 查看生产构建；文档搜索在生产构建中可用
```

浏览器测试需要 Python 3 与本机 Chrome，在独立的 4399 端口提供静态构建，避免复用正在开发的 Vite 服务。其他环境可将 `playwright.config.ts` 的 `launchOptions.channel` 改为已安装的浏览器配置。

## 页面与交互

| 路由                 | 内容                                                              |
| -------------------- | ----------------------------------------------------------------- |
| `/`                  | 可操作的初稿 → 发现问题 → 反馈修复预览与学习路线                  |
| `/learn/`            | Starlight 教程入口，章节导航、目录与全文搜索                      |
| `/learn/setup/…`     | VS Code、运行环境、Agent 选择与连接                               |
| `/learn/workflow/…`  | 任务描述、运行反馈、Git 状态与检查                                |
| `/case/from-scratch` | 七阶段作品网站；提示词、实际 HTML、可调视口、代码差异与下载       |
| `/case/todo-app`     | 七阶段备注改造；文件地图、多文件 diff、四种操作的数据流与验证记录 |
| `/review`            | 五种协作方法的提示词对照与可复制模板                              |

案例阶段可通过 URL hash 分享，例如 `/case/from-scratch#iterate`、`/case/todo-app#flow`。旧 `/setup` 路由重定向到 VS Code 教程。

## 内容与组件

- `src/content/docs/`：MDX 教程，每页一个主题；Starlight 提供文档结构与 Expressive Code。
- `src/components/dynamics/Activity.tsx`：动态容器、步骤控制、手动播放与减少动画支持；`data/activities.ts`、`checkpoints.ts` 约定目标、观察点与完成依据。
- `src/components/dynamics/PracticeTask.tsx`：六篇教程与两个案例的自查练习，浏览器本地记录进度；不自动判定本机操作。
- `src/data/agent-setup.ts`：OpenCode 2 默认安装、模型连接与首次只读任务；`ReferenceImage.tsx`：Radix 图片放大与局部定位。
- `src/data/todo-follow.ts`、`components/cases/TodoFollowAlong.tsx`：固定基线、双终端、AI 修改或参考补丁、验收与提交命令。
- `src/components/dynamics/`：编辑器导览、提示词构建、Git 状态、响应式预览、Todo 数据流。
- `src/components/CaseWorkbench.tsx`、`TodoLesson.tsx`：案例阶段与成果联动。
- `src/data/course.ts`：作品网站阶段与完整 HTML；预览和下载共用同一份源数据。
- `src/data/todo.ts`、`todo-flow.ts`：备注关键代码与四种请求场景。
- `src/lib/highlight.ts`：构建时执行 diff 和 Shiki；客户端不加载高亮引擎。
- `src/styles/tokens.css`：全站明暗主题变量；`global.css`、`teaching.css`、`docs.css` 分别管理页面、教学组件和文档适配，`completion.css` 管理跟做、练习与验证材料。

## Todo 验证与补丁

以本地 `../FrontendFramework/todo-app` 的 `a5a648a` 为基线，复制到临时目录，增加 notes 后实际运行 SQLite、Express 接口、前端构建与 Chrome 界面操作。不会修改参考库。

```sh
npm run verify:todo
# 或指定参考库位置
npm run verify:todo -- /path/to/todo-app
```

检查包括旧数据迁移、重复启动、新增后读取、编辑、状态切换保留备注、清空、输入校验、筛选排序回归和删除。另用真实浏览器验证表单新增、多行备注回读、编辑回填、取消编辑、状态切换与清空，并核对最终 SQLite 值。环境、HTTP 请求与响应、构建输出、截图路径和补丁 SHA-256 写入 `src/data/todo-evidence.json`，完整修改写入 `public/examples/todo-notes.patch`，教程展示的是该次检查记录。

教学网页不连接 Todo 后端、不调用 AI、不保存用户任务。终端输出和数据流均为标注的示例；作品预览运行实际 HTML。案例代码用于本地跟做，示例姓名、作品与邮箱在交付前需要替换。

## 开发参考与部署

优先查阅 [`../FrontendFramework/AI_INDEX.md`](../FrontendFramework/AI_INDEX.md)，只按需复用 Starlight、shadcn/ui、Magic UI、Motion 等组件，来源见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。不要整体复制参考项目。

`dist/` 可部署到静态托管服务。现有 `vercel.json` 使用 `npm ci` 和 `npm run build`，不需要后端或密钥。确定正式域名后再配置 `astro.config.mjs` 的 `site`。

接续开发说明见 [AGENT_GUIDE.md](./AGENT_GUIDE.md)，产品目标见 [PRD.md](./PRD.md)。
