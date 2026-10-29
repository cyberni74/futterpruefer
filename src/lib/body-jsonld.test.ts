import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BODY_JSON_LD_SLUGS, bodyJsonLd } from "./body-jsonld";

const html = [
  '<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Ist das vegan?","acceptedAnswer":{"@type":"Answer","text":"Ja."}}]}</script>',
  '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"Vergleichstest"}</script>',
].join("");

describe("BODY_JSON_LD_SLUGS", () => {
  it("gibt FAQ der veganen Vergleichstests aus; Article rendert die Seite selbst", () => {
    for (const slug of ["veganes-hundefutter-test-oktober-2026", "veganes-katzenfutter-test-oktober-2026", "monoprotein-katzenfutter-test-2026"]) {
      expect(BODY_JSON_LD_SLUGS.has(slug)).toBe(true);
      const data = bodyJsonLd(slug, html);
      const types = (data?.["@graph"] as { "@type": string }[]).map((node) => node["@type"]);
      expect(types).toContain("FAQPage");
      expect(types).not.toContain("Article");
    }
    expect(bodyJsonLd("anderer-beitrag", html)).toBeNull();
  });

  it("Monoprotein-Katzenfutter: FAQPage und ItemList aus dem Beitrag, ohne zweite FAQPage", () => {
    const slug = "monoprotein-katzenfutter-test-2026";
    const stored = [
      '<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Welches Monoprotein-Katzenfutter ist gut?","acceptedAnswer":{"@type":"Answer","text":"GranataPet DeliCatessen Huhn PUR, 74 Punkte, Gelb."}}]}</script>',
      '<script type="application/ld+json">{"@context":"https://schema.org","@type":"ItemList","name":"Monoprotein-Katzenfutter im Test 2026","itemListElement":[{"@type":"ListItem","position":1,"name":"GranataPet DeliCatessen Huhn PUR"},{"@type":"ListItem","position":2,"name":"MjAMjAM Känguru pur"},{"@type":"ListItem","position":3,"name":"LEONARDO Rind pur"}]}</script>',
      '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"Vergleichstest"}</script>',
    ].join("");
    const data = bodyJsonLd(slug, stored);
    const graph = data?.["@graph"] as { "@type": string; name?: string; mainEntity?: { name: string }[]; itemListElement?: { name: string }[] }[];
    const types = graph.map((node) => node["@type"]);
    expect(types).toEqual(["FAQPage", "ItemList"]);
    expect(graph[0].mainEntity?.[0].name).toBe("Welches Monoprotein-Katzenfutter ist gut?");
    expect(graph[1].itemListElement?.map((item) => item.name)).toEqual(["GranataPet DeliCatessen Huhn PUR", "MjAMjAM Känguru pur", "LEONARDO Rind pur"]);
    const page = readFileSync(new URL("../app/(site)/blog/[slug]/page.tsx", import.meta.url), "utf8");
    const faqBlock = page.slice(page.indexOf("const BODY_FAQ_SLUGS"), page.indexOf("export async function generateStaticParams"));
    expect(faqBlock).not.toContain(slug);
    expect(faqBlock).toContain("monoprotein-futter");
  });

  it("gibt FAQ aus dem Beitragskörper für insektenarten-hundefutter-vergleich aus", () => {
    const page = readFileSync(new URL("../app/(site)/blog/[slug]/page.tsx", import.meta.url), "utf8");
    const faqBlock = page.slice(page.indexOf("const BODY_FAQ_SLUGS"), page.indexOf("export async function generateStaticParams"));
    expect(faqBlock).toContain('"insektenarten-hundefutter-vergleich"');
  });
});
