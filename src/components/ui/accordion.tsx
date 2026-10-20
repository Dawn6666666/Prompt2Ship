// Adapted from local shadcn/ui accordion.tsx (MIT); Radix provides keyboard behavior.
import { Accordion as A } from "radix-ui";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
export const Accordion = A.Root;
export function AccordionItem({
  value,
  title,
  children,
}: {
  value: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <A.Item className="question-item" value={value}>
      <A.Header>
        <A.Trigger className="question-trigger">
          {title}
          <ChevronDown size={18} />
        </A.Trigger>
      </A.Header>
      <A.Content className="question-content">{children}</A.Content>
    </A.Item>
  );
}
