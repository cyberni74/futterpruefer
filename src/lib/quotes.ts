/** Deutsche Anführungszeichen: „…“ außen, ‚…‘ im Zitat. */
const OPEN = "\u201E";
const CLOSE = "\u201C";
const NESTED_OPEN = "\u201A";
const NESTED_CLOSE = "\u2018";

/**
 * Der ganze Text ist genau ein äußeres „…“: er beginnt mit „, endet mit “,
 * und dieses öffnende Zeichen schließt erst am letzten Zeichen wieder.
 */
function isExactOuterQuote(text: string): boolean {
  if (text.length < 2 || text[0] !== OPEN || text[text.length - 1] !== CLOSE) return false;
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === OPEN) depth += 1;
    else if (ch === CLOSE) {
      depth -= 1;
      if (depth < 0 || (depth === 0 && i !== text.length - 1)) return false;
    }
  }
  return depth === 0;
}

/** Gerade "…" werden zu ‚…‘. Deutsche „ “ und vorhandene ‚ ‘ bleiben. */
function convertStraightQuotes(text: string): string {
  let straightOpen = false;
  let out = "";
  for (const ch of text) {
    if (ch === '"') {
      out += straightOpen ? NESTED_CLOSE : NESTED_OPEN;
      straightOpen = !straightOpen;
    } else out += ch;
  }
  return out;
}

/** Innere „…“ und gerade "…" werden zu ‚…‘. Vorhandene ‚…‘ bleiben. */
function nestInnerQuotes(text: string): string {
  let out = "";
  for (const ch of text) {
    if (ch === OPEN) out += NESTED_OPEN;
    else if (ch === CLOSE) out += NESTED_CLOSE;
    else out += ch;
  }
  return convertStraightQuotes(out);
}

/**
 * „ und “ wechseln ab: öffnen, schließen, öffnen, schließen …
 * Beginn mit öffnen, Ende mit schließen, nie zwei gleiche hintereinander.
 */
function germanQuotesAlternate(text: string): boolean {
  let expect: typeof OPEN | typeof CLOSE = OPEN;
  let count = 0;
  for (const ch of text) {
    if (ch !== OPEN && ch !== CLOSE) continue;
    if (ch !== expect) return false;
    expect = ch === OPEN ? CLOSE : OPEN;
    count += 1;
  }
  // Nach einem schließenden “ ist das nächste wieder ein „. Mindestens ein Paar.
  return count > 0 && expect === OPEN;
}

/**
 * Rahmt einen claim-Text mit „…“.
 * Wechselt die Folge „ “ nach diesem Rahmen sauber ab, bleiben diese Zeichen stehen.
 * Gerade "…" werden dabei wie bisher zu ‚…‘.
 * Sonst werden innere „…“ und gerade "…" zu ‚…‘ (Zitat im Zitat).
 * Ist der Text bereits genau ein äußeres Zitat, kommt kein zweiter Rahmen dazu.
 */
export function frameQuote(text: string): string {
  const trial = `${OPEN}${text}${CLOSE}`;
  if (germanQuotesAlternate(trial)) return convertStraightQuotes(trial);
  const body = isExactOuterQuote(text) ? text.slice(1, -1) : text;
  return `${OPEN}${nestInnerQuotes(body)}${CLOSE}`;
}
