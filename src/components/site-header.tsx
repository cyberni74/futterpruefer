"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { SearchDialog } from "./search-dialog";
import { NAV } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 120 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    const onOpen = () => setSearchOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("fp:open-search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("fp:open-search", onOpen);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 px-3 pt-[max(env(safe-area-inset-top),0.5rem)] transition-transform duration-300 ${hidden && !searchOpen ? "-translate-y-[120%]" : "translate-y-0"}`}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 rounded-2xl border border-border bg-surface/90 px-3 shadow-card backdrop-blur-md md:h-16 md:px-5">
          <Logo />
          <nav aria-label="Hauptnavigation" className="ml-6 hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`inline-flex min-h-11 items-center rounded-full px-3.5 text-[0.95rem] font-semibold transition-colors ${active ? "bg-brand-soft text-brand-strong" : "text-muted hover:bg-bg-soft hover:text-fg"}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-bg-soft px-3.5 text-sm text-muted hover:text-fg md:min-w-56"
              aria-label="Suche öffnen"
            >
              <Search className="size-5" aria-hidden />
              <span className="hidden md:inline">Marke oder Futter suchen…</span>
              <kbd className="ml-auto hidden rounded border border-border px-1.5 text-xs lg:inline">Strg K</kbd>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
