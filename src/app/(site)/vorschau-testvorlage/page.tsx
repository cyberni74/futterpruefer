import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TestvorlageV2 } from "@/components/testvorlage-v2";
import { beispielDaten } from "@/components/testvorlage-v2/fixtures";
import { RATING_LABEL, ratingFor } from "@/lib/scoring";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Vorschau Testvorlage", robots: { index: false, follow: false } };

/** Nur lokal und auf Vercel-Previews: Beispielseite mit neutralen Daten, ?k=5 (Ergänzungsfutter) oder ?k=6 (Alleinfutter). Produktion: 404. */
export default async function VorschauTestvorlage({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  if (process.env.VERCEL_ENV === "production") notFound();
  const { k } = await searchParams;
  const { data, totalScore } = beispielDaten(k === "6" ? 6 : 5);
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-12">
      <h1 className="text-3xl font-extrabold md:text-5xl">Beispielprodukt A im Test</h1>
      <div className="mt-8"><TestvorlageV2 data={data} totalScore={totalScore} ampelLabel={RATING_LABEL[ratingFor(totalScore)]} /></div>
    </div>
  );
}
