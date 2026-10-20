// Adapted from local shadcn/ui sheet.tsx (MIT). Radix owns focus trapping, Escape and scroll locking.
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { useState, type ReactNode } from "react";
export function Sheet({
  title,
  trigger,
  children,
  description = "可随时按 Escape 关闭。",
}: {
  title: string;
  trigger: ReactNode;
  children: ReactNode;
  description?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay" />
        <Dialog.Content
          className="sheet-content"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("[data-close-sheet]"))
              setOpen(false);
          }}
        >
          <div className="sheet-heading">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close className="icon-button" aria-label="关闭">
              <X size={20} />
            </Dialog.Close>
          </div>
          <Dialog.Description className="muted">
            {description}
          </Dialog.Description>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
