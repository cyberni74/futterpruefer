import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ClaimsCheck } from "./claims-check";
import type { Claim, ClaimRating } from "@/lib/product-data";

const claim = (text: string, rating: ClaimRating): Claim => ({ claim: text, rating, reason: "Einschätzung steht im Test.", legal: "", imageUrl: "" });

function badgeClass(html: string, label: string): string {
  const at = html.indexOf(`${label}</span>`);
  const start = html.lastIndexOf("<span", at);
  return html.slice(start, at).match(/class="([^"]+)"/)?.[1] ?? "";
}

describe("ClaimsCheck Stufen-Badges", () => {
  const claims = [
    claim("getreidefrei", "ZULAESSIG"),
    claim("regional", "PLAUSIBEL"),
    claim("Premium", "UNBELEGT"),
    claim("superfood", "FRAGWUERDIG"),
    claim("heilt", "UNZULAESSIG"),
  ];
  const html = renderToStaticMarkup(<ClaimsCheck claims={claims} brand="Beispielmarke" />);

  it("jede Stufe zeigt ihren eigenen Namen und ihre eigene Farbe", () => {
    expect(badgeClass(html, "Ohne Einwand")).toContain("bg-good-soft text-good");
    expect(badgeClass(html, "Plausibel")).toBe("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold bg-brand-soft text-brand");
    expect(badgeClass(html, "Unbelegt")).toBe("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold bg-bg-soft text-muted");
    expect(badgeClass(html, "Fragwürdig")).toContain("bg-mid-soft text-mid");
    expect(badgeClass(html, "Halten wir für irreführend")).toContain("bg-bad-soft text-bad");
    expect(badgeClass(html, "Unbelegt")).not.toContain("good");
    expect(badgeClass(html, "Plausibel")).not.toContain("good");
    expect(badgeClass(html, "Plausibel")).not.toContain("bg-bg-soft");
  });

  it("der Zähler zählt Unbelegt und Plausibel nicht als ohne Einwand", () => {
    expect(html).toContain("1 ohne Einwand, 1 plausibel, 1 unbelegt, 1 fragwürdig, 1 irreführend");
    expect(html).not.toContain("5 ohne Einwand");
    expect(html).not.toContain("3 ohne Einwand");
  });

  it("rahmt Aussagen mit inneren Anführungszeichen als Zitat im Zitat", () => {
    const text = "Datenfeld „Diättyp des Tierfutters: Roh“";
    const framed = "„Datenfeld ‚Diättyp des Tierfutters: Roh‘“";
    const html = renderToStaticMarkup(
      <ClaimsCheck
        claims={[{ ...claim(text, "UNBELEGT"), imageUrl: "/uploads/aussage.webp" }]}
        brand="Beispielmarke"
      />,
    );
    expect(html).toContain(`<p class="font-bold">${framed}</p>`);
    expect(html).toContain(`<th scope="row" class="p-3 font-bold">${framed}`);
    expect(html).toContain(`alt="Verpackungsfoto mit der Aussage ${framed}"`);
    expect(html.split(framed).length - 1).toBe(4);
    expect(html).not.toContain("„„");
    expect(html).not.toContain("““");
  });

  it("nennt Verpackung, Hersteller und Amazon-Listing für jede Marke", () => {
    expect(html).toContain("Geprüft haben wir Aussagen zu Beispielmarke auf der Verpackung, beim Hersteller und im Amazon-Listing. Wer die Angaben im Amazon-Listing eingetragen hat, ist uns nicht bekannt.");
    expect(html).not.toContain("auf der Verpackung und im Shop geprüft");
    expect(html).not.toContain("Die folgenden Sätze stehen im Amazon-Listing");
  });
});
