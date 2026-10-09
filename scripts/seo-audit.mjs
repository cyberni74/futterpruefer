// SEO-Prüfung nach Googles SEO Starter Guide. Nutzung: node scripts/seo-audit.mjs http://localhost:3001
import { JSDOM } from "jsdom";

const base = (process.argv[2] ?? "http://localhost:3001").replace(/\/$/, "");
const errors = [], hints = [];
const err = (u, m) => errors.push(`✗ ${u}  ${m}`);
const hint = (u, m) => hints.push(`! ${u}  ${m}`);

const get = async (u) => { const r = await fetch(u, { redirect: "manual" }); return { status: r.status, loc: r.headers.get("location"), text: r.status < 300 ? await r.text() : "" }; };

const sm = await get(base + "/sitemap.xml");
const urls = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, base));
console.log(`Sitemap: ${urls.length} URLs`);

const titles = new Map(), descs = new Map(), internal = new Set();
for (const url of urls) {
  const path = url.replace(base, "") || "/";
  const { status, text } = await get(url);
  if (status !== 200) { err(path, `Status ${status}`); continue; }
  const doc = new JSDOM(text).window.document;
  const q = (s) => doc.querySelector(s);
  const title = doc.title?.trim() ?? "";
  const desc = q('meta[name="description"]')?.getAttribute("content")?.trim() ?? "";
  if (!title) err(path, "kein Titel"); else { if (title.length > 65) hint(path, `Titel lang (${title.length}): ${title}`); if (title.length < 15) hint(path, `Titel kurz (${title.length})`); titles.set(title, [...(titles.get(title) ?? []), path]); }
  if (!desc) err(path, "keine Meta-Beschreibung"); else { if (desc.length > 170) hint(path, `Beschreibung lang (${desc.length})`); if (desc.length < 50) hint(path, `Beschreibung kurz (${desc.length})`); descs.set(desc, [...(descs.get(desc) ?? []), path]); }
  const h1 = doc.querySelectorAll("h1").length;
  if (h1 !== 1) err(path, `${h1} H1`);
  let prev = 1; for (const h of doc.querySelectorAll("h1,h2,h3,h4,h5,h6")) { const l = +h.tagName[1]; if (l > prev + 1) { hint(path, `Überschrift springt von H${prev} auf H${l}: ${h.textContent.trim().slice(0, 40)}`); } prev = l; }
  const can = q('link[rel="canonical"]')?.getAttribute("href");
  if (!can) err(path, "kein Canonical"); else if (can.replace(/\/$/, "") !== url.replace(/\/$/, "")) hint(path, `Canonical weicht ab: ${can}`);
  if (!/localhost|127\.0\.0\.1|vercel\.app/.test(base) && /noindex/i.test(q('meta[name="robots"]')?.getAttribute("content") ?? "")) err(path, "noindex gesetzt");
  if (!doc.documentElement.lang) err(path, "kein lang-Attribut");
  if (!q('meta[name="viewport"]')) err(path, "kein Viewport");
  if (!q('meta[property="og:image"]')) err(path, "kein og:image");
  if (!q('meta[property="og:title"]')) hint(path, "kein og:title");
  for (const img of doc.querySelectorAll("img")) { if (!img.hasAttribute("alt")) err(path, `Bild ohne alt: ${(img.getAttribute("src") ?? "").slice(0, 60)}`); }
  for (const a of doc.querySelectorAll("a[href]")) {
    const name = (a.textContent || a.getAttribute("aria-label") || a.querySelector("img")?.getAttribute("alt") || "").trim();
    if (!name) err(path, `Link ohne Text: ${a.getAttribute("href")}`);
    else if (/^(hier|klicken|mehr|link)$/i.test(name)) hint(path, `unspezifischer Linktext „${name}“: ${a.getAttribute("href")}`);
    const href = a.getAttribute("href");
    if (href.startsWith("/") && !href.startsWith("//")) internal.add(href.split("#")[0]);
  }
  for (const s of doc.querySelectorAll('script[type="application/ld+json"]')) { try { JSON.parse(s.textContent); } catch { err(path, "JSON-LD nicht lesbar"); } }
  const ld = [...doc.querySelectorAll('script[type="application/ld+json"]')].map((x) => x.textContent).join(" ");
  if (path !== "/" && !/BreadcrumbList/.test(ld)) hint(path, "keine BreadcrumbList (Brotkrumen als Markup)");
  if (!doc.querySelector('script[type="application/ld+json"]') && path !== "/suche") hint(path, "keine strukturierten Daten");
}
for (const [t, ps] of titles) if (ps.length > 1) err(ps.join(", "), `doppelter Titel: ${t}`);
for (const [d, ps] of descs) if (ps.length > 1) err(ps.join(", "), `doppelte Beschreibung: ${d.slice(0, 60)}…`);

const skip = /^\/(api|admin|_next)\b/;
for (const href of [...internal].filter((h) => h && !skip.test(h))) {
  const r = await get(base + href);
  if (r.status >= 400) err(href, `interner Link liefert ${r.status}`);
}
const nf = await get(base + "/gibt-es-nicht-xyz");
if (nf.status !== 404) err("/gibt-es-nicht-xyz", `nicht vorhandene Seite liefert ${nf.status} statt 404`);
const rb = await get(base + "/robots.txt");
if (!/Sitemap:/i.test(rb.text)) err("/robots.txt", "ohne Sitemap-Verweis");

console.log(`\n${errors.length} Fehler, ${hints.length} Hinweise`);
[...errors, ...hints].forEach((l) => console.log(l));
process.exit(errors.length ? 1 : 0);
