import { systems, type System } from "../../../data/setup";

export function SystemSwitcher({
  value,
  onChange,
  label = "选择操作系统",
}: {
  value: System;
  onChange: (system: System) => void;
  label?: string;
}) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {systems.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={value === item.id}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
