import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { CopyButton } from "./CopyButton";
const scenes = [
  {
    label: "说清需求",
    title: "先把“完成”说具体。",
    before: "帮我做个好看的网站。",
    after:
      "为独立设计师做一个中文单页，给潜在客户看。包含个人介绍、两个精选项目和邮件入口。375px 手机下无横向溢出。不做登录和数据库。先梳理需求与验收标准。",
    reason: "目标、内容、范围和验收标准齐全，AI 才有明确的行动依据。",
    href: "/case/from-scratch#define",
    link: "回看需求阶段",
  },
  {
    label: "提供上下文",
    title: "已有项目，先读再改。",
    before: "给这个 Todo 加备注。",
    after:
      "先阅读表单、App、API 封装、路由和数据库，说明任务的数据流。增加可选 notes，支持新增、编辑、清空；保留已有任务、筛选和拖拽。先列计划，暂不改代码。",
    reason: "指出需要理解的地方，同时给出必须保留的行为。",
    href: "/case/todo-app#understand",
    link: "回看项目地图",
  },
  {
    label: "反馈迭代",
    title: "把现象变成可复现的问题。",
    before: "手机上不好看，再优化一下。",
    after:
      "375px 下页面横向溢出。将 main 改为最大宽度，标题字号随屏幕缩放，560px 以下卡片单列。只改这些样式，保留配色、文案与邮件链接。",
    reason: "说清环境、现象、预期与边界，修改才能收敛。",
    href: "/case/from-scratch#iterate",
    link: "回看响应式修复",
  },
  {
    label: "运行验证",
    title: "让“已经完成”有证据。",
    before: "AI 说已经保存，应该没问题。",
    after:
      "新增备注后重新读取，再编辑、清空并重新读取。只切换完成状态时，旧备注应保留。测试旧数据、筛选和排序，列出实际执行的命令、结果与未检查项。",
    reason: "输入、保存、重新读取要形成闭环，也要确认原有功能没有回归。",
    href: "/case/todo-app#verify",
    link: "查看案例验证记录",
  },
  {
    label: "检查与提交",
    title: "留下一个能回溯的版本。",
    before: "直接把所有改动都提交吧。",
    after:
      "先查看 git status 与 git diff。确认只包含本次任务、没有无关文件。运行检查后，只暂存相关文件，再提交一个职责明确的版本。",
    reason: "用差异确认范围，用验证确认行为，再记录版本。",
    href: "/learn/workflow/git/",
    link: "学习 Git 工作流",
  },
];
const template =
  "目标：为谁解决什么问题？\n上下文：现有项目、相关文件与运行方式。\n范围：这次做什么，保留哪些已有行为？\n计划：先读现状、列步骤，确认后实现。\n验证：运行哪些命令，检查哪些用户操作？\n交付：改动文件、实际结果与剩余事项。";
export function ReviewPlayground() {
  const [index, setIndex] = useState(0);
  const current = scenes[index];
  return (
    <>
      <div className="review-workbench">
        <nav className="review-nav" aria-label="选择协作方法">
          {scenes.map((x, i) => (
            <button
              key={x.label}
              type="button"
              aria-pressed={index === i}
              onClick={() => setIndex(i)}
            >
              <span>0{i + 1}</span>
              {x.label}
            </button>
          ))}
        </nav>
        <div className="review-content">
          <h2>{current.title}</h2>
          <div className="review-prompt bad">
            <span className="small-label">信息还不够</span>
            <p>{current.before}</p>
          </div>
          <div className="review-prompt">
            <span className="small-label">可以直接参考的表达</span>
            <p>{current.after}</p>
            <CopyButton text={current.after} />
          </div>
          <p className="review-reason">{current.reason}</p>
          <a className="p-button p-button-quiet" href={current.href}>
            {current.link}
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <section className="review-template">
        <h2>把这份协作模板带走。</h2>
        <pre>{template}</pre>
        <div className="review-template-actions">
          <CopyButton text={template} label="复制完整模板" />
          <a href="/case/from-scratch" className="p-button">
            回到交互案例 <ArrowUpRight size={14} />
          </a>
        </div>
      </section>
    </>
  );
}
