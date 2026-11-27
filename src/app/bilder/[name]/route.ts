import { BILDER_BUCKET, BILDER_DATEINAME, SUPABASE_IMAGE_HOST } from "@/lib/image-hosts";

/**
 * Liefert Bilder aus dem öffentlichen Supabase-Bucket „bilder“ über Vercel aus.
 * Der Speicher wird nur bei einem Cache-Fehlschlag angefragt; danach liefern CDN und Browser (7 Tage / 1 Tag).
 * Nur einzelne, geprüfte Dateinamen des festen Hosts und Buckets, kein Weiterleiten beliebiger URLs.
 */
const OK = "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";
const FEHLER = "public, max-age=60, s-maxage=60";

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!BILDER_DATEINAME.test(name)) return new Response("Nicht gefunden", { status: 404, headers: { "Cache-Control": FEHLER } });
  let upstream: Response;
  try {
    upstream = await fetch(`https://${SUPABASE_IMAGE_HOST}/storage/v1/object/public/${BILDER_BUCKET}/${name}`, { next: { revalidate: 604800 } });
  } catch {
    return new Response("Bild nicht erreichbar", { status: 502, headers: { "Cache-Control": FEHLER } });
  }
  const type = upstream.headers.get("content-type") ?? "";
  if (!upstream.ok || !type.startsWith("image/")) {
    return new Response("Nicht gefunden", { status: upstream.status === 404 ? 404 : 502, headers: { "Cache-Control": FEHLER } });
  }
  return new Response(upstream.body, { status: 200, headers: { "Content-Type": type, "Cache-Control": OK, "X-Content-Type-Options": "nosniff" } });
}
