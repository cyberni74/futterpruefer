import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getBrands } from "@/lib/brands";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Alle Marken im Futtertest",
  description: "Alle getesteten Hunde- und Katzenfutter-Marken von A bis Z mit Anzahl der Tests und durchschnittlicher Punktzahl.",
  alternates: { canonical: "/marken" },
};

export default async function BrandsPage() {
  const brands = await getBrands();
  return (
    <div className="mx-auto max-w-6xl px-4">
      <Breadcrumbs items={[{ label: "Marken", href: "/marken" }]} />
      <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">Alle Marken im Futtertest</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">{brands.length} Marken mit mindestens einem Test. Die Punktzahl ist der Durchschnitt aller Tests der Marke nach unserer 100-Punkte-Methodik.</p>
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {brands.map((b) => (
          <li key={b.slug}>
            <Link href={`/marken/${b.slug}`} className="flex h-full min-h-20 flex-col justify-center rounded-2xl border border-border bg-surface p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
              <span className="font-bold leading-tight break-words hyphens-auto">{b.brand}</span>
              <span className="mt-1 text-sm text-muted">{b.count} {b.count === 1 ? "Test" : "Tests"} · Ø {b.avg}/100</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
