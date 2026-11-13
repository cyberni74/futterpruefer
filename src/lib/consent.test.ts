import { describe, expect, it } from "vitest";
import {
  CONSENT_COOKIE,
  CONSENT_COOKIE_OPTIONS,
  CONSENT_KEY,
  CONSENT_MAX_AGE,
  CONSENT_VERSION,
  consentScript,
  hasCurrentConsent,
  isConsentChoice,
  parseConsentValue,
  serializeConsent,
} from "./consent";

describe("Consent-Wert", () => {
  it("serialisiert Annahme und Ablehnung gleichartig mit fester Version", () => {
    expect(serializeConsent("ok")).toBe("v1.ok");
    expect(serializeConsent("essential")).toBe("v1.essential");
    expect(isConsentChoice("ok")).toBe(true);
    expect(isConsentChoice("essential")).toBe(true);
    expect(isConsentChoice("denied")).toBe(false);
  });

  it("erkennt nur die aktuelle Version als gültig", () => {
    expect(hasCurrentConsent("v1.ok")).toBe(true);
    expect(hasCurrentConsent("v1.essential")).toBe(true);
    expect(hasCurrentConsent("v2.ok")).toBe(false);
    expect(hasCurrentConsent("ok")).toBe(false);
    expect(hasCurrentConsent("")).toBe(false);
    expect(hasCurrentConsent(undefined)).toBe(false);
    expect(parseConsentValue("v2.ok")).toEqual({ version: 2, choice: "ok" });
  });

  it("setzt das Cookie 12 Monate, ohne HttpOnly, mit SameSite=Lax und Secure", () => {
    expect(CONSENT_COOKIE).toBe("fp_consent");
    expect(CONSENT_KEY).toBe("fp-consent-v1");
    expect(CONSENT_VERSION).toBe(1);
    expect(CONSENT_MAX_AGE).toBe(31_536_000);
    expect(CONSENT_COOKIE_OPTIONS).toMatchObject({
      path: "/",
      maxAge: 31_536_000,
      sameSite: "lax",
      secure: true,
      httpOnly: false,
    });
  });

  it("prüft im Inline-Skript Cookie und lokalen Speicher, blendet per Style-Tag aus", () => {
    expect(consentScript).toContain(CONSENT_COOKIE);
    expect(consentScript).toContain(CONSENT_KEY);
    expect(consentScript).toContain("fp-consent-hide");
    expect(consentScript).toContain("#fp-cookie{display:none!important}");
    expect(consentScript).toContain("localStorage.getItem");
    expect(consentScript).toContain("document.cookie");
  });
});
