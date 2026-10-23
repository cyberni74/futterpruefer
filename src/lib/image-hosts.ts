/** Erlaubte Bild-Hosts für Anzeige und Speichern. Ohne Zugangsdaten, auch aus next.config importierbar. */

export const SUPABASE_IMAGE_HOST = "cotopvhmsqztjtdsdnoc.supabase.co";
export const BILDER_BUCKET = "bilder";
/** Amazon-Galerie, nur Hotlink. Kein Rehost über den Next-Image-Optimizer. */
export const AMAZON_IMAGE_HOST = "m.media-amazon.com";
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

/** Galeriebild von m.media-amazon.com/images/I/…, https, ohne Zugangsdaten. */
export function isAmazonHotlink(value: string): boolean {
  const url = httpsUrl(value.trim());
  if (!url) return false;
  return url.hostname === AMAZON_IMAGE_HOST && url.pathname.startsWith("/images/I/");
}

/** Leere Angabe, eigene relative Uploads, bisherige Blob-URLs, der öffentliche Supabase-Bucket oder ein Amazon-Galerie-Hotlink. */
export function isAllowedImageUrl(value: string): boolean {
  const v = value.trim();
  if (v === "" || v.startsWith("/uploads/") || v.startsWith("/demo/")) return true;
  const url = httpsUrl(v);
  if (!url) return false;
  const host = url.hostname;
  if (host.endsWith(BLOB_HOST_SUFFIX) && host.length > BLOB_HOST_SUFFIX.length) return true;
  if (host === AMAZON_IMAGE_HOST && url.pathname.startsWith("/images/I/")) return true;
  return host === SUPABASE_IMAGE_HOST && url.pathname.startsWith(`/storage/v1/object/public/${BILDER_BUCKET}/`);
}

/**
 * Amazon-Galeriebild in einer festen Breite: ersetzt den Größenteil (z. B. `._AC_SL1500_.`) durch `._AC_SL<px>_.`.
 * Ohne Größenteil wird er vor der Dateiendung ergänzt. Andere Hosts bleiben unverändert.
 */
export function amazonSizedUrl(value: string, px: number): string {
  if (!isAmazonHotlink(value)) return value;
  const url = new URL(value.trim());
  const sized = `._AC_SL${px}_`;
  url.pathname = /\._[^/]*?SL\d+_(?=\.)/.test(url.pathname)
    ? url.pathname.replace(/\._[^/]*?SL\d+_(?=\.)/, sized)
    : url.pathname.replace(/\.(jpe?g|png|webp)$/i, `${sized}.$1`);
  return url.toString();
}
