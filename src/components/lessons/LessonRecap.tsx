export function LessonRecap({ todo = false }: { todo?: boolean }) {
  return (
    <div className="lesson-recap paper">
      <h3>带走一套可以重复使用的检查方法</h3>
      <ol>
        <li>想清楚：用五问写需求，用可观察的结果定义完成。</li>
        <li>定计划：先看文件范围和冲突，再授权修改。</li>
        <li>生成并运行：Agent 回复 ≠ 文件保存 ≠ 本地运行。</li>
        <li>发现问题并修改：提供复现步骤，限制修改范围，对照真实 Diff。</li>
        <li>
          检查并交付：运行过 ≠ 验证过；记录 Git 版本，交付运行说明和待替换项。
        </li>
      </ol>
      {todo ? (
        <dl className="case-comparison">
          <dt>从零开始</dt>
          <dd>确定要创建什么；网页只有一个文件；重点检查布局和链接。</dd>
          <dt>已有项目</dt>
          <dd>
            先只读理解；确定不能动什么；新功能、旧功能、修改范围都要检查。
          </dd>
        </dl>
      ) : (
        <p>
          下一步可以学习
          <a
            href="https://docs.github.com/zh/pages/getting-started-with-github-pages/creating-a-github-pages-site"
            target="_blank"
            rel="noreferrer"
          >
            用 GitHub Pages 发布静态网页
          </a>
          。这是可选后续；本节完成本地交付，不自动部署。
        </p>
      )}
    </div>
  );
}
