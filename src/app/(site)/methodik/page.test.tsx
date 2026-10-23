import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import MethodikPage from "./page";
import ManufacturerPage from "../fuer-hersteller/page";
import { METHODOLOGY_CHANGELOG } from "@/lib/scoring";

describe("Methodik Transparenz", () => {
  const html = renderToStaticMarkup(<MethodikPage />);

  it("zeigt die neue Gewichtung, den Stand und die Changelog-Zeile", () => {
    expect(html).toContain("Stand 16.10.2026");
    expect(html).toContain(METHODOLOGY_CHANGELOG);
    expect(html).toContain("27 (30)");
    expect(html).toContain("18 (20)");
    expect(html).toContain("13 (15)");
    expect(html).toContain("9 (10)");
    expect(html).toContain("5 (5)");
    expect(html).toContain("10 (neu)");
    expect(html).toContain("Transparenz / Herstellerunterlagen");
  });

  it("übernimmt die rechtlich vorgegebenen Stufen und den Vergleichshinweis", () => {
    expect(html).not.toContain("Vor jedem Test bitten wir den Hersteller per E-Mail");
    expect(html).toContain("Unterlagen ohne Unterschrift oder ohne erkennbares Labor.");
    expect(html).toContain("Endproduktanalysen mit nicht verifizierbarem Labor zählen ebenfalls zur Stufe 4.");
    expect(html).toContain("Analysebericht eines akkreditierten Labors (Akkreditierung überprüfbar), der nur Rohstoffe oder Vorprodukte betrifft.");
    expect(html).toContain("Tests nach der bisherigen und nach der neuen Methodik sind nicht unmittelbar vergleichbar. Ranglisten und Vergleichstabellen berücksichtigen nur Tests derselben Methodik-Version.");
  });

  it("verwendet keine Einstufung „zulässig“/„unzulässig“ (Rechtsprüfung 23.10.)", () => {
    expect(html).not.toMatch(/zuläss/i);
    expect(html).toContain("Aussagen, die wir für irreführend halten, führen zu Abzügen");
  });

  it("nennt den optionalen Satz für Hersteller", () => {
    const manufacturer = renderToStaticMarkup(<ManufacturerPage />);
    expect(manufacturer).toContain("Sie können zusätzlich prüfbare Unterlagen einreichen (z. B. unterschriebene Herstellererklärungen oder Laboranalysen des Endprodukts). Diese bewerten wir im Kriterium „Transparenz / Herstellerunterlagen“ nach festen Stufen. Eine Einreichung kauft auch hier keine Note.");
  });
});
