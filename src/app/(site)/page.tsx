import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { getLatestPosts, getLatestReviews, getProductOfMonth, getTickerEntries, getCategoryLeaders, getHomeFaq } from "@/lib/queries";
import { HomeSeo } from "@/components/home-seo";
import { HomeHero } from "@/components/home-hero";
import { ProductOfMonthHero } from "@/components/product-of-month";
import { Ticker } from "@/components/ticker";
import { ReviewCard } from "@/components/review-card";
import { BlogCard } from "@/components/blog-card";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { NewsletterBox } from "@/components/newsletter-box";
import { SITE, absoluteUrl } from "@/lib/site";
import { reviewPath } from "@/lib/urls";
import type { Metadata } from "next";

const TITLE = "Hunde- & Katzenfutter im Test – unabhängig | Futterprüfer";
const DESCRIPTION = "Hunde- und Katzenfutter im unabhängigen Fachtest: Rohstoffe, Schadstoffe, Nährstoffprofil und Werbeaussagen nach offener 100-Punkte-Methodik. Tests, Lexikon und Ratgeber.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["Hundefutter Test", "Katzenfutter Test", "Hundefutter Vergleich", "Katzenfutter Vergleich", "Alleinfuttermittel", "Ergänzungsfuttermittel", "Futter Inhaltsstoffe", "Futterprüfer"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "de_DE", siteName: SITE.name, url: "/", title: TITLE, description: DESCRIPTION, images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Futterprüfer – Hunde- und Katzenfutter im unabhängigen Fachtest" }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/opengraph-image.png"] },
};

export const revalidate = 3600;

export default async function Home() {
  const [pom, ticker, reviews, posts, leaders, faq] = await Promise.all([getProductOfMonth(), getTickerEntries(), getLatestReviews(10), getLatestPosts(5), getCategoryLeaders(), getHomeFaq(8)]);

  return (
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "Organization", "@id": `${SITE.url}/#organization`, name: SITE.name, url: SITE.url, logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo-round-512.png"), width: 512, height: 512 }, description: SITE.description, slogan: "Transparent testen. Wissenschaftlich prüfen. Tiere schützen. Halter informieren.", knowsAbout: ["Hundefutter", "Katzenfutter", "Tierernährung", "Futtermittelrecht"], contactPoint: { "@type": "ContactPoint", contactType: "customer support", url: absoluteUrl("/kontakt"), availableLanguage: "de" } },
          { "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE.url}/#website`, name: SITE.name, url: SITE.url, inLanguage: "de-DE", publisher: { "@id": `${SITE.url}/#organization` }, potentialAction: { "@type": "SearchAction", target: `${SITE.url}/suche?q={search_term_string}`, "query-input": "required name=search_term_string" } },
          { "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${SITE.url}/#webpage`, url: SITE.url, name: TITLE, description: DESCRIPTION, inLanguage: "de-DE", isPartOf: { "@id": `${SITE.url}/#website` }, about: { "@id": `${SITE.url}/#organization` }, ...(reviews[0]?.publishedAt ? { dateModified: reviews[0].publishedAt.toISOString() } : {}), mainEntity: { "@type": "ItemList", name: "Die neuesten Futtertests", itemListElement: reviews.slice(0, 10).map((r, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(reviewPath(r)), name: r.title })) } },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4">
        <HomeHero leaders={leaders} />
      </div>

      <div className="mt-8">
        <Ticker items={ticker} />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        {pom && <div className="mt-10"><ProductOfMonthHero pom={pom} /></div>}

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

        <HomeSeo leaders={leaders} faq={faq} />

        <div className="mt-16"><NewsletterBox /></div>
      </div>
    </>
  );
}
