export interface EditorArea {
  id: "files" | "editor" | "terminal" | "agent";
  name: string;
  role: string;
  action: string;
  caution: string;
  shortcut: { mac: string; other: string };
}

export const editorAreas: EditorArea[] = [
  {
    id: "files",
    name: "文件区",
    role: "列出当前工作区里的文件夹与文件。",
    action: "点击文件，在编辑区打开它。",
    caution: "打开整个项目目录，不要只打开一个文件。",
    shortcut: { mac: "⌘ B", other: "Ctrl B" },
  },
  {
    id: "editor",
    name: "编辑区",
    role: "阅读和修改文件内容，每个标签页对应一个文件。",
    action: "修改后按保存快捷键，改动才写入磁盘。",
    caution: "标签页上的圆点表示内容已改动但未保存。",
    shortcut: { mac: "⌘ S", other: "Ctrl S" },
  },
  {
    id: "terminal",
    name: "终端",
    role: "运行本地命令、启动预览服务、执行 Git 操作。",
    action: "在提示符后输入命令并回车。",
    caution: "执行前确认提示符路径以 my-homepage 结尾。",
    shortcut: { mac: "⌃ `", other: "Ctrl `" },
  },
  {
    id: "agent",
    name: "Agent",
    role: "读取项目、给出计划，在你允许后修改文件。",
    action: "从终端启动，或打开侧边栏面板。",
    caution: "先做一次只读检查，再允许写入。",
    shortcut: { mac: "终端启动", other: "终端启动" },
  },
];
