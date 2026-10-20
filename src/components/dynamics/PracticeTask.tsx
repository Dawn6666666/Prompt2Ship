import { useEffect, useId, useState } from "react";
import { Check, PencilLine } from "lucide-react";
import { practiceIds } from "@/data/activities";

type Props = { id: string; task: string; checks: string[] };
export function PracticeTask({ id, task, checks }: Props) {
  const inputId = useId();
  const key = `p2s-practice-${id}`;
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(key) || "[]");
      if (
        saved &&
        typeof saved === "object" &&
        "checked" in saved &&
        Array.isArray(saved.checked)
      )
        setDone(
          saved.checked.filter((x): x is string => typeof x === "string"),
        );
    } catch {
      /* A missing or outdated saved task starts unchecked. */
    }
  }, [key]);
  function toggle(check: string) {
    const next = done.includes(check)
      ? done.filter((x) => x !== check)
      : [...done, check];
    setDone(next);
    try {
      localStorage.setItem(
        key,
        JSON.stringify({
          checked: next,
          complete: checks.every((x) => next.includes(x)),
        }),
      );
    } catch {
      /* Session-only progress. */
    }
    window.dispatchEvent(new Event("p2s-practice"));
  }
  const complete = checks.every((x) => done.includes(x));
  return (
    <section className="practice-task not-content" aria-labelledby={inputId}>
      <div className="practice-title">
        <PencilLine size={17} />
        <h3 id={inputId}>自己试一下</h3>
        <span>{complete ? "已自查" : "本地练习"}</span>
      </div>
      <p>{task}</p>
      <fieldset>
        <legend>在自己的电脑完成后勾选</legend>
        {checks.map((check) => (
          <label key={check}>
            <input
              type="checkbox"
              checked={done.includes(check)}
              onChange={() => toggle(check)}
            />
            <span>{check}</span>
          </label>
        ))}
      </fieldset>
      <small>仅保存你的自查记录，不检测本机，也不因播放结束而自动完成。</small>
    </section>
  );
}

export function PracticeProgress() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const read = () => {
      let total = 0;
      for (const id of practiceIds) {
        try {
          const value = JSON.parse(
            localStorage.getItem(`p2s-practice-${id}`) || "[]",
          );
          if (value?.complete === true) total++;
        } catch {
          /* Ignore unreadable progress. */
        }
      }
      setCount(total);
    };
    read();
    window.addEventListener("p2s-practice", read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener("p2s-practice", read);
      window.removeEventListener("storage", read);
    };
  }, []);
  return (
    <p className="practice-progress not-content">
      <Check size={16} /> 已自查 {count} / {practiceIds.length} 个练习{" "}
      <span>记录保存在此浏览器</span>
    </p>
  );
}
