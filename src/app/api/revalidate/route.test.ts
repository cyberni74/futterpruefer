import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const revalidatePath = vi.hoisted(() => vi.fn());
vi.mock("next/cache", () => ({ revalidatePath }));
const findMany = vi.hoisted(() => vi.fn());
vi.mock("@/lib/db", () => ({ prisma: { review: { findMany } } }));

import { POST } from "./route";

const SECRET = "test-secret-only-for-unit-tests-0123456789";
const call = (body: unknown, auth: string | null = `Bearer ${SECRET}`, raw?: string) =>
  POST(new Request("http://localhost/api/revalidate", { method: "POST", headers: { "content-type": "application/json", ...(auth ? { authorization: auth } : {}) }, body: raw ?? JSON.stringify(body) }));

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    revalidatePath.mockReset();
    findMany.mockReset().mockResolvedValue([]);
    process.env.REVALIDATE_SECRET = SECRET;
  });

  it("antwortet 503, solange kein Secret eingerichtet ist (auch mit Token)", async () => {
    delete process.env.REVALIDATE_SECRET;
    expect((await call({ all: true })).status).toBe(503);
    process.env.REVALIDATE_SECRET = "zu-kurz";
    expect((await call({ all: true }, "Bearer zu-kurz")).status).toBe(503);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("antwortet 401 ohne, mit falschem oder anders geformtem Token und revalidiert nichts", async () => {
    for (const auth of [null, "Bearer falsch", `Bearer ${SECRET}x`, SECRET, "Basic abc", "Bearer "]) expect((await call({ all: true }, auth)).status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("antwortet 400 bei ungültigem JSON oder Body", async () => {
    expect((await call(null, undefined, "{kaputt")).status).toBe(400);
    expect((await call({ kind: "blog", slug: "A B" })).status).toBe(400);
    expect((await call({ paths: ["/admin"] })).status).toBe(400);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("revalidiert einen Blogbeitrag samt /blog, Startseite und Sitemap", async () => {
    const res = await call({ kind: "blog", slug: "nasenbalsam-hund-selber-machen" });
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    const body = await res.json();
    expect(body.revalidated).toEqual(["/", "/sitemap.xml", "/rss.xml", "/blog", "/blog/nasenbalsam-hund-selber-machen"]);
    for (const p of ["/", "/sitemap.xml", "/blog", "/blog/nasenbalsam-hund-selber-machen"]) expect(revalidatePath).toHaveBeenCalledWith(p);
  });

  it("findet die Kategorie eines Tests selbst (nur lesend) und revalidiert die genaue Seite", async () => {
    findMany.mockResolvedValue([{ slug: "leonardo-adult-gf-poultry-test", category: { slug: "alleinfuttermittel-katze" } }]);
    const res = await call({ kind: "review", slug: "leonardo-adult-gf-poultry-test" });
    expect(res.status).toBe(200);
    expect(findMany).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith("/alleinfuttermittel-katze/leonardo-adult-gf-poultry-test");
    expect(revalidatePath).toHaveBeenCalledWith("/tests");
    expect(revalidatePath).toHaveBeenCalledWith("/[kategorie]/[slug]", "page");
  });

  it("revalidiert auch ohne lesbare Kategorie das Muster für alle Tests", async () => {
    findMany.mockRejectedValue(new Error("db down"));
    const res = await call({ kind: "review", slug: "x-test" });
    expect(res.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith("/[kategorie]/[slug]", "page");
  });

  it("unterstützt all und freie Seitenpfade", async () => {
    expect((await call({ all: true })).status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    revalidatePath.mockClear();
    expect((await call({ paths: ["/marken/animonda"] })).status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith("/marken/animonda");
  });
});
