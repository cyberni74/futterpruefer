import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { alterAusPosition, alterText, ALTER_MAX } from "@/lib/futterrechner/state";
import { hundKgAusPos, hundPosAusKg } from "@/lib/futterrechner/bereiche";
import { sliderText } from "./slider-text";
import { ValueSlider } from "./value-slider";

const text = (html: string, attr: string) => {
  const m = html.match(new RegExp(`<span[^>]*${attr}[^>]*>([\\s\\S]*?)</span>`));
  return m ? m[1].replace(/<[^>]+>/g, "").trim() : null;
};

describe("Wert-Blase == Anzeige", () => {
  it("Alter Hund: Blase zeigt dieselbe Zeit wie die Anzeige, nie die nackte Position", () => {
    for (let pos = 0; pos <= ALTER_MAX.hund; pos++) {
      const html = renderToStaticMarkup(
        <ValueSlider id="a" label="Alter" einheit="" value={pos} onChange={() => {}} min={0} max={ALTER_MAX.hund} step={1} platzhalter={49} textAnzeige={(p) => alterText(alterAusPosition("hund", p))} blaseSichtbar />,
      );
      const erwartet = alterText(alterAusPosition("hund", pos));
      expect(text(html, "data-blase")).toBe(erwartet);
      expect(text(html, "data-anzeige")).toBe(erwartet);
    }
  });
  it("Alter: Position 4 ist 12 Wochen (nicht „4“ oder „44“)", () => {
    const html = renderToStaticMarkup(
      <ValueSlider id="a" label="Alter" einheit="" value={4} onChange={() => {}} min={0} max={ALTER_MAX.hund} step={1} platzhalter={49} textAnzeige={(p) => alterText(alterAusPosition("hund", p))} blaseSichtbar />,
    );
    expect(text(html, "data-blase")).toBe("12 Wochen");
  });
  it("Alter Katze: Monate und Jahre", () => {
    expect(sliderText(3, { step: 1, einheit: "", textAnzeige: (p) => alterText(alterAusPosition("katze", p)) })).toBe("5 Monate");
    expect(sliderText(13, { step: 1, einheit: "", textAnzeige: (p) => alterText(alterAusPosition("katze", p)) })).toBe("3 Jahre");
  });
  it("Gewicht (zweistufige Skala): Blase zeigt kg, nicht die Position", () => {
    for (const kg of [0.5, 5, 10, 11, 40, 80]) {
      const pos = hundPosAusKg(kg);
      expect(hundKgAusPos(pos)).toBe(kg);
      const html = renderToStaticMarkup(
        <ValueSlider id="g" label="Gewicht" einheit="kg" value={kg} onChange={() => {}} min={0.5} max={80} step={0.5} platzhalter={15} skala={{ max: 89, zuPos: hundPosAusKg, vonPos: hundKgAusPos }} blaseSichtbar />,
      );
      expect(text(html, "data-blase")).toBe(sliderText(kg, { step: 0.5, einheit: "kg" }));
    }
  });
  it("Nährwerte und Katzengewicht: Zahl und Einheit", () => {
    const html = renderToStaticMarkup(<ValueSlider id="p" label="Rohprotein" einheit="%" value={25.5} onChange={() => {}} min={10} max={45} step={0.5} platzhalter={24} blaseSichtbar />);
    expect(text(html, "data-blase")).toBe("25,5 %");
    const k = renderToStaticMarkup(<ValueSlider id="k" label="Gewicht" einheit="kg" value={4.5} onChange={() => {}} min={1} max={10} step={0.1} platzhalter={4.5} blaseSichtbar />);
    expect(text(k, "data-blase")).toBe("4,5 kg");
  });
  it("Blase liegt im reservierten Platz über dem Regler (kein Überdecken von Label und Eingabefeld)", () => {
    const html = renderToStaticMarkup(<ValueSlider id="p" label="Rohprotein" einheit="%" value={25} onChange={() => {}} min={10} max={45} step={0.5} platzhalter={24} blaseSichtbar />);
    expect(html).toContain("mt-7");
    expect(html).toContain("-top-7");
    expect(html).toContain("clamp(");
  });
});
