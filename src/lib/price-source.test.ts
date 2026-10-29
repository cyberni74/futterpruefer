import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { Prisma } from "@/generated/prisma/client";
import { BETTERCAT_TESTS } from "../../prisma/review-betterkat";
import { BUGBELL_TESTS } from "../../prisma/review-bugbell";
import { DAILY_OKT16_TESTS } from "../../prisma/review-daily-2026-10-16";
import { DAILY_OKT17_TESTS } from "../../prisma/review-daily-2026-10-17";
import { HAPPYDOG_TESTS } from "../../prisma/review-happydog";
import { KAUARTIKEL_FUNKTION_TESTS } from "../../prisma/review-kauartikel-funktion";
import { MAMMALY_TESTS } from "../../prisma/review-mammaly";
import { MEDIDOG_TEST } from "../../prisma/review-medidog";
import { MEDIDOG_DENTAL_TESTS } from "../../prisma/review-medidog-dental";
import { TREND_OKT_TESTS } from "../../prisma/review-trend-oktober";
import { WOLFSBLUT_TESTS } from "../../prisma/review-wolfsblut";
import { PRICE_CLASS_LABEL } from "./site";
import {
  NO_PRICE_CLASS_LABEL,
  REVIEW_LIST_CAP,
  hasPriceSource,
  priceClassCandidateWhere,
  priceClassCell,
  priceSectionTitle,
  reviewsMatchingPriceFilter,
} from "./price-source";

const SEEDED = [
  ...BETTERCAT_TESTS,
  ...BUGBELL_TESTS,
  ...DAILY_OKT16_TESTS,
  ...DAILY_OKT17_TESTS,
  ...HAPPYDOG_TESTS,
  ...KAUARTIKEL_FUNKTION_TESTS,
  ...MAMMALY_TESTS,
  MEDIDOG_TEST,
  ...MEDIDOG_DENTAL_TESTS,
  ...TREND_OKT_TESTS,
  ...WOLFSBLUT_TESTS,
];

/** Wie der Live-Test the-hunger-of-the-wolf: V2-Kennzahlen, aber kein Preisrechner und kein Kilopreis. */
const OHNE_PREISQUELLE = {
  priceClass: "MITTEL" as const,
  pricePerKg: null,
  layoutData: {
    kennzahlen: [
      { wert: "14 kg", label: "Packung" },
      { wert: "≈ 497 g", label: "Tagesmenge" },
      { wert: "352 kcal", label: "Energie" },
    ],
    kriterien: [{ name: "Preis-Leistung", punkte: 3, max: 5, begruendung: "Einen Preis nennen wir nicht." }],
    kapitel: [{ titel: "Fütterung", html: "<p>Einen Preis nennen wir nicht.</p>" }],
  },
};

describe("hasPriceSource", () => {
  it("gilt für klassische Tests mit gesetztem pricePerKg, auch ohne layoutData", () => {
    expect(hasPriceSource({ pricePerKg: 4.82 })).toBe(true);
    expect(hasPriceSource({ pricePerKg: 0, layoutData: null })).toBe(true);
    expect(hasPriceSource({ pricePerKg: new Prisma.Decimal("12.71") })).toBe(true);
    expect(hasPriceSource({ pricePerKg: "6,40" })).toBe(true);
  });

  it("gilt nicht für leeren oder fehlenden Kilopreis", () => {
    expect(hasPriceSource({ pricePerKg: null })).toBe(false);
    expect(hasPriceSource({})).toBe(false);
    expect(hasPriceSource({ pricePerKg: "" })).toBe(false);
    expect(hasPriceSource({ pricePerKg: "  " })).toBe(false);
    expect(hasPriceSource({ pricePerKg: "k. A." })).toBe(false);
    expect(hasPriceSource({ pricePerKg: Number.NaN })).toBe(false);
  });

  it("liest nur layoutData.preisrechner.preis und wertet leere Felder als keine Quelle", () => {
    expect(hasPriceSource({ pricePerKg: null, layoutData: { preisrechner: { preis: 29.9, inhalt: 160 } } })).toBe(true);
    expect(hasPriceSource({ pricePerKg: null, layoutData: { preisrechner: { preis: 0 } } })).toBe(true);
    expect(hasPriceSource({ layoutData: null })).toBe(false);
    expect(hasPriceSource({ layoutData: {} })).toBe(false);
    expect(hasPriceSource({ layoutData: { preisrechner: null } })).toBe(false);
    expect(hasPriceSource({ layoutData: { preisrechner: {} } })).toBe(false);
    expect(hasPriceSource({ layoutData: { preisrechner: { preis: null } } })).toBe(false);
    expect(hasPriceSource({ layoutData: { preisrechner: { preis: "" } } })).toBe(false);
    expect(hasPriceSource({ layoutData: { preisrechner: { preis: "29,90" } } })).toBe(false);
    expect(hasPriceSource({ layoutData: { preisrechner: { preis: -1 } } })).toBe(false);
    expect(hasPriceSource({ layoutData: { preis: 12 } })).toBe(false);
    expect(hasPriceSource({ layoutData: { kosten: 12 } })).toBe(false);
    expect(hasPriceSource(OHNE_PREISQUELLE)).toBe(false);
  });

  it("behält bei allen Seed-Tests mit Kilopreis die Preisklasse, Brit ohne Preis nicht", () => {
    const ohne = SEEDED.filter((t) => t.pricePerKg == null);
    expect(ohne.map((t) => t.slug)).toEqual(["brit-premium-sensitive-lamm-test"]);
    for (const t of SEEDED) {
      if (t.pricePerKg == null) {
        expect(hasPriceSource(t), t.slug).toBe(false);
        expect(priceClassCell(t), t.slug).toBe(NO_PRICE_CLASS_LABEL);
        expect(priceSectionTitle(t), t.slug).toBe("Preis");
      } else {
        expect(hasPriceSource({ pricePerKg: t.pricePerKg, layoutData: null }), t.slug).toBe(true);
        expect(priceClassCell({ priceClass: t.priceClass, pricePerKg: t.pricePerKg, layoutData: null }), t.slug).toContain(PRICE_CLASS_LABEL[t.priceClass]);
        expect(priceSectionTitle({ priceClass: t.priceClass, pricePerKg: t.pricePerKg }), t.slug).toBe(`Preis · Preisklasse ${PRICE_CLASS_LABEL[t.priceClass]}`);
      }
    }
  });
});

describe("Anzeige", () => {
  it("zeigt im Vergleich Klasse und Kilopreis nur mit Quelle", () => {
    const mit = priceClassCell({ priceClass: "MITTEL", pricePerKg: 6.4, layoutData: null });
    expect(mit).toBe(`Mittel · ${Number(6.4).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}/kg`);
    expect(priceClassCell({ priceClass: "PREMIUM", pricePerKg: null, layoutData: { preisrechner: { preis: 19 } } })).toBe("Premium");
    expect(priceClassCell(OHNE_PREISQUELLE)).toBe("keine Angabe");
  });

  it("setzt die klassische Überschrift nur mit Preisquelle", () => {
    expect(priceSectionTitle({ priceClass: "GUENSTIG", pricePerKg: 2.1 })).toBe("Preis · Preisklasse Günstig");
    expect(priceSectionTitle(OHNE_PREISQUELLE)).toBe("Preis");
    expect(priceSectionTitle({ priceClass: null, pricePerKg: 2 })).toBe("Preis");
  });
});

describe("Preisklassen-Filter", () => {
  it("fordert in Prisma die Klasse und eine mögliche Quelle", () => {
    expect(priceClassCandidateWhere("MITTEL")).toEqual({
      priceClass: "MITTEL",
      OR: [
        { pricePerKg: { not: null } },
        { layoutData: { not: Prisma.AnyNull } },
      ],
    });
  });

  it("wirft Tests ohne Quelle aus jeder Klasse und begrenzt erst danach", () => {
    const rows = [
      { id: "mit-kg", pricePerKg: 4, layoutData: null },
      { id: "mit-rechner", pricePerKg: null, layoutData: { preisrechner: { preis: 8 } } },
      { id: "ohne", ...OHNE_PREISQUELLE },
      { id: "leer", pricePerKg: null, layoutData: {} },
    ];
    expect(reviewsMatchingPriceFilter(rows).map((r) => r.id)).toEqual(["mit-kg", "mit-rechner"]);
    const viele = Array.from({ length: REVIEW_LIST_CAP + 5 }, (_, i) => ({ id: String(i), pricePerKg: i + 1, layoutData: null }));
    expect(reviewsMatchingPriceFilter(viele)).toHaveLength(REVIEW_LIST_CAP);
    expect(reviewsMatchingPriceFilter(viele)[0]?.id).toBe("0");
  });

  it("ist auf Vergleich, Liste und klassischer Testseite verdrahtet", () => {
    const vergleich = readFileSync(new URL("../app/(site)/vergleich/page.tsx", import.meta.url), "utf8");
    const tabelle = readFileSync(new URL("../components/compare-results.tsx", import.meta.url), "utf8");
    const liste = readFileSync(new URL("../components/review-listing.tsx", import.meta.url), "utf8");
    const testseite = readFileSync(new URL("../app/(site)/[kategorie]/[slug]/page.tsx", import.meta.url), "utf8");
    expect(vergleich).toContain("CompareResults");
    expect(tabelle).toContain("priceClassCell(i)");
    expect(tabelle).not.toContain("PRICE_CLASS_LABEL[i.priceClass]");
    expect(liste).toContain("priceClassCandidateWhere(filters.preis)");
    expect(liste).toContain("reviewsMatchingPriceFilter");
    expect(testseite).toContain("title={priceSectionTitle(r)}");
    expect(testseite).not.toContain("Preisklasse ${PRICE_CLASS_LABEL");
  });
});
