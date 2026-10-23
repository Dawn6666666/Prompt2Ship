import { useEffect, useState } from "react";
import { readProgress } from "../../lib/progress";

const preparation = [
  { id: "editor", label: "认识 VS Code", href: "/start/editor/" },
  { id: "tools", label: "检查 Node 和 Git", href: "/start/tools/" },
  { id: "agent", label: "连接 Agent", href: "/start/agent/" },
  { id: "check", label: "完成开工检查", href: "/start/check/" },
];
const readiness = [
  "folder",
  "workspace",
  "path",
  "repository",
  "readonly-agent",
];
const names = [
  "想清楚",
  "定计划",
  "生成并运行",
  "发现问题并修改",
  "检查并交付",
];
function snapshot() {
  const progress = readProgress();
  const done = preparation.map((item) =>
    item.id === "check"
      ? readiness.every((id) => progress.start?.[id] === true)
      : progress.preparation?.[item.id] === true,
  );
  let last: { page: string; step: number } | null = null;
  try {
    const value = JSON.parse(localStorage.getItem("p2s:last-scene") || "null");
    if (
      value &&
      ["homepage", "todo"].includes(value.page) &&
      Number.isInteger(value.step) &&
      value.step >= 1 &&
      value.step <= 5
    )
      last = value;
  } catch {
    /* Private browsing can disable storage. */
  }
  return {
    done,
    last,
    cases: ["homepage", "todo"].map(
      (page) =>
        names.filter((_, i) => progress[page]?.[String(i + 1)] === true).length,
    ),
  };
}
export function LearningProgress({
  mode = "overview",
}: {
  mode?: "overview" | "resume" | "compact" | "all";
}) {
  const [state, setState] = useState<{
    done: boolean[];
    last: { page: string; step: number } | null;
    cases: number[];
  }>({ done: [], last: null, cases: [0, 0] });
  useEffect(() => {
    const update = () => setState(snapshot());
    update();
    window.addEventListener("p2s-progress", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("p2s-progress", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  const count = state.done.filter(Boolean).length;
  if (mode === "compact")
    return (
      <span className="progress-compact" title="仅统计你手动确认的准备项">
        准备自查 {count}/4
      </span>
    );
  if (mode === "resume")
    return (
      <div className="resume-learning">
        <a
          className="button"
          href={
            state.last
              ? `/case/${state.last.page}/?step=${state.last.step}`
              : "/start/"
          }
        >
          {state.last
            ? `继续：案例${state.last.page === "homepage" ? "一" : "二"} · 第 ${state.last.step} 步`
            : "从准备工具开始 ↗"}
        </a>
        {state.last && (
          <small>
            上次浏览：{names[state.last.step - 1]}。续读不代表已在本机完成。
          </small>
        )}
      </div>
    );
  return (
    <div className="preparation-progress" aria-label="准备自查进度">
      <p>
        我已在本机完成 <b>{count}/4</b> · 只统计手动确认，不检测你的电脑。
      </p>
      <ol>
        {preparation.map((item, i) => (
          <li key={item.id} data-done={state.done[i] || false}>
            <a href={item.href}>
              <span aria-hidden="true">{state.done[i] ? "✓" : i + 1}</span>
              {item.label}
              <small>{state.done[i] ? "已自查" : "待自查"}</small>
            </a>
          </li>
        ))}
      </ol>
      {mode === "all" && (
        <div className="case-progress-summary">
          <p>案例自查 · 只统计你手动确认的步骤</p>
          {["homepage", "todo"].map((page, i) => (
            <a key={page} href={`/case/${page}/`}>
              案例{i === 0 ? "一：个人主页" : "二：任务备注"}
              <b>{state.cases[i]}/5</b>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
