// Adapted from shadcn/ui Toggle Group (MIT), using the existing Radix dependency.
import { ToggleGroup } from "radix-ui";
export function ChoiceGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <ToggleGroup.Root
      type="single"
      className="requirement-choices"
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next);
      }}
      aria-label="试试这样回答"
    >
      {options.map((option) => (
        <ToggleGroup.Item key={option} value={option}>
          {option}
          <span aria-hidden="true">↗</span>
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
