import {
  Bot,
  FolderOpen,
  FolderPlus,
  GitBranch,
  Terminal,
} from "lucide-react";
import type { ReadinessId } from "../../../data/preparation";

export interface ReadinessStep {
  id: ReadinessId;
  title: string;
  icon: typeof FolderPlus;
  criteria: string;
}

export const readinessSteps: ReadinessStep[] = [
  {
    id: "folder",
    title: "建目录",
    icon: FolderPlus,
    criteria: "文件管理器里出现 my-homepage 文件夹，双击能进入。",
  },
  {
    id: "workspace",
    title: "打开工作区",
    icon: FolderOpen,
    criteria: "VS Code 标题栏显示 my-homepage，左侧文件区为空。",
  },
  {
    id: "path",
    title: "确认路径",
    icon: Terminal,
    criteria: "终端提示符以 my-homepage 结尾，pwd 输出同一条路径。",
  },
  {
    id: "repository",
    title: "初始化 Git",
    icon: GitBranch,
    criteria: "git status 显示 No commits yet，文件区出现隐藏的 .git。",
  },
  {
    id: "readonly-agent",
    title: "验证 Agent",
    icon: Bot,
    criteria: "Agent 说出当前目录、文件数量与 Git 状态，且没有创建文件。",
  },
];
