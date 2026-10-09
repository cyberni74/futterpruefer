import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ReviewListing } from "@/components/review-listing";
import { parseFilters } from "@/lib/filters";
import { getCategories, getCategory } from "@/lib/queries";

export async function generateStaticParams() {
  try {
    return (await getCategories()).map((c) => ({ kategorie: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps<"/[kategorie]">): Promise<Metadata> {
  const cat = await getCategory((await params).kategorie);
  if (!cat) return {};
  return { title: `${cat.name} im Test`, description: cat.description, alternates: { canonical: `/${cat.slug}` }, openGraph: { type: "website", locale: "de_DE", siteName: "Futterprüfer", url: `/${cat.slug}`, title: `${cat.name} im Test`, description: cat.description, images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: `${cat.name} im Test – Futterprüfer` }] } };
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/[kategorie]">) {
  const [{ kategorie }, sp] = await Promise.all([params, searchParams]);
  const cat = await getCategory(kategorie);
  if (!cat) notFound();
  return (
    <div className="mx-auto max-w-6xl px-4">
      <Breadcrumbs items={[{ label: "Tests", href: "/tests" }, { label: cat.name }]} />
      <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">{cat.name}</h1>
      <p className="mb-8 mt-3 max-w-2xl text-lg text-muted">{cat.description}</p>
      <ReviewListing basePath={`/${cat.slug}`} filters={parseFilters(sp)} categoryId={cat.id} />
    </div>
  );
}
