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
export const toolLinks = {
  node: "https://nodejs.org/en/download",
  git: "https://git-scm.com/downloads",
  editor: "https://code.visualstudio.com/download",
  agent: "https://opencode.ai/v2/docs/",
};
