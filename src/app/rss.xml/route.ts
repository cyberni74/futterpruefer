import { prisma } from "@/lib/db";
import { publishedWhere } from "@/lib/queries";
import { absoluteUrl, SITE } from "@/lib/site";

export const revalidate = 3600;

const esc = (s: string | null | undefined) => (s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const [reviews, posts] = await Promise.all([
    prisma.review.findMany({ where: publishedWhere(), orderBy: { publishedAt: "desc" }, take: 30, select: { slug: true, title: true, verdict: true, totalScore: true, publishedAt: true, category: { select: { slug: true } } } }),
    prisma.blogPost.findMany({ where: publishedWhere(), orderBy: { publishedAt: "desc" }, take: 30, select: { slug: true, title: true, excerpt: true, publishedAt: true } }),
  ]);
  const items = [
    ...reviews.map((r) => ({ title: `Test: ${r.title} – ${r.totalScore}/100`, link: absoluteUrl(`/${r.category.slug}/${r.slug}`), desc: r.verdict, date: r.publishedAt, cat: "Tests" })),
    ...posts.map((p) => ({ title: p.title, link: absoluteUrl(`/blog/${p.slug}`), desc: p.excerpt, date: p.publishedAt, cat: "Fachblog" })),
  ].sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(SITE.name)} – Tests &amp; Fachblog</title>
<link>${SITE.url}</link>
<description>${esc(SITE.description)}</description>
<language>de-DE</language>
<atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml"/>
${items.map((i) => `<item><title>${esc(i.title)}</title><link>${i.link}</link><guid>${i.link}</guid><category>${i.cat}</category><description>${esc(i.desc)}</description>${i.date ? `<pubDate>${i.date.toUTCString()}</pubDate>` : ""}</item>`).join("\n")}
</channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
