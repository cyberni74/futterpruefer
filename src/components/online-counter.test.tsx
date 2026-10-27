// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { OnlineCounter } from "./online-counter";

let root: Root | null = null;
let host: HTMLDivElement | null = null;
beforeAll(() => { (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true; });
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
const json = (count: number | null, status = 200) => Promise.resolve(new Response(JSON.stringify({ count }), { status }));

describe("OnlineCounter", () => {
  it("zeigt die vom Server gemeldete Zahl mit leuchtendem Punkt", async () => {
    const { host: h } = await mount(() => json(23));
    expect(h.textContent).toContain("23 Personen gerade online");
    expect(h.querySelector(".online-dot")).not.toBeNull();
  });
  it("Einzahl bei einer Person", async () => {
    const { host: h } = await mount(() => json(1));
    expect(h.textContent).toContain("1 Person gerade online");
  });
  it("sendet nur eine zufällige Kennung, keine weiteren Daten, und nutzt keinen Speicher des Geräts", async () => {
    const { fetchMock } = await mount(() => json(5));
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/online");
    expect(Object.keys(JSON.parse(String(init.body)))).toEqual(["id"]);
    expect(JSON.parse(String(init.body)).id).toMatch(/^[0-9a-f-]{36}$/);
    expect(document.cookie).toBe("");
    expect(window.localStorage.length).toBe(0);
    expect(window.sessionStorage.length).toBe(0);
  });
  it("bei Fehler oder fehlender Antwort bleibt nichts sichtbar (keine erfundene Zahl)", async () => {
    const a = await mount(() => json(null, 503));
    expect(a.host.textContent).toBe("");
    expect(a.host.innerHTML).toBe(""); // kein leeres Element, kein Leerraum unter dem Footer
    act(() => root?.unmount());
    a.host.remove();
    const b = await mount(() => Promise.reject(new Error("offline")));
    expect(b.host.textContent).toBe("");
  });
  it("meldet sich alle 30 Sekunden erneut", async () => {
    vi.useFakeTimers();
    const { fetchMock } = await mount(() => json(7));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await act(async () => { await vi.advanceTimersByTimeAsync(30_000); });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
