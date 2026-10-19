import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  GitBranch,
  Play,
  TerminalSquare,
} from "lucide-react";
import { CopyButton } from "./CopyButton";
import { Accordion } from "./ui/accordion";
import { TypingAnimation } from "./ui/typing-animation";
const tools = [
  {
    id: "opencode",
    name: "OpenCode",
    tag: "开源 · 多模型",
    intro:
      "适合希望自由选择模型、习惯在终端工作的人。本指南使用 V2；安装包与 V1 不同。",
    install: "npm install -g @opencode/cli",
    start: "opencode",
    steps: [
      "在项目根目录运行 opencode。",
      "输入 /connect，按提示连接模型供应商。",
      "先要求 Agent 阅读项目并解释结构，再授权文件修改。",
    ],
    link: "https://opencode.ai/v2/docs/",
    note: "npm 安装需要运行 postinstall 来选择平台二进制。Windows 可参考官方独立二进制安装方式。",
  },
  {
    id: "claude",
    name: "Claude Code",
    tag: "终端 / IDE",
    intro:
      "适合围绕 Claude 进行代码阅读、修改与运行验证。也可以从 VS Code 扩展进入。",
    install: "curl -fsSL https://claude.ai/install.sh | bash",
    start: "claude",
    steps: [
      "以上安装命令适用于 macOS / Linux / WSL，Windows 请使用官网对应命令。",
      "在项目中运行 claude，按提示登录账号。",
      "确认权限与工作目录后，从一个边界明确的小任务开始。",
    ],
    link: "https://code.claude.com/docs/en/overview",
    note: "上面是官方原生安装器。执行远程脚本前请核对来源。订阅、API 与第三方服务的计费和权限并不相同。",
  },
  {
    id: "codex",
    name: "Codex",
    tag: "终端 · OpenAI",
    intro:
      "适合使用 OpenAI 工具链，在本地仓库中阅读、编辑、执行命令与检查改动。",
    install: "npm install -g @openai/codex",
    start: "codex",
    steps: [
      "进入目标项目目录，运行 codex。",
      "按提示使用 ChatGPT 账号或其他支持的方式登录。",
      "查看当前权限，再要求它说明计划和验证方法。",
    ],
    link: "https://developers.openai.com/codex/cli",
    note: "账号可用性和额度以官方说明为准。无需为了学习本站案例开通任何套餐。",
  },
  {
    id: "zcode",
    name: "ZCode",
    tag: "桌面 · 可视工作区",
    intro: "更喜欢图形界面？使用桌面工作区将对话、文件、终端与 Git 放在一起。",
    install: "",
    start: "从桌面应用打开本地项目文件夹",
    steps: [
      "从官方下载页选择你的系统和 CPU 架构。",
      "完成首次启动向导，选择项目目录作为工作区。",
      "连接 BigModel / Z.ai 账号或配置模型服务，然后先让 Agent 列出项目文件。",
    ],
    link: "https://zcode.z.ai/cn/docs/install",
    note: "桌面端模型设置与终端环境变量是独立入口，不能假设会自动同步。以官方当前版本界面为准。",
  },
  {
    id: "pi",
    name: "Pi",
    tag: "轻量 · 可扩展",
    intro:
      "适合想要轻量终端工作流，并愿意按需组合扩展的人。不需要先安装一套复杂插件。",
    install: "npm install -g --ignore-scripts @earendil-works/pi-coding-agent",
    start: "pi",
    steps: [
      "需要 Node.js 22.19 或更新版本，包名以当前官网为准。",
      "在项目根目录运行 pi。",
      "输入 /login 连接账号或 API Key，再描述一个小任务。",
    ],
    link: "https://github.com/earendil-works/pi/tree/main/packages/coding-agent",
    note: "Pi 当前仓库与 npm scope 已迁移。开始前阅读官方说明，避免照搬旧文章里的包名。",
  },
];
export function SetupGuide() {
  const [section, setSection] = useState(0);
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);
  const tool = tools[selected];
  const versionDemo =
    "$ node --version\nv24.x.x  # 示例版本\n\n$ npm --version\n11.x.x   # 示例版本\n\n$ git --version\ngit version 2.x.x\n\n# 在你自己的终端运行，确认真实结果。";
  return (
    <div className="focus-panel">
      <nav className="setup-nav" aria-label="准备步骤">
        {["准备环境", "选择 Agent", "试一次协作"].map((label, i) => (
          <button
            type="button"
            key={label}
            aria-current={section === i ? "step" : undefined}
            onClick={() => setSection(i)}
          >
            <span>0{i + 1}</span>
            {label}
          </button>
        ))}
      </nav>
      <div className="setup-scene">
        {section === 0 && (
          <>
            <span className="eyebrow">YOUR LOCAL WORKSPACE</span>
            <h2>先准备这三样，就够了。</h2>
            <div className="basics-grid">
              <a
                href="https://code.visualstudio.com/download"
                target="_blank"
                rel="noreferrer"
              >
                <Code2 size={23} />
                <h3>VS Code ↗</h3>
                <p>打开项目文件夹，文件、终端和 Git 放在一起。</p>
              </a>
              <a
                href="https://nodejs.org/en/download"
                target="_blank"
                rel="noreferrer"
              >
                <TerminalSquare size={23} />
                <h3>Node.js ↗</h3>
                <p>本教程站点用 Node 24；纯 HTML 案例只需浏览器。</p>
              </a>
              <a
                href="https://git-scm.com/downloads"
                target="_blank"
                rel="noreferrer"
              >
                <GitBranch size={23} />
                <h3>Git ↗</h3>
                <p>看清差异，为每次经过确认的修改留下记录。</p>
              </a>
            </div>
            {!playing && !played ? (
              <button
                className="quiet-button"
                type="button"
                onClick={() => setPlaying(true)}
              >
                <Play size={13} />
                看看怎样检查安装结果
              </button>
            ) : (
              <div className="stream-editor terminal-editor">
                <div className="editor-title">
                  <TerminalSquare size={14} />
                  版本检查 · 命令回放，不检测本机
                </div>
                <pre className="stream-code">
                  {playing ? (
                    <TypingAnimation
                      text={versionDemo}
                      code
                      onComplete={() => {
                        setPlaying(false);
                        setPlayed(true);
                      }}
                    />
                  ) : (
                    versionDemo
                  )}
                </pre>
              </div>
            )}
          </>
        )}
        {section === 1 && (
          <>
            <span className="eyebrow">ONE PARTNER IS ENOUGH</span>
            <h2>选一个搭档，不必全装。</h2>
            <div className="tool-options" aria-label="选择 AI 工具">
              {tools.map((t, i) => (
                <button
                  type="button"
                  key={t.id}
                  aria-pressed={selected === i}
                  onClick={() => setSelected(i)}
                >
                  {t.name}
                </button>
              ))}
            </div>
            <div className="tool-heading">
              <h3>{tool.name}</h3>
              <span>{tool.tag}</span>
              <a href={tool.link} target="_blank" rel="noreferrer">
                官方文档
                <ArrowUpRight size={13} />
              </a>
            </div>
            <p>{tool.intro}</p>
            {tool.install && (
              <div className="install-command">
                <code>{tool.install}</code>
                <CopyButton text={tool.install} label="复制命令" />
              </div>
            )}
            <ol className="tool-steps">
              {tool.steps.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ol>
            <Accordion
              items={[
                {
                  title: "平台、登录与版本注意事项",
                  content: <p>{tool.note} 官方入口核对于 2026-10-19。</p>,
                },
              ]}
            />
          </>
        )}
        {section === 2 && (
          <>
            <span className="eyebrow">FIRST CONVERSATION</span>
            <h2>进入项目，再开始对话。</h2>
            <p>
              在 VS Code 打开文件夹，通过「终端 →
              新建终端」进入项目目录，然后启动 {tool.name}。
            </p>
            <div className="install-command">
              <code>{tool.start}</code>
              <CopyButton text={tool.start} label="复制入口" />
            </div>
            <div className="install-command">
              <code>
                先阅读这个项目，说明目录结构与运行方式。不要修改文件，等我确认计划。
              </code>
              <CopyButton
                text="先阅读这个项目，说明目录结构与运行方式。不要修改文件，等我确认计划。"
                label="复制提示词"
              />
            </div>
            <Accordion
              items={[
                {
                  title: "第一次协作，怎样保护现有代码？",
                  content: (
                    <p>
                      先运行 git status 确认已有修改，再用 git switch -c
                      feat/my-first-task 创建分支。完成后看 git diff，检查通过再
                      git add 和 git commit。已提交的改动用 git revert
                      &lt;提交ID&gt; 撤销；未提交内容先备份，不用 reset --hard
                      清空现场。密钥不放进源码，不关闭全部权限确认。新目录先 git
                      init。
                    </p>
                  ),
                },
              ]}
            />
          </>
        )}
        <div className="setup-next">
          <span>随时跳过准备，先体验案例。</span>
          {section < 2 ? (
            <button
              type="button"
              className="primary-button"
              onClick={() => setSection(section + 1)}
            >
              下一步
              <ArrowRight size={14} />
            </button>
          ) : (
            <a className="primary-button" href="/case/from-scratch">
              开始交互案例
              <ArrowRight size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
