import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { getLatestPosts, getLatestReviews, getNewestReviewUpdate, getProductOfMonth, getTickerEntries, getCategoryLeaders } from "@/lib/queries";
import { HomeHero } from "@/components/home-hero";
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
import {
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
  const [pom, ticker, reviews, posts, leaders, latestUpdate] = await Promise.all([
    getProductOfMonth(),
    getTickerEntries(),
    getLatestReviews(10),
    getLatestPosts(5),
    getCategoryLeaders(),
    getNewestReviewUpdate(),
  ]);
  const guideHrefs = new Set<string>(HOME_GUIDES.map((guide) => guide.href));
  const extraPosts = posts.filter((post) => !guideHrefs.has(`/blog/${post.slug}`));

  return (
    <>
      <JsonLd data={homeJsonLd(homeTitle(latestUpdate), reviews)} />

      <div className="mx-auto max-w-6xl px-4">
        <HomeHero leaders={leaders} />
      </div>

      <div className="mt-8">
        <Ticker items={ticker} />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        {pom && <div className="mt-10"><ProductOfMonthHero pom={pom} /></div>}

        <section aria-labelledby="neueste-tests" className="mt-16">
          <SectionHeading id="neueste-tests" kicker="Frisch geprüft" title="Neueste Futtertests für Hund und Katze" href="/tests" linkLabel="Alle Futtertests" />
          {reviews.length === 0 ? (
            <p className="text-muted">Noch keine Tests veröffentlicht.</p>
          ) : (
            <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {reviews.map((r, i) => (
                <li key={r.id}>
                  <Reveal delay={(i % 4) * 0.05} className="h-full">
                    <ReviewCard review={r} priority={false} />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="home-title" className="mt-16">
          <h2 id="home-title" className="max-w-3xl text-lg font-extrabold leading-tight md:text-xl">
            {HOME_H1}
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              { title: "So testen wir", parts: INTRO[0] },
              { title: "Sechs Kriterien", parts: INTRO[1].slice(0, 2) },
              { title: "Mehr als die Note", parts: INTRO[1].slice(2).map((part, i) => (i === 0 ? { ...part, text: part.text.replace(/^\.\s*/, "") } : part)) },
            ].map((block) => (
              <article key={block.title} className="rounded-2xl border border-border bg-surface p-4">
                <h3 className="text-sm font-bold uppercase tracking-wide text-brand">{block.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {block.parts.map((part, partIndex) => {
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
              </article>
            ))}
          </div>
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
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_GUIDES.map((guide) => (
              <li key={guide.href}>
                <Link
                  href={guide.href}
                  className="group flex h-full items-start justify-between gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand-soft"
                >
                  <span className="text-sm font-semibold leading-snug group-hover:text-brand-strong">{guide.title}</span>
                  <ArrowRight className="mt-0.5 size-4 shrink-0 text-brand transition group-hover:translate-x-0.5" aria-hidden />
                </Link>
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
