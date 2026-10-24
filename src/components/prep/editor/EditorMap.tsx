import { useId, useState } from "react";
import {
  Bot,
  FileCode2,
  Folder,
  FolderOpen,
  SquareTerminal,
} from "lucide-react";
import { WindowFrame } from "../../ui/window/WindowFrame";
import { useSystem } from "../system/useSystem";
import { editorAreas } from "./editorAreas";

export function EditorMap() {
  const [selected, setSelected] = useState(0);
  const [system] = useSystem();
  const descId = useId();
  const current = editorAreas[selected];

  function select(index: number) {
    setSelected(index);
  }

  return (
    <div className="editor-map">
      <WindowFrame
        variant="editor"
        className="editor-tour"
        icon={<Folder size={13} />}
        title="my-homepage · VS Code"
        actions={<span className="editor-tour-hint">点击区域查看职责</span>}
      >
        <div className="editor-tour-body">
          <button
            type="button"
            className={`editor-region editor-region-files${
              selected === 0 ? " is-selected" : ""
            }`}
            aria-pressed={selected === 0}
            aria-describedby={descId}
            onClick={() => select(0)}
          >
            <span className="editor-region-header">
              <FolderOpen size={14} aria-hidden="true" />
              <b>1 文件区</b>
            </span>
            <span className="editor-tree">
              <span className="editor-tree-root">MY-HOMEPAGE</span>
              <span className="editor-tree-node">
                <FileCode2 size={13} aria-hidden="true" />
                index.html
              </span>
              <span className="editor-tree-node">
                <FileCode2 size={13} aria-hidden="true" />
                style.css
              </span>
            </span>
          </button>

          <div className="editor-tour-main">
            <button
              type="button"
              className={`editor-region editor-region-editor${
                selected === 1 ? " is-selected" : ""
              }`}
              aria-pressed={selected === 1}
              aria-describedby={descId}
              onClick={() => select(1)}
            >
              <span className="editor-region-header">
                <FileCode2 size={14} aria-hidden="true" />
                <b>2 编辑区</b>
                <span className="editor-tab">index.html</span>
              </span>
              <span className="editor-code">
                <span className="editor-code-row">
                  <span className="editor-line-no">1</span>
                  <code>&lt;h1&gt;周小满的主页&lt;/h1&gt;</code>
                </span>
                <span className="editor-code-row">
                  <span className="editor-line-no">2</span>
                  <code>&lt;p&gt;开始写代码&lt;/p&gt;</code>
                </span>
              </span>
            </button>

            <button
              type="button"
              className={`editor-region editor-region-terminal${
                selected === 2 ? " is-selected" : ""
              }`}
              aria-pressed={selected === 2}
              aria-describedby={descId}
              onClick={() => select(2)}
            >
              <span className="editor-region-header">
                <SquareTerminal size={14} aria-hidden="true" />
                <b>3 终端</b>
              </span>
              <span className="editor-terminal">
                <span className="editor-terminal-line">
                  <span className="editor-terminal-path">~ / my-homepage</span>
                  <span className="editor-terminal-sigil">$</span>
                  <code>npx serve .</code>
                </span>
                <span className="editor-terminal-line is-output">
                  Local: http://localhost:3000
                </span>
              </span>
            </button>
          </div>

          <button
            type="button"
            className={`editor-region editor-region-agent${
              selected === 3 ? " is-selected" : ""
            }`}
            aria-pressed={selected === 3}
            aria-describedby={descId}
            onClick={() => select(3)}
          >
            <span className="editor-region-header">
              <Bot size={14} aria-hidden="true" />
              <b>4 Agent</b>
            </span>
            <span className="editor-agent">
              <span className="editor-agent-user">检查当前目录</span>
              <span className="editor-agent-reply">
                已读取当前目录，文件尚未建立。
              </span>
            </span>
          </button>
        </div>
      </WindowFrame>

      <div className="editor-tour-detail" id={descId} role="status">
        <div className="editor-tour-detail-head">
          <span className="editor-tour-index">{selected + 1}</span>
          <h4>{current.name}</h4>
          <span className="editor-tour-shortcut">
            快捷键 {system === "mac" ? current.shortcut.mac : current.shortcut.other}
          </span>
        </div>
        <p>{current.role}</p>
        <dl className="editor-tour-facts">
          <div>
            <dt>操作</dt>
            <dd>{current.action}</dd>
          </div>
          <div>
            <dt>注意</dt>
            <dd>{current.caution}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
