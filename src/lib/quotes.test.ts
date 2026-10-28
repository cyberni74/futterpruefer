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

/** „ “ und ‚ ‘ müssen paarig sein; „„, ““ und gerade " dürfen nicht übrig bleiben. */
function assertBalanced(text: string) {
  expect(text).not.toContain(OPEN + OPEN);
  expect(text).not.toContain(CLOSE + CLOSE);
  expect(text).not.toContain('"');
  let doubles = 0;
  let singles = 0;
  for (const ch of text) {
    if (ch === OPEN) doubles += 1;
    else if (ch === CLOSE) {
      doubles -= 1;
      expect(doubles).toBeGreaterThanOrEqual(0);
    } else if (ch === NESTED_OPEN) singles += 1;
    else if (ch === NESTED_CLOSE) {
      singles -= 1;
      expect(singles).toBeGreaterThanOrEqual(0);
    }
  }
  expect(doubles).toBe(0);
  expect(singles).toBe(0);
}

describe("frameQuote", () => {
  const cases: [string, string][] = [
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

  it.each(cases)("%j wird zu %j", (input, expected) => {
    const framed = frameQuote(input);
    expect(framed).toBe(expected);
    expect(withoutQuotes(framed)).toBe(withoutQuotes(input));
    assertBalanced(framed);
    expect(frameQuote(framed)).toBe(framed);
  });
});
