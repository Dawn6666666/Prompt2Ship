# Prompt2Ship 开发指南

## 产品约束

- 面向刚开始编程的大一学生。每个页面回答一个问题，每个动态只教一个动作。
- 学习路线：环境准备 → 通用协作 → 从零开发 → 既有全栈改造 → 验证交付。
- 提示词、代码、运行效果与检查依据应该能相互对应。任何阶段都可以直接查看成果，不等待模拟聊天结束。
- 站点保持静态，不增加账号、数据库、真实 AI API。案例二的真实接口和原项目浏览器检查只在开发脚本里运行。
- 不用装饰性动效填充内容；保留键盘操作、移动端适配与减少动态效果支持。

## 架构

| 内容        | 入口与职责                                                                         |
| ----------- | ---------------------------------------------------------------------------------- |
| 教程        | `src/content/docs/`，Starlight + MDX；配置在 `astro.config.mjs`                    |
| 页面        | `src/pages/index.astro`、`case/`、`review.astro`                                   |
| 动态        | `src/components/dynamics/`；`Activity`、`StepControls`、`usePlayback` 统一教学交互 |
| 案例一      | `CaseWorkbench.tsx` + `data/course.ts`；实际 iframe、视口滑杆、局部改动定位        |
| 案例二      | `TodoLesson.tsx` + `data/todo.ts` + `todo-flow.ts`；文件职责、差异和数据流         |
| 基础 UI     | `components/ui/`；Radix Tabs、Slider，Magic UI 代码对照适配                        |
| 高亮与 diff | `lib/highlight.ts`；在 Astro 构建阶段计算，不导入客户端包                          |
| 导航与主题  | `Header.tsx` 同时用于独立页与 Starlight；两种布局使用相同主题变量                  |
| 样式        | `tokens.css` 全站变量；`global.css` 页面；`teaching.css` 动态；`docs.css` 文档     |

新增教程在 MDX 引入 React 动态，使用 `client:load` 或适合场景的加载策略。新增阶段保留稳定 hash；`lib/useStage.ts` 负责状态与 URL 同步。

## 先查本地成熟实现

参考库位于 `/home/yoake/Code/FrontendFramework`，先看 `AI_INDEX.md`，然后按需求读取源码。

- 文档结构、搜索、目录、静态步骤：`astro-starlight/`。
- 标签、滑杆、弹窗等基础交互：`shadcn-ui/apps/v4/registry/new-york-v4/`。
- 浏览器外壳与代码对照：`magicui/apps/www/registry/magicui/`。
- 状态与共享布局过渡：`motion-dev-examples/`、`motion/`。
- 全栈参考：`todo-app/`，基线提交 `a5a648a`。

不要自行重写成熟组件的手势、键盘和弹窗逻辑；不要复制整个参考仓库。新增适配更新 `THIRD_PARTY_NOTICES.md`。

## 内容真实性与验证

- 预设日志必须标为示例，不暗示正在运行读者电脑上的命令。
- 修改前后的源文件必须与预览一致。高亮使用真实 diff，不能靠字符串是否出现来判断改动。
- 代码片段可聚焦关键位置；可下载补丁应包含完整的集成修改。
- Todo 备注必须覆盖旧数据迁移、字段未传入与主动清空的区别。
- `npm run verify:todo` 在临时副本运行实际数据库、接口、构建与原项目 Chrome 界面操作，更新验证 JSON、截图和补丁。不要修改参考库。
- `data/activities.ts` 和 `checkpoints.ts` 规定目标、观察点和完成依据；`PracticeTask` 只保存自查进度，不表示自动验证通过。
- 新项目必须先提交初稿，再演示已跟踪文件的 git diff；已有项目先核对基线提交，再检查补丁。
- 工具安装与登录信息优先核对官方文档，避免把易变命令硬编码到多个位置。

完成改动后运行 `npm run check`、`npm test`、`npm run test:e2e`。浏览器测试使用独立端口和生产构建，避免读取 Vite 旧依赖缓存。
