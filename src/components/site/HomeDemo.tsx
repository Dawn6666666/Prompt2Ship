import { useState } from "react";
import { PreviewPane } from "../workbench/PreviewPane";
import { homepageVersions } from "../../data/homepage";
export function HomeDemo() {
  const [step, setStep] = useState(0),
    [width, setWidth] = useState(1280);
  return (
    <div className="home-demo">
      <div className="home-demo-story">
        <span className="tag">先看一小段</span>
        <h2>“能打开”，还不等于“做好了”。</h2>
        {["电脑正常", "手机出问题", "具体反馈后修复"].map((s, i) => (
          <button
            key={s}
            aria-pressed={step === i}
            onClick={() => {
              setStep(i);
              setWidth(i === 0 ? 1280 : 375);
            }}
          >
            {i + 1}. {s}
          </button>
        ))}
        <p>
          {
            [
              "第一版在电脑上看起来不错。换个屏幕，再看看。",
              "固定 760px 的容器挤出了手机屏幕。观察实际结果，才能发现问题。",
              "只改容器、标题、网格样式，保留原来的内容。修复后还要重新检查。",
            ][step]
          }
        </p>
        <a className="text-link" href="/case/homepage/">
          从想清楚需求开始 →
        </a>
      </div>
      <PreviewPane
        html={step === 2 ? homepageVersions.v2 : homepageVersions.v1}
        width={width}
        onWidthChange={setWidth}
        version={step === 2 ? "v2" : "v1"}
      />
    </div>
  );
}
