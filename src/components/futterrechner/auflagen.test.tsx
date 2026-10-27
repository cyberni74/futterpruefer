import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { berechne } from "@/lib/futterrechner";
import type { ErgebnisOk, FutterInput, TierInput } from "@/lib/futterrechner/types";
import { NOTE_ABGRENZUNG, gewichtungSatz } from "@/lib/futterrechner/texte";
import { QUELLEN, FAQ_HUND, FAQ_KATZE } from "@/lib/futterrechner/seo";
import { ErgebnisKarte, vorlesetext } from "./ergebnis-karte";
import { ErgebnisLeiste } from "./ergebnis-leiste";
import { SeoHund } from "./seo-hund";
import { SeoKatze } from "./seo-katze";
import { QuellenUndAutor } from "./faq-quellen";

const H20: TierInput = { art: "hund", gewicht: 20, phase: "adult", alter: "adult", aktiv: "normal" };
const KW: TierInput = { art: "katze", gewicht: 4.5, phase: "adult", aktiv: "wohnung", kastriert: true };
const T1: FutterInput = { typ: "trocken", p: 25, f: 14, fa: 2.5, a: 7, m: 10, ca: 1.3, ph: 0.95 };
const T5: FutterInput = { typ: "nass", p: 11, f: 5.5, fa: 0.4, a: 2.0, m: 80, ca: 0.3, ph: 0.22, taurinMgKg: 1000 };
const T11: FutterInput = { typ: "nass", p: 11.5, f: 2.4, fa: 0.3, a: 2.5, m: 82, ca: 0.42, ph: 0.3, taurinMgKg: 500 };
const T12: FutterInput = { ...T11, zutaten: "Fleisch und tierische Nebenerzeugnisse (davon 4 % Huhn), pflanzliche Eiweißextrakte, Fisch und Fischnebenerzeugnisse, Mineralstoffe, Zucker" };
const T13: FutterInput = { typ: "nass", p: 10.5, f: 5.5, fa: 0.5, a: 2.0, m: 78 };
const T18: FutterInput = { typ: "trocken", p: 22, f: 22, fa: 3, a: 7, m: 10, ca: 1.2, ph: 0.9 };

const rechne = (futter: FutterInput, tier: TierInput, opt = {}) => berechne({ futter, tier }, opt) as ErgebnisOk;
const karte = (futter: FutterInput, tier: TierInput, art: "hund" | "katze", ergaenzung = false) =>
  renderToStaticMarkup(
    <ErgebnisKarte titel="Nährwert-Check" ergebnis={berechne({ futter, tier, ergaenzung })} nochFehlt={[]} onTeilen={() => {}} geteilt="" analysiert bereit art={art} />,
  );
const grund = (r: ErgebnisOk, id: string) => r.gruende.find((g) => g.id === id);

describe("A7: Satz direkt an der Note", () => {
  it.each([["Hund", T1, H20, "hund"], ["Katze", T5, KW, "katze"]] as const)("%s: Satz steht direkt nach dem Notenwort", (_n, futter, tier, art) => {
    const html = karte(futter, tier, art);
    const note = rechne(futter, tier).note;
    expect(html).toMatch(new RegExp(`${note}</span></div><p[^>]*>${NOTE_ABGRENZUNG}</p><p[^>]*>Diese Note bewertet nur die Nährwerte`));
    expect(html).not.toMatch(/<p[^>]*text-muted[^>]*>Nährwert-Note, kein Testurteil/);
  });
  it("Vorlesetext enthält den Satz", () => {
    expect(vorlesetext(berechne({ futter: T1, tier: H20 }))).toContain(NOTE_ABGRENZUNG);
    expect(vorlesetext(berechne({ futter: T5, tier: KW }))).toContain(NOTE_ABGRENZUNG);
  });
  it("Leiste mit Note zeigt den Satz", () => {
    const html = renderToStaticMarkup(<ErgebnisLeiste ergebnis={berechne({ futter: T1, tier: H20 })} nochFehlt={0} sichtbar bereit />);
    expect(html).toContain(NOTE_ABGRENZUNG);
  });
  it("Ergänzungsfutter und Snack: kein Satz", () => {
    expect(karte(T1, H20, "hund", true)).not.toContain(NOTE_ABGRENZUNG);
    expect(renderToStaticMarkup(<ErgebnisLeiste ergebnis={berechne({ futter: T1, tier: H20, ergaenzung: true })} nochFehlt={0} sichtbar bereit />)).not.toContain(NOTE_ABGRENZUNG);
    expect(vorlesetext(berechne({ futter: T1, tier: H20, ergaenzung: true }))).toBe("");
  });
});

describe("A1: Untergrenze und Erklärzeile", () => {
  it("T18 mit Untergrenze: 60, Erklärzeile direkt nach pf mit Fett-Anteil als ganzer Zahl", () => {
    const r = rechne(T18, H20, { untergrenze: true });
    expect(r.score).toBe(60);
    expect(r.untergrenzeGegriffen).toBe(true);
    const i = r.gruende.findIndex((g) => g.id === "pf");
    expect(r.gruende[i + 1].id).toBe("untergrenze");
    expect(r.gruende[i + 1].art).toBe("info");
    expect(r.gruende[i + 1].text).toBe("Alle FEDIAF-Mindestwerte sind erfüllt. Die Energie kommt aber zu einem großen Teil aus Fett (48 %), deshalb nur „ausreichend“.");
  });
  it("ohne Untergrenze und bei Futter über 60 keine Erklärzeile", () => {
    expect(grund(rechne(T18, H20, { untergrenze: false }), "untergrenze")).toBeUndefined();
    expect(grund(rechne(T1, H20, { untergrenze: true }), "untergrenze")).toBeUndefined();
    expect(rechne(T18, H20, { untergrenze: false }).fediafKonform).toBe(true);
  });
});

describe("A3–A5: Kollagen-Hinweise", () => {
  it("Sammelbegriffe: nie Abzugszeile, nie K2, nur K2-Zusatz (T12) und K1", () => {
    for (const opt of [{ abzugAktiv: false }, { abzugAktiv: true, stufe1Max: 3 }]) {
      const r = rechne(T12, KW, opt);
      const g = grund(r, "kollagen")!;
      expect(g.titel).toBe("Hinweis zur Proteinqualität (nach Ihren Zutatenangaben)");
      expect(g.text).not.toContain("steht „");
      expect(g.text.indexOf("„Tierische Nebenerzeugnisse“ ist ein Sammelbegriff.")).toBe(0);
      expect(g.text.indexOf("Ihr Futter hat viel Rohprotein (")).toBeGreaterThan(0);
      expect(r.kollagen.abzugZutaten).toBe(0);
      expect(renderToStaticMarkup(<ErgebnisKarte titel="x" ergebnis={r} nochFehlt={[]} onTeilen={() => {}} geteilt="" analysiert bereit art="katze" />)).not.toContain("in den ersten fünf Zutaten (Ihre Angabe)");
    }
  });
  it("K1: ganze Zahlen, fett „kann“, Titel nach den Nährwerten", () => {
    const g = grund(rechne(T11, KW), "kollagen")!;
    expect(g.titel).toBe("Hinweis zur Proteinqualität (nach den Nährwerten)");
    expect(g.text).toMatch(/^Ihr Futter hat viel Rohprotein \(64 % der Trockenmasse\) und zugleich viel Rohasche \(14 %\)\. Das \*\*kann\*\* darauf hindeuten/);
    expect(g.text).toContain("**Was Sie tun können:**");
  });
  it("MEHL_SATZ nur bei „mehl“, kein doppeltes Leerzeichen", () => {
    const mit = grund(rechne({ ...T13, zutaten: "Knochenmehl, Wasser, Reis" }, H20), "kollagen")!.text;
    const ohne = grund(rechne({ ...T13, zutaten: "Rinderknorpel, Wasser, Reis" }, H20), "kollagen")!.text;
    expect(mit).toContain("ausgeschmolzene Tiermehle");
    expect(ohne).not.toContain("ausgeschmolzene Tiermehle");
    expect(mit).not.toMatch(/ {2}/);
    expect(ohne).not.toMatch(/ {2}/);
    expect(mit).toContain("steht „Knochenmehl“.");
    expect(ohne).toContain("(Paul et al. 2019). Im fertigen Futter");
  });
  it("Reihenfolge K2, K2-Zusatz, K1", () => {
    const t = grund(rechne({ ...T11, zutaten: "Rinderknorpel, Nebenerzeugnisse" }, KW), "kollagen")!.text;
    const a = t.indexOf("steht „Rinderknorpel“");
    const b = t.indexOf("ist ein Sammelbegriff");
    const c = t.indexOf("Ihr Futter hat viel Rohprotein");
    expect(0 <= a && a < b && b < c).toBe(true);
  });
  it("Abzugszeilen nur bei Abzug > 0", () => {
    const f = { ...T13, zutaten: "Kaninchen (Luftröhre), Rinderknorpel, Karotte" };
    const aus = renderToStaticMarkup(<ErgebnisKarte titel="x" ergebnis={berechne({ futter: f, tier: H20 })} nochFehlt={[]} onTeilen={() => {}} geteilt="" analysiert bereit art="hund" />);
    expect(aus).not.toContain("Punkte:");
    const an = renderToStaticMarkup(<ErgebnisKarte titel="x" ergebnis={berechne({ futter: f, tier: H20 }, { abzugAktiv: true })} nochFehlt={[]} onTeilen={() => {}} geteilt="" analysiert bereit art="hund" />);
    expect(an).toContain("−6 Punkte: Luftröhre, Rinderknorpel in den ersten fünf Zutaten (Ihre Angabe)");
  });
});

describe("A6: Gewichtung offenlegen", () => {
  const BASIS = "Das Protein-Fett-Verhältnis ist unsere eigene Gewichtung. Sie orientiert sich an der Beute von Wolf und verwilderter Katze (Bosch et al. 2015; Plantinga et al. 2011). FEDIAF nennt dafür keinen Grenzwert. Hunde selbst wählen bei freier Wahl eher fettreich (Hewson-Hughes et al. 2013).";
  const LETZTER = " Futter, die alle FEDIAF-Mindestwerte erfüllen, bekommen deshalb mindestens „ausreichend“.";
  it("beide Fassungen des Pflichtsatzes", () => {
    expect(gewichtungSatz(false)).toBe(BASIS);
    expect(gewichtungSatz(true)).toBe(BASIS + LETZTER);
  });
  it("steht in Hund, Katze und (mit Schalter an) mit dem letzten Satz", () => {
    expect(renderToStaticMarkup(<SeoHund />)).toContain(BASIS + LETZTER);
    expect(renderToStaticMarkup(<SeoKatze />)).toContain(BASIS + LETZTER);
  });
  it("FAQ nennt das Verhältnis von Protein zu Fett; „schmackhaft, aber energie- und fettlastig“ nirgends", () => {
    const faq = [...FAQ_HUND, ...FAQ_KATZE].map((f) => f.antwort).join(" ");
    expect(faq).toContain("und nach dem Verhältnis von Protein zu Fett");
    expect(renderToStaticMarkup(<SeoHund />)).not.toContain("fettlastig");
  });
});

describe("A8: Quellenblock", () => {
  it("Paul, Shirley, Cramer mit Hinweisen; kein Kazimierska; kein „83 %“", () => {
    const t = QUELLEN.map((q) => q.text).join("\n");
    expect(t).toContain("doi:10.3390/nu11051079 (PDCAAS ist ein Bewertungsmaß aus der menschlichen Ernährung)");
    expect(t).toContain("doi:10.1093/ps/80.5.626 (Versuche an Geflügel, nicht an Hund oder Katze)");
    expect(t).toContain("doi:10.2527/jas.2006-225 (Versuche an Geflügel, nicht an Hund oder Katze)");
    expect(t).toMatch(/Bosch/); expect(t).toMatch(/Plantinga/); expect(t).toMatch(/Hewson-Hughes A\. K\. et al\. \(2011\)/); expect(t).toMatch(/\(2013\)/);
    expect(t).not.toMatch(/Kazimierska/);
    expect(renderToStaticMarkup(<QuellenUndAutor />)).not.toMatch(/83 %/);
  });
});

describe("Sperrwörter", () => {
  const dir = join(__dirname, "../../lib/futterrechner");
  const dateien = [join(dir, "texte.ts"), join(dir, "fazit-texte.ts"), join(dir, "risiken-daten.ts"), join(dir, "seo.ts")];
  for (const f of readdirSync(__dirname)) if (/\.tsx?$/.test(f) && !/\.test\./.test(f)) dateien.push(join(__dirname, f));
  for (const f of readdirSync(join(__dirname, "infografiken"))) if (/\.tsx?$/.test(f)) dateien.push(join(__dirname, "infografiken", f));
  // Testvorlage V2: sichtbare Komponenten, Beispieldaten und Admin-Maske (schema.ts enthält die Sperrliste selbst und ist ausgenommen)
  const tv2 = join(__dirname, "../testvorlage-v2");
  for (const f of readdirSync(tv2)) if (/\.tsx?$/.test(f) && !/\.test\./.test(f) && f !== "schema.ts") dateien.push(join(tv2, f));
  dateien.push(join(__dirname, "../admin/testvorlage-editor.tsx"), join(__dirname, "../../styles/testvorlage-v2.css"));
  it.each(dateien.map((d) => [d.split("/src/")[1], d]))("%s", (_n, d) => {
    const s = readFileSync(d, "utf-8");
    expect(s).not.toMatch(/unzulässig|zulässig|rechtlich angreifbar|betrug/i);
    // „unabhängig“ nur dort, wo es sichtbar auf uns bezogen ist
    expect(s).not.toMatch(/(wir|uns|futterprüfer)[^.\n]{0,60}unabhängig|unabhängig[^.\n]{0,60}(unsere|wir|futterprüfer)/i);
  });
});
