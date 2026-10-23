import { useState } from "react";
import { Prompt, CommandBlock } from "../workbench/Primitives";
import { projectFiles } from "../../data/project-map";
import { todoBaseline, todoCommands } from "../../data/todo-follow";
export function ProjectMap() {
  const [read, setRead] = useState(false),
    [file, setFile] = useState(0);
  const current = projectFiles[file];
  return (
    <div className="project-reading">
      <h2>先读懂它，才知道哪里不能动。</h2>
      <details>
        <summary>本机从哪里取得这个项目？</summary>
        <p>
          仅在新的父目录中执行。需要 Node.js、Git 和网络；不会覆盖已有项目。
        </p>
        <CommandBlock text={todoCommands.prepare} />
        <p>
          基线 {todoBaseline}。用 VS Code 打开 todo-app-p2s，再从它的终端启动
          Agent。
        </p>
      </details>
      <Prompt text="请只读介绍任务从表单到保存经过哪些文件。说明各文件职责、哪些可能要改、哪些应该保留。不要修改文件或安装依赖。" />
      <button className="button secondary" onClick={() => setRead(true)}>
        查看只读分析
      </button>
      {read && (
        <>
          <p className="notice">
            Agent 示例分析：表单 → 请求封装 → 后端接口 →
            SQLite；列表项展示结果。六个相关文件中，本次计划修改四个。下面只查看，不产生修改标记。
          </p>
          <div className="project-file-map">
            <nav aria-label="项目职责地图">
              {projectFiles.map((f, i) => (
                <button
                  key={f.name}
                  aria-pressed={file === i}
                  onClick={() => setFile(i)}
                >
                  <code>{f.name}</code>
                  <span className="tag">
                    {f.change ? "计划修改" : "保持不动"}
                  </span>
                </button>
              ))}
            </nav>
            <div className="paper" role="status">
              <h3>{current.role}</h3>
              <code>{current.name}</code>
              <p>{current.reason}</p>
              <p className="muted">
                此时文件未修改。下一小步，把新增行为、不能动的范围和验收方式写进需求单。
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
