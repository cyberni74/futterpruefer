/**
 * Macht reine Text-URLs (z. B. Quellenangaben) klickbar und zeigt sie gekürzt an
 * (10 Zeichen + „…“), damit lange Links weder Editor noch Seite verbreitern.
 * Links, deren sichtbarer Text eine komplette URL ist, werden ebenfalls gekürzt.
 * Zeilenumbrüche im Fließtext (aus eingefügtem Text) werden zu <br>.
 * Erwartet bereits bereinigtes HTML; idempotent.
 */
const SKIP_TAGS = new Set(["a", "code", "pre", "script", "style", "button", "textarea"]);
const URL_RE = /\bhttps?:\/\/[^\s<>"']+/gi;
const TRAILING = /[.,;:!?)\]}»“"']+$/;

export const LINK_TEXT_MAX = 10;

export function shortUrl(url: string, max = LINK_TEXT_MAX): string {
  const plain = url.replace(/&amp;/g, "&").replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");
  return plain.length > max ? `${plain.slice(0, max)}…` : plain;
}

const esc = (s: string) => s.replace(/&(?!amp;|lt;|gt;|quot;|#\d+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function autolinkUrls(html: string | null | undefined): string {
  if (!html) return "";
  const stack: string[] = [];
  return html.replace(/(<[^>]+>)|([^<]+)/g, (_m, tag: string | undefined, text: string | undefined) => {
    if (tag) {
      const mt = /^<\s*(\/)?\s*([a-zA-Z0-9]+)/.exec(tag);
      if (mt && SKIP_TAGS.has(mt[2].toLowerCase()) && !/\/\s*>$/.test(tag)) {
        if (mt[1]) {
          const i = stack.lastIndexOf(mt[2].toLowerCase());
          if (i !== -1) stack.splice(i, 1);
        } else stack.push(mt[2].toLowerCase());
      }
      return tag;
    }
    if (!text) return "";
    if (stack.length) {
      // sichtbarer Linktext = komplette URL → kürzen (Ziel bleibt im href)
      return stack[stack.length - 1] === "a" && /^\s*https?:\/\/\S+\s*$/i.test(text) ? esc(shortUrl(text.trim())) : text;
    }
    return text
      .replace(URL_RE, (raw) => {
        const tail = raw.match(TRAILING)?.[0] ?? "";
        const url = tail ? raw.slice(0, -tail.length) : raw;
        if (url.length < 12) return raw;
        return `<a href="${esc(url)}" class="src-link" target="_blank" rel="noopener nofollow" title="${esc(url)}">${esc(shortUrl(url))}</a>${tail}`;
      })
      .replace(/(\S)[ \t]*\r?\n\s*(?=\S)/g, "$1<br>");
  });
}
