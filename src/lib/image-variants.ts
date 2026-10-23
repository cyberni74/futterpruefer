import manifest from "@/data/image-variants.json";
import ready from "@/data/image-variants-ready.json";
import { amazonSizedUrl, BILDER_BUCKET, isAmazonHotlink, SUPABASE_IMAGE_HOST } from "./image-hosts";

/** Breiten der vorab erzeugten Varianten (Supabase-Bucket „bilder“). Die Originaldatei ist die größte Stufe. */
export const VARIANT_WIDTHS = [400, 800] as const;
/** Amazon-Größenstufen über den Suffix `._AC_SL<px>_.`. */
export const AMAZON_WIDTHS = [300, 500, 800, 1000] as const;
/** Breite der Original-Uploads im srcset (Uploads bis 1600 px, neuere bis 1000 px). */
const ORIGINAL_WIDTH = 1600;

const BUCKET_PREFIX = `/storage/v1/object/public/${BILDER_BUCKET}/`;

/** `x.webp` wird zu `x-400.webp`. */
export function variantName(name: string, width: number): string {
  return name.replace(/\.webp$/, `-${width}.webp`);
}

export function isVariantName(name: string): boolean {
  return VARIANT_WIDTHS.some((w) => name.endsWith(`-${w}.webp`));
}

type LocalEntry = { w: number; v: { w: number; src: string }[] };
const LOCAL = manifest as Record<string, LocalEntry>;

export type ResponsiveImage = { src: string; srcSet?: string };

/**
 * Bild-URL plus srcset aus vorab erzeugten Varianten. Ohne bekannte Varianten bleibt es bei der einen URL.
 * Supabase: jede Datei im Bucket hat -400/-800 (Upload erzeugt sie, der Build ergänzt ältere).
 * Das srcset erscheint erst, wenn der Build per Bereit-Flag bestätigt hat, dass alle Varianten vorhanden sind.
 */
export function responsiveImage(src: string): ResponsiveImage {
  if (isAmazonHotlink(src)) {
    return {
      src: amazonSizedUrl(src, 500),
      srcSet: AMAZON_WIDTHS.map((w) => `${amazonSizedUrl(src, w)} ${w}w`).join(", "),
    };
  }
  const local = LOCAL[src];
  if (local) {
    const steps = [...local.v.map((v) => `${v.src} ${v.w}w`), `${src} ${local.w}w`];
    return { src, srcSet: steps.join(", ") };
  }
  try {
    const url = new URL(src);
    if (ready.supabase && url.protocol === "https:" && url.hostname === SUPABASE_IMAGE_HOST && url.pathname.startsWith(BUCKET_PREFIX)) {
      const name = url.pathname.slice(BUCKET_PREFIX.length);
      if (/^[a-z0-9]+(?:-[a-z0-9]+)*\.webp$/.test(name) && !isVariantName(name)) {
        const at = (n: string) => `https://${SUPABASE_IMAGE_HOST}${BUCKET_PREFIX}${n}`;
        const steps = [...VARIANT_WIDTHS.map((w) => `${at(variantName(name, w))} ${w}w`), `${src} ${ORIGINAL_WIDTH}w`];
        return { src, srcSet: steps.join(", ") };
      }
    }
  } catch {
    // relative oder ungültige URL: keine Varianten
  }
  return { src };
}
