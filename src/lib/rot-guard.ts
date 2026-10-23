import sanitizeHtml from "sanitize-html";
import { isTaggedAffiliateHref } from "./sanitize";
import { ratingFor } from "./scoring";

/** Rot-Regel: Testseiten unter 60 Punkten zeigen keinen Kauflink und keinen Amazon-CTA. */
export function isRotScore(total: number | null | undefined): boolean {
  return ratingFor(total) === "schlecht";
}

const hasClass = (attribs: Record<string, string> | undefined, name: string) =>
  new RegExp(`(^|\\s)${name}(\\s|$)`).test(attribs?.class ?? "");

/**
 * Entfernt auf Rot-Seiten jede .cta-amazon-Box samt Inhalt und macht Partner-Links
 * (tag= oder amzn-Kurzlink) zu reinem Text. Alles andere bleibt unverändert.
 * Erwartet bereits bereinigtes HTML.
 */
export function stripAffiliateForRot(html: string): string {
  if (!html) return "";
  return sanitizeHtml(html, {
    allowedTags: false,
    allowedAttributes: false,
    allowVulnerableTags: true,
    parser: { decodeEntities: false },
    exclusiveFilter: (frame) => hasClass(frame.attribs, "cta-amazon"),
    transformTags: {
      a: (tagName, attribs) => (isTaggedAffiliateHref(attribs.href) ? { tagName: "span", attribs: {} } : { tagName, attribs }),
    },
  });
}
