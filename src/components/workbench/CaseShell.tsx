import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  GitCommit,
  MessageSquare,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Sheet } from "../ui/sheet";
import { CodeComparison } from "../ui/code-comparison";
import { RequirementBuilder } from "../lessons/RequirementBuilder";
import {
  FeedbackPicker,
  goodFeedback,
  todoFeedback,
} from "../lessons/FeedbackPicker";
import { TodoDemo } from "../lessons/TodoDemo";
import { TodoFlow } from "../lessons/TodoFlow";
import {
  Brief,
  BriefDrawer,
  CodeView,
  DoneCheck,
  FileTree,
  Prompt,
  StatusTrack,
  TerminalView,
} from "./Primitives";
import { PreviewPane } from "./PreviewPane";
import {
  homepageSteps,
  todoSteps,
  stepNames,
  homepageVersions,
  runCommand,
} from "../../data/homepage";
import { homepageBrief, todoBrief, makePrompt } from "../../data/requirement";
import { todoChanges } from "../../data/todo";
import { todoCommands, todoBaseline } from "../../data/todo-follow";
import evidence from "../../data/todo-evidence.json";
import homepageEvidence from "../../data/homepage-evidence.json";
import { useProgress } from "../../lib/progress";
import { useSceneState } from "../../lib/scene-state";
import type { HighlightPair } from "../../lib/highlight";
export type CaseAssets = {
  source: string;
  sourceAfter: string;
  diff: HighlightPair;
  todoDiffs: HighlightPair[];
  fix: HighlightPair;
};
function StepButton({
  page,
  i,
  active,
  onClick,
}: {
  page: string;
  i: number;
  active: boolean;
  onClick: () => void;
}) {
  const [done] = useProgress(page, String(i + 1));
  return (
    <button
      className="step-button"
      data-close-sheet
      aria-current={active ? "step" : undefined}
      onClick={onClick}
    >
      <span>{done ? <Check size={14} /> : i + 1}</span>
      <b>{stepNames[i]}</b>
    </button>
  );
}
export function CaseShell({
  todo = false,
  assets,
}: {
  todo?: boolean;
  assets: CaseAssets;
}) {
  const page = todo ? "todo" : "homepage";
  const [scene, dispatch] = useSceneState();
  const { step, sub, view, width, version, file, change, focus } = scene;
  const [ready, setReady] = useState(false);
  const setView = (view: string) =>
    dispatch({ type: "patch", patch: { view } });
  const setWidth = (width: number) =>
    dispatch({ type: "patch", patch: { width } });
  const setVersion = (version: "v1" | "v2") =>
    dispatch({ type: "patch", patch: { version } });
  const setFile = (file: string) =>
    dispatch({ type: "patch", patch: { file } });
  const setChange = (change: number) =>
    dispatch({ type: "patch", patch: { change } });
  const setFocus = (focus: string) =>
    dispatch({ type: "patch", patch: { focus } });
  const [checks, setChecks] = useState<boolean[]>(Array(6).fill(false));
  const steps = todo ? todoSteps : homepageSteps,
    current = steps[step];
  function route(n: number, history = true) {
    dispatch({ type: "route", step: n, todo });
    if (history) {
      const url = new URL(location.href);
      url.searchParams.set("step", String(n + 1));
      url.hash = "";
      window.history.pushState({}, "", url);
    }
  }
  useEffect(() => {
    const read = () => {
      const n = Number(new URLSearchParams(location.search).get("step") || 1);
      route(Number.isInteger(n) && n >= 1 && n <= 5 ? n - 1 : 0, false);
      setReady(true);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(`p2s:checks:${page}`) || "null",
      );
      if (Array.isArray(saved)) setChecks(saved);
    } catch {}
  }, [page]);
  function checkAt(i: number, value: boolean) {
    setChecks((c) => {
      const next = c.map((v, n) => (n === i ? value : v));
      try {
        localStorage.setItem(`p2s:checks:${page}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  }
  function advance(n: number) {
    dispatch({ type: "substep", sub: n });
  }
  if (!ready)
    return (
      <div className="case-skeleton" role="status">
        正在打开演示工作区…
      </div>
    );
  const status = [
    step > 0,
    step > 2 || (step === 2 && sub >= 1),
    step > 2 || (step === 2 && sub >= 2),
    step === 4,
  ];
  const files = todo
    ? [
        "server/db.js",
        "server/routes/todos.js",
        "client/src/components/TodoForm.jsx",
        "client/src/components/TodoItem.jsx",
      ].map((name) => ({
        name,
        status: step === 1 ? "将修改" : step >= 2 ? "M" : "",
      }))
    : [
        { name: "需求单.md" },
        ...(step >= 3 || (step === 2 && sub >= 1)
          ? [
              {
                name: "index.html",
                status: step === 2 && sub < 3 ? "新建" : "",
              },
            ]
          : []),
      ];
  const brief = todo ? todoBrief : homepageBrief;
  const gitEvidence = todo ? evidence.git : homepageEvidence;
  const diff = todo ? assets.fix : assets.diff;
  const checkItems = todo
    ? [
        "新增、编辑、清空备注",
        "刷新后仍然保留",
        "勾选完成后备注仍在",
        "分类与优先级照常",
        "筛选与拖拽照常",
        "仅修改计划中的四个文件",
      ]
    : [
        "名字和一句介绍",
        "两个项目及待替换链接",
        "邮箱链接格式正确",
        "1280px 下完整显示",
        "375px 下没有横向溢出",
        "网页只有一个 HTML，没有框架",
      ];
  const tips = todo
    ? [
        "使用原项目表单新增、编辑后，再主动清空。",
        "刷新页面，再从列表读到同一条备注。",
        "勾选完成再刷新，备注保持原值。",
        "切换分类与优先级，确认列表及保存结果。",
        "筛选一次、拖拽一次，再刷新核对顺序。",
        "git diff --stat 应与计划文件列表一致。",
      ]
    : [
        "查看页面顶部，确认名字和介绍存在。",
        "数两张项目卡，项目 # 链接必须在交付前替换。",
        "检查 href 为 mailto:xiaoman@example.com；本机需配置邮件应用才能打开。",
        "切换到 1280px，看内容是否完整。",
        "切换到 375px，并观察预览底部真实溢出检测。",
        "查看文件区，并检查 HTML 没有引入框架。",
      ];
  return (
    <div
      className="case-shell"
      onKeyDown={(event) => {
        const target = event.target as HTMLElement;
        if (
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          target.closest(
            'input,textarea,select,[contenteditable], [role="tablist"], [role="slider"], [role="dialog"]',
          )
        )
          return;
        if (event.key === "ArrowRight" && sub < current.actions.length - 1) {
          event.preventDefault();
          advance(sub + 1);
        }
        if (event.key === "ArrowLeft" && sub > 0) {
          event.preventDefault();
          advance(sub - 1);
        }
      }}
    >
      <div className="case-heading">
        <div>
          <span className="eyebrow">
            案例{todo ? "二" : "一"} · 5 步 ·{" "}
            {todo ? "已有项目改造" : "从零开始"}
          </span>
          <h1>{todo ? "给 Todo 加一个备注功能" : "做一个属于你的个人主页"}</h1>
          <p>
            {todo
              ? "不用读懂每一行代码。学会先问清楚、控制范围，再验证改动。"
              : "从空文件夹开始，学会想清楚要什么，再让 Agent 动手。"}
          </p>
        </div>
        <BriefDrawer
          todo={todo}
          row={step === 3 || step === 4 ? 3 : step === 1 ? 2 : -1}
        />
      </div>
      <div className="step-rail">
        <div className="desktop-steps">
          {stepNames.map((_, i) => (
            <StepButton
              page={page}
              key={i}
              i={i}
              active={step === i}
              onClick={() => route(i)}
            />
          ))}
        </div>
        <div className="mobile-steps">
          <Sheet
            title="五步开发流程"
            trigger={
              <button className="step-mobile-trigger">
                第 {step + 1} 步 / 5 · {stepNames[step]}
                <ChevronDown size={18} />
              </button>
            }
          >
            {stepNames.map((_, i) => (
              <StepButton
                page={page}
                key={i}
                i={i}
                active={step === i}
                onClick={() => route(i)}
              />
            ))}
          </Sheet>
        </div>
      </div>
      <div className="lesson-grid">
        <aside className="lesson-aside">
          <span className="eyebrow">第 {step + 1} 步 / 共 5 步</span>
          <h2>{stepNames[step]}</h2>
          <p className="lesson-goal">{current.goal}</p>
          <ol className="substep-list">
            {current.actions.map((a, i) => (
              <li key={a}>
                <button
                  aria-current={sub === i ? "step" : undefined}
                  onClick={() => advance(i)}
                >
                  <span>{String.fromCharCode(97 + i)}</span>
                  {a}
                </button>
              </li>
            ))}
          </ol>
          <details className="lesson-tips" open>
            <summary>记住这几件事</summary>
            <ul>
              {current.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </details>
          <div className="substep-controls">
            <button
              className="button secondary"
              disabled={sub === 0}
              onClick={() => advance(sub - 1)}
              aria-label="上一小步"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              className="button"
              disabled={sub === current.actions.length - 1}
              onClick={() => advance(sub + 1)}
            >
              下一小步
              <ArrowRight size={16} />
            </button>
          </div>
        </aside>
        <div className="lesson-scene">
          <p className="mobile-goal">{current.goal}</p>
          <StatusTrack values={status} />
          <div className="scene-body" key={step}>
            {step === 0 && (
              <>
                {!todo && sub === 0 && (
                  <p className="case-prerequisite">
                    第一次使用？先<a href="/start/check/">完成开工检查</a>，在
                    VS Code 中打开 my-homepage，再回到这里。
                  </p>
                )}
                <RequirementBuilder todo={todo} phase={sub} />
              </>
            )}
            {step === 1 && (
              <div className="ide-window">
                <div className="ide-title">
                  <span className="window-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  {todo ? "todo-app-p2s" : "my-homepage"} · VS Code
                  <span className="tag">示例</span>
                </div>
                <div className="plan-layout">
                  <FileTree
                    folder={todo ? "todo-app-p2s" : "my-homepage"}
                    files={files}
                    active={file}
                    onSelect={setFile}
                  />
                  <div className="agent-panel">
                    <div className="block-label">
                      <span>
                        <MessageSquare size={16} />
                        Agent · 先计划
                      </span>
                      <span>尚未写入文件</span>
                    </div>
                    <Prompt text={makePrompt(brief, todo)} />
                    {sub >= 1 && (
                      <>
                        <div className="agent-reply">
                          <b>Agent 的计划</b>
                          {todo ? (
                            files.map((f, i) => (
                              <button
                                className={`plan-line ${file === f.name ? "selected" : ""}`}
                                onClick={() => setFile(f.name)}
                                key={f.name}
                              >
                                {i + 1}. {f.name}
                                <span>
                                  {
                                    [
                                      "数据库增加 notes，旧任务默认空字符串。",
                                      "接口接收备注；不传时保留，空字符串时清空。",
                                      "表单新增备注输入，编辑时回填。",
                                      "列表展示备注，保留原来的操作。",
                                    ][i]
                                  }
                                </span>
                              </button>
                            ))
                          ) : (
                            <ol>
                              <li>创建 index.html：介绍、两个项目、邮箱。</li>
                              <li className={sub === 1 ? "conflict" : ""}>
                                {sub === 1
                                  ? "使用 Tailwind CDN 写样式 ← 与不用框架冲突"
                                  : "使用原生 CSS，放在同一个 HTML 里。"}
                              </li>
                              <li>头像和项目链接先用占位。</li>
                              <li>配色选白底深蓝。需要补充真实项目链接。</li>
                            </ol>
                          )}
                        </div>
                        <div className="notice">
                          <b>对照需求单 · {todo ? "不能动" : "这次不做"}</b>
                          <p>{brief[2]}</p>
                        </div>
                      </>
                    )}
                    {sub === 2 && (
                      <Prompt
                        text={
                          todo
                            ? "按这四处修改。保留原有功能，旧数据不要删除。可以开始了。"
                            : "不要用 Tailwind。只写原生 CSS，放在 index.html 的 style 中。配色用白底深蓝，链接先用 #。可以创建文件了。"
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
            {(step === 2 || step === 3) && (
              <>
                {step === 3 && sub === 1 && <FeedbackPicker todo={todo} />}
                <div className="ide-window">
                  <div className="ide-title">
                    <span className="window-dots">
                      <i />
                      <i />
                      <i />
                    </span>
                    {todo ? "todo-app-p2s" : "my-homepage"} · VS Code
                    <span className="tag">预设教学演示</span>
                  </div>
                  <div className="ide-body">
                    <FileTree
                      folder={todo ? "todo-app-p2s" : "my-homepage"}
                      files={files}
                      active={file}
                      onSelect={(name) => {
                        setFile(name);
                        setView("code");
                        if (todo)
                          setChange(
                            Math.max(
                              0,
                              files.findIndex((f) => f.name === name),
                            ),
                          );
                      }}
                    />
                    <div className="ide-main">
                      <Tabs value={view} onValueChange={setView}>
                        <TabsList>
                          {[
                            ["agent", "Agent"],
                            ["code", "文件"],
                            ["terminal", "终端"],
                            ["preview", "预览"],
                            ...(step === 3 ? [["diff", "改动"]] : []),
                          ].map(([id, label]) => (
                            <TabsTrigger key={id} value={id}>
                              {label}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        <TabsContent value="agent">
                          <div className="agent-panel">
                            <Prompt
                              text={
                                step === 3
                                  ? todo
                                    ? todoFeedback
                                    : goodFeedback
                                  : "按确认的计划创建或修改文件，完成后说明改了哪些地方。"
                              }
                            />
                            <div className="agent-reply">
                              <b>Agent 回复</b>
                              <p>
                                {step === 3
                                  ? "已局部修改，接下来请检查真实 Diff 和运行效果。"
                                  : "已按计划处理。请到文件区核实文件，再启动程序。"}
                              </p>
                            </div>
                            <p className="notice">
                              这条回复本身不能证明文件已经保存。点击文件区核实。
                            </p>
                          </div>
                        </TabsContent>
                        <TabsContent value="code">
                          {todo ? (
                            <>
                              <div className="change-map">
                                {[0, 1, 3, 4].map((idx, i) => (
                                  <button
                                    key={idx}
                                    aria-pressed={change === i}
                                    onClick={() => setChange(i)}
                                  >
                                    {["数据库", "接口", "表单", "列表"][i]}
                                  </button>
                                ))}
                              </div>
                              <CodeComparison
                                {...assets.todoDiffs[[0, 1, 3, 4][change] || 0]}
                                filename={
                                  todoChanges[[0, 1, 3, 4][change] || 0].file
                                }
                              />
                            </>
                          ) : file === "需求单.md" ? (
                            <div className="paper">
                              <Brief />
                            </div>
                          ) : sub === 0 && step === 2 ? (
                            <p className="empty-state">
                              index.html
                              尚未出现。下一小步，到文件区核实创建结果。
                            </p>
                          ) : (
                            <CodeView
                              html={
                                version === "v2"
                                  ? assets.sourceAfter
                                  : assets.source
                              }
                            />
                          )}
                        </TabsContent>
                        <TabsContent value="terminal">
                          <TerminalView
                            command={
                              step === 2 && sub === 3
                                ? todo
                                  ? todoCommands.commit
                                  : 'git add index.html 需求单.md\ngit commit -m "v1 初稿"'
                                : todo
                                  ? `${todoCommands.backend}\n# 另开一个集成终端运行前端：\n${todoCommands.frontend}`
                                  : runCommand
                            }
                            folder={todo ? "todo-app-p2s" : "my-homepage"}
                            executed={sub >= 2 || step === 3}
                            output={
                              step === 2 && sub === 3
                                ? `${gitEvidence.v1} v1 初稿\n工作区干净，已有第一个版本。`
                                : todo
                                  ? "后端 http://localhost:3001\n前端 http://localhost:5173"
                                  : "Serving!\nLocal: http://localhost:3000"
                            }
                            onRun={() => advance(2)}
                          >
                            <button
                              className="terminal-link"
                              onClick={() => setView("preview")}
                            >
                              {todo
                                ? "http://localhost:5173"
                                : "http://localhost:3000"}{" "}
                              → 打开示例预览
                            </button>
                          </TerminalView>
                          <p className="notice">
                            {todo
                              ? "原项目需要两个终端：前后端分别运行。修改后端后按 Ctrl+C，再重新启动。"
                              : "HTML 文件 → serve 本地服务器 → 浏览器。关闭服务后，本地地址不再可用。首次运行需联网；端口占用时以终端实际地址为准。"}
                          </p>
                        </TabsContent>
                        <TabsContent
                          value="preview"
                          forceMount
                          hidden={view !== "preview"}
                        >
                          {step === 2 && sub < 2 ? (
                            <div className="empty-state">
                              <h3>文件还没有运行</h3>
                              <p>
                                保存文件不等于程序已启动。到终端演示启动本地服务，再打开地址。
                              </p>
                              <button
                                className="button secondary"
                                onClick={() => setView("terminal")}
                              >
                                查看启动命令
                              </button>
                            </div>
                          ) : todo ? (
                            <>
                              <div className="segmented">
                                <button
                                  aria-pressed={version === "v1"}
                                  onClick={() => setVersion("v1")}
                                >
                                  修改前
                                </button>
                                <button
                                  aria-pressed={version === "v2"}
                                  onClick={() => setVersion("v2")}
                                >
                                  修改后
                                </button>
                              </div>
                              <TodoDemo
                                key={version}
                                bug
                                fixed={version === "v2"}
                              />
                            </>
                          ) : (
                            <PreviewPane
                              html={homepageVersions[version]}
                              width={width}
                              onWidthChange={setWidth}
                              version={version}
                              onVersionChange={
                                step === 3 ? setVersion : undefined
                              }
                              focus={focus}
                            />
                          )}
                        </TabsContent>
                        <TabsContent value="diff">
                          {todo && <TodoFlow />}
                          <CodeComparison
                            {...diff}
                            focus={
                              !todo && focus
                                ? {
                                    before:
                                      focus === "main"
                                        ? [10]
                                        : focus === "h1"
                                          ? [11]
                                          : [12],
                                    after:
                                      focus === "main"
                                        ? [10]
                                        : focus === "h1"
                                          ? [11]
                                          : [12, 13],
                                  }
                                : undefined
                            }
                            focusLabel={focus || undefined}
                            filename={
                              todo
                                ? "server/routes/todos.js · PUT"
                                : "index.html"
                            }
                          />
                          {!todo && (
                            <div className="change-focus">
                              {[
                                ["容器不再固定 760px", "main"],
                                ["标题字号自适应", "h1"],
                                ["手机项目改为单列", ".projects"],
                              ].map(([label, selector]) => (
                                <button
                                  key={selector}
                                  className="text-link"
                                  onClick={() => setFocus(selector)}
                                >
                                  {label} → 定位代码与效果
                                </button>
                              ))}
                            </div>
                          )}
                          {!todo && focus && (
                            <PreviewPane
                              html={homepageVersions[version]}
                              width={width}
                              onWidthChange={setWidth}
                              version={version}
                              onVersionChange={setVersion}
                              focus={focus}
                            />
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </>
            )}
            {step === 4 && (
              <div className="verification">
                <div className="section-heading">
                  <h2>
                    {sub === 0
                      ? "对照需求单，逐条检查"
                      : sub === 1
                        ? "只改了该改的地方吗？"
                        : "把能继续使用的成果交出去"}
                  </h2>
                  <span className="tag">示例结果 ≠ 本机结果</span>
                </div>
                {sub === 0 ? (
                  <>
                    <div className="check-list">
                      {checkItems.map((item, i) => (
                        <div className="check-row" key={item}>
                          <button
                            onClick={() => {
                              setFocus(
                                i === 0
                                  ? "header"
                                  : i === 1
                                    ? ".projects"
                                    : i === 2
                                      ? "footer"
                                      : "",
                              );
                              setWidth(i === 4 ? 375 : 1280);
                            }}
                          >
                            <b>{item}</b>
                            <span>{tips[i]}</span>
                          </button>
                          <span className="check-result">✓ 示例通过</span>
                          <label className="choice">
                            <input
                              aria-label={`我检查过了：${item}`}
                              type="checkbox"
                              checked={!!checks[i]}
                              onChange={(e) => checkAt(i, e.target.checked)}
                            />
                            我检查过了
                          </label>
                        </div>
                      ))}
                    </div>
                    {todo ? (
                      <details className="evidence">
                        <summary>
                          展开真实验证记录 · {evidence.checkedAt}
                        </summary>
                        <p>
                          基线 {evidence.upstream} · Node{" "}
                          {evidence.environment.node}。这些结果不是实时检查。
                        </p>
                        <p>
                          缺陷已在 v1 实际复现：只发送 completed 时，备注从“
                          {evidence.defect.before}”变为空字符串；v2
                          检查确认保留。
                        </p>
                        {evidence.checks.map((c) => (
                          <p key={c.name}>
                            {c.passed ? "✓" : "✗"} {c.name}：{c.detail}
                          </p>
                        ))}
                        <img
                          src={evidence.browser.screenshot}
                          alt="验证脚本在真实 Todo 项目中操作后的截图"
                        />
                        <a
                          href="/examples/todo-verification.json"
                          className="text-link"
                        >
                          查看完整验证 JSON
                        </a>
                      </details>
                    ) : (
                      <PreviewPane
                        html={homepageVersions.v2}
                        width={width}
                        onWidthChange={setWidth}
                        version="v2"
                        focus={focus}
                      />
                    )}
                  </>
                ) : sub === 1 ? (
                  <>
                    {todo && (
                      <>
                        <pre className="scope-list">
                          {files.map((f) => "M " + f.name).join("\n")}
                        </pre>
                        <p className="notice">
                          四个文件对应计划中的数据库、接口、表单、列表。完整改动见下载补丁；下方聚焦最后修复。
                        </p>
                      </>
                    )}
                    <CodeComparison
                      {...diff}
                      filename={
                        todo
                          ? "server/routes/todos.js · PUT"
                          : "index.html · v1 → v2"
                      }
                    />
                  </>
                ) : (
                  <>
                    <TerminalView
                      folder={todo ? "todo-app-p2s" : "my-homepage"}
                      command={
                        todo
                          ? todoCommands.commit
                          : 'git diff --check\ngit add index.html 需求单.md\ngit commit -m "v2 修复手机端横向溢出"\ngit log --oneline'
                      }
                      output={gitEvidence.log}
                      executed
                    />
                    <div className="git-timeline">
                      <GitCommit size={20} />
                      <button
                        className="text-link"
                        onClick={() => {
                          route(3);
                          setVersion("v1");
                        }}
                      >
                        v1 初稿
                      </button>
                      <span>→</span>
                      <button
                        className="text-link"
                        onClick={() => {
                          route(3);
                          setVersion("v2");
                        }}
                      >
                        v2 修复版
                      </button>
                    </div>
                    <p className="notice">
                      这是验证脚本在一次性目录中生成的真实 Git
                      记录，不是你的本机状态；你的提交哈希会不同。
                    </p>
                    <div className="delivery">
                      <h3>交付物</h3>
                      <div className="inline-actions">
                        {todo ? (
                          <a
                            className="button"
                            href="/examples/todo-notes.patch"
                            download
                          >
                            下载完整参考补丁
                          </a>
                        ) : (
                          <>
                            <a
                              className="button"
                              href="/examples/homepage-v2.html"
                              download="index.html"
                            >
                              下载 index.html
                            </a>
                            <a
                              className="button secondary"
                              href="/examples/需求单.md"
                              download
                            >
                              下载示例需求单与运行说明
                            </a>
                            <a
                              className="text-link"
                              href="/examples/homepage-history.bundle"
                              download
                            >
                              下载示例 Git 历史
                            </a>
                          </>
                        )}
                      </div>
                      <h3>
                        {todo ? "应用前确认" : "交出去之前，替换这些内容"}
                      </h3>
                      {(todo
                        ? [
                            "基线提交与案例一致，先提交你自己的修改",
                            "git apply --check 检查通过后再应用",
                            "重新运行功能、回归和范围检查",
                          ]
                        : [
                            "名字和一句话介绍",
                            "两个项目及真实链接（替换 #）",
                            "邮箱地址",
                            "头像占位（可选）",
                          ]
                      ).map((t) => (
                        <label key={t} className="choice">
                          <input type="checkbox" />
                          {t}
                        </label>
                      ))}
                      <p className="notice">
                        {todo
                          ? "补丁只用于对应基线；它不是自动生成的 Git 历史。请在自己的仓库确认并提交。"
                          : `在 my-homepage 中运行 ${runCommand}，打开终端显示的 Local 地址。Git 版本需要你按步骤在本机提交，下载不会代替版本记录。`}
                      </p>
                      <a
                        className="text-link"
                        href={todo ? "/guide/" : "/case/todo/"}
                      >
                        {todo
                          ? "回到方法速查"
                          : "继续案例二：在已有项目里改功能"}
                        <ArrowRight size={16} />
                      </a>
                      {!todo && (
                        <details>
                          <summary>怎样查看下载的 Git 历史？</summary>
                          <p>
                            在一个没有 my-homepage 的目录中，将 bundle
                            放到当前目录，执行下列命令。已有项目请继续自行提交，不要覆盖。
                          </p>
                          <pre>
                            git clone homepage-history.bundle my-homepage{"\n"}
                            cd my-homepage{"\n"}git log --oneline
                          </pre>
                        </details>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="scene-caption" role="status">
            <span>
              {String.fromCharCode(97 + sub)} / {current.actions.length}
            </span>
            {current.results[sub]}
          </div>
          <div className="mobile-sub-controls">
            <button
              className="button secondary"
              disabled={sub === 0}
              onClick={() => advance(sub - 1)}
            >
              上一小步
            </button>
            <button
              className="button"
              disabled={sub === current.actions.length - 1}
              onClick={() => advance(sub + 1)}
            >
              下一小步
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <DoneCheck
        page={page}
        id={String(step + 1)}
        criteria={current.done}
        result={
          sub === current.actions.length - 1
            ? current.results[sub]
            : "演示还在进行，继续查看下一小步。"
        }
      />
      {todo && (
        <details className="follow-along">
          <summary>在本机跟做：获取源码、运行、应用补丁</summary>
          <p>
            只在新目录执行。需要 Node.js 24、Git 和网络；不会覆盖你已有项目。
          </p>
          <Prompt text={todoCommands.prepare} />
          <p>核对 HEAD：{todoBaseline}。用 VS Code 打开 todo-app-p2s。</p>
          <TerminalView
            folder="todo-app-p2s"
            command={`${todoCommands.backend}\n# 另开终端\n${todoCommands.frontend}`}
            executed
            output="后端 :3001 · 前端 :5173"
          />
          <p>
            下载补丁放入根目录，仅在未实现备注的基线上执行。检查失败时不要强行应用。
          </p>
          <Prompt text={todoCommands.patch} />
          <Prompt text={todoCommands.verify} />
        </details>
      )}
      <div className="step-footer">
        <button disabled={step === 0} onClick={() => route(step - 1)}>
          <ArrowLeft size={16} />
          上一步
        </button>
        <span>{step + 1} / 5 · 可以随时回看</span>
        <button disabled={step === 4} onClick={() => route(step + 1)}>
          下一步
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
