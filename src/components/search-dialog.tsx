"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { SearchHit } from "@/lib/search";
import { ScoreBadge } from "./score-badge";

export function useLiveSearch(query: string) {
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      setLoading(true);
      fetch(`/api/suche?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((r) => (r.ok ? r.json() : { hits: [] }))
        .then((d: { hits?: SearchHit[] }) => setHits(d.hits ?? []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 180);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);
  return query.trim().length < 2 ? { hits: [] as SearchHit[], loading: false } : { hits, loading };
}

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(-1);
  const { hits, loading } = useLiveSearch(q);
  const router = useRouter();
  const listId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      setTimeout(() => inputRef.current?.focus(), 10);
    } else if (!open && d.open) d.close();
  }, [open]);

  const href = (h: SearchHit) => h.href;
  const go = (url: string) => {
    onClose();
    setQ("");
    router.push(url);
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label="Suche"
      className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-black/50 backdrop:backdrop-blur-sm md:mx-auto md:mt-[10vh] md:h-auto md:max-w-2xl"
    >
      <div className="flex h-full flex-col bg-surface text-fg md:h-auto md:max-h-[75vh] md:rounded-2xl md:shadow-lift">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (active >= 0 && hits[active]) go(href(hits[active]));
            else if (q.trim().length >= 2) go(`/suche?q=${encodeURIComponent(q.trim())}`);
          }}
          className="flex items-center gap-2 border-b border-border p-3 pt-[max(env(safe-area-inset-top),0.75rem)]"
        >
          <Search className="ml-1 size-5 shrink-0 text-muted" aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(-1);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, hits.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
            }}
            type="search"
            enterKeyHint="search"
            placeholder="Marke, Futtername oder Thema"
            aria-label="Suchbegriff"
            role="combobox"
            aria-expanded={hits.length > 0}
            aria-controls={listId}
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            className="min-h-12 flex-1 bg-transparent text-lg outline-none placeholder:text-muted"
          />
          <button type="button" onClick={onClose} className="inline-flex size-11 items-center justify-center rounded-full hover:bg-bg-soft" aria-label="Suche schließen">
            <X className="size-5" aria-hidden />
          </button>
        </form>
        <div className="flex-1 overflow-y-auto p-2" aria-live="polite">
          {q.trim().length < 2 ? (
            <p className="p-4 text-sm text-muted">Mindestens zwei Zeichen eingeben. Tippfehler werden toleriert.</p>
          ) : hits.length === 0 ? (
            <p className="p-4 text-sm text-muted">{loading ? "Suche läuft…" : "Keine Treffer."}</p>
          ) : (
            <ul id={listId} role="listbox" aria-label="Vorschläge">
              {hits.slice(0, 8).map((h, i) => (
                <li key={`${h.type}-${h.slug}`} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                  <Link
                    href={href(h)}
                    onClick={(e) => { e.preventDefault(); go(href(h)); }}
                    className={`flex min-h-14 items-center gap-3 rounded-xl px-3 py-2 ${i === active ? "bg-brand-soft" : "hover:bg-bg-soft"}`}
                  >
                    <span className="w-14 shrink-0 text-center text-xs font-bold uppercase tracking-wide text-muted">{h.type === "test" ? "Test" : h.type === "lexikon" ? "Lexikon" : "Blog"}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{h.title}</span>
                      <span className="block truncate text-sm text-muted">{h.subtitle}</span>
                    </span>
                    {h.score !== null && <ScoreBadge score={h.score} size="sm" />}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/suche?q=${encodeURIComponent(q.trim())}`} onClick={(e) => { e.preventDefault(); go(`/suche?q=${encodeURIComponent(q.trim())}`); }} className="flex min-h-12 items-center justify-center rounded-xl text-sm font-semibold text-brand hover:bg-bg-soft">
                  Alle Ergebnisse anzeigen
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </dialog>
  );
}
