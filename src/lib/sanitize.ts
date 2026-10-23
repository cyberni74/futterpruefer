import sanitizeHtml from "sanitize-html";

const REL_ORDER = ["noopener", "noreferrer", "nofollow", "sponsored", "ugc"] as const;

/** Amazon-PartnerNet-Tag dieser Website. */
const AMAZON_AFFILIATE_TAG = "cyberni7400-21";

/** amazon.de und die übrigen Retail-Hosts, nicht amazonaws. */
const AMAZON_HOST = /(^|\.)amazon\.(de|com|co\.uk|fr|it|es|nl|pl|se|com\.be|ca|com\.au|co\.jp)$/;

/** Affiliate: gesetztes rel=sponsored, der Partner-Tag oder ein Amazon-Retail-Link. */
export function isSponsoredHref(href: string | undefined): boolean {
  if (!href) return false;
  const raw = href.replace(/&/gi, "&").trim();
  try {
    const url = new URL(raw);
    if ((url.searchParams.get("tag") ?? "").toLowerCase() === AMAZON_AFFILIATE_TAG) return true;
    const host = url.hostname.toLowerCase().replace(/\.$/, "");
    if (host === "amzn.to" || host === "amzn.eu" || host.endsWith(".amzn.to") || host.endsWith(".amzn.eu")) return true;
    return AMAZON_HOST.test(host);
  } catch {
    return new RegExp(`(?:^|[?&])tag=${AMAZON_AFFILIATE_TAG}(?:&|$)`, "i").test(raw);
  }
}

/** Partner-Link im engeren Sinn: unser Partner-Tag oder ein amzn-Kurzlink (nicht jede Amazon-URL). */
export function isTaggedAffiliateHref(href: string | undefined): boolean {
  if (!href) return false;
  const raw = href.replace(/&/gi, "&").trim();
  if (/[?&]tag=/i.test(raw)) return isSponsoredHref(raw);
  try {
    const host = new URL(raw).hostname.toLowerCase().replace(/\.$/, "");
    return host === "amzn.to" || host === "amzn.eu" || host.endsWith(".amzn.to") || host.endsWith(".amzn.eu");
  } catch {
    return false;
  }
}

/** Externe Links: noopener/noreferrer/nofollow ergänzen, sponsored bei Affiliate-Zielen setzen und gesetztes sponsored/ugc behalten. */
export function externalRel(existing: string | undefined, href?: string): string {
  const keep = new Set<string>(REL_ORDER);
  const tokens = new Set(
    (existing ?? "")
      .toLowerCase()
      .split(/\s+/)
      .filter((token) => keep.has(token)),
  );
  tokens.add("noopener");
  tokens.add("noreferrer");
  tokens.add("nofollow");
  if (isSponsoredHref(href)) tokens.add("sponsored");
  return REL_ORDER.filter((token) => tokens.has(token)).join(" ");
}

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h2", "h3", "h4", "p", "br", "hr", "strong", "b", "em", "i", "u", "s", "mark", "sup", "sub",
    "ul", "ol", "li", "blockquote", "a", "img", "figure", "figcaption",
    "table", "thead", "tbody", "tr", "th", "td", "code", "pre", "span", "div",
    // Aufklappbare Quellenlisten (Vergleichstests), ohne Event-Attribute.
    "details", "summary",
  ],
  allowedAttributes: {
    // class liegt zusätzlich auf "*": .cta-box und Button-Klassen bleiben, style nicht.
    a: ["href", "title", "target", "rel", "class"],
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
      if (!external) return { tagName, attribs };
      // Quellenbeleg (.src-link) ohne Partner-Tag ist keine Werbung: kein sponsored, auch bei Amazon-URLs.
      const isSource = /(^|\s)src-link(\s|$)/.test(attribs.class ?? "");
      const rel = isSource && !isTaggedAffiliateHref(attribs.href) ? "nofollow noopener noreferrer" : externalRel(attribs.rel, attribs.href);
      return { tagName, attribs: { ...attribs, target: "_blank", rel } };
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
