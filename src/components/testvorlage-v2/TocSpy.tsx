"use client";
import { useEffect } from "react";

/** Markiert den aktuellen Abschnitt im Inhaltsverzeichnis (aria-current). Ohne JavaScript bleibt das Verzeichnis voll nutzbar. */
export function TocSpy({ ids }: { ids: string[] }) {
  useEffect(() => {
    const links = new Map<string, HTMLAnchorElement[]>();
    for (const id of ids) links.set(id, [...document.querySelectorAll<HTMLAnchorElement>(`.tv2 nav a[href="#${id}"]`)]);
    const setze = (aktiv: string) => {
      for (const [id, as] of links) for (const a of as) { if (id === aktiv) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current"); }
    };
    const sichtbar = new Map<string, number>();
    const io = new IntersectionObserver(
      (eintraege) => {
        for (const e of eintraege) { if (e.isIntersecting) sichtbar.set(e.target.id, e.boundingClientRect.top); else sichtbar.delete(e.target.id); }
        const erste = ids.find((id) => sichtbar.has(id));
        if (erste) setze(erste);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 },
    );
    for (const id of ids) { const el = document.getElementById(id); if (el) io.observe(el); }
    return () => io.disconnect();
  }, [ids]);
  return null;
}
