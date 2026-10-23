import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({ prisma: {} }));
const { relatedNeighborIds } = await import("@/lib/queries");

describe("relatedNeighborIds", () => {
  const ranked = Array.from({ length: 10 }, (_, i) => `r${i}`);

  it("liefert Nachbarn mit ähnlicher Punktzahl, ohne sich selbst", () => {
    expect(relatedNeighborIds(ranked, "r5", 3)).toEqual(["r4", "r6", "r7"]);
    expect(relatedNeighborIds(ranked, "r0", 3)).toEqual(["r1", "r2", "r9"]);
  });

  it("jeder Test wird von genau 3 anderen Tests verlinkt (keine Waisen)", () => {
    const inbound = new Map<string, number>();
    for (const id of ranked) for (const t of relatedNeighborIds(ranked, id, 3)) inbound.set(t, (inbound.get(t) ?? 0) + 1);
    expect(ranked.every((id) => inbound.get(id) === 3)).toBe(true);
  });

  it("kleine Kategorien: alle anderen", () => {
    expect(relatedNeighborIds(["a", "b", "c"], "b", 3)).toEqual(["a", "c"]);
  });
});
