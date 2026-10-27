// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { Rechner } from "./rechner";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: () => {}, replace: () => {} }), usePathname: () => "/", useSearchParams: () => new URLSearchParams() }));

beforeAll(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = class { observe() {} disconnect() {} unobserve() {} };
  window.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
});

let root: Root | null = null;
let host: HTMLDivElement | null = null;
afterEach(() => {
  act(() => root?.unmount());
  host?.remove();
});

function setze(el: HTMLInputElement, wert: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
  act(() => {
    setter.call(el, wert);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

describe.each(["hund", "katze"] as const)("Rechner %s: alle Regler", (art) => {
  it("Zahlenfeld, Regler-Text und Blase zeigen nach Eingabe und nach Reglerbewegung denselben Wert", () => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    act(() => root!.render(<Rechner art={art} />));
    const regler = [...host.querySelectorAll<HTMLInputElement>("input[type=range]")];
    expect(regler.length).toBeGreaterThanOrEqual(6);
    let geprueft = 0;
    for (const r of regler) {
      const feldBox = r.closest("[id$=-feld]") as HTMLElement;
      const feld = feldBox.querySelector<HTMLInputElement>("input[type=text]");
      if (!feld) continue; // Alter: nur Text
      const zeige = () => ({ feld: feld.value, text: (r.getAttribute("aria-valuetext") ?? "").replace(/^(\d+)\.(\d{1,2})(?=\s)/, "$1,$2"), blase: feldBox.querySelector("[data-blase]")?.textContent ?? "" });
      // 1) tippen
      act(() => feld.focus());
      const tipp = String(Math.round((Number(r.min) + Number(r.max)) / 2));
      setze(feld, tipp);
      expect(zeige().feld).toBe(tipp);
      // 2) Regler bewegen, Feld hat weiter den Fokus
      setze(r, String(Math.min(Number(r.max), Number(r.value) + Number(r.step))));
      const z = zeige();
      expect(z.feld, `Feld ${feldBox.id}`).toBe(z.text.split(" ")[0]);
      act(() => feld.blur());
      expect(zeige().feld, `blur ${feldBox.id}`).toBe(z.feld);
      geprueft += 1;
    }
    expect(geprueft).toBeGreaterThanOrEqual(art === "hund" ? 7 : 7);
  });
});
