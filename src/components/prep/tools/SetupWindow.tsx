import type { ReactNode } from "react";
import { Wrench } from "lucide-react";
import { WindowFrame } from "../../ui/window/WindowFrame";
import { SystemSwitcher } from "../system/SystemSwitcher";
import type { System } from "../../../data/setup";

/** Window shell shared by the tools and Agent pages. */
export function SetupWindow({
  title,
  note,
  system,
  onSystemChange,
  children,
}: {
  title: string;
  note: string;
  system: System;
  onSystemChange: (system: System) => void;
  children: ReactNode;
}) {
  return (
    <WindowFrame
      className="ready-scene setup-window"
      variant="editor"
      icon={<Wrench size={13} />}
      title={title}
      note={note}
    >
      <div className="prep-toolbar">
        <span className="prep-toolbar-label">选择系统</span>
        <SystemSwitcher
          value={system}
          onChange={onSystemChange}
          label="安装步骤操作系统"
        />
      </div>
      <div className="ready-pane setup-body">{children}</div>
    </WindowFrame>
  );
}
