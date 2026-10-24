import type { System } from "../../../data/setup";

export const installCopy: Record<System, string> = {
  windows:
    "下载 Node.js 24 LTS 的 .msi 与 Git for Windows 安装程序，安装时保持默认选项。",
  mac: "按芯片下载 Node.js 24 LTS 安装包。Git 可用安装程序，也可在终端执行 xcode-select --install。",
  linux:
    "选择对应发行版的 Node.js 24 LTS 安装源，Git 用系统包管理器安装。",
};

export const installHint: Record<System, string> = {
  windows: "安装完成后重新打开 VS Code，让新程序进入终端的环境变量。",
  mac: "Apple 芯片与 Intel 芯片的安装包不同，下载前先看机器信息。",
  linux: "不同发行版的包名不同，以官方安装页给出的命令为准。",
};

export const versionFailure: Record<System, string> = {
  windows: "'node' 不是内部或外部命令，也不是可运行的程序。",
  mac: "zsh: command not found: node",
  linux: "bash: node: command not found",
};

export const versionFailureFix: Record<System, string> = {
  windows: "关闭所有 VS Code 窗口后重新打开终端，新安装的路径才会生效。",
  mac: "关闭终端再打开；仍然失败时检查 shell 配置里的 PATH 是否包含安装目录。",
  linux: "确认安装源把可执行文件写入了 PATH，重新登录后再执行命令。",
};

export const agentInstallCopy: Record<System, string> = {
  windows:
    "从官方发布页下载对应芯片的 CLI 压缩包，解压到 C:\\Tools\\OpenCode，再把该目录加入系统 PATH。",
  mac: "在终端执行全局安装命令。",
  linux: "在终端执行全局安装命令。",
};
