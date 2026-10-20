// Adapted from the local shadcn/ui Slider (MIT); Radix owns pointer and keyboard behavior.
import { Slider as Primitive } from "radix-ui";
export function Slider({
  value,
  onChange,
  label,
  min = 320,
  max = 1280,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  min?: number;
  max?: number;
}) {
  return (
    <Primitive.Root
      className="p-slider"
      value={[value]}
      min={min}
      max={max}
      step={1}
      onValueChange={([next]) => onChange(next)}
      aria-label={label}
    >
      <Primitive.Track className="p-slider-track">
        <Primitive.Range className="p-slider-range" />
      </Primitive.Track>
      <Primitive.Thumb className="p-slider-thumb" aria-label={label} />
    </Primitive.Root>
  );
}
