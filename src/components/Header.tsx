import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Moon, Sun, X, ArrowRight } from "lucide-react";
import { navigation } from "@/data/course";

// Theme persistence adapted from the local Astro shadcn template ThemeToggle.
export function Header({ path }: { path: string }) {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }
  return (
    <>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Prompt2Ship 首页">
          <span className="brand-icon">
            p<span>↗</span>
          </span>
          <span>
            Prompt<span className="brand-two">2</span>Ship
            <span className="brand-dot">.</span>
          </span>
        </a>
        <nav className="header-nav" aria-label="主导航">
          <a className={path === "/" ? "active" : ""} href="/">
            学习实验室
          </a>
          <a
            className={path.startsWith("/case") ? "active" : ""}
            href="/case/from-scratch"
          >
            交互案例<span className="tiny-tag">02</span>
          </a>
          <a className={path === "/review" ? "active" : ""} href="/review">
            方法复盘
          </a>
          <a className={path === "/setup" ? "active" : ""} href="/setup">
            准备工具
          </a>
        </nav>
        <div className="header-actions">
          <a
            className="github-link"
            href="https://github.com/Dawn6666666/Prompt2Ship"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <ArrowUpRight size={13} />
          </a>
          <span className="header-divider" />
          <button
            className="icon-button"
            type="button"
            onClick={toggleTheme}
            aria-label="切换明暗主题"
            aria-pressed={dark}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a className="header-start" href="/case/from-scratch">
            动手试试 <ArrowRight size={14} />
          </a>
          <button
            className="icon-button mobile-menu-button"
            onClick={() => setOpen(!open)}
            type="button"
            aria-label="打开学习导航"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      {open && (
        <nav className="mobile-navigation" aria-label="移动端学习导航">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={path === item.href ? "page" : undefined}
            >
              {item.label}
              <ArrowUpRight size={14} />
            </a>
          ))}
        </nav>
      )}
    </>
  );
}
