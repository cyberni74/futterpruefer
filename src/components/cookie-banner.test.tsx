// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_AT_KEY, CONSENT_KEY, VISITOR_KEY, consentScript, heuteEntschieden } from "@/lib/consent";
import { ConsentSettingsLink } from "./consent-settings-link";
import { CookieBanner } from "./cookie-banner";
import { SiteFooter } from "./site-footer";
import DatenschutzPage from "@/app/(site)/datenschutz/page";

vi.mock("./logo", () => ({ Logo: () => null }));
vi.mock("next/link", () => ({ default: ({ href, children, ...r }: { href: string; children: React.ReactNode }) => <a href={href} {...r}>{children}</a> }));

let root: Root | null = null;
let host: HTMLDivElement | null = null;
beforeAll(() => { (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true; window.scrollTo = () => {}; });
beforeEach(() => { localStorage.clear(); document.documentElement.className = ""; });
afterEach(() => { act(() => root?.unmount()); host?.remove(); });
const mount = (node: React.ReactNode) => { host = document.createElement("div"); document.body.appendChild(host); root = createRoot(host); act(() => root!.render(node)); return host; };
const knopf = (h: HTMLElement, t: string) => [...h.querySelectorAll("button")].find((b) => b.textContent === t)!;

describe("Datenschutzhinweis", () => {
  it("Text und Buttons wie freigegeben", () => {
    const h = mount(<CookieBanner />);
    expect(h.textContent).toContain("Wir verwenden technisch notwendige Speicherungen (z. B. Ihre Farbschema-Wahl) und eine cookiefreie Reichweitenmessung. Mit „Zustimmen“ erlauben Sie zusätzlich die Live-Anzeige der Gäste im Footer, für die Ihr Browser eine zufällige Kennung speichert und sendet. Details in der Datenschutzerklärung.");
    expect([...h.querySelectorAll("button")].map((b) => b.textContent)).toEqual(["Zustimmen", "Nur notwendige"]);
    expect(h.textContent).not.toContain("Verstanden");
  });
  it("Zustimmen speichert „all“ und schließt den Hinweis", () => {
    const h = mount(<CookieBanner />);
    act(() => knopf(h, "Zustimmen").click());
    expect(localStorage.getItem(CONSENT_KEY)).toBe("all");
    expect(h.querySelector("#fp-cookie")).toBeNull();
  });
  it("Nur notwendige speichert „essential“ und löscht eine vorhandene Kennung", () => {
    localStorage.setItem(VISITOR_KEY, "abcdefabcdefabcdefabcdef");
    const h = mount(<CookieBanner />);
    act(() => knopf(h, "Nur notwendige").click());
    expect(localStorage.getItem(CONSENT_KEY)).toBe("essential");
    expect(localStorage.getItem(VISITOR_KEY)).toBeNull();
  });
  it("Widerruf: „Datenschutz-Einstellungen“ öffnet den Hinweis wieder, die neue Wahl löscht die Kennung", () => {
    const h = mount(<><CookieBanner /><ConsentSettingsLink /></>);
    act(() => knopf(h, "Zustimmen").click());
    expect(h.querySelector("#fp-cookie")).toBeNull();
    localStorage.setItem(VISITOR_KEY, "abcdefabcdefabcdefabcdef");
    act(() => knopf(h, "Datenschutz-Einstellungen").click());
    expect(h.querySelector("#fp-cookie")).not.toBeNull();
    expect(document.documentElement.classList.contains("fp-consent")).toBe(false);
    act(() => knopf(h, "Nur notwendige").click());
    expect(localStorage.getItem(VISITOR_KEY)).toBeNull();
    expect(localStorage.getItem(CONSENT_KEY)).toBe("essential");
  });
});

describe("Hinweis einmal pro Tag", () => {
  const lauf = () => { document.documentElement.className = ""; new Function(consentScript)(); return document.documentElement.classList.contains("fp-consent"); };
  it("heute entschieden: Hinweis bleibt ausgeblendet", () => {
    localStorage.setItem(CONSENT_KEY, "all");
    localStorage.setItem(CONSENT_AT_KEY, String(Date.now()));
    expect(lauf()).toBe(true);
    expect(heuteEntschieden()).toBe(true);
  });
  it("gestern entschieden: Hinweis erscheint wieder, die bisherige Entscheidung bleibt in Kraft", () => {
    localStorage.setItem(CONSENT_KEY, "all");
    localStorage.setItem(CONSENT_AT_KEY, String(Date.now() - 36 * 3600_000));
    expect(lauf()).toBe(false);
    expect(heuteEntschieden()).toBe(false);
    expect(localStorage.getItem(CONSENT_KEY)).toBe("all");
  });
  it("ohne Zeitpunkt (nie entschieden) erscheint der Hinweis", () => {
    localStorage.setItem(CONSENT_KEY, "essential");
    expect(lauf()).toBe(false);
    expect(heuteEntschieden()).toBe(false);
  });
  it("jede neue Wahl setzt den Zeitpunkt auf jetzt", () => {
    const h = mount(<CookieBanner />);
    act(() => knopf(h, "Nur notwendige").click());
    expect(Date.now() - Number(localStorage.getItem(CONSENT_AT_KEY))).toBeLessThan(5000);
    expect(heuteEntschieden()).toBe(true);
  });
});

describe("Footer und Datenschutzerklärung", () => {
  it("Footer enthält den Link „Datenschutz-Einstellungen“", () => {
    expect(renderToStaticMarkup(<SiteFooter />)).toContain("Datenschutz-Einstellungen");
  });
  it("Abschnitt 3: zweiter Absatz exakt wie von der Rechtsprüfung vorgegeben", () => {
    const html = renderToStaticMarkup(<DatenschutzPage />);
    const soll = "Im Footer zeigen wir an, wie viele Gäste gerade auf Futterprüfer sind. Das geschieht nur, wenn Sie im Datenschutzhinweis „Zustimmen“ gewählt haben (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO). Dann legt Ihr Browser eine zufällige Kennung im lokalen Speicher ab und sendet sie alle 30 Sekunden an unseren Server, solange eine Seite sichtbar ist. Wir speichern die Kennung mit einem Zeitstempel in unserer Datenbank bei Supabase (siehe Abschnitt 2), ordnen sie keiner Person zu und löschen sie nach spätestens zehn Minuten. Ihre IP-Adresse speichern wir dafür nicht; der Server verwendet sie nur kurz im Arbeitsspeicher, um Missbrauch des Zählers zu begrenzen, und protokolliert sie nicht (Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist der Schutz der Website vor Überlastung). Ihre Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen, über den Link „Datenschutz-Einstellungen“ unten auf jeder Seite; die Kennung wird dann gelöscht.";
    expect(html).toContain(`<p>${soll}</p>`);
  });
  it("Abschnitt 4 nennt die Zähler-Kennung nur nach Einwilligung", () => {
    const html = renderToStaticMarkup(<DatenschutzPage />);
    expect(html).toContain("Nur wenn Sie „Zustimmen“ gewählt haben, legt Ihr Browser zusätzlich die zufällige Kennung für die Live-Anzeige der Gäste ab");
    expect(html).not.toContain("ausschließlich Ihre Farbschema-Wahl");
  });
});
