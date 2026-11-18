import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Gauge } from "./Gauge";

describe("Gauge", () => {
  it("setzt 91,8 und /100 in zwei Zeilen, damit die Zahl im Bogen bleibt", () => {
    const h = renderToStaticMarkup(<Gauge punkte={91.8} max={100} gross methodikVersion="ergaenzung-v1.1" />);
    expect(h).toContain("aria-label=\"91,8 von 100 Punkten\"");
    expect(h).toContain(">91,8</text>");
    expect(h).toContain(">/100</text>");
    expect(h).not.toContain('font-size="44"');
    expect(h).toContain('font-size="32"');
    expect(h).toContain('y="76"');
    expect(h).toContain('y="96"');
  });

  it("formatiert auch ganze Punkte ohne Nachkommastelle", () => {
    const h = renderToStaticMarkup(<Gauge punkte={71} max={100} gross />);
    expect(h).toContain(">71</text>");
    expect(h).toContain(">/100</text>");
  });
});
