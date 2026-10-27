// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { CONSENT_KEY, LEGACY_CONSENT_KEY, VISITOR_KEY, openConsentBanner, readConsent, visitorId, writeConsent } from "./consent";

beforeEach(() => { localStorage.clear(); document.documentElement.className = ""; });

describe("Einwilligung", () => {
  it("ohne Entscheidung keine Kennung", () => {
    expect(readConsent()).toBeNull();
    expect(visitorId()).toBeNull();
    expect(localStorage.getItem(VISITOR_KEY)).toBeNull();
  });
  it("die frühere „Verstanden“-Bestätigung ist keine Einwilligung", () => {
    localStorage.setItem(LEGACY_CONSENT_KEY, "ok");
    expect(readConsent()).toBeNull();
    expect(visitorId()).toBeNull();
  });
  it("Zustimmen legt die Kennung an und liefert sie stabil (alle Tabs gleich)", () => {
    writeConsent("all");
    const id = visitorId();
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(visitorId()).toBe(id);
    expect(localStorage.getItem(CONSENT_KEY)).toBe("all");
  });
  it("Nur notwendige und Widerruf löschen die Kennung sofort", () => {
    writeConsent("all");
    visitorId();
    expect(localStorage.getItem(VISITOR_KEY)).not.toBeNull();
    writeConsent("essential");
    expect(localStorage.getItem(VISITOR_KEY)).toBeNull();
    expect(visitorId()).toBeNull();
  });
  it("die Entscheidung blendet den Hinweis aus, „Datenschutz-Einstellungen“ öffnet ihn wieder", () => {
    writeConsent("essential");
    expect(document.documentElement.classList.contains("fp-consent")).toBe(true);
    window.scrollTo = () => {};
    openConsentBanner();
    expect(document.documentElement.classList.contains("fp-consent")).toBe(false);
  });
  it("beschädigte Kennung wird ersetzt", () => {
    writeConsent("all");
    localStorage.setItem(VISITOR_KEY, "<script>");
    expect(visitorId()).toMatch(/^[0-9a-f-]{36}$/);
  });
});
