"use client";
import Link from "next/link";
import { createContext, useContext, useState } from "react";
import { Scale, X } from "lucide-react";

type Item = { id: string; title: string };
const Ctx = createContext<{ items: Item[]; toggle: (i: Item) => void; clear: () => void } | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const toggle = (i: Item) => setItems((cur) => (cur.some((c) => c.id === i.id) ? cur.filter((c) => c.id !== i.id) : cur.length >= 3 ? cur : [...cur, i]));
  return (
    <Ctx.Provider value={{ items, toggle, clear: () => setItems([]) }}>
      {children}
      {items.length > 0 && (
        <div role="region" aria-label="Vergleichsauswahl" className="fixed inset-x-3 bottom-20 z-30 mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-border bg-surface p-3 shadow-lift md:bottom-6">
          <Scale className="size-6 shrink-0 text-brand" aria-hidden />
          <p className="min-w-0 flex-1 text-sm">
            <strong>{items.length} von 3</strong> zum Vergleich gewählt
            <span className="block truncate text-muted">{items.map((i) => i.title).join(" · ")}</span>
          </p>
          <button type="button" onClick={() => setItems([])} className="inline-flex size-11 items-center justify-center rounded-full hover:bg-bg-soft" aria-label="Auswahl leeren"><X className="size-5" aria-hidden /></button>
          <Link
            href={`/vergleich?ids=${items.map((i) => i.id).join(",")}`}
            aria-disabled={items.length < 2}
            className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold ${items.length < 2 ? "pointer-events-none bg-border text-muted" : "bg-accent text-white hover:bg-accent-strong dark:text-black"}`}
          >
            Vergleichen
          </Link>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function CompareToggle({ id, title }: { id: string; title: string }) {
  const ctx = useContext(Ctx);
  if (!ctx) return null;
  const checked = ctx.items.some((i) => i.id === id);
  const full = !checked && ctx.items.length >= 3;
  return (
    <label className={`relative z-10 inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold ${full ? "opacity-50" : ""}`}>
      <input type="checkbox" checked={checked} disabled={full} onChange={() => ctx.toggle({ id, title })} className="size-5 accent-[var(--brand)]" />
      Vergleichen
    </label>
  );
}
