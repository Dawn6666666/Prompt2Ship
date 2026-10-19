import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  CheckCheck,
  Code2,
  Download,
  FileCode2,
  FileText,
  FolderTree,
  Globe2,
  Play,
  RotateCcw,
  SkipForward,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import { TypingAnimation } from "./ui/typing-animation";
import { Accordion } from "./ui/accordion";
import { Textarea } from "./ui/textarea";
import { Browser } from "./ui/browser";
import { CodeComparison } from "./ui/code-comparison";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { CopyButton } from "./CopyButton";
import { ToolTrace } from "./ui/tool-trace";
import { toolCallsFor } from "@/data/tool-calls";

export type HighlightedStage = { before: string; after: string };
export type LessonStep = {
  label: string;
  title: string;
  hint: string;
  prompt: string;
  reply: string;
  kind:
    | "brief"
    | "plan"
    | "code"
    | "preview"
    | "diff"
    | "terminal"
    | "delivery"
    | "map"
    | "todo";
  filename?: string;
  code?: string;
  highlighted?: HighlightedStage;
  html?: string;
  items?: string[];
  lesson: string;
  detail?: ReactNode;
  action?: string;
};
const icons = {
  brief: FileText,
  plan: CheckCheck,
  code: Code2,
  preview: Globe2,
  diff: Code2,
  terminal: TerminalSquare,
  delivery: Download,
  map: FolderTree,
  todo: CheckCheck,
};

export function LessonStudio({
  steps,
  name,
  next,
  renderTodo,
  renderBrief,
}: {
  steps: LessonStep[];
  name: string;
  next: { href: string; label: string };
  renderTodo?: () => ReactNode;
  renderBrief?: (proceed: () => void) => ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [replay, setReplay] = useState(0);
  const [rounds, setRounds] = useState<Record<number, "sent" | "done">>({});
  return (
    <section className="studio" aria-label={name}>
      <div className="studio-toolbar">
        <span>
          <span className="live-dot" />
          <FolderTree size={14} /> {name}
        </span>
        <span className="simulation-label">Agent 工作区 · 教学模拟</span>
      </div>
      <nav className="scene-nav" aria-label="选择开发阶段">
        {steps.map((step, i) => (
          <button
            type="button"
            key={step.label}
            aria-current={index === i ? "step" : undefined}
            onClick={() => setIndex(i)}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {step.label}
            {index === i && (
              <motion.i
                layoutId="scene-indicator"
                transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
              />
            )}
          </button>
        ))}
      </nav>
      {index === 0 && renderBrief ? (
        renderBrief(() => {
          setRounds((value) => ({ ...value, 0: "done" }));
          setIndex(1);
        })
      ) : (
        <Scene
          key={`${index}-${replay}`}
          step={steps[index]}
          index={index}
          total={steps.length}
          steps={steps}
          rounds={rounds}
          onSend={() => setRounds((value) => ({ ...value, [index]: "sent" }))}
          onFinish={() => setRounds((value) => ({ ...value, [index]: "done" }))}
          onLocate={setIndex}
          onContinue={() => {
            setRounds((value) => ({ ...value, [index + 1]: "sent" }));
            setIndex(index + 1);
          }}
          onReplay={() => {
            setRounds((value) => {
              const updated = { ...value };
              delete updated[index];
              return updated;
            });
            setReplay(replay + 1);
          }}
          onPrevious={() => setIndex(index - 1)}
          onNext={() => setIndex(index + 1)}
          next={next}
          renderTodo={renderTodo}
        />
      )}
    </section>
  );
}

function Scene({
  step,
  index,
  total,
  onReplay,
  onPrevious,
  onNext,
  next,
  renderTodo,
  steps,
  rounds,
  onSend,
  onFinish,
  onLocate,
  onContinue,
}: {
  step: LessonStep;
  index: number;
  total: number;
  onReplay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  next: { href: string; label: string };
  renderTodo?: () => ReactNode;
  steps: LessonStep[];
  rounds: Record<number, "sent" | "done">;
  onSend: () => void;
  onFinish: () => void;
  onLocate: (index: number) => void;
  onContinue: () => void;
}) {
  const [phase, setPhase] = useState<
    "idle" | "thinking" | "reply" | "tools" | "artifact" | "done"
  >(
    rounds[index] === "done"
      ? "done"
      : rounds[index] === "sent"
        ? "thinking"
        : "idle",
  );
  const [tab, setTab] = useState(
    rounds[index] === "done" && step.html ? "preview" : "code",
  );
  const messagesRef = useRef<HTMLDivElement>(null);
  const [mobileSeen, setMobileSeen] = useState(false);
  const [mobileView, setMobileView] = useState("talk");
  const reduce = useReducedMotion();
  const Icon = icons[step.kind];
  const busy = phase !== "idle" && phase !== "done";
  const visible = phase === "artifact" || phase === "done";
  const promptStep =
    phase === "done" && index < total - 1 ? steps[index + 1] : step;
  const isCode =
    step.kind === "code" || step.kind === "diff" || step.kind === "terminal";
  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;
    const scroll = () => {
      container.scrollTop = container.scrollHeight;
    };
    scroll();
    const observer = new MutationObserver(scroll);
    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, [index]);
  useEffect(() => {
    if (phase === "thinking") {
      const timer = setTimeout(() => setPhase("tools"), reduce ? 0 : 700);
      return () => clearTimeout(timer);
    }
    if (phase === "artifact" && !isCode) {
      const timer = setTimeout(
        () => {
          setPhase("done");
          onFinish();
        },
        reduce ? 0 : 700,
      );
      return () => clearTimeout(timer);
    }
  }, [phase, isCode, reduce, onFinish]);
  function finish() {
    setPhase("done");
    onFinish();
    if (step.html && step.kind !== "preview") setTab("preview");
  }
  const codePanel = (
    <div
      className={`stream-editor ${step.kind === "terminal" ? "terminal-editor" : ""}`}
    >
      <div className="editor-title">
        <FileCode2 size={14} />
        <span>{step.filename || "终端 · 教学命令，未实际执行"}</span>
        <span>{phase === "artifact" ? "● 正在输出" : "已生成"}</span>
      </div>
      {phase === "artifact" ? (
        <pre className="stream-code">
          <TypingAnimation text={step.code || ""} code onComplete={finish} />
        </pre>
      ) : step.highlighted ? (
        <div
          className="highlighted-code"
          dangerouslySetInnerHTML={{ __html: step.highlighted.after }}
        />
      ) : (
        <pre className="stream-code">{step.code}</pre>
      )}
    </div>
  );

  return (
    <>
      <div className="scene-heading">
        <div>
          <span className="eyebrow">
            STEP {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
          <h2>{step.title}</h2>
        </div>
        <button className="quiet-button" onClick={onReplay} type="button">
          <RotateCcw size={14} />
          重播本步
        </button>
      </div>
      <div className="scene-mobile-switch" role="group" aria-label="工作区视图">
        <button
          aria-pressed={mobileView === "talk"}
          onClick={() => setMobileView("talk")}
        >
          对话与工具
        </button>
        <button
          aria-pressed={mobileView === "result"}
          onClick={() => setMobileView("result")}
        >
          本步成果{visible ? " · 已更新" : ""}
        </button>
      </div>
      <div className="scene-grid" data-mobile-view={mobileView}>
        <div className="conversation">
          <div className="conversation-label">
            <Sparkles size={14} /> Agent{" "}
            <span>同一会话 · {Object.keys(rounds).length} 轮对话</span>
          </div>
          <div className="messages" ref={messagesRef} aria-label="多轮对话记录">
            <div className="session-start">
              <span>新会话</span>以小步修改，完成一个真实任务
            </div>
            {steps.map((previous, round) =>
              round < index && rounds[round] ? (
                <div className="history-round" key={round}>
                  <div className="sent-message">
                    <span className="message-author">
                      你 <small>#{String(round + 1).padStart(2, "0")}</small>
                    </span>
                    <p>{previous.prompt}</p>
                  </div>
                  <div className="ai-message">
                    <span className="message-author">
                      <Sparkles size={13} /> Agent
                    </span>
                    {rounds[round] === "done" ? (
                      <>
                        {previous.kind !== "brief" && (
                          <ToolTrace calls={toolCallsFor(previous)} complete />
                        )}
                        <p>{previous.reply}</p>
                      </>
                    ) : (
                      <p>该轮回放已暂停，点击下方返回继续。</p>
                    )}
                    <button
                      type="button"
                      className="tool-call"
                      onClick={() => onLocate(round)}
                    >
                      <FileCode2 size={14} />
                      <span>{previous.filename || previous.label}</span>
                      {rounds[round] === "done" ? (
                        <Check size={13} />
                      ) : (
                        <Play size={13} />
                      )}
                      <span>
                        {rounds[round] === "done" ? "查看结果" : "继续回放"}
                      </span>
                    </button>
                  </div>
                </div>
              ) : null,
            )}
            {phase === "idle" &&
            index === 0 &&
            Object.keys(rounds).length === 0 ? (
              <div className="conversation-welcome">
                <span className="agent-mark">
                  <Sparkles size={21} />
                </span>
                <h3>{step.hint}</h3>
                <p>从下面这条提示词开始。</p>
              </div>
            ) : phase !== "idle" ? (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="sent-message"
              >
                <span className="message-author">你</span>
                <p>{step.prompt}</p>
              </motion.div>
            ) : (
              <div className="next-round-marker">
                <span>#{String(index + 1).padStart(2, "0")}</span>
                {step.hint}
              </div>
            )}
            {phase !== "idle" && phase !== "thinking" && (
              <>
                <div className="ai-message">
                  <span className="message-author">
                    <Sparkles size={13} /> Agent
                  </span>
                  <p>
                    {step.kind === "diff"
                      ? "先读取相关代码，定位需要修改的位置，再应用最小补丁。"
                      : step.kind === "preview"
                        ? "先启动预览，再分别检查桌面和手机视口。"
                        : step.kind === "terminal"
                          ? "先检查 Git 差异，再列出需要你确认的验收项，不直接提交。"
                          : step.kind === "code"
                            ? "按确认的计划创建页面，然后把生成的文件展示给你。"
                            : "先整理这一步需要的信息，再给出结果。"}
                  </p>
                </div>
                <ToolTrace
                  calls={toolCallsFor(step)}
                  complete={phase !== "tools"}
                  onComplete={() => setPhase("reply")}
                />
              </>
            )}
            <AnimatePresence mode="wait">
              {phase === "thinking" && (
                <motion.div
                  key="thinking"
                  className="thinking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  role="status"
                >
                  <Sparkles size={15} />
                  <span className="thinking-dots">···</span>正在分析这一步
                </motion.div>
              )}
              {phase !== "idle" &&
                phase !== "thinking" &&
                phase !== "tools" && (
                  <motion.div
                    key="reply"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ai-message"
                  >
                    <span className="message-author">
                      <Sparkles size={13} /> Agent
                    </span>
                    <p>
                      {phase === "reply" ? (
                        <TypingAnimation
                          text={step.reply}
                          onComplete={() => setPhase("artifact")}
                        />
                      ) : (
                        step.reply
                      )}
                    </p>
                  </motion.div>
                )}
            </AnimatePresence>
            {phase === "done" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="tool-result"
              >
                <Check size={14} />
                <span>{step.filename || step.label}</span>
                <small>已完成 · 结果在右侧</small>
              </motion.div>
            )}
          </div>
          <div className="composer-area">
            {phase === "idle" || (phase === "done" && index < total - 1) ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (phase === "done") {
                    onContinue();
                    return;
                  }
                  onSend();
                  setPhase("thinking");
                }}
                className="composer"
              >
                <label htmlFor="lesson-prompt">
                  继续对话 <span>预设教学提示词 · 不调用模型</span>
                </label>
                <Textarea
                  id="lesson-prompt"
                  value={promptStep.prompt}
                  readOnly
                  rows={3}
                />
                <div>
                  <CopyButton text={promptStep.prompt} label="复制" />
                  <button className="send-button" type="submit">
                    {phase === "done"
                      ? "发送下一轮"
                      : step.action || "发送提示词"}
                    <ArrowUp size={16} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="playback-controls">
                <span role="status">
                  {phase === "done" ? (
                    <>
                      <Check size={14} /> 本步演示完成
                    </>
                  ) : (
                    <>
                      <span className="live-dot" />
                      {phase === "tools"
                        ? "正在调用工具…"
                        : phase === "artifact"
                          ? "正在生成结果…"
                          : "AI 正在响应…"}
                    </>
                  )}
                </span>
                {busy && (
                  <button
                    type="button"
                    className="quiet-button"
                    onClick={finish}
                  >
                    <SkipForward size={14} />
                    跳过动画
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div
          className="artifact-area"
          aria-label="本步运行结果"
          aria-busy={busy}
        >
          {!visible ? (
            <div className="artifact-placeholder">
              <div className="placeholder-icon">
                <Icon size={29} strokeWidth={1.3} />
              </div>
              <span className="eyebrow">
                {phase === "idle"
                  ? "WAITING FOR YOUR PROMPT"
                  : "WORK IN PROGRESS"}
              </span>
              <h3>
                {phase === "idle"
                  ? "由你的下一步，推动它发生。"
                  : phase === "thinking"
                    ? "先理解，再动手。"
                    : "正在把想法变成结果…"}
              </h3>
              <p>
                {phase === "idle"
                  ? "发送提示词后，在这里看见变化。"
                  : "对话、代码与预览会依次接力。"}
              </p>
              <div className="placeholder-flow">
                <FileText size={17} />
                <span />
                <Code2 size={17} />
                <span />
                <Globe2 size={17} />
              </div>
            </div>
          ) : (
            <motion.div
              className="artifact-content"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {(step.kind === "brief" ||
                step.kind === "plan" ||
                step.kind === "map") && (
                <div
                  className={`generated-document ${step.kind === "map" ? "project-document" : ""}`}
                >
                  <div className="document-caption">
                    <Icon size={15} />
                    {step.filename || "工作计划"}
                    <span>由对话整理</span>
                  </div>
                  <h3>
                    {step.kind === "brief"
                      ? "把愿望，变成可以验收的事。"
                      : step.kind === "map"
                        ? "只沿着这条数据链改动。"
                        : "一个文件，五个小步骤。"}
                  </h3>
                  <ol>
                    {step.items?.map((item, i) => (
                      <motion.li
                        key={item}
                        initial={reduce ? false : { opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: reduce ? 0 : i * 0.12 }}
                      >
                        <span>
                          {step.kind === "brief" ? (
                            <Check size={14} />
                          ) : (
                            String(i + 1).padStart(2, "0")
                          )}
                        </span>
                        {item}
                      </motion.li>
                    ))}
                  </ol>
                  <div className="document-stamp">
                    <CheckCheck size={16} />
                    范围清楚，再开始实现。
                  </div>
                </div>
              )}
              {isCode &&
                (step.html && phase === "done" ? (
                  <Tabs value={tab} onValueChange={setTab}>
                    <TabsList aria-label="查看生成结果">
                      <TabsTrigger value="preview">
                        <Globe2 size={14} />
                        页面预览
                      </TabsTrigger>
                      <TabsTrigger value="code">
                        <Code2 size={14} />
                        {step.kind === "diff" ? "修改差异" : "生成代码"}
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview">
                      <Browser
                        html={step.html}
                        stage={index}
                        initialMobile={step.kind === "diff"}
                      />
                    </TabsContent>
                    <TabsContent value="code">
                      {step.kind === "diff" && step.highlighted ? (
                        <CodeComparison
                          {...step.highlighted}
                          filename={step.filename || "index.html"}
                        />
                      ) : (
                        codePanel
                      )}
                    </TabsContent>
                  </Tabs>
                ) : (
                  codePanel
                ))}
              {step.kind === "preview" && (
                <>
                  <Browser
                    html={step.html || ""}
                    stage={index}
                    onViewportChange={(mobile) => setMobileSeen(mobile)}
                  />
                  <div
                    className={`preview-discovery ${mobileSeen ? "discovered" : ""}`}
                  >
                    <span>{mobileSeen ? "!" : "↗"}</span>
                    <div>
                      <strong>
                        {mobileSeen
                          ? "发现：页面超出了手机宽度。"
                          : "轮到你：点浏览器右上角的手机图标。"}
                      </strong>
                      <p>
                        {mobileSeen
                          ? "固定 760px 容器塞不进 375px 视口。下一步，把这个具体问题反馈给 AI。"
                          : "不要只看桌面。检查一下，手机里还是完整的吗？"}
                      </p>
                    </div>
                  </div>
                </>
              )}
              {step.kind === "terminal" && phase === "done" && (
                <div className="terminal-disclaimer">
                  <Check size={14} />
                  这是命令回放，不代表在你的机器上验证通过。
                </div>
              )}
              {step.kind === "diff" &&
                !step.html &&
                phase === "done" &&
                step.highlighted && (
                  <Accordion
                    items={[
                      {
                        title: "展开修改前 / 修改后对比",
                        content: (
                          <CodeComparison
                            {...step.highlighted}
                            filename={step.filename || "关键片段"}
                          />
                        ),
                      },
                    ]}
                  />
                )}
              {step.kind === "delivery" && (
                <div className="delivery">
                  <span className="delivery-check">
                    <CheckCheck size={30} />
                  </span>
                  <span className="eyebrow">READY TO MAKE IT YOURS</span>
                  <h3>从一句话，到一份真实文件。</h3>
                  <p>一个 HTML 文件，包含页面和响应式样式。</p>
                  <a
                    className="download-file"
                    href="/examples/folio.html"
                    download="index.html"
                  >
                    <FileCode2 size={25} />
                    <span>
                      <strong>index.html</strong>
                      <small>HTML + CSS · 无外部依赖</small>
                    </span>
                    <Download size={20} />
                  </a>
                  <p className="delivery-note">
                    发布前，换成你的姓名、作品与真实邮箱。
                  </p>
                  <a
                    href="/examples/folio.html"
                    target="_blank"
                    rel="noreferrer"
                    className="quiet-button"
                  >
                    <Globe2 size={14} />
                    独立打开成品 <ArrowRight size={14} />
                  </a>
                </div>
              )}
              {step.kind === "todo" && renderTodo?.()}
            </motion.div>
          )}
        </div>
      </div>
      <div className="scene-footer">
        <button
          type="button"
          className="quiet-button"
          onClick={onPrevious}
          disabled={index === 0}
        >
          <ArrowLeft size={14} />
          上一步
        </button>
        <span>
          {phase === "idle"
            ? "发送一次，看看会发生什么。"
            : busy
              ? "可以跳过动画，也可以自由切换阶段。"
              : "看到了结果，再继续下一步。"}
        </span>
        {index === total - 1 ? (
          <a className="primary-button" href={next.href}>
            {next.label}
            <ArrowRight size={15} />
          </a>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className={phase === "done" ? "primary-button" : "quiet-button"}
          >
            {phase === "done" ? "继续下一步" : "下一步"}
            <ArrowRight size={15} />
          </button>
        )}
      </div>
      <div className="studio-details">
        <Accordion
          items={[
            {
              title: "为什么这样做？ / 提示词与操作说明",
              content: (
                <>
                  <p>{step.lesson}</p>
                  {step.detail}
                  <p className="detail-disclaimer">
                    预设教学回放，不调用
                    AI、不执行命令。可复制提示词，在自己的工具中实践。
                  </p>
                </>
              ),
            },
          ]}
        />
      </div>
    </>
  );
}
