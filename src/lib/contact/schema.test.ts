import { describe, expect, it } from "vitest";
import { looksLikeBot, parseContact } from "./schema";

const fd = (o: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(o)) f.set(k, v);
  return f;
};

describe("Kontaktformular", () => {
  it("akzeptiert gültige Eingaben", () => {
    const r = parseContact(fd({ kind: "hersteller", name: "Max", email: "MAX@Firma.de ", company: "", message: "Wir möchten ein Produkt einreichen.", consent: "on" }));
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.email).toBe("max@firma.de");
      expect(r.data.company).toBeUndefined();
    }
  });
  it("lehnt fehlende Felder und ungültige Art ab", () => {
    expect(parseContact(fd({ kind: "spam", name: "M", email: "x", message: "kurz" })).success).toBe(false);
    expect(parseContact(new FormData()).success).toBe(false);
  });
  it("Bot-Erkennung", () => {
    expect(looksLikeBot("http://spam", 1, 10_000)).toBe(true);
    expect(looksLikeBot("", null, 10_000)).toBe(true);
    expect(looksLikeBot("", 9_000, 10_000)).toBe(true);
    expect(looksLikeBot("", 1_000, 10_000)).toBe(false);
  });
});
