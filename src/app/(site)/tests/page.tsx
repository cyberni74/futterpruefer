import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ReviewListing } from "@/components/review-listing";
import { parseFilters } from "@/lib/filters";
import { getCategories } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Alle Futtertests",
  description: "Alle Hunde- und Katzenfutter-Tests im Überblick – filtern nach Punkten, Preisklasse und Tierart.",
  alternates: { canonical: "/tests" },
};

export default async function TestsPage({ searchParams }: PageProps<"/tests">) {
  const [sp, categories] = await Promise.all([searchParams, getCategories()]);
  return (
    <div className="mx-auto max-w-6xl px-4">
      <Breadcrumbs items={[{ label: "Tests" }]} />
      <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">Alle Futtertests</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">Jedes Produkt wird nach derselben 100-Punkte-Methodik bewertet.</p>
      <nav aria-label="Kategorien" className="my-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {categories.map((c) => (
          <Link key={c.id} href={`/${c.slug}`} className="flex min-h-16 min-w-0 flex-col justify-center rounded-2xl border border-border bg-surface p-4 shadow-card hover:shadow-lift">
            <span className="font-bold leading-tight break-words hyphens-auto">{c.name}</span>
          </Link>
        ))}
      </nav>
      <ReviewListing basePath="/tests" filters={parseFilters(sp)} showAnimal />
    </div>
  );
}
