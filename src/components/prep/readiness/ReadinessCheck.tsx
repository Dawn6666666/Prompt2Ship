import { useState } from "react";
import { ChevronLeft, ChevronRight, Folder } from "lucide-react";
import { DoneCheck } from "../../workbench/Primitives";
import { WindowFrame } from "../../ui/window/WindowFrame";
import { SystemSwitcher } from "../system/SystemSwitcher";
import { useSystem } from "../system/useSystem";
import { projectPath, promptPath, shellSigil } from "../system/paths";
import { ReadinessNav } from "./ReadinessNav";
import { ReadinessPanel } from "./ReadinessPanel";
import { ReadinessSidebar } from "./ReadinessSidebar";
import { readinessSteps } from "./readinessSteps";

export function ReadinessCheck() {
  const [step, setStep] = useState(0);
  const [executed, setExecuted] = useState<boolean[]>(() =>
    readinessSteps.map(() => false),
  );
  const [system, setSystem] = useSystem();
  const [showHidden, setShowHidden] = useState(false);

  const path = projectPath(system);
  const current = readinessSteps[step];

  function runDemo() {
    setExecuted((previous) =>
      previous.map((value, index) => (index === step ? true : value)),
    );
  }

  return (
    <div className="readiness-workbench-root">
      <WindowFrame
        className="ready-scene"
        variant="editor"
        icon={<Folder size={13} />}
        title="开工检查 · my-homepage"
        note="场景为演示，不会读取或修改你的电脑。"
      >
        <div className="prep-toolbar">
          <span className="prep-toolbar-label">选择系统</span>
          <SystemSwitcher
            value={system}
            onChange={setSystem}
            label="开工检查操作系统"
          />
        </div>
        <ReadinessNav step={step} done={executed} onSelect={setStep} />

        <div className="readiness-split-body ready-pane">
          <ReadinessSidebar
            workspaceOpen={executed[1]}
            folderCreated={executed[0]}
            repositoryReady={executed[3]}
            showHidden={showHidden}
            onShowHidden={setShowHidden}
            path={path}
          />
          <div className="readiness-main-col">
            <ReadinessPanel
              step={step}
              system={system}
              executed={executed}
              onDemo={runDemo}
              path={path}
              promptPath={promptPath(system)}
              sigil={shellSigil(system)}
            />
          </div>
        </div>

        <div className="readiness-footer-nav">
          <button
            type="button"
            className="button secondary"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            <ChevronLeft size={14} aria-hidden="true" />
            上一步
          </button>
          {step < readinessSteps.length - 1 ? (
            <button
              type="button"
              className="button"
              onClick={() => setStep(step + 1)}
            >
              下一步：{readinessSteps[step + 1].title}
              <ChevronRight size={14} aria-hidden="true" />
            </button>
          ) : (
            <a className="button" href="/case/homepage/">
              完成开工检查，进入案例一
              <ChevronRight size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </WindowFrame>

      <DoneCheck
        page="start"
        id={current.id}
        criteria={current.criteria}
        result={
          executed[step]
            ? "演示已完成，请在本机重复同一操作。"
            : "先看演示，再在自己的电脑上执行一次。"
        }
      />
    </div>
  );
}
