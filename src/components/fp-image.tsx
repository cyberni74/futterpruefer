import Image from "next/image";

type Props = {
  src: string | null | undefined;
  alt: string;
  blur?: string | null;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** Responsives Bild (AVIF/WebP, srcset, Lazy Loading, Blur-Platzhalter). */
export function FpImage({ src, alt, blur, sizes, priority, className = "" }: Props) {
  if (!src) {
    return <div className={`flex items-center justify-center bg-brand-soft text-brand ${className}`} aria-hidden><svg viewBox="0 0 24 24" className="size-10 opacity-60"><path fill="currentColor" d="M4.5 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm15 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8.5 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm7 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM12 10c-3 0-6.5 4.2-6.5 7.2C5.5 19.6 7.4 21 9.7 21c1 0 1.6-.4 2.3-.4s1.3.4 2.3.4c2.3 0 4.2-1.4 4.2-3.8C18.5 14.2 15 10 12 10Z"/></svg></div>;
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder={blur ? "blur" : "empty"}
      blurDataURL={blur ?? undefined}
      className={`object-cover ${className}`}
    />
  );
}
