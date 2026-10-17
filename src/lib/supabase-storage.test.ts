import { afterEach, describe, expect, it, vi } from "vitest";
import { uploadPublicImage } from "./supabase-storage";

const HOST = "https://cotopvhmsqztjtdsdnoc.supabase.co";
const KEY = "sb_secret_test_only";
const NAME = "rinti-kennerfleisch-abc123.webp";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function readyEnv() {
  vi.stubEnv("SUPABASE_URL", HOST);
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", KEY);
}

describe("uploadPublicImage", () => {
  it("meldet fehlende Variablen, ohne den Speicher aufzurufen", async () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const result = await uploadPublicImage(NAME, Buffer.from("webp"));
    expect(result).toEqual({
      error: "Der Bildspeicher ist nicht eingerichtet. Bitte setzen Sie SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY.",
      status: 503,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("verwirft einen Schlüssel mit Zeilenumbruch", async () => {
    vi.stubEnv("SUPABASE_URL", HOST);
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", `${KEY}\r\nX-Injected: 1`);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await uploadPublicImage(NAME, Buffer.from("webp"))).toMatchObject({ status: 503 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sendet den Schlüssel nicht an einen anderen Host", async () => {
    vi.stubEnv("SUPABASE_URL", "https://evil.example");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", KEY);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const result = await uploadPublicImage(NAME, Buffer.from("webp"));
    expect(result).toMatchObject({ status: 503 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("lädt per apikey und Bearer und baut die öffentliche URL selbst", async () => {
    readyEnv();
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const body = Buffer.from("webp-bytes");
    const result = await uploadPublicImage(NAME, body);
    expect(result).toEqual({ url: `${HOST}/storage/v1/object/public/bilder/${NAME}` });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`${HOST}/storage/v1/object/bilder/${NAME}`);
    expect(url).not.toContain(KEY);
    const headers = init.headers as Record<string, string>;
    expect(headers.apikey).toBe(KEY);
    expect(headers.Authorization).toBe(`Bearer ${KEY}`);
    expect(headers["Content-Type"]).toBe("image/webp");
    expect(headers["x-upsert"]).toBe("false");
    expect(init.method).toBe("POST");
  });

  it("loggt bei einem Speicherfehler weder Schlüssel noch Antwort", async () => {
    readyEnv();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(async () => new Response(KEY, { status: 500 })));
    const result = await uploadPublicImage(NAME, Buffer.from("webp"));
    expect(result).toEqual({ error: "Speichern des Bildes fehlgeschlagen.", status: 500 });
    expect(spy.mock.calls.flat().join(" ")).not.toContain(KEY);
  });

  it("lehnt zu große Dateien und unsichere Namen ab", async () => {
    readyEnv();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await uploadPublicImage("../geheim.webp", Buffer.from("a"))).toMatchObject({ status: 400 });
    expect(await uploadPublicImage(NAME, Buffer.alloc(5 * 1024 * 1024 + 1))).toMatchObject({ status: 413 });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
