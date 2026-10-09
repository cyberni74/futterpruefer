"use client";
import { Search } from "lucide-react";

/** Öffnet den globalen Such-Dialog (gleiches Ereignis wie in der unteren App-Leiste). */
export function HeroSearch() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("fp:open-search"))}
      className="flex min-h-14 w-full items-center gap-3 rounded-full border border-border bg-surface px-5 text-left text-muted shadow-card transition hover:border-brand hover:text-fg hover:shadow-lift"
      aria-label="Suche öffnen"
    >
      <Search className="size-5 shrink-0 text-brand" aria-hidden />
      <span className="min-w-0 flex-1 truncate">Marke oder Futter suchen<span className="hidden sm:inline">, z. B. „Nordrudel“</span></span>
      <kbd className="hidden rounded border border-border px-1.5 text-xs lg:inline">Strg K</kbd>
    </button>
  );
}
