import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowRight, Scale } from "lucide-react";
import { prisma } from "@/lib/db";
import { findRedirect, getRelatedReviews, getReviewBySlug, publishedWhere } from "@/lib/queries";
import { getPostsForReview, renderArticle } from "@/lib/content";
import { absoluteUrl, formatDate, PRICE_CLASS_LABEL, SITE } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { VerdictPanel } from "@/components/verdict-panel";
import { FpImage } from "@/components/fp-image";
import { ReadAloud } from "@/components/read-aloud";
import { ShareButtons } from "@/components/share-buttons";
import { ReviewCard } from "@/components/review-card";
import { JsonLd } from "@/components/json-ld";
import { BlogCard } from "@/components/blog-card";
import { NewsletterBox } from "@/components/newsletter-box";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const rows = await prisma.review.findMany({ where: publishedWhere(), select: { slug: true }, take: 500 });
    return rows.map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps<"/tests/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = await getReviewBySlug(slug);
  if (!r) return {};
  const title = r.metaTitle || `${r.title} im Test`;
  const description = r.metaDescription || r.verdict;
  return {
    title: { absolute: `${title} | ${SITE.name}` },
    description,
    keywords: r.keywords,
    alternates: { canonical: `/tests/${r.slug}` },
    openGraph: { type: "article", title, description, url: `/tests/${r.slug}`, modifiedTime: r.updatedAt.toISOString(), publishedTime: r.publishedAt?.toISOString() },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ReviewPage({ params }: PageProps<"/tests/[slug]">) {
  const { slug } = await params;
  const r = await getReviewBySlug(slug);
  if (!r) {
    const redirect = await findRedirect(`/tests/${slug}`);
    if (redirect) permanentRedirect(redirect.toPath);
    notFound();
  }
  const [related, posts, body] = await Promise.all([getRelatedReviews(r.categoryId, r.id, 3), getPostsForReview(r, 3), renderArticle(r.bodyHtml)]);
  const url = absoluteUrl(`/tests/${r.slug}`);

  return (
    <article className="mx-auto max-w-4xl px-4">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: r.title,
          brand: { "@type": "Brand", name: r.brand },
          category: r.category.name,
          ...(r.imageUrl ? { image: absoluteUrl(r.imageUrl.startsWith("http") ? r.imageUrl : r.imageUrl) } : {}),
          review: {
            "@type": "Review",
            name: `${r.title} im Test`,
            reviewBody: r.verdict,
            datePublished: r.publishedAt?.toISOString(),
            dateModified: r.updatedAt.toISOString(),
            author: { "@type": "Person", name: SITE.author },
            publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
            reviewRating: { "@type": "Rating", ratingValue: r.totalScore, bestRating: 100, worstRating: 0 },
            positiveNotes: r.pros.length ? { "@type": "ItemList", itemListElement: r.pros.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p })) } : undefined,
            negativeNotes: r.cons.length ? { "@type": "ItemList", itemListElement: r.cons.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p })) } : undefined,
          },
        }}
      />
      <Breadcrumbs items={[{ label: "Tests", href: "/tests" }, { label: r.category.shortName, href: `/kategorie/${r.category.slug}` }, { label: r.title }]} />
      <header className="mt-4">
        <p className="text-sm font-bold uppercase tracking-wide text-brand">{r.category.name}</p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight md:text-5xl">{r.title} im Test</h1>
        <p className="mt-3 text-sm text-muted">
          {r.publishedAt && <>Veröffentlicht am <time dateTime={r.publishedAt.toISOString()}>{formatDate(r.publishedAt)}</time> · </>}
          Preisklasse: {PRICE_CLASS_LABEL[r.priceClass]}
          {r.pricePerKg != null && <> · ca. {Number(r.pricePerKg).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}/kg</>}
        </p>
      </header>

      <div className="mt-6">
        <VerdictPanel data={{ ...r, updatedAt: r.updatedAt }} />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <ReadAloud targetId="testbericht" />
        <ShareButtons url={url} title={`${r.title} im Test – ${r.totalScore}/100 Punkte`} />
      </div>

      <div id="testbericht" className="mt-8">
        {r.imageUrl && (
          <figure className="relative mb-8 aspect-[4/3] overflow-hidden rounded-3xl bg-bg-soft">
            <FpImage src={r.imageUrl} alt={r.imageAlt || r.title} blur={r.imageBlur} sizes="(min-width:896px) 864px, 100vw" />
          </figure>
        )}
        <div className="prose-fp" dangerouslySetInnerHTML={{ __html: body }} />
        <p className="mt-6 rounded-2xl bg-bg-soft p-4 text-sm text-muted">Unterstrichene Begriffe sind im <Link href="/lexikon" className="font-semibold text-brand underline">Futter-Lexikon</Link> bzw. im <Link href="/glossar" className="font-semibold text-brand underline">Glossar</Link> erklärt. Der farbige Punkt zeigt die Bedenklichkeits-Ampel.</p>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="aehnliche" className="mt-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 id="aehnliche" className="text-2xl font-extrabold">Ähnliche Produkte im Vergleich</h2>
            <Link href={`/vergleich?ids=${[r.id, ...related.slice(0, 2).map((x) => x.id)].join(",")}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-bold text-white hover:bg-accent-strong dark:text-black">
              <Scale className="size-4" aria-hidden /> Direkt vergleichen
            </Link>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((x) => <li key={x.id}><ReviewCard review={x} /></li>)}
          </ul>
          <Link href={`/kategorie/${r.category.slug}`} className="mt-6 inline-flex min-h-11 items-center gap-1 font-bold text-brand hover:underline">
            Alle Tests: {r.category.name} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </section>
      )}

      {posts.length > 0 && (
        <section aria-labelledby="fachartikel" className="mt-16">
          <h2 id="fachartikel" className="mb-6 text-2xl font-extrabold">Passende Fachartikel</h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{posts.map((p) => <li key={p.id}><BlogCard post={p} /></li>)}</ul>
        </section>
      )}

      <div className="mt-16"><NewsletterBox /></div>
    </article>
  );
}
