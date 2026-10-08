import Link from "next/link";
import { matchLexikon, splitComposition, type LexRef } from "@/lib/product-data";
import { CONCERN } from "./concern-badge";

/** Zusammensetzung als Liste; Stoffe mit Lexikon-Eintrag sind verlinkt, mit Ampel-Punkt und Kurzerklärung (Tooltip). */
export function IngredientList({ composition, lexikon }: { composition: string | null | undefined; lexikon: LexRef[] }) {
  const items = splitComposition(composition);
  if (!items.length) return null;
  return (
    <ol className="flex flex-wrap gap-2" aria-label="Zusammensetzung in Reihenfolge der Deklaration">
      {items.map((it, i) => {
        const lex = matchLexikon(it, lexikon);
        if (!lex)
          return <li key={`${it}-${i}`} className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm">{it}</li>;
        const c = CONCERN[lex.concern];
        const tipId = `zutat-tip-${i}`;
        return (
          <li key={`${it}-${i}`} className="group relative">
            <Link href={`/lexikon/${lex.slug}`} aria-describedby={tipId} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-semibold hover:border-brand focus-visible:border-brand">
              <span className={`size-2.5 shrink-0 rounded-full ${c.dot}`} aria-hidden />
              {it}
              <span className="sr-only">({c.label})</span>
            </Link>
            <span id={tipId} role="tooltip" className="pointer-events-none absolute bottom-full left-0 z-30 mb-2 hidden w-64 rounded-xl bg-[#12201f] p-3 text-xs leading-snug text-white shadow-lift group-focus-within:block group-hover:block">
              <strong className="block">{lex.name} – {c.label}</strong>
              {lex.shortDescription}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
