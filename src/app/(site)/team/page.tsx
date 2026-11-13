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

      <section aria-labelledby="redaktion" className="prose-fp mt-12">
        <h2 id="redaktion">Die Redaktion von Futterprüfer.de</h2>
        <p>Die Redaktion von Futterprüfer.de prüft Hundefutter und Katzenfutter. Chefredakteur ist Matthias Schröter, Tierarzt und Wissenschaftler. Seit dem 6. November 2026 verantwortet er in Teilzeit die redaktionelle Linie des Portals: welche Futtermittel geprüft werden, wie die Texte argumentieren und woran ein Urteil erkennbar bleibt. Maßgeblich ist, was auf dem Beutel steht und was sich daraus ableiten lässt – nicht das Werbeversprechen.</p>
        <p>Die Prüfung stützt sich auf die Kennzeichnung. Zusammensetzung, analytische Bestandteile und Zusatzstoffe werden vom Etikett, von der Herstellerseite und aus öffentlich zugänglichen Angaben übernommen. Werbeaussagen auf Packung und im Shop werden sachlich und rechtlich eingeordnet. Eigene Laboranalysen führt die Redaktion in der Regel nicht durch. Beruht ein Test auf Laborwerten, steht das ausdrücklich im Bericht. Fehlen Angaben oder widersprechen sie sich, wird das im Text genannt.</p>
        <p>Die Note folgt der offenen <Link href="/methodik">Methodik</Link>. Alleinfutter durchläuft sechs Kriterien und erreicht höchstens 100 Punkte: Rohstoffe, bedenkliche Zusätze, Nährstoffprofil, Deklaration und Transparenz einschließlich der Werbeaussagen, Bedarfsdeckung und Preis. Hersteller beauftragen oder bezahlen keine Tests und haben keinen Einfluss auf die Punkte.</p>
        <p>Matthias Schröter hat Veterinärmedizin an der Vetsuisse-Fakultät der Universität Zürich studiert und dort in Forschung und Lehre zur Ernährung von Hund und Katze gearbeitet. Die Beiträge unter seiner Leitung sollen für Tierhalter klar lesbar sein, ohne die Prüfung weichzuspülen. Die Produkttests stehen in der <Link href="/tests">Übersicht aller Tests</Link>. Wie die Punkte zustande kommen, beschreibt die Methodik. Fachbegriffe erklärt das <Link href="/lexikon">Futter-Lexikon</Link>.</p>
      </section>
    </PageShell>
  );
}
