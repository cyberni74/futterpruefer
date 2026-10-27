import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import MethodikPage from "./page";
import ManufacturerPage from "../fuer-hersteller/page";
import { METHODOLOGY_CHANGELOG, METHODOLOGY_CHANGELOG_ERGAENZUNG } from "@/lib/scoring";

describe("Methodik Transparenz", () => {
  const html = renderToStaticMarkup(<MethodikPage />);

  it("zeigt die neue Gewichtung, den Stand und die Changelog-Zeile", () => {
    expect(html).toContain("Stand 27.10.2026");
    expect(html).toContain(METHODOLOGY_CHANGELOG_ERGAENZUNG);
    expect(html).toContain("Seit dem 27.10.2026 gilt: Ergänzungsfutter, die ein Futter im Alltagssinn sind und keinen benannten Wirkstoff haben");
    expect(html).toContain('href="/methodik/ergaenzungsfutter#geltungsbereich"');
    expect(html).toContain(METHODOLOGY_CHANGELOG);
    expect(html).toContain("sechs Kriterien");
    expect(html).not.toMatch(/Die sieben Kriterien|mit sieben Kriterien und maximal|Punkte der sieben/);
    expect(html).not.toContain("10 (neu)");
    expect(html).toContain("Das sind unter 10 von 20 Punkten.");
    expect(html).toContain("insgesamt höchstens 15 Punkte");
    expect(html).toContain("Bei Alleinfutter fließen Unterlagen des Herstellers");
    expect(html).toContain("Wir bewerten, was auf der Amazon-Produktseite, der Verpackung und der Herstellerseite steht.");
    expect(html).not.toContain("Die Seite beschreibt jetzt, was tatsächlich gilt");
    expect(METHODOLOGY_CHANGELOG).toContain("nannten diese Seite und einige andere Seiten von Futterprüfer für Alleinfutter sieben Kriterien");
    expect(METHODOLOGY_CHANGELOG).toContain("Durch diese Korrektur hat sich keine Punktzahl geändert.");
  });

  it("verweist für Herstellerunterlagen auf die Ergänzungsfutter-Methodik", () => {
    expect(html).not.toContain("Vor jedem Test bitten wir den Hersteller per E-Mail");
    expect(html).toContain('href="/methodik/ergaenzungsfutter#transparenz"');
    expect(html).not.toContain("Auf jeder Testseite steht, nach welcher Methodik-Version bewertet wurde.");
  });

  it("verwendet keine Einstufung „zulässig“/„unzulässig“ (Rechtsprüfung 23.10.)", () => {
    expect(html).not.toMatch(/zuläss/i);
    expect(html).toContain("Aussagen, die wir für irreführend halten, führen zu Abzügen");
  });

  it("nennt den optionalen Satz für Hersteller", () => {
    const manufacturer = renderToStaticMarkup(<ManufacturerPage />);
    expect(manufacturer).toContain("Sie können zusätzlich prüfbare Unterlagen einreichen (z. B. unterschriebene Herstellererklärungen oder Laboranalysen des Endprodukts). Bei Ergänzungsfuttermitteln bewerten wir sie im Kriterium „Herstellerunterlagen“ nach festen Stufen, bei Alleinfutter fließen sie derzeit nicht in die Note ein. Eine Einreichung kauft auch hier keine Note.");
  });
});
