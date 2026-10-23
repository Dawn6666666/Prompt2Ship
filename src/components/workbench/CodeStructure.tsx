import { useState } from "react";
import { CodeView } from "./Primitives";
import { homepageVersions } from "../../data/homepage";
export function CodeStructure({
  html,
  version,
  initial = "header",
}: {
  html: string;
  version: "v1" | "v2";
  initial?: string;
}) {
  const [section, setSection] = useState(initial);
  const source = homepageVersions[version],
    lines = source.split("\n");
  const targets: Record<string, (line: string) => boolean> = {
    header: (line) => line.startsWith("<header>"),
    ".projects": (line) =>
      line.startsWith("<section") || line.startsWith("<article"),
    footer: (line) => line.startsWith("<footer>"),
    style: (line) => line.includes("{") || line.startsWith("@media"),
  };
  const selected = targets[section]
    ? lines.flatMap((line, i) => (targets[section](line) ? [i + 1] : []))
    : [];
  return (
    <div className="code-structure">
      <div className="change-map">
        {[
          ["header", "个人介绍"],
          [".projects", "两个项目"],
          ["footer", "邮件入口"],
          ["style", "样式"],
        ].map(([id, label]) => (
          <button
            key={id}
            aria-pressed={section === id}
            onClick={() => setSection(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <CodeView html={html} source={source} lines={selected} />
    </div>
  );
}
