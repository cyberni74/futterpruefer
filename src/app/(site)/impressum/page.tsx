import type { Metadata } from "next";
import { PageShell, Todo } from "@/components/page-shell";

export const metadata: Metadata = { title: "Impressum", robots: { index: true, follow: true }, alternates: { canonical: "/impressum" } };

export default function ImpressumPage() {
  return (
    <PageShell crumb="Impressum" title="Impressum">
      <div className="prose-fp">
        <h2>Angaben gemäß § 5 DDG</h2>
        <p><Todo>Vor- und Nachname / Firma</Todo><br /><Todo>Straße, Hausnummer</Todo><br /><Todo>PLZ, Ort</Todo></p>
        <h2>Kontakt</h2>
        <p>E-Mail: <Todo>E-Mail-Adresse</Todo><br />Telefon: <Todo>optional</Todo></p>
        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p><Todo>Name, Anschrift</Todo></p>
        <h2>Umsatzsteuer-ID</h2>
        <p><Todo>falls vorhanden</Todo></p>
        <h2>Verbraucherstreitbeilegung</h2>
        <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
        <p className="text-sm text-muted">Hinweis: Diese Vorlage ersetzt keine Rechtsberatung. Bitte vor Veröffentlichung prüfen lassen.</p>
      </div>
    </PageShell>
  );
}
