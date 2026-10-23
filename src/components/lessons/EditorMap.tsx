import { useId, useState } from "react";
import { FileCode, Monitor, Terminal, MessageSquare } from "lucide-react";
export function EditorMap() {
  const [area, setArea] = useState(0);
  const descriptionId = useId();
  const areas = [
    ["文件区", FileCode, "查看当前工作区里的文件；点击文件，在编辑区打开。"],
    ["编辑区", Monitor, "查看和编辑代码；Ctrl+S / ⌘S 保存到文件。"],
    [
      "集成终端",
      Terminal,
      "菜单“终端 → 新建终端”。Shell 命令在这里输入，先确认当前路径。",
    ],
    [
      "Agent 入口",
      MessageSquare,
      "终端型 Agent 在集成终端中启动；扩展型 Agent 在自己的面板里使用。不要求所有人安装插件。",
    ],
  ] as const;
  const labels = ["Explorer", "Editor", "Terminal", "Agent"];
  const hints = [
    "MY-HOMEPAGE · 示例空目录",
    "点击左侧文件后在这里编辑",
    "Shell 命令在这里输入",
    "扩展面板，或在终端中启动",
  ];
  return (
    <div className="editor-tour">
      <div className="editor-map-title">
        <b>my-homepage · VS Code</b>
        <span className="tag">布局示意</span>
      </div>
      <div className="editor-map" aria-label="VS Code 区域位置示意">
        {areas.map(([name, Icon], i) => (
          <button
            key={name}
            type="button"
            className={area === i ? "selected" : ""}
            aria-pressed={area === i}
            aria-describedby={descriptionId}
            onClick={() => setArea(i)}
          >
            <span className="editor-map-label">
              <Icon size={18} aria-hidden="true" />
              <b>
                {i + 1}. {name}
              </b>
            </span>
            <span lang="en">{labels[i]}</span>
            <small>{hints[i]}</small>
          </button>
        ))}
      </div>
      <p className="notice" id={descriptionId} role="status">
        {areas[area][2]}
      </p>
      <p className="muted editor-map-help">
        上图只标出区域位置，不是真实截图。目录会在开工检查中创建；Agent
        的位置随工具而异，终端型 Agent 不需要右侧扩展面板。
      </p>
    </div>
  );
}
