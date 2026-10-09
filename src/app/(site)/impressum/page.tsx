import type { Metadata } from "next";
import { PageShell, Todo } from "@/components/page-shell";
import { OPERATOR } from "@/lib/site";

export const metadata: Metadata = { title: "Impressum", description: "Anbieterkennzeichnung von Futterprüfer.de nach § 5 DDG: Anbieter, Kontakt, Register und inhaltlich Verantwortliche.", robots: { index: true, follow: true }, alternates: { canonical: "/impressum" } };

export default function ImpressumPage() {
  const [main, other] = OPERATOR.address;
  return (
    <PageShell crumb="Impressum" title="Impressum">
      <div className="prose-fp">
        <h2>Angaben gemäß § 5 DDG</h2>
        <p>
          <strong>{OPERATOR.name}</strong><br />
          {OPERATOR.nameSuffix}<br />
          {main[0]}<br />
          {main[1]}
        </p>
        <p>
          Weiterer Standort:<br />
          {other[0]}<br />
          {other[1]}
        </p>
        <p>Vertretungsberechtigt: Beytullah Coscun</p>
        <p>Vertreter für Europa: {OPERATOR.europeRepresentative}, <Todo>ladungsfähige Anschrift in der EU</Todo></p>

        <h2>Kontakt</h2>
        <p>
          E-Mail: <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a><br />
          Telefon: {OPERATOR.phone}<br />
          Telefon (international): {OPERATOR.phoneInternational}<br />
          Erreichbar: {OPERATOR.hours}
        </p>

        <h2>Registereintrag</h2>
        <p>Registernummer (LLPIN): {OPERATOR.registrationNo}, Registrar of Companies Bangalore, Ministry of Corporate Affairs, Indien</p>

        <h2>Steuernummern</h2>
        <p>Es besteht keine deutsche Umsatzsteuer-Identifikationsnummer. Steuerregistrierungen in Indien (GST): {OPERATOR.gst.join(" und ")}.</p>

        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>{OPERATOR.europeRepresentative}, <Todo>ladungsfähige Anschrift in der EU</Todo></p>

        <h2>Verbraucherstreitbeilegung</h2>
        <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      </div>
    </PageShell>
  );
}
