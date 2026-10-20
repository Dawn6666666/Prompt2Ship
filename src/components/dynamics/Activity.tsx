import {
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
  RotateCcw,
  ScanLine,
} from "lucide-react";
import { motion } from "motion/react";
import type { TeachingContract } from "@/data/activities";
const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (onChange: () => void) => {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
// Subscribe after hydration, and also respond if the OS preference changes later.
export function useMotionPreference() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(motionQuery).matches,
    () => false,
  );
}
export function SceneCheckpoint({
  observe,
  success,
}: Pick<TeachingContract, "observe" | "success">) {
  return (
    <div className="scene-checkpoint">
      <p>
        <strong>观察</strong>
        {observe}
      </p>
      <p>
        <strong>确认</strong>
        {success}
      </p>
    </div>
  );
}
export function Activity({
  number,
  title,
  children,
  caption,
  contract,
}: {
  number: string;
  title: string;
  children: ReactNode;
  caption?: string;
  contract: TeachingContract;
}) {
  const id = useId();
  return (
    <section className="dynamic not-content" aria-labelledby={id}>
      <header className="dynamic-heading">
        <span className="dynamic-number">
          <ScanLine size={14} /> 动态 {number}
        </span>
        <h3 id={id}>{title}</h3>
        <span className="dynamic-label">可交互演示</span>
      </header>
      <p className="activity-goal">{contract.goal}</p>
      {children}
      <SceneCheckpoint observe={contract.observe} success={contract.success} />
      {caption && <p className="dynamic-caption">{caption}</p>}
    </section>
  );
}
export function usePlayback(count: number, interval = 3500) {
  const [step, updateStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduce = useMotionPreference();
  useEffect(() => {
    if (!playing || reduce) return;
    const timer = setTimeout(() => {
      if (step < count - 1) updateStep(step + 1);
      else setPlaying(false);
    }, interval);
    return () => clearTimeout(timer);
  }, [step, playing, count, interval, reduce]);
  function setStep(next: number) {
    updateStep(Math.max(0, Math.min(count - 1, next)));
    setPlaying(false);
  }
  function toggle() {
    if (reduce) {
      setStep(step === count - 1 ? 0 : step + 1);
      return;
    }
    if (step === count - 1) updateStep(0);
    setPlaying(!playing);
  }
  return { step, setStep, playing, toggle, reducedMotion: !!reduce };
}
export function StepControls({
  labels,
  step,
  setStep,
  playing,
  toggle,
  reducedMotion = false,
}: {
  labels: readonly string[];
  step: number;
  setStep: (n: number) => void;
  playing: boolean;
  toggle: () => void;
  reducedMotion?: boolean;
}) {
  return (
    <div className="dynamic-controls">
      <div className="dynamic-step-buttons" aria-label="选择演示步骤">
        {labels.map((label, i) => (
          <button
            type="button"
            key={label}
            onClick={() => setStep(i)}
            aria-pressed={step === i}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {label}
          </button>
        ))}
      </div>
      <div className="dynamic-transport">
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          aria-label="上一个步骤"
        >
          <ArrowLeft size={15} />
        </button>
        <button
          type="button"
          onClick={toggle}
          aria-label={
            reducedMotion
              ? "前进一帧（减少动态效果）"
              : playing
                ? "暂停演示"
                : step === labels.length - 1
                  ? "重播演示"
                  : "播放演示"
          }
        >
          {playing ? (
            <Pause size={14} />
          ) : step === labels.length - 1 ? (
            <RotateCcw size={14} />
          ) : (
            <Play size={14} />
          )}
        </button>
        <button
          type="button"
          onClick={() => setStep(step + 1)}
          disabled={step === labels.length - 1}
          aria-label="下一个步骤"
        >
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
export function SceneTransition({
  children,
  id,
}: {
  children: ReactNode;
  id: string | number;
}) {
  const reduce = useMotionPreference();
  return (
    <motion.div
      key={id}
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
