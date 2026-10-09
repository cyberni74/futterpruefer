"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Jede Seite beginnt oben: beim (Neu-)Laden, bei jedem Seitenwechsel und beim Klick auf „Start“.
 * Ausnahme: Links mit Anker (#abschnitt) springen wie gewohnt zum Abschnitt.
 */
export function ScrollTop() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.hash) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" });
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
