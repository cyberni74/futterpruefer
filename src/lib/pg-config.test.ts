import { describe, expect, it } from "vitest";
import { pgConfig } from "./pg-config";

describe("pgConfig", () => {
  it("lokal ohne SSL", () => {
    expect(pgConfig("postgresql://a:b@localhost:5432/x").ssl).toBeUndefined();
    expect(pgConfig("kaputt").ssl).toBeUndefined();
  });
  it("entfernt mit TLS und kleinem Pool", () => {
    const c = pgConfig("postgres://prisma.ref:pw@aws-1-eu-central-1.pooler.supabase.com:6543/postgres");
    expect(c.ssl).toEqual({ rejectUnauthorized: false });
    expect(c.max).toBe(3);
  });
});
