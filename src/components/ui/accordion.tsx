// Adapted from shadcn/ui Accordion (MIT), retaining Radix keyboard behavior.
import type { ReactNode } from "react";
import { Accordion as Primitive } from "radix-ui";
import { ChevronDown } from "lucide-react";

export function Accordion({
  items,
}: {
  items: { title: string; content: ReactNode }[];
}) {
  return (
    <Primitive.Root type="single" collapsible className="accordion">
      {items.map((item, i) => (
        <Primitive.Item
          value={String(i)}
          key={item.title}
          className="accordion-item"
        >
          <Primitive.Header>
            <Primitive.Trigger className="accordion-trigger">
              {item.title}
              <ChevronDown size={15} />
            </Primitive.Trigger>
          </Primitive.Header>
          <Primitive.Content className="accordion-content">
            <div>{item.content}</div>
          </Primitive.Content>
        </Primitive.Item>
      ))}
    </Primitive.Root>
  );
}
