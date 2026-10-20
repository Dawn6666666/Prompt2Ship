import { useState } from "react";
import { FileCode, Monitor, Terminal } from "lucide-react";
import {
  DoneCheck,
  FileTree,
  Prompt,
  TerminalView,
} from "../workbench/Primitives";
import { checks, setupCommands, systems, type System } from "../../data/setup";
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
export function ReadinessCheck({ initialStep = 0 }: { initialStep?: number }) {
  const [step, setStep] = useState(initialStep),
    [executed, setExecuted] = useState<boolean[]>(Array(5).fill(false)),
    [area, setArea] = useState("files");
  const [system, setSystem] = useSystem();
  const [hidden, setHidden] = useState(false);
  function run() {
    setExecuted((e) => e.map((v, i) => (i <= step ? true : v)));
  }
  const commands = [
    setupCommands.create,
    setupCommands.git,
    setupCommands.open,
    checks,
    "只回复一个 HTML 页面的基本结构，不要创建或修改任何文件。",
  ];
  const outputs = [
    system === "windows"
      ? "PS C:\\Users\\student\\my-homepage>"
      : "~/my-homepage $",
    "Initialized empty Git repository in my-homepage/.git/\nNo commits yet\nnothing to commit",
    "VS Code 已打开 my-homepage 工作区。",
    "node: v24.x.x\nnpm: 11.x.x\ngit: 2.x.x",
    '<!doctype html>\n<html lang="zh-CN">\n<head><title>我的页面</title></head>\n<body><h1>你好</h1></body>\n</html>',
  ];
  const descriptions = [
    "创建专门的项目文件夹。以后命令都在这里执行。",
    ".git 保存版本信息。初始化成功不代表已经提交代码。",
    "终端输入 code .，也可以通过“文件 → 打开文件夹”打开。",
    "出现三个版本号，才能确认运行和版本工具可用。这里是示例输出，不是检测你的电脑。",
    "能回复只证明 Agent 连通了。这里没有创建文件，也没有运行网页。",
  ];
  return (
    <div>
      <div className="ready-scene">
        <div className="ready-actions">
          {["建目录", "初始化 Git", "打开工作区", "检查环境", "验证 Agent"].map(
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
          <p className="notice">{descriptions[step]}</p>
          {step < 2 && (
            <>
              <TerminalView
                folder={
                  step === 0 && !executed[0] ? "用户主目录" : "my-homepage"
                }
                command={commands[step]}
                output={outputs[step]}
                executed={executed[step]}
                onRun={run}
              />
              <FileTree
                files={
                  executed[0]
                    ? [
                        ...(executed[1] && hidden
                          ? [{ name: ".git", status: "隐藏目录" }]
                          : []),
                      ]
                    : []
                }
                folder={executed[0] ? "my-homepage" : "尚未创建项目目录"}
                gitReady={executed[1]}
                onSelect={() => {}}
              />
              {executed[1] && (
                <label className="choice">
                  <input
                    type="checkbox"
                    checked={hidden}
                    onChange={(e) => setHidden(e.target.checked)}
                  />
                  显示隐藏的 .git 目录
                </label>
              )}
              <p className="muted">
                当前路径：
                {executed[0]
                  ? system === "windows"
                    ? "C:\\Users\\student\\my-homepage"
                    : "~/my-homepage"
                  : "用户主目录"}
              </p>
            </>
          )}
          {step === 2 && (
            <>
              <TerminalView
                command={commands[step]}
                output={outputs[step]}
                executed={executed[step]}
                onRun={run}
              />
              <div className="editor-map">
                {[
                  ["files", "文件区", FileCode],
                  ["editor", "编辑区", Monitor],
                  ["terminal", "集成终端", Terminal],
                ].map(([id, label, Icon]) => {
                  const I = Icon as typeof Monitor;
                  return (
                    <button
                      className={area === id ? "selected" : ""}
                      key={String(id)}
                      onClick={() => setArea(String(id))}
                    >
                      <I size={20} />
                      {String(label)}
                    </button>
                  );
                })}
              </div>
              <p className="notice">
                {area === "files"
                  ? "文件区：查看项目目录，点击文件打开。"
                  : area === "editor"
                    ? "编辑区：查看、编辑文件，Ctrl+S / ⌘S 保存。"
                    : "集成终端：输入命令。菜单“终端 → 新建终端”，检查当前路径为 my-homepage。"}
              </p>
            </>
          )}
          {step === 3 && (
            <>
              <TerminalView
                command={checks}
                output={outputs[3]}
                executed={executed[3]}
                onRun={run}
              />
              <details>
                <summary>命令找不到 / 输出不一致？</summary>
                <p>
                  小版本号不必一致。Node 推荐 24 LTS。安装后重开 VS Code
                  和终端；仍找不到时，回到
                  <a href="/start/tools/">运行工具安装</a>。PowerShell 若阻止
                  npm.ps1，可在终端下拉菜单切换“命令提示符”后重试，不必修改系统安全策略。
                </p>
              </details>
            </>
          )}
          {step === 4 && (
            <>
              <Prompt text={commands[4]} />
              <button className="button secondary" onClick={run}>
                查看示例响应
              </button>
              {executed[4] && (
                <>
                  <pre className="response-code">{outputs[4]}</pre>
                  <p className="notice">
                    html 是页面根节点；head 放标题等信息；body
                    放可见内容。尚未保存为 index.html。
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <DoneCheck
        page="start"
        id={String(step + 1)}
        criteria={
          [
            "知道 my-homepage 放在哪里，终端当前路径正确。",
            "git status 显示仓库就绪，尚无提交。",
            "能找到文件区、编辑区和集成终端。",
            "本机三条命令都有版本输出。",
            "本机 Agent 对只读请求给出了响应。",
          ][step]
        }
        result={
          executed[step]
            ? "已展示该步示例结果，不代表本机已完成。"
            : "点击“演示执行”查看状态变化。"
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
