import { ArrowRight, ArrowUpRight } from "lucide-react";

/** Shared motion cue for links that leave the current step or page. */
export function ArrowIcon({
  up = false,
  size = 14,
}: {
  up?: boolean;
  size?: number;
}) {
  const Icon = up ? ArrowUpRight : ArrowRight;
  return (
    <Icon
      size={size}
      className={`arrow-icon${up ? " arrow-icon-up" : ""}`}
      aria-hidden="true"
    />
  );
}
