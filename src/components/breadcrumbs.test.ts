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
      "https://xn--futterprfer-0hb.de/",
      "https://xn--futterprfer-0hb.de/tests",
      "https://xn--futterprfer-0hb.de/ergaenzungsfuttermittel-hund/medidog-ulmenrinden-paste",
    ]);
  });
});
