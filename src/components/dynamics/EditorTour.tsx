import { activities } from "@/data/activities";
import { useState } from "react";
import { usePreference, systems } from "@/lib/usePreference";
import { ReferenceImage } from "./ReferenceImage";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Code2,
  Download,
  Files,
  FolderOpen,
  GitBranch,
  Search,
  Settings2,
  Terminal,
} from "lucide-react";
import {
  Activity,
  SceneTransition,
  StepControls,
  usePlayback,
} from "./Activity";
const labels = ["选择安装包", "打开编辑器", "打开项目", "找到终端"];
const routes = {
  Windows:
    "下载 Windows User Installer，运行 .exe 安装包，完成后打开 VS Code。",
  macOS:
    "按 Apple 芯片或 Intel 选择版本，解压后将 Visual Studio Code 移入应用程序。",
  Linux: "根据发行版选择 .deb 或 .rpm，使用系统软件安装器完成安装。",
};
const installChecks = {
  Windows: [
    "在“设置 → 系统 → 系统信息”查看 x64 / ARM64，选择对应的 User Installer。",
    "运行安装包，保留 Add to PATH 选项；安装完成后重新打开终端。",
  ],
  macOS: [
    "在“关于本机”查看 Apple 芯片或 Intel，下载对应版本或 Universal。",
    "解压应用并拖入“应用程序”，从那里打开 VS Code。",
  ],
  Linux: [
    "Debian / Ubuntu 选 .deb，Fedora / Red Hat 选 .rpm，并核对 x64 / ARM64。",
    "双击安装包交给系统软件安装器；其他发行版按官方安装文档操作。",
  ],
};
const hints = [
  "按电脑系统选择安装包。具体界面以官网为准。",
  "点击文件区、编辑区和终端标注，认识接下来要用的三个位置。",
  "选择“文件 → 打开文件夹”，让编辑器进入项目所在目录。",
  "选择“终端 → 新建终端”。后面的命令，都在这里输入。",
];
export function EditorTour() {
  const play = usePlayback(labels.length);
  const [system, setSystem] = usePreference("p2s-system", "Windows", systems);
  const [area, setArea] = useState("editor");
  return (
    <Activity
      contract={activities.editor}
      number="01"
      title="安装并认识 VS Code"
      caption="界面为教学示意；在你的电脑上完成安装后，再对照检查。"
    >
      <div className="tour-options">
        <span>你的操作系统</span>
        <div className="segmented">
          {systems.map((s) => (
            <button
              type="button"
              key={s}
              aria-pressed={system === s}
              onClick={() => setSystem(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <SceneTransition id={play.step}>
        <div className="editor-window">
          <div className="editor-windowbar">
            <span className="window-dots">
              <i />
              <i />
              <i />
            </span>
            <span>
              Visual Studio Code — {play.step > 1 ? "my-first-site" : "欢迎"}
            </span>
            <span className="mock-badge">界面示意</span>
          </div>
          {play.step === 0 ? (
            <div className="editor-download">
              <span className="vscode-symbol">
                <Code2 size={48} />
              </span>
              <h4>你的创作，从这里开始。</h4>
              <p>{routes[system]}</p>
              <ol className="editor-install-checks">
                {installChecks[system].map((check) => (
                  <li key={check}>{check}</li>
                ))}
              </ol>
              <a
                href="https://code.visualstudio.com/download"
                target="_blank"
                rel="noreferrer"
                className="p-button p-button-primary"
              >
                <Download size={15} /> 下载 VS Code <ArrowUpRight size={14} />
              </a>
              <span className="editor-download-note">
                免费编辑器 · 选择与你的系统和芯片匹配的版本
              </span>
            </div>
          ) : (
            <div className="editor-app">
              <div className="editor-rail">
                <Files size={20} />
                <Search size={20} />
                <GitBranch size={20} />
                <Settings2 size={20} />
              </div>
              <button
                type="button"
                className={`editor-explorer ${area === "files" ? "is-focused" : ""}`}
                onClick={() => setArea("files")}
                aria-pressed={area === "files"}
              >
                <span>资源管理器</span>
                {play.step > 1 ? (
                  <>
                    <strong>
                      <ChevronRight size={12} /> MY-FIRST-SITE
                    </strong>
                    <span className="explorer-empty">文件会出现在这里</span>
                  </>
                ) : (
                  <>
                    <FolderOpen size={28} />
                    <span>尚未打开文件夹</span>
                  </>
                )}
                <b className="tour-pin">1</b>
              </button>
              <div className="editor-content">
                <button
                  type="button"
                  className={`editor-canvas ${area === "editor" ? "is-focused" : ""}`}
                  onClick={() => setArea("editor")}
                  aria-pressed={area === "editor"}
                >
                  <b className="tour-pin">2</b>
                  <Code2 size={45} strokeWidth={1.2} />
                  <strong>
                    {play.step > 1 ? "项目已就位。" : "你好，VS Code。"}
                  </strong>
                  <span>
                    {play.step > 1
                      ? "my-first-site / 等待创建第一个文件"
                      : "打开文件后，在这里阅读和编辑代码。"}
                  </span>
                  {play.step === 2 && (
                    <span className="editor-menu-hint">
                      <FolderOpen size={14} /> 文件 → 打开文件夹 → my-first-site
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  className={`editor-terminal ${play.step === 3 || area === "terminal" ? "is-focused" : ""}`}
                  onClick={() => setArea("terminal")}
                  aria-pressed={area === "terminal"}
                >
                  <b className="tour-pin">3</b>
                  <span>
                    <Terminal size={12} /> 终端
                  </span>
                  <code>
                    {play.step === 3
                      ? system === "Windows"
                        ? "PS C:\\Projects\\my-first-site> ▍"
                        : "~/my-first-site $ ▍"
                      : "终端 → 新建终端"}
                  </code>
                </button>
              </div>
            </div>
          )}
        </div>
      </SceneTransition>
      <ReferenceImage
        key={
          play.step === 0
            ? "download"
            : play.step === 3
              ? "terminal"
              : "workbench"
        }
        src={
          play.step === 0
            ? "/images/vscode/download.png"
            : play.step === 3
              ? "/images/vscode/open-terminal.png"
              : "/images/vscode/workbench.png"
        }
        title={
          play.step === 0
            ? "按系统与芯片选择安装包"
            : play.step === 3
              ? "通过菜单打开集成终端"
              : "文件区、编辑区与终端的位置"
        }
        source={
          play.step === 0
            ? "https://code.visualstudio.com/download"
            : play.step === 3
              ? "https://code.visualstudio.com/docs/terminal/getting-started"
              : "https://code.visualstudio.com/docs/getstarted/userinterface"
        }
        workbench={play.step === 1 || play.step === 2}
      />
      <div className="scene-observation" aria-live="polite">
        <span>{String(play.step + 1).padStart(2, "0")}</span>
        <p>
          {play.step === 1
            ? {
                files: "文件区：查看项目里的文件和文件夹。",
                editor: "编辑区：阅读 AI 生成的代码，也能手动修改。",
                terminal: "终端：输入命令、启动程序，并查看运行结果。",
              }[area]
            : hints[play.step]}
        </p>
        {play.step === 3 && <Check size={17} />}
      </div>
      <StepControls labels={labels} {...play} />
    </Activity>
  );
}
