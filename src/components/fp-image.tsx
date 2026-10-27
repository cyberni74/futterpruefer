import { preload } from "react-dom";
import { responsiveImage } from "@/lib/image-variants";

type Props = {
  src: string | null | undefined;
  alt: string;
  blur?: string | null;
  sizes: string;
  /** Nur das größte sichtbare Bild (LCP): eager mit fetchpriority="high". Alle anderen laden lazy. */
  priority?: boolean;
  /** Sofort laden (ohne High-Priority): für wenige Karten, die direkt im Ergebnis stehen und nicht erst beim Scrollen nachladen sollen. */
  eager?: boolean;
  className?: string;
};

/**
 * Bild mit vorab erzeugten Größen (srcset): eigene Dateien als WebP in 400/800 px plus Original,
 * Amazon-Bilder über den Größen-Suffix. Es läuft kein Bild-Optimizer, daher keine Vercel-Bildkosten.
 * Der Container setzt das Seitenverhältnis, damit nichts springt (CLS). Der Platzhalter ist ein winziges, glatt hochskaliertes Bild.
 */
export function FpImage({ src, alt, blur, sizes, priority, eager, className = "" }: Props) {
  if (!src) {
    return <div className={`flex items-center justify-center bg-brand-soft text-brand ${className}`} aria-hidden><svg viewBox="0 0 24 24" className="size-10 opacity-60"><path fill="currentColor" d="M4.5 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm15 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8.5 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm7 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM12 10c-3 0-6.5 4.2-6.5 7.2C5.5 19.6 7.4 21 9.7 21c1 0 1.6-.4 2.3-.4s1.3.4 2.3.4c2.3 0 4.2-1.4 4.2-3.8C18.5 14.2 15 10 12 10Z"/></svg></div>;
  }
  const image = responsiveImage(src);
  if (priority) preload(image.src, { as: "image", fetchPriority: "high", ...(image.srcSet ? { imageSrcSet: image.srcSet, imageSizes: sizes } : {}) });
  return (
    // eslint-disable-next-line @next/next/no-img-element -- vorab erzeugte Größen, kein Next-Bild-Optimizer
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.srcSet ? sizes : undefined}
      alt={alt}
      loading={priority || eager ? "eager" : "lazy"}
      decoding={priority || eager ? undefined : "async"}
      fetchPriority={priority ? "high" : undefined}
      style={blur ? { backgroundImage: `url("${blur}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}
