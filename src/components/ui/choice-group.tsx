// Adapted from shadcn/ui Toggle Group (MIT), using the existing Radix dependency.
import { ToggleGroup } from "radix-ui";
export function ChoiceGroup({
  options,
  value,
  onChange,
  label = "比较两种需求情况",
  className = "requirement-choices",
  showArrow = true,
}: {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  showArrow?: boolean;
}) {
  return (
    <ToggleGroup.Root
      type="single"
      className={className}
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next);
      }}
      aria-label={label}
    >
      {options.map((option) => (
        <ToggleGroup.Item key={option} value={option}>
          {option}
          {showArrow && <span aria-hidden="true">↗</span>}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
