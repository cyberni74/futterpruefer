import Link from "next/link";
import { QUELLEN, STAND_TEXT, type Frage } from "@/lib/futterrechner/seo";
import { DEFAULT_AUTHOR, authorPath } from "@/lib/authors";

export function FaqListe({ titel = "Häufige Fragen zum Futterrechner", fragen }: { titel?: string; fragen: Frage[] }) {
  return (
    <section aria-labelledby="faq" className="mt-12">
      <h2 id="faq" className="font-display text-2xl font-extrabold">{titel}</h2>
      <div className="mt-4 space-y-2">
        {fragen.map((f) => (
          <details key={f.frage} className="group rounded-2xl border border-border bg-surface p-4">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-bold">
              <h3 className="text-base font-bold">{f.frage}</h3>
              <span aria-hidden className="text-xl text-brand transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 leading-relaxed text-muted">{f.antwort}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function QuellenUndAutor() {
  return (
    <>
      <section aria-labelledby="quellen" className="mt-12">
        <h2 id="quellen" className="font-display text-2xl font-extrabold">Quellen</h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted">
          {QUELLEN.map((q) => (
            <li key={q.href}><a href={q.href} target="_blank" rel="noopener noreferrer" className="break-words underline underline-offset-4 hover:text-brand">{q.text}</a></li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-muted">Eigene Festlegungen sind im Text als solche genannt: der Kastriert-Faktor × 0,9 (abgeleitet aus AAHA 2021), die Spanne von ±10 % und das Rohasche-Band von 3 bis 12 % der Trockenmasse.</p>
      </section>
      <aside className="mt-8 rounded-3xl border border-border bg-bg-soft p-5 text-sm">
        <p><strong>Autor:</strong> <Link href={authorPath(DEFAULT_AUTHOR)} className="font-semibold text-brand underline underline-offset-4">{DEFAULT_AUTHOR.name}</Link> · Stand: {STAND_TEXT}</p>
        <p className="mt-1 text-muted">Der Rechner ist ein Werkzeug zur Orientierung und ersetzt keine Beratung durch die Tierarztpraxis.</p>
      </aside>
    </>
  );
}
