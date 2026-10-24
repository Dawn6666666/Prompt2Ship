import { FileTree } from "../../workbench/Primitives";

export function ReadinessSidebar({
  workspaceOpen,
  folderCreated,
  repositoryReady,
  showHidden,
  onShowHidden,
  path,
}: {
  workspaceOpen: boolean;
  folderCreated: boolean;
  repositoryReady: boolean;
  showHidden: boolean;
  onShowHidden: (value: boolean) => void;
  path: string;
}) {
  return (
    <div className="readiness-sidebar-col">
      <div className="sidebar-status-box">
        <span className="sidebar-label">工作区状态</span>
        <span
          className={`status-pill ${workspaceOpen ? "ready" : "waiting"}`}
          role="status"
        >
          {workspaceOpen ? "已打开工作区" : "未打开工作区"}
        </span>
      </div>

      <div className="sidebar-tree-container">
        <FileTree
          files={
            repositoryReady && showHidden
              ? [{ name: ".git", status: "隐藏目录" }]
              : []
          }
          folder={folderCreated ? "my-homepage" : "尚未创建项目目录"}
          gitReady={repositoryReady}
          onSelect={() => {}}
        />
      </div>

      <div className="sidebar-path-box">
        <span className="sidebar-label">终端执行路径</span>
        <code className="sidebar-path-code">
          {workspaceOpen ? path : "尚未打开项目"}
        </code>
      </div>

      {repositoryReady && (
        <label className="choice sidebar-choice">
          <input
            type="checkbox"
            checked={showHidden}
            onChange={(event) => onShowHidden(event.target.checked)}
          />
          显示隐藏的 .git 目录
        </label>
      )}
    </div>
  );
}
