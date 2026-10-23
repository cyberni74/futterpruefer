/**
 * Mobile Tabellen-Beschriftung: ergänzt an jeder <td> ohne data-label das Label aus der
 * passenden Spaltenüberschrift im <thead>. Das CSS zeigt es mobil per attr(data-label) an,
 * so braucht kein Vergleichstest fest verdrahtete Spaltennamen. Läuft auf bereits
 * bereinigtem HTML; Tabellen mit colspan oder ohne <thead> bleiben unverändert.
 */
const escapeAttr = (s: string) => s.replace(/&(?!(?:amp|lt|gt|quot|#\d+|#x[0-9a-f]+);)/gi, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const cellText = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export function labelTableCells(html: string): string {
  if (!html || !html.includes("<thead")) return html;
  return html.replace(/<table\b[^>]*>[\s\S]*?<\/table>/gi, (table) => {
    if (/\bcolspan=/i.test(table)) return table;
    const head = table.match(/<thead\b[^>]*>([\s\S]*?)<\/thead>/i);
    if (!head) return table;
    const labels = [...head[1].matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/gi)].map((m) => cellText(m[1]));
    if (!labels.length) return table;
    return table.replace(/(<tbody\b[^>]*>)([\s\S]*?)(<\/tbody>)/gi, (_m, open: string, body: string, close: string) =>
      open +
      body.replace(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi, (row) => {
        let i = 0;
        return row.replace(/<(td|th)\b([^>]*)>/gi, (tag, name: string, attrs: string) => {
          const label = labels[i++];
          if (!label || /\bdata-label=/i.test(attrs)) return tag;
          return `<${name}${attrs} data-label="${escapeAttr(label)}">`;
        });
      }) +
      close,
    );
  });
}
