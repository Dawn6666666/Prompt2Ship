// Adapted from Magic UI CodeComparison (MIT). Shiki runs at build time,
// instead of shipping the highlighter and grammars to the browser.
import { FileCode2 } from "lucide-react";
export function CodeComparison({
  before,
  after,
  filename,
}: {
  before: string;
  after: string;
  filename: string;
}) {
  return (
    <div className="code-comparison">
      <div className="file-heading">
        <FileCode2 size={14} />
        <span>{filename}</span>
        <span className="code-hint">关键片段</span>
      </div>
      <div className="code-columns">
        <section>
          <div className="code-label">
            修改前 <span>BEFORE</span>
          </div>
          <div
            className="highlighted-code"
            dangerouslySetInnerHTML={{ __html: before }}
          />
        </section>
        <section>
          <div className="code-label">
            当前阶段 <span>AFTER</span>
          </div>
          <div
            className="highlighted-code"
            dangerouslySetInnerHTML={{ __html: after }}
          />
        </section>
      </div>
    </div>
  );
}
