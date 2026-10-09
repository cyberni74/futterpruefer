import sanitizeHtml from "sanitize-html";

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h2", "h3", "h4", "p", "br", "hr", "strong", "b", "em", "i", "u", "s", "mark", "sup", "sub",
    "ul", "ol", "li", "blockquote", "a", "img", "figure", "figcaption",
    "table", "thead", "tbody", "tr", "th", "td", "code", "pre", "span", "div",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "width", "height", "loading"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    "*": ["class", "id"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"] },
  allowProtocolRelative: false,
  transformTags: {
    h1: "h2",
    a: (tagName, attribs) => {
      const external = /^https?:\/\//.test(attribs.href ?? "");
      return {
        tagName,
        attribs: external ? { ...attribs, target: "_blank", rel: "noopener noreferrer nofollow" } : attribs,
      };
    },
    img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
  },
};

/** Unsichtbare Zeichen (Zero-Width, Richtungs- und Steuerzeichen, Variation Selectors, Tag-Zeichen, Soft Hyphen) entfernen; Sonderleerzeichen werden normale Leerzeichen. Typische Reste aus KI-Texten und kopierten Seiten. */
export function stripInvisible(text: string): string {
  return text
    .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u2064\u206A-\u206F\u00AD\uFEFF\u180E\uFE00-\uFE0F]/gu, "")
    .replace(/[\u{E0000}-\u{E007F}]/gu, "")
    .replace(/[\u00A0\u202F\u2007\u2009\u200A\u2002-\u2006\u205F\u3000]/g, " ");
}

export function sanitize(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(stripInvisible(html), OPTIONS);
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
}
