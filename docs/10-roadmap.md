# 10 · 实施路线、技术重构与验收

## 一、阶段划分

每个阶段结束都可以上线，旧页面在新页面完成前继续可用。

### 阶段 0 · 定稿（不写代码）

- [x] 确认推荐的 Agent 工具，并按官方文档核对安装、连接命令（记录核对日期）
- [x] 确认案例一人物与内容（周小满 / 两个项目 / 占位邮箱）
- [x] 确认案例二需求（任务备注）与“勾选完成后备注被清空”缺陷情节
- [x] 完成 `data/homepage.ts` 全部文案初稿，按 09 分册检查

### 阶段 1 · 基础：视觉令牌与布局骨架

- [x] 重写 `tokens.css`：08 分册中的字号、颜色、状态色、圆角、阴影、间距
- [x] 新导航 `Header`（四个平铺入口、手机抽屉）、新页脚（单句声明）
- [x] 删除英文 eyebrow、“动态 NN”编号、元标签
- [x] 加 stylelint 规则：禁止 `font-size` < 12px、禁止令牌外的圆角值

### 阶段 2 · 工作台组件

- [x] `CaseShell`、`StepRail`、`StatusTrack`、`DoneCheck`
- [x] `IdeWindow`、`FileTree`、`CodeView`（含 Diff 模式与行高亮）、`TerminalView`、`PreviewPane`、`AgentPanel`、`GitTimeline`、`BriefDrawer`
- [x] `SceneState` + patch 驱动（07 分册第四节）
- [x] 在一个内部演示页 `/dev/workbench` 中覆盖全部联动

### 阶段 3 · 案例一 + 需求拆解器（核心）

- [x] `RequirementBuilder`（03 分册）
- [x] `FeedbackPicker`、`CheckList`
- [x] 新素材 `homepage-v1.html` / `homepage-v2.html` / `需求单.md`
- [x] `/case/homepage/` 五步上线；旧 `/case/from-scratch` 301

### 阶段 4 · 准备篇

- [x] `/start/` 总览、editor、tools、agent、check 五页（04 分册）
- [ ] 重新拍摄统一使用 `my-homepage` 的截图
- [x] 删除 Python 相关内容；删除 `workflow/*` 三页；旧路由 301

### 阶段 5 · 案例二

- [x] 按 06 分册将 7 阶段重组为 5 步；改写提示词为短句
- [x] 准备 v1 缺陷版本数据（勾选完成清空备注）与修复 Diff
- [x] 更新 `verify-todo.mjs` 覆盖功能 / 回归 / 范围三类检查，重新生成证据

### 阶段 6 · 首页与速查

- [x] 首页（02 分册第四节），演示区复用工作台组件
- [x] `/guide/`：需求单五问、反馈四要素、好坏提示词对比、常见问题、清除进度

### 阶段 7 · 打磨

- [x] 手机端全流程走查（390px）、平板（768px）
- [x] 暗色主题走查
- [x] 无障碍：键盘遍历、焦点、对比度、减少动效
- [ ] 找 3–5 位目标读者（大一同学）做可用性测试，按第四节验收标准记录

## 二、技术重构要点

### 2.1 保持的技术栈

Astro + Starlight（只用于准备篇和速查的阅读页）+ React 19 + Tailwind 4 + Radix + Motion + Shiki + diff。不引入新的大型框架。

### 2.2 目录调整

```
src/
  components/
    workbench/        CaseShell, StepRail, StatusTrack, IdeWindow, FileTree, CodeView,
                      TerminalView, PreviewPane, AgentPanel, BriefDrawer, GitTimeline, DoneCheck
    lessons/          RequirementBuilder, FeedbackPicker, CheckList
    site/             Header, Footer, Progress
  data/
    homepage.ts       案例一：步骤、小步、SceneState patch、文案
    todo.ts           案例二（重组）
    requirement.ts    五问与选项（两个案例各一套）
    setup.ts          准备篇系统差异命令
  styles/
    tokens.css        唯一的设计令牌来源
    base.css          重置与排版
```

- 删除 `teaching.css`、`completion.css`，样式随组件迁移（Tailwind 工具类 + 令牌）；`global.css` 只保留排版基础，目标 < 200 行。
- 删除不再使用的组件：`dynamics/Activity.tsx` 的 `usePlayback` 自动播放、`StageNav`、`StageFooter`、`PracticeProgress` 等，迁移完再删。

### 2.3 步骤状态与 SSR 闪烁

- 步骤用 URL 查询参数 `?step=3`（可分享、可后退），并在 Astro 页面中读取后**服务端直接渲染对应步骤**（需要该页面为按需渲染），或者：
- 若保持纯静态：工作台容器在水合完成前渲染一个固定高度的骨架，不渲染第 1 步内容，避免闪烁。
- 小步状态不进 URL，仅保存在内存；切换步骤时小步重置为 a。

### 2.4 内容数据与校验

- 所有代码片段与 `public/examples/*.html` 在构建时比对，不一致时构建失败。
- Diff 在构建时由 `diff` 库生成，不手写。
- 文案中禁止出现的词（“动态”“轻松”“Prompt”等）用脚本检查。

### 2.5 进度存储

- `localStorage` 键：`p2s:progress:v2`，结构 `{ [pageId]: { [checkId]: true } }`。
- 首次加载时迁移旧键（`PracticeTask` 的 8 个 id）后删除。

## 三、迁移对照

| 现有 | 去向 |
|---|---|
| `CaseWorkbench.tsx` + `data/course.ts` | `CaseShell` + `data/homepage.ts` |
| `TodoLesson.tsx` + `data/todo.ts` + `todo-flow.ts` | `CaseShell` + 重组后的 `data/todo.ts`；TodoFlow 保留为案例二场景组件 |
| `EditorTour` | `/start/editor/` 的界面地图 |
| `RuntimeScene` | `/start/tools/` 的终端演示 |
| `AgentScene` + `data/agent-setup.ts` | `/start/agent/` |
| `WorkflowScene` | `RequirementBuilder` |
| `GitScene` | 开工检查的 git init 场景 + `GitTimeline` |
| `ResponsiveScene` + `PortfolioPreview` | `PreviewPane` |
| `CodeComparison` | `CodeView` Diff 模式 |
| `ReviewPlayground` | `/guide/` 的好坏对比 |
| `HeroDemo` | 首页演示（工作台缩小版） |
| `examples/folio*.html` | `examples/homepage-v1/v2.html` |

## 四、验收标准

在提纲五条的基础上细化为可检查的条目：

### A. 学习效果（可用性测试，3–5 位大一同学）

1. 做完案例一后，能**不看页面**说出需求单五问中的至少四问。
2. 给一句模糊需求（如“帮我做个记账网页”），能在 10 分钟内写出一份含“这次不做”和“怎样算做完”的需求单。
3. 能指出“Agent 回复了”和“文件保存了”的区别，并说出如何确认文件已保存。
4. 在案例一第 4 步的反馈练习中选对，并能说出好反馈的四个要素。
5. 至少 3 人按页面步骤在自己电脑上从空文件夹做出可运行的个人主页，过程中求助不超过 2 次。

### B. 交互

6. 每个小步至少有一处场景变化，且变化与“这一步做什么”直接相关。
7. 案例中任何时刻能打开需求单，并看到当前步骤引用的行。
8. 切换 v1/v2 时预览宽度和滚动位置保持不变。
9. 演示结束不会自动勾选“我做到了”；所有示例结果都带“示例”标识。

### C. 视觉与工程

10. 样式中没有小于 12px 的字号；圆角只有 6px / 12px / 圆形。
11. 390px 宽度下，每一步首屏都能看到当前观察对象。
12. 亮/暗主题下正文对比度 ≥ 4.5:1。
13. 打开 `?step=3` 不出现其他步骤的闪烁。
14. 全站项目文件夹只出现 `my-homepage` 与 Todo 项目名两种；不出现 Python 运行命令。
15. Lighthouse 无障碍分数 ≥ 95；案例页首屏 JS < 200KB（gzip）。

### D. 交付物

16. 案例一结束时能下载 `index.html` 和 `需求单.md`，并看到替换清单。
17. 两个案例都展示了真实的 Git 版本记录与 Diff。
