"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlaskConical, HelpCircle, Inbox, LayoutDashboard, Megaphone, Newspaper, Trophy } from "lucide-react";

const ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/tests", label: "Tests", icon: FlaskConical },
  { href: "/admin/blog", label: "Fachblog", icon: Newspaper },
  { href: "/admin/ticker", label: "Ticker", icon: Megaphone },
  { href: "/admin/produkt-des-monats", label: "Produkt des Monats", short: "PdM", icon: Trophy },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/anfragen", label: "Anfragen", icon: Inbox },
] as const;

export function AdminNav({ unread, variant }: { unread: number; variant: "sidebar" | "top" }) {
  const pathname = usePathname() ?? "";
  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  if (variant === "top") {
    return (
      <nav aria-label="Admin-Navigation" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]">
        <ul className="flex gap-1 pb-2">
          {ITEMS.map((it) => {
            const active = isActive(it.href, "exact" in it && it.exact);
            const Icon = it.icon;
            return (
              <li key={it.href} className="shrink-0">
                <Link
                  href={it.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold ${
                    active ? "bg-brand text-white dark:text-[#04201e]" : "text-fg hover:bg-bg-soft"
                  }`}
                >
                  <Icon className="size-4" aria-hidden />
                  {"short" in it ? it.short : it.label}
                  {it.href === "/admin/anfragen" && unread > 0 && (
                    <span className="rounded-full bg-accent px-1.5 text-xs text-white" aria-label={`${unread} ungelesen`}>
                      {unread}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="Admin-Navigation">
      <ul className="space-y-1">
        {ITEMS.map((it) => {
          const active = isActive(it.href, "exact" in it && it.exact);
          const Icon = it.icon;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${
                  active ? "bg-brand text-white dark:text-[#04201e]" : "text-fg hover:bg-bg-soft"
                }`}
              >
                <Icon className="size-5" aria-hidden />
                <span className="flex-1">{it.label}</span>
                {it.href === "/admin/anfragen" && unread > 0 && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-white" aria-label={`${unread} ungelesen`}>
                    {unread}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
