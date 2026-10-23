import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { AMAZON_PARTNER_NOTICE, OPERATOR } from "@/lib/site";

export const metadata: Metadata = { title: "Impressum", description: "Anbieterkennzeichnung von Futterprüfer.de nach § 5 DDG: Anbieter, Kontakt, Register und inhaltlich Verantwortliche.", robots: { index: true, follow: true }, alternates: { canonical: "/impressum" } };

export default function ImpressumPage() {
  return (
    <PageShell crumb="Impressum" path="/impressum" title="Impressum">
      <div className="prose-fp">
        <h2>Angaben gemäß § 5 DDG</h2>
        <p>
          <strong>{OPERATOR.name}</strong><br />
          {OPERATOR.address.map((line) => <span key={line}>{line}<br /></span>)}
        </p>
        <p>Geschäftsführer und Vertretungsberechtigter: {OPERATOR.managingDirector}</p>

        <h2>Kontakt</h2>
        <p>
          E-Mail: <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a><br />
          Telefon: {OPERATOR.phone}
        </p>

        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>{OPERATOR.responsibleContent}, {OPERATOR.address.join(", ")}</p>

        <h2>Vertreter für Europa</h2>
        <p>{OPERATOR.europeRepresentative}{OPERATOR.europeAddress ? `, ${OPERATOR.europeAddress}` : ""}</p>

        <h2>Verbraucherstreitbeilegung</h2>
        <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>

        <h2>Amazon-Partnerprogramm</h2>
        <p>{AMAZON_PARTNER_NOTICE}</p>
      </div>
    </PageShell>
  );
}
