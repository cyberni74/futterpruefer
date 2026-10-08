import type { Metadata } from "next";
import { PageShell, Todo } from "@/components/page-shell";
import { JsonLd } from "@/components/json-ld";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Team", description: "Wer hinter Futterprüfer steht: Expertise und Werdegang des Teams.", alternates: { canonical: "/team" } };

export default function TeamPage() {
  return (
    <PageShell crumb="Team" title="Unser Team" intro="Futterspezialisten mit dem Ziel, Tierhaltern eine ehrliche, nachvollziehbare Orientierung zu geben.">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: SITE.name, url: SITE.url, knowsAbout: ["Tierernährung", "Futtermittelrecht", "Hundefutter", "Katzenfutter"] }} />
      <div className="prose-fp">
        <p><Todo>Teammitglieder mit Name, Foto, Rolle und Kurzvorstellung</Todo></p>
        <h2>Expertise</h2>
        <ul>
          <li><Todo>Ausbildung / Studium</Todo></li>
          <li><Todo>Berufserfahrung im Futtermittelbereich</Todo></li>
          <li><Todo>Zertifizierungen, Mitgliedschaften, Veröffentlichungen</Todo></li>
        </ul>
        <h2>Warum dieses Portal?</h2>
        <p><Todo>Motivation in eigenen Worten</Todo></p>
      </div>
    </PageShell>
  );
}
