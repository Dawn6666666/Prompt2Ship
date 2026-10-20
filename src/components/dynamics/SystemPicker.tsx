import { systems, type OperatingSystem } from "@/lib/usePreference";
export function SystemPicker({
  value,
  onChange,
}: {
  value: OperatingSystem;
  onChange: (system: OperatingSystem) => void;
}) {
  return (
    <div className="tour-options">
      <span>操作系统</span>
      <div className="segmented">
        {systems.map((system) => (
          <button
            type="button"
            key={system}
            aria-pressed={value === system}
            onClick={() => onChange(system)}
          >
            {system}
          </button>
        ))}
      </div>
    </div>
  );
}
