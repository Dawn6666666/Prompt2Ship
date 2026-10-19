import { useEffect, useState } from "react";
import {
  Check,
  Database,
  FileCode2,
  RotateCcw,
  Save,
  ArrowRight,
  Server,
  PanelTop,
} from "lucide-react";
import { todoChanges } from "@/data/todo";
import { CodeComparison } from "./ui/code-comparison";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import type { HighlightedStage } from "./CaseWorkbench";

export function TodoLesson({
  highlighted,
}: {
  highlighted: HighlightedStage[];
}) {
  const [value, setValue] = useState("补充移动端截图，并确认联系入口。");
  const [saved, setSaved] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const note = localStorage.getItem("p2s-todo-note");
    setSaved(note ?? "");
    setValue(note ?? "补充移动端截图，并确认联系入口。");
  }, []);
  function save() {
    localStorage.setItem("p2s-todo-note", value);
    setSaved(value);
    setNotice("已保存到本机浏览器。刷新页面仍可读取。");
  }
  return (
    <>
      <div className="flow-diagram">
        <span>
          <PanelTop size={19} />
          <b>React 表单</b>
          <small>输入与展示</small>
        </span>
        <ArrowRight size={19} />
        <span>
          <Server size={19} />
          <b>Express 接口</b>
          <small>接收与返回</small>
        </span>
        <ArrowRight size={19} />
        <span>
          <Database size={19} />
          <b>SQLite</b>
          <small>迁移与持久化</small>
        </span>
      </div>
      <Tabs defaultValue="0" className="todo-lesson">
        <TabsList aria-label="全栈修改步骤">
          {todoChanges.map((s, i) => (
            <TabsTrigger key={s.label} value={String(i)}>
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {todoChanges.map((s, i) => (
          <TabsContent key={s.label} value={String(i)}>
            <div className="todo-step-intro">
              <span className="eyebrow">FOLLOW THE DATA</span>
              <h3>{s.title}</h3>
              <p>{s.detail}</p>
            </div>
            <CodeComparison {...highlighted[i]} filename={s.file} />
          </TabsContent>
        ))}
      </Tabs>
      <section className="todo-playground">
        <div>
          <span className="eyebrow">TRY IT YOURSELF</span>
          <h3>给任务留一句备注。</h3>
          <p>
            这个小演示仅使用 localStorage，帮助理解输入 → 保存 →
            再次读取。它不连接真实 Express 或 SQLite。
          </p>
          <div className="small-note">
            <Database size={15} />
            真实项目的持久化由上面的数据库与接口修改实现。
          </div>
        </div>
        <div className="todo-demo-card">
          <div className="todo-demo-title">
            <span className="todo-check">
              <Check size={13} />
            </span>
            <strong>交付我的第一个网站</strong>
            <span className="task-tag">进行中</span>
          </div>
          {saved && <p className="saved-note">{saved}</p>}
          <label htmlFor="demo-notes">任务备注</label>
          <textarea
            id="demo-notes"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={3}
          />
          <div className="todo-demo-actions">
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setValue(saved);
                setNotice("已重新读取上次保存的备注。");
              }}
            >
              <RotateCcw size={13} /> 重新读取
            </button>
            <button type="button" className="primary-button" onClick={save}>
              <Save size={13} /> 保存备注
            </button>
          </div>
          <p className="save-notice" role="status">
            {notice || "可修改、保存或清空；仅保存在当前浏览器。"}
          </p>
        </div>
      </section>
    </>
  );
}
