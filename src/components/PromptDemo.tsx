import { useState } from "react";
import {
  ArrowRight,
  ArrowUp,
  Check,
  Code2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { portfolioHtml } from "@/data/course";
import { TypingAnimation } from "./ui/typing-animation";
import { Browser } from "./ui/browser";
const demoCode = `<!doctype html>
<html lang="zh-CN">
  <head>
    <title>林间 — 独立设计师</title>
    <style>
      main { max-width: 760px; margin: auto; }
      h1 { font-size: clamp(38px, 8vw, 64px); }
      .projects { display: grid; gap: 18px; }
    </style>
  </head>
  <body>
    <h1>让复杂的事情，变得简单一点。</h1>
    <!-- 个人介绍 · 精选作品 · 邮件联系 -->
  </body>
</html>`;
export function PromptDemo() {
  const [phase, setPhase] = useState<"idle" | "code" | "preview">("idle");
  const reduce = useReducedMotion();
  return (
    <div className="home-demo">
      <div className="demo-chat">
        <div className="conversation-label">
          <Sparkles size={15} />
          一次小小的开始<span>教学回放</span>
        </div>
        <div className="demo-chat-body">
          <span className="eyebrow">YOU → AI → SOMETHING REAL</span>
          <h2>
            一句想法，
            <br />
            接下来会发生什么？
          </h2>
          {phase === "idle" ? (
            <p>点击发送，看代码如何变成一个页面。</p>
          ) : (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="demo-response"
            >
              <Check size={15} />
              {phase === "code"
                ? "正在生成页面代码…"
                : "第一版出现了。但这只是开始。"}
            </motion.p>
          )}
          <div className="demo-prompt">
            帮独立设计师「林间」做一个温暖简洁的个人网站。
            <button
              type="button"
              onClick={() => setPhase("code")}
              disabled={phase !== "idle"}
              aria-label="发送示例提示词"
            >
              <ArrowUp size={19} />
            </button>
          </div>
          {phase === "preview" && (
            <a className="demo-continue" href="/case/from-scratch">
              进入完整案例，继续迭代
              <ArrowRight size={14} />
            </a>
          )}
        </div>
      </div>
      <div className="demo-result">
        {phase === "idle" ? (
          <div className="demo-idle">
            <div className="demo-window-top">
              <i />
              <i />
              <i />
              <span>your-first-idea.html</span>
            </div>
            <div className="demo-wireframe">
              <div />
              <div />
              <span />
              <section>
                <i />
                <i />
              </section>
              <small>这里，等待你的第一条提示词。</small>
            </div>
            <span className="demo-floating-tag">
              <Code2 size={13} />
              从想法到可见
            </span>
          </div>
        ) : phase === "code" ? (
          <div className="stream-editor">
            <div className="editor-title">
              <Code2 size={14} />
              index.html<span>示意片段 · 流式生成</span>
            </div>
            <pre className="stream-code">
              <TypingAnimation
                text={demoCode}
                code
                onComplete={() => setPhase("preview")}
              />
            </pre>
          </div>
        ) : (
          <>
            <Browser html={portfolioHtml(6)} stage={6} />
            <button
              className="demo-replay quiet-button"
              type="button"
              onClick={() => setPhase("idle")}
            >
              <RotateCcw size={12} />
              重播
            </button>
          </>
        )}
      </div>
    </div>
  );
}
