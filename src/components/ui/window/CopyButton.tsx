import { useEffect, useState } from "react";
import { Check, Copy as CopyIcon } from "lucide-react";

export function Copy({ text, label = "复制" }: { text: string; label?: string }) {
  const [state, setState] = useState("");
  useEffect(() => {
    if (!state) return;
    const timer = window.setTimeout(() => setState(""), 1500);
    return () => window.clearTimeout(timer);
  }, [state]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("已复制");
    } catch {
      setState("请选中文本复制");
    }
  }
  return (
    <button
      type="button"
      className="copy-button"
      onClick={copy}
      aria-label={state || label}
    >
      {state === "已复制" ? <Check size={14} /> : <CopyIcon size={14} />}
      <span role="status">{state || label}</span>
    </button>
  );
}
