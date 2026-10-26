/** Auswahl passender Tests für die Ergebnis-Karte. Rein, ohne DB; Filter und Ausschlussliste im Code. */
export const AUSGESCHLOSSEN = ["animagus", "tierliebhaber", "canina", "alfavet", "medidog"];

export type TestKandidat = {
  slug: string;
  title: string;
  brand: string;
  productName: string;
  keyword?: string | null;
  totalScore: number;
  analysis: unknown;
  category: { slug: string; shortName: string; animal: "HUND" | "KATZE" };
};

export function futterartVon(r: Pick<TestKandidat, "analysis" | "title" | "keyword" | "productName">): "trocken" | "nass" | null {
  if (Array.isArray(r.analysis)) {
    for (const row of r.analysis as Array<{ name?: unknown; value?: unknown }>) {
      if (typeof row?.name === "string" && /feucht/i.test(row.name) && typeof row.value === "number") return row.value >= 60 ? "nass" : "trocken";
    }
  }
  const text = `${r.title} ${r.keyword ?? ""} ${r.productName}`.toLowerCase();
  if (/nassfutter|\bnass\b|pastete|\bdose\b|schale|\bpouch/.test(text)) return "nass";
  if (/trockenfutter|\btrocken\b|kroketten/.test(text)) return "trocken";
  return null;
}

export const istAusgeschlossen = (r: Pick<TestKandidat, "brand" | "title" | "productName">) => {
  const text = `${r.brand} ${r.title} ${r.productName}`.toLowerCase();
  return AUSGESCHLOSSEN.some((x) => text.includes(x));
};

/** Gleiche Tierart und Futterart, nur Grün oder Gelb (ab 60 Punkten), höchste Punktzahl zuerst. */
export function passendeTests(list: TestKandidat[], art: "hund" | "katze", futterart: "trocken" | "nass", n = 3): TestKandidat[] {
  return list
    .filter((r) => r.category.animal === (art === "hund" ? "HUND" : "KATZE") && r.totalScore >= 60 && !istAusgeschlossen(r) && futterartVon(r) === futterart)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, n);
}
