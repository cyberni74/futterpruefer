import { describe, expect, it } from "vitest";
import { toFieldErrors } from "./schemas";
import { lexikonFormToRaw, lexikonSchema, lexikonToEditorData } from "./lexikon";

const HERO = "https://cotopvhmsqztjtdsdnoc.supabase.co/storage/v1/object/public/bilder/was-sind-tierische-nebenerzeugnisse.webp";

function fd(overrides: Record<string, string | string[]> = {}) {
  const base: Record<string, string | string[]> = {
    name: "Taurin",
    slug: "taurin",
    synonyms: ["Taurine"],
    group: "Nährstoff",
    concern: "UNBEDENKLICH",
    shortDescription: "Aminosulfonsäure, die Katzen nur unzureichend selbst bilden.",
    assessment: "Für Katzen lebensnotwendig.",
    bodyHtml: "",
    headline: "",
    imageUrl: ["", "", "", "", ""],
    imageAlt: ["", "", "", "", ""],
    imageCaption: ["", "", "", "", ""],
    faqQuestion: [],
    faqAnswer: [],
    metaTitle: "",
    metaDescription: "",
    publishMode: "now",
    scheduledAt: "",
    ...overrides,
  };
  const data = new FormData();
  for (const [key, value] of Object.entries(base)) {
    if (Array.isArray(value)) value.forEach((item) => data.append(key, item));
    else data.set(key, value);
  }
  return data;
}

describe("lexikonSchema", () => {
  it("akzeptiert einen Alt-Eintrag ohne die neuen Felder", () => {
    const parsed = lexikonSchema.safeParse(lexikonFormToRaw(fd()));
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.headline).toBe("");
    expect(parsed.data.images).toEqual([]);
    expect(parsed.data.faqs).toEqual([]);
    expect(parsed.data.metaTitle).toBe("");
  });

  it("übernimmt SEO-Titel, H1, fünf Bilder und FAQ-Paare", () => {
    const parsed = lexikonSchema.safeParse(
      lexikonFormToRaw(
        fd({
          headline: "Tierische Nebenerzeugnisse im Hunde- und Katzenfutter",
          metaTitle: "Tierische Nebenerzeugnisse: Was das Etikett wirklich meint",
          metaDescription: "Was sind tierische Nebenerzeugnisse im Hunde- und Katzenfutter? Definition, Herstellung und was „davon 4 % Rind“ bedeutet.",
          imageUrl: [HERO, "/uploads/napf.webp", "", "", ""],
          imageAlt: ["Symbolbild: Zerlegeraum", "Symbolbild: Napf", "", "", ""],
          imageCaption: ["Am Anfang steht der Schlachthof. Bild: KI-generiert", "", "", "", ""],
          faqQuestion: ["Was sind tierische Nebenerzeugnisse?", ""],
          faqAnswer: ["Teil der Etikettenkategorie.", ""],
        }),
      ),
    );
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.images).toEqual([
      { url: HERO, alt: "Symbolbild: Zerlegeraum", caption: "Am Anfang steht der Schlachthof. Bild: KI-generiert" },
      { url: "/uploads/napf.webp", alt: "Symbolbild: Napf", caption: "" },
    ]);
    expect(parsed.data.faqs).toEqual([{ question: "Was sind tierische Nebenerzeugnisse?", answer: "Teil der Etikettenkategorie." }]);
  });

  it("verlangt Alt-Text und eine erlaubte URL, sobald ein Bild gesetzt ist", () => {
    const parsed = lexikonSchema.safeParse(lexikonFormToRaw(fd({ imageUrl: ["javascript:alert(1)"], imageAlt: [""], imageCaption: [""] })));
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    const errors = toFieldErrors(parsed.error);
    expect(errors.imageUrl0).toBeTruthy();
    expect(errors.imageAlt0).toBeTruthy();
  });

  it("liest gespeicherte Bilder und FAQs in den Editor zurück", () => {
    const data = lexikonToEditorData({
      id: "1",
      name: "Taurin",
      slug: "taurin",
      synonyms: [],
      group: "",
      concern: "UNBEDENKLICH",
      shortDescription: "",
      assessment: "",
      bodyHtml: "",
      headline: "Taurin im Katzenfutter",
      images: [{ url: HERO, alt: "Symbolbild: Taurin", caption: "Credit" }],
      faqs: [{ question: "Was ist Taurin?", answer: "Eine Aminosulfonsäure." }],
      metaTitle: "SEO",
      metaDescription: "Meta",
      status: "PUBLISHED",
      publishedAt: new Date("2026-01-01T10:00:00.000Z"),
    });
    expect(data.headline).toBe("Taurin im Katzenfutter");
    expect(data.images[0]).toEqual({ url: HERO, alt: "Symbolbild: Taurin", caption: "Credit" });
    expect(data.images).toHaveLength(5);
    expect(data.images[1].url).toBe("");
    expect(data.faqs).toEqual([{ question: "Was ist Taurin?", answer: "Eine Aminosulfonsäure." }]);
  });
});
