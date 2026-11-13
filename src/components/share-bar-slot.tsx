"use client";

import { useEffect, useState, type ComponentType } from "react";

type BarProps = { url: string; title: string };

/**
 * Die Teilen-Leiste ist bis zur Hälfte der Seite unsichtbar.
 * Ihr JavaScript wird erst geladen, wenn jemand dorthin scrollt.
 */
export function ShareBarSlot({ url, title }: BarProps) {
  const [Bar, setBar] = useState<ComponentType<BarProps> | null>(null);

  useEffect(() => {
    if (Bar) return;
    let cancel = false;
    const load = () => {
      window.removeEventListener("scroll", onScroll);
      import("./share-bar").then((mod) => {
        if (!cancel) setBar(() => mod.ShareBar);
      });
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.35) load();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancel = true;
      window.removeEventListener("scroll", onScroll);
    };
  }, [Bar]);

  if (!Bar) return null;
  return <Bar url={url} title={title} />;
}
