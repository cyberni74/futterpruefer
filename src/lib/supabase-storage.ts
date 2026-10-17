import "server-only";
import { BILDER_BUCKET, SUPABASE_IMAGE_HOST } from "@/lib/image-hosts";

/** Obergrenze des Buckets „bilder“. */
export const MAX_STORED_IMAGE_BYTES = 5 * 1024 * 1024;

const MISSING_ENV = "Der Bildspeicher ist nicht eingerichtet. Bitte setzen Sie SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY.";
const BAD_URL = "Der Bildspeicher ist falsch konfiguriert. SUPABASE_URL muss auf den vorgesehenen Host zeigen.";
const TOO_BIG = "Das optimierte Bild ist größer als 5 MB. Bitte ein kleineres Foto wählen.";
const FAILED = "Speichern des Bildes fehlgeschlagen.";

export type StoredImage = { url: string } | { error: string; status: number };

const OBJECT_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*\.webp$/;

function storageConfig(): { base: string; key: string } | { error: string; status: number } {
  const raw = process.env.SUPABASE_URL?.trim() ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  if (!raw || !key || /[\r\n]/.test(key)) return { error: !raw || !key ? MISSING_ENV : BAD_URL, status: 503 };
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { error: BAD_URL, status: 503 };
  }
  const pathOk = url.pathname === "" || url.pathname === "/";
  if (url.protocol !== "https:" || url.hostname !== SUPABASE_IMAGE_HOST || url.username || url.password || url.port || url.search || url.hash || !pathOk) {
    return { error: BAD_URL, status: 503 };
  }
  return { base: `https://${SUPABASE_IMAGE_HOST}`, key };
}

export function supabasePublicImageUrl(objectPath: string): string {
  return `https://${SUPABASE_IMAGE_HOST}/storage/v1/object/public/${BILDER_BUCKET}/${objectPath}`;
}

/**
 * Lädt ein bereits optimiertes WebP in den öffentlichen Bucket.
 * Der Schlüssel geht nur als apikey- und Authorization-Header an den festen Host und wird nicht geloggt.
 */
export async function uploadPublicImage(objectPath: string, body: Buffer): Promise<StoredImage> {
  if (!OBJECT_NAME.test(objectPath) || objectPath.length > 120) return { error: "Ungültiger Dateiname.", status: 400 };
  if (body.byteLength > MAX_STORED_IMAGE_BYTES) return { error: TOO_BIG, status: 413 };
  const cfg = storageConfig();
  if ("error" in cfg) return cfg;

  const target = `${cfg.base}/storage/v1/object/${BILDER_BUCKET}/${objectPath}`;
  let res: Response;
  try {
    res = await fetch(target, {
      method: "POST",
      headers: {
        apikey: cfg.key,
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": "image/webp",
        "cache-control": "public, max-age=31536000, immutable",
        "x-upsert": "false",
      },
      body: new Uint8Array(body),
    });
  } catch {
    console.error("upload: storage Netzwerkfehler");
    return { error: FAILED, status: 500 };
  }
  if (!res.ok) {
    await res.arrayBuffer().catch(() => undefined);
    console.error("upload: storage Status", res.status);
    return { error: res.status === 409 ? "Ein Bild mit diesem Namen existiert bereits. Bitte laden Sie es erneut hoch." : FAILED, status: res.status === 409 ? 409 : 500 };
  }
  return { url: supabasePublicImageUrl(objectPath) };
}
