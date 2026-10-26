import { describe, expect, it } from "vitest";
import { badgeScores } from "./score-badge";

const td = (inner: string, label = "Unser Ergebnis") => `<td data-label="${label}">${inner}</td>`;

describe("badgeScores", () => {
  it("wandelt Punkte und Ampel in ein Badge", () => {
    expect(badgeScores(td("81, Grün, Testsieger"))).toBe(
      td('<span class="fp-score fp-score-gruen"><b>81</b> Grün</span>, Testsieger'),
    );
  });
  it("behält den Link um die Wertung", () => {
    expect(badgeScores(td('<a href="/x">78, Gelb</a>'))).toBe(
      td('<a href="/x"><span class="fp-score fp-score-gelb"><b>78</b> Gelb</span></a>'),
    );
  });
  it("erkennt reines Rot am Zellanfang", () => {
    expect(badgeScores(td("Rot"))).toBe(td('<span class="fp-score fp-score-rot">Rot</span>'));
  });
  it("lässt andere Zellen und Fließtext unberührt", () => {
    const html = `<p>Es gab 78, Gelb im Test.</p>${td("78, Gelb", "Art")}`;
    expect(badgeScores(html)).toBe(html);
  });
  it("ist idempotent", () => {
    const once = badgeScores(td("81, Grün"));
    expect(badgeScores(once)).toBe(once);
  });
});
