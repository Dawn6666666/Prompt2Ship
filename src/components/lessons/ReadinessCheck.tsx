import { useState } from "react";
import {
  DoneCheck,
  FileTree,
  Prompt,
  TerminalView,
  CommandBlock,
} from "../workbench/Primitives";
import { EditorMap } from "./EditorMap";
import { setupCommands, systems, type System } from "../../data/setup";
import { usePreference } from "../../lib/usePreference";
const systemIds = ["windows", "mac", "linux"] as const;
export function useSystem() {
  return usePreference<System>("p2s:system", "windows", systemIds);
}
export function SystemPicker({
  value,
  onChange,
}: {
  value: System;
  onChange: (s: System) => void;
}) {
  return (
    <div className="segmented" aria-label="选择操作系统">
      {systems.map((s) => (
        <button
          key={s.id}
          aria-pressed={value === s.id}
          onClick={() => onChange(s.id)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
const ids = ["folder", "workspace", "path", "repository", "readonly-agent"];
export function PreparationSystem() {
  const [system, setSystem] = useSystem();
  return (
    <div>
      <SystemPicker value={system} onChange={setSystem} />
      <p className="muted">
        系统选择会保存在此浏览器中，后续安装说明和命令一起切换。不检测本机系统。
      </p>
    </div>
  );
}
export function ReadinessCheck() {
  const [step, setStep] = useState(0),
    [executed, setExecuted] = useState<boolean[]>(Array(5).fill(false));
  const [system, setSystem] = useSystem(),
    [hidden, setHidden] = useState(false);
  const path =
    system === "windows"
      ? "C:\\Users\\student\\my-homepage"
      : "/home/student/my-homepage";
  const actualPath = system === "mac" ? "/Users/student/my-homepage" : path;
  const run = () => setExecuted((e) => e.map((v, i) => i <= step || v));
  const criteria = [
    "知道新建的 my-homepage 文件夹在电脑哪里。",
    "已用 VS Code 打开 my-homepage。",
    "终端输出的当前路径以 my-homepage 结尾。",
    "git status 显示尚无提交。",
    "Agent 读取了当前目录，且没有修改文件。",
  ];
  return (
    <div>
      <div className="ready-scene">
        <div className="ready-actions">
          {["建目录", "打开工作区", "确认路径", "初始化 Git", "验证 Agent"].map(
            (s, i) => (
              <button
                key={s}
                aria-pressed={step === i}
                onClick={() => setStep(i)}
              >
                {i + 1}. {s}
              </button>
            ),
          )}
        </div>
        <div className="ready-pane">
          <SystemPicker value={system} onChange={setSystem} />
          {step === 0 && (
            <>
              <p className="notice">
                先用
                {system === "windows"
                  ? "文件资源管理器"
                  : system === "mac"
                    ? "访达"
                    : "文件管理器"}
                打开自己的项目存放位置，新建名为 my-homepage
                的文件夹。记住它的位置，不需要先输入命令。
              </p>
              <button className="button secondary" onClick={run}>
                演示新建文件夹
              </button>
              <details>
                <summary>熟悉终端？也可以用命令创建</summary>
                <CommandBlock text={setupCommands.create} />
                <p>在你选好的父目录执行；已有同名项目时不要重复创建或覆盖。</p>
              </details>
            </>
          )}
          {step === 1 && (
            <>
              <p className="notice">
                在 VS Code 选择“文件 → 打开文件夹”，选中刚创建的
                my-homepage。只信任你自己创建或了解来源的目录。
              </p>
              <button className="button secondary" onClick={run}>
                演示打开文件夹
              </button>
              <EditorMap />
              <details>
                <summary>可选的 code 命令</summary>
                <CommandBlock text={setupCommands.open} />
                <p>
                  仅在 my-homepage 目录内执行；code 命令不可用时用菜单即可。
                </p>
              </details>
            </>
          )}
          {step === 2 && (
            <>
              <p className="notice">
                菜单“终端 →
                新建终端”。先问清“命令会在哪个目录执行”，再操作文件。
              </p>
              <TerminalView
                folder="my-homepage"
                command={system === "windows" ? "Get-Location" : "pwd"}
                output={actualPath}
                executed={executed[2]}
                onRun={run}
              />
              <p>
                Windows 示例使用 PowerShell；若切换到命令提示符，用 cd
                查看当前路径。你的用户名、父目录可能不同，只需核对末尾目录。
              </p>
            </>
          )}
          {step === 3 && (
            <>
              <p className="notice">
                确认路径正确后，再初始化
                Git。这里只建立版本仓库，还没有记录任何代码版本。
              </p>
              <TerminalView
                command={setupCommands.git}
                output="Initialized empty Git repository in my-homepage/.git/\nNo commits yet\nnothing to commit"
                executed={executed[3]}
                onRun={run}
              />
              <label className="choice">
                <input
                  type="checkbox"
                  checked={hidden}
                  onChange={(e) => setHidden(e.target.checked)}
                />
                显示隐藏的 .git 目录
              </label>
            </>
          )}
          {step === 4 && (
            <>
              <p className="notice">
                先确保 Node/npm/Git 的版本检查已在
                <a href="/start/tools/">运行工具页</a>完成，并在
                <a href="/start/agent/">Agent 页</a>
                连接模型。现在才在当前项目中启动 Agent。
              </p>
              <CommandBlock text="opencode" />
              <Prompt text="请只读查看当前目录，告诉我当前项目路径、有哪些文件、Git 是否已经初始化。不要创建、修改文件或安装依赖。" />
              <button className="button secondary" onClick={run}>
                查看示例响应
              </button>
              {executed[4] && (
                <div className="agent-reply">
                  <b>Agent · 只读结果示例</b>
                  <p>
                    当前项目：{actualPath}。尚无网页文件；发现
                    .git，仓库已初始化但没有提交。没有创建或修改文件。
                  </p>
                </div>
              )}
              <p>
                Agent 正在运行时，该终端由它接收输入。下一步要执行 Shell
                命令，请另开集成终端；不要把 Shell 命令直接当对话发送。
              </p>
            </>
          )}
          <FileTree
            files={
              executed[3] && hidden
                ? [{ name: ".git", status: "隐藏目录" }]
                : []
            }
            folder={executed[0] ? "my-homepage" : "尚未创建项目目录"}
            gitReady={executed[3]}
            onSelect={() => {}}
          />
          <p
            className={`muted ${step === 2 && executed[2] ? "path-linked" : ""}`}
          >
            当前工作区：{executed[1] ? actualPath : "尚未打开项目"}
          </p>
        </div>
      </div>
      <DoneCheck
        page="start"
        id={ids[step]}
        criteria={criteria[step]}
        result={
          executed[step]
            ? "已展示该步示例，不代表本机完成。"
            : "先观察操作后的变化，再在本机跟做。"
        }
      />
      {step < 4 ? (
        <button className="button" onClick={() => setStep(step + 1)}>
          下一项检查 →
        </button>
      ) : (
        <a className="button" href="/case/homepage/">
          开始案例一 →
        </a>
      )}
    </div>
  );
}
