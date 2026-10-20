import { useState } from "react";
import { SystemPicker, useSystem } from "./ReadinessCheck";
import { TerminalView, Prompt } from "../workbench/Primitives";
import { checks, agentInstall } from "../../data/setup";
export function ToolSetup({ agent = false }: { agent?: boolean }) {
  const [system, setSystem] = useSystem();
  const [run, setRun] = useState(false);
  return (
    <div className="ready-scene">
      <div className="ready-pane">
        <SystemPicker value={system} onChange={setSystem} />
        {agent ? (
          <>
            {system === "windows" ? (
              <>
                <p className="notice">
                  Windows：从官方文档下载与你的芯片对应的 CLI zip。解压到
                  C:\Tools\OpenCode，将该目录添加到用户
                  PATH，重开终端。官方目前不支持 Windows 包管理器安装。
                </p>
                <a
                  className="text-link"
                  href="https://opencode.ai/v2/docs/"
                  target="_blank"
                  rel="noreferrer"
                >
                  打开官方 Windows 下载入口 ↗
                </a>
              </>
            ) : (
              <Prompt text={agentInstall} />
            )}
            <TerminalView
              command="opencode --version"
              output="2.x.x（示例，以本机版本为准）"
              executed={run}
              onRun={() => setRun(true)}
            />
            <Prompt text="opencode\n# 进入交互界面后，依次输入：\n/connect\n/models" />
            <p className="notice">
              /connect 选择提供商并完成登录；/models
              选择可用模型。登录不等于免费：确认你的账户权限、额度和计费。不要把
              API Key 粘到聊天、截图或 Git 中。
            </p>
          </>
        ) : (
          <>
            <p className="notice">
              {system === "windows"
                ? "Windows：下载 Node.js 24 LTS 的 .msi 和 Git for Windows 安装程序，按默认选项安装后重开 VS Code。"
                : system === "mac"
                  ? "macOS：按 Apple 芯片 / Intel 选择 Node.js 24 LTS 安装包。Git 可从官网安装；系统也可能提示安装命令行工具。"
                  : "Linux：在 Node 官网选择发行版对应的 24 LTS 安装方式；Git 使用系统包管理器安装。不要直接复制其他发行版的命令。"}
            </p>
            <div className="inline-actions">
              <a
                className="button secondary"
                href="https://nodejs.org/en/download"
              >
                安装 Node.js ↗
              </a>
              <a
                className="button secondary"
                href="https://git-scm.com/downloads"
              >
                安装 Git ↗
              </a>
            </div>
            <TerminalView
              command={checks}
              output="node: v24.x.x\nnpm: 11.x.x\ngit: 2.x.x"
              executed={run}
              onRun={() => setRun(true)}
            />
            <p className="notice">
              Node 运行工具，npm 随 Node 安装，Git 记录版本。
            </p>
          </>
        )}
      </div>
    </div>
  );
}
