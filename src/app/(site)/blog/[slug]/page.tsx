import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { blogCardSelect, findRedirect, getPostBySlug, publishedWhere } from "@/lib/queries";
import { getReviewsForPost, renderArticle } from "@/lib/content";
import { absoluteUrl, formatDate, SITE } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FpImage } from "@/components/fp-image";
import { ReadAloud } from "@/components/read-aloud";
import { ShareButtons } from "@/components/share-buttons";
import { BlogCard } from "@/components/blog-card";
import { JsonLd } from "@/components/json-ld";
import { ReviewCard } from "@/components/review-card";
import { NewsletterBox } from "@/components/newsletter-box";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const rows = await prisma.blogPost.findMany({ where: publishedWhere(), select: { slug: true }, take: 500 });
    return rows.map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPostBySlug(slug);
  if (!p) return {};
  const title = p.metaTitle || p.title;
  const description = p.metaDescription || p.excerpt;
  return {
    title: { absolute: `${title} | ${SITE.name}` },
    description,
    keywords: p.keywords,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", title, description, url: `/blog/${p.slug}`, publishedTime: p.publishedAt?.toISOString(), modifiedTime: p.updatedAt.toISOString(), images: p.imageUrl ? [{ url: p.imageUrl }] : [{ url: "/opengraph-image.png", width: 1200, height: 630 }] },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const p = await getPostBySlug(slug);
  if (!p) {
    const r = await findRedirect(`/blog/${slug}`);
    if (r) permanentRedirect(r.toPath);
    notFound();
  }
  const kw = p.keywords.filter(Boolean);
  const [related, reviews, body] = await Promise.all([
    kw.length
      ? prisma.blogPost.findMany({ where: { ...publishedWhere(), id: { not: p.id }, OR: kw.map((k) => ({ OR: [{ title: { contains: k, mode: "insensitive" as const } }, { keywords: { has: k } }] })) }, orderBy: { publishedAt: "desc" }, take: 3, select: blogCardSelect })
      : Promise.resolve([]),
    getReviewsForPost(p, 3),
    renderArticle(p.bodyHtml),
  ]);
  const fill = related.length < 3 ? await prisma.blogPost.findMany({ where: { ...publishedWhere(), id: { notIn: [p.id, ...related.map((x) => x.id)] } }, orderBy: { publishedAt: "desc" }, take: 3 - related.length, select: blogCardSelect }) : [];
  const more = [...related, ...fill];
  const url = absoluteUrl(`/blog/${p.slug}`);
  return (
    <article className="mx-auto max-w-3xl px-4">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.title,
          description: p.excerpt,
          datePublished: p.publishedAt?.toISOString(),
          dateModified: p.updatedAt.toISOString(),
          inLanguage: "de-DE",
          mainEntityOfPage: url,
          ...(p.imageUrl ? { image: p.imageUrl.startsWith("http") ? p.imageUrl : absoluteUrl(p.imageUrl) } : {}),
          author: { "@type": "Person", name: SITE.author },
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
        }}
      />
      <Breadcrumbs items={[{ label: "Fachblog", href: "/blog" }, { label: p.title }]} />
      <header className="mt-4">
        <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">{p.title}</h1>
        {p.publishedAt && <p className="mt-3 text-sm text-muted"><time dateTime={p.publishedAt.toISOString()}>{formatDate(p.publishedAt)}</time> · Zuletzt aktualisiert: {formatDate(p.updatedAt)}</p>}
      </header>
      {p.imageUrl && (
        <figure className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl bg-bg-soft">
          <FpImage src={p.imageUrl} alt={p.imageAlt || p.title} blur={p.imageBlur} sizes="(min-width:768px) 736px, 100vw" priority />
        </figure>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <ReadAloud targetId="artikel" />
        <ShareButtons url={url} title={p.title} />
      </div>
      <div id="artikel" className="prose-fp mt-8">
        {p.excerpt && <p className="text-xl font-medium">{p.excerpt}</p>}
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </div>
      {reviews.length > 0 && (
        <section aria-labelledby="passende-tests" className="mt-16">
          <h2 id="passende-tests" className="mb-6 text-2xl font-extrabold">Passende Tests</h2>
          <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">{reviews.map((r) => <li key={r.id}><ReviewCard review={r} /></li>)}</ul>
        </section>
      )}
      {more.length > 0 && (
        <section aria-labelledby="verwandt" className="mt-16">
          <h2 id="verwandt" className="mb-6 text-2xl font-extrabold">Verwandte Artikel</h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{more.map((m) => <li key={m.id}><BlogCard post={m} /></li>)}</ul>
        </section>
      )}
      <div className="mt-16"><NewsletterBox /></div>
    </article>
  );
}
