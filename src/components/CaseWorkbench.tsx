import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  Circle,
  Code2,
  Download,
  FileCode2,
  FileText,
  FolderOpen,
  Globe2,
  Lightbulb,
  Terminal,
  TriangleAlert,
} from "lucide-react";
import { stages, portfolioHtml } from "@/data/course";
import type { HighlightPair } from "@/lib/highlight";
import { useStage } from "@/lib/useStage";
import { StageNav, StageFooter } from "./cases/StageNav";
import { PortfolioPreview } from "./dynamics/PortfolioPreview";
import { SceneTransition, SceneCheckpoint } from "./dynamics/Activity";
import { scratchCheckpoints } from "@/data/checkpoints";
import { usePreference, systems } from "@/lib/usePreference";
import { SystemPicker } from "./dynamics/SystemPicker";
import { PracticeTask } from "./dynamics/PracticeTask";
import { CodeComparison } from "./ui/code-comparison";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { CopyButton } from "./CopyButton";
export type HighlightedStage = HighlightPair;
const ids = ["define", "plan", "build", "run", "iterate", "verify", "ship"];
const rules = [
  {
    label: "容器宽度",
    selector: "main",
    before: "width: 760px;",
    after: "max-width: 760px;",
    why: "限制最大宽度，同时允许容器在小屏收缩。",
    lines: { before: [2], after: [2] },
  },
  {
    label: "标题字号",
    selector: "h1",
    before: "font-size: 64px;",
    after: "font-size: clamp(38px, 8vw, 64px);",
    why: "字号跟随屏幕变化，并保留上下限。",
    lines: { before: [3], after: [3] },
  },
  {
    label: "项目网格",
    selector: ".projects",
    before: "grid-template-columns: 1fr 1fr;",
    after:
      "@media (max-width: 560px) {\n  .projects { grid-template-columns: 1fr; }\n}",
    why: "小屏将两列项目改为一列，保证内容可读。",
    lines: { before: [4], after: [9] },
  },
];
export function CaseWorkbench({
  highlighted,
  sources,
}: {
  highlighted: HighlightPair[];
  sources?: string[];
}) {
  const [stage, select] = useStage(ids, "p2s-scratch");
  const [width, setWidth] = useState(1280);
  const [fixed, setFixed] = useState(true);
  const [focus, setFocus] = useState(-1);
  const [view, setView] = useState("preview");
  const previewPosition = useRef({ top: 0, left: 0 });
  const [system, setSystem] = usePreference("p2s-system", "Windows", systems);
  useEffect(() => {
    setWidth(stage === 3 || stage === 4 ? 375 : 1280);
    setFocus(-1);
    setView("preview");
    setFixed(true);
    previewPosition.current = { top: 0, left: 0 };
  }, [stage]);
  const current = stages[stage];
  const rule = focus < 0 ? undefined : rules[focus];
  const command = current.command.replaceAll(
    "python3",
    system === "Windows" ? "py" : "python3",
  );
  return (
    <div className="case-studio">
      <StageNav
        labels={stages.map((x) => x.name)}
        stage={stage}
        onChange={select}
      />
      <div className="case-stage-heading">
        <div>
          <span className="small-label">
            动态 {String(stage + 7).padStart(2, "0")} /{" "}
            {current.en.toUpperCase()}
          </span>
          <h2>{current.title}</h2>
        </div>
        <span className={`p-badge ${stage === 3 ? "warn" : ""}`}>
          {stage < 2
            ? "需求与计划"
            : stage < 4
              ? "v1 · 初稿"
              : "v2 · 响应式版本"}
        </span>
      </div>
      <div className="case-workarea">
        <aside className="case-explanation">
          <p className="case-goal">{current.goal}</p>
          <div className="case-prompt">
            <div>
              <span className="small-label">给 Agent 的提示词</span>
              <CopyButton text={current.prompt} />
            </div>
            <p>{current.prompt}</p>
          </div>
          {stage === 4 && (
            <div className="change-focus">
              <span className="small-label">点击改动，关联代码与效果</span>
              {rules.map((x, i) => (
                <button
                  type="button"
                  key={x.label}
                  onClick={() => {
                    setFocus(focus === i ? -1 : i);
                    setWidth(375);
                  }}
                  aria-pressed={focus === i}
                >
                  <span>0{i + 1}</span>
                  {x.label}
                  <ArrowRight size={14} />
                </button>
              ))}
            </div>
          )}
          <div className="case-takeaway">
            <Lightbulb size={17} />
            <p>{current.lesson}</p>
          </div>
          <details className="case-detail">
            <summary>查看 Agent 的处理说明</summary>
            <p>{current.reply}</p>
          </details>
          <span className="case-simulation">
            预设案例 · 可复制提示词在本地跟做
          </span>
        </aside>
        <div className="case-artifact">
          <SceneTransition id={stage}>
            {stage === 0 && (
              <div className="brief-document">
                <div className="document-top">
                  <FileText size={16} />
                  <span>需求清单.md</span>
                  <span>5 项约定</span>
                </div>
                <div className="document-body">
                  <span className="document-kicker">PROJECT BRIEF / 01</span>
                  <h3>林间的个人作品网站</h3>
                  <p>让潜在客户看见作品，并找到联系入口。</p>
                  <dl>
                    {[
                      ["给谁看", "可能合作的客户"],
                      ["放什么", "个人介绍、两个项目、邮件入口"],
                      ["做到哪", "中文单页，不做登录、数据库和后台"],
                      ["如何验收", "375px 与 1280px 下可读，无横向溢出"],
                      ["交付什么", "一份能独立打开的 HTML 与运行说明"],
                    ].map(([label, text]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{text}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="document-note">
                    <CheckCheck size={16} /> 先让完成标准具体，再讨论怎么实现。
                  </div>
                </div>
              </div>
            )}
            {stage === 1 && (
              <div className="plan-document">
                <div className="document-top">
                  <FolderOpen size={16} /> lin-portfolio{" "}
                  <span>最小实现方案</span>
                </div>
                <div className="plan-stack">
                  <div className="plan-file">
                    <FileCode2 size={24} />
                    <strong>index.html</strong>
                    <span>结构 + 样式，一个文件</span>
                  </div>
                  <ol>
                    {[
                      "搭出介绍、项目和联系入口",
                      "生成可运行的第一版",
                      "启动预览，检查手机和桌面",
                      "根据具体问题做局部修复",
                      "检查差异，整理交付说明",
                    ].map((x, i) => (
                      <li key={x}>
                        <span>0{i + 1}</span>
                        {x}
                      </li>
                    ))}
                  </ol>
                  <p className="plan-boundary">
                    这个案例用 HTML / CSS，先把完整流程走通。
                  </p>
                  <details className="follow-commands" open>
                    <summary>开始跟做：创建目录与 Git 仓库</summary>
                    <pre>{command}</pre>
                    <CopyButton text={command} label="复制当前命令" />
                    <p>
                      用 VS Code 打开 lin-portfolio。第一次提交前，按 Git
                      提示设置提交者姓名与邮箱。
                    </p>
                  </details>
                </div>
              </div>
            )}
            {stage >= 2 && stage <= 4 && (
              <>
                <Tabs value={view} onValueChange={setView}>
                  <div className="artifact-tabs">
                    <TabsList aria-label="案例观察视图">
                      <TabsTrigger value="preview">
                        <Globe2 size={14} />
                        运行效果
                      </TabsTrigger>
                      <TabsTrigger value="code">
                        <Code2 size={14} />
                        {stage === 4 ? "代码差异" : "页面代码"}
                      </TabsTrigger>
                      <TabsTrigger value="terminal">
                        <Terminal size={14} />
                        运行命令
                      </TabsTrigger>
                    </TabsList>
                    {stage === 4 && (
                      <div className="segmented">
                        <button
                          type="button"
                          aria-pressed={!fixed}
                          onClick={() => setFixed(false)}
                        >
                          修改前
                        </button>
                        <button
                          type="button"
                          aria-pressed={fixed}
                          onClick={() => setFixed(true)}
                        >
                          修复后
                        </button>
                      </div>
                    )}
                  </div>
                  <TabsContent value="preview">
                    <PortfolioPreview
                      html={portfolioHtml(stage === 4 && !fixed ? 2 : stage)}
                      width={width}
                      onWidthChange={setWidth}
                      focus={rule?.selector}
                      position={previewPosition}
                    />
                  </TabsContent>
                  <TabsContent value="code">
                    {stage === 4 ? (
                      <CodeComparison
                        {...highlighted[stage]}
                        filename="index.html · CSS"
                        focus={rule?.lines}
                        focusLabel={rule?.label}
                      />
                    ) : (
                      <div className="source-code">
                        <div className="file-heading">
                          <FileCode2 size={14} />
                          index.html<span>完整阶段快照</span>
                          <CopyButton
                            text={portfolioHtml(2)}
                            label="复制完整初稿"
                          />
                        </div>
                        <div
                          className="highlighted-code"
                          dangerouslySetInnerHTML={{
                            __html: sources?.[0] ?? highlighted[stage].after,
                          }}
                        />
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="terminal">
                    <div className="terminal-scene">
                      <SystemPicker value={system} onChange={setSystem} />
                      <div className="terminal-heading">
                        <Terminal size={14} />
                        本地运行命令<span>操作示例</span>
                      </div>
                      <pre>{command}</pre>
                      <div className="terminal-output">
                        <span>执行后检查</span>
                        <p>
                          {stage === 2
                            ? "保存 index.html 后先提交初稿，git status --short 应无输出。下一步再启动本地服务。"
                            : stage === 4
                              ? "刷新浏览器，对照 375px 与 1280px，再运行 git diff 查看修改范围。"
                              : "在浏览器打开 http://localhost:4322。终端保持运行，按 Ctrl+C 停止。"}
                        </p>
                      </div>
                      <CopyButton text={command} label="复制当前命令" />
                      {stage === 2 && (
                        <a
                          href="/examples/folio-v1.html"
                          download="index.html"
                          className="p-button"
                        >
                          <Download size={15} /> 下载初稿 v1
                        </a>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                {stage === 3 && (
                  <div className="artifact-finding">
                    <TriangleAlert size={18} />
                    <div>
                      <strong>
                        {width < 808
                          ? "问题可见：内容比手机视口更宽。"
                          : "桌面正常，试试 375px 手机视口。"}
                      </strong>
                      <p>
                        main 固定为
                        760px，加上内边距；两列卡片也没有小屏规则。下一步只修复这些样式。
                      </p>
                    </div>
                  </div>
                )}
                {stage === 4 && rule && (
                  <div className="focused-rule">
                    <span className="small-label">{rule.label} · 对应改动</span>
                    <code className="rule-before">− {rule.before}</code>
                    <code className="rule-after">+ {rule.after}</code>
                    <p>{rule.why}</p>
                    <div className="focus-actions">
                      <button type="button" onClick={() => setView("code")}>
                        定位代码
                      </button>
                      <button type="button" onClick={() => setView("preview")}>
                        观察效果
                      </button>
                    </div>
                  </div>
                )}
                {stage === 4 && !rule && (
                  <div className="artifact-finding good">
                    <Check size={18} />
                    <div>
                      <strong>从左侧选择一项改动，查看它对应的位置。</strong>
                      <p>修改前后使用同一份内容，变化只发生在响应式样式。</p>
                    </div>
                  </div>
                )}
              </>
            )}
            {stage === 5 && (
              <div className="verification-document">
                <div className="document-top">
                  <CheckCheck size={16} />
                  验证与提交<span>检查依据</span>
                </div>
                <div className="verification-list">
                  {[
                    [
                      "结构与内容",
                      "对照源文件：页面标题、两个项目、邮件链接均存在。",
                      "源码可检查",
                    ],
                    [
                      "手机与桌面布局",
                      "在预览里切换 375px / 1280px，检查横向滚动与卡片排列。",
                      "需要观察",
                    ],
                    [
                      "邮件联系入口",
                      "示例邮箱 hello@example.com 需要替换，再测试自己的邮件程序。",
                      "交付前完成",
                    ],
                    [
                      "修改范围",
                      "运行 git diff，确认只包含本次响应式修改。",
                      "本地执行",
                    ],
                  ].map(([title, detail, status]) => (
                    <div key={title}>
                      <span className="verify-icon warn">
                        <Circle size={16} />
                      </span>
                      <div>
                        <h4>{title}</h4>
                        <p>{detail}</p>
                      </div>
                      <span className="verify-status">{status}</span>
                    </div>
                  ))}
                </div>
                <div className="verify-command">
                  <pre>{command}</pre>
                  <CopyButton text={command} label="复制检查命令" />
                </div>
                <p className="evidence-note">
                  页面提供检查方法，不把未执行的本机检查标为通过。
                </p>
              </div>
            )}
            {stage === 6 && (
              <div className="delivery-document">
                <span className="delivery-icon">
                  <CheckCheck size={32} />
                </span>
                <span className="small-label">READY TO HAND OVER</span>
                <h3>让作品，离开对话框。</h3>
                <p>完整文件、运行方式、需要替换的内容，一起交付。</p>
                <a
                  className="download-card"
                  href="/examples/folio.html"
                  download="index.html"
                >
                  <FileCode2 size={27} />
                  <span>
                    <strong>index.html</strong>
                    <small>HTML + CSS · 无外部依赖</small>
                  </span>
                  <Download size={20} />
                </a>
                <div className="delivery-actions">
                  <a
                    href="/examples/folio.html"
                    target="_blank"
                    rel="noreferrer"
                    className="p-button"
                  >
                    独立打开作品 <ArrowUpRight size={14} />
                  </a>
                  <a
                    href="/case/todo-app"
                    className="p-button p-button-primary"
                  >
                    再看一次全栈改造 <ArrowRight size={14} />
                  </a>
                </div>
                <details>
                  <summary>运行与交付说明</summary>
                  <SystemPicker value={system} onChange={setSystem} />
                  <pre>
                    {system === "Windows" ? "py" : "python3"} -m http.server
                    4322
                  </pre>
                  <p>
                    访问
                    localhost:4322。正式发布前替换姓名、作品和示例邮箱；上传
                    index.html 到静态托管服务即可发布。
                  </p>
                </details>
              </div>
            )}
          </SceneTransition>
          <SceneCheckpoint {...scratchCheckpoints[stage]} />
        </div>
      </div>
      {stage === 6 && (
        <PracticeTask
          id="portfolio"
          task="把作品集改成你自己的介绍，再请同学按交付说明打开它。"
          checks={[
            "已替换姓名、两个项目和邮箱，并检查手机与桌面",
            "初稿与修复分别有 Git 提交，同学能独立打开最终文件",
          ]}
        />
      )}
      <StageFooter
        stage={stage}
        total={stages.length}
        onChange={select}
        next={{ href: "/case/todo-app", label: "进入全栈案例" }}
      />
    </div>
  );
}
