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
  it("Deckelzeile an den Balken, Teilwerte bleiben roh", () => {
    const data: VerdictData = { ...base, scoreRaw: 26, scoreHarmful: 20, scoreNutrients: 17, scoreDeclaration: 2, scoreNeeds: 7, scoreValue: 3, totalScore: 59 };
    const html = renderToStaticMarkup(<VerdictPanel data={data} />);
    expect(html).toContain("Deckel aktiv (Deklaration &amp; Transparenz unter 6 von 15 Punkten: höchstens 59 Punkte (befriedigend).). Summe 75, gewertet 59.");
    expect(html).toContain('aria-label="Deklaration &amp; Transparenz: 2 von 15 Punkten"');
    expect(html).toContain('aria-valuenow="26"');
    expect(html).toContain('aria-label="Rohstoffqualität: 26 von 30 Punkten"');
  });
  it("keine Deckelzeile, wenn die Summe der Teilwerte die Gesamtwertung ist", () => {
    const html = renderToStaticMarkup(<VerdictPanel data={base} />);
    expect(html).not.toContain("Deckel aktiv");
  });
  it("eigene Kriterienbalken ohne Hinweis erfinden keine Alleinfutter-Zeile", () => {
    const html = renderToStaticMarkup(
      <VerdictPanel
        data={{ ...base, scoreDeclaration: 0, totalScore: 50 }}
        bars={[{ key: "wirkstoff", label: "Wirkstoff", max: 50, value: 39 }, { key: "werbung", label: "Werbeaussagen", max: 20, value: 11 }]}
      />,
    );
    expect(html).not.toContain("Deckel aktiv");
    expect(html).toContain('aria-label="Wirkstoff: 39 von 50 Punkten"');
  });
  it("übernimmt den mitgegebenen Ergänzungsfutter-Hinweis", () => {
    const note = "Deckel aktiv (Heilaussage: höchstens 67 Punkte.). Summe 65, gewertet 50.";
    const html = renderToStaticMarkup(<VerdictPanel data={{ ...base, totalScore: 50 }} capNote={note} />);
    expect(html).toContain(note);
  });
});
