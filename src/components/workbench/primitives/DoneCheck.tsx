import { useProgress } from "../../../lib/progress";

export function DoneCheck({
  page,
  id,
  criteria,
  result,
}: {
  page: string;
  id: string;
  criteria: string;
  result: string;
}) {
  const [done, setDone] = useProgress(page, id);
  return (
    <div className="done-check">
      <div>
        <b>怎样算完成</b>
        <p>{criteria}</p>
      </div>
      <div className="example-result">
        <span className="tag">示例结果</span>
        {result}
      </div>
      <label className="choice">
        <input
          type="checkbox"
          checked={done}
          onChange={(e) => setDone(e.target.checked)}
        />
        我已在自己的电脑上完成这一步
      </label>
      <small>勾选只保存在此浏览器，不会自动检查你的电脑。</small>
    </div>
  );
}
