import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { getLatestPosts, getLatestReviews, getProductOfMonth, getTickerEntries, getCategories } from "@/lib/queries";
import { ProductOfMonthHero } from "@/components/product-of-month";
import { Ticker } from "@/components/ticker";
import { ReviewCard } from "@/components/review-card";
import { BlogCard } from "@/components/blog-card";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { SITE, absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function Home() {
  const [pom, ticker, reviews, posts, categories] = await Promise.all([getProductOfMonth(), getTickerEntries(), getLatestReviews(10), getLatestPosts(5), getCategories()]);

  return (
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "Organization", name: SITE.name, url: SITE.url, logo: absoluteUrl("/brand/logo-round-512.png") },
          { "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: SITE.url, inLanguage: "de-DE", potentialAction: { "@type": "SearchAction", target: `${SITE.url}/suche?q={search_term_string}`, "query-input": "required name=search_term_string" } },
        ]}
      />
      <h1 className="sr-only">Futterprüfer – Hunde- und Katzenfutter im unabhängigen Fachtest</h1>
      <div className="mx-auto max-w-6xl px-4">
        {pom ? (
          <ProductOfMonthHero pom={pom} />
        ) : (
          <section className="rounded-3xl bg-brand-soft p-8 md:p-12">
            <p className="text-3xl font-extrabold md:text-5xl">Hunde- und Katzenfutter im Fachtest</p>
            <p className="mt-4 max-w-2xl text-lg text-muted">{SITE.description}</p>
          </section>
        )}
      </div>

      <div className="mt-8">
        <Ticker items={ticker} />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <nav aria-label="Testkategorien" className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link key={c.id} href={`/kategorie/${c.slug}`} className="flex min-h-16 items-center gap-3 rounded-2xl border border-border bg-surface p-4 font-bold shadow-card transition hover:-translate-y-0.5 hover:shadow-lift motion-reduce:hover:translate-y-0">
              <span aria-hidden className="text-2xl">{c.animal === "HUND" ? "🐕" : "🐈"}</span>
              <span className="leading-tight">{c.shortName}</span>
            </Link>
          ))}
        </nav>

        <section aria-labelledby="neueste-tests" className="mt-16">
          <SectionHeading id="neueste-tests" kicker="Frisch geprüft" title="Die neuesten Tests" href="/tests" linkLabel="Alle Tests" />
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

        <section aria-labelledby="methodik-teaser" className="mt-16 flex flex-col items-start gap-4 rounded-3xl border border-border bg-bg-soft p-6 md:flex-row md:items-center md:p-8">
          <ShieldCheck className="size-12 shrink-0 text-brand" aria-hidden />
          <div className="flex-1">
            <h2 id="methodik-teaser" className="text-xl font-extrabold">100 Punkte, sechs Kriterien, volle Transparenz</h2>
            <p className="mt-1 text-muted">Rohstoffe, Schadstoffe, Nährstoffprofil, Deklaration, Bedarfsdeckung und Preis-Leistung. Keine gekauften Noten.</p>
          </div>
          <Link href="/methodik" className="inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-bold text-white hover:bg-accent-strong dark:text-black">Methodik ansehen</Link>
        </section>

        <section aria-labelledby="neueste-artikel" className="mt-16">
          <SectionHeading id="neueste-artikel" kicker="Fachblog" title="Neueste Artikel" href="/blog" linkLabel="Zum Blog" />
          {posts.length === 0 ? (
            <p className="text-muted">Noch keine Artikel veröffentlicht.</p>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <li key={p.id}>
                  <Reveal delay={(i % 3) * 0.05} className="h-full">
                    <BlogCard post={p} />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
