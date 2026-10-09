import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import TeamPage, { metadata } from "./page";

describe("Team-Seite", () => {
  it("nennt keine Personen und verlinkt das Impressum", () => {
    const html = renderToStaticMarkup(<TeamPage />);
    expect(html).toContain("Futterprüfer.de ist ein transparentes Testportal für Hunde- und Katzenfutter.");
    expect(html).toContain("Unsere Tests stützen sich auf die Kennzeichnung, die Angaben der Hersteller und öffentlich zugängliche Quellen.");
    expect(html).toContain("Eigene Laboranalysen führen wir nur durch, wenn wir das im Test ausdrücklich angeben.");
    expect(html).toContain('href="/impressum"');
    expect(html).toContain(">Impressum<");
    expect(html).toContain('"@type":"Organization"');
    expect(html).toContain('"name":"Futterprüfer"');
    expect(html).not.toContain('"@type":"Person"');
    expect(metadata.title).toBe("Team");
    expect(metadata.description).toBe(
      "Futterprüfer.de ist ein transparentes Testportal für Hunde- und Katzenfutter. Tests stützen sich auf Kennzeichnung, Herstellerangaben und öffentlich zugängliche Quellen.",
    );
  });
});
