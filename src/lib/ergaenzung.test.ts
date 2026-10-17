import { describe, expect, it } from "vitest";
import {
  appendTierschutz,
  capNote,
  dosisAnteilProzent,
  insertStudienIntoQuellen,
  prepareErgaenzungArticle,
  renderStudienListe,
  scoreErgaenzung,
  suggestAuswahl,
  suppressAmazonCta,
  traegerVorschlag,
  validateEfSave,
  type EfInput,
  type StudieInput,
} from "./ergaenzung";

const full = (over: Partial<EfInput> = {}): EfInput => ({
  auswahl: 20,
  dosierung: 30,
  werbung: 20,
  traeger: 15,
  mengen: 5,
  unterlagen: 10,
  alibi: false,
  keineReferenzdosis: false,
  heilaussage: false,
  sicherheit: "OK",
  ...over,
});

const studie = (over: Partial<StudieInput> = {}): StudieInput => ({
  wirkstoffKey: "w1",
  titel: "Eine Studie zum Wirkstoff",
  autoren: "McCarthy et al.",
  jahr: 2007,
  zeitschrift: "Vet J 2007;174:54–61",
  tierart: "HUND",
  studiendosisJeKg: 35,
  einheit: "MG",
  studiendosisOriginal: "",
  ergebnisKurz: "signifikant weniger Schmerz nach 70 Tagen",
  link: "https://pubmed.ncbi.nlm.nih.gov/16647870/",
  linkFreigabe: false,
  evidenzstufe: "RCT",
  richtung: "POSITIV",
  geprueftAm: "2026-10-17",
  ...over,
});

describe("Ergänzungsfutter-Note", () => {
  it("addiert bis 100 und bleibt Grün ohne Deckel", () => {
    const r = scoreErgaenzung(full());
    expect(r).toMatchObject({ summe: 100, cap: 100, gesamt: 100, ampel: "GRUEN", warnsignal: false, gruende: [] });
  });

  it("Alibi setzt die Dosierung auf 0 und deckelt auf 59", () => {
    const r = scoreErgaenzung(full({ alibi: true, dosierung: 27 }));
    expect(r.dosierung).toBe(0);
    expect(r.summe).toBe(70);
    expect(r.gesamt).toBe(59);
    expect(r.ampel).toBe("ROT");
    expect(r.warnsignal).toBe(false);
  });

  it("fehlende Menge deckelt auf 59, auch ohne Alibi-Häkchen", () => {
    const r = scoreErgaenzung(full({ mengen: 0, dosierung: 30 }));
    expect(r.gesamt).toBe(59);
    expect(r.ampel).toBe("ROT");
  });

  it("Heilaussage deckelt auf 79 und bleibt Gelb", () => {
    const r = scoreErgaenzung(full({ heilaussage: true }));
    expect(r.gesamt).toBe(79);
    expect(r.ampel).toBe("GELB");
    expect(r.warnsignal).toBe(false);
  });

  it("Sicherheit mittel deckelt auf 59 und setzt das Warnsignal", () => {
    const r = scoreErgaenzung(full({ sicherheit: "MITTEL" }));
    expect(r.gesamt).toBe(59);
    expect(r.warnsignal).toBe(true);
    expect(r.ampel).toBe("ROT");
  });

  it("Sicherheit schwer deckelt auf 39, der niedrigste Deckel gilt", () => {
    const r = scoreErgaenzung(full({ sicherheit: "SCHWER", heilaussage: true, alibi: true }));
    expect(r.cap).toBe(39);
    expect(r.gesamt).toBe(39);
    expect(r.warnsignal).toBe(true);
    expect(capNote(r)).toContain("höchstens 39");
  });

  it("ohne Referenzdosis ist die Dosierung höchstens 10, ohne weiteren Deckel", () => {
    const r = scoreErgaenzung(full({ keineReferenzdosis: true, dosierung: 27, auswahl: 5, werbung: 8, traeger: 10, mengen: 2, unterlagen: 2 }));
    expect(r.dosierung).toBe(10);
    expect(r.gesamt).toBe(37);
    expect(r.cap).toBe(100);
  });
});

describe("Studien und Quellen", () => {
  it("lässt Artikel ohne Studien unverändert", () => {
    const html = '<h2>Quellen</h2><p>1. Etikett</p><div class="cta-box"><a class="button" href="https://www.amazon.de/dp/B07">Kauf</a></div>';
    expect(prepareErgaenzungArticle(html, { studienHtml: "", tierschutz: "", rot: false })).toBe(html);
  });

  it("setzt die Liste in den vorhandenen Quellen-Abschnitt", () => {
    const liste = renderStudienListe([
      {
        wirkstoff: "Grünlippmuschel",
        autoren: "Bierer et al.",
        jahr: 2002,
        titel: "Green lipped mussel",
        zeitschrift: "J Nutr 2002",
        tierart: "HUND",
        evidenzstufe: "RCT",
        dosis: "20 mg/kg",
        ergebnis: "weniger Steifigkeit",
        link: "https://pubmed.ncbi.nlm.nih.gov/15136981/",
      },
    ]);
    const html = insertStudienIntoQuellen("<h2>Quellen</h2><p>Etikett</p>", liste);
    expect(html.startsWith('<h2>Quellen</h2><div id="ergaenzung-studien">')).toBe(true);
    expect(html).toContain("Bierer et al. (2002): Green lipped mussel.");
    expect(html).toContain('rel="noopener"');
    expect(html).not.toContain("sponsored");
    expect(html).toContain(">PubMed</a>");
  });

  it("entfernt bei Rot nur die Kauf-Box, nicht die Studienlinks", () => {
    const html = '<h2>Quellen</h2><p><a href="https://pubmed.ncbi.nlm.nih.gov/1/">Studie</a></p><div class="cta-box"><p><a class="button" href="https://www.amazon.de/dp/B07">bei Amazon</a></p></div>';
    const out = suppressAmazonCta(html);
    expect(out).not.toContain("cta-box");
    expect(out).not.toContain("amazon.de");
    expect(out).toContain("pubmed.ncbi.nlm.nih.gov");
  });

  it("hängt Tierschutz nur an, wenn Text da ist", () => {
    expect(appendTierschutz("<p>Text</p>", "  ")).toBe("<p>Text</p>");
    expect(appendTierschutz("<p>Text</p>", "Keine Tierversuche laut Hersteller.")).toContain("<h2>Tierschutz</h2>");
  });
});

describe("Vorschläge und Speichern", () => {
  it("schlägt die Auswahl nach der stärksten Evidenz vor", () => {
    expect(suggestAuswahl([studie({ evidenzstufe: "META_ANALYSE" }), studie()], "HUND").min).toBe(17);
    expect(suggestAuswahl([studie({ evidenzstufe: "META_ANALYSE", richtung: "KEIN_EFFEKT" })], "HUND").max).toBe(10);
    expect(suggestAuswahl([], "HUND").max).toBe(4);
  });

  it("rechnet den Dosisanteil und den Trägervorschlag", () => {
    expect(dosisAnteilProzent(300, 20, 10)).toBe(150);
    expect(dosisAnteilProzent(30, 20, 10)).toBe(15);
    expect(traegerVorschlag(["zucker", "farbstoff"])).toBe(8);
  });

  it("speichert Auswahl über 10 nicht ohne Studie am Zieltier", () => {
    const r = validateEfSave({
      scores: { auswahl: 13, dosierung: 10, werbung: 10, traeger: 10, mengen: 2, unterlagen: 2 },
      begruendungen: { auswahl: "Belegt beim Hund in einer Übersicht.", dosierung: "Unter der Referenz.", werbung: "Heilaussage auf der Dose.", traeger: "Zucker im Träger.", mengen: "Nur Prozent.", unterlagen: "Nur eine E-Mail." },
      alibi: false,
      keineReferenzdosis: true,
      heilaussage: false,
      sicherheit: "OK",
      sicherheitBegruendung: "",
      tierschutz: "Der Hersteller nennt keine Tierversuche. Die Muschel stammt aus Aquakultur.",
      wirkstoffe: [{ key: "w1", name: "Grünlippmuschel", mengeMgProTagesdosis: 30, referenzMgProKg: 20 }],
      studien: [],
      tierart: "HUND",
      publishing: true,
      year: 2026,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.fieldErrors.efWirkstoffAuswahl).toContain("Zieltier");
  });

  it("akzeptiert eine vollständige Studie beim Zieltier", () => {
    const r = validateEfSave({
      scores: { auswahl: 13, dosierung: 30, werbung: 20, traeger: 15, mengen: 5, unterlagen: 10 },
      begruendungen: { auswahl: "Metaanalyse ordnet die Muschel positiv ein.", dosierung: "", werbung: "", traeger: "", mengen: "", unterlagen: "" },
      alibi: false,
      keineReferenzdosis: false,
      heilaussage: false,
      sicherheit: "OK",
      sicherheitBegruendung: "",
      tierschutz: "Keine Hinweise auf Tierversuche. Rohstoff aus Aquakultur.",
      wirkstoffe: [{ key: "w1", name: "Grünlippmuschel", mengeMgProTagesdosis: 300, referenzMgProKg: 20 }],
      studien: [studie()],
      tierart: "HUND",
      publishing: true,
      year: 2026,
    });
    expect(r.ok).toBe(true);
  });
});
