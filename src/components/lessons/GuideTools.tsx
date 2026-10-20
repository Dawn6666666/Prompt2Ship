import { useState } from "react";
import { Accordion, AccordionItem } from "../ui/accordion";
import { Prompt } from "../workbench/Primitives";
import { homepageBrief, makePrompt } from "../../data/requirement";
export function GuideTools() {
  const [mode, setMode] = useState(0),
    [reset, setReset] = useState(false);
  return (
    <div className="guide-tools">
      <div className="segmented">
        <button aria-pressed={mode === 0} onClick={() => setMode(0)}>
          需求怎么说
        </button>
        <button aria-pressed={mode === 1} onClick={() => setMode(1)}>
          反馈怎么说
        </button>
      </div>
      <div className="paper" style={{ marginTop: 16 }}>
        <p className="muted">
          {mode === 0
            ? "不够明确：帮我做一个好看的个人网站。"
            : "不够明确：手机上不好看，改一下。"}
        </p>
        <h3 style={{ marginTop: 24 }}>把决定和现象写具体</h3>
        <Prompt
          text={
            mode === 0
              ? makePrompt(homepageBrief)
              : "在 375px 宽度下出现横向滚动，项目卡片右侧被截断。请只修改 CSS，让手机单列显示，不要改内容和电脑端效果。"
          }
        />
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
