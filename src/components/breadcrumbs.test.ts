import { describe, expect, it } from "vitest";
import { breadcrumbList } from "./breadcrumbs";

describe("breadcrumbList", () => {
  it("enthält die aktuelle URL als letztes item", () => {
    const data = breadcrumbList([
      { label: "Tests", href: "/tests" },
      { label: "Medidog", href: "/ergaenzungsfuttermittel-hund/medidog-ulmenrinden-paste" },
    ]);
    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement.map((item) => item.item)).toEqual([
      "https://futterpruefer.de/",
      "https://futterpruefer.de/tests",
      "https://futterpruefer.de/ergaenzungsfuttermittel-hund/medidog-ulmenrinden-paste",
    ]);
  });
});
