// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_KEY, VISITOR_KEY, writeConsent } from "@/lib/consent";
import { GAESTE_TOOLTIP, OnlineCounter } from "./online-counter";

let root: Root | null = null;
let host: HTMLDivElement | null = null;
beforeAll(() => { (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true; });
beforeEach(() => { localStorage.clear(); document.documentElement.className = ""; });
afterEach(() => { act(() => root?.unmount()); host?.remove(); vi.unstubAllGlobals(); vi.useRealTimers(); });

async function mount(antwort: () => Promise<Response>) {
  const fetchMock = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(() => antwort());
  vi.stubGlobal("fetch", fetchMock);
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
  await act(async () => { root!.render(<OnlineCounter />); await Promise.resolve(); });
  await act(async () => { await Promise.resolve(); });
  return { fetchMock, host };
}
const zustimmen = async () => { await act(async () => { writeConsent("all"); await Promise.resolve(); }); await act(async () => { await Promise.resolve(); }); };
const json = (count: number | null, status = 200) => Promise.resolve(new Response(JSON.stringify({ count }), { status }));

describe("OnlineCounter mit Einwilligung", () => {
  it("ohne Entscheidung: nichts gesendet, nichts gespeichert, nichts sichtbar", async () => {
    const { fetchMock, host: h } = await mount(() => json(9));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(h.innerHTML).toBe("");
    expect(localStorage.getItem(VISITOR_KEY)).toBeNull();
  });
  it("„Nur notwendige“: nichts gesendet, keine Kennung", async () => {
    const { fetchMock, host: h } = await mount(() => json(9));
    await act(async () => { writeConsent("essential"); await Promise.resolve(); });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(localStorage.getItem(VISITOR_KEY)).toBeNull();
    expect(h.innerHTML).toBe("");
  });
  it("nach Zustimmung: Kennung wird angelegt, Zahl mit „Gäste online“ und Tooltip erscheint", async () => {
    const { fetchMock, host: h } = await mount(() => json(23));
    await zustimmen();
    expect(h.textContent).toContain("23 Gäste online");
    expect(h.querySelector(".online-dot")).not.toBeNull();
    expect(h.querySelector("[title]")!.getAttribute("title")).toBe(GAESTE_TOOLTIP);
    expect(GAESTE_TOOLTIP).toBe("gezählt: Gäste der letzten 90 Sekunden, die der Anzeige zugestimmt haben");
    const id = localStorage.getItem(VISITOR_KEY)!;
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/online");
    expect(JSON.parse(String(init!.body))).toEqual({ id });
    expect(document.cookie).toBe("");
  });
  it("Einzahl", async () => {
    const { host: h } = await mount(() => json(1));
    await zustimmen();
    expect(h.textContent).toContain("1 Gast online");
  });
  it("jeder Tab sendet dieselbe Kennung (ein Gast zählt einmal)", async () => {
    localStorage.setItem(CONSENT_KEY, "all");
    const a = await mount(() => json(2));
    const idA = JSON.parse(String(a.fetchMock.mock.calls[0][1]!.body)).id;
    act(() => root?.unmount());
    a.host.remove();
    const b = await mount(() => json(2));
    expect(JSON.parse(String(b.fetchMock.mock.calls[0][1]!.body)).id).toBe(idA);
  });
  it("Widerruf: sofort ausgeblendet, Kennung gelöscht, keine weiteren Meldungen", async () => {
    vi.useFakeTimers();
    const { fetchMock, host: h } = await mount(() => json(7));
    await zustimmen();
    expect(h.textContent).toContain("7 Gäste online");
    const vorher = fetchMock.mock.calls.length;
    await act(async () => { writeConsent("essential"); await Promise.resolve(); });
    expect(h.innerHTML).toBe("");
    expect(localStorage.getItem(VISITOR_KEY)).toBeNull();
    await act(async () => { await vi.advanceTimersByTimeAsync(120_000); });
    expect(fetchMock.mock.calls.length).toBe(vorher);
  });
  it("Widerruf in einem anderen Tab (storage-Ereignis) stoppt den Zähler ebenfalls", async () => {
    const { host: h } = await mount(() => json(4));
    await zustimmen();
    expect(h.textContent).toContain("4 Gäste");
    localStorage.setItem(CONSENT_KEY, "essential");
    await act(async () => { window.dispatchEvent(new StorageEvent("storage", { key: CONSENT_KEY })); await Promise.resolve(); });
    expect(h.innerHTML).toBe("");
  });
  it("bei Fehler oder fehlender Antwort bleibt nichts sichtbar (keine erfundene Zahl)", async () => {
    const a = await mount(() => json(null, 503));
    await zustimmen();
    expect(a.host.innerHTML).toBe("");
    act(() => root?.unmount());
    a.host.remove();
    const b = await mount(() => Promise.reject(new Error("offline")));
    expect(b.host.innerHTML).toBe("");
  });
  it("meldet sich alle 30 Sekunden erneut", async () => {
    vi.useFakeTimers();
    localStorage.setItem(CONSENT_KEY, "all");
    const { fetchMock } = await mount(() => json(7));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await act(async () => { await vi.advanceTimersByTimeAsync(30_000); });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
