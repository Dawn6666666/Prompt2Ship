import { useState } from "react";
import {
  ArrowRight,
  Check,
  Database,
  FileJson,
  FormInput,
  ListTodo,
  Server,
} from "lucide-react";
import { flowScenarios } from "@/data/todo-flow";
import { StepControls, usePlayback, SceneTransition } from "./Activity";
const labels = ["表单操作", "请求参数", "后端处理", "数据库", "重新读取"];
const icons = [FormInput, FileJson, Server, Database, ListTodo];
export function TodoFlow() {
  const [scenario, setScenario] = useState(0);
  const play = usePlayback(labels.length, 2400);
  const data = flowScenarios[scenario];
  const body = JSON.stringify(data.body, null, 2);
  return (
    <div className="todo-flow">
      <div className="flow-scenarios" aria-label="选择备注操作">
        {flowScenarios.map((x, i) => (
          <button
            type="button"
            key={x.id}
            aria-pressed={scenario === i}
            onClick={() => {
              setScenario(i);
              play.setStep(0);
            }}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div className="flow-nodes" aria-label="备注数据经过的位置">
        {labels.map((label, i) => {
          const Icon = icons[i];
          return (
            <div key={label}>
              <button
                type="button"
                aria-pressed={play.step === i}
                onClick={() => play.setStep(i)}
                className={i <= play.step ? "reached" : ""}
              >
                <Icon size={21} />
                <span>{label}</span>
                <small>0{i + 1}</small>
              </button>
              {i < labels.length - 1 && (
                <ArrowRight
                  size={14}
                  className={i < play.step ? "flow-reached" : ""}
                />
              )}
            </div>
          );
        })}
      </div>
      <SceneTransition id={`${scenario}-${play.step}`}>
        <div className="flow-inspector">
          <div className="flow-inspector-label">
            <span className="small-label">{labels[play.step]}</span>
            <span className="p-badge">
              {
                [
                  "TodoForm.jsx",
                  `${data.method} ${data.path}`,
                  "routes/todos.js",
                  "todos 表",
                  "GET /api/todos",
                ][play.step]
              }
            </span>
          </div>
          {play.step === 0 ? (
            <div className="flow-form">
              <span className="flow-input-label">任务标题</span>
              <div className="flow-input">交付作品网站</div>
              <span className="flow-input-label">任务备注（可选）</span>
              <div className="flow-input flow-textarea">
                {scenario === 2 ? (
                  <span className="empty-value">留空，主动清空备注</span>
                ) : scenario === 3 ? (
                  data.before
                ) : (
                  data.after
                )}
              </div>
              {scenario === 3 && (
                <span className="flow-action">
                  <Check size={15} /> 只点击“完成”，没有编辑备注
                </span>
              )}
            </div>
          ) : play.step === 1 ? (
            <pre className="flow-json">{`${data.method} ${data.path}\nContent-Type: application/json\n\n${body}`}</pre>
          ) : play.step === 2 ? (
            <div className="flow-server">
              <code>
                {data.method === "POST"
                  ? "const { notes = '' } = req.body; → notes.trim()"
                  : "notes !== undefined ? notes.trim() : existing.notes"}
              </code>
              <div>
                <span>请求中的 notes</span>
                <strong>
                  {"notes" in data.body
                    ? JSON.stringify(data.body.notes)
                    : "undefined · 没有传入"}
                </strong>
              </div>
              <div>
                <span>最终写入的值</span>
                <strong>{JSON.stringify(data.after)}</strong>
              </div>
              <p>{data.explanation}</p>
            </div>
          ) : play.step === 3 ? (
            <div className="flow-table">
              <table>
                <caption>保存后的任务行（固定示例）</caption>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>title</th>
                    <th className="notes-column">notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>交付作品网站</td>
                    <td className="notes-column">
                      {data.after || <code>""</code>}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p>旧数据通过带默认值的迁移获得空备注，原有任务仍保留。</p>
            </div>
          ) : (
            <div className="flow-return">
              <span className="small-label">重新读取后的界面</span>
              <div className="flow-task">
                <span
                  className={`flow-checkbox ${scenario === 3 ? "done" : ""}`}
                >
                  {scenario === 3 && <Check size={13} />}
                </span>
                <div>
                  <strong>交付作品网站</strong>
                  {data.after && <p>{data.after}</p>}
                </div>
                <span className="p-badge">
                  {scenario === 3 ? "已完成" : "进行中"}
                </span>
              </div>
              <pre>
                {JSON.stringify(
                  { id: 1, title: "交付作品网站", notes: data.after },
                  null,
                  2,
                )}
              </pre>
            </div>
          )}
        </div>
      </SceneTransition>
      <div className="scene-observation" aria-live="polite">
        <ArrowRight size={16} />
        <p>{data.explanation}</p>
      </div>
      <StepControls labels={labels} {...play} />
      <p className="flow-disclaimer">
        浏览器内的固定数据回放，不连接后端。实际 API 与数据库检查见“验证”阶段。
      </p>
    </div>
  );
}
