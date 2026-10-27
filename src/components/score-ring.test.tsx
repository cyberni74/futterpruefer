import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ScoreRing } from "./score-ring";

describe("ScoreRing SSR", () => {
  it("zeigt den echten Score, nicht 0 von 100", () => {
    const html = renderToStaticMarkup(<ScoreRing score={80} />);
    expect(html).toContain('aria-label="Gesamtwertung: 80 von 100 Punkten – Empfehlenswert"');
    expect(html).toContain(">80</span>");
    expect(html).toContain("von 100 Punkten");
    expect(html).not.toMatch(/>0<\/span>/);
  });

  it("nennt bei Rot das Label in der Pille und im ARIA-Text", () => {
    const html = renderToStaticMarkup(<ScoreRing score={45} />);
    expect(html).toContain(">Rot – keine Empfehlung</span>");
    expect(html).toContain('aria-label="Gesamtwertung: 45 von 100 Punkten – Rot – keine Empfehlung"');
  });
});
