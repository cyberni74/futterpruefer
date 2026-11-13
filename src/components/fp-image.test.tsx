import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { FpImage } from "./fp-image";

const AMAZON = "https://m.media-amazon.com/images/I/abc._AC_SL1500_.jpg";

describe("FpImage", () => {
  it("lädt Bilder unterhalb des sichtbaren Bereichs lazy und asynchron mit srcset und sizes", () => {
    const html = renderToStaticMarkup(<FpImage src={AMAZON} alt="Packung" sizes="(min-width:1024px) 25vw, 100vw" />);
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('decoding="async"');
    expect(html).toMatch(/srcSet="[^"]*_AC_SL300_[^"]*300w/i);
    expect(html).toContain('sizes="(min-width:1024px) 25vw, 100vw"');
    expect(html).not.toContain("fetchPriority");
  });

  it("lädt das LCP-Bild eager mit fetchpriority high", () => {
    const html = renderToStaticMarkup(<FpImage src={AMAZON} alt="Packung" sizes="100vw" priority />);
    expect(html).toContain('loading="eager"');
    expect(html).toMatch(/fetchPriority="high"/i);
    expect(html).not.toContain('decoding="async"');
  });

  it("setzt width und height aus dem Rahmen, wenn keine Dateimaße bekannt sind", () => {
    const html = renderToStaticMarkup(<FpImage src={AMAZON} alt="Packung" sizes="100vw" frame="4/3" />);
    expect(html).toContain('width="1200"');
    expect(html).toContain('height="900"');
  });

  it("zeigt ohne Bild einen Platzhalter ohne img-Element", () => {
    expect(renderToStaticMarkup(<FpImage src={null} alt="" sizes="100vw" />)).not.toContain("<img");
  });
});
