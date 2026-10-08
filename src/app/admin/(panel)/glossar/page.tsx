import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { GlossaryForm } from "@/components/admin/glossary-form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PageHeader, Section, cardCls } from "@/components/admin/ui";
import { deleteGlossary, saveGlossary } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Glossar" };

export default async function GlossarAdminPage() {
  const items = (await prisma.glossaryTerm.findMany()).sort((a, b) => a.term.localeCompare(b.term, "de"));
  return (
    <>
      <PageHeader title="Glossar" description="Fachbegriffe – werden in Artikeln automatisch verlinkt (Lexikon-Einträge haben Vorrang)." />
      <Section title="Neuer Begriff" id="glossar-new">
        <GlossaryForm action={saveGlossary.bind(null, null)} />
      </Section>
      <h2 className="mt-8 mb-3 text-lg font-bold">Alle Begriffe ({items.length})</h2>
      {items.length === 0 ? (
        <p className={`${cardCls} text-muted`}>Noch keine Begriffe.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.id} className={cardCls}>
              <details>
                <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 flex-1"><span className="font-semibold">{it.term}</span><span className="block truncate text-sm text-muted">{it.definition}</span></span>
                  <span className="shrink-0 text-sm font-semibold text-brand">Bearbeiten</span>
                </summary>
                <div className="mt-4 border-t border-border pt-4">
                  <GlossaryForm action={saveGlossary.bind(null, it.id)} item={it} />
                  <div className="mt-3 flex justify-end"><ConfirmButton action={deleteGlossary.bind(null, it.id)} confirmText="Diesen Begriff wirklich löschen?" /></div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
