import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { FaqForm } from "@/components/admin/faq-form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PageHeader, Section, cardCls } from "@/components/admin/ui";
import { deleteFaq, saveFaq } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "FAQ" };

export default async function FaqPage() {
  const items = await prisma.faqItem.findMany({ orderBy: [{ sortOrder: "asc" }, { question: "asc" }] });
  const nextSort = items.length ? Math.max(...items.map((i) => i.sortOrder)) + 10 : 10;
  return (
    <>
      <PageHeader title="FAQ" description="Häufige Fragen – sortiert nach dem Feld „Sortierung“ (aufsteigend)." />
      <Section title="Neue Frage" id="faq-new">
        <FaqForm action={saveFaq.bind(null, null)} nextSort={nextSort} />
      </Section>
      <h2 className="mt-8 mb-3 text-lg font-bold">Alle Fragen ({items.length})</h2>
      {items.length === 0 ? (
        <p className={`${cardCls} text-muted`}>Noch keine Fragen.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.id} className={cardCls}>
              <details>
                <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
                  <span className="inline-flex min-w-10 justify-center rounded-lg bg-bg-soft px-2 py-1 text-xs font-bold tabular-nums text-muted">{it.sortOrder}</span>
                  <span className="min-w-0 flex-1 font-semibold">{it.question}</span>
                  <span className="shrink-0 text-sm font-semibold text-brand">Bearbeiten</span>
                </summary>
                <div className="mt-4 border-t border-border pt-4">
                  <FaqForm action={saveFaq.bind(null, it.id)} item={it} />
                  <div className="mt-3 flex justify-end">
                    <ConfirmButton action={deleteFaq.bind(null, it.id)} confirmText="Diese Frage wirklich löschen?" />
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
