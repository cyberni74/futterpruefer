import { describe, expect, it } from "vitest";
import { labelTableCells } from "./table-labels";
import { sanitize } from "./sanitize";

const table = (head: string, row: string) => `<table class="vt-table"><thead><tr>${head}</tr></thead><tbody><tr>${row}</tr></tbody></table>`;

describe("labelTableCells", () => {
  it("übernimmt die Spaltenüberschrift je Zelle", () => {
    const out = labelTableCells(table("<th>Platz</th><th>€/Tag (10 kg)</th>", "<td>1</td><td>0,05 €</td>"));
    expect(out).toContain('<td data-label="Platz">1</td>');
    expect(out).toContain('<td data-label="€/Tag (10 kg)">0,05 €</td>');
  });
  it("lässt vorhandene data-label stehen", () => {
    expect(labelTableCells(table("<th>A</th>", '<td data-label="X">1</td>'))).toContain('data-label="X"');
  });
  it("escaped Anführungszeichen und Tags", () => {
    expect(labelTableCells(table('<th><strong>„A" &amp; B</strong></th>', "<td>1</td>"))).toContain('data-label="„A&quot; &amp; B"');
  });
  it("ignoriert Tabellen ohne thead oder mit colspan", () => {
    const plain = "<table><tbody><tr><td>1</td></tr></tbody></table>";
    expect(labelTableCells(plain)).toBe(plain);
    const span = table("<th>A</th><th>B</th>", '<td colspan="2">1</td>');
    expect(labelTableCells(span)).toBe(span);
  });
  it("sanitize behält data-label an td und füllt fehlende auf, entfernt andere data-*", () => {
    const out = sanitize(table("<th>Rind</th><th>Preis</th>", '<td data-label="Rind" data-x="1">68 %</td><td>5 €</td>'));
    expect(out).toContain('data-label="Rind"');
    expect(out).toContain('data-label="Preis"');
    expect(out).not.toContain("data-x");
  });
});
