import type { ReactNode } from "react";

export function SetupStep({
  index,
  title,
  children,
}: {
  index: number;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="setup-step">
      <header className="setup-step-head">
        <span className="setup-step-index" aria-hidden="true">
          {index}
        </span>
        <h4 className="setup-step-title">{title}</h4>
      </header>
      {children}
    </section>
  );
}
