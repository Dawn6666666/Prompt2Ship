import { useState } from "react";
import {
  MessageSquare,
  FileCheck,
  Play,
  ShieldCheck,
} from "lucide-react";

export function StatusTrack({ values }: { values: boolean[] }) {
  const [explanation, setExplanation] = useState(-1);
  const descriptions = [
    "只证明收到了回复，不代表文件已创建。",
    "文件已写入项目目录，不只是在对话里出现。",
    "浏览器能访问本地服务，不代表结果符合需求。",
    "已逐项查看示例检查依据；不代表已检查你的本机项目。",
  ];
  const icons = [MessageSquare, FileCheck, Play, ShieldCheck];
  return (
    <div className="status-track" aria-label="示例项目状态">
      {["Agent 回复了", "文件保存了", "程序跑起来了", "结果验证过了"].map(
        (s, i) => {
          const Icon = icons[i];
          return (
            <span
              key={s}
              data-on={values[i]}
              className={`state-${i}`}
              title={descriptions[i]}
              role="button"
              tabIndex={0}
              aria-expanded={explanation === i}
              onClick={() => setExplanation(explanation === i ? -1 : i)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setExplanation(explanation === i ? -1 : i);
                }
              }}
            >
              <Icon size={15} />
              {s}
            </span>
          );
        },
      )}
      <small>示例</small>
      {explanation >= 0 && (
        <p className="state-explanation" role="status">
          {descriptions[explanation]}
        </p>
      )}
    </div>
  );
}
