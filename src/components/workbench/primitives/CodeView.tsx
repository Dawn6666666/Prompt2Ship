import { useEffect, useRef } from "react";
import { FileCode } from "lucide-react";
import { Copy } from "../../ui/window/CopyButton";

export function CodeView({
  html,
  title = "index.html",
  source,
  lines = [],
}: {
  html: string;
  title?: string;
  source?: string;
  lines?: number[];
}) {
  const code = useRef<HTMLDivElement>(null);
  const lineKey = lines.join(",");
  useEffect(() => {
    const nodes = code.current?.querySelectorAll<HTMLElement>(".line");
    nodes?.forEach((el, i) =>
      el.classList.toggle("is-code-focused", lines.includes(i + 1)),
    );
    if (lines.length)
      nodes?.[lines[0] - 1]?.scrollIntoView({ block: "nearest" });
  }, [html, lineKey]);
  return (
    <div className="code-view">
      <div className="block-label">
        <span>
          <FileCode size={15} />
          {title}
        </span>
        {source ? <Copy text={source} label="复制代码" /> : <span>已保存</span>}
      </div>
      <div
        className="highlighted-code"
        ref={code}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
