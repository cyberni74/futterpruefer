import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PageShell } from "@/components/page-shell";
import { JsonLd } from "@/components/json-ld";
import { faqPageJsonLd } from "@/lib/faq-schema";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Häufige Fragen", description: "Antworten auf häufige Fragen zu Futterprüfer, Bewertungen und Methodik.", alternates: { canonical: "/faq" } };

export default async function FaqPage() {
  const items = await prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } });
  const faqLd = faqPageJsonLd(items);
  return (
    <PageShell crumb="FAQ" path="/faq" title="Häufige Fragen">
      {faqLd && <JsonLd data={faqLd} />}
      <div className="space-y-3">
        {items.map((i) => (
          <details key={i.id} className="group rounded-2xl border border-border bg-surface shadow-card">
            <summary className="flex min-h-14 list-none items-center justify-between gap-3 rounded-2xl p-4 font-bold transition-colors hover:text-brand">
              <h2 className="text-base">{i.question}</h2>
              <span aria-hidden className="text-xl text-brand transition group-open:rotate-45">+</span>
            </summary>
            <p className="px-4 pb-4 text-muted">{i.answer}</p>
          </details>
        ))}
      </div>
      {items.length === 0 && <p className="text-muted">Noch keine Fragen hinterlegt.</p>}
    </PageShell>
  );
}
