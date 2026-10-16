import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { JsonLd } from "@/components/json-ld";
import { contentAuthor } from "@/lib/attribution";
import { DEFAULT_AUTHOR } from "@/lib/authors";
import { SITE } from "@/lib/site";

const DESCRIPTION =
  "Futterprüfer.de ist ein transparentes Testportal für Hunde- und Katzenfutter. Tests stützen sich auf Kennzeichnung, Herstellerangaben und öffentlich zugängliche Quellen.";

export const metadata: Metadata = {
  title: "Team",
  description: DESCRIPTION,
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  const person = contentAuthor();
  return (
    <PageShell crumb="Team" title="Team">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE.name,
            url: SITE.url,
            description: DESCRIPTION,
          },
          { "@context": "https://schema.org", ...person },
        ]}
      />
      <div className="prose-fp">
        <p>
          Futterprüfer.de ist ein transparentes Testportal für Hunde- und Katzenfutter. Unsere Tests stützen sich auf die Kennzeichnung, die Angaben der Hersteller und öffentlich zugängliche Quellen. Eigene Laboranalysen führen wir nur durch, wenn wir das im Test ausdrücklich angeben. Verantwortlich für die Inhalte ist <span id={DEFAULT_AUTHOR.hash} className="scroll-mt-28">{DEFAULT_AUTHOR.name}</span> (siehe <Link href="/impressum">Impressum</Link>).
        </p>
      </div>
    </PageShell>
  );
}
