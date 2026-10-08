import { describe, expect, it } from "vitest";
import { brevoConfig, newsletterSchema } from "./schema";

describe("Newsletter", () => {
  it("validiert E-Mail und Zustimmung", () => {
    expect(newsletterSchema.safeParse({ email: " A@B.de ", consent: "on" }).success).toBe(true);
    expect(newsletterSchema.safeParse({ email: "x", consent: "on" }).success).toBe(false);
    expect(newsletterSchema.safeParse({ email: "a@b.de" }).success).toBe(false);
  });
  it("Brevo-Konfiguration nur vollständig", () => {
    expect(brevoConfig({})).toBeNull();
    expect(brevoConfig({ BREVO_API_KEY: "k", BREVO_LIST_ID: "3", BREVO_DOI_TEMPLATE_ID: "x", NEXT_PUBLIC_SITE_URL: "https://a.de" })).toBeNull();
    expect(brevoConfig({ BREVO_API_KEY: "k", BREVO_LIST_ID: "3", BREVO_DOI_TEMPLATE_ID: "7", NEXT_PUBLIC_SITE_URL: "https://a.de/" })).toEqual({ apiKey: "k", listId: 3, templateId: 7, redirectUrl: "https://a.de/newsletter/bestaetigt" });
  });
});
