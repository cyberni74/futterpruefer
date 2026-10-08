import { describe, expect, it } from "vitest";
import { orderByFor, parseCompareIds, parseFilters } from "./filters";

describe("parseFilters", () => {
  it("Defaults bei leer/null", () => {
    expect(parseFilters(null)).toEqual({ sort: "punkte", preis: null, tier: null, min: 0 });
    expect(parseFilters({})).toEqual({ sort: "punkte", preis: null, tier: null, min: 0 });
  });
  it("ignoriert ungültige Werte", () => {
    expect(parseFilters({ sort: "drop table", preis: "BILLIG", tier: "PFERD", min: "abc" })).toEqual({ sort: "punkte", preis: null, tier: null, min: 0 });
  });
  it("übernimmt gültige Werte und begrenzt min", () => {
    expect(parseFilters({ sort: "neu", preis: "PREMIUM", tier: "KATZE", min: "150" })).toEqual({ sort: "neu", preis: "PREMIUM", tier: "KATZE", min: 100 });
    expect(parseFilters({ sort: ["preis_auf", "neu"] }).sort).toBe("preis_auf");
  });
  it("orderBy", () => expect(orderByFor("punkte")[0]).toEqual({ totalScore: "desc" }));
});

describe("parseCompareIds", () => {
  it("max. 3, eindeutig, sicher", () => {
    expect(parseCompareIds("cabc12345,cabc12345,x';--,cdef67890,cghi11111,cjkl22222")).toEqual(["cabc12345", "cdef67890", "cghi11111"]);
    expect(parseCompareIds(undefined)).toEqual([]);
  });
});
