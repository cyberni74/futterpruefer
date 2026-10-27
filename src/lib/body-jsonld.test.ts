import { describe, expect, it } from "vitest";
import { BODY_JSON_LD_SLUGS, bodyJsonLd } from "./body-jsonld";

const html = [
  '<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Ist das vegan?","acceptedAnswer":{"@type":"Answer","text":"Ja."}}]}</script>',
  '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"Vergleichstest"}</script>',
].join("");

describe("BODY_JSON_LD_SLUGS", () => {
  it("gibt FAQ der veganen Vergleichstests aus; Article rendert die Seite selbst", () => {
    for (const slug of ["veganes-hundefutter-test-oktober-2026", "veganes-katzenfutter-test-oktober-2026"]) {
      expect(BODY_JSON_LD_SLUGS.has(slug)).toBe(true);
      const data = bodyJsonLd(slug, html);
      const types = (data?.["@graph"] as { "@type": string }[]).map((node) => node["@type"]);
      expect(types).toContain("FAQPage");
      expect(types).not.toContain("Article");
    }
    expect(bodyJsonLd("anderer-beitrag", html)).toBeNull();
  });
});
