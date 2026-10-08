import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/db";
import { TickerForm } from "@/components/admin/ticker-form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PageHeader, Section, cardCls } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/admin/datetime";
import { deleteTicker, saveTicker } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Ticker" };

export default async function TickerPage() {
  const now = new Date();
  const items = await prisma.tickerItem.findMany({ orderBy: [{ active: "desc" }, { createdAt: "desc" }] });

  return (
    <>
      <PageHeader title="Ticker" description="Kurzmeldungen im Laufband der Website – z. B. Rückrufe oder neue Tests." />
      <Section title="Neue Meldung" id="ticker-new">
        <TickerForm action={saveTicker.bind(null, null)} />
      </Section>

      <h2 className="mt-8 mb-3 text-lg font-bold">Alle Meldungen ({items.length})</h2>
      {items.length === 0 ? (
        <p className={`${cardCls} text-muted`}>Noch keine Meldungen.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => {
            const expired = !!it.expiresAt && it.expiresAt.getTime() <= now.getTime();
            const live = it.active && !expired;
            return (
              <li key={it.id} className={cardCls}>
                <details>
                  <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 transition-colors hover:text-brand [&::-webkit-details-marker]:hidden">
                    {it.isWarning && <AlertTriangle className="size-5 shrink-0 text-bad" aria-label="Warnung" />}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{it.text}</span>
                      <span className="block text-xs text-muted">
                        {it.href ? `${it.href} · ` : ""}
                        {it.expiresAt ? `${expired ? "abgelaufen" : "läuft ab"} ${formatDateTime(it.expiresAt)}` : "ohne Ablauf"}
                      </span>
                    </span>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${live ? "bg-good-soft text-good" : "bg-bg-soft text-muted"}`}>
                      {live ? "Live" : expired ? "Abgelaufen" : "Inaktiv"}
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-brand">Bearbeiten</span>
                  </summary>
                  <div className="mt-4 border-t border-border pt-4">
                    <TickerForm action={saveTicker.bind(null, it.id)} item={it} />
                    <div className="mt-3 flex justify-end">
                      <ConfirmButton action={deleteTicker.bind(null, it.id)} confirmText="Diese Ticker-Meldung wirklich löschen?" />
                    </div>
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
