import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Prisma } from "@/generated/prisma/client";

const findMany = vi.hoisted(() => vi.fn());
vi.mock("@/lib/db", () => ({ prisma: { review: { findMany } } }));

import { ReviewListing } from "./review-listing";
import type { ReviewFilters } from "@/lib/filters";

const base = { sort: "punkte", tier: null, min: 0, marke: null } as const;

function filters(preis: ReviewFilters["preis"]): ReviewFilters {
  return { ...base, preis };
}

function card(id: string, title: string, pricePerKg: unknown, layoutData: unknown) {
  return {
    id, slug: id, title, brand: "Alpha", productName: title, keyword: "", teaser: "Teaser",
    imageUrl: null, imageAlt: "", imageBlur: null, totalScore: 70, scoreHarmful: 15,
    priceClass: "MITTEL" as const, publishedAt: new Date("2026-10-01T10:00:00Z"),
    category: { slug: "alleinfuttermittel-hund", shortName: "Alleinfutter", animal: "HUND" as const },
    pricePerKg, layoutData,
  };
}

const mitKg = card("mitkgid1", "Mit Kilopreis", 6.4, null);
const mitRechner = card("rechner1", "Mit Preisrechner", null, { preisrechner: { preis: 19 } });
const ohne = card("ohneid01", "Ohne Preisquelle", null, { kennzahlen: [{ wert: "14 kg", label: "Packung" }] });

beforeEach(() => {
  findMany.mockReset();
  findMany.mockImplementation(async (args: { distinct?: unknown }) => (args.distinct ? [{ brand: "Alpha" }, { brand: "Beta" }] : [mitKg, mitRechner, ohne]));
});

function listCall() {
  const call = findMany.mock.calls.map((c) => c[0] as { distinct?: unknown; take?: number; where?: unknown; select?: unknown }).find((c) => !c.distinct);
  if (!call) throw new Error("Listenabfrage fehlt");
  return call;
}

describe("ReviewListing Preisklasse", () => {
  it("ohne Filter bleiben Tests ohne Preisquelle in der Liste", async () => {
    const html = renderToStaticMarkup(await ReviewListing({ basePath: "/tests", filters: filters(null) }));
    expect(html).toContain("Mit Kilopreis");
    expect(html).toContain("Mit Preisrechner");
    expect(html).toContain("Ohne Preisquelle");
    expect(html).toContain("3 Tests gefunden");
    expect(listCall().take).toBe(120);
    expect(listCall().where).not.toHaveProperty("OR");
    expect(JSON.stringify(listCall().where)).not.toContain("priceClass");
  });

  it("jeder Preisklassen-Filter schließt Tests ohne Preisquelle aus", async () => {
    const html = renderToStaticMarkup(await ReviewListing({ basePath: "/hundefutter", filters: filters("MITTEL"), categoryId: "cat1" }));
    expect(html).toContain("Mit Kilopreis");
    expect(html).toContain("Mit Preisrechner");
    expect(html).not.toContain("Ohne Preisquelle");
    expect(html).toContain("2 Tests gefunden");
    const where = listCall().where as { AND: [Record<string, unknown>, { priceClass: string; OR: unknown[] }] };
    expect(where.AND[0]).toMatchObject({ categoryId: "cat1" });
    expect(where.AND[1]).toEqual({
      priceClass: "MITTEL",
      OR: [{ pricePerKg: { not: null } }, { layoutData: { not: Prisma.AnyNull } }],
    });
    expect(listCall().take).toBeUndefined();
    expect(listCall().select).toMatchObject({ pricePerKg: true, layoutData: true });
  });
});
