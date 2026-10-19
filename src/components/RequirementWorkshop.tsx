import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Pencil, Sparkles } from "lucide-react";
import { ChoiceGroup } from "./ui/choice-group";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./ui/resizable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { TypingAnimation } from "./ui/typing-animation";
import { CopyButton } from "./CopyButton";

const questions = [
  {
    label: "给谁看",
    title: "这个网站，你想给谁看？",
    hint: "同样是个人网站，给面试官看，和给朋友看，重点会不一样。",
    options: ["找实习时，发给面试官", "发给同学和朋友，分享作品"],
    replies: [
      "那就让对方很快找到：你做过什么、会什么、怎么联系你。",
      "那可以多一点个人风格，但作品和介绍还是要容易找到。",
    ],
  },
  {
    label: "看完做什么",
    title: "对方看完，你希望发生什么？",
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
    title: "第一版，你手里有什么内容？",
    hint: "不需要等到有很厉害的作品。一个认真做过的课程项目，也可以讲。",
    options: [
      "一段介绍、两个课程项目、一个邮箱",
      "内容还没整理好，先用示例占个位置",
    ],
    replies: [
      "已经够开始了。每个项目再补一句：做了什么、你负责什么。",
      "可以先搭样子。把示例标出来，发给别人前再换成自己的内容。",
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
    title: "做好之后，你准备怎么检查？",
    hint: "“好看一点”不太好检查。换成几件你能亲手试的事。",
    options: [
      "手机不横着溢出，两个项目完整，邮箱能点开",
      "手机和电脑都能读，示例内容和邮箱已替换",
    ],
    replies: [
      "这几项都能直接试。后面让 AI 改完，我们就按这些看。",
      "这样检查很具体。页面能用，内容也确实是你的，才适合发出去。",
    ],
  },
];
export type RequirementDraft = { answers: string[]; task: string | null };
export const emptyRequirements: RequirementDraft = {
  answers: Array(5).fill(""),
  task: null,
};
function taskFrom(answers: string[]) {
  return `我想做一个中文个人作品网站。\n\n给谁看：${answers[0] || "[补充：给谁看]"}。\n希望对方：${answers[1] || "[补充：看完做什么]"}。\n第一版内容：${answers[2] || "[补充：准备放什么]"}。\n这次先不做：${answers[3] || "[补充：这次不做什么]"}。\n做好后检查：${answers[4] || "[补充：怎样检查]"}。\n\n先帮我看看哪里还没说清楚，再给一个简单的制作计划。先别写代码。`;
}

export function RequirementWorkshop({
  value,
  onChange,
  onContinue,
}: {
  value: RequirementDraft;
  onChange: (value: RequirementDraft) => void;
  onContinue: (task: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState("");
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
  const task = value.task ?? taskFrom(value.answers);
  const answered = value.answers.filter(Boolean).length;
  function answer(text: string) {
    onChange({
      answers: value.answers.map((old, i) => (i === step ? text : old)),
      task: null,
    });
    setDraft("");
  }
  function go(index: number) {
    setStep(index);
    setDraft("");
    setView("talk");
  }
  const conversation = (
    <div
      className={`requirements-conversation ${step === 5 ? "is-final" : ""}`}
    >
      <div className="requirements-kicker">
        <Sparkles size={15} /> 一起把想法说清楚 <span>01 / 需求分析</span>
      </div>
      <div className="requirements-question" key={step}>
        <span className="eyebrow">
          {step < 5 ? `小问题 0${step + 1} / 05` : "把刚才的想法连起来"}
        </span>
        <h2>{current?.title || "现在，这就是你要交给 AI 的任务。"}</h2>
        <p>
          {current?.hint ||
            "读一遍，改成自己的说法。还有空白的地方，可以返回补充，也可以直接在这里写。"}
        </p>
      </div>
      {current ? (
        <>
          <ChoiceGroup
            options={current.options}
            value={value.answers[step]}
            onChange={answer}
          />
          {value.answers[step] && (
            <div className="requirements-response" aria-live="polite">
              <Sparkles size={16} />
              <p>
                <TypingAnimation
                  key={`${step}-${value.answers[step]}`}
                  text={
                    current.replies[
                      current.options.indexOf(value.answers[step])
                    ] ||
                    "记下来了。右边会保留你的原话；也想一想，后面能不能按这句话检查做出来的页面。"
                  }
                />
              </p>
            </div>
          )}
          <form
            className="requirements-own-answer"
            onSubmit={(event) => {
              event.preventDefault();
              if (draft.trim()) answer(draft.trim());
            }}
          >
            <label htmlFor="own-requirement">
              <Pencil size={13} /> 也可以用自己的话说
            </label>
            <Textarea
              id="own-requirement"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="比如：我想把课程作业整理好，找暑期实习时发出去。"
              rows={2}
            />
            <button
              type="submit"
              className="quiet-button"
              disabled={!draft.trim()}
            >
              记下这句话 <ArrowRight size={14} />
            </button>
          </form>
        </>
      ) : (
        <div className="requirements-final">
          {answered < 5 && (
            <p className="requirements-missing">
              还有 {5 - answered}{" "}
              处没填，已用方括号标出。你可以先继续，不会锁住步骤。
            </p>
          )}
          <label htmlFor="requirements-task">可以直接修改这段任务说明</label>
          <Textarea
            id="requirements-task"
            value={task}
            onChange={(e) => onChange({ ...value, task: e.target.value })}
            rows={8}
          />
          <CopyButton text={task} label="复制我的任务" />
          <p className="requirements-simulation">
            你的回答会带进下一轮计划提示词。后面的代码和工具仍按统一的“林间作品集”样例回放，不会按回答实时生成网站。
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
          onClick={() => (step < 5 ? go(step + 1) : onContinue(task))}
        >
          {step < 5 ? "接着想一件事" : "带着这份任务，看制作计划"}
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
  const record = (
    <div className="requirements-record">
      <div className="requirements-record-heading">
        <span className="eyebrow">不是标准答案，是你的选择</span>
        <span>{answered} / 5 已记下</span>
      </div>
      <h2>
        想法正在变具体<span>一份慢慢补完整的任务草稿。</span>
      </h2>
      <ol>
        {questions.map((question, i) => (
          <li key={question.label} data-filled={!!value.answers[i]}>
            <button onClick={() => go(i)}>
              <span>
                {value.answers[i] ? <Check size={13} /> : `0${i + 1}`}
              </span>
              <div>
                <small>{question.label}</small>
                <p>{value.answers[i] || "还没想好也没关系，点这里回来补。"}</p>
              </div>
              <Pencil size={13} />
            </button>
          </li>
        ))}
      </ol>
      <div className="requirements-example">
        <p>想先看完整过程？可以填入一组示例，再随时改掉。</p>
        <button
          className="quiet-button"
          onClick={() =>
            onChange({
              answers: questions.map((q) => q.options[0]),
              task: null,
            })
          }
        >
          填入示例回答 <ArrowRight size={13} />
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
            <TabsTrigger value="talk">一起想</TabsTrigger>
            <TabsTrigger value="record">我的草稿 · {answered}/5</TabsTrigger>
          </TabsList>
          <TabsContent value="talk">{conversation}</TabsContent>
          <TabsContent value="record">{record}</TabsContent>
        </Tabs>
      )}
    </div>
  );
}
