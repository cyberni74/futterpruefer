// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { CostCalculator } from "./CostCalculator";
import { TestvorlageV2 } from "./TestvorlageV2";
import { beispielDaten } from "./fixtures";
import { faqItems, parseLayoutData, type LayoutData } from "./schema";
import { faqPageJsonLd } from "@/lib/faq-schema";
import { productReviewJsonLd, productSnippetIssues } from "@/lib/review-schema";

const ok = (n: 5 | 6) => {
  const { data, totalScore } = beispielDaten(n);
  const p = parseLayoutData(data);
  if (!p.ok) throw new Error(p.error);
  return { data: p.data, totalScore };
};
const html = (data: LayoutData, total: number) => renderToStaticMarkup(<TestvorlageV2 data={data} totalScore={total} ampelLabel="Empfehlenswert" />);

describe("TestvorlageV2: Server-Rendering", () => {
  it.each([5, 6] as const)("%s Kriterien: je eine Karte mit eigenem Maximum, kein H1, ein Haupttacho", (n) => {
    const { data, totalScore } = ok(n);
    const h = html(data, totalScore);
    expect((h.match(/class="metric"/g) ?? []).length).toBe(n);
    expect(h).not.toContain("<h1");
    expect((h.match(/gauge--large/g) ?? []).length).toBe(1);
    expect(h).toContain(`aria-label="${totalScore} von 100 Punkten"`);
    for (const k of data.kriterien!) expect(h).toContain(`aria-label="${k.punkte} von ${k.max} Punkten"`);
    expect(h).not.toContain("stroke-dasharray");
  });
  it("Hauptinhalt serverseitig: Akkordeons, Tabellen, FAQ, Quellen, Navigation", () => {
    const { data, totalScore } = ok(5);
    const h = html(data, totalScore);
    expect(h).toContain('<details class="ingredient">');
    expect(h).toContain('<details class="faq">');
    expect(h).toContain('class="data"');
    expect(h).toContain('aria-label="Inhaltsverzeichnis"');
    expect(h).toContain('href="#urteil"');
    expect(h).toContain("BELEGT");
    expect(h).toContain("NICHT VERIFIZIERT");
    expect(h).toContain('role="meter"');
  });
  it("Nummerierung der Kapitel und stabile IDs", () => {
    const { data, totalScore } = ok(5);
    const h = html(data, totalScore);
    expect(h).toContain("01 / URTEIL");
    expect(h).toContain("02 / KAPITEL");
    expect(h).toContain('id="erstes-kapitel"');
    expect(h).toContain('href="#erstes-kapitel"');
  });
  it("fehlende Blöcke werden nicht gerendert", () => {
    const h = html({ hero: { untertitel: "x" } }, 50);
    expect(h).not.toContain("Häufige Fragen");
    expect(h).not.toContain('class="metrics"');
    expect(h).not.toContain("Quellen");
  });
  it("Skript, style und Ereignis-Attribute in Rich-Text werden entfernt", () => {
    const h = html({ kapitel: [{ titel: "T", html: '<p onclick="x()" style="color:red">Text</p><script>alert(1)</script><img src="javascript:alert(1)">' }], fazit: { html: "<p>ok</p><script>x</script>" } }, 50);
    expect(h).not.toContain("<script");
    expect(h).not.toContain("onclick");
    expect(h).not.toContain("style=\"color");
    expect(h).toContain("Text");
  });
  it("Kauflink nur mit ASIN: tag, sponsored, target und Affiliate-Hinweis, oben nach der Gesamtwertung und unten bei den Quellen", () => {
    const { data, totalScore } = ok(5);
    const mit = html(data, totalScore);
    expect(mit).toContain("https://www.amazon.de/dp/B000000000?tag=cyberni7400-21");
    expect(mit).toContain('rel="sponsored nofollow noopener"');
    expect(mit).toContain('target="_blank"');
    expect(mit.match(/Jetzt bei Amazon entdecken\*/g)).toHaveLength(2);
    expect(mit.match(/\*Affiliate-Link: Wir erhalten bei einem Kauf eine Provision, der Preis ändert sich für Sie nicht\. Die Provision hat keinen Einfluss auf unsere Bewertung\./g)).toHaveLength(2);
    const heroEnde = mit.indexOf('class="stripe"');
    const oben = mit.slice(0, heroEnde);
    expect(oben).toContain("Jetzt bei Amazon entdecken*");
    expect(oben.indexOf('class="hero"')).toBeLessThan(oben.indexOf("Jetzt bei Amazon entdecken*"));
    const ohne = html({ ...data, asin: undefined }, totalScore);
    expect(ohne).not.toContain("amazon.de");
    expect(ohne).not.toContain("Affiliate-Link");
    expect(ohne).not.toContain("Jetzt bei Amazon entdecken*");
    const nurUrl = html({ ...data, asin: undefined, kaufUrl: "https://www.amazon.de/dp/B000000000?tag=cyberni7400-21" }, totalScore);
    expect(nurUrl.match(/Jetzt bei Amazon entdecken\*/g)).toHaveLength(1);
  });
  it("bei Ampel Rot steht der Hinweis an jedem Amazon-Button, ab Gelb nicht", () => {
    const { data } = ok(5);
    const rot = html(data, 59);
    expect(rot.match(/Unsere Bewertung: Rot; der Link ist keine Kaufempfehlung\./g)).toHaveLength(2);
    expect(html(data, 60)).not.toContain("keine Kaufempfehlung");
    expect(html(data, 80)).not.toContain("keine Kaufempfehlung");
    expect(html({ ...data, asin: undefined }, 40)).not.toContain("keine Kaufempfehlung");
  });
  it("externe Quellen: nofollow noopener noreferrer, DOI-Link", () => {
    const h = html(ok(5).data, 87);
    expect(h).toContain('rel="nofollow noopener noreferrer"');
    expect(h).toContain("https://doi.org/10.0000/beispiel");
  });
  it("Haupttacho zeigt die Gesamtwertung, die ef-Felder spielen keine Rolle", () => {
    const h = html(ok(5).data, 87);
    expect(h).toContain(">87<");
  });
});

describe("Hero nach Designsystem", () => {
  it("Branding, Kopf-Slot (H1, Badges) und Bewertungskarte stehen in der Hero-Fläche; genau eine H1", () => {
    const { data, totalScore } = ok(5);
    const h = renderToStaticMarkup(<TestvorlageV2 data={data} totalScore={totalScore} ampelLabel="Empfehlenswert" kopf={<><div className="hero-badges">Badge</div><h1>Titel</h1></>} />);
    const hero = h.slice(h.indexOf('class="hero"'), h.indexOf('class="stripe"'));
    expect(hero).toContain("Futterprüfer");
    expect(hero).toContain("<h1>Titel</h1>");
    expect(hero.indexOf("Futterprüfer")).toBeLessThan(hero.indexOf("<h1>"));
    expect(hero.indexOf("<h1>")).toBeLessThan(hero.indexOf("hero-lead"));
    expect(hero.indexOf("hero-lead")).toBeLessThan(hero.indexOf("score-card"));
    expect((h.match(/<h1/g) ?? []).length).toBe(1);
  });
  it("Kennzahlen: höchstens vier Karten, nichts wird erfunden", () => {
    expect(parseLayoutData({ kennzahlen: [1, 2, 3, 4, 5].map((n) => ({ wert: String(n), label: "L" })) }).ok).toBe(false);
    const h = html({ kennzahlen: [{ wert: "3", label: "A" }, { wert: "4", label: "B" }, { wert: "5", label: "C" }] }, 50);
    expect((h.match(/class="small-stat"/g) ?? []).length).toBe(3);
  });
  it("Inhaltsverzeichnis heißt „In diesem Test“", () => {
    expect(html(ok(5).data, 87)).toContain("In diesem Test");
  });
});

describe("FAQ und Schema", () => {
  it("sichtbare Fragen entsprechen 1:1 dem FAQPage-JSON-LD, genau ein Objekt", () => {
    const { data, totalScore } = ok(5);
    const ld = faqPageJsonLd(faqItems(data))!;
    expect(ld["@type"]).toBe("FAQPage");
    const h = html(data, totalScore);
    const sichtbar = [...h.matchAll(/<summary>([^<]*)<\/summary><p>([^<]*)<\/p>/g)].map((m) => [m[1], m[2]]).filter(([q]) => /\?$/.test(q));
    expect(sichtbar).toEqual(ld.mainEntity.map((q) => [q.name, q.acceptedAnswer.text]));
  });
  it("ohne FAQ kein Schema", () => {
    expect(faqPageJsonLd(faqItems({}))).toBeNull();
  });
  it("Product mit reviewRating (Skala 0 bis 100), ohne aggregateRating (eine redaktionelle Wertung)", () => {
    const j = productReviewJsonLd(
      { brand: "Marke", productName: "Produkt", categoryName: "Kat", totalScore: 87, verdict: "Urteil", publishedAt: null, updatedAt: new Date(), authorSlug: null, images: [], pros: ["a", "b"], cons: ["c", "d"] },
    ) as unknown as { review: { reviewRating: Record<string, unknown> } };
    expect(j.review.reviewRating).toMatchObject({ ratingValue: 87, bestRating: 100, worstRating: 0 });
    expect(JSON.stringify(j)).not.toContain("aggregateRating");
    expect(productSnippetIssues(j as never)).toEqual([]);
  });
  it("V2-Seite gibt kein aggregateRating aus (Googles Regel zu selbst ausgestellten Bewertungen)", () => {
    const src = readFileSync(resolve(__dirname, "../../app/(site)/[kategorie]/v2-article.tsx"), "utf8");
    expect(src).not.toMatch(/aggregateRating/);
  });
  it("klassische Seiten behalten kein aggregateRating", () => {
    const j = productReviewJsonLd({ brand: "M", productName: "P", categoryName: "K", totalScore: 70, verdict: "", publishedAt: null, updatedAt: new Date(), authorSlug: null, images: [], pros: [], cons: [] });
    expect(JSON.stringify(j)).not.toContain("aggregateRating");
  });
});

describe("CostCalculator (Client)", () => {
  let root: Root | null = null;
  let host: HTMLDivElement | null = null;
  beforeAll(() => { (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true; });
  afterEach(() => { act(() => root?.unmount()); host?.remove(); });
  const setze = (el: HTMLInputElement | HTMLSelectElement, wert: string) => {
    const proto = el instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    act(() => {
      Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, wert);
      el.dispatchEvent(new Event(el instanceof HTMLSelectElement ? "change" : "input", { bubbles: true }));
    });
  };
  const text = (id: string) => host!.querySelector(`[data-testid="${id}"]`)!.textContent!.replace(/ /g, " ");

  it("rechnet und reagiert auf Preis, Körpergewicht und Zeitraum (Komma und Punkt)", () => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    act(() => root!.render(<CostCalculator preis={30} inhalt={120} einheit="STUECK" dosisProKg={0.4} koerpergewicht={10} tage={30} />));
    expect(text("teilkosten")).toBe("30,00 €");
    expect(text("packungen")).toBe("1");
    expect(text("tagesdosis")).toBe("4 Stück");
    const [preis, kg] = [...host.querySelectorAll("input")] as HTMLInputElement[];
    setze(preis, "24,50");
    expect(text("kaufpreis")).toBe("24,50 €");
    setze(kg, "20");
    expect(text("packungen")).toBe("2");
    expect(text("kaufpreis")).toBe("49,00 €");
    setze(kg, "20.5");
    expect(text("tagesdosis")).toBe("8,2 Stück");
    setze(host.querySelector("select")!, "7");
    expect(text("packungen")).toBe("1");
    setze(preis, "");
    expect(text("teilkosten")).toBe("–");
  });
  it("Felder haben Beschriftungen (Tastatur und Screenreader)", () => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    act(() => root!.render(<CostCalculator preis={30} inhalt={120} einheit="GRAMM" dosisProKg={1} koerpergewicht={10} tage={30} />));
    for (const el of host.querySelectorAll("input,select")) expect(host.querySelector(`label[for="${el.id}"]`)).not.toBeNull();
    expect(host.querySelector('[aria-live="polite"]')).not.toBeNull();
  });
});
