export type Question = { title: string; why: string; options: string[] };
export const homepageQuestions: Question[] = [
  {
    title: "给谁看，看完要做什么？",
    why: "用途决定你要放哪些内容，而不是先选颜色。",
    options: [
      "给实习面试官看，看完能通过邮件联系我",
      "给同学看，了解我做过的项目",
    ],
  },
  {
    title: "页面上必须有什么？",
    why: "只放真正需要的内容，避免 AI 编出一段不存在的经历。",
    options: [
      "名字和一句话介绍",
      "两个项目：名称、说明、链接",
      "一个邮件联系入口",
      "炫酷的动画背景",
    ],
  },
  {
    title: "这次不做什么？",
    why: "写下边界，防止 Agent 把一个小网页做成复杂的工程。",
    options: [
      "不用框架，只写 HTML 和 CSS",
      "网页只用一个 index.html",
      "不做暗色模式和动画",
    ],
  },
  {
    title: "怎样算做完？",
    why: "“好看”很难检查；“375px 下没有横向滚动条”就能检查。",
    options: [
      "375px 和 1280px 宽度都完整显示，无横向滚动",
      "邮箱使用正确的 mailto 链接，能尝试打开邮件应用",
    ],
  },
  {
    title: "还不确定什么？",
    why: "不确定的事可以先问，不必让 AI 悄悄替你决定。",
    options: ["头像先用占位", "项目链接先用 #，标注待替换"],
  },
];
export const todoQuestions: Question[] = [
  {
    title: "要解决什么问题？",
    why: "先说用户的困难，不急着决定代码怎么改。",
    options: ["任务标题太短，想记录细节，比如“带学生证”"],
  },
  {
    title: "必须包含哪些行为？",
    why: "新增、编辑、清空和保存，是不同的行为。",
    options: [
      "新建和编辑时能填写备注",
      "列表显示备注，也可以主动清空",
      "刷新后备注还在",
    ],
  },
  {
    title: "哪些不能动？",
    why: "在已有项目里，“不做什么”就是“不要动哪里”。",
    options: ["分类、优先级、筛选和拖拽保持不变", "不换框架，不重写项目"],
  },
  {
    title: "怎样算做完？",
    why: "不仅测新功能，也要试一遍原来的功能。",
    options: [
      "新建备注，刷新后还能看到",
      "勾选完成后，备注保持不变",
      "原有分类、优先级、筛选和拖拽照常",
    ],
  },
  {
    title: "什么需要先问？",
    why: "旧任务不能因为加了新功能就坏掉。",
    options: ["旧任务没有备注怎么办？请先给方案"],
  },
];
export const questionLabels = [
  "给谁看",
  "必须有",
  "这次不做",
  "怎样算做完",
  "还不确定",
];
export const homepageBrief = [
  "实习面试官，看完能通过邮件联系我。",
  "名字与介绍、两个项目、邮箱。",
  "不用框架；网页只用一个 index.html；不做暗色模式和动画。",
  "375px 和 1280px 完整显示，无横向滚动；检查邮箱链接。",
  "头像占位；项目链接用 #，交付前替换。",
];
export const todoBrief = [
  "给任务补充标题放不下的细节。",
  "新增、编辑、清空备注；列表显示；刷新后保留。",
  "不动分类、优先级、筛选和拖拽；不重写项目。",
  "刷新、勾选完成后备注都在；原有功能照常。",
  "旧任务默认空备注，先确认兼容方案。",
];
export const todoQuestionLabels = [
  "要解决的问题",
  "必须有的行为",
  "哪些不能动",
  "怎样算做完",
  "还不确定",
];
export function makePrompt(answers: string[], todo = false) {
  return (
    "请先不要写代码，先告诉我你打算怎么做。\n\n" +
    answers
      .map(
        (a, i) =>
          `【${(todo ? todoQuestionLabels : questionLabels)[i]}】${a || "待补充"}`,
      )
      .join("\n") +
    "\n\n请列出页面或功能结构、要创建或修改的文件、需要我补充的信息。"
  );
}
