// Adapted from shadcn/ui (MIT). See THIRD_PARTY_NOTICES.md.
import * as Panels from "react-resizable-panels";
import { GripVertical } from "lucide-react";

export const ResizablePanel = Panels.Panel;
export const ResizablePanelGroup = Panels.Group;
export function ResizableHandle() {
  return (
    <Panels.Separator
      className="workspace-separator"
      aria-label="调整对话与成果的宽度"
    >
      <GripVertical size={14} />
    </Panels.Separator>
  );
}
