import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { search } from "@/lib/search";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScoreBadge } from "@/components/score-badge";

export const metadata: Metadata = { title: "Suche", robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: PageProps<"/suche">) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";
  const hits = q.length >= 2 ? await search(q, 40) : [];
  return (
    <div className="mx-auto max-w-3xl px-4">
      <Breadcrumbs items={[{ label: "Suche" }]} />
      <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">Suche</h1>
      <form role="search" action="/suche" className="mt-6 flex gap-2">
        <label htmlFor="q" className="sr-only">Suchbegriff</label>
        <input id="q" name="q" type="search" defaultValue={q} placeholder="Marke, Futtername oder Thema" enterKeyHint="search" className="min-h-12 flex-1 rounded-full border border-border bg-surface px-5 text-base" />
        <button type="submit" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-5 font-bold text-white hover:bg-accent-strong dark:text-black"><Search className="size-5" aria-hidden /><span className="hidden sm:inline">Suchen</span></button>
      </form>
      {q.length >= 2 && (
        <p className="mt-6 text-sm text-muted" aria-live="polite">{hits.length} Treffer für „{q}“</p>
      )}
      <ul className="mt-4 divide-y divide-border">
        {hits.map((h) => (
          <li key={`${h.type}-${h.slug}`}>
            <Link href={h.type === "test" ? `/tests/${h.slug}` : `/blog/${h.slug}`} className="flex min-h-16 items-center gap-4 py-3 hover:bg-bg-soft">
              <span className="w-12 shrink-0 text-xs font-bold uppercase text-muted">{h.type === "test" ? "Test" : "Blog"}</span>
              <span className="min-w-0 flex-1"><span className="block font-semibold">{h.title}</span><span className="line-clamp-1 text-sm text-muted">{h.subtitle}</span></span>
              {h.score !== null && <ScoreBadge score={h.score} size="sm" />}
            </Link>
          </li>
        ))}
      </ul>
      {q.length >= 2 && hits.length === 0 && <p className="mt-4">Keine Treffer. Versuchen Sie eine Marke oder einen allgemeineren Begriff.</p>}
    </div>
  );
}
