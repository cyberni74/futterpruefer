"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CONCERN, ConcernBadge, type ConcernKey } from "./concern-badge";

export type LexItem = { slug: string; name: string; synonyms: string[]; group: string; concern: ConcernKey; shortDescription: string };

const norm = (s: string) => s.toLocaleLowerCase("de").normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss");

export function LexikonBrowser({ items }: { items: LexItem[] }) {
  const [q, setQ] = useState("");
  const [concern, setConcern] = useState<ConcernKey | "">("");
  const filtered = useMemo(() => {
    const n = norm(q.trim());
    return items.filter((i) => (!concern || i.concern === concern) && (!n || [i.name, ...i.synonyms, i.group].some((s) => norm(s).includes(n))));
  }, [items, q, concern]);
  const letters = useMemo(() => {
    const map = new Map<string, LexItem[]>();
    for (const i of filtered) {
      const l = norm(i.name).charAt(0).toUpperCase() || "#";
      map.set(l, [...(map.get(l) ?? []), i]);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b, "de"));
  }, [filtered]);

  return (
    <div>
      <div className="sticky top-[calc(env(safe-area-inset-top)+4.25rem)] z-20 -mx-4 mb-6 space-y-3 bg-bg/95 px-4 py-3 backdrop-blur md:top-24">
        <label className="relative block">
          <span className="sr-only">Inhaltsstoff suchen</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Inhaltsstoff suchen, z. B. Taurin" className="min-h-12 w-full rounded-full border border-border bg-surface pl-12 pr-4 text-base" />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Nach Bewertung filtern">
          {(["", "UNBEDENKLICH", "EINGESCHRAENKT", "BEDENKLICH"] as const).map((k) => (
            <button key={k || "alle"} type="button" aria-pressed={concern === k} onClick={() => setConcern(k)} className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold ${concern === k ? "border-brand bg-brand-soft text-brand-strong" : "border-border bg-surface"}`}>
              {k && <span className={`size-2.5 rounded-full ${CONCERN[k].dot}`} aria-hidden />}
              {k ? CONCERN[k].label : "Alle"}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-4 text-sm text-muted" aria-live="polite">{filtered.length} Einträge</p>
      {letters.map(([letter, list]) => (
        <section key={letter} aria-labelledby={`l-${letter}`} className="mb-8">
          <h2 id={`l-${letter}`} className="mb-3 text-2xl font-extrabold text-brand">{letter}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {list.map((i) => (
              <li key={i.slug}>
                <Link href={`/lexikon/${i.slug}`} className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-surface p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift motion-reduce:hover:translate-y-0">
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-bold leading-snug">{i.name}</span>
                    <ConcernBadge concern={i.concern} />
                  </span>
                  {i.group && <span className="text-xs font-semibold uppercase tracking-wide text-muted">{i.group}</span>}
                  <span className="line-clamp-2 text-sm text-muted">{i.shortDescription}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {filtered.length === 0 && <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">Kein Eintrag gefunden.</p>}
    </div>
  );
}
