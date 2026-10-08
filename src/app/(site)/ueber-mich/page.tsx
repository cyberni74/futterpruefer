import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Todo } from "@/components/page-shell";
import { JsonLd } from "@/components/json-ld";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Über mich", description: "Wer hinter Futterprüfer steht: Expertise und Werdegang des Betreibers.", alternates: { canonical: "/ueber-mich" } };

export default function AboutPage() {
  return (
    <PageShell crumb="Über mich" title="Über mich" intro="Futterspezialist mit dem Ziel, Tierhaltern eine ehrliche, nachvollziehbare Orientierung zu geben.">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Person", name: SITE.author, worksFor: { "@type": "Organization", name: SITE.name, url: SITE.url }, knowsAbout: ["Tierernährung", "Futtermittelrecht", "Hundefutter", "Katzenfutter"] }} />
      <div className="prose-fp">
        <p><Todo>Name, Foto und Kurzvorstellung</Todo></p>
        <h2>Expertise</h2>
        <ul>
          <li><Todo>Ausbildung / Studium</Todo></li>
          <li><Todo>Berufserfahrung im Futtermittelbereich</Todo></li>
          <li><Todo>Zertifizierungen, Mitgliedschaften, Veröffentlichungen</Todo></li>
        </ul>
        <h2>Warum dieses Portal?</h2>
        <p><Todo>Motivation in eigenen Worten</Todo></p>
        <p>Meine beruflichen Verbindungen lege ich auf der <Link href="/methodik#interessenkonflikte">Methodik-Seite</Link> vollständig offen.</p>
      </div>
    </PageShell>
  );
}
