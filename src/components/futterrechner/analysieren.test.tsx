import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { berechne } from "@/lib/futterrechner";
import { RISIKO_PFLICHTZEILE } from "@/lib/futterrechner/risiken";
import { startState } from "@/lib/futterrechner/state";
import { pruefe } from "@/lib/futterrechner/validierung";
import type { FutterInput, TierInput } from "@/lib/futterrechner/types";
import { ChipGroup } from "./chip-group";
import { ErgebnisKarte } from "./ergebnis-karte";
import { ValueSlider } from "./value-slider";

const t1: FutterInput = { typ: "trocken", p: 25, f: 14, fa: 2.5, a: 7, m: 10, ca: 1.3, ph: 0.95 };
const t7: FutterInput = { typ: "trocken", p: 15, f: 4.5, fa: 4, a: 9.5, m: 10, ca: 2.4, ph: 0.8 };
const hund: TierInput = { art: "hund", gewicht: 20, phase: "adult", alter: "adult", aktiv: "normal" };
const wenig: TierInput = { art: "hund", gewicht: 15, phase: "adult", alter: "adult", aktiv: "wenig" };

const karte = (futter: FutterInput, tier: TierInput, analysiert: boolean, ergaenzung = false) =>
  renderToStaticMarkup(
    <ErgebnisKarte
      titel="Nährwert-Check Hund" ergebnis={berechne({ futter, tier, ergaenzung })} nochFehlt={[]} onTeilen={() => {}} geteilt=""
      analysiert={analysiert} bereit art="hund"
    />,
  );

describe("Jetzt Futter analysieren", () => {
  it("unvollständige Eingabe: kein Ergebnis, Pflichtfelder fehlen", () => {
    const p = pruefe(startState("hund", "trocken"));
    expect(p.eingabe).toBeNull();
    expect(p.fehlend).toEqual(expect.arrayContaining(["Rohprotein", "Rohfett", "Rohfaser", "Rohasche", "Gewicht", "Alter"]));
  });
  it("vor dem Klick zeigt die Karte kein Ergebnis", () => {
    const html = karte(t1, hund, false);
    expect(html).not.toContain("SEHR GUT");
    expect(html).not.toContain("Warum?");
    expect(html).toContain("Jetzt Futter analysieren");
  });
  it("nach dem Klick erscheint das Ergebnis", () => {
    const html = karte(t1, hund, true);
    expect(html).toContain("Warum?");
    expect(html).toContain("sehr gut");
  });
  it("fehlende Angabe: Hinweis am Feld, aria-invalid, Rahmen in Akzentfarbe", () => {
    const html = renderToStaticMarkup(
      <ValueSlider id="fld-p" fehlt label="Rohprotein" einheit="%" value={null} onChange={() => {}} min={10} max={45} step={0.5} platzhalter={24} />,
    );
    expect(html).toContain("Hier fehlt noch Ihre Angabe");
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain("ring-accent");
    expect(html).toContain('id="fld-p-r"');
    const ohne = renderToStaticMarkup(<ValueSlider id="fld-p" label="Rohprotein" einheit="%" value={25} onChange={() => {}} min={10} max={45} step={0.5} platzhalter={24} />);
    expect(ohne).not.toContain("Hier fehlt noch Ihre Angabe");
  });
  it("Chip-Gruppe mit fehlender Angabe ist beschriftet und beschreibt sich selbst", () => {
    const html = renderToStaticMarkup(<ChipGroup legend="Aktivität" id="fld-aktivitaet" fehlt value={null} onChange={() => {}} options={[{ value: "a", label: "A" }]} />);
    expect(html).toContain("Hier fehlt noch Ihre Angabe");
    expect(html).toContain('aria-describedby="fld-aktivitaet-hinweis"');
  });
});

describe("Mögliche Folgen in der Ergebnis-Karte", () => {
  it("T1: nur die Mengen-Box, keine rote oder gelbe Folgen-Box", () => {
    const html = karte(t1, hund, true);
    expect(html).not.toContain("fp-warn");
    expect(html).toContain("fp-merk");
    expect(html).toContain("Gut zu wissen");
    expect(html.split(RISIKO_PFLICHTZEILE).length - 1).toBe(1);
  });
  it("T7: gelbe Protein-Box eingeklappt, rote Calcium-Box offen; Pflichtzeile genau einmal", () => {
    const html = karte(t7, wenig, true);
    expect(html).toContain('data-risiko="R-P-HUND-GERING"');
    expect(html).toContain('data-risiko="R-CA-HOCH-HUND"');
    const protein = html.slice(html.indexOf('data-risiko="R-P-HUND-GERING"'));
    expect(protein.slice(0, protein.indexOf("</details>"))).toContain("<details>");
    const ca = html.slice(html.indexOf('data-risiko="R-CA-HOCH-HUND"'));
    expect(ca.slice(0, 700)).not.toContain("<details>");
    expect(html.split(RISIKO_PFLICHTZEILE).length - 1).toBe(1);
  });
  it("Ergänzungsfutter: R-LECKERLI unter dem Budget", () => {
    const html = karte({ typ: "trocken", p: 30, f: 12, fa: 2, a: 7, m: 18 }, hund, true, true);
    expect(html).toContain('data-risiko="R-LECKERLI"');
    expect(html).toContain("Leckerli-Budget");
  });
  it("Quellen sind verlinkt, Lösungen verlinken eigene Seiten", () => {
    const html = karte(t7, wenig, true);
    expect(html).toContain('href="https://doi.org/');
    expect(html).toContain('href="/alleinfuttermittel-hund"');
    expect(html).toContain('rel="noopener noreferrer"');
  });
  it("Fazit-Box bleibt ohne Freigabe unsichtbar", () => {
    expect(karte(t1, hund, true)).not.toContain("Unser Fazit");
  });
});
