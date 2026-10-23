import { useState } from "react";
import { flowScenarios } from "../../data/todo-flow";
export function TodoFlow() {
  const [scenario, setScenario] = useState(3),
    [node, setNode] = useState(1),
    [fixed, setFixed] = useState(true);
  const data = flowScenarios[scenario];
  const losesNotes = !fixed && !("notes" in data.body);
  const result = losesNotes ? "" : data.after;
  return (
    <div className="todo-flow">
      <h3>为什么“不传”不等于“清空”？</h3>
      <p className="muted">
        {fixed
          ? "修复后：未传备注就保留旧值。"
          : "修复前：把没有传入的备注误当作空字符串。"}{" "}
        固定示例，不连接真实接口。
      </p>
      <div className="segmented" aria-label="数据流版本">
        <button aria-pressed={!fixed} onClick={() => setFixed(false)}>
          v1 问题版本
        </button>
        <button aria-pressed={fixed} onClick={() => setFixed(true)}>
          v2 修复版本
        </button>
      </div>
      <div className="flow-choices" aria-label="选择备注操作">
        {flowScenarios.map((s, i) => (
          <button
            key={s.id}
            aria-pressed={scenario === i}
            onClick={() => setScenario(i)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="flow-choices" aria-label="数据经过的位置">
        {["表单", "请求", "后端", "数据库", "重新读取"].map((label, i) => (
          <button
            key={label}
            aria-pressed={node === i}
            onClick={() => setNode(i)}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>
      <div
        className="flow-inspector"
        data-defect={losesNotes && node >= 2}
        role="status"
      >
        {node === 0 ? (
          <p>
            {scenario === 3
              ? "只点击完成，没有编辑备注。"
              : scenario === 2
                ? "编辑框留空，点击保存。"
                : `在备注框输入：${data.after}`}
          </p>
        ) : node === 1 ? (
          <pre>{`${data.method} ${data.path}\n${JSON.stringify(data.body, null, 2)}`}</pre>
        ) : node === 2 ? (
          <>
            <code>
              {fixed
                ? "notes !== undefined ? notes.trim() : existing.notes"
                : "(notes ?? '').trim()"}
            </code>
            <p>
              传入的 notes：
              {"notes" in data.body
                ? JSON.stringify(data.body.notes)
                : "undefined · 没有传入"}
            </p>
            <p>
              {losesNotes
                ? "问题发生在接口合并字段时：没有 notes，仍写入了空字符串。原备注在这里丢失，而不是界面没有显示。"
                : data.explanation}
            </p>
          </>
        ) : node === 3 ? (
          <pre>{`todos.notes = ${JSON.stringify(result)}`}</pre>
        ) : (
          <p>再次读取的备注：{result || "（空字符串）"}</p>
        )}
      </div>
    </div>
  );
}
