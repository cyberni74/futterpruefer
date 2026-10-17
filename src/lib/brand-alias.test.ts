import { describe, expect, it } from "vitest";
import { canonicalBrand } from "./brand-alias";

describe("canonicalBrand", () => {
  it("führt Purina-Produktlinien zu einer Marke zusammen", () => {
    expect(canonicalBrand("Purina PRO PLAN")).toBe("Purina");
    expect(canonicalBrand(" purina gourmet ")).toBe("Purina");
    expect(canonicalBrand("Purina")).toBe("Purina");
  });
  it("lässt andere Marken unverändert", () => {
    expect(canonicalBrand("Royal Canin")).toBe("Royal Canin");
    expect(canonicalBrand("mammaly")).toBe("mammaly");
  });
});
