import sanitizeHtml from "sanitize-html";
import { labelTableCells } from "./table-labels";

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

/**
 * Rel für einen Quellenlink. sponsored nur beim Partner-Tag, bei einem amzn-Kurzlink
 * oder wenn der gespeicherte Link schon rel=sponsored trägt (ausdrücklicher Werbelink).
 * Eine nackte Amazon-URL, auch eine Suche, bleibt ohne sponsored.
 */
export function sourceLinkRel(href: string | undefined, existing?: string): string {
  const explicit = /(^|\s)sponsored(\s|$)/i.test(existing ?? "");
  if (explicit || isTaggedAffiliateHref(href)) return externalRel(existing, href);
  return "nofollow noopener noreferrer";
}

const SOURCE_LIST_CLASS = /(?:^|\s)(?:vt-sources|fp-quellen|source-list)(?:\s|$)/;
const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);

function classAttr(tag: string): string {
  return (/\bclass\s*=\s*"([^"]*)"/i.exec(tag) ?? /\bclass\s*=\s*'([^']*)'/i.exec(tag))?.[1] ?? "";
}

function hasClass(tag: string, name: string): boolean {
  return new RegExp(`(?:^|\\s)${name}(?:\\s|$)`).test(classAttr(tag));
}

/** Anker in Quellenlisten als Quellenbeleg markieren, damit sie nicht pauschal sponsored werden. */
function markSourceListAnchors(html: string): string {
  const re = /<[^>]+>/g;
  let out = "";
  let last = 0;
  const stack: { name: string; source: boolean }[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    out += html.slice(last, match.index);
    last = match.index + match[0].length;
    const tag = match[0];
    const close = /^<\/([a-zA-Z0-9]+)/.exec(tag);
    if (close) {
      const name = close[1].toLowerCase();
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].name === name) {
          stack.splice(i, 1);
          break;
        }
      }
      out += tag;
      continue;
    }
    const open = /^<([a-zA-Z0-9]+)/.exec(tag);
    if (!open) {
      out += tag;
      continue;
    }
    const name = open[1].toLowerCase();
    const inside = stack.some((frame) => frame.source);
    const source = inside || SOURCE_LIST_CLASS.test(classAttr(tag));
    const externalAnchor = name === "a" && source && /\bhref\s*=\s*["']https?:/i.test(tag);
    if (externalAnchor) out += hasClass(tag, "src-link") ? tag : addSrcLinkClass(tag);
    else out += tag;
    if (!VOID_TAGS.has(name) && !/\/>\s*$/.test(tag)) stack.push({ name, source });
  }
  return out + html.slice(last);
}

function addSrcLinkClass(tag: string): string {
  if (/\bclass\s*=\s*"/.test(tag)) return tag.replace(/\bclass\s*=\s*"([^"]*)"/i, (_m, value) => `class="${value} src-link"`);
  if (/\bclass\s*=\s*'/.test(tag)) return tag.replace(/\bclass\s*=\s*'([^']*)'/i, (_m, value) => `class='${value} src-link'`);
  return tag.replace(/<a\b/i, '<a class="src-link"');
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
    td: ["colspan", "rowspan", "data-label"],
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
      // Quellenbeleg (.src-link, auch in vt-sources/fp-quellen/source-list): sponsored nur bei Partner-Tag oder Werbelink.
      const isSource = /(^|\s)src-link(\s|$)/.test(attribs.class ?? "");
      const rel = isSource ? sourceLinkRel(attribs.href, attribs.rel) : externalRel(attribs.rel, attribs.href);
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
  // data-label (mobile Tabellen-Beschriftung) aus dem thead ergänzen, wo es fehlt.
  return labelTableCells(sanitizeHtml(stripInvisible(markSourceListAnchors(html)), OPTIONS));
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
}
