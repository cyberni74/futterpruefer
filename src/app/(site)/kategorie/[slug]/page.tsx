import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ReviewListing } from "@/components/review-listing";
import { parseFilters } from "@/lib/filters";
import { getCategory } from "@/lib/queries";

export async function generateMetadata({ params }: PageProps<"/kategorie/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat) return {};
  return { title: `${cat.name} im Test`, description: cat.description, alternates: { canonical: `/kategorie/${cat.slug}` } };
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/kategorie/[slug]">) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const cat = await getCategory(slug);
  if (!cat) notFound();
  return (
    <div className="mx-auto max-w-6xl px-4">
      <Breadcrumbs items={[{ label: "Tests", href: "/tests" }, { label: cat.name }]} />
      <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">{cat.name}</h1>
      <p className="mb-8 mt-3 max-w-2xl text-lg text-muted">{cat.description}</p>
      <ReviewListing basePath={`/kategorie/${cat.slug}`} filters={parseFilters(sp)} categoryId={cat.id} />
    </div>
  );
}
