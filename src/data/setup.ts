export type System = "windows" | "mac" | "linux";
export const systems: { id: System; label: string }[] = [
  { id: "windows", label: "Windows" },
  { id: "mac", label: "macOS" },
  { id: "linux", label: "Linux" },
];
export const checks = "node --version\nnpm --version\ngit --version";
export const setupCommands = {
  create: "mkdir my-homepage\ncd my-homepage",
  git: "git init\ngit status",
  open: "code .",
  run: "npx serve@14.2.4 .",
};
export const agentInstall = "npm install -g @opencode/cli";
export const agentCommands = {
  install: agentInstall,
  launch: "opencode",
  connect: "/connect",
  models: "/models",
} as const;
export const agentPrompts = {
  intro: "你好，请用一句话介绍你能帮我做什么。先不要创建或修改任何文件。",
  readonly:
    "请只读查看当前目录，告诉我当前项目路径、有哪些文件、Git 是否已经初始化。不要创建、修改文件或安装依赖。",
} as const;
export const versionCommands = {
  windows: "node -v; npm -v; git -v",
  mac: "node -v && npm -v && git -v",
  linux: "node -v && npm -v && git -v",
} as const;
export const versionOutput = "v24.11.0\n11.6.0\ngit version 2.47.0";
export const toolLinks = {
  node: "https://nodejs.org/en/download",
  git: "https://git-scm.com/downloads",
  editor: "https://code.visualstudio.com/download",
  editorDocs: "https://code.visualstudio.com/docs",
  agent: "https://opencode.ai/v2/docs/",
};
export const agentLinks = [
  {
    title: "OpenCode",
    description: "本站演示使用的命令行 Agent，文档包含安装、授权与模型选择。",
    href: "https://opencode.ai/v2/docs/",
  },
  {
    title: "Claude Code",
    description: "基于终端的编码助手，安装与登录方式见官方文档。",
    href: "https://code.claude.com/docs/en/overview",
  },
  {
    title: "Codex",
    description: "OpenAI 的命令行编码工具，适合已经配置好账号的读者。",
    href: "https://developers.openai.com/codex/cli/",
  },
];
