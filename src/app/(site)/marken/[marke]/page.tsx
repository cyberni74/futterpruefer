import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ReviewCard } from "@/components/review-card";
import { BrandProfile } from "@/components/brand-profile";
import { getBrandInfo } from "@/lib/brand-info";
import { getBrandBySlug, getBrandReviews, getBrands } from "@/lib/brands";
import { trimMetaDescription } from "@/lib/seo";

export const revalidate = 3600;

/** Markenseiten vorab rendern und per ISR cachen (vorher bei jedem Aufruf neu gerendert, langsam für Googlebot). */
export async function generateStaticParams() {
  try {
    return (await getBrands()).map((b) => ({ marke: b.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps<"/marken/[marke]">): Promise<Metadata> {
  const b = await getBrandBySlug((await params).marke);
  if (!b) return { title: "Marke nicht gefunden", robots: { index: false } };
  return {
    title: `${b.brand} im Test: ${b.count} ${b.count === 1 ? "Produkt" : "Produkte"} bewertet`,
    description: trimMetaDescription(`${b.brand}: ${b.count} ${b.count === 1 ? "Test" : "Tests"} nach unserer 100-Punkte-Methodik, durchschnittlich ${b.avg} von 100 Punkten. Zusammensetzung, Werbeaussagen und Preis im Überblick.`),
    alternates: { canonical: `/marken/${b.slug}` },
    // Eine Marke mit nur einem Test hat zu wenig eigenen Text: noindex, Links bleiben folgbar.
    ...(b.count < 2 ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function BrandPage({ params }: PageProps<"/marken/[marke]">) {
  const b = await getBrandBySlug((await params).marke);
  if (!b) notFound();
  const reviews = await getBrandReviews(b.variants);
  const info = getBrandInfo(b.slug);
  const best = reviews[0];
  const worst = reviews[reviews.length - 1];
  return (
    <div className="mx-auto max-w-6xl px-4">
      <Breadcrumbs items={[{ label: "Marken", href: "/marken" }, { label: b.brand, href: `/marken/${b.slug}` }]} />
      <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">{b.brand} im Test</h1>
      <p className="mt-3 max-w-3xl text-lg text-muted">
        Wir haben {b.count === 1 ? "ein Produkt" : `${b.count} Produkte`} von {b.brand} getestet. Der Durchschnitt liegt bei <strong className="text-fg">{b.avg} von 100 Punkten</strong>
        {reviews.length > 1 && best && worst ? <>. Am besten schneidet {best.title.replace(/ im Test.*$/, "")} ({best.totalScore} Punkte) ab, am schwächsten {worst.title.replace(/ im Test.*$/, "")} ({worst.totalScore} Punkte)</> : null}.
        Alle Bewertungen folgen derselben <Link href="/methodik" className="font-semibold text-brand underline">100-Punkte-Methodik</Link> und beruhen auf veröffentlichten Herstellerangaben, nicht auf Laboranalysen.
      </p>
      <h2 className="sr-only">Tests von {b.brand}</h2>
      <ul className="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {reviews.map((r) => (
          <li key={r.id}><ReviewCard review={r} /></li>
        ))}
      </ul>
      {info && <BrandProfile info={info} />}
      <p className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
        <Link href="/marken" className="text-brand hover:underline">Alle Marken</Link>
        <Link href={`/tests?marke=${encodeURIComponent(b.brand)}`} className="text-brand hover:underline">Tests von {b.brand} filtern und sortieren</Link>
        <Link href="/werbeaussagen" className="text-brand hover:underline">Werbeaussagen-Check</Link>
      </p>
    </div>
  );
}
