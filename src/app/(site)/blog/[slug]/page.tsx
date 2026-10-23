import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { seoTitle, trimMetaDescription } from "@/lib/seo";
import { prisma } from "@/lib/db";
import { blogCardSelect, findRedirect, getCategoryLeaders, getPostBySlug, getPreviousPost, publishedWhere } from "@/lib/queries";
import { TopicLinks } from "@/components/topic-links";
import { getReviewsForPost, renderArticle } from "@/lib/content";
import { absoluteUrl, formatDate, SITE } from "@/lib/site";
import { contentAuthor } from "@/lib/attribution";
import { resolveAuthor } from "@/lib/authors";
import { AuthorCredit } from "@/components/author-credit";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FpImage } from "@/components/fp-image";
import { ReadAloud } from "@/components/read-aloud";
import { ShareButtons } from "@/components/share-buttons";
import { BlogCard } from "@/components/blog-card";
import { JsonLd } from "@/components/json-ld";
import { AllLink } from "@/components/all-link";
import { ReviewCard } from "@/components/review-card";
import { NewsletterBox } from "@/components/newsletter-box";
import { WishBox } from "@/components/wish-box";
import { BodyGauges } from "@/components/body-gauges";
import "@/styles/vergleichstest.css";

export const revalidate = 3600;

/**
 * Vergleichstests liegen als BlogPost vor. Ihr ItemList-JSON-LD (Reviews der Plätze) steht im bodyHtml,
 * das der Sanitizer samt <script> entfernt. Nur für diese Slugs wird es hier als geparstes JSON
 * ausgegeben; Article-Knoten entfallen, weil die Seite ihr eigenes Article-JSON-LD rendert.
 */
const BODY_JSON_LD_SLUGS = new Set(["nassfutter-test-rind-hund-oktober-2026", "gelenk-test-hund-oktober-2026", "lachsoel-test-hund-oktober-2026"]);

function bodyJsonLd(slug: string, html: string | null | undefined): Record<string, unknown> | null {
  if (!html || !BODY_JSON_LD_SLUGS.has(slug)) return null;
  const nodes: Record<string, unknown>[] = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]) as Record<string, unknown>;
      const graph = Array.isArray(data["@graph"]) ? (data["@graph"] as Record<string, unknown>[]) : [data];
      nodes.push(...graph.filter((n) => n && typeof n === "object" && n["@type"] !== "Article"));
    } catch {
      // ungültiges JSON: nichts ausgeben
    }
  }
  return nodes.length ? { "@context": "https://schema.org", "@graph": nodes.map((n) => { const { "@context": _ctx, ...rest } = n; void _ctx; return rest; }) } : null;
}

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
  const description = trimMetaDescription(p.metaDescription || p.excerpt);
  const imageAlt = p.imageAlt.trim() || `Titelbild: ${p.title}`;
  const images = p.imageUrl ? [{ url: p.imageUrl, alt: imageAlt }] : [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: SITE.name }];
  return {
    title: { absolute: seoTitle(title) },
    description,
    keywords: p.keywords,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", title, description, url: `/blog/${p.slug}`, publishedTime: p.publishedAt?.toISOString(), modifiedTime: p.updatedAt.toISOString(), authors: [resolveAuthor(p.authorSlug).name], images },
    twitter: { card: "summary_large_image", title, description, images },
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
  const [related, reviews, body, leaders] = await Promise.all([
    kw.length
      ? prisma.blogPost.findMany({ where: { ...publishedWhere(), id: { not: p.id }, OR: kw.map((k) => ({ OR: [{ title: { contains: k, mode: "insensitive" as const } }, { keywords: { has: k } }] })) }, orderBy: { publishedAt: "desc" }, take: 3, select: blogCardSelect })
      : Promise.resolve([]),
    getReviewsForPost(p, 3),
    renderArticle(p.bodyHtml),
    getCategoryLeaders(),
  ]);
  // Ein Platz geht immer an den chronologisch vorherigen Beitrag (ringförmig), damit auch ältere
  // Beiträge von anderen Artikeln verlinkt werden und nicht nur über die Blog-Übersicht erreichbar sind.
  const neighbor = await getPreviousPost(p.id);
  const picked = [...related.filter((x) => x.id !== neighbor?.id).slice(0, neighbor ? 2 : 3), ...(neighbor ? [neighbor] : [])];
  const fill = picked.length < 3 ? await prisma.blogPost.findMany({ where: { ...publishedWhere(), id: { notIn: [p.id, ...picked.map((x) => x.id)] } }, orderBy: { publishedAt: "desc" }, take: 3 - picked.length, select: blogCardSelect }) : [];
  const more = [...picked, ...fill];
  const url = absoluteUrl(`/blog/${p.slug}`);
  const extraLd = bodyJsonLd(p.slug, p.bodyHtml);
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
          author: contentAuthor(p.authorSlug),
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
        }}
      />
      {extraLd && <JsonLd data={extraLd} />}
      <Breadcrumbs items={[{ label: "Fachblog", href: "/blog" }, { label: p.title, href: `/blog/${p.slug}` }]} />
      <header className="mt-4">
        <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">{p.title}</h1>
        <p className="mt-3 text-sm text-muted">
          Von <AuthorCredit slug={p.authorSlug} />
          {p.publishedAt && <> · <time dateTime={p.publishedAt.toISOString()}>{formatDate(p.publishedAt)}</time> · Zuletzt aktualisiert: {formatDate(p.updatedAt)}</>}
        </p>
      </header>
      {p.imageUrl && (
        <figure className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl bg-bg-soft">
          <FpImage src={p.imageUrl} alt={p.imageAlt.trim() || `Titelbild: ${p.title}`} blur={p.imageBlur} sizes="(min-width:768px) 736px, 100vw" priority />
        </figure>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <ReadAloud targetId="artikel" />
        <ShareButtons url={url} title={p.title} />
      </div>
      <div id="artikel" className="prose-fp mt-8">
        {p.excerpt && <p className="text-lg font-medium md:text-xl">{p.excerpt}</p>}
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </div>
      <BodyGauges />
      {reviews.length > 0 && (
        <section aria-labelledby="passende-tests" className="mt-16">
          <h2 id="passende-tests" className="mb-6 text-2xl font-extrabold">Passende Tests</h2>
          <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">{reviews.map((r) => <li key={r.id}><ReviewCard review={r} /></li>)}</ul>
          <AllLink href="/tests" title="Ihr Futter ist nicht dabei?" text="Jeder Test zeigt die Punktewertung, die Zusammensetzung im Klartext und den Werbeaussagen-Check. Stöbern Sie in allen Tests und finden Sie das passende Futter für Ihr Tier.">Alle Futtertests ansehen</AllLink>
        </section>
      )}
      {more.length > 0 && (
        <section aria-labelledby="verwandt" className="mt-16">
          <h2 id="verwandt" className="mb-6 text-2xl font-extrabold">Verwandte Artikel</h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{more.map((m) => <li key={m.id}><BlogCard post={m} /></li>)}</ul>
          <AllLink href="/blog" title="Mehr Wissen für den Napf" text="Ratgeber zu Zutaten, Fütterung und Gesundheit, verständlich und mit Quellen. Lesen Sie weiter im Fachblog.">Alle Beiträge im Fachblog</AllLink>
        </section>
      )}
      <TopicLinks leaders={leaders} text={`${p.title} ${p.excerpt} ${kw.join(" ")}`} />
      <div className="mt-16"><WishBox /></div>
        <div className="mt-16"><NewsletterBox /></div>
    </article>
  );
}
