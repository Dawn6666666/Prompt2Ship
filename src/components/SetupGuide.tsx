import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Files,
  FolderOpen,
  Monitor,
  Play,
  RotateCcw,
  SkipForward,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import {
  codingTools,
  onboardingStages,
  platforms,
  platformGuides,
  requirementPreview,
  type Platform,
} from "@/data/onboarding";
import { Accordion } from "./ui/accordion";
import { FileTree } from "./ui/file-tree";
import { ChoiceGroup } from "./ui/choice-group";
import { TypingAnimation } from "./ui/typing-animation";

export function SetupGuide() {
  const [section, setSection] = useState(0);
  const [beat, setBeat] = useState(0);
  const [selected, setSelected] = useState(0);
  const [platform, setPlatform] = useState<Platform>("Windows");
  const [playing, setPlaying] = useState(false);
  const [view, setView] = useState("story");
  const [replay, setReplay] = useState(0);
  const screen = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const stage = onboardingStages[section];
  const tool = codingTools[selected];
  const platformGuide = platformGuides[platform];

  useEffect(() => {
    function sync() {
      const index = onboardingStages.findIndex(
        (item) => `#${item.id}` === location.hash,
      );
      setSection(index < 0 ? 0 : index);
      setBeat(0);
      setPlaying(false);
      setView("story");
    }
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(
      () => {
        if (beat < 2) setBeat(beat + 1);
        else setPlaying(false);
      },
      3400,
    );
    return () => clearTimeout(timer);
  }, [playing, beat]);

  useEffect(() => {
    if (screen.current) screen.current.scrollTop = 0;
  }, [section, beat, selected, platform, replay, view]);

  function go(index: number) {
    setSection(index);
    setBeat(0);
    setPlaying(false);
    setView("story");
    history.replaceState(null, "", `#${onboardingStages[index].id}`);
  }
  function showBeat(index: number) {
    setBeat(index);
    setPlaying(false);
    setView("screen");
  }
  function play() {
    setBeat(0);
    setPlaying(true);
    setReplay(replay + 1);
    setView("screen");
  }
  const usesDownload =
    tool.id === "zcode" ||
    (platform === "Windows" &&
      (tool.id === "opencode" || tool.id === "claude"));
  const installation = usesDownload
    ? `打开 ${tool.name} 官方文档\n选择 ${platform} 安装方式\n下载并安装对应版本`
    : `$ ${tool.install}\n\n# 安装过程省略；具体结果以真实终端为准`;
  const agentScript =
    beat === 0
      ? installation
      : beat === 1
        ? `${tool.id === "zcode" ? "打开 ZCode 桌面应用" : `$ ${tool.start}`}\n\n${tool.connect}\n\n# 登录界面与服务额度，以官方当前说明为准`
        : `工作目录：稍后选择 lin-portfolio\n模型连接：由开发者确认\n文件修改 / 命令执行：查看权限后再授权\n\n# 本站没有读取文件，也没有连接模型。`;
  const projectScript =
    beat === 0
      ? "$ mkdir lin-portfolio\n$ cd lin-portfolio\n\n# 终端已进入新项目目录（示意）"
      : beat === 1
        ? "$ git init\n\nInitialized empty Git repository in lin-portfolio/.git/\n\n# .git 用于记录改动，不是网页文件"
        : `文件 → 打开文件夹 → lin-portfolio\n终端 → 新建终端\n\n${tool.id === "zcode" ? tool.start : `lin-portfolio > ${tool.start}`}\n\n# 编辑器和 Agent 指向同一个项目目录`;

  return (
    <section className="studio onboarding" aria-label="从零上手的四个阶段">
      <div className="studio-toolbar">
        <span>
          <span className="live-dot" />
          <Monitor size={14} /> 从零上手 / 林间作品网站
        </span>
        <span className="simulation-label">过程演示 · 不安装、不执行</span>
      </div>
      <nav className="scene-nav onboarding-nav" aria-label="入门流程">
        {onboardingStages.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => go(i)}
            aria-current={section === i ? "step" : undefined}
          >
            <span>0{i + 1}</span>
            {item.label}
            {section === i && (
              <motion.i
                layoutId="onboarding-indicator"
                transition={reduce ? { duration: 0 } : { duration: 0.25 }}
              />
            )}
          </button>
        ))}
      </nav>
      <div className="onboarding-mobile-switch">
        <ChoiceGroup
          options={["过程讲解", "界面演示"]}
          value={view === "story" ? "过程讲解" : "界面演示"}
          onChange={(value) =>
            setView(value === "过程讲解" ? "story" : "screen")
          }
          label="入门演示视图"
          className="onboarding-toggle"
          showArrow={false}
        />
      </div>
      <div className="onboarding-body" data-mobile-view={view}>
        <div className="onboarding-story" key={stage.id}>
          <span className="eyebrow">从零开始 / 0{section + 1}</span>
          <h1>{stage.title}</h1>
          <p className="onboarding-intro">{stage.intro}</p>
          {(section === 0 || section === 1) && (
            <div className="platform-options">
              <span>查看安装路线</span>
              <ChoiceGroup
                options={platforms}
                value={platform}
                onChange={(value) => {
                  setPlatform(value as Platform);
                  setPlaying(false);
                }}
                label="选择示例操作系统"
                className="onboarding-toggle"
                showArrow={false}
              />
            </div>
          )}
          {section === 1 && (
            <div className="tool-options" aria-label="切换编程 Agent 示例">
              {codingTools.map((item, i) => (
                <button
                  type="button"
                  key={item.id}
                  aria-pressed={selected === i}
                  onClick={() => {
                    setSelected(i);
                    setBeat(0);
                    setPlaying(false);
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
          <ol className="onboarding-beats" aria-label="本阶段的过程">
            {stage.beats.map((item, i) => (
              <li key={item.title}>
                <button
                  type="button"
                  onClick={() => showBeat(i)}
                  aria-current={beat === i ? "step" : undefined}
                >
                  <span>{i < beat ? <Check size={13} /> : `0${i + 1}`}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </div>
                </button>
              </li>
            ))}
          </ol>
          <div className="onboarding-takeaway">
            <Sparkles size={17} />
            <p>{stage.outcome}</p>
          </div>
          <Accordion
            items={[
              section === 0
                ? {
                    title: "VS Code、Agent 和模型，有什么不同？",
                    content: (
                      <p>
                        VS Code 是放文件、写代码的工作台；Agent
                        是能在项目里做事的工具；模型是它理解需求、生成内容时用到的能力。它们不是同一样东西。
                      </p>
                    ),
                  }
                : section === 1
                  ? {
                      title: "安装前，还需要知道什么？",
                      content: (
                        <>
                          <p>{tool.note}</p>
                          <p>
                            使用 npm 安装时，需要先从 Node.js 官网安装当前 LTS
                            版本。npm 是随 Node.js
                            提供的包管理工具，不必单独下载安装。安装后重新打开终端。
                          </p>
                          <a
                            href="https://nodejs.org/en/download"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Node.js 官方下载 ↗
                          </a>
                        </>
                      ),
                    }
                  : section === 2
                    ? {
                        title: "需要先装框架吗？Git 从哪里来？",
                        content: (
                          <>
                            <p>
                              这个案例只有一个 HTML 页面，不需要 npm init 或
                              React 脚手架。复杂项目才按需要选模板。示例中的 git
                              命令需要先安装 Git；安装后重新打开终端，用 git
                              --version 查看是否能找到它。
                            </p>
                            <a
                              href="https://git-scm.com/downloads"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Git 官方下载 ↗
                            </a>
                          </>
                        ),
                      }
                    : {
                        title: "为什么不直接让 AI 写完整网站？",
                        content: (
                          <p>
                            没说清楚时，AI
                            也只能猜：可能多加登录、选了不需要的框架，或漏掉手机显示。先花一点时间确定内容和边界，后面的反馈才有依据。
                          </p>
                        ),
                      },
            ]}
          />
        </div>
        <div className="onboarding-demonstration">
          <div className="onboarding-screen-label">
            <span>
              <Code2 size={14} />{" "}
              {section === 0
                ? "VS Code"
                : section === 1
                  ? tool.name
                  : "lin-portfolio"}
            </span>
            <small>界面示意 · 可上下滚动</small>
          </div>
          <div className="onboarding-screen" ref={screen}>
            <div className="onboarding-windowbar">
              <span className="window-dots">
                <i />
                <i />
                <i />
              </span>
              <span>
                {section === 0
                  ? "欢迎 / 工作台"
                  : section === 1
                    ? "安装 → 连接 → 权限"
                    : section === 2
                      ? "项目目录 / 初始化"
                      : "需求讨论 / 先不写代码"}
              </span>
            </div>
            {section === 0 ? (
              beat === 0 ? (
                <div className="ide-download">
                  <Code2 size={46} strokeWidth={1.2} />
                  <span className="eyebrow">编辑器 / VS CODE</span>
                  <h2>每个作品，都有一个开始的地方。</h2>
                  <p>{platformGuide.download}</p>
                  <a
                    className="primary-button"
                    href="https://code.visualstudio.com/download"
                    target="_blank"
                    rel="noreferrer"
                  >
                    查看 VS Code 官方下载 <ArrowUpRight size={14} />
                  </a>
                  <small>此链接打开官网，本站不会下载或安装软件。</small>
                </div>
              ) : (
                <div className="ide-shell">
                  <aside>
                    <Files size={17} />
                    <span>文件区</span>
                    <p>项目文件会出现在这里。</p>
                  </aside>
                  <div className="ide-main">
                    <div className="ide-welcome">
                      <Code2 size={42} strokeWidth={1.2} />
                      <h2>你好，VS Code。</h2>
                      <p>中间是编辑区，之后会在这里看见代码。</p>
                      {beat === 1 && (
                        <p className="ide-install-route">
                          {platform} / {platformGuide.install}
                        </p>
                      )}
                    </div>
                    {beat === 2 && (
                      <div className="ide-terminal">
                        <span>
                          <TerminalSquare size={14} /> 终端 → 新建终端
                        </span>
                        <pre>
                          {platform === "Windows"
                            ? "PS C:\\Users\\student> "
                            : "student ~ % "}
                          <span className="typing-cursor">▍</span>
                        </pre>
                        <p>输入命令的位置。不需要在本站填写。</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            ) : section === 1 ? (
              <div className="agent-demo">
                <div className="onboarding-tool-heading">
                  <Sparkles size={23} />
                  <div>
                    <h2>{tool.name}</h2>
                    <span>
                      {tool.tag} / {platform} 路线
                    </span>
                  </div>
                  <a href={tool.link} target="_blank" rel="noreferrer">
                    官方文档 <ArrowUpRight size={13} />
                  </a>
                </div>
                <p>{tool.intro}</p>
                <div
                  className="onboarding-terminal"
                  key={`${tool.id}-${platform}-${beat}-${replay}`}
                >
                  <span>
                    <TerminalSquare size={14} />
                    {beat === 0 && usesDownload
                      ? "安装入口示意"
                      : "命令与操作示意"}
                    <small>预设回放 · 未执行</small>
                  </span>
                  <pre>
                    {playing ? (
                      <TypingAnimation text={agentScript} code />
                    ) : (
                      agentScript
                    )}
                  </pre>
                </div>
                {beat === 0 &&
                  !usesDownload &&
                  tool.install.startsWith("npm") && (
                    <p className="tool-note">
                      这条路线先安装 Node.js LTS，npm
                      会一起安装。安装要求可在过程讲解中展开查看。
                    </p>
                  )}
                <div className="agent-connection">
                  <span className={beat > 0 ? "active" : ""}>安装工具</span>
                  <ArrowRight size={12} />
                  <span className={beat > 0 ? "active" : ""}>连接模型</span>
                  <ArrowRight size={12} />
                  <span className={beat > 1 ? "active" : ""}>确认权限</span>
                </div>
                <p className="tool-note">
                  这里只解释连接过程，不收集账号、密码或 API
                  Key，也不检查真实连接状态。
                </p>
              </div>
            ) : section === 2 ? (
              <div className="project-demo">
                <div className="project-explorer">
                  <span className="eyebrow">文件 / EXPLORER</span>
                  <FileTree
                    name="lin-portfolio"
                    files={
                      beat > 0
                        ? [{ name: ".git/", note: "修改记录（通常隐藏）" }]
                        : []
                    }
                  />
                  <p>
                    后面的案例会生成 index.html，当前还没有网页。下方的 git
                    命令以已安装{" "}
                    <a
                      href="https://git-scm.com/downloads"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Git ↗
                    </a>{" "}
                    为前提。
                  </p>
                </div>
                <div
                  className="onboarding-terminal"
                  key={`${beat}-${tool.id}-${replay}`}
                >
                  <span>
                    <TerminalSquare size={14} /> 初始化过程
                    <small>预设回放 · 未执行</small>
                  </span>
                  <pre>
                    {playing ? (
                      <TypingAnimation text={projectScript} code />
                    ) : (
                      projectScript
                    )}
                  </pre>
                </div>
                <div className="project-ready">
                  <FolderOpen size={18} />
                  <div>
                    <strong>
                      {beat === 2
                        ? "编辑器 + Agent → 同一个文件夹"
                        : "先准备目录，不急着生成页面"}
                    </strong>
                    <p>
                      {beat === 2
                        ? `当前示例：${tool.name} / lin-portfolio`
                        : "不会访问或创建你电脑里的真实文件。"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="brief-demo">
                <div className="brief-message">
                  <span>示例想法</span>
                  <p>帮林间做一个个人网站。</p>
                </div>
                {beat === 0 ? (
                  <div className="brief-response">
                    <Sparkles size={20} />
                    <h2>做给谁看？要放什么？</h2>
                    <p>先补上这些信息，AI 才不用凭空猜。</p>
                  </div>
                ) : (
                  <>
                    <div className="brief-five">
                      {requirementPreview.map(([label, text]) => (
                        <div key={label}>
                          <span>{label}</span>
                          <p>{text}</p>
                        </div>
                      ))}
                    </div>
                    {beat === 2 && (
                      <div className="brief-message brief-agent">
                        <span>
                          <Sparkles size={13} /> 给 AI 的下一句话
                        </span>
                        <p>
                          先检查需求有没有遗漏，再列一个简单的制作计划。先别写代码。
                        </p>
                      </div>
                    )}
                  </>
                )}
                <a className="quiet-button" href="/case/from-scratch">
                  展开五步需求分析 <ArrowRight size={14} />
                </a>
              </div>
            )}
          </div>
          <div className="onboarding-player">
            <span>
              0{beat + 1} / 03 · {stage.beats[beat].title}
            </span>
            <button
              type="button"
              className="quiet-button"
              onClick={
                playing
                  ? () => {
                      setBeat(2);
                      setPlaying(false);
                    }
                  : play
              }
            >
              {playing ? (
                <SkipForward size={14} />
              ) : beat === 2 ? (
                <RotateCcw size={14} />
              ) : (
                <Play size={14} />
              )}
              {playing ? "跳过动画" : beat === 2 ? "重播本阶段" : "播放本阶段"}
            </button>
          </div>
          <div className="onboarding-beat-controls" aria-label="切换演示画面">
            {stage.beats.map((item, i) => (
              <button
                key={item.title}
                type="button"
                aria-label={`查看画面 ${i + 1}：${item.title}`}
                aria-pressed={beat === i}
                onClick={() => showBeat(i)}
              >
                <span />
              </button>
            ))}
          </div>
        </div>
      </div>
      <footer className="onboarding-footer">
        <button
          type="button"
          className="quiet-button"
          disabled={section === 0}
          onClick={() => go(section - 1)}
        >
          <ArrowLeft size={14} /> 上一阶段
        </button>
        <span>自由切换，只观看也能看懂。</span>
        {section < 3 ? (
          <button
            type="button"
            className="primary-button"
            onClick={() => go(section + 1)}
          >
            观看：{onboardingStages[section + 1].label}
            <ArrowRight size={14} />
          </button>
        ) : (
          <a className="primary-button" href="/case/from-scratch">
            观看需求分析案例
            <ArrowRight size={14} />
          </a>
        )}
      </footer>
    </section>
  );
}
