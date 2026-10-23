export function RequirementComparison({
  todo,
  selected,
}: {
  todo: boolean;
  selected: number;
}) {
  const vague = todo
    ? [
        "重写项目，换技术栈",
        "备注只在页面内存中",
        "完成后备注丢失也未检查",
        "分类和拖拽一起重做",
      ]
    : [
        "React + 五个代码文件",
        "博客、技能等额外板块",
        "觉得好看就交付",
        "自称有两年工作经历，资料却没有提供",
      ];
  const clear = todo
    ? [
        "保留 React / Express / SQLite",
        "notes 写入数据库，刷新仍在",
        "勾选完成 → 备注保留",
        "四文件修改；原功能回归",
      ]
    : [
        "一个 index.html，原生 CSS",
        "周小满 · 两个项目 · 邮箱",
        "375px / 1280px、链接逐项检查",
        "姓名、项目、邮箱均为示例；交付前换成自己的",
      ];
  return (
    <div className="comparison-artifacts" aria-label="预设结果缩略对照">
      {[vague, clear].map((items, side) => (
        <section key={side} className="paper">
          <span className="tag">
            {side ? "需求明确后的示例" : "模糊需求的可能结果 · 非必然"}
          </span>
          <h3>
            {todo
              ? "任务备注"
              : side
                ? "周小满的个人主页"
                : "AI 猜出的个人网站"}
          </h3>
          {items.map((text, i) => (
            <div
              key={text}
              className={`artifact-region ${i === selected ? "is-highlighted" : ""}`}
            >
              <b>
                {
                  [
                    "实现范围",
                    "内容与数据",
                    "完成依据",
                    todo ? "保留范围" : "事实与占位",
                  ][i]
                }
              </b>
              <p>{text}</p>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
