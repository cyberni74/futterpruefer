import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

const findMany = vi.hoisted(() => vi.fn());
vi.mock("@/lib/db", () => ({ prisma: { review: { findMany } } }));

import ComparePage from "./page";

function item(id: string, title: string, pricePerKg: unknown, layoutData: unknown) {
  return {
    id, slug: `slug-${id}`, title, imageUrl: null, imageAlt: "", imageBlur: null,
    totalScore: 72, scoreRaw: 22, scoreHarmful: 16, scoreNutrients: 14, scoreDeclaration: 8, scoreNeeds: 7, scoreValue: 5,
    verdict: "Kurzes Fazit.", priceClass: "MITTEL" as const, pricePerKg, layoutData,
    category: { slug: "alleinfuttermittel-hund", shortName: "Alleinfutter Hund" },
  };
}

const mit = item("aaaaaaaa", "Futter mit Preis", 6.4, null);
const ohne = item("bbbbbbbb", "Futter ohne Preis", null, { kennzahlen: [{ wert: "14 kg", label: "Packung" }] });

beforeEach(() => {
  findMany.mockReset();
  findMany.mockResolvedValue([mit, ohne]);
});

describe("Vergleich Preisklasse", () => {
  it("zeigt bei fehlender Preisquelle keine Angabe und sonst Klasse mit Kilopreis", async () => {
    const html = renderToStaticMarkup(await ComparePage({ params: Promise.resolve({}), searchParams: Promise.resolve({ ids: "aaaaaaaa,bbbbbbbb" }) }));
    expect(html).toContain("Futter mit Preis");
    expect(html).toContain("Futter ohne Preis");
    expect(html).toContain(`Mittel · ${Number(6.4).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}/kg`);
    expect(html).toContain("keine Angabe");
    const mittel = html.split("Mittel").length - 1;
    expect(mittel).toBe(1);
  });
});
