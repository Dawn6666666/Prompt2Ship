export const todoPrompt =
  "请先阅读 server/db.js、server/routes/todos.js、client/src/components/TodoForm.jsx、TodoItem.jsx，以及 App.jsx 和 api/todos.js 的数据流。为任务增加可选备注 notes，支持新增、编辑、清空与列表展示。旧任务默认空备注，保留已有分类、优先级、筛选与拖拽。不重写项目。先给出改动计划，再分层实现，并验证刷新后仍可读取备注。";
export const todoChanges = [
  {
    label: "01 数据库",
    file: "server/db.js",
    lang: "javascript",
    title: "先让已有数据库认识新字段。",
    detail:
      "CREATE TABLE IF NOT EXISTS 不会更新已经存在的表。保留原建表语句，在其后追加一次性兼容迁移；重复启动不重复加列。",
    before: "// 原有建表语句之后\nmodule.exports = db;",
    after: `// 原有建表语句之后，检查已有表结构
const columns = db.prepare('PRAGMA table_info(todos)').all();
if (!columns.some(column => column.name === 'notes')) {
  db.exec("ALTER TABLE todos ADD COLUMN notes TEXT NOT NULL DEFAULT ''");
}

module.exports = db;`,
  },
  {
    label: "02 创建接口",
    file: "server/routes/todos.js · POST",
    lang: "javascript",
    title: "接收备注，并真正写进 SQLite。",
    detail:
      "在原有 POST 路由内扩展字段和 INSERT，保留标题校验、排序与返回逻辑。GET 原本使用 SELECT *，因此会自然返回 notes。",
    before: `const { title, category = '', priority = 'medium' } = req.body;
// 保留标题检查与 sort_order 计算
const result = db.prepare(
  'INSERT INTO todos (title, category, priority, sort_order) VALUES (?, ?, ?, ?)'
).run(title.trim(), category, priority, sort_order);`,
    after: `const { title, category = '', priority = 'medium', notes = '' } = req.body;
if (typeof notes !== 'string') {
  return res.status(400).json({ error: 'Notes must be a string' });
}
// 保留标题检查与 sort_order 计算
const result = db.prepare(
  'INSERT INTO todos (title, category, priority, sort_order, notes) VALUES (?, ?, ?, ?, ?)'
).run(title.trim(), category, priority, sort_order, notes.trim());`,
  },
  {
    label: "03 更新接口",
    file: "server/routes/todos.js · PUT",
    lang: "javascript",
    title: "不传与清空，是两件不同的事。",
    detail:
      "切换完成状态只传 completed，不应该清空备注。notes 未传时保留旧值；传空字符串时允许清空。将以下字段合并进原有解构、updated 对象和 SQL。",
    before: `const { title, completed, category, priority } = req.body;
// 原有 existing 查询与 updated 对象
db.prepare(
  'UPDATE todos SET title = ?, completed = ?, category = ?, priority = ? WHERE id = ?'
).run(updated.title, updated.completed, updated.category, updated.priority, id);`,
    after: `const { title, completed, category, priority, notes } = req.body;
if (notes !== undefined && typeof notes !== 'string') {
  return res.status(400).json({ error: 'Notes must be a string' });
}
// 保留 existing 查询与 updated 对象，增加：
updated.notes = notes !== undefined ? notes.trim() : existing.notes;
db.prepare(
  'UPDATE todos SET title = ?, completed = ?, category = ?, priority = ?, notes = ? WHERE id = ?'
).run(updated.title, updated.completed, updated.category, updated.priority, updated.notes, id);`,
  },
  {
    label: "04 输入与编辑",
    file: "client/src/components/TodoForm.jsx",
    lang: "jsx",
    title: "表单的整个生命周期，都要带上备注。",
    detail:
      "把这些行并入原有组件对应位置：声明状态；editingTodo 改变时回填；提交后新建表单清空。原有 API 封装直接序列化 data，无需修改。",
    before: `// 表单已有 title / category / priority
onSubmit({ title, category, priority });`,
    after: `// 与原有 useState 声明放在一起
const [notes, setNotes] = useState('');

// 放入现有 useEffect，使新建与编辑都正确回填
setNotes(editingTodo?.notes ?? '');

// handleSubmit 内，替换原 onSubmit 调用
onSubmit({ title, category, priority, notes });
// 放入现有 if (!editingTodo) 重置分支
setNotes('');

// 在 form 内、原有按钮之前加入
<label htmlFor="task-notes">任务备注（可选）</label>
<textarea id="task-notes" value={notes}
  onChange={event => setNotes(event.target.value)}
  placeholder="补充背景、链接或下一步…" />`,
  },
  {
    label: "05 列表展示",
    file: "client/src/components/TodoItem.jsx",
    lang: "jsx",
    title: "把保存的数据带回用户眼前。",
    detail:
      "在原有任务标题下面加入备注。保留编辑、完成和拖拽逻辑；长文本换行，空备注不额外占位。App.jsx 已把完整 todo 传给子组件，不需要改它。",
    before: "<span className={styles.title}>{todo.title}</span>",
    after: `<span className={styles.title}>{todo.title}</span>
{todo.notes && <p style={{
  whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
  fontSize: 13, color: '#6b7280', margin: '6px 0'
}}>{todo.notes}</p>}`,
  },
];
