import type { ReactNode } from "react";
import { TrafficLights } from "./TrafficLights";

interface WindowFrameProps {
  title: ReactNode;
  icon?: ReactNode;
  variant?: "terminal" | "prompt" | "editor";
  className?: string;
  actions?: ReactNode;
  note?: ReactNode;
  children: ReactNode;
}

/**
 * Shared frame geometry: title bar, directory label, actions and a body slot.
 * Proportions follow the Expressive Code terminal window.
 */
export function WindowFrame({
  title,
  icon,
  variant = "terminal",
  className = "",
  actions,
  note,
  children,
}: WindowFrameProps) {
  return (
    <div
      className={`window-frame window-frame-${variant} ${className}`.trim()}
    >
      <div className="window-bar">
        <span className="window-bar-main">
          <TrafficLights />
          <span className="window-title">
            {icon && (
              <span className="window-title-icon" aria-hidden="true">
                {icon}
              </span>
            )}
            {title}
          </span>
        </span>
        {actions && <span className="window-actions">{actions}</span>}
      </div>
      <div className="window-body">{children}</div>
      {note && <p className="window-note">{note}</p>}
    </div>
  );
}
