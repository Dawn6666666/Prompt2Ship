import { useState } from "react";
import { Accordion, AccordionItem } from "../ui/accordion";
import { Copy, Prompt } from "../workbench/Primitives";
import { blankBrief, promptPairs, questionExamples } from "../../data/guide";
export function GuideTools() {
  const [mode, setMode] = useState(0),
    [reset, setReset] = useState(false);
  return (
    <div className="guide-tools">
      <h2>把五个问题写到自己的项目里</h2>
      <div className="question-examples">
        {questionExamples.map(([label, bad, good]) => (
          <div key={label}>
            <h3>{label}</h3>
            <p className="muted">不够明确：{bad}</p>
            <p>更可执行：{good}</p>
          </div>
        ))}
      </div>
      <div className="paper">
        <h3>空白需求单</h3>
        <p>
          先写决定，再把需求单交给
          Agent。需求单记录“要做什么”，提示词说明“这一次请你做什么”。
        </p>
        <div className="inline-actions">
          <Copy text={blankBrief} label="复制空白需求单" />
          <a
            className="text-link"
            download="我的需求单.md"
            href={`data:text/markdown;charset=utf-8,${encodeURIComponent(blankBrief)}`}
          >
            下载空白模板
          </a>
        </div>
        <details>
          <summary>展开 Markdown 模板</summary>
          <pre>{blankBrief}</pre>
        </details>
        <h3>验收标准的三个自查问题</h3>
        <ol>
          <li>条件清楚吗？例如视口宽度、现有任务或输入内容。</li>
          <li>别人能重复这个操作吗？例如打开页面、保存后刷新或切换完成。</li>
          <li>结果能观察、能判断吗？用“无横向滚动”代替“手机上好看”。</li>
        </ol>
      </div>
      <h2>五种常见协作任务，怎么说更明确</h2>
      <div className="flow-choices" aria-label="提示词对照">
        {promptPairs.map((pair, i) => (
          <button
            key={pair.label}
            aria-pressed={mode === i}
            onClick={() => setMode(i)}
          >
            {pair.label}
          </button>
        ))}
      </div>
      <div className="paper" style={{ marginTop: 16 }}>
        <p className="muted">不够明确：{promptPairs[mode].bad}</p>
        <h3 style={{ marginTop: 24 }}>把决定和现象写具体</h3>
        <Prompt text={promptPairs[mode].good} />
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="1" title="我完全不会写代码，可以开始吗？">
          <p>
            可以先用案例一。先写出需求、打开文件、运行网页、对照检查。遇到不懂的行，让
            Agent 解释它的作用，不要一次让它重写全部。
          </p>
        </AccordionItem>
        <AccordionItem value="2" title="Agent 说做完了，但我没看到文件？">
          <p>
            先确认它打开的是当前项目目录。在文件区找到
            index.html，点开检查内容，并保存。聊天里的代码不会自动变成文件。
          </p>
        </AccordionItem>
        <AccordionItem value="3" title="运行命令报错了，怎么问？">
          <p>
            提供执行目录、完整命令、错误原文和系统信息，说明你已试过什么。不要只说“运行不了”，不要附带密钥。
          </p>
        </AccordionItem>
        <AccordionItem value="4" title="怎样看待自动检查和自己的勾选？">
          <p>
            网站的结果是示例证据。你的勾选只是本机自查记录，不是网站已经检测过你的电脑。
          </p>
        </AccordionItem>
        <AccordionItem value="5" title="清除本浏览器的学习记录">
          <p>
            只清除 Prompt2Ship
            的进度、需求草稿与自查项，不影响主题，也不影响电脑上的项目。
          </p>
          {!reset ? (
            <button className="button secondary" onClick={() => setReset(true)}>
              准备清除记录
            </button>
          ) : (
            <button
              className="button secondary"
              onClick={() => {
                try {
                  Object.keys(localStorage)
                    .filter(
                      (k) =>
                        k.startsWith("p2s:") || k.startsWith("p2s-practice-"),
                    )
                    .forEach((k) => localStorage.removeItem(k));
                } catch {}
                setReset(false);
                location.reload();
              }}
            >
              确认清除
            </button>
          )}
        </AccordionItem>
      </Accordion>
    </div>
  );
}
