import { stages, portfolioHtml } from "@/data/course";
import {
  LessonStudio,
  type LessonStep,
  type HighlightedStage,
} from "./LessonStudio";
export type { HighlightedStage } from "./LessonStudio";

export function CaseWorkbench({
  highlighted,
}: {
  highlighted: HighlightedStage[];
}) {
  const kinds: LessonStep["kind"][] = [
    "brief",
    "plan",
    "code",
    "preview",
    "diff",
    "terminal",
    "delivery",
  ];
  const hints = [
    "先告诉 AI，你想做什么。",
    "先看计划，不急着写代码。",
    "确认计划，让代码开始生长。",
    "打开页面，亲眼找一个问题。",
    "说清问题，只改需要改的地方。",
    "检查之后，再记录一个版本。",
    "把能继续使用的作品交出来。",
  ];
  const steps: LessonStep[] = stages.map((stage, i) => ({
    label: stage.name,
    title: stage.title,
    hint: hints[i],
    prompt: stage.prompt,
    reply:
      i === 3
        ? "本地预览已在右侧展示。先看桌面，再点手机图标切换到 375px。观察标题和项目卡片，是否还能完整显示？"
        : stage.reply,
    kind: kinds[i],
    filename:
      i === 2 ? "index.html" : i === 5 ? "终端 · 教学命令回放" : stage.filename,
    code:
      i === 2
        ? portfolioHtml(2).replace(/></g, ">\n<")
        : i === 5
          ? `$ git diff --check\n# 检查空白错误\n\n$ git diff -- index.html\n# 确认只有响应式样式变化\n\n# 手动检查 375px / 1280px、内容与邮件入口\n# hello@example.com 需要替换为真实邮箱\n\n# 确认以上检查后，再执行：\n$ git add index.html\n$ git commit -m "feat: add responsive portfolio"`
          : stage.after,
    highlighted: i === 2 ? undefined : highlighted[i],
    html: portfolioHtml(i),
    items:
      i === 0
        ? [
            "给潜在客户看的中文作品集",
            "个人介绍 + 两个精选项目",
            "邮件联系入口，交付前替换邮箱",
            "375px 手机 / 1280px 桌面均可阅读",
            "不做登录、数据库与 CMS",
          ]
        : [
            "用语义化 HTML 搭好页面结构",
            "添加介绍、项目卡片与联系入口",
            "启动本地静态服务器预览",
            "切换手机视口，发现并修复问题",
            "查看差异、手动验证，再提交 Git",
          ],
    lesson: stage.lesson,
    detail: <p>{stage.goal}</p>,
  }));
  return (
    <LessonStudio
      steps={steps}
      name="林间的个人网站"
      next={{ href: "/case/todo-app", label: "试试已有项目" }}
    />
  );
}
