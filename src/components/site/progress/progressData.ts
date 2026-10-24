import { preparationSteps, readinessIds } from "../../../data/preparation";
import { readProgress } from "../../../lib/progress";

export interface ProgressSnapshot {
  done: boolean[];
  last: { page: string; step: number } | null;
  cases: number[];
}

const caseNames = ["想清楚", "定计划", "生成并运行", "发现问题并修改", "检查并交付"];

export function readSnapshot(): ProgressSnapshot {
  const progress = readProgress();
  const done = preparationSteps.map((item) =>
    item.id === "check"
      ? readinessIds.every((id) => progress.start?.[id] === true)
      : progress.preparation?.[item.id] === true,
  );
  let last: ProgressSnapshot["last"] = null;
  try {
    const value = JSON.parse(localStorage.getItem("p2s:last-scene") || "null");
    if (
      value &&
      ["homepage", "todo"].includes(value.page) &&
      Number.isInteger(value.step) &&
      value.step >= 1 &&
      value.step <= 5
    )
      last = value;
  } catch {
    /* Storage unavailable */
  }
  return {
    done,
    last,
    cases: ["homepage", "todo"].map(
      (page) =>
        caseNames.filter((_, index) => progress[page]?.[String(index + 1)] === true)
          .length,
    ),
  };
}
