/** Reine Planung, welche Pfade nach einer Änderung neu erzeugt werden. Ohne Next-Abhängigkeit, damit sie testbar ist. */

export type RevalidateKind = "review" | "blog" | "ticker" | "pdm" | "faq";

export type PathTarget = { path: string; type?: "page" | "layout" };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isSlug(value: unknown): value is string {
  return typeof value === "string" && value.length <= 120 && SLUG.test(value);
}

/**
 * Immer: Startseite, Sitemap, RSS. Dazu je nach Art die Listen und, wenn Slugs bekannt sind,
 * die genauen Seiten (auch eine bisher als 404 zwischengespeicherte Seite wird so neu erzeugt).
 * `categories` gehört zu `slugs` (gleiche Reihenfolge); fehlt sie, deckt das Muster /[kategorie]/[slug] alle Tests ab.
 */
export function revalidationPlan(kind: RevalidateKind, slugs: Array<string | null | undefined> = [], categories: Array<string | null | undefined> = []): PathTarget[] {
  const out: PathTarget[] = [{ path: "/" }, { path: "/sitemap.xml" }, { path: "/rss.xml" }];
  if (kind === "review" || kind === "pdm") {
    out.push({ path: "/tests" }, { path: "/[kategorie]", type: "page" }, { path: "/[kategorie]/[slug]", type: "page" }, { path: "/marken" }, { path: "/marken/[marke]", type: "page" }, { path: "/produkt-des-monats" });
    slugs.forEach((slug, i) => {
      const category = categories[i];
      if (isSlug(slug) && isSlug(category)) out.push({ path: `/${category}` }, { path: `/${category}/${slug}` });
    });
  }
  if (kind === "blog") {
    out.push({ path: "/blog" });
    for (const slug of slugs) if (isSlug(slug)) out.push({ path: `/blog/${slug}` });
  }
  if (kind === "faq") out.push({ path: "/faq" });
  const seen = new Set<string>();
  return out.filter((t) => (seen.has(`${t.path}|${t.type ?? ""}`) ? false : (seen.add(`${t.path}|${t.type ?? ""}`), true)));
}

/** Freie Pfade für den Endpunkt: nur Seiten der Website, nie Admin oder API. */
export function isSafePath(value: unknown): value is string {
  if (typeof value !== "string" || value.length < 1 || value.length > 200) return false;
  if (!value.startsWith("/") || value.includes("//") || value.includes("..") || /[?#\s\\]/.test(value)) return false;
  return !/^\/(admin|api)(\/|$)/.test(value);
}

export type RevalidateRequest =
  | { ok: true; all: boolean; kind: "review" | "blog" | null; slugs: string[]; category: string | null; paths: string[] }
  | { ok: false; error: string };

/** Prüft den JSON-Body des Endpunkts. */
export function parseRevalidateRequest(body: unknown): RevalidateRequest {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { ok: false, error: "Body muss ein JSON-Objekt sein." };
  const b = body as Record<string, unknown>;
  const kind = b.kind === undefined ? null : b.kind;
  if (kind !== null && kind !== "review" && kind !== "blog") return { ok: false, error: 'kind muss "review" oder "blog" sein.' };
  const slugs = b.slugs !== undefined ? b.slugs : b.slug !== undefined ? [b.slug] : [];
  if (!Array.isArray(slugs) || slugs.length > 20 || !slugs.every(isSlug)) return { ok: false, error: "slug bzw. slugs: bis zu 20 Slugs aus Kleinbuchstaben, Ziffern und Bindestrichen." };
  if (slugs.length && !kind) return { ok: false, error: "Mit slug ist kind (review oder blog) nötig." };
  const category = b.category === undefined || b.category === null ? null : b.category;
  if (category !== null && !isSlug(category)) return { ok: false, error: "category muss ein Slug sein." };
  const paths = b.paths === undefined ? [] : b.paths;
  if (!Array.isArray(paths) || paths.length > 20 || !paths.every(isSafePath)) return { ok: false, error: "paths: bis zu 20 Seitenpfade, die mit / beginnen (kein /admin, kein /api, keine Query)." };
  const all = b.all === true;
  if (!all && !kind && !paths.length) return { ok: false, error: 'Angeben: "all": true, "kind" mit "slug(s)" oder "paths".' };
  return { ok: true, all, kind: kind as "review" | "blog" | null, slugs: slugs as string[], category: category as string | null, paths: paths as string[] };
}
