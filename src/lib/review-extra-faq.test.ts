import { describe, expect, it } from "vitest";
import { REVIEW_EXTRA_FAQ, reviewH1 } from "./review-extra-faq";
import { reviewFaq, type ReviewSeoInput } from "./review-seo";
import { faqPageJsonLd } from "./faq-schema";

const base: ReviewSeoInput = { name: "Leonardo Adult GF Poultry", totalScore: 80, testedAt: new Date("2026-10-20T10:00:00Z"), verdict: "Fast grün", pros: ["Viel Geflügel"], cons: ["Werbeaussagen ohne Beleg"], claims: [], ergaenzung: false };

describe("Zusatz-FAQ pro Test", () => {
  it("steht nach der ersten Frage, in Akkordeon-Liste und JSON-LD wortgleich", () => {
    const faq = reviewFaq({ ...base, slug: "leonardo-adult-gf-poultry-test" });
    const extra = REVIEW_EXTRA_FAQ["leonardo-adult-gf-poultry-test"];
    expect(extra).toHaveLength(2);
    expect(faq[0].question).toBe("Wie schneidet Leonardo Adult GF Poultry im Test ab?");
    expect(faq.slice(1, 3)).toEqual(extra);
    expect(faq[1].question).toBe("Ist Leonardo Adult GF Poultry das beste Trockenfutter für Katzen?");
    expect(faq[2].question).toBe("Ist Leonardo Adult GF Poultry getreidefrei und ohne Zucker?");
    const ld = faqPageJsonLd(faq);
    expect(ld?.mainEntity.slice(1, 3).map((q) => [q.name, q.acceptedAnswer.text])).toEqual(extra.map((e) => [e.question, e.answer]));
  });

  it("lässt andere Tests unverändert", () => {
    const ohne = reviewFaq(base);
    const andere = reviewFaq({ ...base, slug: "irgendein-anderer-test" });
    expect(andere).toEqual(ohne);
    expect(ohne.some((q) => q.question.includes("beste Trockenfutter"))).toBe(false);
  });
});

describe("reviewH1", () => {
  it("ersetzt nur den H1-Text des Tests mit Eintrag", () => {
    expect(reviewH1("leonardo-adult-gf-poultry-test", "Leonardo Adult GF Poultry")).toBe("Leonardo Adult GF Poultry im Test: getreidefreies Trockenfutter für Katzen");
    expect(reviewH1("anderer-test", "Anderes Futter")).toBe("Anderes Futter im Test");
  });
});
