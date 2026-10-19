import type { LessonStep } from "@/components/LessonStudio";

export type ToolCall = {
  name: string;
  target: string;
  input: string;
  output: string;
  note?: string;
};

// Scripted tool traces, not results from this checkout or the visitor's machine.
export function toolCallsFor(step: LessonStep): ToolCall[] {
  const file = step.filename || "index.html";
  switch (step.kind) {
    case "brief":
      return [
        {
          name: "todowrite",
          target: "整理验收条件",
          input: "从用户需求提取页面内容、约束与验收标准",
          output:
            "□ 个人介绍、两个精选项目、联系入口\n□ 原生 HTML + CSS，无外部依赖\n□ 桌面与手机布局\n□ 示例邮箱交付前替换",
          note: "先确认范围；还没有创建页面。",
        },
      ];
    case "plan":
      return [
        {
          name: "glob",
          target: "查看工作区",
          input: '{ "pattern": "**/*", "path": "portfolio" }',
          output: "portfolio/\n└─ （本案例从空目录开始）",
        },
        {
          name: "todowrite",
          target: "拆解实现步骤",
          input: "先给出计划，等待用户确认，不修改代码",
          output:
            "1. 创建 index.html\n2. 添加介绍、项目和联系区\n3. 写入桌面样式\n4. 打开浏览器检查移动端\n5. 按反馈修复并交付",
        },
      ];
    case "map":
      return [
        {
          name: "glob",
          target: "定位前后端文件",
          input: '{ "pattern": "{client,server}/**/*.{js,jsx}" }',
          output:
            "client/src/components/TodoForm.jsx\nclient/src/components/TodoItem.jsx\nclient/src/App.jsx\nclient/src/api/todos.js\nserver/routes/todos.js\nserver/db.js",
        },
        {
          name: "read",
          target: "追踪任务数据流",
          input: "读取 TodoForm、App、api/todos、路由和数据库初始化",
          output:
            "TodoForm → App → API → Express → SQLite\nApp 与 API 已传递完整对象，无需重写。\n数据库、路由、表单与展示缺少 notes。",
          note: "这一步只阅读，不改文件。",
        },
      ];
    case "code":
      return [
        {
          name: "write",
          target: "index.html",
          input:
            '{ "file": "index.html", "content": "HTML 页面与内联 CSS（右侧展示）" }',
          output: "创建 index.html\n包含导航、介绍、项目、联系区与桌面样式。",
          note: "文件写入是教学回放；下一步仍需检查手机布局。",
        },
      ];
    case "preview":
      return [
        {
          name: "bash",
          target: "启动本地预览",
          input: "python3 -m http.server 8000",
          output:
            "Serving HTTP on 0.0.0.0 port 8000 ...\n进程继续运行，随后用浏览器打开页面。",
          note: "仅回放命令；本教程不会在你的电脑上启动服务。",
        },
        {
          name: "browser.open",
          target: "打开页面",
          input: '{ "url": "http://localhost:8000", "viewport": "1280 × 800" }',
          output: "示例页面已打开。\n介绍、两个项目卡片、联系入口可见。",
          note: "工具轨迹为预设；右侧 iframe 才是可操作的真实页面预览。",
        },
        {
          name: "browser.resize",
          target: "检查手机宽度",
          input: '{ "width": 375, "height": 812 }',
          output:
            "发现横向溢出：main 固定宽度为 760px。\n标题为固定 64px，项目仍是双列。\n需要响应式修复。",
          note: "不要把“页面能打开”当作“适配已通过”。",
        },
      ];
    case "diff":
      if (step.html)
        return [
          {
            name: "grep",
            target: "定位溢出来源",
            input:
              '{ "pattern": "width: 760px|font-size: 64px|grid-template-columns", "file": "index.html" }',
            output:
              "main { width: 760px; }\nh1 { font-size: 64px; }\n.projects { grid-template-columns: 1fr 1fr; }",
          },
          {
            name: "apply_patch",
            target: "index.html",
            input: "仅修改 main、h1 和手机断点，不改页面文案与结构",
            output:
              "main → max-width: 760px\nh1 → clamp(38px, 8vw, 64px)\n≤ 560px → 单列项目、缩小内边距",
            note: "补丁前后对比与修复后的页面可在右侧切换。",
          },
        ];
      return [
        {
          name: "read",
          target: file,
          input: JSON.stringify(
            { file, scope: "读取原有逻辑，保留现有行为" },
            null,
            2,
          ),
          output: file.includes("db.")
            ? "现有表由 CREATE TABLE IF NOT EXISTS 初始化。\n旧数据库不会因此自动增加 notes 列。"
            : file.includes("TodoForm")
              ? "表单存在新建、编辑回填、提交与重置流程。\n需要把 notes 接到每个环节。"
              : file.includes("TodoItem")
                ? "任务项已有完成、编辑与拖拽行为。\n只在标题下面增加备注展示。"
                : "检查原路由的字段读取、SQL 参数与返回数据。\n保留标题校验、排序、分类与完成状态逻辑。",
        },
        {
          name: "apply_patch",
          target: file,
          input: "将右侧关键片段合并到对应位置，不覆盖整个文件",
          output: file.includes("db.")
            ? "增加 PRAGMA table_info 检查。\n仅缺少 notes 时执行 ALTER TABLE。\n不删除数据库，不重复加列。"
            : file.includes("TodoForm")
              ? "接入 notes 状态、回填、提交和重置。\n新增备注 textarea。"
              : file.includes("TodoItem")
                ? "非空备注在标题下显示。\n保留换行，长文本自动折行。"
                : "将 notes 接入原接口。\n更新时区分“未提供”和“空字符串”。",
          note: "只是补丁演示，尚未运行真实后端或回归测试。",
        },
      ];
    case "terminal":
      return [
        {
          name: "bash",
          target: "查看修改范围",
          input: "git status --short\ngit diff --stat\ngit diff --check",
          output:
            " M index.html\n index.html | 响应式样式调整\n预设 diff --check 输出为空。",
          note: "命令与输出仅为示例，没有访问你的 Git 仓库。",
        },
        {
          name: "review",
          target: "提交前人工检查",
          input: "检查 1280px / 375px 页面、联系入口、占位内容与改动范围",
          output:
            "待你检查：桌面 / 手机布局、联系邮箱、Diff。\n确认后再执行 git add 与 git commit。\n本回放没有创建提交。",
          note: "不使用虚构的“全部测试通过”替代人工验收。",
        },
      ];
    case "delivery":
      return [
        {
          name: "read",
          target: "交付清单",
          input: "核对 index.html 的依赖与占位内容",
          output:
            "单文件 HTML + CSS，无外部运行依赖。\n姓名、作品和 hello@example.com 为演示内容。\n右侧可查看最终示例文件。",
          note: "右侧下载链接会返回真实 HTML 文件。",
        },
      ];
    case "todo":
      return [
        {
          name: "review",
          target: "划清验证边界",
          input: "区分浏览器演示与后端验收",
          output:
            "右侧回放固定示例的输入、接口传递、写入和展示过程。\n这是预设示意，不实际存储数据，也没有连接 Express / SQLite。\n真实项目需另测旧数据库、刷新与已有任务操作。",
        },
      ];
  }
}
