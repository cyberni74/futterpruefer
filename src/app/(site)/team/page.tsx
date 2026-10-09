import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { JsonLd } from "@/components/json-ld";
import { contentAuthor } from "@/lib/attribution";

const DESCRIPTION =
  "Futterprüfer.de ist ein transparentes Testportal für Hunde- und Katzenfutter. Tests stützen sich auf Kennzeichnung, Herstellerangaben und öffentlich zugängliche Quellen.";

export const metadata: Metadata = {
  title: "Team",
  description: DESCRIPTION,
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  const author = contentAuthor();
  return (
    <PageShell crumb="Team" title="Team">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: author.name,
          url: author.url,
          description: DESCRIPTION,
        }}
      />
      <div className="prose-fp">
        <p>
          Futterprüfer.de ist ein transparentes Testportal für Hunde- und Katzenfutter. Unsere Tests stützen sich auf die Kennzeichnung, die Angaben der Hersteller und öffentlich zugängliche Quellen. Eigene Laboranalysen führen wir nur durch, wenn wir das im Test ausdrücklich angeben. Wer für die Inhalte verantwortlich ist, steht im <Link href="/impressum">Impressum</Link>.
        </p>
      </div>
    </PageShell>
  );
}
