import type { Metadata } from "next";
import Link from "next/link";
import { seoTitle } from "@/lib/seo";
import { notFound, permanentRedirect } from "next/navigation";
import { getLexikonEntries, getLexikonEntry, getReviewsMentioning, renderArticle } from "@/lib/content";
import { findRedirect } from "@/lib/queries";
import { DEFAULT_AUTHOR } from "@/lib/authors";
import { responsiveImage } from "@/lib/image-variants";
import {
  bodyRepeatsAssessment,
  bodyRepeatsLead,
  isLegacyLexikonBody,
  lexikonArticleJsonLd,
  lexikonDefinedTerm,
  lexikonDocumentTitle,
  lexikonFaqJsonLd,
  lexikonHeadline,
  lexikonHero,
  lexikonImagesOutsideBody,
  lexikonMetaDescription,
  lexikonVisibleFaqs,
  parseLexikonFaqs,
  parseLexikonImages,
  promoteLeadImage,
  type LexikonImage,
} from "@/lib/lexikon-article";
import { absoluteUrl, formatDate, SITE } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AuthorCredit } from "@/components/author-credit";
import { ConcernBadge, ConcernLight, CONCERN } from "@/components/concern-badge";
import { AllLink } from "@/components/all-link";
import { ReviewCard } from "@/components/review-card";
import { ReadAloud } from "@/components/read-aloud";
import { ShareButtons } from "@/components/share-buttons";
import { NewsletterBox } from "@/components/newsletter-box";
import { WishBox } from "@/components/wish-box";
import { FpImage } from "@/components/fp-image";
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
  const title = lexikonDocumentTitle(e);
  const description = lexikonMetaDescription(e);
  const hero = lexikonHero(parseLexikonImages(e.images));
  const images = hero
    ? [{ url: hero.url, alt: hero.alt || `Symbolbild: ${e.name}` }]
    : [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: SITE.name }];
  return {
    title: { absolute: seoTitle(title) },
    description,
    alternates: { canonical: `/lexikon/${e.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/lexikon/${e.slug}`,
      publishedTime: (e.publishedAt ?? e.createdAt).toISOString(),
      modifiedTime: e.updatedAt.toISOString(),
      authors: [DEFAULT_AUTHOR.name],
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function LexikonEntryPage({ params }: PageProps<"/lexikon/[slug]">) {
  const { slug } = await params;
  const e = await getLexikonEntry(slug);
  if (!e) {
    const r = await findRedirect(`/lexikon/${slug}`);
    if (r) permanentRedirect(r.toPath);
    notFound();
  }
  const legacy = isLegacyLexikonBody(e.bodyHtml);
  const [rendered, reviews, all] = await Promise.all([
    legacy ? Promise.resolve("") : renderArticle(e.bodyHtml, [`/lexikon/${e.slug}`]),
    getReviewsMentioning([e.name, ...e.synonyms], 6),
    getLexikonEntries(),
  ]);
  const images = parseLexikonImages(e.images);
  const outside = lexikonImagesOutsideBody(images, rendered);
  const hero = lexikonHero(images);
  const heroOutside = hero && outside.some((image) => image.url === hero.url) ? hero : null;
  const moreImages = outside.filter((image) => image.url !== heroOutside?.url);
  const articleHtml = heroOutside ? rendered : promoteLeadImage(rendered);
  const faq = lexikonVisibleFaqs(!legacy, articleHtml, parseLexikonFaqs(e.faqs));
  const faqLd = lexikonFaqJsonLd(faq.items);
  const headline = lexikonHeadline(e);
  const showLead = Boolean(e.shortDescription) && (legacy || !bodyRepeatsLead(e.bodyHtml, e.shortDescription));
  const showAssessment = Boolean(e.assessment) && (legacy || !bodyRepeatsAssessment(e.bodyHtml, e.assessment));
  const sameGroup = all.filter((x) => x.group && x.group === e.group && x.id !== e.id).slice(0, 6);
  const url = absoluteUrl(`/lexikon/${e.slug}`);

  return (
    <article className="mx-auto max-w-3xl px-4">
      <JsonLd data={lexikonDefinedTerm(e)} />
      <JsonLd
        data={lexikonArticleJsonLd({
          name: e.name,
          slug: e.slug,
          headline,
          description: lexikonMetaDescription(e),
          images,
          publishedAt: e.publishedAt,
          createdAt: e.createdAt,
          updatedAt: e.updatedAt,
        })}
      />
      {faqLd && <JsonLd data={faqLd} />}
      <Breadcrumbs items={[{ label: "Futter-Lexikon", href: "/lexikon" }, { label: e.name, href: `/lexikon/${e.slug}` }]} />
      <header className="mt-4 flex items-start gap-5">
        <ConcernLight concern={e.concern} />
        <div className="min-w-0 flex-1">
          {e.group && <p className="text-sm font-bold uppercase tracking-wide text-brand">{e.group}</p>}
          <h1 className="mt-1 text-3xl font-extrabold leading-tight md:text-5xl">{headline}</h1>
          {e.synonyms.length > 0 && <p className="mt-2 text-sm text-muted">Auch: {e.synonyms.join(", ")}</p>}
          <div className="mt-3"><ConcernBadge concern={e.concern} size="lg" /></div>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <ReadAloud targetId="lexikon-text" />
        <ShareButtons url={url} title={headline} />
      </div>
      <div id="lexikon-text">
        {showLead && <p className="mt-6 text-xl font-medium leading-relaxed">{e.shortDescription}</p>}
        {showAssessment && (
          <section aria-labelledby="einschaetzung" className={`mt-6 rounded-2xl p-5 ${CONCERN[e.concern].cls}`}>
            <h2 id="einschaetzung" className="text-sm font-bold uppercase tracking-wide">Fachliche Einschätzung</h2>
            <p className="mt-2 text-fg">{e.assessment}</p>
          </section>
        )}
        {heroOutside && <LexikonHero image={heroOutside} />}
        {articleHtml && <div className="prose-fp mt-6" dangerouslySetInnerHTML={{ __html: articleHtml }} />}
        {moreImages.length > 0 && (
          <div className="mt-6">
            {moreImages.map((image) => <LexikonExtraImage key={image.url} image={image} />)}
          </div>
        )}
        {faq.source === "field" && (
          <section className="prose-fp mt-10" aria-labelledby="lexikon-faq">
            <h2 id="lexikon-faq">Häufige Fragen</h2>
            {faq.items.map((item, index) => (
              <div key={`${item.question}-${index}`}>
                <h3>{item.question}</h3>
                <p className="whitespace-pre-line">{item.answer}</p>
              </div>
            ))}
          </section>
        )}
      </div>
      <p className="mt-6 text-xs text-muted">Von <AuthorCredit /> · Zuletzt aktualisiert: {formatDate(e.updatedAt)}</p>

      {reviews.length > 0 && (
        <section aria-labelledby="in-tests" className="mt-14">
          <h2 id="in-tests" className="mb-6 text-2xl font-extrabold">In diesen Tests erwähnt</h2>
          <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2">{reviews.map((r) => <li key={r.id}><ReviewCard review={r} /></li>)}</ul>
          <AllLink href="/tests" title="Ihr Futter ist nicht dabei?" text="Jeder Test zeigt die Punktewertung, die Zusammensetzung im Klartext und den Werbeaussagen-Check. Stöbern Sie in allen Tests und finden Sie das passende Futter für Ihr Tier.">Alle Futtertests ansehen</AllLink>
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
      <div className="mt-14"><WishBox /></div>
      <div className="mt-14"><NewsletterBox /></div>
    </article>
  );
}

function LexikonHero({ image }: { image: LexikonImage }) {
  return (
    <figure className="mt-6">
      <div className="relative aspect-[1200/630] overflow-hidden rounded-3xl bg-bg-soft">
        <FpImage src={image.url} alt={image.alt} sizes="(min-width:768px) 736px, 100vw" priority />
      </div>
      {image.caption ? <figcaption className="mt-2 px-1 text-sm leading-relaxed text-muted">{image.caption}</figcaption> : null}
    </figure>
  );
}

function LexikonExtraImage({ image }: { image: LexikonImage }) {
  const picture = responsiveImage(image.url);
  return (
    <figure className="mt-6">
      {/* eslint-disable-next-line @next/next/no-img-element -- vorab erzeugte Größen, kein Next-Bild-Optimizer */}
      <img
        src={picture.src}
        srcSet={picture.srcSet}
        sizes={picture.srcSet ? "(min-width:768px) 736px, 100vw" : undefined}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        className="h-auto w-full max-w-full rounded-2xl"
      />
      {image.caption ? <figcaption className="mt-2 px-1 text-sm leading-relaxed text-muted">{image.caption}</figcaption> : null}
    </figure>
  );
}
