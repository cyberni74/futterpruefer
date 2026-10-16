import { describe, expect, it } from "vitest";
import { faqPageJsonLd } from "./faq-schema";

describe("faqPageJsonLd", () => {
  it("gibt nur echte Frage-Antwort-Paare aus", () => {
    expect(faqPageJsonLd([])).toBeNull();
    expect(faqPageJsonLd([{ question: "Nur Frage", answer: "  " }])).toBeNull();
    const data = faqPageJsonLd([
      { question: "Wie wird bewertet?", answer: "Nach 100 Punkten." },
      { question: "", answer: "Leer" },
    ]);
    expect(data?.["@type"]).toBe("FAQPage");
    expect(data?.mainEntity).toEqual([
      { "@type": "Question", name: "Wie wird bewertet?", acceptedAnswer: { "@type": "Answer", text: "Nach 100 Punkten." } },
    ]);
  });
});
