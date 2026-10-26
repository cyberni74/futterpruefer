import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { revalidateContent, revalidateTargets } from "@/lib/revalidate";
import { parseRevalidateRequest } from "@/lib/revalidate-plan";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 10 * 1024;
const MIN_SECRET_LENGTH = 16;

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Vergleich über SHA-256-Hashes: konstante Zeit, unabhängig von der Länge des Tokens. */
function tokenMatches(header: string | null, secret: string): boolean {
  const token = /^Bearer\s+(.+)$/i.exec(header ?? "")?.[1]?.trim() ?? "";
  const a = createHash("sha256").update(token).digest();
  const b = createHash("sha256").update(secret).digest();
  return timingSafeEqual(a, b) && token.length > 0;
}

/**
 * Geschützter Endpunkt: erzeugt Seiten nach direkten Datenbankänderungen neu.
 * Nur POST mit `Authorization: Bearer <REVALIDATE_SECRET>`. Ohne gesetztes Secret antwortet er 503.
 * Er schreibt nichts in die Datenbank (nur lesen, um die Kategorie eines Tests zu finden).
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET?.trim();
  if (!secret || secret.length < MIN_SECRET_LENGTH) return json({ error: "Nicht eingerichtet." }, 503);
  if (!tokenMatches(request.headers.get("authorization"), secret)) return json({ error: "Nicht erlaubt." }, 401);

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) return json({ error: "Body zu groß." }, 413);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Ungültiges JSON." }, 400);
  }
  const parsed = parseRevalidateRequest(body);
  if (!parsed.ok) return json({ error: parsed.error }, 400);

  const done: string[] = [];
  if (parsed.all) {
    revalidatePath("/", "layout");
    done.push("/ (alle Seiten)");
  }
  if (parsed.kind) {
    let categories: Array<string | null> = parsed.slugs.map(() => parsed.category);
    if (parsed.kind === "review" && parsed.slugs.length && !parsed.category) {
      try {
        const rows = await prisma.review.findMany({ where: { slug: { in: parsed.slugs } }, select: { slug: true, category: { select: { slug: true } } } });
        const bySlug = new Map(rows.map((r) => [r.slug, r.category.slug]));
        categories = parsed.slugs.map((s) => bySlug.get(s) ?? null);
      } catch {
        // Kategorie nicht lesbar: das Muster /[kategorie]/[slug] deckt trotzdem alle Tests ab
      }
    }
    done.push(...revalidateContent(parsed.kind, parsed.slugs, categories));
  }
  if (parsed.paths.length) done.push(...revalidateTargets(parsed.paths.map((path) => ({ path }))));
  return json({ revalidated: [...new Set(done)], at: new Date().toISOString() }, 200);
}
