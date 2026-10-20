import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Accordion, AccordionItem } from "../ui/accordion";
import { Brief, Copy, Prompt } from "../workbench/Primitives";
import {
  homepageQuestions,
  todoQuestions,
  questionLabels,
  todoQuestionLabels,
  makePrompt,
} from "../../data/requirement";
export function RequirementBuilder({
  phase,
  todo = false,
}: {
  phase: number;
  todo?: boolean;
}) {
  const questions = todo ? todoQuestions : homepageQuestions;
  const key = `p2s:brief:${todo ? "todo" : "homepage"}`;
  const [selected, setSelected] = useState<string[][]>(questions.map(() => []));
  const [custom, setCustom] = useState<string[]>(questions.map(() => ""));
  const [ready, setReady] = useState(false);
  const [compare, setCompare] = useState(0);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "null");
      if (
        saved?.selected?.length === 5 &&
        saved?.custom?.length === 5 &&
        saved.selected.every(
          (a: unknown) =>
            Array.isArray(a) && a.every((s: unknown) => typeof s === "string"),
        ) &&
        saved.custom.every((s: unknown) => typeof s === "string")
      ) {
        setSelected(saved.selected);
        setCustom(saved.custom);
      }
    } catch {}
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(key, JSON.stringify({ selected, custom }));
      } catch {}
  }, [selected, custom, ready, key]);
  const answers = selected.map((s, i) =>
    [...s, custom[i]].filter(Boolean).join("；"),
  );
  const count = answers.filter(Boolean).length;
  const prompt = makePrompt(answers, todo);
  const md =
    "# 我的需求单\n\n" +
    answers
      .map(
        (a, i) =>
          `- ${(todo ? todoQuestionLabels : questionLabels)[i]}：${a || "待补充"}`,
      )
      .join("\n");
  function example() {
    setSelected(
      questions.map((q) => q.options.filter((o) => !o.includes("炫酷"))),
    );
  }
  function toggle(i: number, text: string) {
    setSelected((s) =>
      s.map((a, n) =>
        n === i
          ? a.includes(text)
            ? a.filter((t) => t !== text)
            : [...a, text]
          : a,
      ),
    );
  }
  if (phase === 0)
    return (
      <div className="requirement-intro">
        <span className="tag">先别急着生成代码</span>
        <h2>{todo ? "“给这个应用加个备注功能。”" : "“帮我做个个人网站。”"}</h2>
        <p className="muted">这句话没有错，但有太多决定还没做。</p>
        <div className="guess-list">
          {["给谁用？", "放什么内容？", "能改哪些地方？", "做到哪里算完？"].map(
            (q, i) => (
              <div key={q}>
                <span>0{i + 1}</span>
                <b>{q}</b>
                <span className="tag">AI 在猜</span>
              </div>
            ),
          )}
        </div>
        <p className="notice">
          你没做的决定，AI 会替你做。下一小步，用五个问题把决定写下来。
        </p>
        {todo && (
          <div className="project-map">
            页面表单 <ArrowRight size={16} />
            前端请求 <ArrowRight size={16} />
            后端接口 <ArrowRight size={16} />
            数据库
            <p>
              先只读提问：“请介绍任务数据从页面到保存经过哪些文件。不要修改文件。”
            </p>
          </div>
        )}
      </div>
    );
  if (phase === 2)
    return (
      <div className="comparison-lesson">
        <h2>不是把提示词写长，而是把决定想清楚。</h2>
        <div className="comparison-head">
          <span>一句模糊要求</span>
          <span>一份需求单</span>
        </div>
        {(todo
          ? [
              ["重写整个应用", "沿用 React、Express 和 SQLite"],
              ["只在页面上显示，刷新就丢失", "明确备注需要持久保存"],
              [
                "勾选完成把备注清空也没发现",
                "检查新增、编辑、清空、刷新与完成",
              ],
              ["顺手改动分类和拖拽", "只改计划中列出的四个文件"],
            ]
          : [
              [
                "AI 自行选择 React，生成多个文件",
                "只写一个 HTML，技术边界明确",
              ],
              ["编出博客、经历等额外内容", "只放你需要的内容"],
              ["改完感觉差不多，不知道好了没", "逐条对照验收标准"],
              ["重写整个项目", "只改计划中列出的文件"],
            ]
        )
          .slice(0, todo ? 4 : 3)
          .map(([a, b], i) => (
            <button
              className="compare-row"
              aria-pressed={compare === i}
              key={a}
              onClick={() => setCompare(i)}
            >
              <span>{a}</span>
              <span>
                <Check size={16} />
                {b}
              </span>
            </button>
          ))}
        <p className="notice">
          {
            [
              "技术边界让输出保持简单，文件也更容易检查。",
              "AI 不知道你的经历，缺失的内容要用占位明确标出。",
              "“没有横向滚动”比“好看”更容易检查。",
              "先知道要改哪里，再去审查真实 Diff。",
            ][compare]
          }
        </p>
      </div>
    );
  if (phase === 3)
    return (
      <div className="prompt-lesson">
        <div className="section-heading">
          <h2>需求单 → 发给 Agent 的话</h2>
          <span className="tag">已回答 {count}/5</span>
        </div>
        {count < 5 && (
          <p className="notice">
            还有未回答的问题。可以回到上一小步填写，或
            <button className="text-link" onClick={example}>
              填入示例答案
            </button>
            ，再复制。
          </p>
        )}
        <Prompt text={prompt} />
        <div className="inline-actions">
          <a
            className="button secondary"
            download="需求单.md"
            href={`data:text/markdown;charset=utf-8,${encodeURIComponent(md)}`}
          >
            下载我的需求单
          </a>
          <Copy text={md} label="复制 Markdown" />
        </div>
        <p className="notice">
          需求单是你想清楚的结果；提示词是把它告诉 Agent 的方式。后续演示沿用
          {todo ? "任务备注的固定示例" : "周小满的示例"}，不会根据你的输入调用
          AI。
        </p>
      </div>
    );
  return (
    <div className="requirement-builder">
      <div className="question-list">
        <div className="section-heading">
          <h2>需求单五问</h2>
          <button className="text-link" onClick={example}>
            填入示例
          </button>
        </div>
        <Accordion type="single" collapsible defaultValue="0">
          {questions.map((q, i) => (
            <AccordionItem
              key={q.title}
              value={String(i)}
              title={
                <span>
                  <em>{String(i + 1).padStart(2, "0")}</em>
                  {q.title}
                </span>
              }
            >
              <p>{q.why}</p>
              {q.options.map((o) => (
                <label className="choice" key={o}>
                  <input
                    type="checkbox"
                    checked={selected[i]?.includes(o)}
                    onChange={() => toggle(i, o)}
                  />
                  {o}
                </label>
              ))}
              {selected[i]?.some((o) => o.includes("炫酷")) && (
                <p className="notice">第一次可以先不加，能跑起来后再迭代。</p>
              )}
              <input
                className="draft-input"
                aria-label={`${q.title} 自己补一条`}
                placeholder="也可以自己补一条…"
                value={custom[i] || ""}
                onChange={(e) =>
                  setCustom((c) =>
                    c.map((s, n) => (n === i ? e.target.value : s)),
                  )
                }
              />
              <p>写进需求单：{answers[i] || "还没有选择"}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <aside className="paper live-brief">
        <span className="tag">我的草稿 · {count}/5</span>
        <Brief todo={todo} answers={answers} />
      </aside>
      <details className="mobile-live-brief paper">
        <summary>查看我的需求单 · {count}/5</summary>
        <Brief todo={todo} answers={answers} />
      </details>
    </div>
  );
}
