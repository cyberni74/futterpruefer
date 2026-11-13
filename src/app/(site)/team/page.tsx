import type { Metadata } from "next";
import Link from "next/link";
import { FpImage } from "@/components/fp-image";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { absoluteUrl, pageAlternates, SITE } from "@/lib/site";

const DESCRIPTION =
  "Chefredakteur Matthias Schröter leitet die Redaktion von Futterprüfer.de. Tests von Hunde- und Katzenfutter nach Kennzeichnung, Zusammensetzung und Methodik.";

const PORTRAIT = "/redaktion/matthias-schroeter-chefredakteur.webp";

const PROFILE = {
  hash: "matthias-schroeter",
  label: "Chefredaktion",
  name: "Matthias Schröter",
  role: "Chefredakteur von Futterprüfer.de",
  meta: "Seit 6. November 2026, angestellt in Teilzeit",
  paragraphs: [
    "Matthias Schröter verantwortet die redaktionelle Linie des Portals: welche Futtermittel geprüft werden, wie die Texte argumentieren und woran ein Urteil erkennbar bleibt. Maßgeblich ist, was auf dem Beutel steht und was sich daraus ableiten lässt – nicht das Werbeversprechen.",
    "Als Tierarzt und Wissenschaftler liegt sein Schwerpunkt auf der Ernährung von Hund und Katze. An der Vetsuisse-Fakultät der Universität Zürich hat er Veterinärmedizin studiert und in Forschung und Lehre zur Heimtierernährung gearbeitet. Ihm kommt es darauf an, dass aus einer Zutatenliste ein nachvollziehbares Bild wird, kein Wohlfühltext.",
    "Die Beiträge unter seiner Leitung sollen für Tierhalter klar lesbar und für Suchmaschinen auffindbar sein, ohne die Prüfung weichzuspülen.",
  ],
} as const;

const WERDEGANG = [
  {
    period: "seit 2026",
    title: "Chefredakteur, Futterprüfer.de",
    detail: "Angestellt in Teilzeit, seit 6. November 2026",
    text: "Leitung der Redaktion, Verantwortung für Tests, Fachbeiträge und die Bewertungslinie des Portals.",
  },
  {
    period: "seit 2025",
    title: "Forschung und Lehre zur Heimtierernährung",
    detail: "Institut für Tierernährung und Diätetik, Vetsuisse-Fakultät, Universität Zürich",
    text: "Arbeit zu klinischer Diätetik, funktionellen Inhaltsstoffen und nachhaltigen Proteinquellen in der Ernährung von Hund und Katze.",
  },
  {
    period: "2022–2025",
    title: "Wissenschaftliche Tätigkeit nach der Promotion",
    detail: "Vetsuisse-Fakultät, Universität Zürich",
    text: "Forschung zu Nährstoffverwertung, Futterakzeptanz und Diätetik; Lehre und Betreuung von Qualifikationsarbeiten.",
  },
  {
    period: "2018–2022",
    title: "Promotion zum Dr. med. vet.",
    detail: "Vetsuisse-Fakultät, Universität Zürich",
    text: "Dissertation zur Nährstoffverwertung und Verdauungsphysiologie bei Hunden und Katzen unter besonderer Berücksichtigung funktioneller Futtermittel.",
  },
  {
    period: "2012–2018",
    title: "Studium der Veterinärmedizin",
    detail: "Vetsuisse-Fakultät, Universität Zürich",
    text: "Abschluss als Tierarzt (Staatsexamen).",
  },
] as const;

export const metadata: Metadata = {
  title: "Redaktion: Chefredakteur Matthias Schröter",
  description: DESCRIPTION,
  alternates: pageAlternates("/team"),
};

export default function TeamPage() {
  const personUrl = absoluteUrl(`/team#${PROFILE.hash}`);
  return (
    <PageShell crumb="Team" path="/team" title="Team" wide>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE.name,
            url: SITE.url,
            description: DESCRIPTION,
          },
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": personUrl,
            name: PROFILE.name,
            url: personUrl,
            jobTitle: "Chefredakteur",
            image: absoluteUrl(PORTRAIT),
          },
        ]}
      />
      <article aria-labelledby={PROFILE.hash} className="rounded-[1.75rem] bg-bg-soft p-5 sm:p-8">
        <div className="grid items-start gap-8 md:grid-cols-[17.5rem_minmax(0,1fr)] md:gap-10">
          <div className="mx-auto w-full max-w-xs md:mx-0 md:max-w-none">
            <div className="relative aspect-[1290/1280] overflow-hidden rounded-[1.35rem] border-[6px] border-brand shadow-card">
              <FpImage
                src={PORTRAIT}
                alt="Matthias Schröter, Chefredakteur von Futterprüfer.de"
                sizes="(min-width: 768px) 280px, 320px"
                priority
              />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">{PROFILE.label}</p>
            <h2 id={PROFILE.hash} className="mt-2 scroll-mt-28 text-3xl font-extrabold tracking-tight md:text-4xl">{PROFILE.name}</h2>
            <p className="mt-2 text-lg font-semibold text-brand">{PROFILE.role}</p>
            <p className="mt-1 text-sm text-muted">{PROFILE.meta}</p>
            <div className="prose-fp mt-6">
              {PROFILE.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </div>
      </article>

      <section aria-labelledby="werdegang" className="mt-8 rounded-[1.75rem] border border-border bg-surface px-5 py-6 shadow-card sm:px-8 sm:py-8">
        <h2 id="werdegang" className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Werdegang</h2>
        <ol className="mt-6 divide-y divide-border">
          {WERDEGANG.map((entry) => (
            <li key={entry.period} className="grid gap-1 py-5 first:pt-0 last:pb-0 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-x-8">
              <p className="text-sm font-bold text-brand">{entry.period}</p>
              <div>
                <h3 className="text-base font-bold leading-snug">{entry.title}</h3>
                <p className="mt-1 text-sm text-muted">{entry.detail}</p>
                <p className="mt-2 leading-relaxed">{entry.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="redaktion" aria-labelledby="redaktion-titel" className="mt-8 rounded-[1.75rem] border border-border bg-surface px-5 py-6 shadow-card sm:px-8 sm:py-8">
        <h2 id="redaktion-titel" className="text-2xl font-extrabold tracking-tight md:text-3xl">Hundefutter- und Katzenfutter-Tests vom Tierarzt</h2>
        <p className="mt-4 text-[1.0625rem] leading-relaxed md:text-lg">Die Redaktion von Futterprüfer.de führt den Hundefutter-Test und den Katzenfutter-Test. Chefredakteur ist Matthias Schröter, Tierarzt.</p>
        <div className="mt-5 rounded-2xl border border-border bg-bg-soft p-4 sm:p-5">
          <p className="text-[1.0625rem] leading-relaxed md:text-lg">Futtermittel prüfen wir über die Kennzeichnung: <span className="font-bold text-brand">Zusammensetzung</span>, <span className="font-bold text-brand">Inhaltsstoffe</span> und <span className="font-bold text-brand">Werbeaussagen</span>. Eigene Laboranalysen führen wir in der Regel nicht durch.</p>
        </div>
        <div className="mt-4 rounded-2xl border-2 border-brand bg-brand-soft p-4 sm:p-5">
          <p className="text-[1.0625rem] leading-relaxed md:text-lg">Wer wissen will, welches Hundefutter das beste ist, welches Katzenfutter das beste ist oder welches Futter empfohlen wird, bekommt keine pauschale Empfehlung des Tierarztes. Eine Empfehlung gibt es nur bei grüner Bewertung, einen Testsieger nur dort, wo ein Produkt vorn liegt. Es bleibt ein unabhängiger Futtertest: Hersteller beauftragen oder bezahlen keine Tests und haben keinen Einfluss auf die Punkte.</p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="relative rounded-2xl border border-border bg-bg-soft p-4 transition hover:border-brand hover:bg-brand-soft">
            <p className="text-[1.0625rem] leading-relaxed">Die Note folgt der <Link href="/methodik" className="font-bold text-brand underline decoration-2 underline-offset-4 after:absolute after:inset-0">Methodik der Futtertests</Link> mit sechs Kriterien und höchstens 100 Punkten.</p>
          </div>
          <div className="relative rounded-2xl border border-border bg-bg-soft p-4 transition hover:border-brand hover:bg-brand-soft">
            <p className="text-[1.0625rem] leading-relaxed">Alle Prüfungen stehen in der <Link href="/tests" className="font-bold text-brand underline decoration-2 underline-offset-4 after:absolute after:inset-0">Übersicht aller Hundefutter- und Katzenfutter-Tests</Link>.</p>
          </div>
          <div className="relative rounded-2xl border border-border bg-bg-soft p-4 transition hover:border-brand hover:bg-brand-soft">
            <p className="text-[1.0625rem] leading-relaxed">Begriffe erklärt das <Link href="/lexikon" className="font-bold text-brand underline decoration-2 underline-offset-4 after:absolute after:inset-0">Futter-Lexikon zu Inhaltsstoffen</Link>.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
