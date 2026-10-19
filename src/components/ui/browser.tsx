// Browser layout adapted from Magic UI Safari (MIT); interactive iframe
// replaces the source component's image/video area.
import { Globe2, LockKeyhole, Monitor, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
export function Browser({ html, stage }: { html: string; stage: number }) {
  const [mobile, setMobile] = useState(false);
  const screen = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(screen.current!);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="browser">
      <div className="browser-bar">
        <div className="traffic">
          <i />
          <i />
          <i />
        </div>
        <div className="address">
          <LockKeyhole size={10} />{" "}
          {stage < 2 ? "等待生成页面" : "localhost:4322"}
        </div>
        <div className="viewport-controls">
          <button
            type="button"
            aria-label="桌面预览"
            aria-pressed={!mobile}
            onClick={() => setMobile(false)}
          >
            <Monitor size={14} />
          </button>
          <button
            type="button"
            aria-label="手机预览"
            aria-pressed={mobile}
            onClick={() => setMobile(true)}
          >
            <Smartphone size={14} />
          </button>
        </div>
      </div>
      <div ref={screen} className={`browser-screen ${mobile ? "mobile" : ""}`}>
        {html ? (
          <iframe
            style={
              mobile
                ? undefined
                : {
                    width: 1280,
                    height: Math.max(800, (330 * 1280) / width),
                    transform: `scale(${width / 1280})`,
                    transformOrigin: "top left",
                    position: "absolute",
                    left: 0,
                    top: 0,
                  }
            }
            title={`林间作品集 · 第 ${stage + 1} 阶段${mobile ? "手机" : "桌面"}预览`}
            sandbox=""
            srcDoc={html}
          />
        ) : (
          <div className="empty-preview">
            <Globe2 size={30} />
            <strong>好作品，从想清楚开始。</strong>
            <p>完成需求与规划后，网站将在这里逐步成形。</p>
            <span>等待第 03 阶段 · 生成代码</span>
          </div>
        )}
      </div>
      <div className="browser-caption">
        <span className="live-dot" />
        {mobile
          ? "375px 手机视口 · 在预览内观察初稿溢出"
          : "1280px 桌面视口 · 等比缩放"}
        <span>HTML / CSS</span>
      </div>
    </div>
  );
}
