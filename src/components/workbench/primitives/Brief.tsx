import { FileCheck } from "lucide-react";
import {
  homepageBrief,
  todoBrief,
  questionLabels,
  todoQuestionLabels,
} from "../../../data/requirement";
import { Sheet } from "../../ui/sheet";

export function Brief({
  todo = false,
  row = -1,
  answers,
  tone = "neutral",
}: {
  todo?: boolean;
  row?: number;
  answers?: string[];
  tone?: "neutral" | "conflict" | "match";
}) {
  return (
    <div className={`brief-document brief-${tone}`}>
      <h3>{todo ? "任务备注需求单" : "个人主页需求单"}</h3>
      {(answers || (todo ? todoBrief : homepageBrief)).map((text, i) => (
        <div
          key={i}
          className={`brief-row ${row === i ? "is-highlighted" : ""}`}
        >
          <b>
            {i + 1}. {(todo ? todoQuestionLabels : questionLabels)[i]}
          </b>
          <p>{text || "等你回答这一问…"}</p>
        </div>
      ))}
    </div>
  );
}

export function BriefDrawer({
  todo = false,
  row = -1,
  open,
  onOpenChange,
  tone = "neutral",
}: {
  todo?: boolean;
  row?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  tone?: "neutral" | "conflict" | "match";
}) {
  return (
    <Sheet
      title="回看需求单"
      open={open}
      onOpenChange={onOpenChange}
      description="后续演示使用这份示例需求单；你可以对照它检查计划与结果。"
      trigger={
        <button className="button secondary">
          <FileCheck size={15} />
          需求单
        </button>
      }
    >
      {tone !== "neutral" && (
        <p className="notice">
          {tone === "conflict"
            ? "当前示例存在冲突或未通过这一条；不是你的本机检查结果。"
            : "当前示例的计划或修复与这一条对应；仍需你自行验证本机结果。"}
        </p>
      )}
      <Brief todo={todo} row={row} tone={tone} />
    </Sheet>
  );
}
