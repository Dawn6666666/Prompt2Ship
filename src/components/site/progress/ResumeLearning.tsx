import { ArrowIcon } from "../../ui/Arrow";

const stepNames = [
  "想清楚",
  "定计划",
  "生成并运行",
  "发现问题并修改",
  "检查并交付",
];

export function ResumeLearning({
  last,
}: {
  last: { page: string; step: number } | null;
}) {
  return (
    <div className="resume-learning">
      <a
        className="button"
        href={last ? `/case/${last.page}/?step=${last.step}` : "/start/"}
      >
        {last ? (
          <>
            继续：案例{last.page === "homepage" ? "一" : "二"} · 第{" "}
            {last.step} 步 <ArrowIcon up />
          </>
        ) : (
          <>
            从准备工具开始 <ArrowIcon up />
          </>
        )}
      </a>
      {last && (
        <small>
          上次浏览：{stepNames[last.step - 1]}
          。记录仅为浏览历史，不代表已在本机完成。
        </small>
      )}
    </div>
  );
}
