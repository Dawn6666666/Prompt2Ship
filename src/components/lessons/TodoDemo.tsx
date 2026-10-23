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
  const [title, setTitle] = useState("参加摄影社活动");
  const [newTitle, setNewTitle] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [previous, setPrevious] = useState<{ title: string; notes: string }[]>(
    [],
  );
  const [log, setLog] = useState("示例数据已从 SQLite 读取。");
  return (
    <div className="todo-demo">
      <div className="section-heading">
        <h3>今天的待办</h3>
        <span className="tag">预设交互 · 非实时接口</span>
      </div>
      <details className="todo-create">
        <summary>新建带备注的任务</summary>
        <p>
          新增后切换到新任务；这是内存中的预设操作，不会调用接口或写入你电脑上的数据库。
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newTitle.trim()) return;
            setPrevious((items) => [...items, { title, notes: saved }]);
            setTitle(newTitle.trim());
            setNotes(newNotes.trim());
            setSaved(newNotes.trim());
            setCompleted(false);
            setNewTitle("");
            setNewNotes("");
            setLog(
              "POST 示例：新任务与备注一起保存。点击模拟刷新，重新读取这条备注。",
            );
          }}
        >
          <label>
            新任务标题
            <input
              className="draft-input"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              maxLength={120}
            />
          </label>
          <label>
            新任务备注
            <textarea
              className="draft-input"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
            />
          </label>
          <button className="button" type="submit">
            新增任务
          </button>
        </form>
      </details>
      {previous.length > 0 && (
        <details>
          <summary>之前的任务 · {previous.length}</summary>
          {previous.map((item, i) => (
            <p key={i}>
              <b>{item.title}</b> — {item.notes || "没有备注"}
            </p>
          ))}
        </details>
      )}
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
          <b>{title}</b>
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
            setTitle("参加摄影社活动");
            setPrevious([]);
            setNewTitle("");
            setNewNotes("");
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
