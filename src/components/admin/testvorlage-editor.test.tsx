// @vitest-environment jsdom
import { act, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { beispielDaten } from "@/components/testvorlage-v2/fixtures";
import { parseLayoutData } from "@/components/testvorlage-v2/schema";
import { emptyDraft, layoutDataToDraft, type Draft } from "@/lib/admin/testvorlage-form";
import { TestvorlageEditor } from "./testvorlage-editor";

// TipTap braucht im Test kein echtes Rich-Text-Feld
vi.mock("./rich-editor", () => ({ RichEditor: ({ label }: { label?: string }) => <div data-testid="rich">{label}</div> }));

let root: Root | null = null;
let host: HTMLDivElement | null = null;
const stand = { draft: emptyDraft() };
beforeAll(() => { (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true; });
afterEach(() => { act(() => root?.unmount()); host?.remove(); });

function Harness({ start, art }: { start: Draft; art: "ALLEINFUTTER" | "ERGAENZUNGSFUTTER" }) {
  const [d, setD] = useState(start);
  return <TestvorlageEditor draft={d} onChange={(n) => { stand.draft = n; setD(n); }} bewertungsart={art} errors={{}} />;
}
const mount = (start: Draft, art: "ALLEINFUTTER" | "ERGAENZUNGSFUTTER" = "ERGAENZUNGSFUTTER") => {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
  stand.draft = start;
  act(() => root!.render(<Harness start={start} art={art} />));
  return host;
};
/** Abschnitt zu einer Überschrift-ID (die ID sitzt am h2) */
const sec = (h: HTMLElement, id: string) => h.querySelector(`#${id}`)!.closest("section") as HTMLElement;
const klick = (el: Element | null | undefined) => act(() => (el as HTMLElement).click());
const button = (h: HTMLElement, text: string) => [...h.querySelectorAll("button")].find((b) => b.textContent?.includes(text));
const setze = (el: HTMLInputElement | HTMLTextAreaElement, wert: string) => {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  act(() => { Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, wert); el.dispatchEvent(new Event("input", { bubbles: true })); });
};

describe("Admin-Maske der Testvorlage", () => {
  it("zeigt alle Bereiche der Vorlage", () => {
    const h = mount(emptyDraft());
    for (const t of ["Hero", "Kennzahl-Kacheln", "Kriterien", "Kapitel", "Zutaten", "Nährwerte und Dosierung", "Evidenz-Karten", "Herstellerangaben mit Balken", "Preisrechner", "Sicherheit, Vor- und Nachteile", "Fazit (Pollmer-Stil)", "FAQ", "Quellen", "Kauflink, Bildnachweis, ähnliche Tests", "Prüfung vor dem Veröffentlichen", "Testvorlage V2: Import und Export"]) {
      expect(h.textContent).toContain(t);
    }
  });
  it("Vorauswahl Ergänzungsfutter legt 5 Kriterien mit den Maxima 20/30/20/15/15 an", () => {
    const h = mount(emptyDraft());
    klick(button(h, "Vorauswahl: Ergänzungsfutter"));
    expect(stand.draft.kriterien.map((k) => k.max)).toEqual(["20", "30", "20", "15", "15"]);
  });
  it("Vorauswahl Alleinfutter legt 6 Kriterien an", () => {
    const h = mount(emptyDraft(), "ALLEINFUTTER");
    klick(button(h, "Vorauswahl: Alleinfutter"));
    expect(stand.draft.kriterien.map((k) => k.max)).toEqual(["30", "20", "20", "15", "10", "5"]);
  });
  it("Gesamtpunktzahl ist berechnet und nur angezeigt", () => {
    const p = parseLayoutData(beispielDaten(5).data);
    if (!p.ok) throw new Error(p.error);
    const h = mount(layoutDataToDraft(p.data));
    expect(h.textContent).toContain("Gesamtpunktzahl (berechnet)87");
    expect([...h.querySelectorAll("label")].some((l) => l.textContent === "Gesamtpunktzahl")).toBe(false);
  });
  it("Prüfung zeigt Meldungen und wird bei vollständigen Daten grün", () => {
    const leer = mount(emptyDraft());
    expect(sec(leer, "sec-v2-pruefung").querySelector("ul")).not.toBeNull();
    act(() => root?.unmount());
    leer.remove();
    const p = parseLayoutData(beispielDaten(5).data);
    if (!p.ok) throw new Error(p.error);
    const voll = mount(layoutDataToDraft(p.data));
    expect(sec(voll, "sec-v2-pruefung").textContent).toContain("Alles in Ordnung");
  });
  it("Prüfung meldet falsche Summe, fehlenden Amazon-Tag und Sperrwörter", () => {
    const p = parseLayoutData(beispielDaten(5).data);
    if (!p.ok) throw new Error(p.error);
    const d = layoutDataToDraft(p.data);
    d.kriterien[0].punkte = "5";
    d.hero.untertitel = "Das ist Betrug";
    const h = mount(d);
    const t = sec(h, "sec-v2-pruefung").textContent!;
    expect(t).toContain("Sperrliste");
  });
  it("Kapitel, Zutaten und FAQ lassen sich hinzufügen, verschieben und entfernen", () => {
    const h = mount(emptyDraft());
    klick(button(h, "Kapitel hinzufügen"));
    klick(button(h, "Kapitel hinzufügen"));
    expect(stand.draft.kapitel).toHaveLength(2);
    const titel = sec(h, "sec-v2-kapitel").querySelectorAll<HTMLInputElement>("fieldset input");
    setze(titel[0], "Erstes");
    setze(sec(h, "sec-v2-kapitel").querySelectorAll<HTMLInputElement>("fieldset input")[1], "Zweites");
    klick(sec(h, "sec-v2-kapitel").querySelectorAll("fieldset")[1].querySelector('button[aria-label="Nach oben"]'));
    expect(stand.draft.kapitel.map((k) => k.titel)).toEqual(["Zweites", "Erstes"]);
    klick(sec(h, "sec-v2-kapitel").querySelector('button[aria-label="Entfernen"]'));
    expect(stand.draft.kapitel).toHaveLength(1);
    klick(button(h, "Frage hinzufügen"));
    klick(button(h, "Zutat hinzufügen"));
    expect(stand.draft.faq).toHaveLength(1);
    expect(stand.draft.zutaten).toHaveLength(1);
  });
  it("Preisrechner-Felder erscheinen erst nach Aktivierung", () => {
    const h = mount(emptyDraft());
    expect(h.textContent).not.toContain("Tagesdosis je kg Körpergewicht");
    klick(sec(h, "sec-v2-preis").querySelector('input[type="checkbox"]'));
    expect(h.textContent).toContain("Tagesdosis je kg Körpergewicht");
    for (const o of ["Stück", "Gramm", "Kilogramm"]) expect(h.querySelector("#pr-einheit")!.textContent).toContain(o);
  });
  it("Import füllt das Formular, ungültige Datei zeigt Fehler", async () => {
    const h = mount(emptyDraft());
    const input = h.querySelector<HTMLInputElement>("#v2-import")!;
    const file = (text: string, name = "vorlage-daten.json") => new File([text], name, { type: "application/json" });
    const feuer = async (f: File) => {
      Object.defineProperty(input, "files", { value: [f], configurable: true });
      await act(async () => { input.dispatchEvent(new Event("change", { bubbles: true })); await new Promise((r) => setTimeout(r, 20)); });
    };
    await feuer(file(JSON.stringify(beispielDaten(5).data)));
    expect(stand.draft.kriterien).toHaveLength(5);
    expect(sec(h, "sec-v2-io").textContent).toContain("eingelesen");
    await feuer(file("{kaputt"));
    expect(sec(h, "sec-v2-io").querySelector('[role="alert"]')!.textContent).toContain("kein gültiges JSON");
  });
});
