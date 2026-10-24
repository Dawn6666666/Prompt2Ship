import { Play } from "lucide-react";
import { CommandBlock, Prompt, TerminalView } from "../../workbench/Primitives";
import { agentCommands, agentPrompts, setupCommands, type System } from "../../../data/setup";

interface ReadinessPanelProps {
  step: number;
  system: System;
  executed: boolean[];
  onDemo: () => void;
  path: string;
  promptPath: string;
  sigil: string;
}

export function ReadinessPanel({
  step,
  system,
  executed,
  onDemo,
  path,
  promptPath,
  sigil,
}: ReadinessPanelProps) {
  if (step === 0)
    return (
      <div className="step-content-pane">
        <h4 className="step-main-title">第 1 步：新建空项目目录</h4>
        <p className="step-main-desc">
          在文件管理器里新建一个空文件夹，名字用{" "}
          <code>my-homepage</code>。后面两个案例都放在这里。
        </p>
        <button type="button" className="button secondary" onClick={onDemo}>
          <Play size={14} aria-hidden="true" />
          演示新建文件夹
        </button>
        <details className="step-alt-details">
          <summary>用命令行创建</summary>
          <CommandBlock text={setupCommands.create} />
        </details>
      </div>
    );

  if (step === 1)
    return (
      <div className="step-content-pane">
        <h4 className="step-main-title">第 2 步：在 VS Code 中打开工作区</h4>
        <p className="step-main-desc">
          菜单选择 <code>文件 → 打开文件夹</code>，选中{" "}
          <code>my-homepage</code>。不要单独打开一个文件。
        </p>
        <button type="button" className="button secondary" onClick={onDemo}>
          <Play size={14} aria-hidden="true" />
          演示打开工作区
        </button>
        <details className="step-alt-details">
          <summary>用命令行打开</summary>
          <CommandBlock text={setupCommands.open} />
        </details>
      </div>
    );

  if (step === 2)
    return (
      <div className="step-content-pane">
        <h4 className="step-main-title">第 3 步：打开终端并核对路径</h4>
        <p className="step-main-desc">
          快捷键 <code>Ctrl+`</code> 打开集成终端。Windows PowerShell 用{" "}
          <code>Get-Location</code>，其他系统用 <code>pwd</code>。
        </p>
        <TerminalView
          folder="my-homepage"
          promptPath={promptPath}
          sigil={sigil}
          command={system === "windows" ? "Get-Location" : "pwd"}
          output={path}
          executed={executed[2]}
          onRun={onDemo}
        />
      </div>
    );

  if (step === 3)
    return (
      <div className="step-content-pane">
        <h4 className="step-main-title">第 4 步：初始化 Git 仓库</h4>
        <p className="step-main-desc">
          在当前目录执行 <code>git init</code>，再用{" "}
          <code>git status</code> 查看仓库状态。
        </p>
        <TerminalView
          folder="my-homepage"
          promptPath={promptPath}
          sigil={sigil}
          command={setupCommands.git}
          output={
            system === "windows"
              ? `Initialized empty Git repository in ${path}\\.git\\\nOn branch main\n\nNo commits yet\n\nnothing to commit`
              : `Initialized empty Git repository in ${path}/.git/\nOn branch main\n\nNo commits yet\n\nnothing to commit`
          }
          executed={executed[3]}
          onRun={onDemo}
        />
      </div>
    );

  return (
    <div className="step-content-pane">
      <h4 className="step-main-title">第 5 步：启动 Agent 做只读检查</h4>
      <p className="step-main-desc">
        在终端启动 Agent，发送提示词，确认它读到的是当前项目。
      </p>
      <CommandBlock text={agentCommands.launch} />
      <Prompt text={agentPrompts.readonly} />
      <button type="button" className="button secondary" onClick={onDemo}>
        <Play size={14} aria-hidden="true" />
        查看示例响应
      </button>
      {executed[4] && (
        <div className="agent-reply">
          <b>Agent 只读结果示例</b>
          <p>
            当前项目：{path}。目录内没有网页文件；发现 .git，仓库已初始化。未创建或修改任何文件。
          </p>
        </div>
      )}
    </div>
  );
}
