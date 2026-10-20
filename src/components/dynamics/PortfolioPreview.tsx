import { activities } from "@/data/activities";
// Browser frame adapted from the local Magic UI Safari; the viewport renders actual HTML.
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Globe2,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { portfolioHtml } from "@/data/course";
import { Slider } from "../ui/slider";
import { Activity } from "./Activity";

export function PortfolioPreview({
  html,
  width,
  onWidthChange,
  focus = "",
  compact = false,
  position,
}: {
  html: string;
  width: number;
  onWidthChange: (n: number) => void;
  focus?: string;
  compact?: boolean;
  position?: { current: { top: number; left: number } };
}) {
  const container = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const localPosition = useRef({ top: 0, left: 0 });
  const scroll = position ?? localPosition;
  const [available, setAvailable] = useState(600);
  useEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setAvailable(entry.contentRect.width),
    );
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const scale = Math.min(1, Math.max(1, available - 32) / width);
  const canvasHeight = compact ? 330 : 460;
  const focusCss = focus
    ? `<style>${focus} { outline: 3px solid #315df4 !important; outline-offset: 5px; } </style>`
    : "";
  return (
    <div className={`portfolio-preview ${compact ? "compact" : ""}`}>
      <div className="preview-toolbar">
        <span className="window-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="preview-address">
          <Globe2 size={12} /> lin-portfolio.local
        </span>
        <div className="preview-devices">
          <button
            type="button"
            aria-label="375px 手机预览"
            aria-pressed={width === 375}
            onClick={() => onWidthChange(375)}
          >
            <Smartphone size={15} />
          </button>
          <button
            type="button"
            aria-label="768px 平板预览"
            aria-pressed={width === 768}
            onClick={() => onWidthChange(768)}
          >
            <Tablet size={16} />
          </button>
          <button
            type="button"
            aria-label="1280px 桌面预览"
            aria-pressed={width === 1280}
            onClick={() => onWidthChange(1280)}
          >
            <Monitor size={16} />
          </button>
        </div>
      </div>
      <div
        className="preview-canvas"
        ref={container}
        style={{ height: canvasHeight }}
      >
        <div
          className="preview-scaled"
          style={{ width: width * scale, height: canvasHeight - 32 }}
        >
          <iframe
            ref={frame}
            title={`作品网站 · ${width}px 视口`}
            sandbox="allow-same-origin"
            srcDoc={html.replace("</head>", `${focusCss}</head>`)}
            style={{
              width,
              height: (canvasHeight - 32) / scale,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
            onLoad={() => {
              const win = frame.current?.contentWindow;
              if (!win) return;
              const target = focus ? win.document.querySelector(focus) : null;
              const top = target
                ? target.getBoundingClientRect().top + win.scrollY - 32
                : scroll.current.top;
              win.scrollTo(scroll.current.left, Math.max(0, top));
              window.requestAnimationFrame(() =>
                window.requestAnimationFrame(() =>
                  win.addEventListener(
                    "scroll",
                    () => {
                      scroll.current = { top: win.scrollY, left: win.scrollX };
                    },
                    { passive: true },
                  ),
                ),
              );
            }}
          />
        </div>
      </div>
      <div className="preview-bottom">
        <span className="preview-dimension">
          {width}px <span>视口</span>
        </span>
        <Slider
          value={width}
          onChange={onWidthChange}
          label="调整预览视口宽度"
        />
        <span className="preview-scale">{Math.round(scale * 100)}%</span>
      </div>
    </div>
  );
}

export function HeroDemo() {
  const [step, setStep] = useState(0);
  const [width, setWidth] = useState(1280);
  const labels = ["生成初稿", "发现问题", "反馈修复"];
  const prompts = [
    "为独立设计师林间做一个中文作品网站，包含个人介绍、两个精选项目和邮件入口。",
    "在 375px 手机宽度下查看第一版，找到页面溢出的原因。",
    "手机下出现横向滚动。请调整容器宽度、标题字号和项目网格，保留其他内容。",
  ];
  function select(i: number) {
    setStep(i);
    setWidth(i === 0 ? 1280 : 375);
  }
  return (
    <div className="hero-demo">
      <div className="hero-demo-bar">
        <span>
          <span className="status-dot" /> 从初稿，到可交付
        </span>
        <span>案例预览 · 可操作</span>
      </div>
      <div className="hero-demo-body">
        <div className="hero-demo-story">
          <div className="hero-demo-tabs">
            {labels.map((label, i) => (
              <button
                type="button"
                key={label}
                aria-pressed={step === i}
                onClick={() => select(i)}
              >
                <span>0{i + 1}</span>
                {label}
              </button>
            ))}
          </div>
          <span className="small-label">
            {step === 2 ? "带着观察，给出反馈" : "给 Agent 的一句话"}
          </span>
          <p className="hero-prompt">{prompts[step]}</p>
          <div className={`hero-result-note ${step === 1 ? "warning" : ""}`}>
            <span>{step === 1 ? "!" : "↗"}</span>
            <p>
              {
                [
                  "第一版已经能打开。接下来，换一个屏幕看看。",
                  "容器固定为 760px，超出了手机屏幕。",
                  "两列变一列，标题与容器也适应了手机宽度。",
                ][step]
              }
            </p>
          </div>
          <a href={`/case/from-scratch#${["build", "run", "iterate"][step]}`}>
            进入完整案例 <ArrowUpRight size={15} />
          </a>
        </div>
        <PortfolioPreview
          compact
          html={portfolioHtml(step === 2 ? 4 : 2)}
          width={width}
          onWidthChange={setWidth}
        />
      </div>
    </div>
  );
}

export function ResponsiveScene() {
  const [fixed, setFixed] = useState(false);
  const [width, setWidth] = useState(375);
  return (
    <Activity
      contract={activities.responsive}
      number="05"
      title="同一份页面，在手机上发生了什么？"
      caption="拖动宽度滑杆，或切换修改前后；这里运行的是案例的实际 HTML 与 CSS。"
    >
      <div className="responsive-options">
        <div className="segmented">
          <button
            type="button"
            aria-pressed={!fixed}
            onClick={() => setFixed(false)}
          >
            修改前
          </button>
          <button
            type="button"
            aria-pressed={fixed}
            onClick={() => setFixed(true)}
          >
            修复后
          </button>
        </div>
        <span className={fixed ? "p-badge good" : "p-badge warn"}>
          {fixed ? "自适应宽度" : "固定宽度 760px"}
        </span>
      </div>
      <PortfolioPreview
        html={portfolioHtml(fixed ? 4 : 2)}
        width={width}
        onWidthChange={setWidth}
      />
      <div className="scene-observation">
        <span>{fixed ? "✓" : "!"}</span>
        <p>
          {fixed
            ? "最大宽度限制桌面尺寸，小屏时容器自然收缩，项目卡片变为单列。"
            : "把视口缩小到 375px。内容仍按固定宽度排版，右边的部分被挤出了屏幕。"}
        </p>
      </div>
    </Activity>
  );
}
