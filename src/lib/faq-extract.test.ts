import { describe, expect, it } from "vitest";
import { extractFaq } from "./faq-extract";
import { faqPageJsonLd } from "./faq-schema";

const BODY = `<p>Einleitung</p>
<h2 id="faq">Häufige Fragen</h2>
<h3>Ist Fischmehl schlecht für die Meere?</h3>
<p>Das hängt vom Bestand ab (Q2). Ohne Angabe lässt es sich nicht beurteilen.</p>
<h3>Garantiert das MSC-Siegel &amp; Co. keinen Beifang?</h3>
<p>Nein. <strong>Beifang</strong> ganz ausschließen kann er nicht.</p>

<p>Fazit: Dieser Absatz gehört nicht zur FAQ.</p>
<div class="fp-quellen"><h2 id="quellen">Quellen</h2><h3>Q1</h3><p>Nicht zur FAQ.</p></div>`;

describe("extractFaq", () => {
  it("liest H3-Fragen mit dem direkt folgenden Absatz und lässt Fazit und Quellen weg", () => {
    expect(extractFaq(BODY)).toEqual([
      { question: "Ist Fischmehl schlecht für die Meere?", answer: "Das hängt vom Bestand ab (Q2). Ohne Angabe lässt es sich nicht beurteilen." },
      { question: "Garantiert das MSC-Siegel & Co. keinen Beifang?", answer: "Nein. Beifang ganz ausschließen kann er nicht." },
    ]);
  });

  it("liefert nichts ohne Abschnitt „Häufige Fragen“ oder ohne HTML", () => {
    expect(extractFaq("<h2>Andere Überschrift</h2><h3>Frage?</h3><p>Antwort.</p>")).toEqual([]);
    expect(extractFaq(null)).toEqual([]);
    expect(faqPageJsonLd(extractFaq(""))).toBeNull();
  });

  it("ergibt FAQPage-JSON-LD mit genau dem sichtbaren Text", () => {
    const ld = faqPageJsonLd(extractFaq(BODY));
    expect(ld?.mainEntity).toHaveLength(2);
    expect(ld?.mainEntity[1].acceptedAnswer.text).toBe("Nein. Beifang ganz ausschließen kann er nicht.");
  });
});
