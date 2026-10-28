import { describe, expect, it } from "vitest";
import { frameQuote } from "./quotes";

const OPEN = "\u201E";
const CLOSE = "\u201C";
const NESTED_OPEN = "\u201A";
const NESTED_CLOSE = "\u2018";

/** Wortlaut ohne Anführungszeichen, zum Vergleich dass sonst nichts umgeschrieben wird. */
function withoutQuotes(text: string): string {
  return text.replace(/[\u201E\u201C\u201A\u2018"]/g, "");
}

/**
 * Jede Ausgabe ist korrekt verschachtelt: „ und “ wechseln ab (öffnen, schließen, …,
 * nie zwei gleiche hintereinander), und jedes ‚ steht vor seinem ‘ innerhalb eines solchen Paars.
 */
function assertCorrectlyNested(text: string) {
  expect(text.startsWith(OPEN)).toBe(true);
  expect(text.endsWith(CLOSE)).toBe(true);
  expect(text).not.toContain('"');
  expect(text).not.toContain(OPEN + OPEN);
  expect(text).not.toContain(CLOSE + CLOSE);

  let doubleDepth = 0;
  let singleDepth = 0;
  for (const ch of text) {
    if (ch === OPEN) {
      expect(doubleDepth).toBe(0);
      doubleDepth = 1;
    } else if (ch === CLOSE) {
      expect(doubleDepth).toBe(1);
      expect(singleDepth).toBe(0);
      doubleDepth = 0;
    } else if (ch === NESTED_OPEN) {
      expect(doubleDepth).toBe(1);
      singleDepth += 1;
    } else if (ch === NESTED_CLOSE) {
      expect(doubleDepth).toBe(1);
      singleDepth -= 1;
      expect(singleDepth).toBeGreaterThanOrEqual(0);
    }
  }
  expect(doubleDepth).toBe(0);
  expect(singleDepth).toBe(0);
}

describe("frameQuote", () => {
  const nested: [string, string][] = [
    ["Datenfeld „Diättyp des Tierfutters: Roh“", "„Datenfeld ‚Diättyp des Tierfutters: Roh‘“"],
    ["„Naturbelassen“ und schonend", "„‚Naturbelassen‘ und schonend“"],
    ["Premium", "„Premium“"],
    ["„Monoprotein“", "„Monoprotein“"],
    ["Text mit ‚schon halb‘", "„Text mit ‚schon halb‘“"],
    ['Angabe "Roh" im Datenfeld', "„Angabe ‚Roh‘ im Datenfeld“"],
    ['„Angabe "Roh" im Datenfeld“', "„Angabe ‚Roh‘ im Datenfeld“"],
    ["„A“ und „B“", "„‚A‘ und ‚B‘“"],
    ["„Datenfeld „Diättyp““", "„Datenfeld ‚Diättyp‘“"],
  ];

  /** Mehrfachzitat ohne äußere Zeichen: der Rahmen stellt „…“ „…“ wieder her. */
  const restored: [string, string][] = [
    [
      "Frisches Freilaufhuhn“, „Voll mit leckerem, frischen, Freiland-Huhn",
      "„Frisches Freilaufhuhn“, „Voll mit leckerem, frischen, Freiland-Huhn“",
    ],
    [
      "Getreidefrei“, „Trockenfutter getreidefrei? Aber sicher“, Datenfeld „Glutenfrei",
      "„Getreidefrei“, „Trockenfutter getreidefrei? Aber sicher“, Datenfeld „Glutenfrei“",
    ],
    [
      "jodarm“ im Datenfeld „Spezifische Verwendung für Produkt",
      "„jodarm“ im Datenfeld „Spezifische Verwendung für Produkt“",
    ],
    [
      "no gluten added“ (Sack, Beutel), „No gluten added“ (Listing), Datenfelder „Besondere Merkmale: Ohne Zusatz von Gluten“ und „Zusatzstoffe: … ohne Zusatz von Gluten",
      "„no gluten added“ (Sack, Beutel), „No gluten added“ (Listing), Datenfelder „Besondere Merkmale: Ohne Zusatz von Gluten“ und „Zusatzstoffe: … ohne Zusatz von Gluten“",
    ],
    [
      "Immer frisches Huhn – nie Fleischmehl“, „Fleischmehl? Nie",
      "„Immer frisches Huhn – nie Fleischmehl“, „Fleischmehl? Nie“",
    ],
    [
      "Köstliches und gesundes frisches Fleisch“, „Ein gesunder Mix aus gesundem Obst, Gemüse und frischen Kräutern“, „hochwertigen Fleischstücken“, „Wenn Hunde kochen könnten, würden sie Folgendes zaubern",
      "„Köstliches und gesundes frisches Fleisch“, „Ein gesunder Mix aus gesundem Obst, Gemüse und frischen Kräutern“, „hochwertigen Fleischstücken“, „Wenn Hunde kochen könnten, würden sie Folgendes zaubern“",
    ],
    [
      "TIERWOHL: …“; „ZUSAMMENSETZUNG: Artgerecht, natur- und beutenah",
      "„TIERWOHL: …“; „ZUSAMMENSETZUNG: Artgerecht, natur- und beutenah“",
    ],
    [
      'Teil "eins"“, „Teil "zwei"',
      "„Teil ‚eins‘“, „Teil ‚zwei‘“",
    ],
  ];

  it.each([...nested, ...restored])("%j wird zu %j", (input, expected) => {
    const framed = frameQuote(input);
    expect(framed).toBe(expected);
    expect(withoutQuotes(framed)).toBe(withoutQuotes(input));
    assertCorrectlyNested(framed);
  });

  it.each(nested)("zweiter Rahmen ändert %j nicht", (input, expected) => {
    const framed = frameQuote(input);
    expect(frameQuote(framed)).toBe(framed);
    expect(framed).toBe(expected);
    assertCorrectlyNested(framed);
  });
});
