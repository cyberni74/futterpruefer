import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { VerdictPanel, type VerdictData } from "./verdict-panel";

const base: VerdictData = {
  scoreRaw: 26, scoreHarmful: 18, scoreNutrients: 17, scoreDeclaration: 12, scoreNeeds: 9, scoreValue: 4,
  totalScore: 86, verdict: "Hochwertige, klar deklarierte Rezeptur.", pros: ["Offene Deklaration", "Monoprotein"], cons: ["Teuer", "Kleine Dosen"],
  updatedAt: "2026-10-08T10:00:00.000Z",
};

describe("Fazit-Box", () => {
  it("Snapshot: gutes Produkt", () => {
    expect(renderToStaticMarkup(<VerdictPanel data={base} />)).toMatchSnapshot();
  });
  it("Snapshot: Warnhinweis bei Schadstoffen < 10", () => {
    const html = renderToStaticMarkup(<VerdictPanel data={{ ...base, scoreHarmful: 6, totalScore: 74, harmfulReason: "Enthält Zucker." }} showWarning />);
    expect(html).toContain("Warnhinweis");
    expect(html).toContain("Enthält Zucker.");
    expect(html).toMatchSnapshot();
  });
  it("ARIA-Labels der Kriterien-Balken", () => {
    const html = renderToStaticMarkup(<VerdictPanel data={base} />);
    expect(html).toContain('aria-label="Rohstoffqualität: 26 von 30 Punkten"');
    expect(html).toContain('aria-label="Preis-Leistung: 4 von 5 Punkten"');
    expect(html).toContain("So bewerten wir");
  });
  it("null-sicher: fehlende Felder blenden Blöcke aus", () => {
    const html = renderToStaticMarkup(<VerdictPanel data={{ ...base, verdict: "", pros: [], cons: [], updatedAt: null }} />);
    expect(html).not.toContain(">Pro<");
    expect(html).not.toContain(">Contra<");
    expect(html).not.toContain("Zuletzt aktualisiert");
  });
});
