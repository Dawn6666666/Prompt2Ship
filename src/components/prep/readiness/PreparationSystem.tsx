import { Laptop } from "lucide-react";
import { SystemSwitcher } from "../system/SystemSwitcher";
import { useSystem } from "../system/useSystem";

export function PreparationSystem() {
  const [system, setSystem] = useSystem();
  return (
    <div className="prep-system-container">
      <div className="prep-system-header">
        <b className="prep-system-title">
          <Laptop size={16} aria-hidden="true" />
          当前工作系统
        </b>
        <SystemSwitcher value={system} onChange={setSystem} />
      </div>
      <p className="prep-system-desc">
        选择后，全站命令、示例路径与快捷键按该系统显示。
      </p>
    </div>
  );
}
