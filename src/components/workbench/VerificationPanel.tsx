import { useState, type RefObject } from "react";
import { acceptanceChecks, requirementSpec } from "../../data/acceptance";
import { homepageVersions } from "../../data/homepage";
import evidence from "../../data/todo-evidence.json";
import { CodeStructure } from "./CodeStructure";
import { FileTree } from "./Primitives";
import { PreviewPane, type PreviewPosition } from "./PreviewPane";
export function VerificationPanel({
  todo,
  checks,
  onCheck,
  onInspect,
  width,
  onWidthChange,
  source,
  position,
}: {
  todo: boolean;
  checks: boolean[];
  onCheck: (index: number, value: boolean) => void;
  onInspect: (id: string, row: number) => void;
  width: number;
  onWidthChange: (width: number) => void;
  source: string;
  position: RefObject<PreviewPosition>;
}) {
  const items = acceptanceChecks(todo),
    [selected, setSelected] = useState("");
  const current = items.find((item) => item.id === selected);
  return (
    <>
      <div className="check-list">
        {items.map((item, i) => (
          <div className="check-row" key={item.id}>
            <button
              aria-pressed={selected === item.id}
              onClick={() => {
                setSelected(item.id);
                onInspect(item.id, item.row);
                if (item.width) onWidthChange(item.width);
              }}
            >
              <b>{item.label}</b>
              <span>{item.how}</span>
              <small>来自需求单：{requirementSpec(todo)[item.row].label}</small>
            </button>
            <span className="check-result">
              {selected === item.id ? "正在查看依据" : "查看示例依据 →"}
            </span>
            <label className="choice">
              <input
                aria-label={`我检查过了：${item.label}`}
                type="checkbox"
                checked={!!checks[i]}
                onChange={(e) => onCheck(i, e.target.checked)}
              />
              我检查过了
            </label>
          </div>
        ))}
      </div>
      <div className="check-observation" aria-live="polite">
        {current && (
          <>
            <h3>检查依据 · {current.label}</h3>
            <p>{current.how}</p>
          </>
        )}
        {todo ? (
          current ? (
            <div className="paper evidence-focus" data-check={current.id}>
              <b>真实验证记录 · {evidence.checkedAt} · 非本机实时结果</b>
              {evidence.checks
                .filter((check) => current.evidenceNames?.includes(check.name))
                .map((check) => (
                  <p key={check.name}>
                    {check.passed ? "✓" : "✗"} {check.name}：{check.detail}
                  </p>
                ))}
              {current.target === "scope" ? (
                <pre>
                  {evidence.git.changedFiles
                    .map((file) => "M " + file)
                    .join("\n")}
                </pre>
              ) : (
                <>
                  <b>浏览器实际操作</b>
                  {evidence.browser.steps
                    .filter((step) =>
                      current.id === "category"
                        ? /分类|优先级/.test(step)
                        : current.id === "filter"
                          ? /筛选|拖拽/.test(step)
                          : current.id === "complete"
                            ? /完成/.test(step)
                            : current.id === "reload"
                              ? /刷新/.test(step)
                              : /新增|编辑|清空/.test(step),
                    )
                    .map((step) => (
                      <p key={step}>✓ {step}</p>
                    ))}
                </>
              )}
              <a href="/examples/todo-verification.json" className="text-link">
                核对完整验证 JSON
              </a>
            </div>
          ) : (
            <p className="notice">
              先点一项，查看对应操作、结果与证据范围。浏览器通过不等于你在本机完成。
            </p>
          )
        ) : (
          <>
            {current?.target === "code" && (
              <>
                <FileTree
                  files={[{ name: "需求单.md" }, { name: "index.html" }]}
                  active="index.html"
                  onSelect={() => {}}
                />
                <CodeStructure
                  key={current.id}
                  html={source}
                  version="v2"
                  initial={current.focus}
                />
              </>
            )}
            <div hidden={current?.target === "code"}>
              <PreviewPane
                html={homepageVersions.v2}
                width={width}
                onWidthChange={onWidthChange}
                version="v2"
                focus={current?.target === "preview" ? current.focus : ""}
                positionRef={position}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
