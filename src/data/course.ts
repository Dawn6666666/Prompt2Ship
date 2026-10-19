export const navigation = [
  { label: "学习概览", href: "/", icon: "overview" },
  { label: "搭建你的工作台", href: "/setup", icon: "setup", meta: "准备篇" },
  {
    label: "从一句话到一个网站",
    href: "/case/from-scratch",
    icon: "scratch",
    meta: "案例 01",
  },
  {
    label: "给 Todo 增加备注",
    href: "/case/todo-app",
    icon: "todo",
    meta: "案例 02",
  },
  { label: "把经验变成方法", href: "/review", icon: "review", meta: "复盘篇" },
];

export const initialCss = `body { margin: 0; font-family: system-ui, sans-serif; background: #f6f3eb; color: #292b26; }
main { width: 760px; margin: 0 auto; padding: 64px 24px; }
h1 { font-size: 64px; line-height: 1.12; letter-spacing: -3px; }
.projects { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.project { background: #e5e8dc; padding: 28px; border-radius: 12px; }
a { color: #bc4c2f; }`;
export const finalCss =
  initialCss
    .replace("width: 760px;", "max-width: 760px;")
    .replace("font-size: 64px;", "font-size: clamp(38px, 8vw, 64px);") +
  `
@media (max-width: 560px) {
  main { padding: 32px 20px; }
  .projects { grid-template-columns: 1fr; }
}`;
export function portfolioHtml(stage: number) {
  if (stage < 2) return "";
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>林间 — 独立设计师</title><style>${stage >= 4 ? finalCss : initialCss}</style></head><body><main>
<nav style="display:flex;justify-content:space-between;font-size:13px"><strong>林间 / LIN</strong><a href="mailto:hello@example.com">聊聊新项目 ↗</a></nav>
<p style="margin-top:60px;font-size:12px;letter-spacing:2px">INDEPENDENT DESIGNER · 杭州</p>
<h1>让复杂的事情，<br>变得简单一点<span style="color:#bc4c2f">。</span></h1>
<p style="color:#77786c;line-height:1.9;margin-bottom:36px">你好，我是林间。关注数字产品、品牌与日常生活中的好设计。</p>
<div class="projects"><article class="project"><span style="font-size:32px">◒</span><h2>山野手记</h2><p>把自然的秩序带进日常。</p><small>品牌设计 / 2026</small></article><article class="project" style="background:#e8d9cb"><span style="font-size:32px">↗</span><h2>留白工作室</h2><p>为好想法，留一点空间。</p><small>数字体验 / 2026</small></article></div>
<footer style="margin-top:40px;font-size:12px;color:#77786c">© 2026 林间 · 用心设计，慢慢生长。</footer></main></body></html>`;
}

export const stages = [
  {
    name: "描述需求",
    en: "Define",
    title: "先说清楚，你想做什么。",
    goal: "把模糊的想法变成有边界的需求。先描述读者、内容和交付标准，不急着选框架。",
    prompt:
      "我是一位独立设计师，想做一个中文个人介绍网站，给潜在客户看。需要个人介绍、两个精选项目，以及邮件联系入口。风格温暖、简洁，在手机上也要好用。先不要写代码，帮我梳理需求与验收标准。",
    reply:
      "这是一个单页作品集。不需要登录和数据库。验收重点：介绍清楚、两张项目卡片、可用的邮件入口，以及 375px 手机宽度下没有横向溢出。",
    filename: "需求清单.md",
    lang: "markdown",
    before: "",
    after:
      "# 林间的个人网站\n\n- 面向潜在客户的中文单页\n- 个人介绍 + 两个精选项目\n- mailto 邮件联系入口\n- 手机与桌面均可阅读\n- 不做登录、数据库和 CMS",
    command: "# 此阶段不执行命令",
    output: "先确定范围，再进入实现。",
    result: "需求范围已明确",
    lesson:
      "好提示词首先交代「给谁用、解决什么、怎样算完成」，而不是堆技术名词。",
  },
  {
    name: "分析规划",
    en: "Plan",
    title: "让 AI 先给出一张路线图。",
    goal: "选最小可行方案，把实现步骤和检查方式摆到台面上。",
    prompt:
      "按这份需求给出最小实现方案。项目只用 HTML 和 CSS，一个 index.html 即可。列出页面结构、实现顺序和验证方式，先等我确认，不要引入额外依赖。",
    reply:
      "使用语义化 HTML，页面分为导航、介绍、项目和页脚。先做桌面版本，再用手机视口检查布局。使用 Python 静态服务器预览，最终直接交付 HTML 文件。",
    filename: "实现计划.md",
    lang: "markdown",
    before: "",
    after:
      "# 实现计划\n\n1. 编写导航与个人介绍\n2. 添加两张项目卡片\n3. 启动静态服务器\n4. 用 375px / 1280px 检查布局\n5. 核对邮件链接并提交 Git",
    command: "mkdir lin-portfolio\ncd lin-portfolio\ngit init",
    output: "初始化本地目录和版本库（教学命令示例）。",
    result: "实现范围：一个 HTML 文件",
    lesson:
      "简单任务用简单方案。让 AI 说明会改什么、如何验证，比直接要求「帮我做完」更可控。",
  },
  {
    name: "生成代码",
    en: "Build",
    title: "让第一版先长出来。",
    goal: "把页面结构变成可运行的文件。第一版不追求一次到位，先让想法可见。",
    prompt:
      "请按计划实现 index.html，样式内联，不依赖外部图片或字体。名字用“林间”，放入“山野手记”和“留白工作室”两个示例项目。邮件先用 hello@example.com 占位，并提醒我交付前替换。",
    reply:
      "已生成页面结构与桌面样式。这里先展示初稿；下一步在浏览器打开检查，尤其关注手机宽度。邮件地址为示例占位，不是实际联系方式。",
    filename: "index.html · <style>",
    lang: "css",
    before: "/* 尚未创建页面样式 */",
    after: initialCss,
    command: "# 将 AI 生成的页面保存为 index.html\ngit status --short",
    output: "?? index.html\n完整页面可在最终阶段下载。",
    result: "首个版本已生成，尚未验证",
    lesson: "代码生成不等于任务完成。预览是初稿，先看真实效果再给反馈。",
  },
  {
    name: "运行预览",
    en: "Run",
    title: "打开浏览器，问题才真正出现。",
    goal: "第一版在桌面看起来正常，但固定宽度让手机横向溢出。切换手机预览观察。",
    prompt:
      "启动本地预览，分别用 1280px 和 375px 视口检查页面。先指出问题和原因，不要马上重写整个页面。",
    reply:
      "发现 main 使用固定 width: 760px，加上内边距后超过手机视口。项目网格也始终保持两列。建议只调整容器宽度、字号和小屏网格，不改页面结构。",
    filename: "index.html · <style>",
    lang: "css",
    before: initialCss,
    after: initialCss,
    command: "python3 -m http.server 4322",
    output:
      "Serving HTTP on port 4322（示例）\n→ 浏览器访问 http://localhost:4322\n→ 375px：容器横向溢出，需修复",
    result: "发现问题：移动端布局溢出",
    lesson: "本阶段没有代码变化。查看手机预览，才知道「响应式」是否真的实现。",
  },
  {
    name: "反馈迭代",
    en: "Iterate",
    title: "给具体反馈，而不是「再好看一点」。",
    goal: "针对可复现的问题做局部修改，保留已经正确的内容与结构。",
    prompt:
      "375px 宽度下页面会横向滚动。请将 main 的固定宽度改为最大宽度，标题字号随屏幕缩放，560px 以下项目改成单列。只修改这些样式，保留文案、配色和邮件链接。",
    reply:
      "将 width 改为 max-width，标题使用 clamp()，新增小屏媒体查询。右侧切换手机预览，可以看到卡片从两列变成一列。",
    filename: "index.html · <style>",
    lang: "css",
    before: initialCss,
    after: finalCss,
    command: "# 刷新浏览器，再次检查 375px 与 1280px\ngit diff -- index.html",
    output: "检查范围：容器宽度 / 标题字号 / 项目网格\n没有修改其他页面结构。",
    result: "移动端布局已修正",
    lesson: "有效反馈包含「在哪个环境、出现什么、希望怎样、哪些不要改」。",
  },
  {
    name: "验证提交",
    en: "Verify",
    title: "看过差异，再留下一个可靠版本。",
    goal: "检查修改是否越界，确认布局与链接，再提交可以回溯的版本。",
    prompt:
      "检查这次 diff，确认只改了响应式样式。核对页面标题、两张项目卡片和 mailto 链接。列出我需要手动确认的内容；确认完成后再提交，不要把未经检查的结果说成已通过。",
    reply:
      "需要在浏览器手动确认两种宽度、卡片排列与邮件处理程序。hello@example.com 仍需换成真实地址。下方给出提交命令，不自动替你提交。",
    filename: "index.html · <style>",
    lang: "css",
    before: finalCss,
    after: finalCss,
    command:
      'git diff --check\ngit diff -- index.html\ngit add index.html\ngit commit -m "feat: add responsive portfolio"',
    output: "教学命令示例，非网页实时执行。\n手动检查后再运行 git commit。",
    result: "检查清单：布局 / 内容 / 链接",
    lesson: "Git 提交记录的是经过确认的版本，不是 AI 的一句「已经完成」。",
  },
  {
    name: "完成交付",
    en: "Ship",
    title: "交付一个能被继续使用的作品。",
    goal: "代码、预览和运行方式一起交付。让下一位使用者知道怎么打开、修改和发布。",
    prompt:
      "整理最终交付说明：如何本地启动、修改个人资料和项目内容、替换示例邮箱。保持静态网站，不增加部署系统。附上后续可选改进，不要继续扩展功能。",
    reply:
      "最终是一份无外部依赖的 index.html。可直接打开，也可通过静态服务器预览。下载后先替换姓名、作品和邮箱，再发布到任意静态托管服务。",
    filename: "交付说明.md",
    lang: "markdown",
    before: "",
    after:
      "# 交付清单\n\n- index.html：完整页面与响应式样式\n- 本地运行：python3 -m http.server 4322\n- 替换：姓名、项目介绍、示例邮箱\n- 发布：上传到任意静态托管服务\n\n下一步可选：独立项目详情页、真实作品图片。",
    command: "python3 -m http.server 4322\n# 打开 http://localhost:4322",
    output: "交付完成。下载文件后即可自行运行与修改。",
    result: "从一句话，到一个可运行的网站",
    lesson: "好的交付不只是一份代码，还包括运行方式、已知限制与后续修改入口。",
  },
];
