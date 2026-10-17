/** Erlaubte Bild-Hosts für Anzeige und Speichern. Ohne Zugangsdaten, auch aus next.config importierbar. */

export const SUPABASE_IMAGE_HOST = "cotopvhmsqztjtdsdnoc.supabase.co";
export const BILDER_BUCKET = "bilder";
const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

function httpsUrl(value: string): URL | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
  return url;
}

/** Leere Angabe, eigene relative Uploads, bisherige Blob-URLs oder der öffentliche Supabase-Bucket. */
export function isAllowedImageUrl(value: string): boolean {
  const v = value.trim();
  if (v === "" || v.startsWith("/uploads/") || v.startsWith("/demo/")) return true;
  const url = httpsUrl(v);
  if (!url) return false;
  const host = url.hostname;
  if (host.endsWith(BLOB_HOST_SUFFIX) && host.length > BLOB_HOST_SUFFIX.length) return true;
  return host === SUPABASE_IMAGE_HOST && url.pathname.startsWith(`/storage/v1/object/public/${BILDER_BUCKET}/`);
}
