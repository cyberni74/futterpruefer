import type { LayoutData } from "./schema";

/**
 * Neutrale Beispieldaten für Tests und die Vorschau-Route. Keine Produkt- oder Markennamen, keine echten Testtexte.
 * 5 Kriterien (Ergänzungsfutter: 20/30/20/15/15) oder 6 Kriterien (Alleinfutter: 30/20/20/15/10/5).
 */
export function beispielDaten(kriterien: 5 | 6 = 5): { data: LayoutData; totalScore: number } {
  const ergaenzung = [
    ["Wirkstoffauswahl", 18, 20], ["Dosierung", 27, 30], ["Werbung und Aussagen", 17, 20], ["Träger- und Zusatzstoffe", 13, 15], ["Transparenz", 12, 15],
  ] as const;
  const allein = [
    ["Rohstoffqualität", 26, 30], ["Schadstoffe", 17, 20], ["Nährstoffprofil", 16, 20], ["Deklaration", 12, 15], ["Bedarfsdeckung", 8, 10], ["Preis-Leistung", 4, 5],
  ] as const;
  const liste = kriterien === 5 ? ergaenzung : allein;
  const data: LayoutData = {
    hero: {
      titel: "Beispielprodukt A im Test",
      untertitel: "Ein neutrales Beispiel, das alle Bausteine der Vorlage zeigt.",
      tags: ["Beispiel", "Platzhalter", "Neutral"],
      gesamturteil: "Beispieltext für das Gesamturteil.",
    },
    kennzahlen: [
      { wert: "00", label: "Kennzahl A" }, { wert: "00 %", label: "Kennzahl B" }, { wert: "00 g", label: "Kennzahl C" }, { wert: "00 €", label: "Kennzahl D" },
    ],
    urteil: { intro: "Beispieltext zur Einordnung der Kriterien.", hervorhebung: "Hervorhebung im Beispiel" },
    kriterien: liste.map(([name, punkte, max]) => ({ name, punkte, max, kurz: "Kurzbewertung im Beispiel.", begruendung: "Ausführliche Begründung im Beispiel." })),
    kapitel: [
      { titel: "Erstes Kapitel", html: "<p>Beispieltext mit <strong>Hervorhebung</strong>.</p><h3>Unterüberschrift</h3><p>Weiterer Beispieltext.</p><ul><li>Punkt A</li><li>Punkt B</li></ul>" },
      { titel: "Zweites Kapitel", html: "<p>Noch ein Beispieltext.</p><table class=\"data\"><tr><th>Spalte</th><th>Wert</th></tr><tr><td>Zeile</td><td>00</td></tr></table><div class=\"tbl\"><table><thead><tr><th>Aussage</th><th>Quelle</th><th>Einstufung</th><th>Begründung</th></tr></thead><tbody><tr><td>Beispielaussage für die Karte</td><td>Beispielquelle</td><td>Beispiel</td><td>Beispielbegründung, lang genug für den Umbruch auf dem Handy.</td></tr></tbody></table></div>" },
    ],
    zutaten: [
      { name: "Zutat A", menge: "00 mg", funktion: "Beispiel für die Funktion.", bewertung: "Beispiel für die Bewertung." },
      { name: "Zutat B", menge: "00 mg", funktion: "Beispiel für die Funktion.", bewertung: "Beispiel für die Bewertung." },
    ],
    analysewerte: [{ name: "Wert A", wert: "00 %" }, { name: "Wert B", wert: "00 %", hinweis: "Beispielhinweis" }],
    dosierung: { zeilen: [{ label: "bis 00 kg", wert: "00 Stück" }, { label: "über 00 kg", wert: "00 Stück" }] },
    evidenz: [
      { aussage: "Beispielaussage A", status: "BELEGT", quelle: "Beispielquelle 2000" },
      { aussage: "Beispielaussage B", status: "PLAUSIBEL", quelle: "Beispielquelle 2001" },
      { aussage: "Beispielaussage C", status: "NICHT_VERIFIZIERT" },
    ],
    herstellerangaben: [{ label: "Angabe A", prozent: 92 }, { label: "Angabe B", prozent: 40 }],
    preisrechner: { preis: 29.9, inhalt: 160, einheit: "STUECK", dosisProKg: 0.4, koerpergewicht: 10, tage: 30 },
    sicherheit: { stufe: "HINWEIS", text: "Beispieltext zur Sicherheit." },
    pros: ["Vorteil A", "Vorteil B"],
    cons: ["Nachteil A", "Nachteil B"],
    fazit: { html: "<h3>Unterüberschrift</h3><p>Beispieltext für das Fazit.</p>" },
    faq: [{ frage: "Beispielfrage A?", antwort: "Beispielantwort A." }, { frage: "Beispielfrage B?", antwort: "Beispielantwort B." }],
    quellen: [{ titel: "Beispielquelle A", url: "https://example.org/quelle", doi: "10.0000/beispiel", hinweis: "Beispielhinweis" }],
    pruefstand: "Prüfstand: Beispieldatum.",
    methodikHinweis: "Hinweis zur Methodik im Beispiel.",
    asin: "B000000000",
    bildnachweis: "Beispielnachweis",
  };
  return { data, totalScore: liste.reduce((s, k) => s + k[1], 0) };
}
