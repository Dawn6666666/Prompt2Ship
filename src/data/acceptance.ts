import {
  homepageBrief,
  todoBrief,
  questionLabels,
  todoQuestionLabels,
} from "./requirement";
export type AcceptanceCheck = {
  id: string;
  label: string;
  how: string;
  row: number;
  target: "preview" | "code" | "evidence" | "scope";
  width?: number;
  focus?: string;
  evidenceNames?: string[];
};
const homepageChecks: AcceptanceCheck[] = [
  {
    id: "intro",
    label: "名字和一句介绍",
    row: 1,
    target: "preview",
    focus: "header",
    how: "查看页面顶部，核对名字和一句介绍。",
  },
  {
    id: "projects",
    label: "两个项目及待替换链接",
    row: 1,
    target: "preview",
    focus: ".projects",
    how: "数两张卡片；# 是占位，不是可交付的真实链接。",
  },
  {
    id: "email",
    label: "邮箱链接格式正确",
    row: 1,
    target: "code",
    focus: "footer",
    how: "查看 footer 的 href；示例为 mailto:xiaoman@example.com。本机还需配置邮件应用，不能保证实际投递。",
  },
  {
    id: "desktop",
    label: "1280px 下完整显示",
    row: 3,
    target: "preview",
    width: 1280,
    how: "切换到 1280px，检查完整内容和实际溢出检测。",
  },
  {
    id: "mobile",
    label: "375px 下没有横向溢出",
    row: 3,
    target: "preview",
    width: 375,
    how: "切换到 375px，看右侧是否截断，并核对溢出检测。",
  },
  {
    id: "scope",
    label: "网页只有一个 HTML，没有框架",
    row: 2,
    target: "code",
    how: "文件区显示需求文档和唯一网页 index.html。复制完整代码，检查没有框架依赖。",
  },
];
const todoChecks: AcceptanceCheck[] = [
  {
    id: "notes",
    label: "新增、编辑、清空备注",
    row: 1,
    target: "evidence",
    evidenceNames: ["新增与重新读取", "编辑备注", "主动清空备注"],
    how: "对照独立 HTTP/SQLite 断言及真实浏览器表单操作。",
  },
  {
    id: "reload",
    label: "刷新后仍然保留",
    row: 1,
    target: "evidence",
    evidenceNames: ["新增与重新读取"],
    how: "浏览器新增后刷新，仍能看到同一段备注。",
  },
  {
    id: "complete",
    label: "勾选完成后备注仍在",
    row: 3,
    target: "evidence",
    evidenceNames: ["切换状态保留备注"],
    how: "完成操作仅传 completed；GET 和浏览器刷新后仍保留备注。",
  },
  {
    id: "category",
    label: "分类与优先级照常",
    row: 2,
    target: "evidence",
    evidenceNames: ["编辑备注", "筛选与排序回归"],
    how: "核对 HTTP 保存与筛选，并查看真实浏览器分类、优先级回归。",
  },
  {
    id: "filter",
    label: "筛选与拖拽照常",
    row: 2,
    target: "evidence",
    evidenceNames: ["筛选与排序回归"],
    how: "核对真实浏览器筛选、拖拽后刷新，以及排序接口返回值。",
  },
  {
    id: "scope",
    label: "仅修改计划中的四个文件",
    row: 2,
    target: "scope",
    evidenceNames: ["修改范围"],
    how: "把真实 Git 改动列表与计划中的四个文件逐项对照。",
  },
];
// Checks belong to requirement rows; consumers cannot silently invent a second unrelated checklist.
export function requirementSpec(todo: boolean) {
  const brief = todo ? todoBrief : homepageBrief,
    labels = todo ? todoQuestionLabels : questionLabels;
  return brief.map((answer, row) => ({
    id: row,
    label: labels[row],
    answer,
    checks: (todo ? todoChecks : homepageChecks).filter(
      (check) => check.row === row,
    ),
  }));
}
export const acceptanceChecks = (todo: boolean) =>
  requirementSpec(todo).flatMap((row) => row.checks);
