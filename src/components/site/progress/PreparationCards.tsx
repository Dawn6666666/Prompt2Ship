import { ArrowRight, Check, Clock } from "lucide-react";
import { preparationSteps } from "../../../data/preparation";

export function PreparationCards({
  done,
  cases,
  showCases = false,
}: {
  done: boolean[];
  cases: number[];
  showCases?: boolean;
}) {
  const count = done.filter(Boolean).length;
  return (
    <div className="preparation-progress prep-overview-cards" aria-label="准备自查进度">
      <div className="prep-overview-header">
        <div>
          <b>完成进度</b>
          <span className="prep-overview-sub">
            按顺序完成四项，再进入案例。
          </span>
        </div>
        <div className="prep-overview-badge" role="status">
          已完成 <b>{count}/4</b>
        </div>
      </div>

      <div className="prep-card-grid">
        {preparationSteps.map((item, index) => {
          const isDone = done[index] === true;
          return (
            <a
              key={item.id}
              href={item.href}
              className={`prep-card${isDone ? " is-finished" : ""}`}
            >
              <span className="prep-card-top">
                <span className="prep-card-number" aria-hidden="true">
                  {item.order}
                </span>
                <span className="prep-card-title">{item.title}</span>
                <span className="prep-card-time">
                  <Clock size={12} aria-hidden="true" />
                  {item.minutes} 分钟
                </span>
              </span>
              <span className="prep-card-outcome">{item.outcome}</span>
              <span className="prep-card-footer">
                <span className={`prep-status-pill ${isDone ? "done" : "todo"}`}>
                  {isDone ? (
                    <>
                      <Check size={12} aria-hidden="true" />
                      已自查
                    </>
                  ) : (
                    "待自查"
                  )}
                </span>
                <span className="prep-card-arrow">
                  前往 <ArrowRight size={13} aria-hidden="true" />
                </span>
              </span>
            </a>
          );
        })}
      </div>

      {showCases && (
        <div className="case-progress-summary">
          <p>案例进度</p>
          {["homepage", "todo"].map((page, index) => (
            <a key={page} href={`/case/${page}/`}>
              案例{index === 0 ? "一：个人主页" : "二：任务备注"}
              <b>{cases[index]}/5</b>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
