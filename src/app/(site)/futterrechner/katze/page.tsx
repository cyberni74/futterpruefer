import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { FaqListe, QuellenUndAutor } from "@/components/futterrechner/faq-quellen";
import { Rechner } from "@/components/futterrechner/rechner";
import { SeoKatze } from "@/components/futterrechner/seo-katze";
import { TestCtas } from "@/components/futterrechner/test-ctas";
import { ladeTestCtas } from "@/lib/futterrechner/test-queries";
import { futterrechnerMetadata } from "@/lib/futterrechner/seite";
import { FAQ_KATZE, META, futterrechnerJsonLd } from "@/lib/futterrechner/seo";
import "@/styles/futterrechner.css";

export const metadata = futterrechnerMetadata("katze");
export const revalidate = 3600;

export default async function FutterrechnerKatze() {
  const tests = await ladeTestCtas("katze");
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 lg:pb-8">
      <JsonLd data={futterrechnerJsonLd("katze", FAQ_KATZE)} />
      <Breadcrumbs items={[{ label: "Futterrechner", href: "/futterrechner" }, { label: "Katze", href: META.katze.path }]} />
      <header className="mt-4 max-w-3xl">
        <h1 className="text-3xl font-extrabold md:text-5xl">{META.katze.h1}</h1>
        <p className="mt-4 text-lg text-muted">
          Tippen Sie die analytischen Bestandteile von der Packung ein. Der Rechner zeigt in Sekunden, ob das Futter die FEDIAF-Mindestwerte für Ihre Katze erreicht, wie viele Kalorien es hat und wie viel Gramm am Tag ein guter Startwert sind.
        </p>
        <p className="mt-3 inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-strong">Nach FEDIAF 2025 · im Browser berechnet</p>
      </header>
      <div className="mt-6">
        <Rechner art="katze" ctas={{ trocken: <TestCtas tests={tests.trocken} art="katze" futterart="trocken" />, nass: <TestCtas tests={tests.nass} art="katze" futterart="nass" /> }} />
      </div>
      <div className="mx-auto max-w-3xl lg:mx-0">
        <SeoKatze />
        <FaqListe fragen={FAQ_KATZE} />
        <QuellenUndAutor />
      </div>
    </div>
  );
}
