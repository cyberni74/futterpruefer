"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Newspaper, Search } from "lucide-react";

const ITEMS = [
  { href: "/", label: "Start", icon: Home },
  { href: "/tests", label: "Kategorien", icon: LayoutGrid },
  { href: "/blog", label: "Fachartikel", icon: Newspaper },
] as const;

const itemClass = (active: boolean) =>
  `flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-0.5 text-[11px] leading-tight font-semibold ${active ? "text-brand" : "text-muted hover:text-fg"} transition-colors active:scale-95`;

export function BottomBar() {
  const pathname = usePathname();
  return (
    <nav aria-label="App-Navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <ul className="grid grid-cols-4">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href) || (href === "/tests" && pathname.startsWith("/kategorie"));
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? "page" : undefined} className={itemClass(active)}>
                <Icon className="size-6" aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("fp:open-search"))}
            className={itemClass(pathname.startsWith("/suche"))}
          >
            <Search className="size-6" aria-hidden />
            Suche
          </button>
        </li>
      </ul>
    </nav>
  );
}
