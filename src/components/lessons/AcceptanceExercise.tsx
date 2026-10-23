import { useState } from "react";
export function AcceptanceExercise({ todo = false }: { todo?: boolean }) {
  const [answer, setAnswer] = useState<number | null>(null);
  const options = todo
    ? ["备注功能正常", "新建带备注的任务，刷新后仍能读到同一段备注"]
    : ["页面看起来好看", "375px 宽度下没有横向滚动条"];
  return (
    <fieldset className="acceptance-exercise">
      <legend>哪一条能照着验收？</legend>
      <div className="inline-actions">
        {options.map((s, i) => (
          <button
            key={s}
            type="button"
            className="button secondary"
            aria-pressed={answer === i}
            onClick={() => setAnswer(i)}
          >
            {s}
          </button>
        ))}
      </div>
      {answer !== null && (
        <p role="status" className="notice">
          {answer === 1
            ? "对。条件、操作和可观察结果明确，别人也能重复检查。"
            : "还不够。“好看”“正常”没有说明怎样检查。试试另一条。"}
        </p>
      )}
    </fieldset>
  );
}
