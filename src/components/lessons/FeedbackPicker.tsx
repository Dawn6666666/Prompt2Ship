import { useState } from "react";
import { Prompt } from "../workbench/Primitives";
export const goodFeedback =
  "在 375px 宽度下出现横向滚动条，项目卡片被截断。请只修改 CSS，让手机上单列显示；不要改文字内容和电脑端效果。";
export const todoFeedback =
  "复现：新建带备注的任务 → 勾选完成 → 备注消失。期望：勾选完成时备注保持不变，只在主动清空时清空。请只修改更新接口，不改前端和数据库。";
export function FeedbackPicker({ todo = false }: { todo?: boolean }) {
  const [choice, setChoice] = useState(-1);
  const options = todo
    ? ["备注有 bug，修一下", "重写整个保存逻辑", todoFeedback]
    : ["手机上不好看，改一下", "把整个页面改成响应式", goodFeedback];
  return (
    <div className="feedback-picker">
      <span className="tag">试着判断</span>
      <h2>哪条反馈最容易让 Agent 改对？</h2>
      {options.map((o, i) => (
        <button
          key={o}
          className="feedback-choice"
          aria-pressed={choice === i}
          onClick={() => setChoice(i)}
        >
          <span>{String.fromCharCode(65 + i)}</span>
          {o}
        </button>
      ))}
      {choice !== -1 && (
        <p className="notice" role="status">
          {choice === 2
            ? "✓ 有具体环境、现象、修改范围，也写清了不能动什么。"
            : "还不够具体：Agent 不知道怎样复现，也不知道哪些地方不能动。再试试。"}
        </p>
      )}
      {choice === 2 && <Prompt text={options[2]} />}
    </div>
  );
}
