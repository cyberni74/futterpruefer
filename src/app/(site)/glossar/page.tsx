import type { Metadata } from "next";
import Link from "next/link";
import { getGlossary } from "@/lib/content";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Glossar: Fachbegriffe der Tierernährung", description: "Fachbegriffe rund um Hunde- und Katzenfutter kurz und verständlich erklärt.", alternates: { canonical: "/glossar" } };

const first = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").charAt(0).toUpperCase();

export default async function GlossarPage() {
  const terms = await getGlossary();
  const groups = new Map<string, typeof terms>();
  for (const t of terms) groups.set(first(t.term), [...(groups.get(first(t.term)) ?? []), t]);
  const letters = [...groups.keys()].sort((a, b) => a.localeCompare(b, "de"));
  return (
    <div className="mx-auto max-w-3xl px-4">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "DefinedTermSet", name: "Glossar Tierernährung", url: absoluteUrl("/glossar"), hasDefinedTerm: terms.map((t) => ({ "@type": "DefinedTerm", name: t.term, description: t.definition, url: absoluteUrl(`/glossar#${t.slug}`) })) }} />
      <Breadcrumbs items={[{ label: "Glossar" }]} />
      <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">Glossar</h1>
      <p className="mt-3 text-lg text-muted">Fachbegriffe aus Tests und Fachblog kurz erklärt. Inhaltsstoffe mit Ampel-Bewertung stehen im <Link href="/lexikon" className="font-semibold text-brand underline">Futter-Lexikon</Link>.</p>
      <nav aria-label="Alphabet" className="mt-6 flex flex-wrap gap-1.5">
        {letters.map((l) => <a key={l} href={`#buchstabe-${l}`} className="inline-flex size-11 items-center justify-center rounded-xl border border-border bg-surface font-bold hover:bg-bg-soft">{l}</a>)}
      </nav>
      {letters.map((l) => (
        <section key={l} id={`buchstabe-${l}`} aria-labelledby={`h-${l}`} className="mt-10 scroll-mt-28">
          <h2 id={`h-${l}`} className="mb-3 text-2xl font-extrabold text-brand">{l}</h2>
          <dl className="space-y-3">
            {groups.get(l)!.map((t) => (
              <div key={t.id} id={t.slug} className="scroll-mt-28 rounded-2xl border border-border bg-surface p-4 shadow-card target:ring-2 target:ring-brand">
                <dt className="text-lg font-bold">{t.term}{t.synonyms.length > 0 && <span className="ml-2 text-sm font-normal text-muted">({t.synonyms.join(", ")})</span>}</dt>
                <dd className="mt-1 text-muted">{t.definition}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
      {terms.length === 0 && <p className="mt-8 text-muted">Noch keine Begriffe hinterlegt.</p>}
    </div>
  );
}
