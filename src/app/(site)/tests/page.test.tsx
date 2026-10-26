import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/review-listing", () => ({ ReviewListing: () => null }));
vi.mock("@/lib/queries", () => ({ getCategories: vi.fn(async () => []) }));

import { metadata } from "./page";

describe("Metadaten /tests", () => {
  it("nennt Tierart, Jahr und die geprüfte Beschreibung", () => {
    expect(metadata.title).toBe("Futtertests Hund & Katze 2026");
    expect(metadata.description).toBe("Alle Futtertests für Hund und Katze: über 110 Produkte mit Punkten und Ampel, von Grün bis Rot. Filtern nach Tierart, Preisklasse und Punkten.");
    expect((metadata.description as string).length).toBeLessThanOrEqual(155);
    expect(metadata.alternates?.canonical).toBe("/tests");
  });
});
