export interface PreparationStep {
  id: "editor" | "tools" | "agent" | "check";
  order: number;
  title: string;
  href: string;
  minutes: number;
  summary: string;
  outcome: string;
}

/**
 * Single source for the preparation checklist. The overview page, the header
 * counter and the navigation all read the same list.
 */
export const preparationSteps: PreparationStep[] = [
  {
    id: "editor",
    order: 1,
    title: "安装 VS Code",
    href: "/start/editor/",
    minutes: 10,
    summary: "打开项目文件夹、编辑文件、运行终端命令的工作窗口。",
    outcome: "能在一个窗口里找到文件区、编辑区、终端和 Agent。",
  },
  {
    id: "tools",
    order: 2,
    title: "准备运行与版本工具",
    href: "/start/tools/",
    minutes: 10,
    summary: "Node.js 运行本地服务，npm 安装依赖，Git 保存版本。",
    outcome: "终端能分别输出版本号，Git 能记录提交。",
  },
  {
    id: "agent",
    order: 3,
    title: "连接编程 Agent",
    href: "/start/agent/",
    minutes: 10,
    summary: "安装命令行 Agent，完成授权并选择可用模型。",
    outcome: "Agent 收到只读请求后能正常回复。",
  },
  {
    id: "check",
    order: 4,
    title: "开工检查",
    href: "/start/check/",
    minutes: 5,
    summary: "在空目录里串联目录、工作区、路径、Git 与 Agent。",
    outcome: "五项检查在本机各执行一次，没有报错。",
  },
];

/** Progress keys written by each readiness step. */
export const readinessIds = [
  "folder",
  "workspace",
  "path",
  "repository",
  "readonly-agent",
] as const;

export type ReadinessId = (typeof readinessIds)[number];
