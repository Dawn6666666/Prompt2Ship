import { readinessSteps } from "./readinessSteps";

export function ReadinessNav({
  step,
  done,
  onSelect,
}: {
  step: number;
  done: boolean[];
  onSelect: (step: number) => void;
}) {
  return (
    <div className="readiness-step-nav" role="group" aria-label="开工检查步骤">
      {readinessSteps.map((item, index) => {
        const Icon = item.icon;
        const active = step === index;
        return (
          <button
            key={item.id}
            type="button"
            className={`readiness-step-btn${active ? " is-active" : ""}${
              done[index] ? " is-done" : ""
            }`}
            aria-pressed={active}
            onClick={() => onSelect(index)}
          >
            <Icon size={14} aria-hidden="true" />
            <span>
              {index + 1}. {item.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}
