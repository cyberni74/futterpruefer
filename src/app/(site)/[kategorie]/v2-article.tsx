import Link from "next/link";
import { Award, CalendarCheck, Clock, PawPrint, RefreshCw, Scale, UserRound, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { getRelatedReviews, publishedWhere, reviewCardSelect, type ReviewCardData } from "@/lib/queries";
import { getPostsForReview } from "@/lib/content";
import { misleadingClaims, parseClaims } from "@/lib/product-data";
import { faqPageJsonLd } from "@/lib/faq-schema";
import { productReviewJsonLd, reviewHeadline } from "@/lib/review-schema";
import { productLabel, trimMetaDescription } from "@/lib/seo";
import { RATING_LABEL, ratingFor } from "@/lib/scoring";
import { brandPath, reviewPath } from "@/lib/urls";
import { absoluteUrl, ANIMAL_LABEL, formatDate, MONTHS, SITE } from "@/lib/site";
import { contentAuthor } from "@/lib/attribution";
import { reviewH1 } from "@/lib/review-extra-faq";
import { comparisonForReview } from "@/lib/comparison-links";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AuthorCredit } from "@/components/author-credit";
import { MisleadingClaimsBanner } from "@/components/warning-banners";
import { ClaimsCheck } from "@/components/claims-check";
import { FpImage } from "@/components/fp-image";
import { ReadAloud } from "@/components/read-aloud";
import { ShareButtons } from "@/components/share-buttons";
import { ShareBar } from "@/components/share-bar";
import { AllLink } from "@/components/all-link";
import { ReviewCard } from "@/components/review-card";
import { BlogCard } from "@/components/blog-card";
import { NewsletterBox } from "@/components/newsletter-box";
import { WishBox } from "@/components/wish-box";
import { Disclosure } from "@/components/disclosure";
import { JsonLd } from "@/components/json-ld";
import { TestvorlageV2, faqItems, type LayoutData } from "@/components/testvorlage-v2";
import { readingMinutes } from "@/lib/product-data";
import type { getReviewBySlug } from "@/lib/queries";

type Review = NonNullable<Awaited<ReturnType<typeof getReviewBySlug>>>;

/**
 * Seite eines Tests mit TESTVORLAGE_V2. Bleibt: Breadcrumbs, H1, Metazeile, Produktbilder, Offenlegung, Teilen, interne Links.
 * Entfällt: VerdictPanel, bisheriges Inhaltsverzeichnis, „Kurz gesagt“ und der Fazit-Doppelblock der klassischen Seite
 * (Tacho, Verzeichnis und Fazit liefert die Vorlage). Genau ein FAQPage-JSON-LD, aus layoutData.faq.
 */
export async function ReviewV2Article({ r, data, draftPreview }: { r: Review; data: LayoutData; draftPreview: boolean }) {
  const claims = parseClaims(r.claims);
  const misleading = misleadingClaims(claims);
  const name = productLabel(r.brand, r.productName);
  const url = absoluteUrl(reviewPath(r));
  const testedAt = r.testedAt ?? r.publishedAt;
  const images = [r.imageUrl, r.contentImageUrl, ...(r.gallery ?? [])].filter((x): x is string => Boolean(x));
  const gallery = (r.gallery ?? []).filter(Boolean);
  const abs = (u: string) => (u.startsWith("http") ? u : absoluteUrl(u));
  const description = trimMetaDescription(r.metaDescription?.trim() || data.hero?.gesamturteil?.trim() || `${r.title} im Fachtest: ${r.totalScore}/100 Punkte.`);
  const minutes = readingMinutes(JSON.stringify(data), r.verdict);

  const [related, posts, pom, handPicked] = await Promise.all([
    getRelatedReviews(r.categoryId, r.id, 3),
    getPostsForReview(r, 2),
    prisma.productOfMonth.findFirst({ where: { reviewId: r.id }, orderBy: [{ year: "desc" }, { month: "desc" }] }),
    data.aehnlicheTests?.length
      ? prisma.review.findMany({ where: { slug: { in: data.aehnlicheTests }, id: { not: r.id }, ...publishedWhere() }, select: reviewCardSelect, take: 6 })
      : Promise.resolve([] as ReviewCardData[]),
  ]);
  const similar = handPicked.length ? data.aehnlicheTests!.map((s) => handPicked.find((x) => x.slug === s)).filter((x): x is ReviewCardData => Boolean(x)) : related;
  const moisture = null;
  const comparison = comparisonForReview({ title: r.title, productName: r.productName, keyword: r.keyword, categorySlug: r.category.slug, moisture });
  const faqLd = faqPageJsonLd(faqItems(data));
  const ampelLabel = RATING_LABEL[ratingFor(r.totalScore)];

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4">
      {draftPreview && (
        <p role="status" className="mt-4 rounded-2xl border-2 border-bad bg-bad-soft p-5 text-lg font-extrabold text-bad">
          Entwurf – nicht veröffentlicht, Rechtsprüfung ausstehend
        </p>
      )}
      <JsonLd
        data={[
          productReviewJsonLd(
            {
              brand: r.brand, productName: r.productName, categoryName: r.category.name, description, totalScore: r.totalScore, verdict: data.hero?.gesamturteil ?? r.verdict,
              publishedAt: r.publishedAt, updatedAt: r.updatedAt, authorSlug: r.authorSlug, images, pros: data.pros ?? r.pros, cons: data.cons ?? r.cons,
              price: r.price == null ? null : Number(r.price), url,
            },
            { aggregateRating: true },
          ),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: reviewHeadline(name),
            description,
            datePublished: r.publishedAt?.toISOString(),
            dateModified: r.updatedAt.toISOString(),
            inLanguage: "de-DE",
            mainEntityOfPage: url,
            ...(images.length ? { image: images.map(abs) } : {}),
            author: contentAuthor(r.authorSlug),
            publisher: { "@type": "Organization", name: SITE.name, url: SITE.url, logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo-round-512.png") } },
          },
          ...(faqLd ? [faqLd] : []),
        ]}
      />
      <Breadcrumbs items={[{ label: r.category.name, href: `/${r.category.slug}` }, { label: name, href: reviewPath(r) }]} />
      {misleading.length > 0 && <div className="mt-4"><MisleadingClaimsBanner count={misleading.length} /></div>}
      </div>

      <div id="testbericht" className="mt-4">
        <TestvorlageV2
          data={data}
          totalScore={r.totalScore}
          ampelLabel={ampelLabel}
          kopf={
            <>
              <div className="hero-badges">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-brand-strong"><PawPrint className="size-3.5" aria-hidden />{ANIMAL_LABEL[r.category.animal]}</span>
                <Link href={`/${r.category.slug}`} className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-brand-strong hover:bg-white">{r.category.name}</Link>
                {r.brand && <Link href={brandPath(r.brand)} className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-brand-strong hover:bg-white">Marke: {r.brand}</Link>}
                {pom && (
                  <Link href="/produkt-des-monats" className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white dark:text-black hover:bg-accent-strong"><Award className="size-3.5" aria-hidden />Produkt des Monats {MONTHS[pom.month - 1]} {pom.year}</Link>
                )}
              </div>
              <h1>{reviewH1(r.slug, name)}</h1>
              <ul className="hero-meta">
                <li><UserRound className="size-4" aria-hidden />Von <AuthorCredit slug={r.authorSlug} className="font-semibold underline underline-offset-2" /></li>
                {testedAt && <li><CalendarCheck className="size-4" aria-hidden />Getestet am <time dateTime={testedAt.toISOString()}>{formatDate(testedAt)}</time></li>}
                <li><RefreshCw className="size-4" aria-hidden />Aktualisiert <time dateTime={r.updatedAt.toISOString()}>{formatDate(r.updatedAt)}</time></li>
                <li><Clock className="size-4" aria-hidden />{minutes} Min. Lesezeit</li>
              </ul>
              <div className="mt-3"><ReadAloud targetId="testbericht" /></div>
            </>
          }
          medien={
            r.imageUrl || r.contentImageUrl || gallery.length ? (
              <div className="mt-5">
                <div className={`medien ${r.imageUrl && r.contentImageUrl ? "zwei" : ""}`}>
                  {r.imageUrl && (
                    <figure>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-bg-soft">
                        <FpImage src={r.imageUrl} alt={r.imageAlt.trim() || `Verpackung von ${name}`} blur={r.imageBlur} sizes={r.contentImageUrl ? "(min-width:1024px) 600px, (min-width:640px) 50vw, 100vw" : "(min-width:1024px) 1000px, 100vw"} priority />
                      </div>
                      <figcaption>Verpackung</figcaption>
                    </figure>
                  )}
                  {r.contentImageUrl && (
                    <figure>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-bg-soft">
                        <FpImage src={r.contentImageUrl} alt={r.contentImageAlt.trim() || `Inhalt von ${name} ohne Verpackung`} blur={r.contentImageBlur} sizes={r.imageUrl ? "(min-width:1024px) 600px, (min-width:640px) 50vw, 100vw" : "(min-width:1024px) 1000px, 100vw"} priority={!r.imageUrl} />
                      </div>
                      <figcaption>Das Futter selbst</figcaption>
                    </figure>
                  )}
                </div>
                {data.bildnachweis && <p className="mt-2 text-xs" style={{ color: "var(--fp-text-muted)" }}>Bildnachweis: {data.bildnachweis}</p>}
                {gallery.length > 0 && (
                  <ul className="mt-3 flex gap-3 overflow-x-auto pb-1" aria-label="Weitere Produktbilder">
                    {gallery.map((src, i) => (
                      <li key={src} className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-bg-soft">
                        <FpImage src={src} alt={`${name} – weiteres Bild ${i + 1}`} sizes="96px" />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null
          }
        />
      </div>

      <div className="mx-auto max-w-6xl px-4">
      {comparison && (
        <p className="mt-6 rounded-2xl border border-border bg-surface p-4 text-sm">
          <strong>Zum Vergleichstest:</strong>{" "}
          <Link href={comparison.href} className="font-semibold text-brand underline">{comparison.title}</Link>
        </p>
      )}

      {claims.length > 0 && <div className="mt-12"><ClaimsCheck claims={claims} brand={r.brand} /></div>}

      <div className="mt-12">
        <p className="mb-3 text-sm font-bold">Diesen Test teilen</p>
        <ShareButtons url={url} title={`${name} im Test – ${r.totalScore}/100 Punkte`} />
      </div>
      <ShareBar url={url} title={`${name} im Test – ${r.totalScore}/100 Punkte`} />

      {similar.length > 0 && (
        <section aria-labelledby="aehnliche" className="mt-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 id="aehnliche" className="text-2xl font-extrabold">Ähnliche Tests</h2>
            <Link href={`/vergleich?ids=${[r.id, ...similar.slice(0, 2).map((x) => x.id)].join(",")}`} rel="nofollow" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-bold text-white hover:bg-accent-strong dark:text-black">
              <Scale className="size-4" aria-hidden /> Direkt vergleichen
            </Link>
          </div>
          <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">{similar.map((x) => <li key={x.id}><ReviewCard review={x} eager /></li>)}</ul>
          <Link href={`/${r.category.slug}`} className="mt-6 inline-flex min-h-11 items-center gap-1 font-bold text-brand hover:underline">
            Alle Tests: {r.category.name} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </section>
      )}
      {posts.length > 0 && (
        <section aria-labelledby="fachartikel" className="mt-16">
          <h2 id="fachartikel" className="mb-6 text-2xl font-extrabold">Passende Fachartikel</h2>
          <ul className="grid gap-5 sm:grid-cols-2">{posts.map((p) => <li key={p.id}><BlogCard post={p} /></li>)}</ul>
          <AllLink href="/blog" title="Mehr Wissen für den Napf" text="Ratgeber zu Zutaten, Fütterung und Gesundheit, verständlich und mit Quellen. Lesen Sie weiter im Fachblog.">Alle Beiträge im Fachblog</AllLink>
        </section>
      )}
      <div className="mt-16"><WishBox /></div>
      <div className="mt-16"><NewsletterBox /></div>
      <div className="mt-8 mb-12"><Disclosure /></div>
      </div>
    </div>
  );
}
