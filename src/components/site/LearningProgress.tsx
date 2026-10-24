import { useEffect, useState } from "react";
import { PreparationCards } from "./progress/PreparationCards";
import { ResumeLearning } from "./progress/ResumeLearning";
import { readSnapshot, type ProgressSnapshot } from "./progress/progressData";

export function LearningProgress({
  mode = "overview",
}: {
  mode?: "overview" | "resume" | "compact" | "all";
}) {
  const [state, setState] = useState<ProgressSnapshot>({
    done: [],
    last: null,
    cases: [0, 0],
  });

  useEffect(() => {
    const update = () => setState(readSnapshot());
    update();
    window.addEventListener("p2s-progress", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("p2s-progress", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const count = state.done.filter(Boolean).length;

  if (mode === "compact") {
    return (
      <span className="progress-compact" title="统计手动确认的准备项">
        准备自查 {count}/4
      </span>
    );
  }

  if (mode === "resume") return <ResumeLearning last={state.last} />;

  return (
    <PreparationCards
      done={state.done}
      cases={state.cases}
      showCases={mode === "all"}
    />
  );
}
