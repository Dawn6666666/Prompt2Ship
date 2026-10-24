import { ChevronRight, FileCode, Folder } from "lucide-react";

export function FileTree({
  files,
  active,
  onSelect,
  folder = "my-homepage",
  gitReady = true,
}: {
  files: { name: string; status?: string }[];
  active?: string;
  onSelect: (name: string) => void;
  folder?: string;
  gitReady?: boolean;
}) {
  return (
    <div className="file-tree">
      <div className="file-tree-heading">
        <Folder size={16} />
        {folder}
      </div>
      {files.map((f) => (
        <button
          key={`${f.name}:${f.status ?? ""}`}
          data-file-status={f.status || "clean"}
          aria-pressed={active === f.name}
          onClick={() => onSelect(f.name)}
        >
          <FileCode size={15} />
          <span>{f.name}</span>
          {f.status && <small>{f.status}</small>}
        </button>
      ))}
      {files.length === 0 && <p className="muted">没有文件</p>}
      <span className="git-hint">
        <ChevronRight size={12} />
        {gitReady ? ".git · 隐藏的版本记录" : "Git 尚未初始化"}
      </span>
    </div>
  );
}
