import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

const findMany = vi.hoisted(() => vi.fn());
vi.mock("@/lib/db", () => ({ prisma: { review: { findMany } } }));

import ComparePage from "./page";

function item(id: string, title: string, pricePerKg: unknown, layoutData: unknown, extra: Record<string, unknown> = {}) {
  return {
    id, slug: `slug-${id}`, title, imageUrl: null, imageAlt: "", imageBlur: null,
    totalScore: 72, scoreRaw: 22, scoreHarmful: 16, scoreNutrients: 14, scoreDeclaration: 8, scoreNeeds: 7, scoreValue: 5,
    verdict: "Kurzes Fazit.", priceClass: "MITTEL" as const, pricePerKg, layout: "", layoutData,
    category: { slug: "alleinfuttermittel-hund", shortName: "Alleinfutter Hund" },
    ...extra,
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
    expect(html).toContain("Testsieger");
    expect(html).toContain("22/30");
    expect(html).not.toContain("durchgefallen");
  });

  it("vergibt Testsieger nicht an Rot und zeigt bei V2 keine 0/x-Kriterien", async () => {
    const rot = item("cccccccc", "Doppelherz Haut & Fell", null, null, {
      totalScore: 27, scoreRaw: 0, scoreHarmful: 0, scoreNutrients: 0, scoreDeclaration: 0, scoreNeeds: 0, scoreValue: 0,
      layout: "TESTVORLAGE_V2",
    });
    const gelb = item("dddddddd", "Medidog Paste", 4, null, { totalScore: 82, scoreHarmful: 19 });
    findMany.mockResolvedValue([rot, gelb]);
    const html = renderToStaticMarkup(await ComparePage({ params: Promise.resolve({}), searchParams: Promise.resolve({ ids: "cccccccc,dddddddd" }) }));
    expect(html).toContain("Doppelherz Haut &amp; Fell");
    expect(html.split(">Testsieger<").length - 1).toBe(1);
    expect(html).toContain("Dieses Kriterium gilt für diesen Test nicht");
    expect(html).not.toContain("0/30");
    expect(html).not.toContain("0/20");
    expect(html).toContain("22/30");
    expect(html).toContain("19/20");
    expect(html).not.toContain("durchgefallen");
  });

  it("zeigt das Schadstoff-Warnzeichen nur bei klassischen Tests unter 10 Punkten", async () => {
    const schlecht = item("eeeeeeee", "Klassisch bedenklich", 3, null, { totalScore: 40, scoreHarmful: 4 });
    const besser = item("ffffffff", "Klassisch in Ordnung", 3, null, { totalScore: 55, scoreHarmful: 16 });
    findMany.mockResolvedValue([schlecht, besser]);
    const html = renderToStaticMarkup(await ComparePage({ params: Promise.resolve({}), searchParams: Promise.resolve({ ids: "eeeeeeee,ffffffff" }) }));
    expect(html).not.toContain("Testsieger");
    expect(html).toContain("4/20");
    expect(html).toContain('aria-label="durchgefallen"');
    expect(html.split('aria-label="durchgefallen"').length - 1).toBe(1);
  });
});
