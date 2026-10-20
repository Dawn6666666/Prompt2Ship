import type { TeachingContract } from "./activities";
type Checkpoint = Pick<TeachingContract, "observe" | "success">;
export const scratchCheckpoints: Checkpoint[] = [
  {
    observe: "需求清单把用户、内容、边界和验收分开。",
    success: "能说清本次做什么，以及做到什么程度就停止。",
  },
  {
    observe:
      "一个 HTML 文件对应一条最小实现路线。展开跟做命令，先创建目录与仓库。",
    success: "自己的项目目录已打开，git status 能识别这个仓库。",
  },
  {
    observe: "完整初稿可查看、复制或下载；运行命令里先记录 v1。",
    success: "保存初稿并提交后，git log --oneline 能看到 draft 提交。",
  },
  {
    observe: "切换手机、平板和桌面宽度；这一步仍然运行 v1，没有代码修改。",
    success: "能在 375px 复现横向溢出，指出固定宽度与两列网格。",
  },
  {
    observe: "选择一项反馈，预览区域与 Diff 对应行同步突出。",
    success: "能把容器、字号、网格三项反馈逐一对应到实际样式。",
  },
  {
    observe: "区分源码检查、浏览器观察与尚需在本机执行的命令。",
    success: "本地确认两种视口、真实邮箱和修改范围后，再提交 v2。",
  },
  {
    observe: "下载文件、独立打开与运行说明指向同一份最终作品。",
    success: "将文件交给同学，对方能按说明打开；占位资料已替换。",
  },
];
export const todoCheckpoints: Checkpoint[] = [
  {
    observe: "数据经过六个文件，但只需要改动其中四个。",
    success: "能说明 App.jsx 与 API 封装为何无需修改，并启动案例基线。",
  },
  {
    observe: "计划同时覆盖旧数据、创建、编辑、清空与原有功能。",
    success: "能列出四个修改文件与每层的验收方式。",
  },
  {
    observe: "检查已有列后再迁移，旧任务会获得空字符串备注。",
    success: "重复启动不重复加列，已有任务仍存在。",
  },
  {
    observe: "对比 POST 与 PUT；undefined 与空字符串表达不同意图。",
    success: "只切换完成状态保留备注，主动传空字符串才清空。",
  },
  {
    observe: "备注状态需要覆盖输入、编辑回填、提交后重置与列表显示。",
    success: "新建不残留上次备注，编辑能回填，空备注不占位。",
  },
  {
    observe: "切换四种操作，逐节点查看同一个 notes 字段。",
    success: "能先预测清空与未传字段的保存结果，再展开节点核对。",
  },
  {
    observe: "展开命令、环境、接口结果与真实浏览器截图，核对验证范围。",
    success: "在自己的项目新增、编辑、清空并刷新回读，确认旧功能仍可用。",
  },
];
