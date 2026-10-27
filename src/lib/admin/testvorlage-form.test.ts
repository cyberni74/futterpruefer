import { describe, expect, it } from "vitest";
import { beispielDaten } from "@/components/testvorlage-v2/fixtures";
import { KRITERIEN_VORLAGE, parseLayoutData, pruefeVorVeroeffentlichung } from "@/components/testvorlage-v2/schema";
import { draftToLayoutData, draftTotal, emptyDraft, exportLayoutJson, importLayoutJson, kriterienVorlage, layoutDataToDraft } from "./testvorlage-form";

const beispielDraft = (n: 5 | 6 = 5) => {
  const p = parseLayoutData(beispielDaten(n).data);
  if (!p.ok) throw new Error(p.error);
  return layoutDataToDraft(p.data);
};

describe("Admin-Formular der Testvorlage", () => {
  it("leeres Formular ergibt leere layoutData", () => {
    expect(draftToLayoutData(emptyDraft())).toEqual({});
    expect(parseLayoutData(draftToLayoutData(emptyDraft())).ok).toBe(true);
  });
  it("Export und Import sind verlustfrei (Beispieldaten, 5 und 6 Kriterien)", () => {
    for (const n of [5, 6] as const) {
      const d = beispielDraft(n);
      const json = exportLayoutJson(d);
      const r = importLayoutJson(json);
      expect(r.ok).toBe(true);
      if (r.ok) expect(JSON.parse(exportLayoutJson(r.draft))).toEqual(JSON.parse(json));
    }
  });
  it("Gesamtpunktzahl wird aus den Kriterien berechnet", () => {
    expect(draftTotal(beispielDraft(5))).toBe(87);
    expect(draftTotal(beispielDraft(6))).toBe(83);
    expect(draftTotal(emptyDraft())).toBe(0);
  });
  it("Vorauswahl: Ergänzungsfutter 5 Kriterien 20/30/20/15/15, Alleinfutter 6 mit 30/20/20/15/10/5", () => {
    expect(kriterienVorlage("ERGAENZUNGSFUTTER").map((k) => Number(k.max))).toEqual([20, 30, 20, 15, 15]);
    expect(kriterienVorlage("ALLEINFUTTER").map((k) => Number(k.max))).toEqual([30, 20, 20, 15, 10, 5]);
    expect(KRITERIEN_VORLAGE.ERGAENZUNGSFUTTER.reduce((a, b) => a + b, 0)).toBe(100);
    expect(KRITERIEN_VORLAGE.ALLEINFUTTER.reduce((a, b) => a + b, 0)).toBe(100);
    expect(kriterienVorlage("ALLEINFUTTER").every((k) => k.name.length > 0 && k.punkte === "")).toBe(true);
  });
  it("Komma als Dezimaltrenner und ungültige Zahlen: Schema meldet, Formular stürzt nicht ab", () => {
    const d = emptyDraft();
    d.herstellerangaben = [{ _k: "a", label: "A", prozent: "92,5" }];
    expect(parseLayoutData(draftToLayoutData(d))).toMatchObject({ ok: true });
    d.herstellerangaben = [{ _k: "a", label: "A", prozent: "abc" }];
    expect(parseLayoutData(draftToLayoutData(d)).ok).toBe(false);
  });
  it("Preisrechner nur bei aktiv; Pflichtzahlen werden geprüft", () => {
    const d = emptyDraft();
    expect(draftToLayoutData(d).preisrechner).toBeUndefined();
    d.preisrechner = { aktiv: true, preis: "29,90", inhalt: "160", einheit: "GRAMM", dosisProKg: "0,5", koerpergewicht: "10", tage: "30" };
    expect(parseLayoutData(draftToLayoutData(d)).ok).toBe(true);
    d.preisrechner.inhalt = "";
    expect(parseLayoutData(draftToLayoutData(d)).ok).toBe(false);
  });
  it("Import akzeptiert { layoutData: … } und meldet ungültige Dateien verständlich", () => {
    const inner = exportLayoutJson(beispielDraft());
    expect(importLayoutJson(`{"layoutData": ${inner}}`).ok).toBe(true);
    const kaputt = importLayoutJson("{nicht json");
    expect(kaputt).toEqual({ ok: false, error: "Die Datei ist kein gültiges JSON." });
    const falsch = importLayoutJson(JSON.stringify({ kriterien: [{ name: "A", punkte: 9, max: 5 }] }));
    expect(falsch.ok).toBe(false);
    if (!falsch.ok) expect(falsch.error).toContain("kriterien");
  });
  it("Felder ohne eigenes Formularfeld (kaufUrl, Abschnittstitel, Kapitel-IDs) bleiben beim Import erhalten", () => {
    const data = { kaufUrl: "https://www.amazon.de/dp/B000000000?tag=cyberni7400-21", abschnittTitel: { zutaten: "Zutaten" }, kapitel: [{ id: "eins", titel: "Eins", html: "<p>x</p>", block: "zutaten" }], zutaten: [{ name: "A" }] };
    const r = importLayoutJson(JSON.stringify(data));
    expect(r.ok).toBe(true);
    if (r.ok) expect(draftToLayoutData(r.draft)).toMatchObject(data);
  });
  it("vollständig befülltes Formular besteht die Prüfung vor dem Veröffentlichen", () => {
    const p = parseLayoutData(draftToLayoutData(beispielDraft(5)));
    expect(p.ok).toBe(true);
    if (p.ok) expect(pruefeVorVeroeffentlichung(p.data, { bewertungsart: "ERGAENZUNGSFUTTER", totalScore: draftTotal(beispielDraft(5)) })).toEqual([]);
  });
});
