import { describe, expect, it } from "vitest";
import { ONLINE_FENSTER_MS, PING_INTERVALL_MS, bremse, gueltigeId, ipSchluessel, istBot } from "./online";

describe("Online-Zähler: Eingaben und Bremse", () => {
  it("nur zufällige Kennungen werden angenommen", () => {
    expect(gueltigeId("3b241101-e2bb-4255-8caf-4136c566a962")).toBe(true);
    for (const x of ["", "kurz", "a".repeat(65), "mit leerzeichen 1234567890", "<script>alert(1)</script>", 42, null, undefined]) expect(gueltigeId(x)).toBe(false);
  });
  it("das Zählfenster ist größer als das Ping-Intervall (ein verpasster Ping zählt nicht als weg)", () => {
    expect(ONLINE_FENSTER_MS).toBeGreaterThan(PING_INTERVALL_MS * 2);
  });
  it("Bremse: nach dem Limit gesperrt, danach im neuen Fenster wieder frei", () => {
    const b = bremse(3, 1000);
    expect([1, 2, 3].map(() => b("a", 0))).toEqual([false, false, false]);
    expect(b("a", 10)).toBe(true);
    expect(b("b", 10)).toBe(false);
    expect(b("a", 2000)).toBe(false);
  });
  it("abgelaufene Einträge werden bei JEDEM Aufruf entfernt", () => {
    const b = bremse(3, 1000);
    for (let i = 0; i < 50; i++) b(`k${i}`, 0);
    expect(b.groesse()).toBe(50);
    b("neu", 5000);
    expect(b.groesse()).toBe(1);
  });
  it("IP nur als gesalzener Hash: stabil, 64 Hex-Zeichen, ohne die IP selbst", () => {
    const h = ipSchluessel("203.0.113.7");
    expect(h).toMatch(/^[0-9a-f]{64}$/);
    expect(h).toBe(ipSchluessel("203.0.113.7"));
    expect(h).not.toContain("203");
    expect(h).not.toBe(ipSchluessel("203.0.113.8"));
  });
});

describe("Bots", () => {
  it("bekannte Bots, Werkzeuge und fehlende User-Agents zählen nicht", () => {
    for (const ua of ["Googlebot/2.1", "Mozilla/5.0 (compatible; AhrefsBot/7.0)", "facebookexternalhit/1.1", "curl/8.4.0", "python-requests/2.31", "Lighthouse", "Mozilla/5.0 HeadlessChrome/120", "", null, undefined]) expect(istBot(ua)).toBe(true);
  });
  it("normale Browser zählen", () => {
    for (const ua of ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1", "Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0"]) expect(istBot(ua)).toBe(false);
  });
});
