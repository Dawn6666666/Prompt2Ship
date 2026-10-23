import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Moon, Sun } from "lucide-react";
import { Sheet } from "./ui/sheet";
import { LearningProgress } from "./site/LearningProgress";
const links = [
  ["/start/", "准备"],
  ["/case/homepage/", "案例一"],
  ["/case/todo/", "案例二"],
  ["/guide/", "速查"],
];
export function Header({
  path = "/",
  embedded = false,
}: {
  path?: string;
  embedded?: boolean;
}) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
      localStorage.setItem("starlight-theme", next ? "dark" : "light");
    } catch {}
  }
  const nav = (
    <nav aria-label="主导航">
      {links.map(([href, label]) => (
        <a
          key={href}
          href={href}
          aria-current={path.startsWith(href) ? "page" : undefined}
        >
          {label}
          <ArrowUpRight size={16} />
        </a>
      ))}
    </nav>
  );
  const Root = embedded ? "div" : "header";
  return (
    <Root className="site-header">
      <a className="brand" href="/" title="返回首页">
        <span className="brand-mark" aria-hidden="true">
          p↗
        </span>
        <span>Prompt2Ship</span>
        <span className="brand-dot" aria-hidden="true">
          .
        </span>
      </a>
      <div className="desktop-nav">
        {nav}
        <LearningProgress mode="compact" />
      </div>
      <div className="header-tools">
        <a
          href="https://github.com/Dawn6666666/Prompt2Ship"
          className="source-link"
        >
          GitHub <ArrowUpRight size={14} />
        </a>
        <button
          className="icon-button"
          onClick={toggle}
          aria-label={dark ? "切换浅色主题" : "切换深色主题"}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="mobile-nav">
          <Sheet
            title="学习路线"
            trigger={
              <button className="icon-button" aria-label="打开导航菜单">
                <Menu size={20} />
              </button>
            }
          >
            <LearningProgress mode="all" />
            {nav}
          </Sheet>
        </div>
      </div>
    </Root>
  );
}
