import { afterEach, describe, expect, it, vi } from "vitest";
import { BILDER_DATEINAME, viaVercel } from "./image-hosts";
import { responsiveImage } from "./image-variants";
import { GET } from "../app/bilder/[name]/route";

const SB = "https://cotopvhmsqztjtdsdnoc.supabase.co/storage/v1/object/public/bilder";

describe("viaVercel", () => {
  it("Bucket-Bilder werden zu /bilder/<Datei>, alles andere bleibt", () => {
    expect(viaVercel(`${SB}/acana-adult-small-breed-verpackung.webp`)).toBe("/bilder/acana-adult-small-breed-verpackung.webp");
    expect(viaVercel(`${SB}/x-400.webp`)).toBe("/bilder/x-400.webp");
    expect(viaVercel("https://m.media-amazon.com/images/I/71opMltmbHL._AC_SL500_.jpg")).toBe("https://m.media-amazon.com/images/I/71opMltmbHL._AC_SL500_.jpg");
    expect(viaVercel("/brand/logo.webp")).toBe("/brand/logo.webp");
    expect(viaVercel("https://evil.example/storage/v1/object/public/bilder/a.webp")).toBe("https://evil.example/storage/v1/object/public/bilder/a.webp");
    expect(viaVercel(`${SB}/ordner/a.webp`)).toBe(`${SB}/ordner/a.webp`);
    expect(viaVercel(`${SB}/..%2Fa.webp`)).toBe(`${SB}/..%2Fa.webp`);
    expect(viaVercel("kaputt")).toBe("kaputt");
  });
  it("Dateinamen: nur einzelne Bilddateien", () => {
    for (const ok of ["a.webp", "a-b_c.1.png", "A1.jpeg"]) expect(BILDER_DATEINAME.test(ok), ok).toBe(true);
    for (const bad of ["../a.webp", "a/b.webp", "a..webp", ".htaccess", "a.exe", "a.webp?x=1", "", "a b.webp"]) expect(BILDER_DATEINAME.test(bad), bad).toBe(false);
  });
  it("responsiveImage liefert Bucket-Bilder über /bilder und lässt Amazon unverändert", () => {
    const r = responsiveImage(`${SB}/test-bild.webp`);
    expect(r.src).toBe("/bilder/test-bild.webp");
    expect(r.src).not.toContain("supabase");
    if (r.srcSet) expect(r.srcSet).not.toContain("supabase");
    const a = responsiveImage("https://m.media-amazon.com/images/I/71opMltmbHL._AC_SL1500_.jpg");
    expect(a.src).toContain("m.media-amazon.com");
    expect(a.srcSet).toContain("300w");
  });
});

describe("Route /bilder/[name]", () => {
  afterEach(() => vi.unstubAllGlobals());
  const call = (name: string) => GET(new Request("http://x/bilder/" + name), { params: Promise.resolve({ name }) });
  it("liefert das Bild mit langem Cache", async () => {
    const fetchMock = vi.fn(async () => new Response("BILD", { status: 200, headers: { "content-type": "image/webp" } }));
    vi.stubGlobal("fetch", fetchMock);
    const res = await call("test-bild.webp");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/webp");
    expect(res.headers.get("cache-control")).toContain("s-maxage=604800");
    expect(await res.text()).toBe("BILD");
    expect(fetchMock).toHaveBeenCalledWith(`${SB}/test-bild.webp`, expect.anything());
  });
  it("ungültige Namen werden nicht weitergereicht", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    for (const n of ["../geheim.webp", "a.exe", "a/b.webp"]) expect((await call(n)).status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("gesperrter Speicher (402) oder Fehler: kurz gecachter Fehler, kein Bild", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response('{"message":"restricted"}', { status: 402, headers: { "content-type": "application/json" } })));
    const res = await call("test-bild.webp");
    expect(res.status).toBe(502);
    expect(res.headers.get("cache-control")).toContain("s-maxage=60");
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("netz"); }));
    expect((await call("test-bild.webp")).status).toBe(502);
    vi.stubGlobal("fetch", vi.fn(async () => new Response("x", { status: 404, headers: { "content-type": "image/webp" } })));
    expect((await call("fehlt.webp")).status).toBe(404);
  });
  it("kein Inhalt, der kein Bild ist, wird ausgeliefert", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("<html>", { status: 200, headers: { "content-type": "text/html" } })));
    expect((await call("test-bild.webp")).status).toBe(502);
  });
});
