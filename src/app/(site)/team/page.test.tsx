import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import TeamPage, { metadata } from "./page";

const DESCRIPTION =
  "Chefredakteur Matthias Schröter leitet die Redaktion von Futterprüfer.de. Tests von Hunde- und Katzenfutter nach Kennzeichnung, Zusammensetzung und Methodik.";

describe("Team-Seite", () => {
  const html = renderToStaticMarkup(<TeamPage />);

  it("zeigt Matthias Schröter als Chefredakteur mit Porträt und Biografie", () => {
    expect(html).toContain("Chefredaktion");
    expect(html).toContain("uppercase");
    expect(html).toContain('id="matthias-schroeter"');
    expect(html).toContain("Matthias Schröter");
    expect(html).toContain("Chefredakteur von Futterprüfer.de");
    expect(html).toContain("Seit 6. November 2026, angestellt in Teilzeit");
    expect(html).toContain("Matthias Schröter verantwortet die redaktionelle Linie des Portals: welche Futtermittel geprüft werden, wie die Texte argumentieren und woran ein Urteil erkennbar bleibt. Maßgeblich ist, was auf dem Beutel steht und was sich daraus ableiten lässt – nicht das Werbeversprechen.");
    expect(html).toContain("Als Tierarzt und Wissenschaftler liegt sein Schwerpunkt auf der Ernährung von Hund und Katze. An der Vetsuisse-Fakultät der Universität Zürich hat er Veterinärmedizin studiert und in Forschung und Lehre zur Heimtierernährung gearbeitet. Ihm kommt es darauf an, dass aus einer Zutatenliste ein nachvollziehbares Bild wird, kein Wohlfühltext.");
    expect(html).toContain("Die Beiträge unter seiner Leitung sollen für Tierhalter klar lesbar und für Suchmaschinen auffindbar sein, ohne die Prüfung weichzuspülen.");
    expect(html).toContain('src="/redaktion/matthias-schroeter-chefredakteur.webp"');
    expect(html).toContain('alt="Matthias Schröter, Chefredakteur von Futterprüfer.de"');
    expect(html).toContain('loading="eager"');
    expect(html).toMatch(/fetchPriority="high"/i);
    expect(html).toContain("matthias-schroeter-chefredakteur-400.webp");
    expect(html).toContain("matthias-schroeter-chefredakteur-800.webp");
  });

  it("führt den Werdegang in der Reihenfolge der Stationen", () => {
    const werdegang = html.slice(html.indexOf('id="werdegang"'));
    expect(werdegang.length).toBeGreaterThan(0);
    expect(werdegang).toContain("Werdegang");
    const stations = [
      "seit 2026",
      "Chefredakteur, Futterprüfer.de",
      "Angestellt in Teilzeit, seit 6. November 2026",
      "Leitung der Redaktion, Verantwortung für Tests, Fachbeiträge und die Bewertungslinie des Portals.",
      "seit 2025",
      "Forschung und Lehre zur Heimtierernährung",
      "Institut für Tierernährung und Diätetik, Vetsuisse-Fakultät, Universität Zürich",
      "Arbeit zu klinischer Diätetik, funktionellen Inhaltsstoffen und nachhaltigen Proteinquellen in der Ernährung von Hund und Katze.",
      "2022–2025",
      "Wissenschaftliche Tätigkeit nach der Promotion",
      "Forschung zu Nährstoffverwertung, Futterakzeptanz und Diätetik; Lehre und Betreuung von Qualifikationsarbeiten.",
      "2018–2022",
      "Promotion zum Dr. med. vet.",
      "Dissertation zur Nährstoffverwertung und Verdauungsphysiologie bei Hunden und Katzen unter besonderer Berücksichtigung funktioneller Futtermittel.",
      "2012–2018",
      "Studium der Veterinärmedizin",
      "Abschluss als Tierarzt (Staatsexamen).",
    ];
    let last = -1;
    for (const station of stations) {
      const index = werdegang.indexOf(station);
      expect(index, station).toBeGreaterThan(last);
      last = index;
    }
    expect(werdegang).toContain("Vetsuisse-Fakultät, Universität Zürich");
  });

  it("beschreibt im JSON-LD die gezeigte Person und keine weiteren Profile", () => {
    expect(html).toContain('"@type":"Organization"');
    expect(html).toContain('"name":"Futterprüfer"');
    expect(html).toContain('"@type":"Person"');
    expect(html).toContain('"name":"Matthias Schröter"');
    expect(html).toContain('"jobTitle":"Chefredakteur"');
    expect(html).toContain("/team#matthias-schroeter");
    expect(html).toContain("/redaktion/matthias-schroeter-chefredakteur.webp");
    expect(html).not.toContain("sameAs");
    expect(html).not.toContain("Wilhelm");
    expect(html).not.toContain("Schäfer");
    expect(html).not.toContain("Sebastian Kraft");
    expect(html).not.toContain("Pfotenfreund");
    expect(html).not.toContain("Sonnenhang");
    expect(html).not.toContain("Dr. L.");
    expect(metadata.title).toBe("Redaktion: Chefredakteur Matthias Schröter");
    expect(metadata.description).toBe(DESCRIPTION);
    const redaktion = html.slice(html.indexOf('id="redaktion"'));
    expect(redaktion).toContain("Die Redaktion von Futterprüfer.de");
    expect(redaktion).toContain('href="/methodik"');
    expect(redaktion).toContain('href="/tests"');
    expect(redaktion).toContain('href="/lexikon"');
    expect(redaktion).toContain("Hersteller beauftragen oder bezahlen keine Tests und haben keinen Einfluss auf die Punkte.");
    const words = redaktion.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean);
    expect(words.length).toBeGreaterThanOrEqual(150);
    expect(words.length).toBeLessThanOrEqual(250);
    expect(DESCRIPTION.length).toBeGreaterThanOrEqual(70);
    expect(DESCRIPTION.length).toBeLessThanOrEqual(160);
  });
});
