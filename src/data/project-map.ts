// Paths and responsibilities in the pinned Todo baseline. These are not file-system reads.
export const projectFiles = [
  {
    name: "client/src/components/TodoForm.jsx",
    role: "表单：接收新增或编辑内容。",
    change: true,
    reason: "这里增加备注输入，编辑时回填。",
  },
  {
    name: "client/src/api/todos.js",
    role: "请求：把页面操作发送到 /api/todos。",
    change: false,
    reason: "现有请求封装已经传递对象，不需要重写。",
  },
  {
    name: "server/routes/todos.js",
    role: "接口：验证输入，执行新增和更新。",
    change: true,
    reason: "这里接收 notes；更新时区分没传入和主动清空。",
  },
  {
    name: "server/db.js",
    role: "数据库：创建 SQLite 表并兼容旧数据。",
    change: true,
    reason: "增加 notes 列；旧任务默认空字符串，不删库。",
  },
  {
    name: "client/src/components/TodoItem.jsx",
    role: "列表项：展示任务，提供编辑和完成操作。",
    change: true,
    reason: "展示备注，但保留原有操作。",
  },
  {
    name: "client/src/App.jsx",
    role: "页面组织：管理任务列表、筛选和排序。",
    change: false,
    reason: "保留原有筛选、分类和拖拽逻辑。",
  },
];
