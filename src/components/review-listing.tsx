import Link from "next/link";
import { prisma } from "@/lib/db";
import { publishedWhere, reviewCardSelect } from "@/lib/queries";
import { orderByFor, PRICE_CLASSES, SORTS, type ReviewFilters } from "@/lib/filters";
import { PRICE_CLASS_LABEL } from "@/lib/site";
import { ReviewCard } from "./review-card";
import { CompareProvider, CompareToggle } from "./compare";

export async function ReviewListing({ basePath, filters, categoryId, showAnimal }: { basePath: string; filters: ReviewFilters; categoryId?: string; showAnimal?: boolean }) {
  const reviews = await prisma.review.findMany({
    where: {
      ...publishedWhere(),
      ...(categoryId ? { categoryId } : {}),
      ...(filters.preis ? { priceClass: filters.preis } : {}),
      ...(filters.tier ? { category: { animal: filters.tier } } : {}),
      ...(filters.min > 0 ? { totalScore: { gte: filters.min } } : {}),
    },
    orderBy: orderByFor(filters.sort),
    select: reviewCardSelect,
    take: 120,
  });

  const field = "min-h-11 rounded-xl border border-border bg-surface px-3 text-sm font-medium";
  return (
    <CompareProvider>
      <form method="get" action={basePath} className="mb-8 grid grid-cols-2 gap-3 rounded-2xl border border-border bg-bg-soft p-3 sm:flex sm:flex-wrap sm:items-end" aria-label="Filter und Sortierung">
        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-muted">
          Sortierung
          <select name="sort" defaultValue={filters.sort} className={field}>
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-muted">
          Preisklasse
          <select name="preis" defaultValue={filters.preis ?? ""} className={field}>
            <option value="">Alle</option>
            {PRICE_CLASSES.map((p) => <option key={p} value={p}>{PRICE_CLASS_LABEL[p]}</option>)}
          </select>
        </label>
        {showAnimal && (
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-muted">
            Tierart
            <select name="tier" defaultValue={filters.tier ?? ""} className={field}>
              <option value="">Hund &amp; Katze</option>
              <option value="HUND">Hund</option>
              <option value="KATZE">Katze</option>
            </select>
          </label>
        )}
        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-muted">
          Mindestpunkte
          <select name="min" defaultValue={String(filters.min)} className={field}>
            {[0, 50, 75, 90].map((m) => <option key={m} value={m}>{m === 0 ? "Alle" : `ab ${m}`}</option>)}
          </select>
        </label>
        <div className="col-span-2 flex gap-2 sm:ml-auto">
          <button type="submit" className="min-h-11 flex-1 rounded-full bg-brand px-5 text-sm font-bold text-white hover:bg-brand-strong dark:text-black sm:flex-none">Anwenden</button>
          <Link href={basePath} className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-muted hover:text-fg">Zurücksetzen</Link>
        </div>
      </form>

      <p className="mb-4 text-sm text-muted" aria-live="polite">{reviews.length} {reviews.length === 1 ? "Test" : "Tests"} gefunden · Bis zu 3 Produkte zum Vergleich auswählen</p>
      {reviews.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">Keine Tests für diese Filter.</p>
      ) : (
        <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {reviews.map((r) => (
            <li key={r.id} className="flex flex-col gap-1">
              <ReviewCard review={r} />
              <CompareToggle id={r.id} title={r.title} />
            </li>
          ))}
        </ul>
      )}
    </CompareProvider>
  );
}
