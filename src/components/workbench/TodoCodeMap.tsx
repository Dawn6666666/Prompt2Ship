import { useEffect, useState } from "react";
import { CodeComparison } from "../ui/code-comparison";
import { projectFiles } from "../../data/project-map";
import { todoChanges } from "../../data/todo";
import type { HighlightPair } from "../../lib/highlight";

export function TodoCodeMap({
  file,
  onFileChange,
  pairs,
  version,
}: {
  file: string;
  onFileChange: (file: string) => void;
  pairs: HighlightPair[];
  version: "v1" | "v2";
}) {
  const [method, setMethod] = useState<"POST" | "PUT">("POST");
  useEffect(() => setMethod("POST"), [file]);
  const indexes = [0, 1, 3, 4];
  const current = indexes.findIndex(
    (index) => todoChanges[index].file.split(" · ")[0] === file,
  );
  const retained = projectFiles.find(
    (entry) => entry.name === file && !entry.change,
  );
  const index =
    current === 1 && method === "PUT" ? 2 : indexes[Math.max(0, current)];
  return (
    <div className="todo-code-map">
      <div className="change-map" aria-label="四处改动地图">
        {indexes.map((index, i) => (
          <button
            key={index}
            aria-pressed={current === i}
            onClick={() =>
              onFileChange(todoChanges[index].file.split(" · ")[0])
            }
          >
            {["数据库", "接口", "表单", "列表"][i]}{" "}
            <span aria-label="示例文件已保存">●</span>
          </button>
        ))}
      </div>
      {retained ? (
        <div className="notice" role="status">
          <h3>{retained.name}</h3>
          <p>{retained.role}</p>
          <p>
            {retained.reason} 本次保持不动，不会把其他文件的改动冒充为它的代码。
          </p>
        </div>
      ) : (
        <>
          <div className="section-heading">
            <span className="tag">{version} · 局部片段</span>
            {current === 1 && (
              <div className="segmented" aria-label="接口操作">
                <button
                  aria-pressed={method === "POST"}
                  onClick={() => setMethod("POST")}
                >
                  POST 新建
                </button>
                <button
                  aria-pressed={method === "PUT"}
                  onClick={() => setMethod("PUT")}
                >
                  PUT 更新
                </button>
              </div>
            )}
          </div>
          <CodeComparison
            key={`${index}:${version}`}
            {...pairs[index]}
            filename={todoChanges[index].file}
            compact
          />
          {current === 1 && method === "PUT" && (
            <p className="notice">
              {version === "v1"
                ? "这是待验证的初稿。未传 notes 会怎样？下一步用原有的“完成”操作检查，而不是只相信新增成功。"
                : "修复后的更新逻辑：没传 notes 时保留旧值，明确传空字符串时才清空。"}
            </p>
          )}
        </>
      )}
    </div>
  );
}
