import { describe, expect, it } from "vitest";
import { ONLINE_FENSTER_MS, PING_INTERVALL_MS, bremse, gueltigeId } from "./online";

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
});
