// Adapted from Magic UI CodeComparison (MIT). Diff and Shiki run at build time.
import { useEffect, useRef, useState } from "react";
import { Columns2, FileCode2, List } from "lucide-react";
import { Copy } from "../workbench/Primitives";
export function CodeComparison({
  before,
  after,
  filename,
  unified,
  additions,
  deletions,
  focus,
  focusLabel,
  beforeSource,
  afterSource,
  compact = false,
}: {
  before: string;
  after: string;
  filename: string;
  unified?: string;
  additions?: number;
  deletions?: number;
  focus?: { before: readonly number[]; after: readonly number[] };
  focusLabel?: string;
  beforeSource?: string;
  afterSource?: string;
  compact?: boolean;
}) {
  const [split, setSplit] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = root.current;
    if (!container) return;
    container
      .querySelectorAll(".line.is-code-focused")
      .forEach((line) => line.classList.remove("is-code-focused"));
    if (!focus) return;
    const selector = [
      ...focus.before.map((line) => `.line[data-before-line="${line}"]`),
      ...focus.after.map((line) => `.line[data-after-line="${line}"]`),
    ].join(",");
    if (!selector) return;
    container.querySelectorAll<HTMLElement>(selector).forEach((line) => {
      line.classList.add("is-code-focused");
      const scroller = line.closest("pre");
      if (scroller)
        scroller.scrollTop = Math.max(
          0,
          line.offsetTop - scroller.offsetTop - 64,
        );
    });
  }, [focus, split, before, after, unified]);
  return (
    <div
      className={`code-comparison${compact && !expanded ? " code-compact" : ""}`}
      ref={root}
    >
      <div className="file-heading">
        <FileCode2 size={14} />
        <span>{filename}</span>
        {additions !== undefined && (
          <span className="diff-count">
            <b>+{additions}</b>
            <em>−{deletions}</em>
          </span>
        )}
        <div className="code-mode">
          {beforeSource !== undefined && (
            <Copy text={beforeSource} label="复制修改前片段" />
          )}
          {afterSource !== undefined && (
            <Copy text={afterSource} label="复制修改后片段" />
          )}
          <button
            type="button"
            onClick={() => setSplit(false)}
            aria-pressed={!split}
            aria-label="统一差异视图"
          >
            <List size={15} />
          </button>
          <button
            type="button"
            onClick={() => setSplit(true)}
            aria-pressed={split}
            aria-label="并排代码视图"
          >
            <Columns2 size={15} />
          </button>
        </div>
      </div>
      {compact && (
        <p className="code-context-note">
          只看与备注有关的局部改动；未展示的原代码保持不变。片段不是完整文件，完整可应用内容见交付补丁。
        </p>
      )}
      {focusLabel && (
        <p className="code-focus-label" role="status">
          已定位：{focusLabel} · 切换视图保留关注项
        </p>
      )}
      {compact && (
        <button
          className="text-link code-expand"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "收起局部代码" : "展开完整局部改动"}
        </button>
      )}
      {!split && unified ? (
        <div
          className="highlighted-code"
          dangerouslySetInnerHTML={{ __html: unified }}
        />
      ) : (
        <div className="code-columns">
          <section>
            <div className="code-label">修改前</div>
            <div
              className="highlighted-code"
              dangerouslySetInnerHTML={{ __html: before }}
            />
          </section>
          <section>
            <div className="code-label">修改后</div>
            <div
              className="highlighted-code"
              dangerouslySetInnerHTML={{ __html: after }}
            />
          </section>
        </div>
      )}
    </div>
  );
}
