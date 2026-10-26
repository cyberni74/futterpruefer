import type { FaqItem } from "./review-seo";

/**
 * Zusätzliche Fragen für einzelne Tests. Sie stehen direkt nach der ersten Frage („Wie schneidet … im Test ab?“)
 * und kommen aus derselben Liste für den Akkordeon und das FAQPage-JSON-LD, der Text ist also identisch.
 * Der Stand in den Antworten gehört zum Datum im Text; bei geänderter Wertung bitte neu prüfen.
 */
export const REVIEW_EXTRA_FAQ: Record<string, FaqItem[]> = {
  "leonardo-adult-gf-poultry-test": [
    {
      question: "Ist Leonardo Adult GF Poultry das beste Trockenfutter für Katzen?",
      answer:
        "Unter den Katzen-Trockenfuttern, die wir bisher getestet haben, hat es mit 80 von 100 Punkten die höchste Wertung (Stand 26.10.2026), genau an der Grenze zu Grün. Punkte verliert es unter anderem für Werbeaussagen wie „Stay-Clean“, „PH-Control“ und „Provital“, die auf der Herstellerseite nicht belegt werden, und für Kartoffelstärke und Erbsenmehl ohne Mengenangabe.",
    },
    {
      question: "Ist Leonardo Adult GF Poultry getreidefrei und ohne Zucker?",
      answer:
        "Getreide steht nicht in der Zusammensetzung. Als Kohlenhydratquellen sind Amaranth (15 %), Kartoffelstärke und Erbsenmehl deklariert. Zucker ist nicht als Zutat genannt.",
    },
  ],
};

/** Eigene H1 für einzelne Tests (nur der sichtbare Überschriftentext; Name für Schema, Breadcrumb, FAQ und Fazit bleibt unverändert). */
export const REVIEW_H1: Record<string, string> = {
  "leonardo-adult-gf-poultry-test": "Leonardo Adult GF Poultry im Test: getreidefreies Trockenfutter für Katzen",
};

export function reviewH1(slug: string, name: string): string {
  return REVIEW_H1[slug] ?? `${name} im Test`;
}
