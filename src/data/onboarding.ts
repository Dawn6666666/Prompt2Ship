export const onboardingStages = [
  {
    id: "ide",
    label: "安装 IDE",
    short: "把工作台准备好",
    title: "先有一个放代码的地方。",
    intro:
      "IDE 可以理解成写代码的工作台。这里用 VS Code：左边看文件，中间看代码，下方的终端用来输入命令。",
    outcome: "看到编辑器和终端，就有了接下来工作的地方。现在还不需要写代码。",
    beats: [
      {
        title: "找到适合电脑的安装包",
        detail:
          "打开 VS Code 官网，按 Windows、macOS 或 Linux 选择版本。IDE 是工作台，不是 AI 本身。",
      },
      {
        title: "安装后，打开编辑器",
        detail:
          "安装完成会进入欢迎界面。先认清文件区、编辑区和终端，不用急着装一整套插件。",
      },
      {
        title: "找到「终端 → 新建终端」",
        detail:
          "终端就是输入命令、查看结果的地方。后面安装编程 Agent、进入项目，都会用到它。",
      },
    ],
  },
  {
    id: "agent",
    label: "安装编程 Agent",
    short: "让 AI 能参与工作",
    title: "工作台有了，再请一个 AI 搭档。",
    intro:
      "编程 Agent 不只回答问题；获得允许后，它还能读项目、改文件、运行命令。这里看一个就够，不必全部安装。",
    outcome:
      "工具能启动、模型已连接，才具备对话条件。安装成功不等于已经登录，也不等于免费使用。",
    beats: [
      {
        title: "选择一个工具，查看安装方式",
        detail:
          "下面可以切换不同工具的例子。它们做的事相近，安装入口和账号要求不同。",
      },
      {
        title: "启动工具，连接账号或模型",
        detail:
          "Agent 是帮忙做事的工具，模型负责理解和生成。首次使用通常还要登录或连接模型服务。",
      },
      {
        title: "确认工作范围和权限",
        detail:
          "准备进入项目之前，先知道它能访问哪个文件夹、哪些操作需要确认。密钥不写进源码，也不用关闭全部权限提示。",
      },
    ],
  },
  {
    id: "project",
    label: "初始化项目",
    short: "给作品一个自己的文件夹",
    title: "一个项目，从一个独立文件夹开始。",
    intro:
      "沿用后面的「林间作品网站」案例。初始化就是准备好目录和修改记录，不是立刻让 AI 生成一大堆文件。",
    outcome:
      "项目目录已打开，Agent 也在这个目录工作。下一步先聊需求，还没有生成页面。",
    beats: [
      {
        title: "创建项目目录",
        detail:
          "示例把文件夹命名为 lin-portfolio，再进入它。一个作品放一个文件夹，文件不容易混在一起。",
      },
      {
        title: "用 Git 开始记录改动",
        detail:
          "git init 会建立修改记录的起点，还不会生成网页。Git 像项目的存档工具，后面能看清 AI 到底改了什么。",
      },
      {
        title: "在 IDE 中打开，进入同一目录",
        detail:
          "通过「文件 → 打开文件夹」选择 lin-portfolio。新终端也要在这里，再启动刚才的 Agent；别让它在别的目录里工作。",
      },
    ],
  },
  {
    id: "requirements",
    label: "需求分析",
    short: "先说清楚，再开始生成",
    title: "先别写代码，把这五件事聊清楚。",
    intro:
      "「帮我做个网站」还不够具体。接下来用同一个作品网站，把一句想法展开成 AI 能照着做、我们也能检查的任务。",
    outcome:
      "明确给谁看、看完做什么、先放什么、先不做什么、怎样算做好，再让 AI 给出制作计划。",
    beats: [
      {
        title: "从一句模糊的想法开始",
        detail:
          "「帮林间做一个个人网站。」AI 还不知道给谁看、页面要放什么，也不知道怎样算完成。",
      },
      {
        title: "补上五个关键点",
        detail:
          "给客户看；看完项目后通过邮箱联系；先放介绍和两个项目；不做登录与后台；手机和电脑都能完整阅读。",
      },
      {
        title: "把需求交给 AI，先看计划",
        detail:
          "说清范围后，先请 AI 检查遗漏并列出制作步骤。下一页会逐项展开，还可以对比不同需求会带来什么变化。",
      },
    ],
  },
] as const;

export const platforms = ["Windows", "macOS", "Linux"] as const;
export type Platform = (typeof platforms)[number];

export const platformGuides: Record<
  Platform,
  { download: string; install: string }
> = {
  Windows: {
    download: "选择适合电脑架构的 Windows 安装包（.exe）。",
    install: "打开 .exe 安装包，按向导完成安装，再启动 VS Code。",
  },
  macOS: {
    download: "选择 macOS 安装包，留意 Apple 芯片与 Intel 机型的区别。",
    install:
      "打开下载的安装包，将 Visual Studio Code 放进「应用程序」，然后启动。",
  },
  Linux: {
    download: "按发行版选择 .deb 或 .rpm 等安装包，不是所有 Linux 都用同一种。",
    install: "用发行版对应的软件安装器或官网命令完成安装，再启动 VS Code。",
  },
};

export const codingTools = [
  {
    id: "opencode",
    name: "OpenCode",
    tag: "开源 · 多模型",
    intro: "一个编程 Agent，可以连接不同公司的模型。本演示使用 V2 的安装方式。",
    install: "npm install -g @opencode/cli",
    start: "opencode",
    connect: "输入 /connect，按提示连接一个模型服务。",
    link: "https://opencode.ai/v2/docs/",
    note: "这条 npm 安装路线需要 Node.js，并允许安装脚本选择平台程序。Windows 目前使用官网独立 CLI 安装包，不用这里的 npm 命令。",
  },
  {
    id: "claude",
    name: "Claude Code",
    tag: "终端 / IDE",
    intro: "围绕 Claude 读代码、改文件，也有 VS Code 扩展。这里展示终端入口。",
    install: "curl -fsSL https://claude.ai/install.sh | bash",
    start: "claude",
    connect: "首次启动后，按官方提示登录支持的账号。",
    link: "https://code.claude.com/docs/en/overview",
    note: "此命令用于 macOS / Linux / WSL。Windows 原生安装方式见官方文档。运行远程安装脚本前要核对来源；订阅和 API 计费并不相同。",
  },
  {
    id: "codex",
    name: "Codex",
    tag: "终端 · OpenAI",
    intro: "OpenAI 的编程 Agent，可以在本地项目里阅读、编辑文件和执行命令。",
    install: "npm install -g @openai/codex",
    start: "codex",
    connect: "按提示使用 ChatGPT 账号或官方支持的其他方式登录。",
    link: "https://developers.openai.com/codex/cli",
    note: "npm 安装路线需要 Node.js。Windows 支持及推荐环境、账号可用性和额度以官方文档为准。观看本站不需要购买套餐。",
  },
  {
    id: "zcode",
    name: "ZCode",
    tag: "桌面 · 可视工作区",
    intro: "偏好图形界面时，可以在桌面工作区里查看对话、文件、终端和 Git。",
    install: "从官网下载对应系统和 CPU 架构的桌面安装包",
    start: "在 ZCode 中打开 lin-portfolio 文件夹",
    connect: "通过桌面设置连接 BigModel / Z.ai 账号或配置模型服务。",
    link: "https://zcode.z.ai/cn/docs/install",
    note: "这是桌面安装路线，不用输入终端安装命令。桌面模型设置与终端环境变量不一定同步，以当前官方界面为准。",
  },
  {
    id: "pi",
    name: "Pi",
    tag: "轻量 · 可扩展",
    intro:
      "一个轻量的终端编程 Agent，可以按需要添加扩展。入门时不必先研究扩展。",
    install: "npm install -g --ignore-scripts @earendil-works/pi-coding-agent",
    start: "pi",
    connect: "输入 /login，按提示连接账号或 API Key。",
    link: "https://github.com/earendil-works/pi/tree/main/packages/coding-agent",
    note: "需要 Node.js 22.19 或更新版本。仓库与 npm scope 已迁移，实际包名及平台支持以当前官方文档为准。",
  },
] as const;

export const requirementPreview = [
  ["给谁看", "可能合作的客户"],
  ["看完做什么", "看项目，再通过邮箱联系"],
  ["先放什么", "个人介绍、两个项目、邮箱"],
  ["先不做什么", "登录、评论、数据库和后台"],
  ["怎样算做好", "手机不溢出、内容齐全、邮箱可点"],
] as const;
