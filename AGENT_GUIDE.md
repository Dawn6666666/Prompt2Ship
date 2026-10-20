# Prompt2Ship 开发指南

## 产品边界

- 对象：大一下学期、初次接触 Vibe Coding 的同学。先教需求五问，再教如何让 Agent 执行。
- 主线：准备工具 → 单文件主页 → 已有 Todo 改造 → 检查并交付。两个案例都用五步。
- 站点保持静态；不增加账号、数据库、终端访问、实时 AI。示例与读者本机自查必须分开。
- 真实 HTML 预览、源代码、下载使用同一份素材；Diff 构建生成，不手写“通过”结果。
- 主需求见 `docs/README.md`；实施进度见 `docs/10-roadmap.md`；遗留事项见 `docs/11-implementation.md`。`PRD.md` 保留旧版背景，不再作为当前路由规范。

## 架构

| 内容        | 文件                                                              |
| ----------- | ----------------------------------------------------------------- |
| 准备、速查  | `src/content/docs/start*`、`guide.mdx`；Starlight                 |
| 案例        | `components/workbench/CaseShell.tsx`、`pages/case/`               |
| 内容        | `data/homepage.ts`、`requirement.ts`、`setup.ts`、`todo*.ts`      |
| 场景状态    | `data/scenes.ts` 声明 patch；`lib/scene-state.ts` reducer         |
| 需求与反馈  | `components/lessons/RequirementBuilder.tsx`、`FeedbackPicker.tsx` |
| 预览与对照  | `PreviewPane.tsx`、`ui/code-comparison.tsx`                       |
| 状态与自查  | `workbench/Primitives.tsx`、`lib/progress.ts`                     |
| 高亮与 Diff | `lib/case-assets.ts`、`highlight.ts`，仅构建时运行                |
| 主题与导航  | `Header.tsx`、`Layout.astro`、`docs/DocsHeader.astro`             |
| 样式        | `tokens.css`、`base.css`、`workbench.css`、`reading.css`          |

步骤用 `?step=1..5`；小步仅在内存。静态骨架防止 SSR 闪烁。勿将阅读进度等同程序检查成功。键盘左右键切小步时不能拦截文本框、标签、滑杆和抽屉操作。

## 复用

先读 `/home/yoake/Code/FrontendFramework/AI_INDEX.md`，再按需取用：Starlight 文档、shadcn/Radix 的 Sheet/Accordion/Tabs/Slider、Magic UI 代码对照/浏览器外框、Motion 的减少动效模式。不要另写弹窗焦点管理，不复制大框架。适配源码时更新 `THIRD_PARTY_NOTICES.md`。

## 真实性与检查

- 安装、登录流程按官方文档核对并记录日期；不存密钥。Windows 与 macOS/Linux 分开说明。
- Todo 必须区分 `notes` 未传入与传入空字符串；保留已有分类、优先级、筛选、拖拽能力。
- `verify:todo` 仅在临时副本工作，基线 `a5a648a`，输出完整补丁、缺陷复现、回归与范围证据。绝不修改参考库。
- `verify:homepage` 输出真实两提交与 bundle。提交哈希是示例仓库结果，不冒充读者本机记录。
- 用户输入改变自己的需求草稿，但后续演示固定；必须明确说明。不能假装调用了 AI。
- 手机场景优先；字号不小于 12px；圆角用令牌；保留焦点、Escape、减少动效与明暗主题。

完成后运行 `npm run check`、`npm run lint:styles`、`npm test`、`npm run test:e2e`。浏览器测试以独立 Node 服务器读取生产构建。修改案例素材后重新生成相应验证证据。用户研究结果必须来自真实同学，不把自动化测试当作学习效果证明。
