import { ListTree } from "lucide-react";
import type { TocItem } from "@/lib/article-html";

/** Inhaltsverzeichnis aus den H2: mobil einklappbar, am Desktop sticky in der Seitenleiste. */
export function TableOfContents({ items, variant }: { items: TocItem[]; variant: "mobile" | "desktop" }) {
  if (!items?.length) return null;
  const list = (
    <ol className="space-y-1 text-sm">
      {items.map((t, i) => (
        <li key={t.id}>
          <a href={`#${t.id}`} className="flex min-h-11 items-center gap-2 rounded-lg px-2 text-muted hover:bg-bg-soft hover:text-fg lg:min-h-9">
            <span className="w-5 shrink-0 text-xs font-bold tabular-nums text-brand">{i + 1}.</span>
            <span>{t.text}</span>
          </a>
        </li>
      ))}
    </ol>
  );
  if (variant === "mobile")
    return (
      <details className="group rounded-2xl border border-border bg-surface shadow-card lg:hidden">
        <summary className="flex min-h-12 list-none items-center gap-2 px-4 font-bold [&::-webkit-details-marker]:hidden">
          <ListTree className="size-5 text-brand" aria-hidden /> Inhaltsverzeichnis
          <span className="ml-auto text-xl text-brand transition group-open:rotate-45" aria-hidden>+</span>
        </summary>
        <nav aria-label="Inhaltsverzeichnis" className="px-2 pb-3">{list}</nav>
      </details>
    );
  return (
    <nav aria-label="Inhaltsverzeichnis" className="sticky top-28 hidden rounded-2xl border border-border bg-surface p-4 shadow-card lg:block">
      <p className="mb-2 flex items-center gap-2 px-2 text-sm font-bold"><ListTree className="size-4 text-brand" aria-hidden /> Inhalt</p>
      {list}
    </nav>
  );
}
