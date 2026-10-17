import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PageHeader, cardCls } from "@/components/admin/ui";
import { ReferenzForm } from "@/components/admin/referenz-form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { deleteReferenzdosis, saveReferenzdosis } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Referenzdosen" };

const num = (v: { toString(): string } | null) => (v == null ? "" : v.toString().replace(".", ","));

export default async function ReferenzdosenPage() {
  const rows = await prisma.referenzdosis.findMany({ orderBy: [{ wirkstoff: "asc" }, { tierart: "asc" }] });
  return (
    <>
      <PageHeader title="Referenzdosen" description="Interne Tabelle für die Ergänzungsfutter-Bewertung. Sie erscheint nicht als öffentliche Methodikseite." />
      <ReferenzForm action={saveReferenzdosis.bind(null, null)} />
      <h2 className="mt-8 mb-3 text-lg font-bold">Gespeichert ({rows.length})</h2>
      <ul className="space-y-3">
        {rows.map((row) => (
          <li key={row.id} className={cardCls}>
            <details>
              <summary className="min-h-11 cursor-pointer font-semibold">
                {row.wirkstoff} · {row.tierart === "KATZE" ? "Katze" : "Hund"}
                {row.luecke ? " · Lücke" : ""}
              </summary>
              <div className="mt-4 border-t border-border pt-4">
                <ReferenzForm
                  action={saveReferenzdosis.bind(null, row.id)}
                  item={{
                    wirkstoff: row.wirkstoff,
                    tierart: row.tierart,
                    mgProKgMin: num(row.mgProKgMin),
                    mgProKgMax: num(row.mgProKgMax),
                    einheit: row.einheit,
                    quelle: row.quelle,
                    luecke: row.luecke,
                    hinweis: row.hinweis,
                    stand: row.stand.toISOString().slice(0, 10),
                  }}
                />
                <div className="mt-3 flex justify-end">
                  <ConfirmButton action={deleteReferenzdosis.bind(null, row.id)} confirmText="Diese Referenzdosis wirklich löschen?" />
                </div>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </>
  );
}
