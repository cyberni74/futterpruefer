import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ReviewListing } from "@/components/review-listing";
import { parseFilters } from "@/lib/filters";
import Link from "next/link";
import { FpImage } from "@/components/fp-image";
import { prisma } from "@/lib/db";
import { blogCardSelect, getCategories, getCategory, publishedWhere } from "@/lib/queries";
import { trimMetaDescription } from "@/lib/seo";
import { DEFAULT_OG_IMAGE, SITE, pageAlternates } from "@/lib/site";

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
  const title = `${cat.name} im Test`;
  const description = trimMetaDescription(cat.description);
  return {
    title,
    description,
    alternates: pageAlternates(`/${cat.slug}`),
    openGraph: {
      type: "website",
      locale: "de_DE",
      siteName: SITE.name,
      url: `/${cat.slug}`,
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [DEFAULT_OG_IMAGE] },
  };
}

/** Fachartikel-Teaser über der Testliste (Kategorie-Slug → Blog-Slug). Titel und Teaser kommen unverändert aus dem Beitrag. */
const CATEGORY_FEATURED_POST: Record<string, string> = {
  "alleinfuttermittel-hund": "nassfutter-test-rind-hund-oktober-2026",
};

async function getFeaturedPost(categorySlug: string) {
  const slug = CATEGORY_FEATURED_POST[categorySlug];
  if (!slug) return null;
  try {
    return await prisma.blogPost.findFirst({ where: { ...publishedWhere(), slug }, select: blogCardSelect });
  } catch {
    return null;
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/[kategorie]">) {
  const [{ kategorie }, sp] = await Promise.all([params, searchParams]);
  const cat = await getCategory(kategorie);
  if (!cat) notFound();
  const featured = await getFeaturedPost(cat.slug);
  return (
    <div className="mx-auto max-w-6xl px-4">
      <Breadcrumbs items={[{ label: "Tests", href: "/tests" }, { label: cat.name, href: `/${cat.slug}` }]} />
      <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">{cat.name}</h1>
      <p className="mb-8 mt-3 max-w-2xl text-lg text-muted">{cat.description}</p>
      {featured && (
        <Link href={`/blog/${featured.slug}`} className="group mb-10 flex items-center gap-4 rounded-2xl border-2 border-brand bg-brand-soft p-3 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift motion-reduce:hover:translate-y-0 sm:gap-5 sm:p-4">
          <span className="relative block aspect-[16/9] w-28 shrink-0 overflow-hidden rounded-xl bg-bg-soft sm:w-48">
            <FpImage src={featured.imageUrl} alt={featured.imageAlt.trim() || `Titelbild: ${featured.title}`} blur={featured.imageBlur} sizes="(min-width:640px) 192px, 112px" />
          </span>
          <span className="min-w-0">
            <span className="block text-base font-extrabold leading-snug text-fg group-hover:text-brand sm:text-xl">{featured.title}</span>
            {featured.excerpt && <span className="mt-1 hidden text-sm text-muted sm:block">{featured.excerpt}</span>}
          </span>
        </Link>
      )}
      <ReviewListing basePath={`/${cat.slug}`} filters={parseFilters(sp)} categoryId={cat.id} />
    </div>
  );
}
