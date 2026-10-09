import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { getLatestPosts, getLatestReviews, getNewestReviewUpdate, getProductOfMonth, getTickerEntries, getCategories } from "@/lib/queries";
import { ProductOfMonthHero } from "@/components/product-of-month";
import { Ticker } from "@/components/ticker";
import { ReviewCard } from "@/components/review-card";
import { BlogCard } from "@/components/blog-card";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { NewsletterBox } from "@/components/newsletter-box";
import { DEFAULT_OG_IMAGE, SITE, pageAlternates } from "@/lib/site";
import { CRITERIA } from "@/lib/scoring";
import { hyphenateCategory } from "@/lib/urls";
import {
  FALLBACK_HERO,
  HOME_DESCRIPTION,
  HOME_FAQ,
  HOME_GUIDES,
  HOME_H1,
  INTRO,
  linkedAnswer,
  METHODIK_NOTE,
  OG_DESCRIPTION,
  OG_TITLE,
  homeJsonLd,
  homeTitle,
} from "@/lib/home-seo";

const textLink = "font-semibold text-brand underline underline-offset-4 hover:text-brand-strong";

export async function generateMetadata(): Promise<Metadata> {
  const title = homeTitle(await getNewestReviewUpdate());
  return {
    title: { absolute: title },
    description: HOME_DESCRIPTION,
    alternates: pageAlternates("/"),
    openGraph: {
      type: "website",
      locale: "de_DE",
      siteName: SITE.name,
      url: "/",
      title: OG_TITLE,
      description: OG_DESCRIPTION,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: OG_TITLE, description: OG_DESCRIPTION, images: [DEFAULT_OG_IMAGE] },
  };
}

export const revalidate = 3600;

export default async function Home() {
  const [pom, ticker, reviews, posts, categories, latestUpdate] = await Promise.all([
    getProductOfMonth(),
    getTickerEntries(),
    getLatestReviews(10),
    getLatestPosts(5),
    getCategories(),
    getNewestReviewUpdate(),
  ]);
  const guideHrefs = new Set<string>(HOME_GUIDES.map((guide) => guide.href));
  const extraPosts = posts.filter((post) => !guideHrefs.has(`/blog/${post.slug}`));

  return (
    <>
      <JsonLd data={homeJsonLd(homeTitle(latestUpdate), reviews)} />

      <section aria-labelledby="home-title" className="mx-auto max-w-6xl px-4">
        <h1 id="home-title" className="max-w-4xl text-3xl font-extrabold leading-tight md:text-5xl">
          {HOME_H1}
        </h1>
        <div className="mt-4 max-w-3xl space-y-4 text-lg leading-relaxed text-muted">
          {INTRO.map((paragraph, index) => (
            <p key={index}>
              {paragraph.map((part, partIndex) => {
                const content = part.strong ? <strong className="font-semibold text-fg">{part.text}</strong> : part.text;
                return part.href ? (
                  <Link key={partIndex} href={part.href} className={textLink}>
                    {part.text}
                  </Link>
                ) : (
                  <span key={partIndex}>{content}</span>
                );
              })}
            </p>
          ))}
        </div>
      </section>

      <div className="mx-auto mt-8 max-w-6xl px-4">
        {pom ? (
          <ProductOfMonthHero pom={pom} />
        ) : (
          <section className="rounded-3xl bg-brand-soft p-8 md:p-12">
            <p className="text-3xl font-extrabold md:text-5xl">{FALLBACK_HERO}</p>
            <p className="mt-4 max-w-2xl text-lg text-muted">{HOME_DESCRIPTION}</p>
          </section>
        )}
      </div>

      <div className="mt-8">
        <Ticker items={ticker} />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <h2 id="kategorien" className="sr-only">
          Futtertests nach Kategorie
        </h2>
        <nav aria-labelledby="kategorien" className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link key={c.id} href={`/${c.slug}`} className="group relative flex min-h-16 flex-col items-start gap-1 overflow-hidden rounded-2xl border border-border bg-surface p-3.5 pr-9 font-bold shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand hover:bg-brand-soft hover:shadow-lift focus-visible:border-brand active:scale-[0.97] sm:flex-row sm:items-center sm:gap-3 sm:p-4 sm:pr-10 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100">
              <span aria-hidden className="text-2xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-125 motion-reduce:transition-none motion-reduce:group-hover:transform-none">{c.animal === "HUND" ? "🐕" : "🐈"}</span>
              <span className="min-w-0 leading-tight transition-colors group-hover:text-brand-strong">{hyphenateCategory(c.shortName)}</span>
              <ArrowRight aria-hidden className="absolute right-3 bottom-3.5 size-4 text-brand opacity-0 transition duration-300 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 motion-reduce:transition-none" />
            </Link>
          ))}
        </nav>

        <section aria-labelledby="neueste-tests" className="mt-16">
          <SectionHeading id="neueste-tests" kicker="Frisch geprüft" title="Neueste Futtertests für Hund und Katze" href="/tests" linkLabel="Alle Futtertests" />
          {reviews.length === 0 ? (
            <p className="text-muted">Noch keine Tests veröffentlicht.</p>
          ) : (
            <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {reviews.map((r, i) => (
                <li key={r.id}>
                  <Reveal delay={(i % 4) * 0.05} className="h-full">
                    <ReviewCard review={r} priority={i < 2 && !pom} />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="methodik-teaser" className="mt-16 flex flex-col items-start gap-4 rounded-3xl border border-border bg-bg-soft p-6 md:flex-row md:p-8">
          <ShieldCheck className="size-12 shrink-0 text-brand" aria-hidden />
          <div className="flex-1">
            <h2 id="methodik-teaser" className="text-xl font-extrabold">So testen wir: 100 Punkte, sechs Kriterien</h2>
            <ul className="mt-2 grid gap-x-6 gap-y-1 text-muted sm:grid-cols-2">
              {CRITERIA.map((c) => (
                <li key={c.key}>{c.label}: <strong className="text-fg">{c.max} Punkte</strong></li>
              ))}
            </ul>
            <p className="mt-2 text-muted">{METHODIK_NOTE}</p>
          </div>
          <Link href="/methodik" className="inline-flex min-h-12 items-center self-start rounded-full bg-accent px-6 font-bold text-white hover:bg-accent-strong md:self-center dark:text-black">Methodik ansehen</Link>
        </section>

        <section aria-labelledby="neueste-artikel" className="mt-16">
          <SectionHeading id="neueste-artikel" kicker="Fachblog" title="Ratgeber: Neues aus dem Fachblog" href="/blog" linkLabel="Zum Fachblog" />
          <ul className="grid gap-3 sm:grid-cols-2">
            {HOME_GUIDES.map((guide) => (
              <li key={guide.href}>
                <Link href={guide.href} className={textLink}>{guide.title}</Link>
              </li>
            ))}
          </ul>
          {extraPosts.length > 0 && (
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {extraPosts.map((p, i) => (
                <li key={p.id}>
                  <Reveal delay={(i % 3) * 0.05} className="h-full">
                    <BlogCard post={p} />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="home-faq" className="mt-16">
          <SectionHeading id="home-faq" kicker="FAQ" title="Häufige Fragen zum Futtertest" href="/faq" linkLabel="Alle Fragen" />
          <div className="space-y-3">
            {HOME_FAQ.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-border bg-surface shadow-card">
                <summary className="flex min-h-14 list-none items-center justify-between gap-3 rounded-2xl p-4 font-bold transition-colors hover:text-brand">
                  <h3 className="text-base">{item.q}</h3>
                  <span aria-hidden className="text-xl text-brand transition group-open:rotate-45">+</span>
                </summary>
                <div className="px-4 pb-4 text-muted">
                  <p>
                    {linkedAnswer(item.a, item.anchors).map((part, partIndex) =>
                      part.href ? (
                        <Link key={partIndex} href={part.href} className={textLink}>{part.text}</Link>
                      ) : (
                        <span key={partIndex}>{part.text}</span>
                      ),
                    )}
                  </p>
                  <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    {item.links.map(([label, href]) => (
                      <Link key={href + label} href={href} className={textLink}>{label}</Link>
                    ))}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-16"><NewsletterBox /></div>
      </div>
    </>
  );
}
