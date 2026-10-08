import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { PageHeader, btnPrimary, btnSecondary, cardCls, inputCls } from "@/components/admin/ui";
import { StatusBadge } from "@/components/admin/status-badge";
import { ScoreBadge } from "@/components/score-badge";
import { formatDateTime } from "@/lib/admin/datetime";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tests" };

const FILTERS = [
  { value: "", label: "Alle" },
  { value: "entwurf", label: "Entwurf" },
  { value: "geplant", label: "Geplant" },
  { value: "veroeffentlicht", label: "Veröffentlicht" },
] as const;

export default async function TestsListPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; geloescht?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 100);
  const status = FILTERS.some((f) => f.value === sp.status) ? sp.status! : "";
  const now = new Date();

  const where: Prisma.ReviewWhereInput = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { brand: { contains: q, mode: "insensitive" } },
      { productName: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
    ];
  }
  if (status === "entwurf") where.status = "DRAFT";
  if (status === "geplant") Object.assign(where, { status: "PUBLISHED", publishedAt: { gt: now } });
  if (status === "veroeffentlicht") Object.assign(where, { status: "PUBLISHED", publishedAt: { lte: now } });

  const reviews = await prisma.review.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 200,
    select: { id: true, title: true, slug: true, brand: true, totalScore: true, status: true, publishedAt: true, updatedAt: true, category: { select: { shortName: true } } },
  });

  return (
    <>
      <PageHeader
        title="Tests"
        description={`${reviews.length} ${reviews.length === 1 ? "Test" : "Tests"}${q ? ` für „${q}“` : ""}`}
        actions={
          <Link href="/admin/tests/neu" className={btnPrimary}>
            <Plus className="size-4" aria-hidden /> Neuer Test
          </Link>
        }
      />
      {sp.geloescht && (
        <p role="status" className="mb-4 rounded-xl bg-good-soft px-4 py-2.5 text-sm font-medium text-good">
          Test gelöscht.
        </p>
      )}
      <form role="search" className="mb-4 flex flex-col gap-2 sm:flex-row" action="/admin/tests">
        <label htmlFor="q" className="sr-only">
          Tests durchsuchen
        </label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Titel, Marke, Produkt …" className={`${inputCls} pl-9`} />
        </div>
        <label htmlFor="status" className="sr-only">
          Status
        </label>
        <select id="status" name="status" defaultValue={status} className={`${inputCls} sm:w-48`}>
          {FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <button type="submit" className={btnSecondary}>
          Filtern
        </button>
      </form>

      {reviews.length === 0 ? (
        <div className={`${cardCls} text-center text-muted`}>Keine Tests gefunden.</div>
      ) : (
        <ul className={`${cardCls} divide-y divide-border !p-0`}>
          {reviews.map((r) => (
            <li key={r.id}>
              <Link href={`/admin/tests/${r.id}`} className="flex min-h-11 items-center gap-3 px-4 py-3 hover:bg-bg-soft md:px-5">
                <ScoreBadge score={r.totalScore} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{r.title}</p>
                  <p className="truncate text-xs text-muted">
                    {r.brand} · {r.category.shortName} · /tests/{r.slug}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StatusBadge status={r.status} publishedAt={r.publishedAt} now={now} />
                  <span className="hidden text-xs text-muted sm:block">{formatDateTime(r.updatedAt)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
