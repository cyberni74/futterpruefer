import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({ upsert: vi.fn(), count: vi.fn(), deleteMany: vi.fn() }));
vi.mock("@/lib/db", () => ({ prisma: { liveVisitor: db } }));
import { POST } from "./route";

const req = (body: unknown, ip = "1.2.3.4") => new Request("http://x/api/online", { method: "POST", headers: { "x-forwarded-for": ip, "content-type": "application/json" }, body: typeof body === "string" ? body : JSON.stringify(body) });
const ID = "3b241101-e2bb-4255-8caf-4136c566a962";

beforeEach(() => { vi.clearAllMocks(); db.count.mockResolvedValue(18); db.upsert.mockResolvedValue({}); });

describe("POST /api/online", () => {
  it("speichert nur ID und Zeit und liefert die gezählte Zahl", async () => {
    const r = await POST(req({ id: ID }, "10.0.0.1"));
    expect(r.status).toBe(200);
    expect(await r.json()).toEqual({ count: 18 });
    expect(db.upsert).toHaveBeenCalledWith({ where: { id: ID }, create: { id: ID }, update: { seenAt: expect.any(Date) } });
    expect(r.headers.get("cache-control")).toBe("no-store");
  });
  it("zählt nur das Fenster der letzten 90 Sekunden", async () => {
    await POST(req({ id: ID }, "10.0.0.2"));
    const gte = (db.count.mock.calls[0][0] as { where: { seenAt: { gte: Date } } }).where.seenAt.gte.getTime();
    expect(Date.now() - gte).toBeGreaterThan(89_000);
    expect(Date.now() - gte).toBeLessThan(91_000);
  });
  it("lehnt ungültige Kennungen und kaputtes JSON ab", async () => {
    expect((await POST(req({ id: "<x>" }, "10.0.0.3"))).status).toBe(400);
    expect((await POST(req("{kaputt", "10.0.0.4"))).status).toBe(400);
    expect(db.upsert).not.toHaveBeenCalled();
  });
  it("bremst Missbrauch je Absender", async () => {
    const stati: number[] = [];
    for (let i = 0; i < 10; i++) stati.push((await POST(req({ id: ID }, "10.0.0.5"))).status);
    expect(stati.slice(0, 8).every((s) => s === 200)).toBe(true);
    expect(stati.slice(8)).toEqual([429, 429]);
  });
  it("ohne Tabelle (Migration fehlt) kein Absturz, keine Zahl", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    db.upsert.mockRejectedValue(new Error("relation does not exist"));
    const r = await POST(req({ id: ID }, "10.0.0.6"));
    expect(r.status).toBe(503);
    expect(await r.json()).toEqual({ count: null });
  });
});
