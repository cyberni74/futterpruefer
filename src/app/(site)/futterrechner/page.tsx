import { Calculator, Cat, Dog } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { FaqListe, QuellenUndAutor } from "@/components/futterrechner/faq-quellen";
import { Infografik6 } from "@/components/futterrechner/infografiken";
import { futterrechnerMetadata } from "@/lib/futterrechner/seite";
import { FAQ_HUB, META, futterrechnerJsonLd } from "@/lib/futterrechner/seo";

export const metadata = futterrechnerMetadata("hub");

const a = "font-semibold text-brand underline underline-offset-4 hover:text-brand-strong";
const karte = "group flex min-h-40 flex-col justify-between rounded-3xl border border-border bg-surface p-6 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lift motion-reduce:hover:translate-y-0";

export default function FutterrechnerHub() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-16">
      <JsonLd data={futterrechnerJsonLd("hub", FAQ_HUB)} />
      <Breadcrumbs items={[{ label: "Futterrechner", href: META.hub.path }]} />
      <header className="mt-4">
        <p className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-brand"><Calculator aria-hidden className="size-4" /> Futterrechner</p>
        <h1 className="mt-2 text-3xl font-extrabold md:text-5xl">{META.hub.h1}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">Analysewerte vom Etikett eintippen, Nährwert-Check nach FEDIAF und Tagesmenge sofort sehen. Kostenlos, ohne Anmeldung, nichts gespeichert.</p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/futterrechner/hund" className={karte}>
          <Dog aria-hidden className="size-10 text-brand" />
          <span>
            <span className="font-display block text-2xl font-extrabold">Nährwert-Check Hund</span>
            <span className="mt-1 block text-sm text-muted">Welpen, erwachsene Hunde und Senioren, Trocken- und Nassfutter.</span>
          </span>
        </Link>
        <Link href="/futterrechner/katze" className={karte}>
          <Cat aria-hidden className="size-10 text-brand" />
          <span>
            <span className="font-display block text-2xl font-extrabold">Nährwert-Check Katze</span>
            <span className="mt-1 block text-sm text-muted">Kitten, Wohnungskatzen und Freigänger, mit Taurin-Prüfung.</span>
          </span>
        </Link>
      </div>

      <div className="prose-fp mt-12">
        <h2 id="was-er-kann">Was der Futterrechner kann</h2>
        <ul>
          <li>Analysewerte auf Trockenmasse und Energie (ME) umrechnen, nach dem Verfahren des NRC (2006).</li>
          <li>Den Energiebedarf Ihres Tieres schätzen und daraus die Tagesmenge als Startwert berechnen.</li>
          <li>Protein und Fett je 1000 kcal sowie Calcium, Phosphor und Taurin mit den FEDIAF-Mindestwerten vergleichen.</li>
          <li>Einen Nährwert-Check mit Note, nachvollziehbarer Begründung und aufklappbarem Rechenweg ausgeben.</li>
        </ul>
        <h2 id="was-er-nicht-kann">Was er nicht kann</h2>
        <p>
          Der Rechner ist kein Testurteil. Er bewertet nur die Nährwerte, die Sie eingeben. Zutaten, Rohstoffqualität, Zusatzstoffe und Deklaration kann ein Rechner nicht prüfen. Dafür gibt es unsere <Link href="/tests" className={a}>Tests</Link> nach der 100-Punkte-<Link href="/methodik" className={a}>Methodik</Link>. Gute Werte machen noch kein gutes Futter. Für Ergänzungsfutter und Snacks gibt es keine Note, sondern Energie und Leckerli-Budget. Hat Ihr Tier eine Erkrankung, klärt die Tierarztpraxis, welches Futter passt. Der Rechner ist dafür nicht gedacht.
        </p>
        <h2 id="rechenbasis">Unsere Rechenbasis</h2>
        <p>
          Grundlage sind die FEDIAF Nutritional Guidelines (September 2025) und das Energieverfahren des NRC (2006). Eigene Festlegungen sind benannt: der Kastriert-Faktor × 0,9 (abgeleitet aus AAHA 2021), die Spanne von ±10 % und das Rohasche-Band von 3 bis 12 % der Trockenmasse. Alles wird in Ihrem Browser berechnet. Es gibt keinen Server-Aufruf mit Ihren Werten und keine Datenbank. Die Einzelheiten stehen auf den Seiten für <Link href="/futterrechner/hund" className={a}>Hundefutter</Link> und <Link href="/futterrechner/katze" className={a}>Katzenfutter</Link>.
        </p>
        <Infografik6 />
      </div>
      <FaqListe titel="Häufige Fragen" fragen={FAQ_HUB} />
      <QuellenUndAutor />
    </div>
  );
}
