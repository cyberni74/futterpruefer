import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = { title: "Kontakt", description: "Kontakt zur Redaktion von Futterprüfer – allgemeine Anfragen und Herstelleranfragen.", alternates: { canonical: "/kontakt" } };

export default async function ContactPage({ searchParams }: PageProps<"/kontakt">) {
  const typ = (await searchParams).typ;
  return (
    <PageShell crumb="Kontakt" title="Kontakt" intro="Fragen, Hinweise auf Rückrufe oder Produkteinreichungen – wir freuen uns auf Ihre Nachricht.">
      <ContactForm defaultKind={typ === "hersteller" ? "hersteller" : "allgemein"} />
    </PageShell>
  );
}
