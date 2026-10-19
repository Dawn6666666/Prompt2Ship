import { useState } from "react";
import {
  ArrowUpRight,
  Code2,
  TerminalSquare,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { CopyButton } from "./CopyButton";
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
  const [checked, setChecked] = useState<string[]>([]);
  const checks = [
    "编辑器能打开项目文件夹",
    "终端能找到 Node.js / npm 和 Git",
    "Agent 能读取正确的项目目录",
    "本地预览能在浏览器中打开",
  ];
  return (
    <>
      <Tabs defaultValue="opencode" className="tool-picker">
        <TabsList aria-label="选择 AI 编程工具">
          {tools.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>
              {t.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {tools.map((tool) => (
          <TabsContent key={tool.id} value={tool.id}>
            <div className="tool-panel">
              <div className="tool-panel-heading">
                <span className="tool-logo">
                  <TerminalSquare size={24} />
                </span>
                <div>
                  <h3>{tool.name}</h3>
                  <span className="inline-tag">{tool.tag}</span>
                </div>
                <a href={tool.link} target="_blank" rel="noreferrer">
                  官方文档 <ArrowUpRight size={14} />
                </a>
              </div>
              <p>{tool.intro}</p>
              {tool.install && (
                <div className="install-command">
                  <code>{tool.install}</code>
                  <CopyButton text={tool.install} label="复制命令" />
                </div>
              )}
              <ol>
                {tool.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <div className="launch-command">
                <Code2 size={15} />
                <span>启动入口</span>
                <code>{tool.start}</code>
              </div>
              <p className="tool-note">{tool.note}</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <section className="setup-checklist">
        <div>
          <span className="eyebrow">READY CHECK</span>
          <h3>准备好，就出发。</h3>
          <p>
            这不是考试，只是一份可勾选的出发清单。
            <br />
            无需全选，也可以先浏览交互案例。
          </p>
        </div>
        <div>
          {checks.map((text) => (
            <label key={text}>
              <input
                type="checkbox"
                checked={checked.includes(text)}
                onChange={() =>
                  setChecked((current) =>
                    current.includes(text)
                      ? current.filter((c) => c !== text)
                      : [...current, text],
                  )
                }
              />
              <span>{text}</span>
            </label>
          ))}
          <p className="check-progress" aria-live="polite">
            {checked.length} / 4 项已确认 · 本次页面有效
          </p>
        </div>
      </section>
    </>
  );
}
