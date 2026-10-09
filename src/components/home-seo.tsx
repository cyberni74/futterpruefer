import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { ScoreBadge } from "@/components/score-badge";
import { absoluteUrl } from "@/lib/site";
import { hyphenateCategory } from "@/lib/urls";
import type { getCategoryLeaders, getHomeFaq } from "@/lib/queries";

type Leaders = Awaited<ReturnType<typeof getCategoryLeaders>>;
type Faq = Awaited<ReturnType<typeof getHomeFaq>>;

const GUIDE = [
  {
    title: "Alleinfuttermittel oder Ergänzungsfuttermittel?",
    text: "Ein Alleinfuttermittel muss bei alleiniger Fütterung den gesamten Nährstoffbedarf decken. Ein Ergänzungsfuttermittel – etwa Snacks, Kauartikel oder Pasten – ergänzt die Ration nur. Die Bezeichnung steht verpflichtend auf jedem Etikett und entscheidet, wie wir die Bedarfsdeckung bewerten.",
    links: [["Alleinfuttermittel für Hunde", "/alleinfuttermittel-hund"], ["Ergänzungsfuttermittel für Katzen", "/ergaenzungsfuttermittel-katze"]],
  },
  {
    title: "Zusammensetzung richtig lesen",
    text: "Die Zutaten stehen in absteigender Reihenfolge ihres Gewichtsanteils. Eine offene Deklaration nennt jede Zutat mit Prozentangabe, eine geschlossene nur Kategorien wie „Fleisch und tierische Neben\u00aderzeugnisse“. Je genauer die Angaben, desto besser lässt sich ein Futter beurteilen.",
    links: [["Offene Deklaration", "/glossar#offene-deklaration"], ["Tierische Nebenerzeugnisse", "/lexikon/tierische-nebenerzeugnisse"]],
  },
  {
    title: "Zucker, Farbstoffe und Konservierung",
    text: "Zugesetzter Zucker, Karamell oder Farbstoffe haben für Hund und Katze keinen ernährungsphysiologischen Nutzen. Bei synthetischen Antioxidantien wie BHA oder BHT prüfen wir, ob natürliche Alternativen wie Tocopherole eingesetzt werden. Jeder Inhaltsstoff ist im Futter-Lexikon mit Ampel bewertet.",
    links: [["Zucker im Lexikon", "/lexikon/zucker"], ["Alle Inhaltsstoffe", "/lexikon"]],
  },
  {
    title: "Nährwerte in der Trockensubstanz vergleichen",
    text: "Nassfutter enthält oft rund 80\u00a0% Feuchtigkeit, Trockenfutter etwa 10\u00a0%. Deshalb rechnen wir Rohprotein, Rohfett und Rohasche auf die Trockensubstanz um. Erst so werden Nass- und Trockenfutter wirklich vergleichbar – auf jeder Testseite automatisch.",
    links: [["Trockensubstanz erklärt", "/glossar#trockensubstanz"], ["Taurin für Katzen", "/lexikon/taurin"]],
  },
] as const;

export function HomeSeo({ leaders, faq }: { leaders: Leaders; faq: Faq }) {
  const tops = leaders.filter((l) => l.top);
  return (
    <>
      {tops.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Bestbewertete Futter je Kategorie",
            itemListElement: tops.map((l, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/${l.slug}/${l.top!.slug}`), name: `${l.top!.brand} ${l.top!.productName}` })),
          }}
        />
      )}

      <section aria-labelledby="testsieger" className="mt-16">
        <p className="text-sm font-bold uppercase tracking-wide text-brand">Bestenliste</p>
        <h2 id="testsieger" className="mt-1 text-2xl font-extrabold md:text-3xl">Bestbewertet in jeder Kategorie</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {leaders.map((l) => (
            <li key={l.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-bold">
                  <Link href={`/${l.slug}`} className="hover:text-brand hover:underline">{hyphenateCategory(l.name)}</Link>
                </h3>
                <span className="shrink-0 text-sm text-muted tabular-nums">{l.count} {l.count === 1 ? "Test" : "Tests"}</span>
              </div>
              {l.top ? (
                <Link href={`/${l.slug}/${l.top.slug}`} className="group flex items-center gap-3 rounded-xl bg-bg-soft p-3 hover:bg-brand-soft">
                  <ScoreBadge score={l.top.totalScore} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted"><Award className="size-3.5" aria-hidden />Höchste Punktzahl</span>
                    <span className="block font-semibold group-hover:text-brand-strong">{l.top.brand} {l.top.productName}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-brand" aria-hidden />
                </Link>
              ) : (
                <p className="text-sm text-muted">Die ersten Tests dieser Kategorie folgen in Kürze.</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ratgeber" className="mt-16">
        <p className="text-sm font-bold uppercase tracking-wide text-brand">Ratgeber</p>
        <h2 id="ratgeber" className="mt-1 text-2xl font-extrabold md:text-3xl">Hundefutter und Katzenfutter im Test: Worauf es ankommt</h2>
        <p className="mt-3 max-w-3xl text-muted">
          Futterprüfer bewertet Hunde- und Katzenfutter nach einer offengelegten{" "}
          <Link href="/methodik" className="font-semibold text-brand underline">100-Punkte-Methodik</Link>: Rohstoffqualität, Schadstoffe und bedenkliche Zusätze, Nährstoffprofil, Deklaration, Bedarfsdeckung und Preis-Leistung. Hersteller können Produkte einreichen, eine Einreichung hat aber keinen Einfluss auf die Note.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {GUIDE.map((g) => (
            <article key={g.title} className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="text-lg font-bold">{g.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{g.text}</p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {g.links.map(([label, href]) => (
                  <li key={href}><Link href={href} className="font-semibold text-brand hover:underline">{label} →</Link></li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {faq.length > 0 && (
        <section aria-labelledby="home-faq" className="mt-16">
          <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }} />
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-brand">Häufige Fragen</p>
              <h2 id="home-faq" className="mt-1 text-2xl font-extrabold md:text-3xl">Fragen zum Futtertest</h2>
            </div>
            <Link href="/faq" className="text-sm font-semibold text-brand hover:underline">Alle Fragen →</Link>
          </div>
          <div className="mt-6 space-y-3">
            {faq.map((f) => (
              <details key={f.id} className="group rounded-2xl border border-border bg-surface shadow-card">
                <summary className="flex min-h-14 list-none items-center justify-between gap-3 rounded-2xl p-4 font-bold transition-colors hover:text-brand [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base">{f.question}</h3>
                  <span aria-hidden className="text-xl text-brand transition group-open:rotate-45">+</span>
                </summary>
                <p className="px-4 pb-4 text-muted">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
