import type { Metadata } from "next";
import Link from "next/link";
import { seoTitle } from "@/lib/seo";
import { notFound, permanentRedirect } from "next/navigation";
import { getLexikonEntries, getLexikonEntry, getReviewsMentioning, renderArticle } from "@/lib/content";
import { findRedirect } from "@/lib/queries";
import { absoluteUrl, formatDate, SITE } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ConcernBadge, ConcernLight, CONCERN } from "@/components/concern-badge";
import { ReviewCard } from "@/components/review-card";
import { ReadAloud } from "@/components/read-aloud";
import { ShareButtons } from "@/components/share-buttons";
import { NewsletterBox } from "@/components/newsletter-box";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    return (await getLexikonEntries()).map((e) => ({ slug: e.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps<"/lexikon/[slug]">): Promise<Metadata> {
  const e = await getLexikonEntry((await params).slug);
  if (!e) return {};
  const title = e.metaTitle || `${e.name} im Tierfutter: ${CONCERN[e.concern].label}?`;
  const base = e.metaDescription || e.shortDescription;
  const description = base.length >= 70 ? base : `${base} Bewertung und Einordnung im Futter-Lexikon von ${SITE.name}.`.trim();
  return { title: { absolute: seoTitle(title) }, description, alternates: { canonical: `/lexikon/${e.slug}` }, openGraph: { type: "article", title, description, url: `/lexikon/${e.slug}`, images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }] } };
}

export default async function LexikonEntryPage({ params }: PageProps<"/lexikon/[slug]">) {
  const { slug } = await params;
  const e = await getLexikonEntry(slug);
  if (!e) {
    const r = await findRedirect(`/lexikon/${slug}`);
    if (r) permanentRedirect(r.toPath);
    notFound();
  }
  const [body, reviews, all] = await Promise.all([renderArticle(e.bodyHtml, [`/lexikon/${e.slug}`]), getReviewsMentioning([e.name, ...e.synonyms], 6), getLexikonEntries()]);
  const sameGroup = all.filter((x) => x.group && x.group === e.group && x.id !== e.id).slice(0, 6);
  const url = absoluteUrl(`/lexikon/${e.slug}`);

  return (
    <article className="mx-auto max-w-3xl px-4">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "DefinedTerm", name: e.name, alternateName: e.synonyms, description: e.shortDescription, url, inDefinedTermSet: { "@type": "DefinedTermSet", name: "Futter-Lexikon", url: absoluteUrl("/lexikon") } }} />
      <Breadcrumbs items={[{ label: "Futter-Lexikon", href: "/lexikon" }, { label: e.name }]} />
      <header className="mt-4 flex items-start gap-5">
        <ConcernLight concern={e.concern} />
        <div className="min-w-0 flex-1">
          {e.group && <p className="text-sm font-bold uppercase tracking-wide text-brand">{e.group}</p>}
          <h1 className="mt-1 text-3xl font-extrabold leading-tight md:text-5xl">{e.name}</h1>
          {e.synonyms.length > 0 && <p className="mt-2 text-sm text-muted">Auch: {e.synonyms.join(", ")}</p>}
          <div className="mt-3"><ConcernBadge concern={e.concern} size="lg" /></div>
        </div>
      </header>

      {e.shortDescription && <p className="mt-6 text-xl font-medium leading-relaxed">{e.shortDescription}</p>}
      {e.assessment && (
        <section aria-labelledby="einschaetzung" className={`mt-6 rounded-2xl p-5 ${CONCERN[e.concern].cls}`}>
          <h2 id="einschaetzung" className="text-sm font-bold uppercase tracking-wide">Fachliche Einschätzung</h2>
          <p className="mt-2 text-fg">{e.assessment}</p>
        </section>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <ReadAloud targetId="lexikon-text" />
        <ShareButtons url={url} title={`${e.name} im Futter-Lexikon`} />
      </div>
      <div id="lexikon-text" className="prose-fp mt-6" dangerouslySetInnerHTML={{ __html: body }} />
      <p className="mt-6 text-xs text-muted">Zuletzt aktualisiert: {formatDate(e.updatedAt)}</p>

      {reviews.length > 0 && (
        <section aria-labelledby="in-tests" className="mt-14">
          <h2 id="in-tests" className="mb-6 text-2xl font-extrabold">In diesen Tests erwähnt</h2>
          <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2">{reviews.map((r) => <li key={r.id}><ReviewCard review={r} /></li>)}</ul>
        </section>
      )}
      {sameGroup.length > 0 && (
        <section aria-labelledby="verwandt" className="mt-14">
          <h2 id="verwandt" className="mb-4 text-2xl font-extrabold">Weitere Einträge: {e.group}</h2>
          <ul className="flex flex-wrap gap-2">
            {sameGroup.map((x) => (
              <li key={x.id}><Link href={`/lexikon/${x.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-semibold hover:bg-bg-soft"><span className={`size-2.5 rounded-full ${CONCERN[x.concern].dot}`} aria-hidden />{x.name}</Link></li>
            ))}
          </ul>
        </section>
      )}
      <div className="mt-14"><NewsletterBox /></div>
    </article>
  );
}
