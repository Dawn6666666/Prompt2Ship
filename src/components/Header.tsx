import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  GitBranch as Github,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";

export function Header({
  path = "/",
  embedded = false,
}: {
  path?: string;
  embedded?: boolean;
}) {
  const Root = embedded ? "div" : "header";
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setDark(
      document.documentElement.dataset.theme === "dark" ||
        document.documentElement.classList.contains("dark"),
    );
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
      localStorage.setItem("starlight-theme", next ? "dark" : "light");
    } catch {
      /* Optional storage. */
    }
  }
  return (
    <Root className="p-header">
      <a href="/" className="p-brand" aria-label="Prompt2Ship 首页">
        <span className="p-brand-mark">
          p<span>↗</span>
        </span>
        <span>
          Prompt<span className="brand-2">2</span>Ship
          <span className="brand-period">.</span>
        </span>
      </a>
      <nav className={`p-nav ${open ? "is-open" : ""}`} aria-label="主导航">
        <a href="/" aria-current={path === "/" ? "page" : undefined}>
          首页
        </a>
        <a
          href="/learn/"
          aria-current={path.startsWith("/learn") ? "page" : undefined}
        >
          学习路线
        </a>
        <details className="p-case-menu">
          <summary className={path.startsWith("/case") ? "active" : ""}>
            交互案例 <ChevronDown size={13} />
          </summary>
          <div>
            <a href="/case/from-scratch">
              <span>01</span> 从零做一个网站 <ArrowUpRight size={13} />
            </a>
            <a href="/case/todo-app">
              <span>02</span> 给 Todo 增加备注 <ArrowUpRight size={13} />
            </a>
          </div>
        </details>
        <a
          href="/review"
          aria-current={path === "/review" ? "page" : undefined}
        >
          方法速查
        </a>
      </nav>
      <div className="p-header-actions">
        <a
          className="p-github"
          href="https://github.com/Dawn6666666/Prompt2Ship"
          aria-label="查看 GitHub 源码"
          target="_blank"
          rel="noreferrer"
        >
          <Github size={18} />
        </a>
        <button
          type="button"
          className="p-icon-button"
          onClick={toggle}
          aria-label={dark ? "切换浅色主题" : "切换深色主题"}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <a className="p-start-button" href="/learn/setup/vscode/">
          <BookOpen size={14} /> 开始学习 <ArrowUpRight size={14} />
        </a>
        <button
          type="button"
          className="p-mobile-menu p-icon-button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="切换导航菜单"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </Root>
  );
}
