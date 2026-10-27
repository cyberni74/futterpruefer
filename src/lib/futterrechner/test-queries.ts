import "server-only";
import { prisma } from "@/lib/db";
import { publishedWhere } from "@/lib/queries";
import { ReviewCardData, reviewCardSelect } from "@/lib/queries";
import { passendeTests, type TestKandidat } from "./test-auswahl";

export type TestCta = ReviewCardData;

/** Nur lesend (ISR der Seite): je Tierart und Futterart bis zu drei Alleinfutter-Tests mit Grün oder Gelb. */
export async function ladeTestCtas(art: "hund" | "katze"): Promise<Record<"trocken" | "nass", TestCta[]>> {
  try {
    const rows = await prisma.review.findMany({
      where: { ...publishedWhere(), bewertungsart: "ALLEINFUTTER", totalScore: { gte: 60 }, category: { animal: art === "hund" ? "HUND" : "KATZE" } },
      select: { ...reviewCardSelect, analysis: true },
      orderBy: { totalScore: "desc" },
      take: 80,
    });
    const kandidaten = rows.map((r) => ({ ...r, analysis: r.analysis as unknown })) as unknown as Array<TestKandidat & TestCta>;
    const pick = (fa: "trocken" | "nass") => passendeTests(kandidaten, art, fa) as Array<TestKandidat & TestCta>;
    const strip = (xs: Array<TestKandidat & TestCta>): TestCta[] => xs.map(({ ...r }) => { delete (r as { analysis?: unknown }).analysis; return r; });
    return { trocken: strip(pick("trocken")), nass: strip(pick("nass")) };
  } catch {
    return { trocken: [], nass: [] };
  }
}
