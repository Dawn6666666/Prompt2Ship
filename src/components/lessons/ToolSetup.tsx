import { useState } from "react";
import { SystemPicker, useSystem } from "./ReadinessCheck";
import { TerminalView, CommandBlock, DoneCheck } from "../workbench/Primitives";
import { checks, agentInstall } from "../../data/setup";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
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
              <CommandBlock text={agentInstall} />
            )}
            <Tabs defaultValue="success">
              <TabsList aria-label="Agent 版本检查结果">
                <TabsTrigger value="success">成功示例</TabsTrigger>
                <TabsTrigger value="failure">失败示例</TabsTrigger>
              </TabsList>
              <TabsContent value="success">
                <TerminalView
                  folder="用户主目录"
                  command="opencode --version"
                  output="2.x.x（示例，以本机版本为准）"
                  executed={run}
                  onRun={() => setRun(true)}
                />
              </TabsContent>
              <TabsContent value="failure">
                <pre className="response-code">
                  {system === "windows"
                    ? "opencode : 无法将 opencode 识别为命令。"
                    : "opencode: command not found"}
                </pre>
                <p className="notice">
                  安装后重开 VS Code 和终端，让它读取新的
                  PATH。仍失败时回看官方安装路径，不要把 /connect 当作系统命令。
                </p>
              </TabsContent>
            </Tabs>
            <CommandBlock text="opencode" />
            <p className="notice">
              先在终端启动
              OpenCode。进入它的交互界面后，再逐条输入下面两条命令，不要把它们作为
              Shell 命令一次粘贴。
            </p>
            <CommandBlock
              text="/connect"
              destination="输入 OpenCode 交互界面 · 连接提供商"
            />
            <CommandBlock
              text="/models"
              destination="输入 OpenCode 交互界面 · 选择模型"
            />
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
            <Tabs defaultValue="success">
              <TabsList aria-label="运行环境检查结果">
                <TabsTrigger value="success">成功示例</TabsTrigger>
                <TabsTrigger value="failure">失败示例</TabsTrigger>
              </TabsList>
              <TabsContent value="success">
                <TerminalView
                  folder="用户主目录"
                  command={checks}
                  output="node: v24.x.x\nnpm: 11.x.x\ngit: 2.x.x"
                  executed={run}
                  onRun={() => setRun(true)}
                />
              </TabsContent>
              <TabsContent value="failure">
                <pre className="response-code">
                  {system === "windows"
                    ? "'node' 不是内部或外部命令，也不是可运行的程序。"
                    : "node: command not found"}
                </pre>
                <p className="notice">
                  这说明当前终端找不到程序，不代表项目代码有错。安装完成后重开终端，再分别检查
                  node、npm 和 git。
                </p>
              </TabsContent>
            </Tabs>
            <p className="notice">
              Node 运行工具，npm 随 Node 安装，Git 记录版本。
            </p>
          </>
        )}
      </div>
      {!agent && (
        <DoneCheck
          page="preparation"
          id="tools"
          result="示例已展示 Node、npm、Git 版本输出。"
          criteria="我的终端已能输出 Node、npm、Git 版本"
        />
      )}
    </div>
  );
}
