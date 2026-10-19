import { useEffect, useState } from "react";
import { ArrowRight, Check, RotateCcw, Save } from "lucide-react";
import { todoChanges, todoPrompt } from "@/data/todo";
import {
  LessonStudio,
  type LessonStep,
  type HighlightedStage,
} from "./LessonStudio";
import { Textarea } from "./ui/textarea";

export function TodoLesson({
  highlighted,
}: {
  highlighted: HighlightedStage[];
}) {
  const labels = ["数据库", "新增接口", "更新接口", "输入表单", "列表展示"];
  const steps: LessonStep[] = [
    {
      label: "读项目",
      title: "先看数据从哪里来、到哪里去。",
      hint: "已有代码，先读再改。",
      prompt: todoPrompt,
      reply:
        "表单通过 App 和 API 封装将完整对象交给 Express，再由 SQLite 保存。只需要沿着这条链增加 notes，不用重写 App 和 API 封装。",
      kind: "map",
      filename: "todo-app / 数据流地图",
      items: [
        "TodoForm.jsx → 输入与编辑备注",
        "App.jsx → 原样传递完整任务",
        "api/todos.js → 原样序列化请求",
        "routes/todos.js → 新增与更新 notes",
        "db.js → 兼容旧数据库，保存新字段",
      ],
      lesson: "先理解数据流，就能知道哪些文件不用改。",
    },
    ...todoChanges.map((change, i): LessonStep => ({
      label: labels[i],
      title: change.title,
      hint: i === 0 ? "先让数据库容纳新数据。" : "一次只补上数据链的一环。",
      prompt: [
        "保留已有任务数据，为 todos 增加 notes 字段。旧数据默认空备注，重复启动不能重复加列。不要删除数据库。",
        "在原 POST 路由接收可选 notes 并写入 SQLite，保留标题校验、分类、优先级和排序逻辑。",
        "在原 PUT 路由增加 notes 更新：没传 notes 保留旧值；传空字符串允许清空。切换完成状态时不能丢失备注。",
        "在 TodoForm 增加备注输入。新建提交带上 notes，编辑时回填，新建提交成功后清空。保留原有字段。",
        "在任务标题下面显示非空备注，支持换行和长文本。保留原有编辑、完成和拖拽操作。",
      ][i],
      reply: change.detail,
      kind: "diff",
      filename: change.file,
      code: change.after,
      highlighted: highlighted[i],
      lesson: [
        "旧表不会因为 CREATE TABLE IF NOT EXISTS 而自动增加新列。",
        "输入框不是持久化；必须让接口把数据写进数据库。",
        "没有传值和主动清空，代表不同的用户意图。",
        "新建、回填、提交、重置，都是表单的一部分。",
        "写入和展示形成闭环，功能才真正到达用户眼前。",
      ][i],
      detail: <p>这里是并入原文件对应位置的关键片段，不是完整替换文件。</p>,
    })),
    {
      label: "亲手验证",
      title: "写一条备注，保存，再读回来。",
      hint: "让数据走完一次往返。",
      prompt:
        "演示备注的输入、保存、重新读取和清空，并告诉我如何在真实项目验证。不要把本地浏览器演示说成后端已经通过测试。",
      reply:
        "现在试着编辑备注并保存，观察下方的数据流。此处使用浏览器 localStorage，不连接 Express 或 SQLite；真实项目还要检查旧数据库、刷新、完成状态与筛选拖拽。",
      kind: "todo",
      lesson: "创建、编辑、清空、刷新都要验证；同时检查已有功能是否受影响。",
    },
  ];
  return (
    <LessonStudio
      steps={steps}
      name="Todo / 增加可选备注"
      next={{ href: "/review", label: "带走方法" }}
      renderTodo={() => <TodoPlayground />}
    />
  );
}

function TodoPlayground() {
  const [value, setValue] = useState("补充移动端截图，并确认联系入口。");
  const [saved, setSaved] = useState("");
  const [journey, setJourney] = useState(-1);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const note = localStorage.getItem("p2s-todo-note");
    setValue(note ?? "补充移动端截图，并确认联系入口。");
    setSaved(note ?? "");
  }, []);
  useEffect(() => {
    if (journey < 0 || journey >= 4) return;
    const timer = setTimeout(() => {
      if (journey === 2) {
        localStorage.setItem("p2s-todo-note", value);
        setSaved(value);
      }
      if (journey === 3)
        setNotice(
          "已保存到当前浏览器，刷新后仍能读取。也可以清空输入后再次保存。",
        );
      setJourney(journey + 1);
    }, 450);
    return () => clearTimeout(timer);
  }, [journey, value]);
  const saving = journey >= 0 && journey < 4;
  return (
    <div className="todo-demo-card">
      <div className="todo-demo-title">
        <span>
          <Check size={13} />
        </span>
        <strong>交付我的第一个网站</strong>
        <span className="task-tag">进行中</span>
      </div>
      {saved && <p className="saved-note">{saved}</p>}
      <label htmlFor="demo-notes">任务备注</label>
      <Textarea
        id="demo-notes"
        value={value}
        disabled={saving}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
      />
      <div className="todo-demo-actions">
        <button
          className="quiet-button"
          type="button"
          disabled={saving}
          onClick={() => {
            const note = localStorage.getItem("p2s-todo-note") ?? "";
            setValue(note);
            setSaved(note);
            setNotice("已从本机存储重新读取。输入框里的未保存内容不会写入。");
          }}
        >
          <RotateCcw size={13} />
          重新读取
        </button>
        <button
          type="button"
          className="primary-button"
          disabled={saving}
          onClick={() => {
            setJourney(0);
            setNotice("");
          }}
        >
          <Save size={13} />
          {saving ? "保存中…" : "保存备注"}
        </button>
      </div>
      <div className="data-journey" aria-label="浏览器本地存储演示">
        {["输入", "序列化", "本机存储", "返回展示"].map((label, i) => (
          <span key={label} className={journey >= i ? "active" : ""}>
            {label}
          </span>
        ))}
      </div>
      <p className="save-notice" role="status">
        {notice || "浏览器本地演示 · 不连接 Express / SQLite。"}
      </p>
    </div>
  );
}
