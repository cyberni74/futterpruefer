import { describe, expect, it, vi } from "vitest";
import { berlinLocalToDate, dateToBerlinLocal } from "./datetime";
import { initialPublishMode, resolvePublish, statusKey } from "./publish";
import { applyRedirectPlan, planSlugRedirect } from "./redirects";
import { metaDescriptionTone, metaTitleTone, parseKeywords, truncateForSerp } from "./seo";
import { altSuggestion, buildImageFileName, isAllowedSharpFormat } from "./upload";
import { buildPrompt, createRateLimiter, extractJson, normalizeAiResult, sanitizeContext } from "./ai";
import {
  blogFormToRaw,
  blogSchema,
  faqSchema,
  isUniqueViolation,
  pdmSchema,
  reviewFormToRaw,
  reviewSchema,
  tickerFormToRaw,
  tickerSchema,
  toFieldErrors,
} from "./schemas";

describe("datetime (Europe/Berlin)", () => {
  it("interpretiert Sommerzeit (UTC+2)", () => {
    expect(berlinLocalToDate("2026-07-01T12:00")?.toISOString()).toBe("2026-07-01T10:00:00.000Z");
  });
  it("interpretiert Winterzeit (UTC+1)", () => {
    expect(berlinLocalToDate("2026-01-15T08:30")?.toISOString()).toBe("2026-01-15T07:30:00.000Z");
  });
  it("lehnt ungültige Werte ab", () => {
    expect(berlinLocalToDate("")).toBeNull();
    expect(berlinLocalToDate("morgen")).toBeNull();
    expect(berlinLocalToDate("2026-13-01T10:00")).toBeNull();
  });
  it("ist umkehrbar", () => {
    for (const v of ["2026-03-29T03:30", "2026-10-25T01:15", "2026-12-31T23:59", "2026-06-10T00:00"]) {
      expect(dateToBerlinLocal(berlinLocalToDate(v))).toBe(v);
    }
    expect(dateToBerlinLocal(null)).toBe("");
  });
});

describe("publish", () => {
  const now = new Date("2026-10-08T10:00:00Z");
  it("Entwurf setzt publishedAt null", () => {
    expect(resolvePublish("draft", "", null, now)).toEqual({ ok: true, status: "DRAFT", publishedAt: null });
  });
  it("Sofort veröffentlichen nutzt jetzt", () => {
    const r = resolvePublish("now", "", null, now);
    expect(r.ok && r.publishedAt?.getTime()).toBe(now.getTime());
  });
  it("behält vorhandenes Veröffentlichungsdatum", () => {
    const old = new Date("2026-01-01T00:00:00Z");
    const r = resolvePublish("now", "", { status: "PUBLISHED", publishedAt: old }, now);
    expect(r.ok && r.publishedAt).toBe(old);
  });
  it("Geplant verlangt Zukunft", () => {
    expect(resolvePublish("scheduled", "2026-10-01T10:00", null, now).ok).toBe(false);
    expect(resolvePublish("scheduled", "", null, now).ok).toBe(false);
    const r = resolvePublish("scheduled", "2026-11-01T10:00", null, now);
    expect(r).toEqual({ ok: true, status: "PUBLISHED", publishedAt: new Date("2026-11-01T09:00:00Z") });
  });
  it("Status-Schlüssel und Ausgangsmodus", () => {
    expect(statusKey("DRAFT", null, now)).toBe("entwurf");
    expect(statusKey("PUBLISHED", new Date("2027-01-01"), now)).toBe("geplant");
    expect(statusKey("PUBLISHED", new Date("2025-01-01"), now)).toBe("veroeffentlicht");
    expect(initialPublishMode(undefined, null, now)).toBe("draft");
    expect(initialPublishMode("PUBLISHED", new Date("2027-01-01"), now)).toBe("scheduled");
    expect(initialPublishMode("PUBLISHED", new Date("2025-01-01"), now)).toBe("now");
  });
});

describe("redirects", () => {
  it("unveränderter Slug: nur Konflikt-Weiterleitung entfernen", () => {
    expect(planSlugRedirect("tests", "a", "a")).toEqual({ deleteFromPath: "/tests/a", retarget: null, upsert: null });
    expect(planSlugRedirect("blog", null, "neu")).toEqual({ deleteFromPath: "/blog/neu", retarget: null, upsert: null });
  });
  it("geänderter Slug: alt → neu inkl. Ketten-Auflösung", () => {
    expect(planSlugRedirect("tests", "alt", "neu")).toEqual({
      deleteFromPath: "/tests/neu",
      retarget: { fromToPath: "/tests/alt", toPath: "/tests/neu" },
      upsert: { fromPath: "/tests/alt", toPath: "/tests/neu" },
    });
  });
  it("wendet den Plan in der richtigen Reihenfolge an", async () => {
    const calls: string[] = [];
    const delegate = {
      deleteMany: vi.fn(async () => calls.push("delete")),
      updateMany: vi.fn(async () => calls.push("update")),
      upsert: vi.fn(async () => calls.push("upsert")),
    };
    await applyRedirectPlan(delegate, planSlugRedirect("tests", "alt", "neu"));
    expect(calls).toEqual(["delete", "update", "upsert"]);
    expect(delegate.updateMany).toHaveBeenCalledWith({ where: { toPath: "/tests/alt" }, data: { toPath: "/tests/neu" } });
  });
});

describe("seo", () => {
  it("bewertet Längen", () => {
    expect(metaTitleTone(0)).toBe("bad");
    expect(metaTitleTone(50)).toBe("good");
    expect(metaTitleTone(65)).toBe("mid");
    expect(metaTitleTone(90)).toBe("bad");
    expect(metaDescriptionTone(140)).toBe("good");
    expect(metaDescriptionTone(100)).toBe("mid");
    expect(metaDescriptionTone(20)).toBe("bad");
  });
  it("parst Keywords", () => {
    expect(parseKeywords(" Hundefutter, trockenfutter ,,hundefutter;Getreidefrei ")).toEqual(["Hundefutter", "trockenfutter", "Getreidefrei"]);
    expect(parseKeywords("")).toEqual([]);
  });
  it("kürzt für SERP", () => {
    expect(truncateForSerp("kurz", 10)).toBe("kurz");
    expect(truncateForSerp("eins zwei drei vier fünf", 15).endsWith("…")).toBe(true);
  });
});

describe("upload", () => {
  it("prüft Formate", () => {
    expect(isAllowedSharpFormat("jpeg")).toBe(true);
    expect(isAllowedSharpFormat("heif", "av1")).toBe(true);
    expect(isAllowedSharpFormat("heif", "hevc")).toBe(false);
    expect(isAllowedSharpFormat("gif")).toBe(false);
    expect(isAllowedSharpFormat(undefined)).toBe(false);
  });
  it("baut SEO-Dateinamen", () => {
    expect(buildImageFileName("Rinti Kennerfleisch Rind & Huhn", "abc123")).toBe("rinti-kennerfleisch-rind-und-huhn-abc123.webp");
    expect(buildImageFileName("", "x")).toBe("bild-x.webp");
    expect(buildImageFileName("Müsli")).toMatch(/^muesli-[a-z0-9]{6}\.webp$/);
  });
  it("schlägt Alt-Texte vor", () => {
    expect(altSuggestion("review", "Rinti Gold")).toBe("Verpackung von Rinti Gold");
    expect(altSuggestion("blog", "Getreide im Futter")).toBe("Titelbild: Getreide im Futter");
    expect(altSuggestion("review", "  ")).toBe("");
    expect(altSuggestion("review", "Rinti Gold", "inhalt")).toBe("Inhalt von Rinti Gold ohne Verpackung");
    expect(altSuggestion("blog", "X", "inhalt")).toBe("Titelbild: X");
  });
});

describe("ai", () => {
  it("begrenzt Eingaben", () => {
    const ctx = sanitizeContext({ title: "x".repeat(1000), body: "y".repeat(10000), evil: 1 });
    expect(ctx.title.length).toBe(300);
    expect(ctx.body?.length).toBe(4000);
  });
  it("baut deutschen Prompt mit JSON-Vorgabe", () => {
    const p = buildPrompt("meta", "review", { title: "Test Rinti" });
    expect(p).toContain("Futterprüfer.de");
    expect(p).toContain('"metaTitle"');
    expect(buildPrompt("keywords", "blog", { title: "t" })).toContain('"keywords"');
  });
  it("extrahiert und normalisiert JSON", () => {
    expect(normalizeAiResult("meta", extractJson('```json\n{"metaTitle":"A","metaDescription":"B"}\n```'))).toEqual({ metaTitle: "A", metaDescription: "B" });
    expect(normalizeAiResult("keywords", { keywords: ["a", 2, " b "] })).toEqual({ keywords: ["a", "b"] });
    expect(() => extractJson("nix")).toThrow();
    expect(() => normalizeAiResult("keywords", {})).toThrow();
  });
  it("rate-limitet", () => {
    const allow = createRateLimiter(2, 1000);
    expect(allow(0)).toBe(true);
    expect(allow(10)).toBe(true);
    expect(allow(20)).toBe(false);
    expect(allow(1500)).toBe(true);
  });
});

function reviewFd(overrides: Record<string, string | string[]> = {}) {
  const base: Record<string, string | string[]> = {
    title: "Rinti Kennerfleisch im Test",
    slug: "rinti-kennerfleisch",
    brand: "Rinti",
    productName: "Kennerfleisch Rind",
    keyword: "rinti",
    categoryId: "cat1",
    priceClass: "MITTEL",
    pricePerKg: "12,90",
    imageUrl: "/uploads/verpackung.webp",
    imageAlt: "Verpackung",
    imageBlur: "",
    contentImageUrl: "/uploads/inhalt.webp",
    contentImageAlt: "Inhalt",
    contentImageBlur: "",
    scoreRaw: "25",
    scoreHarmful: "18",
    scoreNutrients: "15",
    scoreDeclaration: "12",
    scoreNeeds: "8",
    scoreValue: "4",
    verdict: "Solides Nassfutter mit hohem Fleischanteil.",
    pros: ["Hoher Fleischanteil", "Gute Deklaration", ""],
    cons: ["Teuer", "Wenig Auswahl"],
    bodyHtml: "<p>Hallo</p>",
    metaTitle: "",
    metaDescription: "",
    keywords: "rinti, nassfutter",
    publishMode: "now",
    scheduledAt: "",
    ...overrides,
  };
  const fd = new FormData();
  for (const [k, v] of Object.entries(base)) {
    if (Array.isArray(v)) v.forEach((x) => fd.append(k, x));
    else fd.set(k, v);
  }
  return fd;
}

describe("reviewSchema", () => {
  it("akzeptiert gültige Eingaben und normalisiert", () => {
    const r = reviewSchema.safeParse(reviewFormToRaw(reviewFd()));
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.pricePerKg).toBe(12.9);
    expect(r.data.pros).toEqual(["Hoher Fleischanteil", "Gute Deklaration"]);
    expect(r.data.keywords).toEqual(["rinti", "nassfutter"]);
    expect(r.data.scoreRaw).toBe(25);
  });
  it("prüft Maxima je Kriterium", () => {
    const r = reviewSchema.safeParse(reviewFormToRaw(reviewFd({ scoreRaw: "31", scoreValue: "6" })));
    expect(r.success).toBe(false);
    if (r.success) return;
    const fe = toFieldErrors(r.error);
    expect(fe.scoreRaw).toBe("Rohstoffqualität: maximal 30 Punkte.");
    expect(fe.scoreValue).toContain("maximal 5");
  });
  it("verlangt Pro/Contra nur beim Veröffentlichen", () => {
    const pub = reviewSchema.safeParse(reviewFormToRaw(reviewFd({ pros: ["eins"], cons: [] })));
    expect(pub.success).toBe(false);
    const draft = reviewSchema.safeParse(reviewFormToRaw(reviewFd({ pros: ["eins"], cons: [], publishMode: "draft" })));
    expect(draft.success).toBe(true);
  });
  it("begrenzt Pro auf 3 und prüft Slug, Preis und Bild", () => {
    const r = reviewSchema.safeParse(
      reviewFormToRaw(reviewFd({ pros: ["a", "b", "c", "d"], slug: "Ungültig Slug", pricePerKg: "abc", imageUrl: "javascript:alert(1)" })),
    );
    expect(r.success).toBe(false);
    if (r.success) return;
    const fe = toFieldErrors(r.error);
    expect(Object.keys(fe)).toEqual(expect.arrayContaining(["pros", "slug", "pricePerKg", "imageUrl"]));
  });
  it("verlangt Alt-Text bei Bild", () => {
    const r = reviewSchema.safeParse(reviewFormToRaw(reviewFd({ imageUrl: "/uploads/x.webp", imageAlt: "" })));
    expect(r.success).toBe(false);
  });
});

describe("weitere Schemas", () => {
  it("blog", () => {
    const fd = new FormData();
    fd.set("title", "Getreide im Hundefutter");
    fd.set("slug", "getreide-im-hundefutter");
    fd.set("publishMode", "draft");
    expect(blogSchema.safeParse(blogFormToRaw(fd)).success).toBe(true);
    fd.set("publishMode", "now");
    expect(blogSchema.safeParse(blogFormToRaw(fd)).success).toBe(false);
  });
  it("ticker", () => {
    const fd = new FormData();
    fd.set("text", "Rückruf: Charge 123");
    fd.set("href", "/blog/rueckruf");
    fd.set("isWarning", "on");
    const r = tickerSchema.parse(tickerFormToRaw(fd));
    expect(r).toMatchObject({ isWarning: true, active: false });
    expect(tickerSchema.safeParse({ ...r, href: "//evil.com" }).success).toBe(false);
    expect(tickerSchema.safeParse({ ...r, href: "javascript:alert(1)" }).success).toBe(false);
  });
  it("pdm und faq", () => {
    expect(pdmSchema.safeParse({ year: "2026", month: "10", reviewId: "x", reason: "Sehr gutes Futter." }).success).toBe(true);
    expect(pdmSchema.safeParse({ year: "2026", month: "13", reviewId: "x", reason: "Sehr gutes Futter." }).success).toBe(false);
    expect(faqSchema.safeParse({ question: "Was ist das?", answer: "Eine Antwort.", sortOrder: "3" }).success).toBe(true);
  });
  it("erkennt Unique-Verletzung", () => {
    expect(isUniqueViolation({ code: "P2002" })).toBe(true);
    expect(isUniqueViolation(new Error("x"))).toBe(false);
  });
});

import { stripTags } from "./text";
describe("text", () => {
  it("entfernt Tags", () => {
    expect(stripTags("<h2>Hallo</h2><p>Welt &amp; mehr</p><script>x()</script>")).toBe("Hallo Welt & mehr");
    expect(stripTags(null)).toBe("");
  });
});
