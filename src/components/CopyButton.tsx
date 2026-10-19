import { Check, Copy } from "lucide-react";
import { useState } from "react";
export function CopyButton({
  text,
  label = "复制提示词",
}: {
  text: string;
  label?: string;
}) {
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("已复制");
    } catch {
      setStatus("请选中文字复制");
    }
    setTimeout(() => setStatus(""), 2200);
  }
  return (
    <button className="copy-button" type="button" onClick={copy}>
      {status === "已复制" ? <Check size={13} /> : <Copy size={13} />}
      <span aria-live="polite">{status || label}</span>
    </button>
  );
}
