import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronRight,
  Code2,
  Download,
  Lightbulb,
  MessageSquareText,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import { stages, portfolioHtml } from "@/data/course";
import { CopyButton } from "./CopyButton";
import { Browser } from "./ui/browser";
import { Terminal } from "./ui/terminal";
import { CodeComparison } from "./ui/code-comparison";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

export type HighlightedStage = { before: string; after: string };
export function CaseWorkbench({
  highlighted,
  compact = false,
}: {
  highlighted: HighlightedStage[];
  compact?: boolean;
}) {
  const [step, setStep] = useState(compact ? 4 : 0);
  const reduce = useReducedMotion();
  const stage = stages[step];
  return (
    <div className={`workbench ${compact ? "compact-workbench" : ""}`}>
      <div className="workbench-top">
        <div>
          <span className="live-dot" />
          <strong>
            {compact ? "开发过程，不再是黑盒。" : "林间的个人网站"}
          </strong>
          <span className="workbench-project">INTERACTIVE WORKSPACE</span>
        </div>
        <span className="workbench-number">
          {String(step + 1).padStart(2, "0")} <span>/ 07</span>
        </span>
      </div>
      <div className="stage-nav" aria-label="开发阶段">
        {stages.map((s, i) => (
          <button
            type="button"
            key={s.en}
            className={i === step ? "current" : ""}
            aria-pressed={step === i}
            onClick={() => setStep(i)}
          >
            <span className="step-number">
              {i < step ? <Check size={11} /> : String(i + 1).padStart(2, "0")}
            </span>
            <span>{s.name}</span>
            {i < 6 && <ChevronRight className="stage-chevron" size={11} />}
          </button>
        ))}
      </div>
      <motion.div
        key={step}
        initial={reduce ? false : { opacity: 0.5, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {!compact && (
          <div className="stage-intro">
            <span className="eyebrow">
              STEP {String(step + 1).padStart(2, "0")} /{" "}
              {stage.en.toUpperCase()}
            </span>
            <h2>{stage.title}</h2>
            <p>{stage.goal}</p>
          </div>
        )}
        <div className="workspace-grid">
          <div className="prompt-column">
            <div className="panel-heading">
              <span>
                <MessageSquareText size={14} /> 这一次，怎样提问
              </span>
              <span className="micro-label">PROMPT</span>
            </div>
            <div className="prompt-card">
              <div className="prompt-user">
                <span className="avatar">我</span>
                <span>你发给 AI 的指令</span>
                <span className="prompt-dot">···</span>
              </div>
              <p>{stage.prompt}</p>
              <CopyButton text={stage.prompt} />
            </div>
            <div className="agent-response">
              <span className="agent-icon">
                <Sparkles size={13} />
              </span>
              <div>
                <strong>Agent 的思路</strong>
                <p>{stage.reply}</p>
              </div>
            </div>
            <div className="lesson-note">
              <Lightbulb size={15} />
              <p>{stage.lesson}</p>
            </div>
          </div>
          <div className="result-column">
            <Tabs defaultValue="preview">
              <div className="result-tabs-row">
                <TabsList aria-label="查看开发结果">
                  <TabsTrigger value="preview">
                    <MousePointer2 size={13} />
                    网页预览
                  </TabsTrigger>
                  <TabsTrigger value="code">
                    <Code2 size={14} />
                    代码变更
                  </TabsTrigger>
                </TabsList>
                <span className="linked-label">
                  <span />
                  随阶段联动
                </span>
              </div>
              <TabsContent value="preview">
                <Browser html={portfolioHtml(step)} stage={step} />
              </TabsContent>
              <TabsContent value="code">
                <CodeComparison
                  {...highlighted[step]}
                  filename={stage.filename}
                />
              </TabsContent>
            </Tabs>
            <Terminal command={stage.command} output={stage.output} />
          </div>
        </div>
      </motion.div>
      <div className="workbench-bottom">
        <span>
          <span className={`status-dot ${step === 3 ? "warning" : ""}`} />
          {stage.result}
        </span>
        <div>
          {compact ? (
            <a href="/case/from-scratch">
              进入完整案例 <ArrowRight size={14} />
            </a>
          ) : (
            <>
              <button
                type="button"
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft size={14} /> 上一步
              </button>
              {step === 6 ? (
                <a href="/examples/folio.html" download="index.html">
                  <Download size={14} /> 下载完整页面
                </a>
              ) : (
                <button
                  className="next-step"
                  type="button"
                  onClick={() => setStep(step + 1)}
                >
                  下一步 <ArrowRight size={14} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
