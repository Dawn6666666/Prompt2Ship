// Dialog composition follows the local shadcn/ui implementation (Radix, MIT).
import { useEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import { Maximize2, X } from "lucide-react";

const regions = [
  { name: "整体", zoom: 1, left: 0, top: 0 },
  { name: "文件区", zoom: 2, left: 0, top: 0.25 },
  { name: "编辑区", zoom: 2, left: 0.75, top: 0.25 },
  { name: "终端", zoom: 2, left: 0.6, top: 1 },
];
export function ReferenceImage({
  src,
  title,
  source,
  workbench = false,
  credit,
}: {
  src: string;
  title: string;
  source: string;
  workbench?: boolean;
  credit?: string;
}) {
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState(0);
  const [zoom, setZoom] = useState(1);
  const viewport = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = viewport.current;
    if (node)
      node.scrollTo({
        left: (node.scrollWidth - node.clientWidth) * regions[region].left,
        top: (node.scrollHeight - node.clientHeight) * regions[region].top,
      });
  }, [region, zoom, open]);
  return (
    <details className="reference-image">
      <summary>查看真实界面参考：{title}</summary>
      <Dialog.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) {
            setRegion(0);
            setZoom(1);
          }
        }}
      >
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="reference-thumbnail"
            aria-label={`放大参考图：${title}`}
          >
            <img src={src} alt={title} loading="lazy" />
            <span>
              <Maximize2 size={15} /> 放大查看与局部定位
            </span>
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="reference-overlay" />
          <Dialog.Content className="reference-dialog">
            <div className="reference-dialog-heading">
              <div>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Description>
                  选择局部或放大后滚动查看。真实界面可能随版本、语言和系统不同。
                </Dialog.Description>
              </div>
              <Dialog.Close className="reference-close" aria-label="关闭参考图">
                <X size={20} />
              </Dialog.Close>
            </div>
            <div className="reference-zoom" aria-label="参考图缩放">
              {workbench
                ? regions.map((item, i) => (
                    <button
                      type="button"
                      key={item.name}
                      aria-pressed={region === i}
                      onClick={() => {
                        setRegion(i);
                        setZoom(item.zoom);
                      }}
                    >
                      {item.name}
                    </button>
                  ))
                : [1, 1.5, 2].map((scale) => (
                    <button
                      type="button"
                      key={scale}
                      aria-pressed={zoom === scale}
                      onClick={() => setZoom(scale)}
                    >
                      {scale * 100}%
                    </button>
                  ))}
            </div>
            <div
              className="reference-viewport"
              ref={viewport}
              tabIndex={0}
              aria-label="可滚动的参考图片"
            >
              <img src={src} alt={title} style={{ width: `${zoom * 100}%` }} />
            </div>
            <p className="reference-credit">
              {credit ??
                (workbench || src.includes("terminal")
                  ? "Microsoft · CC BY 3.0 US，图片未修改"
                  : "Microsoft · 官网下载页截图，2026-10-20")}{" "}
              ·{" "}
              <a href={source} target="_blank" rel="noreferrer">
                查看原始资料
              </a>
            </p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <p className="reference-credit">
        {credit ?? "Microsoft · VS Code 官方资料"} ·{" "}
        <a href={source} target="_blank" rel="noreferrer">
          原始资料
        </a>{" "}
        · 可打开大图查看。
      </p>
    </details>
  );
}
