import { useState } from "react";
import { Prompt } from "./Primitives";
import { sceneFiles } from "../../data/scenes";

export function AgentCreationPanel({
  todo,
  prompt,
  onInspect,
}: {
  todo: boolean;
  prompt: string;
  onInspect: () => void;
}) {
  const [replayed, setReplayed] = useState(false);
  return (
    <div className="agent-creation-panel">
      <Prompt text={prompt} />
      <div className="agent-message">
        <b>Agent 示例回复</b>
        <p>
          我会按刚确认的计划
          {todo
            ? "局部修改四个文件，保留现有项目结构"
            : "创建一个包含 HTML 和 CSS 的 index.html"}
          。先核对写入结果，再启动。
        </p>
      </div>
      <button className="button secondary" onClick={() => setReplayed(true)}>
        查看预设文件操作
      </button>
      {replayed && (
        <div className="agent-actions" role="status">
          <p>下面是预设处理记录，不是你电脑上的文件操作：</p>
          <ol>
            {(todo ? sceneFiles.todo : ["index.html"]).map((file) => (
              <li key={file}>
                Agent 报告：{todo ? "修改" : "创建"} <code>{file}</code>
              </li>
            ))}
          </ol>
          <p>
            回复只能证明 Agent
            声称做过。下一步打开文件区与代码，核实文件确实保存。
          </p>
          <button className="button secondary" onClick={onInspect}>
            到文件区核实保存结果
          </button>
        </div>
      )}
      <details>
        <summary>回复里有代码，就等于项目有文件吗？</summary>
        <p>
          不等于。只有聊天内容时，需要保存为正确的文件；即使 Agent
          报告写入成功，也要在当前工作区打开文件，检查路径与内容。随后才能运行和验收。
        </p>
      </details>
    </div>
  );
}
