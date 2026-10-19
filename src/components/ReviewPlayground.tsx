import { useState } from "react";
import { ArrowRight, Play, RotateCcw } from "lucide-react";
import { TypingAnimation } from "./ui/typing-animation";
import { Accordion } from "./ui/accordion";
import { CopyButton } from "./CopyButton";
const scenes = [
  {
    label: "说清需求",
    title: "愿望，怎样变成任务？",
    before: "帮我做个好看的网站。",
    after:
      "为独立设计师做一个中文单页，给潜在客户看。包含个人介绍、两个精选项目和邮件入口。375px 手机下无横向溢出。不做登录和数据库。",
    takeaway: "交代给谁用、做什么、怎样算完成。技术名词不是重点。",
  },
  {
    label: "限定修改",
    title: "反馈，怎样不变成重写？",
    before: "手机上不好看，再优化一下。",
    after:
      "375px 下页面横向溢出。将 main 改为最大宽度，标题字号随屏幕缩放，560px 以下卡片单列。只改这些样式，保留配色、文案与邮件链接。",
    takeaway: "反馈要有环境、现象、预期和不变的边界。",
  },
  {
    label: "真实验证",
    title: "一句完成，怎样得到证据？",
    before: "AI 说已经保存，应该没问题。",
    after:
      "新增一条备注 → 刷新后读取 → 编辑并保存 → 清空并刷新 → 切换完成状态。检查旧任务、筛选和拖拽。记录实际结果，不把未执行的检查说成通过。",
    takeaway: "代码生成不等于功能完成；把完整用户行为走一遍。",
  },
  {
    label: "小步提交",
    title: "一次修改，怎样可以回溯？",
    before: "直接把所有改动都提交吧。",
    after:
      "先 git status，再 git diff。确认只包含本次任务、没有密钥和无关文件。验证通过后，提交一个职责单一的版本。不要覆盖他人已有修改。",
    takeaway: "先检查，再提交。Git 保存的是确认过的改动，不是 AI 的承诺。",
  },
];
const template =
  "目标：为谁解决什么问题？\n上下文：技术栈、关键文件、已有约束。\n范围：做什么，明确不做什么。\n计划：先解释现状，等确认再实现。\n验证：运行什么命令，检查哪些行为？\n交付：实际结果、改动文件与剩余事项。";
export function ReviewPlayground() {
  const [index, setIndex] = useState(0);
  return (
    <div className="focus-panel">
      <div className="review-picker">
        <nav className="review-options" aria-label="选择复盘场景">
          {scenes.map((scene, i) => (
            <button
              type="button"
              key={scene.label}
              aria-pressed={index === i}
              onClick={() => setIndex(i)}
            >
              <span>0{i + 1}</span>
              {scene.label}
              <ArrowRight size={13} />
            </button>
          ))}
        </nav>
        <ReviewScene key={index} scene={scenes[index]} />
      </div>
      <div className="review-bottom">
        <Accordion
          items={[
            {
              title: "带走一份可复用的协作模板",
              content: (
                <>
                  <pre className="template-pre">{template}</pre>
                  <CopyButton text={template} label="复制模板" />
                </>
              ),
            },
            {
              title: "还有两件事，工具不能替你决定",
              content: (
                <>
                  <p>
                    先读项目，再做计划。跨轮次保留关键决策与未完成事项，避免 AI
                    凭空猜测范围。
                  </p>
                  <p>
                    许可证、密钥、破坏性命令和交付质量仍由人判断。公开仓库不等于可以任意再分发。
                  </p>
                </>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
function ReviewScene({ scene }: { scene: (typeof scenes)[number] }) {
  const [state, setState] = useState<"before" | "typing" | "after">("before");
  return (
    <section className="review-scene">
      <span className="eyebrow">MAKE THE NEXT PROMPT BETTER</span>
      <h2>{scene.title}</h2>
      <p>
        {state === "after"
          ? scene.takeaway
          : "把模糊的表达，换成能被执行与检查的要求。"}
      </p>
      <div className="prompt-comparison">
        <div>
          <small>{state === "before" ? "模糊的表达" : "更清楚的协作"}</small>
          <p>
            {state === "typing" ? (
              <TypingAnimation
                text={scene.after}
                onComplete={() => setState("after")}
              />
            ) : state === "before" ? (
              scene.before
            ) : (
              scene.after
            )}
          </p>
        </div>
      </div>
      {state === "before" ? (
        <button
          className="primary-button"
          type="button"
          onClick={() => setState("typing")}
        >
          <Play size={13} />
          把它说具体
        </button>
      ) : state === "after" ? (
        <div className="setup-next">
          <button
            className="quiet-button"
            type="button"
            onClick={() => setState("before")}
          >
            <RotateCcw size={13} />
            再比较一次
          </button>
          <CopyButton text={scene.after} label="复制这个例子" />
        </div>
      ) : (
        <span className="tool-note">正在改写…</span>
      )}
    </section>
  );
}
