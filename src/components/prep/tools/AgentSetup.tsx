import { useState } from "react";
import {
  CommandBlock,
  DoneCheck,
  Prompt,
  TerminalView,
} from "../../workbench/Primitives";
import {
  agentCommands,
  agentInstall,
  agentPrompts,
} from "../../../data/setup";
import { useSystem } from "../system/useSystem";
import { SetupStep } from "./SetupStep";
import { SetupWindow } from "./SetupWindow";
import { agentInstallCopy } from "./setupContent";

export function AgentSetup() {
  const [system, setSystem] = useSystem();
  const [ran, setRan] = useState(false);

  return (
    <div className="setup-root">
      <SetupWindow
        title="Agent 安装与验证"
        note="示例输出为预设内容；Agent 不会读取你的电脑。"
        system={system}
        onSystemChange={setSystem}
      >
        <SetupStep index={1} title="安装 Agent">
          <p className="setup-lede">{agentInstallCopy[system]}</p>
          {system === "windows" ? (
            <p className="setup-hint">
              设置 PATH 后重新打开终端，下一节的验证命令才会被识别。
            </p>
          ) : (
            <CommandBlock text={agentInstall} />
          )}
          <TerminalView
            folder="my-homepage"
            command="opencode --version"
            output="2.x.x"
            executed={ran}
            onRun={() => setRan(true)}
          />
        </SetupStep>

        <SetupStep index={2} title="登录并选择模型">
          <p className="setup-lede">
            先启动交互界面，再按顺序完成授权与模型选择。
          </p>
          <div className="command-grid">
            <CommandBlock
              text={agentCommands.launch}
              destination="输入终端 · 启动交互界面"
            />
            <CommandBlock
              text={agentCommands.connect}
              destination="输入 OpenCode 交互界面 · 连接提供商"
            />
            <CommandBlock
              text={agentCommands.models}
              destination="输入 OpenCode 交互界面 · 选择模型"
            />
          </div>
        </SetupStep>

        <SetupStep index={3} title="发送首次只读请求">
          <p className="setup-lede">
            确认回复正常，且项目里没有多出文件。
          </p>
          <Prompt text={agentPrompts.intro} />
          <div className="agent-reply">
            <b>Agent 只读响应示例</b>
            <p>
              我可以读取项目文件、协助规划方案，并在你授权后修改代码。当前未修改任何文件。
            </p>
          </div>
        </SetupStep>
      </SetupWindow>

      <DoneCheck
        page="preparation"
        id="agent"
        criteria="本机已安装 Agent，完成登录与模型选择，并收到首次只读回复。"
        result="示例展示配置流程，回复内容以本机为准。"
      />
    </div>
  );
}
