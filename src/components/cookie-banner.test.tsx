// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_AT_KEY, CONSENT_KEY, VISITOR_KEY, consentScript, entscheidungAktuell } from "@/lib/consent";
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
    expect(h.textContent).toContain("Wir verwenden technisch notwendige Speicherungen (z. B. Ihre Farbschema-Wahl) und eine cookiefreie Reichweitenmessung. Mit „Zustimmen“ erlauben Sie zusätzlich die Live-Anzeige „Gäste online“ unten auf der Seite; dafür speichert Ihr Browser eine zufällige Kennung und sendet sie an unseren Server. Ihre Wahl können Sie jederzeit unter „Datenschutz-Einstellungen“ unten auf jeder Seite ändern. Details in der Datenschutzerklärung.");
    expect([...h.querySelectorAll("button")].map((b) => b.textContent)).toEqual(["Zustimmen", "Nur notwendige"]);
    expect(h.textContent).not.toContain("Verstanden");
  });
  it("beide Buttons sind gleich gestaltet (kein bevorzugter Button)", () => {
    const h = mount(<CookieBanner />);
    const [a, b] = [...h.querySelectorAll("button")];
    expect(a.className).toBe(b.className);
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

describe("Hinweis erscheint nach 182 Tagen erneut", () => {
  const TAG = 24 * 3600_000;
  const lauf = () => { document.documentElement.className = ""; new Function(consentScript)(); return document.documentElement.classList.contains("fp-consent"); };
  it.each(["all", "essential"])("„%s“: nach einem Monat bleibt der Hinweis ausgeblendet", (wahl) => {
    localStorage.setItem(CONSENT_KEY, wahl);
    localStorage.setItem(CONSENT_AT_KEY, String(Date.now() - 30 * TAG));
    expect(lauf()).toBe(true);
    expect(entscheidungAktuell()).toBe(true);
  });
  it.each(["all", "essential"])("„%s“: nach 182 Tagen erscheint er wieder, die bisherige Entscheidung bleibt in Kraft", (wahl) => {
    localStorage.setItem(CONSENT_KEY, wahl);
    localStorage.setItem(CONSENT_AT_KEY, String(Date.now() - 183 * TAG));
    expect(lauf()).toBe(false);
    expect(entscheidungAktuell()).toBe(false);
    expect(localStorage.getItem(CONSENT_KEY)).toBe(wahl);
  });
  it("Grenze: 181 Tage gültig, 182 Tage abgelaufen", () => {
    localStorage.setItem(CONSENT_KEY, "all");
    localStorage.setItem(CONSENT_AT_KEY, String(Date.now() - 181 * TAG));
    expect(lauf()).toBe(true);
    localStorage.setItem(CONSENT_AT_KEY, String(Date.now() - 182 * TAG - 1000));
    expect(lauf()).toBe(false);
  });
  it("ohne Zeitpunkt oder mit Zeitpunkt in der Zukunft erscheint der Hinweis", () => {
    localStorage.setItem(CONSENT_KEY, "essential");
    expect(lauf()).toBe(false);
    localStorage.setItem(CONSENT_AT_KEY, String(Date.now() + 5 * TAG));
    expect(lauf()).toBe(false);
  });
  it("jede neue Wahl setzt den Zeitpunkt auf jetzt", () => {
    const h = mount(<CookieBanner />);
    act(() => knopf(h, "Nur notwendige").click());
    expect(Date.now() - Number(localStorage.getItem(CONSENT_AT_KEY))).toBeLessThan(5000);
    expect(entscheidungAktuell()).toBe(true);
  });
});

describe("Footer und Datenschutzerklärung", () => {
  it("Footer enthält den Link „Datenschutz-Einstellungen“", () => {
    expect(renderToStaticMarkup(<SiteFooter />)).toContain("Datenschutz-Einstellungen");
  });
  it("Abschnitt 3: Absatz zur Live-Anzeige exakt wie von der Rechtsprüfung vorgegeben", () => {
    const html = renderToStaticMarkup(<DatenschutzPage />);
    expect(html).toContain(`<p>Live-Anzeige „Gäste online“: Unten auf der Seite (mobil in der Menüleiste, ab Tablet im Footer) zeigen wir an, wie viele Besucher in den letzten 90 Sekunden eine Seite von Futterprüfer geöffnet hatten. Gezählt werden nur Besucher, die im Datenschutzhinweis „Zustimmen“ gewählt haben; die angezeigte Zahl kann daher niedriger sein als die tatsächliche Besucherzahl. Rechtsgrundlage ist Ihre Einwilligung (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO). Nach Ihrer Zustimmung legt Ihr Browser eine zufällig erzeugte Kennung im lokalen Speicher ab und sendet sie alle 30 Sekunden an unseren Server, solange eine Seite sichtbar ist. Die Kennung ist pseudonym: Sie enthält keine Angaben über Sie, wir ordnen sie keiner Person zu und führen sie nicht mit anderen Daten zusammen. Auf dem Server speichern wir nur die Kennung und den Zeitpunkt der letzten Meldung in unserer Datenbank bei Supabase (Frankfurt am Main, siehe Abschnitt 2) und löschen den Eintrag automatisch, spätestens eine Viertelstunde nach der letzten Meldung. In Ihrem Browser bleibt die Kennung gespeichert, bis Sie Ihre Einwilligung widerrufen oder den Speicher Ihres Browsers löschen. Die Meldung läuft über unseren Hoster Vercel (siehe Abschnitt 2); dabei wird technisch bedingt Ihre IP-Adresse verarbeitet. Für den Zähler speichern wir die IP-Adresse nicht; der Server nutzt sie nur kurzzeitig als gesalzenen Hashwert im Arbeitsspeicher, um Missbrauch des Zählers zu begrenzen (Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist der Schutz der Website vor Überlastung). Ihre Einwilligung ist freiwillig. Sie können sie jederzeit mit Wirkung für die Zukunft widerrufen: über den Link „Datenschutz-Einstellungen“ unten auf jeder Seite und dort „Nur notwendige“. Die Kennung wird dann in Ihrem Browser gelöscht und nicht mehr gesendet.</p>`);
    expect(html).not.toContain("gerade auf Futterprüfer sind");
  });
  it("Abschnitt 4 exakt wie von der Rechtsprüfung vorgegeben", () => {
    const html = renderToStaticMarkup(<DatenschutzPage />);
    expect(html).toContain(`<p>Im lokalen Speicher Ihres Browsers speichern wir Ihre Farbschema-Wahl (hell/dunkel), Ihre Entscheidung im Datenschutzhinweis und den Zeitpunkt dieser Entscheidung. Diese Einträge sind unbedingt erforderlich, damit die Website Ihre Wahl umsetzen und nachweisen kann, wann Sie entschieden haben (§ 25 Abs. 2 Nr. 2 TDDDG). Sie verlassen Ihr Gerät nicht und bleiben gespeichert, bis Sie den Speicher Ihres Browsers löschen. Den Datenschutzhinweis zeigen wir nach sechs Monaten erneut an; bis zu Ihrer neuen Wahl gilt Ihre bisherige Entscheidung. Nur wenn Sie „Zustimmen“ gewählt haben, legt Ihr Browser zusätzlich die zufällige Kennung für die Live-Anzeige „Gäste online“ ab; sie wird an unseren Server gesendet (siehe Abschnitt 3) und bei Widerruf gelöscht.</p>`);
  });
});
