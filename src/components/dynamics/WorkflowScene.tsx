import { activities } from "@/data/activities";
import { ArrowRight, Check, FileText, GitBranch, Terminal } from "lucide-react";
import {
  Activity,
  StepControls,
  usePlayback,
  SceneTransition,
} from "./Activity";
import { CopyButton } from "../CopyButton";
const labels = ["目标", "内容", "边界", "验收"];
const additions = [
  "为一名大学生做一个个人作品网站。",
  "包含个人介绍、两个课程项目和邮件联系入口。",
  "使用 HTML 和 CSS；这次不做登录、数据库和后台。",
  "手机宽度 375px 下不横向溢出。先梳理需求与计划，等我确认后再写代码。",
];
export function WorkflowScene() {
  const play = usePlayback(labels.length);
  const prompt = additions.slice(0, play.step + 1).join("\n\n");
  return (
    <Activity
      contract={activities.prompt}
      number="04"
      title="让一句想法变成可执行的任务"
    >
      <div className="prompt-builder">
        <div>
          <span className="small-label">给 Agent 的任务</span>
          <SceneTransition id={play.step}>
            <p className="built-prompt">{prompt}</p>
          </SceneTransition>
          <CopyButton text={prompt} />
        </div>
        <div className="prompt-checklist">
          <span className="small-label">信息逐项补齐</span>
          {[
            "知道给谁做",
            "知道需要哪些内容",
            "知道做到什么范围",
            "知道怎样检查完成",
          ].map((x, i) => (
            <span key={x} className={i <= play.step ? "checked" : ""}>
              <Check size={15} />
              {x}
            </span>
          ))}
        </div>
      </div>
      <StepControls labels={labels} {...play} />
    </Activity>
  );
}
const runtimeSteps = [
  {
    label: "运行工具",
    command: "node --version\nnpm --version\ngit --version",
    output: "v24.x.x\n11.x.x\ngit version 2.x.x",
    detail: "看到版本号，说明终端能找到这些工具。这里的版本号是格式示例。",
  },
  {
    label: "安装依赖",
    command: "cd todo-app-p2s\nnpm ci",
    output: "added … packages\n\n依赖安装完成后，项目才具备运行所需的包。",
    detail: "在项目根目录运行；package.json 描述项目需要哪些依赖。",
  },
  {
    label: "启动服务",
    command:
      "# 终端 A：在 todo-app 根目录\nnpm start --workspace=todo-server\n\n# 终端 B：同样在 todo-app 根目录\nnpm run dev --workspace=todo-client",
    output: "Backend → http://localhost:3001\nFrontend → http://localhost:5173",
    detail: "两个终端分别运行后端和前端。保持终端开启，再访问前端地址。",
  },
];
export function RuntimeScene() {
  const play = usePlayback(runtimeSteps.length);
  const current = runtimeSteps[play.step];
  return (
    <Activity
      contract={activities.runtime}
      number="02"
      title="命令，究竟在哪里运行？"
      caption="命令与输出为案例示意，不检测你的电脑。"
    >
      <div className="terminal-scene">
        <div className="terminal-heading">
          <Terminal size={14} /> my-project <span>命令示例</span>
        </div>
        <SceneTransition id={play.step}>
          <pre>
            <code>{current.command}</code>
          </pre>
          <div className="terminal-output">
            <span>预期观察</span>
            <pre>{current.output}</pre>
          </div>
        </SceneTransition>
      </div>
      <div className="scene-observation">
        <ArrowRight size={16} />
        <p>{current.detail}</p>
      </div>
      <StepControls labels={runtimeSteps.map((x) => x.label)} {...play} />
    </Activity>
  );
}
const gitSteps = [
  {
    label: "工作区",
    command: "git status --short\ngit diff",
    title: "先看 AI 改了什么",
    states: ["modified", "clean", "clean"],
    description:
      "假设已提交初稿。现在修改这个已跟踪的文件，git diff 才能显示相对初稿的变化。",
  },
  {
    label: "暂存区",
    command: "git add index.html",
    title: "只选择这次要保存的文件",
    states: ["clean", "staged", "clean"],
    description:
      "把确认过的 index.html 放入暂存区。其他文件不会自动进入这次提交。",
  },
  {
    label: "版本记录",
    command: 'git commit -m "fix: adapt portfolio for mobile"',
    title: "留下一个可以回看的版本",
    states: ["clean", "clean", "committed"],
    description: "提交保存一个本地版本。推送到远程仓库是另一个动作。",
  },
];
export function GitScene() {
  const play = usePlayback(gitSteps.length);
  const current = gitSteps[play.step];
  return (
    <Activity
      contract={activities.git}
      number="06"
      title="一个文件，走过三个位置"
      caption="图示强调变更所处的状态，文件仍保留在工作区。这是状态演示，不会操作你的文件。"
    >
      <div className="git-lanes">
        {["工作区", "暂存区", "版本记录"].map((x, i) => (
          <div key={x}>
            <span className="small-label">{x}</span>
            <div
              className={`git-file ${current.states[i] !== "clean" ? "present" : ""}`}
            >
              <FileText size={20} />
              <strong>
                {current.states[i] !== "clean" ? "index.html" : "—"}
              </strong>
              <span>
                {current.states[i] === "modified"
                  ? "已修改"
                  : current.states[i] === "staged"
                    ? "待提交"
                    : current.states[i] === "committed"
                      ? "已记录"
                      : ""}
              </span>
            </div>
            {i < 2 && <ArrowRight className="git-arrow" size={18} />}
          </div>
        ))}
      </div>
      <div className="git-command">
        <GitBranch size={16} />
        <code>{current.command}</code>
        <CopyButton text={current.command} label="复制命令" />
      </div>
      <div className="scene-observation">
        <Check size={16} />
        <p>{current.description}</p>
      </div>
      <StepControls labels={gitSteps.map((x) => x.label)} {...play} />
    </Activity>
  );
}
