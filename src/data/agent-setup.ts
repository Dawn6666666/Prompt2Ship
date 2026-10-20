import type { OperatingSystem } from "@/lib/usePreference";
export const agentDocs = {
  install: "https://opencode.ai/v2/docs/",
  connect: "https://opencode.ai/v2/docs/cli/providers",
  providers: "https://opencode.ai/v2/docs/providers",
  checkedAt: "2026-10-20",
};
export function openCodeSetup(system: OperatingSystem) {
  const start =
    system === "Windows" ? "& 'C:\\Tools\\OpenCode\\opencode.exe'" : "opencode";
  return [
    {
      title: "安装 OpenCode 2 CLI",
      instructions:
        system === "Windows"
          ? [
              "在 Windows 设置 → 系统 → 系统信息中查看系统类型。",
              "打开官方安装页，下载 Windows x64 或 ARM64 的 CLI 压缩包。",
              "解压到 C:\\Tools\\OpenCode，确认该目录内有 opencode.exe。",
              "回到已打开项目的 VS Code PowerShell 终端，执行下面的版本检查和启动命令。",
            ]
          : [
              "先确认 node --version 与 npm --version 能输出版本。",
              "在 VS Code 终端安装 CLI，再确认版本；已有 OpenCode 1 的同学先查看官方迁移说明。",
              "通过“文件 → 打开文件夹”进入项目，再启动 Agent。",
            ],
      command:
        system === "Windows"
          ? `${start} --version\n${start}`
          : "npm install -g @opencode/cli\nopencode --version\nopencode",
      detail:
        "出现版本号说明安装成功，出现交互界面说明启动成功；命令中不需要填写密钥。",
    },
    {
      title: "在 Agent 界面连接模型",
      instructions: [
        "以下斜杠命令输入在 OpenCode 内，不是在 PowerShell 或 Shell。",
        "输入 /connect，选择你已有账号或 API Key 的模型服务，再按该服务提示登录或填写 Key。",
        "输入 /models，选择账号可用的模型。模型服务可能需要额度或订阅，以所选服务说明为准。",
      ],
      command: "/connect\n/models",
      detail:
        "连接成功后能选择具体模型；若出现未授权或额度错误，返回 /connect 核对服务和账号。不要把 Key 写进项目或提示词。",
    },
    {
      title: "发出第一条只读任务",
      instructions: [
        "已有 Git 仓库先用 git status --short 记录状态；尚未初始化 Git 的空目录，先对照文件区记录现有文件。",
        "发送下面的任务，核对 Agent 提到的文件名和工作目录。",
        "任务后对照文件区；已有仓库再运行 git status --short，确认没有额外修改。空目录应如实回答“尚无代码”。",
      ],
      command:
        "请先查看当前项目，说明根目录路径、主要文件和运行方式。\n只依据实际存在的文件回答；如果没有代码，请直接说明。\n这次不要修改文件、安装依赖或运行服务。",
      detail:
        "成功依据是回答与本地文件一致、文件状态没有新增变动。只读任务提示不等于权限隔离；仍需了解工具的实际权限。",
    },
  ];
}
