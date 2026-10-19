import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { ChoiceGroup } from "./ui/choice-group";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./ui/resizable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { TypingAnimation } from "./ui/typing-animation";
import { CopyButton } from "./CopyButton";

const questions = [
  {
    label: "给谁看",
    title: "这个网站，是给谁看的？",
    hint: "案例里的林间是一位设计师。同样是个人网站，给客户和给朋友看，重点会不一样。",
    options: ["给可能合作的客户看", "给同学和朋友看，分享作品"],
    replies: [
      "给客户看，就要让对方很快找到：林间做过什么、擅长什么、怎么联系。",
      "给朋友看，可以多一点个人风格，但作品和介绍还是要容易找到。",
    ],
  },
  {
    label: "看完做什么",
    title: "对方看完，希望发生什么？",
    hint: "想象一下：对方打开网站，花了一分钟，然后呢？",
    options: [
      "先看两个项目，再通过邮箱联系我",
      "了解我的学习经历，看看我的作品",
    ],
    replies: [
      "好，项目介绍要清楚，联系入口也别藏得太深。",
      "那就把自我介绍和项目放在前面，不需要先堆一屏特效。",
    ],
  },
  {
    label: "先放什么",
    title: "第一版，准备放什么内容？",
    hint: "林间已经有一段介绍和两个项目。这些内容就能组成一个简单的作品网站。",
    options: [
      "一段介绍、两个精选项目、一个邮箱",
      "内容还没整理好，先用示例占个位置",
    ],
    replies: [
      "已经够开始了。每个项目再补一句：做了什么、你负责什么。",
      "内容还没整理时，也能先用示例搭样子。示例需要明确标出，正式发布前再替换。",
    ],
  },
  {
    label: "先不做什么",
    title: "登录、评论、后台，要一起做吗？",
    hint: "先做一个能发给别人看的版本。其他想法可以留着，不用这次全实现。",
    options: [
      "这次不做登录、评论和后台",
      "把这些记到以后，这次只做展示和邮箱联系",
    ],
    replies: [
      "好，这次就把介绍、项目和联系做好。不需要账号，也不需要数据库。",
      "先记下来就好。等真有人需要，再决定要不要加。",
    ],
  },
  {
    label: "怎样算做好",
    title: "做好之后，怎样知道它能用？",
    hint: "“好看一点”不太好检查。换成能观察到的结果，后面才知道该改哪里。",
    options: [
      "手机不横着溢出，两个项目完整，邮箱能点开",
      "手机和电脑都能读，示例内容和邮箱已替换",
    ],
    replies: [
      "这几项都能直接试。后面让 AI 改完，我们就按这些看。",
      "这把页面显示和内容检查分开了。页面能用、示例已替换，才适合正式发布。",
    ],
  },
];
const exampleAnswers = questions.map((question) => question.options[0]);
const exampleTask = `为独立设计师“林间”做一个中文个人作品网站，给可能合作的客户看。\n\n包含一段个人介绍、两个精选项目和邮件联系入口。希望对方看完项目后，可以通过邮箱联系林间。\n\n这次不做登录、评论、数据库和后台。页面在 375px 手机和 1280px 电脑上都能完整阅读，项目内容齐全，邮箱入口可以点开。示例邮箱在正式发布前替换。\n\n先看看哪里还没说清楚，再给一个简单的制作计划，先别写代码。`;

export function RequirementWorkshop({
  onContinue,
}: {
  onContinue: () => void;
}) {
  const [step, setStep] = useState(0);
  const [variant, setVariant] = useState(0);
  const [view, setView] = useState("talk");
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const media = matchMedia("(max-width: 760px)");
    const sync = () => setMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const current = questions[step];
  function go(index: number) {
    setStep(index);
    setVariant(0);
    setView("talk");
  }
  const conversation = (
    <div
      className={`requirements-conversation ${step === 5 ? "is-final" : ""}`}
    >
      <div className="requirements-kicker">
        <Sparkles size={15} /> 一个想法怎样变清楚 <span>01 / 需求分析示例</span>
      </div>
      <div className="requirements-question" key={step}>
        <span className="eyebrow">
          {step < 5 ? `看看第 0${step + 1} 件事 / 05` : "把这些信息连起来"}
        </span>
        <h2>{current?.title || "一句模糊的想法，变成了一份清楚的任务。"}</h2>
        <p>
          {current?.hint ||
            "给谁看、放什么、先不做什么、怎样检查，都在这段示例里了。接下来看 AI 怎样安排制作步骤。"}
        </p>
      </div>
      {current ? (
        <>
          <span className="tool-note">两种情况对比 · 本案例采用第一种</span>
          <ChoiceGroup
            options={current.options}
            value={current.options[variant]}
            onChange={(text) => setVariant(current.options.indexOf(text))}
          />
          <div className="requirements-response" aria-live="polite">
            <Sparkles size={16} />
            <p>
              <TypingAnimation
                key={`${step}-${variant}`}
                text={current.replies[variant]}
              />
            </p>
          </div>
        </>
      ) : (
        <div className="requirements-final">
          <pre className="template-pre">{exampleTask}</pre>
          <CopyButton text={exampleTask} label="复制示例" />
          <p className="requirements-simulation">
            这里只展示林间作品集的需求分析过程，不收集回答，也不实时生成网站。
          </p>
        </div>
      )}
      <div className="requirements-actions">
        <button
          className="quiet-button"
          onClick={() => go(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          <ArrowLeft size={14} /> 上一个
        </button>
        <button
          className="primary-button"
          onClick={() => (step < 5 ? go(step + 1) : onContinue())}
        >
          {step < 5 ? "看下一项" : "观看制作计划"}
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
  const record = (
    <div className="requirements-record">
      <div className="requirements-record-heading">
        <span className="eyebrow">案例里的需求</span>
        <span>林间 / 个人作品网站</span>
      </div>
      <h2>
        从想法到清楚的任务<span>五件小事，让需求有了轮廓。</span>
      </h2>
      <ol>
        {questions.map((question, i) => (
          <li key={question.label} data-filled={step === i}>
            <button onClick={() => go(i)}>
              <span>{`0${i + 1}`}</span>
              <div>
                <small>{question.label}</small>
                <p>{exampleAnswers[i]}</p>
              </div>
              <ArrowRight size={13} />
            </button>
          </li>
        ))}
      </ol>
      <div className="requirements-example">
        <p>这些信息怎样合在一起？</p>
        <button className="quiet-button" onClick={() => go(5)}>
          查看完整任务示例 <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
  return (
    <div className="requirements-workshop">
      <nav className="requirements-nav" aria-label="需求分析的小问题">
        {[...questions.map((q) => q.label), "整理任务"].map((label, i) => (
          <button
            key={label}
            onClick={() => go(i)}
            aria-current={step === i ? "step" : undefined}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {label}
            {step === i && <motion.i layoutId="requirements-progress" />}
          </button>
        ))}
      </nav>
      {!mobile ? (
        <div className="requirements-desktop">
          <ResizablePanelGroup
            orientation="horizontal"
            id="requirements-panels"
          >
            <ResizablePanel defaultSize="52%" minSize="35%">
              {conversation}
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize="48%" minSize="30%">
              {record}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      ) : (
        <Tabs
          className="requirements-mobile"
          value={view}
          onValueChange={setView}
        >
          <TabsList aria-label="需求分析视图">
            <TabsTrigger value="talk">过程讲解</TabsTrigger>
            <TabsTrigger value="record">案例需求</TabsTrigger>
          </TabsList>
          <TabsContent value="talk">{conversation}</TabsContent>
          <TabsContent value="record">{record}</TabsContent>
        </Tabs>
      )}
    </div>
  );
}
