import { Fragment, useEffect, useState, type ReactNode } from "react";
import { Loader2, Play, RotateCcw, Terminal } from "lucide-react";
import { WindowFrame } from "../../ui/window/WindowFrame";
import { Copy } from "../../ui/window/CopyButton";

interface TerminalViewProps {
  command: string;
  output: string;
  executed: boolean;
  onRun?: () => void;
  children?: ReactNode;
  folder?: string;
  promptPath?: string;
  title?: string;
  sigil?: string;
  note?: ReactNode;
}

/**
 * Preset command output. The run control only replays this example; it never
 * touches the reader's terminal.
 */
export function TerminalView({
  command,
  output,
  executed,
  onRun,
  children,
  folder = "my-homepage",
  promptPath,
  title = "终端",
  sigil = "$",
  note = "预设命令输出 · 不操作你的终端",
}: TerminalViewProps) {
  const [revealing, setRevealing] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const outputLines = output.split("\n");

  useEffect(() => {
    if (!revealing || !executed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLineCount(outputLines.length);
      setRevealing(false);
      return;
    }
    const timer = window.setInterval(
      () => setLineCount((count) => count + 1),
      140,
    );
    return () => window.clearInterval(timer);
  }, [revealing, executed, outputLines.length]);

  useEffect(() => {
    if (lineCount >= outputLines.length) setRevealing(false);
  }, [lineCount, outputLines.length]);

  const running = revealing && executed;
  const visibleLines = revealing ? lineCount : outputLines.length;

  function run() {
    setLineCount(1);
    setRevealing(outputLines.length > 1);
    onRun?.();
  }

  return (
    <WindowFrame
      className="terminal-view"
      variant="terminal"
      icon={<Terminal size={13} />}
      title={`${title} · ${folder}`}
      actions={<Copy text={command} />}
      note={note}
    >
      <div className="terminal-screen">
        <div className="terminal-script">
          {command.split("\n").map((line, index) => (
            <Fragment key={`${line}-${index}`}>
              <span className="terminal-path">
                {index === 0 ? promptPath || `~/${folder}` : ""}
              </span>
              <span className="terminal-sigil" aria-hidden="true">
                {sigil}
              </span>
              <code>{line}</code>
            </Fragment>
          ))}
        </div>
        {onRun && (
          <button
            type="button"
            className="terminal-run"
            data-state={executed ? "done" : "idle"}
            disabled={running}
            onClick={run}
            aria-busy={running}
          >
            {running ? (
              <>
                <Loader2 size={14} className="spin" aria-hidden="true" />
                执行中
              </>
            ) : executed ? (
              <>
                <RotateCcw size={14} aria-hidden="true" />
                再执行一次
              </>
            ) : (
              <>
                <Play size={14} aria-hidden="true" />
                演示执行
              </>
            )}
          </button>
        )}
        {executed && (
          <div className="terminal-output" role="status" aria-live="polite">
            <pre>
              {outputLines.slice(0, visibleLines).map((line, index) => (
                <span
                  className={
                    /https?:\/\/|my-homepage/.test(line)
                      ? "terminal-emphasis"
                      : undefined
                  }
                  key={index}
                >
                  {line}
                  {index < outputLines.length - 1 ? "\n" : ""}
                </span>
              ))}
            </pre>
            {!revealing && children}
          </div>
        )}
      </div>
    </WindowFrame>
  );
}
