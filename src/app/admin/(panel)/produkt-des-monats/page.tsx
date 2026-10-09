import type { Metadata } from "next";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { prisma } from "@/lib/db";
import { PdmForm } from "@/components/admin/pdm-form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PageHeader, Section, cardCls } from "@/components/admin/ui";
import { ScoreBadge } from "@/components/score-badge";
import { MONTHS } from "@/lib/site";
import { deletePdm, savePdm } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Produkt des Monats" };

function berlinYearMonth(d: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin", year: "numeric", month: "numeric" }).formatToParts(d);
  return { year: Number(parts.find((p) => p.type === "year")?.value), month: Number(parts.find((p) => p.type === "month")?.value) };
}

export default async function PdmPage() {
  const now = new Date();
  const [reviews, archive] = await Promise.all([
    prisma.review.findMany({
      where: { status: "PUBLISHED", publishedAt: { lte: now } },
      orderBy: [{ totalScore: "desc" }, { title: "asc" }],
      select: { id: true, title: true, totalScore: true },
    }),
    prisma.productOfMonth.findMany({
      orderBy: [{ year: "desc" }, { month: "desc" }],
      include: { review: { select: { id: true, title: true, slug: true, totalScore: true } } },
    }),
  ]);
  const { year, month } = berlinYearMonth(now);

  return (
    <>
      <PageHeader title="Produkt des Monats" description="Jeden Monat wird automatisch der Test mit der höchsten Gesamtwertung zum Produkt des Monats (Testsieger). Hier können Sie ihn für einen Monat überschreiben." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Section title="Festlegen" id="pdm-new">
          {reviews.length === 0 ? (
            <p className="text-sm text-muted">Es gibt noch keine veröffentlichten Tests.</p>
          ) : (
            <PdmForm action={savePdm} reviews={reviews} defaultYear={year} defaultMonth={month} />
          )}
        </Section>
        <section aria-labelledby="pdm-archive" className={cardCls}>
          <h2 id="pdm-archive" className="text-lg font-bold">
            Archiv ({archive.length})
          </h2>
          {archive.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Noch keine Einträge.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {archive.map((p) => (
                <li key={p.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start">
                  <div className="flex min-w-0 flex-1 gap-3">
                    <ScoreBadge score={p.review.totalScore} size="sm" />
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-brand uppercase">
                        <Trophy className="size-3.5" aria-hidden /> {MONTHS[p.month - 1]} {p.year}
                      </p>
                      <Link href={`/admin/tests/${p.review.id}`} className="font-semibold hover:text-brand">
                        {p.review.title}
                      </Link>
                      <p className="mt-1 text-sm text-muted">{p.reason}</p>
                    </div>
                  </div>
                  <ConfirmButton action={deletePdm.bind(null, p.id)} confirmText={`Eintrag ${MONTHS[p.month - 1]} ${p.year} wirklich löschen?`} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
