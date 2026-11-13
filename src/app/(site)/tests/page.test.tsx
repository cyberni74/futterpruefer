import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/review-listing", () => ({ ReviewListing: () => null }));
vi.mock("@/lib/queries", () => ({
  getCategories: vi.fn(async () => []),
  getPublishedCounts: vi.fn(async () => ({ tests: 165, posts: 40 })),
}));

import { generateMetadata } from "./page";

describe("Metadaten /tests", () => {
  it("nennt Tierart, Jahr und die Zahl veröffentlichter Tests, abgerundet auf Zehner", async () => {
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("Futtertests Hund & Katze 2026");
    expect(metadata.description).toBe("Alle Futtertests für Hund und Katze: über 160 Produkte mit Punkten und Ampel, von Grün bis Rot. Filtern nach Tierart, Preisklasse und Punkten.");
    expect((metadata.description as string).length).toBeLessThanOrEqual(155);
    expect(metadata.alternates?.canonical).toBe("/tests");
  });
});
