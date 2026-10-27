// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { hundGewichtPos, hundKgAusPos, hundPosAusKg } from "@/lib/futterrechner/bereiche";
import { ValueSlider } from "./value-slider";

beforeAll(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
});

let root: Root | null = null;
let host: HTMLDivElement | null = null;
afterEach(() => {
  act(() => root?.unmount());
  host?.remove();
  root = null;
});

function mount(node: React.ReactNode) {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
  act(() => root!.render(node));
  return host;
}

/** React hört auf „input“-Ereignisse; der native Setter umgeht die Wert-Verfolgung von React. */
function setzeWert(el: HTMLInputElement, wert: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
  act(() => {
    setter.call(el, wert);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

import { useState } from "react";
function Gewicht({ art }: { art: "hund" | "katze" }) {
  const [v, setV] = useState<number | null>(null);
  return (
    <ValueSlider
      id="g" label="Gewicht" einheit="kg" value={v} onChange={setV}
      min={art === "hund" ? 0.5 : 1} max={art === "hund" ? 80 : 10} step={art === "hund" ? 0.5 : 0.1} platzhalter={art === "hund" ? 15 : 4.5}
      skala={art === "hund" ? { max: hundGewichtPos.max, zuPos: hundPosAusKg, vonPos: hundKgAusPos } : undefined}
      blaseSichtbar
    />
  );
}

const lies = (h: HTMLElement) => {
  const feld = h.querySelector<HTMLInputElement>("input[type=text]")!;
  const regler = h.querySelector<HTMLInputElement>("input[type=range]")!;
  const blase = h.querySelector("[data-blase]")?.textContent ?? null;
  return { feld: feld.value, regler, blase, valuetext: regler.getAttribute("aria-valuetext") };
};

describe.each(["hund", "katze"] as const)("Gewicht-Regler %s: Feld, Regler und Blase zeigen denselben Wert", (art) => {
  it("Eingabe 5 → Feld 5, Blase 5 kg, Regler-Text 5", () => {
    const h = mount(<Gewicht art={art} />);
    const feld = h.querySelector<HTMLInputElement>("input[type=text]")!;
    act(() => feld.focus());
    setzeWert(feld, "5");
    const z = lies(h);
    expect(z.feld).toBe("5");
    expect(z.blase).toBe("5 kg");
    expect(z.valuetext).toBe("5 kg");
  });
  it("Komma und Punkt sind gleichwertig", () => {
    const h = mount(<Gewicht art={art} />);
    const feld = h.querySelector<HTMLInputElement>("input[type=text]")!;
    setzeWert(feld, "5,3");
    const komma = lies(h);
    setzeWert(feld, "5.3");
    const punkt = lies(h);
    expect(punkt.blase).toBe(komma.blase);
    expect(punkt.blase).toBe("5,3 kg");
  });
  it("Regler bewegen, während das Zahlenfeld noch den Fokus hat: Feld folgt (Fehler „Feld 5, Regler 5,5“)", () => {
    const h = mount(<Gewicht art={art} />);
    const feld = h.querySelector<HTMLInputElement>("input[type=text]")!;
    act(() => feld.focus());
    setzeWert(feld, "5");
    const regler = h.querySelector<HTMLInputElement>("input[type=range]")!;
    // Hund: Positionen (9 = 5 kg, 10 = 5,5 kg); Katze: kg direkt
    setzeWert(regler, art === "hund" ? "10" : "5.5");
    const z = lies(h);
    expect(z.blase).toBe("5,5 kg");
    expect(z.feld).toBe("5,5");
    expect(document.activeElement).toBe(feld);
  });
  it("beim Verlassen des Feldes (blur) bleibt der Wert gleich", () => {
    const h = mount(<Gewicht art={art} />);
    const feld = h.querySelector<HTMLInputElement>("input[type=text]")!;
    act(() => feld.focus());
    setzeWert(feld, "7.5");
    act(() => feld.blur());
    const z = lies(h);
    expect(z.feld).toBe("7,5");
    expect(z.blase).toBe("7,5 kg");
  });
  it("mehrere Reglerschritte hintereinander (Pfeiltasten) halten Feld und Blase gleich", () => {
    const h = mount(<Gewicht art={art} />);
    const regler = h.querySelector<HTMLInputElement>("input[type=range]")!;
    const schritte = art === "hund" ? ["3", "4", "5", "6"] : ["3.1", "3.2", "3.3", "3.4"];
    for (const p of schritte) {
      setzeWert(regler, p);
      const z = lies(h);
      expect(`${z.feld} kg`).toBe(z.blase);
    }
  });
});

describe("Ungültige Eingabe", () => {
  it("Buchstaben ändern den Wert nicht und zeigen den Hinweis", () => {
    const h = mount(<Gewicht art="katze" />);
    const feld = h.querySelector<HTMLInputElement>("input[type=text]")!;
    setzeWert(feld, "5");
    setzeWert(feld, "5x");
    expect(lies(h).blase).toBe("5 kg");
    expect(h.textContent).toContain("Bitte eine Zahl eingeben.");
  });
});
void vi;
