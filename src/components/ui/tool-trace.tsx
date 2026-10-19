import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  Check,
  ChevronRight,
  LoaderCircle,
  TerminalSquare,
} from "lucide-react";
import type { ToolCall } from "@/data/tool-calls";
import { TypingAnimation } from "./typing-animation";

export function ToolTrace({
  calls,
  complete = false,
  onComplete,
}: {
  calls: ToolCall[];
  complete?: boolean;
  onComplete?: () => void;
}) {
  const [cursor, setCursor] = useState(0);
  const [output, setOutput] = useState(false);
  const callback = useRef(onComplete);
  callback.current = onComplete;
  const reduced = useReducedMotion();
  useEffect(() => {
    if (complete) return;
    if (cursor === calls.length) {
      callback.current?.();
      return;
    }
    const timer = setTimeout(() => setOutput(true), reduced ? 0 : 650);
    return () => clearTimeout(timer);
  }, [cursor, complete, calls.length, reduced]);
  return (
    <div className="tool-trace" aria-label="工具调用回放">
      <div className="trace-label">
        <TerminalSquare size={12} /> 工具调用 <span>预设轨迹 · 未实际执行</span>
      </div>
      {calls.map((call, i) => {
        const done = complete || i < cursor;
        const active = !complete && i === cursor;
        if (!done && !active) return null;
        return (
          <details
            className={`trace-call ${active ? "is-running" : ""}`}
            key={`${i}-${done}`}
            open={active || undefined}
          >
            <summary>
              <ChevronRight className="trace-chevron" size={13} />
              {done ? (
                <Check size={13} />
              ) : (
                <LoaderCircle className="trace-spinner" size={13} />
              )}
              <code>{call.name}</code>
              <span>{call.target}</span>
              <small>{done ? "已返回" : output ? "返回中" : "调用中"}</small>
            </summary>
            <div className="trace-body">
              <span className="trace-section-label">参数 / 操作</span>
              <pre>{call.input}</pre>
              <span className="trace-section-label">预设返回</span>
              <pre className="trace-output">
                {done ? (
                  call.output
                ) : output ? (
                  <TypingAnimation
                    text={call.output}
                    code
                    onComplete={() => {
                      setOutput(false);
                      setCursor(i + 1);
                    }}
                  />
                ) : (
                  <span className="trace-wait">等待工具返回…</span>
                )}
              </pre>
              {(done || output) && call.note && <p>{call.note}</p>}
            </div>
          </details>
        );
      })}
    </div>
  );
}
