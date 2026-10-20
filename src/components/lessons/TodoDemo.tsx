import { useState } from "react";
import { RefreshCw } from "lucide-react";
export function TodoDemo({
  fixed,
  bug = false,
}: {
  fixed: boolean;
  bug?: boolean;
}) {
  const [notes, setNotes] = useState("带学生证，提前十分钟到。");
  const [saved, setSaved] = useState("带学生证，提前十分钟到。");
  const [completed, setCompleted] = useState(false);
  const [log, setLog] = useState("示例数据已从 SQLite 读取。");
  return (
    <div className="todo-demo">
      <div className="section-heading">
        <h3>今天的待办</h3>
        <span className="tag">预设交互 · 非实时接口</span>
      </div>
      <div className="todo-item">
        <label className="choice">
          <input
            aria-label="完成任务"
            type="checkbox"
            checked={completed}
            onChange={(e) => {
              setCompleted(e.target.checked);
              if (bug && !fixed) {
                setSaved("");
                setNotes("");
                setLog(
                  "PUT 只传 completed → 接口把 notes 当成空值 → 备注丢失。",
                );
              } else setLog("PUT 只传 completed → 保留旧 notes → 备注仍在。");
            }}
          />
          <b>参加摄影社活动</b>
        </label>
        <p>{saved || "（没有备注）"}</p>
        <span className="tag">社团 · 普通优先级</span>
      </div>
      <label className="muted" htmlFor="todo-notes">
        编辑备注
      </label>
      <textarea
        className="draft-input"
        id="todo-notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div className="inline-actions">
        <button
          className="button"
          onClick={() => {
            setSaved(notes);
            setLog(
              notes
                ? "备注已保存到示例数据。"
                : "主动传入空字符串 → 备注被清空。",
            );
          }}
        >
          保存备注
        </button>
        <button
          className="button secondary"
          onClick={() => {
            setNotes(saved);
            setLog(
              "模拟重新读取 → “" + saved + "”。真实刷新验证见第 5 步证据。",
            );
          }}
        >
          <RefreshCw size={14} />
          模拟刷新
        </button>
        <button
          className="text-link"
          onClick={() => {
            setSaved("带学生证，提前十分钟到。");
            setNotes("带学生证，提前十分钟到。");
            setCompleted(false);
            setLog("已重置示例任务，可再次复现。");
          }}
        >
          重置
        </button>
      </div>
      <p className="notice" role="status">
        {log}
      </p>
    </div>
  );
}
