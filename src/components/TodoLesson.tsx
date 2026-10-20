import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Database,
  FileCode2,
  FolderOpen,
  Lightbulb,
  Network,
} from "lucide-react";
import { todoChanges, todoPrompt } from "@/data/todo";
import type { HighlightPair } from "@/lib/highlight";
import { useStage } from "@/lib/useStage";
import { StageNav, StageFooter } from "./cases/StageNav";
import { TodoFlow } from "./dynamics/TodoFlow";
import { SceneTransition, SceneCheckpoint } from "./dynamics/Activity";
import { todoCheckpoints } from "@/data/checkpoints";
import { TodoFollowAlong } from "./cases/TodoFollowAlong";
import { PracticeTask } from "./dynamics/PracticeTask";
import { ReferenceImage } from "./dynamics/ReferenceImage";
import { CodeComparison } from "./ui/code-comparison";
import { CopyButton } from "./CopyButton";
const ids = [
  "understand",
  "plan",
  "database",
  "api",
  "frontend",
  "flow",
  "verify",
];
const titles = [
  "先读懂项目，再决定改哪里。",
  "把一个小功能，拆成一组明确改动。",
  "让旧数据库，也能存下新字段。",
  "把备注接入创建与更新接口。",
  "从输入，到回填，再到展示。",
  "跟着一条备注，走完数据的往返。",
  "让真实检查，为“完成”提供依据。",
];
const goals = [
  "点击文件，查看它在数据链中的职责。重点是判断哪些文件需要修改。",
  "先确定新增、编辑、清空和旧数据的行为，避免只加一个输入框。",
  "新建表语句不会改变旧表，迁移必须保留已有任务，并且可以重复启动。",
  "接收 notes 并写入 SQLite；区分字段未传入与主动清空。",
  "沿用现有数据传递方式，补齐备注的状态、提交和显示。",
  "选择一种操作，再点击数据节点，观察同一个字段在不同层中的样子。",
  "查看迁移、API、旧功能的实际验证记录，再在自己的项目复现。",
];
const prompts = [
  todoPrompt,
  "先列出备注功能的最小改动计划：旧任务默认空备注；支持新增、编辑和清空；切换完成状态不能丢备注。保留现有分类、筛选和拖拽。",
  "保留已有任务数据，为 todos 增加 notes 字段。旧数据默认空备注，重复启动不重复加列，不删除数据库。",
  "修改 POST 和 PUT 路由接收 notes。未传 notes 保留旧值，空字符串允许清空；检查输入类型。保留已有接口行为。",
  "在 TodoForm 增加备注输入，支持编辑回填与新建后重置；在 TodoItem 显示非空备注。沿用现有 App 与 API 封装。",
  "说明新增、编辑、清空和只切换完成状态时，notes 如何从请求写入数据库，再被重新读取。",
  "运行迁移与接口检查：旧数据、重复迁移、新增、编辑、清空、切换状态。再检查筛选、排序和删除，记录实际结果。",
];
const files = [
  {
    path: "client/src/components/TodoForm.jsx",
    role: "备注输入、编辑回填与提交",
    change: true,
  },
  {
    path: "client/src/App.jsx",
    role: "已有回调传递完整 data，不需要重写",
    change: false,
  },
  {
    path: "client/src/api/todos.js",
    role: "已有 JSON.stringify(data) 会传递新字段",
    change: false,
  },
  {
    path: "server/routes/todos.js",
    role: "创建与更新时读写 notes",
    change: true,
  },
  { path: "server/db.js", role: "增加列，保留已有任务", change: true },
  {
    path: "client/src/components/TodoItem.jsx",
    role: "显示返回的非空备注",
    change: true,
  },
];
export type TodoEvidence = {
  checkedAt: string;
  upstream: string;
  checks: { name: string; detail: string; passed: boolean }[];
  frontendBuild: boolean;
  browser?: { passed: boolean; steps: string[]; screenshot: string };
  environment?: {
    node: string;
    npm: string;
    browser: string;
    platform: string;
  };
  commands?: { command: string; output: string }[];
  patchSha256?: string;
};
export function TodoLesson({
  highlighted,
  evidence,
}: {
  highlighted: HighlightPair[];
  evidence?: TodoEvidence;
}) {
  const [stage, select] = useStage(ids, "p2s-todo");
  const [file, setFile] = useState(0);
  const [change, setChange] = useState(1);
  useEffect(() => {
    setChange(stage === 2 ? 0 : stage === 3 ? 1 : 3);
  }, [stage]);
  return (
    <div className="case-studio">
      <StageNav
        labels={[
          "理解项目",
          "制定计划",
          "数据库",
          "后端接口",
          "前端界面",
          "数据往返",
          "验证",
        ]}
        stage={stage}
        onChange={select}
      />
      <div className="case-stage-heading">
        <div>
          <span className="small-label">
            动态 {String(stage + 14).padStart(2, "0")} / FULL-STACK
          </span>
          <h2>{titles[stage]}</h2>
        </div>
        <span className="p-badge">React → Express → SQLite</span>
      </div>
      <TodoFollowAlong />
      <div className="case-workarea">
        <aside className="case-explanation">
          <p className="case-goal">{goals[stage]}</p>
          <div className="case-prompt">
            <div>
              <span className="small-label">给 Agent 的提示词</span>
              <CopyButton text={prompts[stage]} />
            </div>
            <p>{prompts[stage]}</p>
          </div>
          <div className="case-takeaway">
            <Lightbulb size={17} />
            <p>
              {
                [
                  "先理解数据流，才知道哪些文件不需要改。",
                  "功能边界越清楚，越容易发现遗漏。",
                  "保留旧数据，是修改已有项目的基本要求。",
                  "没有传值与主动清空，表达不同的意图。",
                  "输入、回填、提交、重置与展示形成闭环。",
                  "输入框出现，不代表数据已经持久化。",
                  "检查原有功能，确认小改动没有带来回归。 ",
                ][stage]
              }
            </p>
          </div>
          <a
            className="case-source-link"
            href="https://github.com/Baoxd123/todo-app"
            target="_blank"
            rel="noreferrer"
          >
            参考项目源码 <ArrowUpRight size={13} />
          </a>
        </aside>
        <div className="case-artifact">
          <SceneTransition id={stage}>
            {stage === 0 && (
              <div className="project-map">
                <div className="document-top">
                  <FolderOpen size={16} />
                  todo-app<span>点击文件查看职责</span>
                </div>
                <div className="project-map-files">
                  {files.map((x, i) => (
                    <button
                      type="button"
                      key={x.path}
                      aria-pressed={file === i}
                      onClick={() => setFile(i)}
                    >
                      <FileCode2 size={16} />
                      <code>{x.path}</code>
                      <span className={`p-badge ${x.change ? "" : "neutral"}`}>
                        {x.change ? "需要修改" : "沿用"}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="project-file-detail">
                  <Network size={22} />
                  <div>
                    <strong>{files[file].path.split("/").at(-1)}</strong>
                    <p>{files[file].role}</p>
                  </div>
                </div>
                <div className="data-chain">
                  <span>输入</span>
                  <ArrowRight size={14} />
                  <span>请求</span>
                  <ArrowRight size={14} />
                  <span>接口</span>
                  <ArrowRight size={14} />
                  <span>数据库</span>
                  <ArrowRight size={14} />
                  <span>展示</span>
                </div>
              </div>
            )}
            {stage === 1 && (
              <div className="todo-plan">
                <div className="document-top">
                  <Code2 size={16} />
                  最小改动计划<span>1 个字段 · 4 个文件</span>
                </div>
                {[
                  ["数据", "notes 为可选文本，旧任务默认空字符串。"],
                  ["接口", "POST 写入；PUT 支持更新、清空与保留。"],
                  ["界面", "输入、编辑回填、提交、列表显示。"],
                  ["验收", "保存后重新读取；原有完成、筛选与排序保持可用。"],
                ].map(([a, b], i) => (
                  <div className="todo-plan-row" key={a}>
                    <span>0{i + 1}</span>
                    <div>
                      <h3>{a}</h3>
                      <p>{b}</p>
                    </div>
                    <Check size={17} />
                  </div>
                ))}
                <p className="evidence-note">
                  范围只到任务备注，不添加登录、权限或其他业务。
                </p>
              </div>
            )}
            {stage >= 2 && stage <= 4 && (
              <>
                <div className="change-picker" aria-label="选择修改文件">
                  {(stage === 2 ? [0] : stage === 3 ? [1, 2] : [3, 4]).map(
                    (i) => (
                      <button
                        type="button"
                        key={todoChanges[i].label}
                        aria-pressed={change === i}
                        onClick={() => setChange(i)}
                      >
                        {todoChanges[i].label.replace(/^\d+ /, "")}
                      </button>
                    ),
                  )}
                </div>
                <CodeComparison
                  {...highlighted[change]}
                  filename={todoChanges[change].file}
                />
                <div className="artifact-finding good">
                  <Database size={18} />
                  <div>
                    <strong>{todoChanges[change].title}</strong>
                    <p>{todoChanges[change].detail}</p>
                  </div>
                </div>
                <p className="evidence-note">
                  对比展示关键整合片段；按说明并入原文件相应位置。
                </p>
              </>
            )}
            {stage === 5 && <TodoFlow />}
            {stage === 6 && (
              <div className="verification-document">
                <div className="document-top">
                  <Check size={16} />
                  案例验证记录<span>{evidence?.checkedAt ?? "待生成"}</span>
                </div>
                <div className="verification-list">
                  {evidence?.checks.map((x) => (
                    <div key={x.name}>
                      <span
                        className={`verify-icon ${x.passed ? "good" : "warn"}`}
                      >
                        {x.passed ? <Check size={16} /> : "!"}
                      </span>
                      <div>
                        <h4>{x.name}</h4>
                        <p>{x.detail}</p>
                      </div>
                      <span className="verify-status">
                        {x.passed ? "已通过" : "未通过"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="verification-summary">
                  <strong>
                    {evidence?.frontendBuild
                      ? "前端构建通过"
                      : "前端构建待确认"}
                  </strong>
                  <p>
                    验证对象：从上游 {evidence?.upstream ?? "a5a648a"}{" "}
                    复制的临时项目，应用本站备注改动后运行。不是对访问者本机的检测。
                  </p>
                </div>
                {evidence?.browser && (
                  <div className="browser-evidence">
                    <h3>
                      {evidence.browser.passed
                        ? "真实界面验证通过"
                        : "界面验证待完成"}
                    </h3>
                    <ol>
                      {evidence.browser.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                    <ReferenceImage
                      src={evidence.browser.screenshot}
                      title="备注保存并刷新后的真实 Todo 界面"
                      source="https://github.com/Baoxd123/todo-app"
                      credit="本站验证脚本生成的案例截图 · 固定测试数据"
                    />
                  </div>
                )}
                <details className="evidence-details">
                  <summary>展开验证环境、命令与关键输出</summary>
                  <p>
                    Node {evidence?.environment?.node} · npm{" "}
                    {evidence?.environment?.npm} ·{" "}
                    {evidence?.environment?.browser} ·{" "}
                    {evidence?.environment?.platform}
                  </p>
                  {evidence?.commands?.map((entry) => (
                    <div key={entry.command}>
                      <pre>
                        $ {entry.command}
                        {"\n"}
                        {entry.output}
                      </pre>
                    </div>
                  ))}
                  <p>
                    补丁 SHA-256：<code>{evidence?.patchSha256}</code>
                  </p>
                </details>
                <a
                  className="p-button"
                  href="/examples/todo-notes.patch"
                  download
                >
                  下载经过验证的修改补丁 <ArrowRight size={15} />
                </a>
                <p className="evidence-note">
                  跟做命令见本页“开始跟做”。先核对基线提交，再用 git apply
                  --check 检查补丁能否应用。
                </p>
              </div>
            )}
          </SceneTransition>
          <SceneCheckpoint {...todoCheckpoints[stage]} />
        </div>
      </div>
      {stage === 6 && (
        <PracticeTask
          id="todo"
          task="给一条你自己的任务写备注。先预测“清空”和“只切换完成”的结果，再到真实项目中验证。"
          checks={[
            "新增、编辑、清空与切换完成后，刷新页面结果仍正确",
            "已有任务保留，分类、筛选和排序仍可使用",
          ]}
        />
      )}
      <StageFooter
        stage={stage}
        total={ids.length}
        onChange={select}
        next={{ href: "/review", label: "带走协作方法" }}
      />
    </div>
  );
}
