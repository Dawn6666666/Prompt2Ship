// Browser shell adapted from Magic UI Safari; real HTML, no scripts or external services.
import { useEffect, useRef, useState } from "react";
import { ExternalLink, Globe, Monitor, Smartphone, Tablet } from "lucide-react";
import { Slider } from "../ui/slider";
export function PreviewPane({
  html,
  width,
  onWidthChange,
  version,
  onVersionChange,
  focus = "",
}: {
  html: string;
  width: number;
  onWidthChange: (v: number) => void;
  version: "v1" | "v2";
  onVersionChange?: (v: "v1" | "v2") => void;
  focus?: string;
}) {
  const container = useRef<HTMLDivElement>(null),
    frame = useRef<HTMLIFrameElement>(null);
  const position = useRef({ top: 0, left: 0 });
  const [available, setAvailable] = useState(720);
  const [overflow, setOverflow] = useState(false);
  useEffect(() => {
    const win = frame.current?.contentWindow;
    if (!win) return;
    const measure = () =>
      setOverflow(win.document.documentElement.scrollWidth > win.innerWidth);
    win.addEventListener("resize", measure);
    measure();
    return () => win.removeEventListener("resize", measure);
  }, [width, html]);
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const observer = new ResizeObserver(([e]) =>
      setAvailable(e.contentRect.width),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const el = frame.current?.contentDocument;
    if (!el) return;
    el.querySelectorAll(".teaching-focus").forEach((n) =>
      n.classList.remove("teaching-focus"),
    );
    if (focus) {
      const target = el.querySelector(focus);
      target?.classList.add("teaching-focus");
      target?.scrollIntoView({ block: "center" });
    }
  }, [focus]);
  const scale = Math.min(1, Math.max(1, available - 24) / width);
  const content = html.replace(
    "</head>",
    "<style>.teaching-focus{outline:3px solid #2f5bea;outline-offset:3px}</style></head>",
  );
  return (
    <div className="preview-pane">
      <div className="browser-bar">
        <span className="window-dots">
          <i />
          <i />
          <i />
        </span>
        <span>
          <Globe size={14} />
          localhost:3000
        </span>
        <a
          href={`/examples/homepage-${version}.html`}
          target="_blank"
          rel="noreferrer"
          aria-label="在新标签页打开网页"
        >
          <ExternalLink size={15} />
        </a>
      </div>
      <div className="viewport-tools">
        <div className="segmented">
          {[
            [375, Smartphone],
            [768, Tablet],
            [1280, Monitor],
          ].map(([n, Icon]) => {
            const Device = Icon as typeof Monitor;
            return (
              <button
                key={String(n)}
                aria-label={`${n}px 预览`}
                aria-pressed={width === n}
                onClick={() => onWidthChange(n as number)}
              >
                <Device size={15} />
                {String(n)}
              </button>
            );
          })}
        </div>
        {onVersionChange && (
          <div className="segmented">
            <button
              aria-pressed={version === "v1"}
              onClick={() => onVersionChange("v1")}
            >
              修改前
            </button>
            <button
              aria-pressed={version === "v2"}
              onClick={() => onVersionChange("v2")}
            >
              修改后
            </button>
          </div>
        )}
      </div>
      <div className="preview-canvas" ref={container}>
        <div
          className="preview-scaled"
          style={{ width: width * scale, height: 430 }}
        >
          <iframe
            ref={frame}
            title={`个人主页 · ${width}px · ${version}`}
            sandbox="allow-same-origin allow-popups"
            srcDoc={content}
            style={{
              width,
              height: 430 / scale,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
            onLoad={() => {
              const win = frame.current?.contentWindow;
              if (!win) return;
              setOverflow(
                win.document.documentElement.scrollWidth > win.innerWidth,
              );
              win.scrollTo(position.current.left, position.current.top);
              win.addEventListener(
                "scroll",
                () => {
                  position.current = { top: win.scrollY, left: win.scrollX };
                },
                { passive: true },
              );
              if (focus) {
                const el = win.document.querySelector(focus);
                el?.classList.add("teaching-focus");
                el?.scrollIntoView({ block: "center" });
              }
            }}
          />
        </div>
      </div>
      <div className={`preview-footer ${overflow ? "has-problem" : ""}`}>
        <span>
          {width}px · {overflow ? "检测到横向溢出" : "无横向溢出"}
        </span>
        <Slider
          value={width}
          onChange={onWidthChange}
          label="调整预览视口宽度"
        />
        <span>{Math.round(scale * 100)}%</span>
      </div>
    </div>
  );
}
