import { useState } from "react";
import { CopyButton } from "../CopyButton";
import { todoBaseline, todoCommands } from "@/data/todo-follow";
import { todoPrompt } from "@/data/todo";

function Command({ text }: { text: string }) {
  return (
    <div className="follow-command">
      <pre>{text}</pre>
      <CopyButton text={text} label="复制当前命令" />
    </div>
  );
}
export function TodoFollowAlong() {
  const [mode, setMode] = useState("agent");
  return (
    <details className="todo-follow-along">
      <summary>开始跟做：获取源码 → 运行基线 → 修改 → 验证</summary>
      <div className="follow-body">
        <section>
          <h3>1. 获取同一份初始项目</h3>
          <p>
            前置：已安装 Git、Node.js 与 npm。本案例在 Node.js 24
            上验证。以下操作使用新目录，不会覆盖你已有的 Todo 项目。
          </p>
          <Command text={todoCommands.prepare} />
          <p>
            核对 rev-parse 输出为 <code>{todoBaseline}</code>；安装前的 git
            status 应为空。用 VS Code 打开
            todo-app-p2s，之后的命令都在这个根目录执行。不能用 git diff
            判断当前提交是否与案例基线一致。
          </p>
        </section>
        <section>
          <h3>2. 分两个终端运行基线</h3>
          <div className="follow-terminals">
            <div>
              <h4>终端 A · 后端</h4>
              <Command text={todoCommands.backend} />
            </div>
            <div>
              <h4>终端 B · 前端</h4>
              <Command text={todoCommands.frontend} />
            </div>
          </div>
          <p>
            打开前端输出的地址，通常为 <code>http://localhost:5173</code>
            ；后端为 <code>http://localhost:3001</code>
            。先新增一条旧任务，确认已有功能可用。修改后端文件后，在终端 A 按
            Ctrl+C 并重新启动；保留数据库文件。
          </p>
        </section>
        <section>
          <h3>3. 选择一种修改方式</h3>
          <div className="segmented" aria-label="选择跟做方式">
            <button
              type="button"
              aria-pressed={mode === "agent"}
              onClick={() => setMode("agent")}
            >
              让 Agent 修改
            </button>
            <button
              type="button"
              aria-pressed={mode === "patch"}
              onClick={() => setMode("patch")}
            >
              应用参考补丁
            </button>
          </div>
          {mode === "agent" ? (
            <>
              <p>
                先让 Agent
                阅读项目和列计划，再按演示阶段逐层实现。自己的结果不必与参考代码逐字相同，但要满足同一组验收条件。
              </p>
              <Command text={todoPrompt} />
            </>
          ) : (
            <>
              <p>
                下载补丁并移动到 <strong>todo-app-p2s 根目录</strong>
                ，文件名保持
                todo-notes.patch。仅在尚未自行实现备注的案例基线上应用；检查失败时先看错误，不要强制套用。
              </p>
              <a
                className="p-button"
                href="/examples/todo-notes.patch"
                download
              >
                下载参考补丁
              </a>
              <Command text={todoCommands.patch} />
              <p>
                git apply --check 成功时通常没有输出；它只检查，不写入。下一条
                git apply 才执行修改。
              </p>
            </>
          )}
        </section>
        <section>
          <h3>4. 验证，再留下版本</h3>
          <Command text={todoCommands.verify} />
          <p>
            刷新页面，按顺序检查：新增备注 → 编辑时回填 → 切换完成后保留 →
            清空后刷新仍为空；最初创建的旧任务仍存在。再检查原有筛选与排序。完成后只提交这四个文件：
          </p>
          <Command text={todoCommands.commit} />
        </section>
      </div>
    </details>
  );
}
