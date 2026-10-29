import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { publishedWhere } from "@/lib/queries";
import { parseCompareIds } from "@/lib/filters";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CompareResults, type CompareRow } from "@/components/compare-results";

export const metadata: Metadata = { title: "Produktvergleich", robots: { index: false, follow: true }, alternates: { canonical: "/vergleich" } };

export default async function ComparePage({ searchParams }: PageProps<"/vergleich">) {
  const ids = parseCompareIds((await searchParams).ids);
  const found = ids.length ? await prisma.review.findMany({ where: { id: { in: ids }, ...publishedWhere() }, include: { category: true } }) : [];
  const items = ids.map((id) => found.find((f) => f.id === id)).filter((x): x is (typeof found)[number] => !!x);

  return (
    <div className="mx-auto max-w-6xl px-4">
      <Breadcrumbs items={[{ label: "Tests", href: "/tests" }, { label: "Vergleich", href: "/vergleich" }]} />
      <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">Produktvergleich</h1>
      {items.length < 2 ? (
        <p className="mt-6 text-lg text-muted">Wählen Sie in einer <Link href="/tests" className="font-semibold text-brand underline">Testübersicht</Link> zwei bis drei Produkte zum Vergleich aus.</p>
      ) : (
        <CompareResults items={items as CompareRow[]} />
      )}
    </div>
  );
}
