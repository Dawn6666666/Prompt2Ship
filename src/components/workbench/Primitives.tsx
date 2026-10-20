import { useEffect, useState, type ReactNode } from "react";
import {
  Check,
  Copy as CopyIcon,
  MessageSquare,
  FileCheck,
  Play,
  ShieldCheck,
  Terminal,
  Folder,
  FileCode,
  ChevronRight,
} from "lucide-react";
import { useProgress } from "../../lib/progress";
import {
  homepageBrief,
  todoBrief,
  questionLabels,
  todoQuestionLabels,
} from "../../data/requirement";
import { Sheet } from "../ui/sheet";

export function Copy({
  text,
  label = "复制",
}: {
  text: string;
  label?: string;
}) {
  const [state, setState] = useState("");
  useEffect(() => {
    if (!state) return;
    const timer = window.setTimeout(() => setState(""), 1500);
    return () => window.clearTimeout(timer);
  }, [state]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("已复制");
    } catch {
      setState("请选中文本复制");
    }
  }
  return (
    <button className="copy-button" onClick={copy} aria-label={state || label}>
      {state === "已复制" ? <Check size={14} /> : <CopyIcon size={14} />}
      <span role="status">{state || label}</span>
    </button>
  );
}
export function Prompt({ text }: { text: string }) {
  return (
    <div className="prompt-block">
      <div className="block-label">
        <span>发给 Agent</span>
        <Copy text={text} />
      </div>
      <pre>{text}</pre>
    </div>
  );
}
export function StatusTrack({ values }: { values: boolean[] }) {
  const icons = [MessageSquare, FileCheck, Play, ShieldCheck];
  return (
    <div className="status-track" aria-label="示例项目状态">
      {["Agent 回复了", "文件保存了", "程序跑起来了", "结果验证过了"].map(
        (s, i) => {
          const Icon = icons[i];
          return (
            <span
              key={s}
              data-on={values[i]}
              className={`state-${i}`}
              title={
                [
                  "只证明收到了回复",
                  "文件已写入项目目录",
                  "浏览器能访问本地服务",
                  "已按需求逐项检查",
                ][i]
              }
            >
              <Icon size={15} />
              {s}
            </span>
          );
        },
      )}
      <small>示例</small>
    </div>
  );
}
export function DoneCheck({
  page,
  id,
  criteria,
  result,
}: {
  page: string;
  id: string;
  criteria: string;
  result: string;
}) {
  const [done, setDone] = useProgress(page, id);
  return (
    <div className="done-check">
      <div>
        <b>怎样算完成</b>
        <p>{criteria}</p>
      </div>
      <div className="example-result">
        <span className="tag">示例结果</span>
        {result}
      </div>
      <label className="choice">
        <input
          type="checkbox"
          checked={done}
          onChange={(e) => setDone(e.target.checked)}
        />
        我已在自己的电脑上完成这一步
      </label>
      <small>勾选只保存在此浏览器，不会自动检查你的电脑。</small>
    </div>
  );
}
export function Brief({
  todo = false,
  row = -1,
  answers,
}: {
  todo?: boolean;
  row?: number;
  answers?: string[];
}) {
  return (
    <div className="brief-document">
      <h3>{todo ? "任务备注需求单" : "个人主页需求单"}</h3>
      {(answers || (todo ? todoBrief : homepageBrief)).map((text, i) => (
        <div
          key={i}
          className={`brief-row ${row === i ? "is-highlighted" : ""}`}
        >
          <b>
            {i + 1}. {(todo ? todoQuestionLabels : questionLabels)[i]}
          </b>
          <p>{text || "等你回答这一问…"}</p>
        </div>
      ))}
    </div>
  );
}
export function BriefDrawer({
  todo = false,
  row = -1,
}: {
  todo?: boolean;
  row?: number;
}) {
  return (
    <Sheet
      title="回看需求单"
      description="后续演示使用这份示例需求单；你可以对照它检查计划与结果。"
      trigger={
        <button className="button secondary">
          <FileCheck size={15} />
          需求单
        </button>
      }
    >
      <Brief todo={todo} row={row} />
    </Sheet>
  );
}
export function TerminalView({
  command,
  output,
  executed,
  onRun,
  children,
  folder = "my-homepage",
}: {
  command: string;
  output: string;
  executed: boolean;
  onRun?: () => void;
  children?: ReactNode;
  folder?: string;
}) {
  return (
    <div className="terminal-view">
      <div className="block-label">
        <span>
          <Terminal size={15} />
          集成终端 · {folder}
        </span>
        <Copy text={command} />
      </div>
      <pre>
        <span className="terminal-path">~/{folder}</span>
        {"\n$ "}
        {command}
      </pre>
      {!executed && onRun && (
        <button className="terminal-run" onClick={onRun}>
          <Play size={14} />
          演示执行
        </button>
      )}
      {executed && (
        <div className="terminal-output" role="status">
          <pre>{output}</pre>
          {children}
        </div>
      )}
      <small>预设命令输出 · 不操作你的终端</small>
    </div>
  );
}
export function FileTree({
  files,
  active,
  onSelect,
  folder = "my-homepage",
  gitReady = true,
}: {
  files: { name: string; status?: string }[];
  active?: string;
  onSelect: (name: string) => void;
  folder?: string;
  gitReady?: boolean;
}) {
  return (
    <div className="file-tree">
      <div className="file-tree-heading">
        <Folder size={16} />
        {folder}
      </div>
      {files.map((f) => (
        <button
          key={f.name}
          aria-pressed={active === f.name}
          onClick={() => onSelect(f.name)}
        >
          <FileCode size={15} />
          <span>{f.name}</span>
          {f.status && <small>{f.status}</small>}
        </button>
      ))}
      {files.length === 0 && <p className="muted">没有文件</p>}
      <span className="git-hint">
        <ChevronRight size={12} />
        {gitReady ? ".git · 隐藏的版本记录" : "Git 尚未初始化"}
      </span>
    </div>
  );
}
export function CodeView({
  html,
  title = "index.html",
}: {
  html: string;
  title?: string;
}) {
  return (
    <div className="code-view">
      <div className="block-label">
        <span>
          <FileCode size={15} />
          {title}
        </span>
        <span>已保存</span>
      </div>
      <div
        className="highlighted-code"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
