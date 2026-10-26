/** Ampel-Badge: Wertungstexte wie „78, Gelb“ in Ergebnis-Zellen von Tabellen werden zu <span class="fp-score">. */
const CELL = /(<td\b[^>]*\bdata-label="(?:Unser Ergebnis|Ergebnis|Bewertung|Note|Punkte)"[^>]*>)([\s\S]*?)(<\/td>)/gi;
const KEY: Record<string, string> = { grün: "gruen", gelb: "gelb", rot: "rot" };

const badge = (score: string | undefined, color: string) =>
  `<span class="fp-score fp-score-${KEY[color.toLowerCase()]}">${score ? `<b>${score}</b> ` : ""}${color}</span>`;

export function badgeScores(html: string): string {
  return html.replace(CELL, (_m, open: string, inner: string, close: string) => {
    if (inner.includes("fp-score")) return open + inner + close;
    let out = inner.replace(/\b(\d{1,3})\s*(?:\/100|Punkte)?\s*,\s*(Grün|Gelb|Rot)\b/g, (_s, n: string, c: string) => badge(n, c));
    if (out === inner) out = inner.replace(/^((?:<a\b[^>]*>)?)(Grün|Gelb|Rot)\b/, (_s, a: string, c: string) => a + badge(undefined, c));
    return open + out + close;
  });
}
