import { motion } from "motion/react";
import { useMotionPreference } from "../dynamics/Activity";
import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
export function StageNav({
  labels,
  stage,
  onChange,
}: {
  labels: readonly string[];
  stage: number;
  onChange: (n: number) => void;
}) {
  const reduce = useMotionPreference();
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    const list = nav.current;
    const active = list?.querySelector<HTMLButtonElement>(
      '[aria-current="step"]',
    );
    if (!list || !active) return;
    const left =
      active.getBoundingClientRect().left -
      list.getBoundingClientRect().left +
      list.scrollLeft;
    list.scrollTo({
      left: left - (list.clientWidth - active.clientWidth) / 2,
      behavior: reduce ? "instant" : "smooth",
    });
  }, [stage, reduce]);
  return (
    <nav ref={nav} className="case-stage-nav" aria-label="选择开发阶段">
      {labels.map((label, i) => (
        <button
          type="button"
          key={label}
          aria-current={stage === i ? "step" : undefined}
          onClick={() => onChange(i)}
        >
          <span className={`stage-number ${i < stage ? "past" : ""}`}>
            {i < stage ? <Check size={12} /> : String(i + 1).padStart(2, "0")}
          </span>
          <span>{label}</span>
          {stage === i && (
            <motion.i
              layoutId="case-active-stage"
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: "spring", bounce: 0.12, duration: 0.35 }
              }
            />
          )}
        </button>
      ))}
    </nav>
  );
}
export function StageFooter({
  stage,
  total,
  onChange,
  next,
}: {
  stage: number;
  total: number;
  onChange: (n: number) => void;
  next: { href: string; label: string };
}) {
  return (
    <div className="case-stage-footer">
      <button
        type="button"
        className="p-button p-button-quiet"
        disabled={stage === 0}
        onClick={() => onChange(stage - 1)}
      >
        <ArrowLeft size={15} /> 上一阶段
      </button>
      <span>自由切换，每一步都可以回看。</span>
      {stage === total - 1 ? (
        <a className="p-button p-button-primary" href={next.href}>
          {next.label}
          <ArrowRight size={15} />
        </a>
      ) : (
        <button
          type="button"
          className="p-button p-button-primary"
          onClick={() => onChange(stage + 1)}
        >
          下一阶段 <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}
