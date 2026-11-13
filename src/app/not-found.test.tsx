import { describe, expect, it } from "vitest";
import { metadata } from "./not-found";

describe("404-Metadaten", () => {
  it("setzt kein Canonical auf die Startseite und bleibt noindex", () => {
    expect(metadata.alternates?.canonical).toBeNull();
    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.title).toBe("Seite nicht gefunden");
  });
});
