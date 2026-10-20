import { activities } from "@/data/activities";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  FolderOpen,
  Terminal,
  Bot,
} from "lucide-react";
import { Activity, StepControls, usePlayback } from "./Activity";
import { agentDocs, openCodeSetup } from "@/data/agent-setup";
import { usePreference, systems } from "@/lib/usePreference";
import { SystemPicker } from "./SystemPicker";
import { CopyButton } from "../CopyButton";
const tools = [
  {
    name: "OpenCode",
    entry: "终端 / 桌面",
    start: "opencode",
    link: agentDocs.install,
    note: "按官方文档安装，再连接支持的模型服务。",
  },
  {
    name: "Claude Code",
    entry: "终端 / VS Code",
    start: "claude",
    link: "https://code.claude.com/docs/en/overview",
    note: "选择终端或 VS Code 扩展入口，按提示登录。",
  },
  {
    name: "Codex",
    entry: "终端 / VS Code",
    start: "codex",
    link: "https://developers.openai.com/codex/cli",
    note: "安装 CLI 或 VS Code 扩展，按官方支持的方式登录。",
  },
  {
    name: "ZCode",
    entry: "桌面工作区",
    start: "在 ZCode 中打开项目文件夹",
    link: "https://zcode.z.ai/cn/docs/install",
    note: "通过桌面应用安装与连接模型，代码仍可用 VS Code 阅读。",
  },
  {
    name: "Pi",
    entry: "终端",
    start: "pi",
    link: "https://pi.dev/",
    note: "按官方文档安装，在项目终端启动 pi，再用 /login 连接支持的模型服务。",
  },
];
export function AgentScene() {
  const [selected, setSelected] = useState(0);
  const play = usePlayback(3);
  const tool = tools[selected];
  const [system, setSystem] = usePreference("p2s-system", "Windows", systems);
  const setup = openCodeSetup(system)[play.step];
  const descriptions = [
    tool.note,
    "确认 Agent 的工作目录就是当前项目。先请它阅读，再讨论改动。",
    tool.name === "Pi"
      ? "Pi 默认没有权限确认弹窗。先明确任务与工作目录，实际操作权限由运行环境与扩展配置决定。"
      : "操作前明确本次任务范围；出现权限请求时，核对目标文件、目录与命令用途。",
  ];
  return (
    <Activity
      contract={activities.agent}
      number="03"
      title="工具可以换，协作流程相通"
      caption={`OpenCode 2 路线按官方文档核对于 ${agentDocs.checkedAt}；本站不连接模型。其他工具按官方指南安装，再复用协作流程。`}
    >
      <div className="agent-picker" aria-label="选择编程 Agent">
        {tools.map((x, i) => (
          <button
            type="button"
            key={x.name}
            aria-pressed={selected === i}
            onClick={() => {
              setSelected(i);
              play.setStep(0);
            }}
          >
            {x.name}
          </button>
        ))}
      </div>
      <div className="agent-scene">
        <div className="agent-identity">
          <span>
            <Bot size={26} />
          </span>
          <div>
            <h4>{tool.name}</h4>
            <p>{tool.entry}</p>
          </div>
          <a href={tool.link} target="_blank" rel="noreferrer">
            官方安装指南 <ArrowUpRight size={14} />
          </a>
        </div>
        {selected === 0 ? (
          <div className="agent-setup">
            <SystemPicker value={system} onChange={setSystem} />
            <h4>{setup.title}</h4>
            <ol>
              {setup.instructions.map((instruction) => (
                <li key={instruction}>{instruction}</li>
              ))}
            </ol>
            <div className="agent-command-box">
              <pre className="agent-command">{setup.command}</pre>
              <CopyButton
                text={setup.command}
                label={play.step === 2 ? "复制只读任务" : "复制当前命令"}
              />
            </div>
            <p className="agent-setup-result">检查：{setup.detail}</p>
            {play.step === 1 && (
              <a href={agentDocs.connect} target="_blank" rel="noreferrer">
                连接方式的官方说明 ↗
              </a>
            )}
          </div>
        ) : (
          <>
            <div className="agent-workflow">
              <span className={play.step >= 0 ? "active" : ""}>
                <Terminal size={18} /> 安装并启动
              </span>
              <ArrowRight size={16} />
              <span className={play.step >= 1 ? "active" : ""}>
                <FolderOpen size={18} /> 进入项目
              </span>
              <ArrowRight size={16} />
              <span className={play.step >= 2 ? "active" : ""}>
                <Check size={18} /> 确认操作范围
              </span>
            </div>
            <pre className="agent-command">
              {play.step === 0
                ? `安装完成后启动：\n${tool.start}`
                : play.step === 1
                  ? `当前目录：my-first-site\n\n请先阅读这个项目，说明结构和运行方式，暂时不要修改文件。`
                  : "读取文件 → 理解现状\n修改文件 → 检查差异\n执行命令 → 查看结果"}
            </pre>
          </>
        )}
      </div>
      <div className="scene-observation">
        <ArrowRight size={16} />
        <p>
          {selected === 0
            ? "选择一个已有使用条件的模型服务，完成连接后再进入案例。"
            : descriptions[play.step]}
        </p>
      </div>
      <StepControls
        labels={
          selected === 0
            ? ["安装启动", "连接模型", "首次任务"]
            : ["安装启动", "进入项目", "确认范围"]
        }
        {...play}
      />
    </Activity>
  );
}
