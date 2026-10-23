import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { JsonLd } from "@/components/json-ld";
import { contentAuthor } from "@/lib/attribution";
import { DEFAULT_AUTHOR } from "@/lib/authors";
import { SITE } from "@/lib/site";

const DESCRIPTION =
  "Futterprüfer.de ist ein transparentes Testportal für Hunde- und Katzenfutter. Wir stützen uns auf Kennzeichnung, Herstellerangaben und öffentliche Quellen.";

export const metadata: Metadata = {
  title: "Team",
  description: DESCRIPTION,
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  const person = contentAuthor();
  return (
    <PageShell crumb="Team" path="/team" title="Team">
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
          Futterprüfer.de ist ein transparentes Testportal für Hunde- und Katzenfutter. Unsere Tests stützen sich auf die Kennzeichnung, die Angaben der Hersteller und öffentlich zugängliche Quellen. Eigene Laboranalysen führen wir nur durch, wenn wir das im Test ausdrücklich angeben. Verantwortlich für die Inhalte ist {DEFAULT_AUTHOR.name} (siehe <Link href="/impressum">Impressum</Link>).
        </p>
        <h2 id={DEFAULT_AUTHOR.hash} className="scroll-mt-28">{DEFAULT_AUTHOR.name}</h2>
        <p>{DEFAULT_AUTHOR.name} ist verantwortlich für die Inhalte von Futterprüfer.de nach § 18 Abs. 2 MStV und arbeitet in der Tierarztpraxis als Assistenz.</p>
        <p><strong>Berufliche Stationen</strong></p>
        <ul>
          <li>seit Januar 2023: Assistenz in der Tierarztpraxis Pfotenfreund, Berlin</li>
          <li>Januar 2021 bis Januar 2023: Tätigkeit in der Tierarztpraxis Am Sonnenhang, München</li>
        </ul>
      </div>
    </PageShell>
  );
}
