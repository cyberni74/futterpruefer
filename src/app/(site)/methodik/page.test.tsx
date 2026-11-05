import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import MethodikPage from "./page";
import ManufacturerPage from "../fuer-hersteller/page";
import { METHODOLOGY_CHANGELOG, METHODOLOGY_CHANGELOG_ABGRENZUNG, METHODOLOGY_CHANGELOG_ERGAENZUNG, RATING_LABEL, RATING_THRESHOLDS } from "@/lib/scoring";

describe("Methodik Transparenz", () => {
  const html = renderToStaticMarkup(<MethodikPage />);

  it("zeigt die neue Gewichtung, den Stand und die Changelog-Zeile", () => {
    expect(html).toContain("Stand 05.11.2026");
    expect(html).toContain(METHODOLOGY_CHANGELOG_ERGAENZUNG);
    expect(METHODOLOGY_CHANGELOG_ERGAENZUNG).toContain("Durch diese Festlegung hat sich keine Punktzahl geändert. Ältere Tests funktioneller Produkte mit sechs Teilnoten bleiben nach den sechs Kriterien bewertet.");
    expect(html).toContain("Seit dem 27.10.2026 gilt: Ergänzungsfutter, die ein Futter im Alltagssinn sind und keinen benannten Wirkstoff haben");
    expect(html).toContain('href="/methodik/ergaenzungsfutter#geltungsbereich"');
    for (const entry of METHODOLOGY_CHANGELOG) expect(html).toContain(entry);
    const vegan = html.indexOf(METHODOLOGY_CHANGELOG[0]);
    const werbeaussagen = html.indexOf(METHODOLOGY_CHANGELOG[1]);
    const neubewertung = html.indexOf(METHODOLOGY_CHANGELOG[2]);
    const preisLeistung = html.indexOf(METHODOLOGY_CHANGELOG[3]);
    const korrektur = html.indexOf(METHODOLOGY_CHANGELOG[4]);
    expect(vegan).toBeGreaterThan(-1);
    expect(werbeaussagen).toBeGreaterThan(vegan);
    expect(werbeaussagen).toBeGreaterThan(-1);
    expect(neubewertung).toBeGreaterThan(werbeaussagen);
    expect(preisLeistung).toBeGreaterThan(neubewertung);
    expect(html.indexOf(METHODOLOGY_CHANGELOG_ERGAENZUNG)).toBeGreaterThan(preisLeistung);
    expect(korrektur).toBeGreaterThan(html.indexOf(METHODOLOGY_CHANGELOG_ABGRENZUNG));
    expect(METHODOLOGY_CHANGELOG[3]).toBe("27.10.2026 – Preis-Leistung: klargestellt, dass wir Preise je Tierart vergleichen. Bestehende Wertungen ändern sich dadurch nicht.");
    expect(html).toContain("Preis-Leistung vergleichen wir je Tierart: Hundefutter mit Hundefutter, Katzenfutter mit Katzenfutter, jeweils bezogen auf die Kosten je 1.000 kcal.");
    expect(html).toContain(METHODOLOGY_CHANGELOG_ABGRENZUNG);
    expect(METHODOLOGY_CHANGELOG[0].startsWith("05.11.2026 – Preis-Leistung bei veganem und vegetarischem Alleinfutter")).toBe(true);
    expect(html).toContain("Preis-Leistung bei veganem und vegetarischem Alleinfutter (seit 05.11.2026): eigene Vergleichsgruppe, Preis je 1.000 kcal.");
    expect(html).toContain("Trocken: unter 2,50 € = 5, bis 3,49 € = 4, bis 4,49 € = 3, bis 5,99 € = 2, ab 6,00 € = 1. Nass: unter 8,00 € = 5, bis 9,99 € = 4, bis 11,99 € = 3, bis 14,99 € = 2, ab 15,00 € = 1.");
    expect(html).toContain("Grund: Pflanzliche Proteinkonzentrate und die nötigen Zusätze haben nach unserer Einschätzung eine andere Kostenstruktur als fleischhaltiges Futter, das deshalb hier kein Preismaßstab ist.");
    expect(html).not.toContain("Fleischhaltiges Futter ist hier kein Preismaßstab");
    expect(html).toContain("Redaktionelle Methodenentscheidung.");
    expect(METHODOLOGY_CHANGELOG[0].endsWith("Neu bewertet: VEGDOG Adult Nass 68 → 70, AMI Cat 59 → 60 (Rot → Gelb), Benevo Original 50 → 51, Happy Dog Sensible India 58 → 60 (Rot → Gelb), VUTTER Nassfutter Wie Ente 75 → 79; Benevo Duo unverändert 36.")).toBe(true);
    expect(METHODOLOGY_CHANGELOG_ABGRENZUNG).toBe("27.10.2026: Abgrenzung Unbelegt/Fragwürdig ergänzt; entspricht unserer bisherigen Bewertungspraxis, keine Punktzahl geändert.");
    expect(html).toContain("Allgemeine Anpreisungen ohne prüfbaren Inhalt, etwa ‚Premium‘ oder ‚Beste Qualität‘, stufen wir als ‚Unbelegt‘ ein. Begriffe mit einem prüfbaren Gehalt, die der Hersteller weder erklärt noch belegt, etwa ‚Lebensmittelqualität‘ oder ‚nachhaltige Verpackung‘, stufen wir als ‚Fragwürdig‘ ein. Erklärt der Hersteller einen solchen Begriff nachvollziehbar, bleibt es bei ‚Unbelegt‘; ist er belegt, werten wir ‚Ohne Einwand‘.");
    expect(html).toContain("Wir unterscheiden fünf Stufen:");
    expect(html).not.toContain("Wir unterscheiden vier Stufen:");
    expect(html).toContain("Plausibel:</strong> Es gibt nachvollziehbare Gründe für die Aussage, ein vollständiger Beleg fehlt.");
    expect(html).toContain('<strong class="text-good">Ohne Einwand:</strong>');
    expect(html).toContain('<strong class="text-muted">Unbelegt:</strong> allgemeine Anpreisung ohne prüfbaren Inhalt oder ein vom Hersteller erklärter, aber nicht belegter Begriff. Wir können die Aussage weder bestätigen noch widerlegen.');
    const ohne = html.indexOf('<strong class="text-good">Ohne Einwand:</strong>');
    const unbelegt = html.indexOf('<strong class="text-muted">Unbelegt:</strong>');
    const fragwuerdig = html.indexOf('<strong class="text-mid">Fragwürdig:</strong>');
    expect(ohne).toBeGreaterThan(-1);
    expect(unbelegt).toBeGreaterThan(ohne);
    expect(fragwuerdig).toBeGreaterThan(unbelegt);
    expect(html).toContain("sechs Kriterien");
    expect(html).not.toMatch(/Die sieben Kriterien|mit sieben Kriterien und maximal|Punkte der sieben/);
    expect(html).not.toContain("10 (neu)");
    expect(html).toContain("Das sind unter 10 von 20 Punkten.");
    expect(html).toContain("insgesamt höchstens 15 Punkte");
    expect(html).toContain("Bei Alleinfutter fließen Unterlagen des Herstellers");
    expect(html).toContain("Wir bewerten, was auf der Amazon-Produktseite, der Verpackung und der Herstellerseite steht.");
    expect(html).not.toContain("Die Seite beschreibt jetzt, was tatsächlich gilt");
    expect(METHODOLOGY_CHANGELOG[4]).toContain("nannten diese Seite und einige andere Seiten von Futterprüfer für Alleinfutter sieben Kriterien");
    expect(METHODOLOGY_CHANGELOG[4]).toContain("Durch diese Korrektur hat sich keine Punktzahl geändert.");
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

  it("nennt die rote Ampel „keine Empfehlung“, passend zum Notenwort", () => {
    expect(RATING_LABEL.schlecht).toBe("Rot – keine Empfehlung");
    expect(html).toContain(`<strong class="text-bad">Rot (unter ${RATING_THRESHOLDS.mittel} Punkten):</strong> keine Empfehlung`);
    expect(html).not.toContain("nicht empfehlenswert");
  });

  it("nennt den optionalen Satz für Hersteller", () => {
    const manufacturer = renderToStaticMarkup(<ManufacturerPage />);
    expect(manufacturer).toContain("Sie können zusätzlich prüfbare Unterlagen einreichen (z. B. unterschriebene Herstellererklärungen oder Laboranalysen des Endprodukts). Bei Ergänzungsfuttermitteln bewerten wir sie im Kriterium „Herstellerunterlagen“ nach festen Stufen, bei Alleinfutter fließen sie derzeit nicht in die Note ein. Eine Einreichung kauft auch hier keine Note.");
  });
});
