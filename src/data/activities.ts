export type TeachingContract = {
  goal: string;
  observe: string;
  success: string;
};

export const activities = {
  editor: {
    goal: "安装编辑器，打开自己的项目文件夹。",
    observe: "切换步骤，点击文件区、编辑区和终端；需要时放大真实界面参考图。",
    success: "在本机打开一个文件夹，并在集成终端确认当前路径与它一致。",
  },
  runtime: {
    goal: "分清检查工具、安装依赖和启动服务。",
    observe: "同一个终端在不同步骤执行的命令，以及输出代表的状态。",
    success: "能在本机看到工具版本，并说明为什么前后端需要两个终端。",
  },
  agent: {
    goal: "启动一个 Agent，连接模型并发出首次只读任务。",
    observe: "OpenCode 默认路线中的安装、连接、读项目；其他工具按差异切换。",
    success: "Agent 能回答当前目录中真实存在的文件，且没有修改项目。",
  },
  prompt: {
    goal: "把想法写成有范围、能验收的任务。",
    observe: "逐项补充目标、内容、边界和验收，提示词如何变得具体。",
    success: "为自己的小网站写四项要求，并能指出每项对应的验收方式。",
  },
  responsive: {
    goal: "根据可复现的页面问题，给出局部修改反馈。",
    observe: "同一视口下修改前后的宽度、标题和卡片排列。",
    success: "能复现 375px 下的溢出，并写出包含环境、现象与边界的反馈。",
  },
  git: {
    goal: "检查改动，再选择文件并记录一个版本。",
    observe: "工作区、暂存区和提交记录分别描述哪一份修改。",
    success: "先建立初稿提交，再修改文件；git diff 能显示实际变化。",
  },
} satisfies Record<string, TeachingContract>;

export const practiceIds = [
  "vscode",
  "runtime",
  "agent",
  "first-task",
  "feedback",
  "git",
  "portfolio",
  "todo",
] as const;
