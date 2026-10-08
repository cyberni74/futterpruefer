import Image from "next/image";
import Link from "next/link";
import logoWide from "../../public/brand/logo-wide.png";

export function Logo({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" className={`inline-flex min-h-11 shrink-0 items-center rounded-xl dark:bg-white dark:px-2 dark:py-1 ${className}`} aria-label="Futterprüfer.de – zur Startseite">
      <Image src={logoWide} alt="Futterprüfer.de" priority={priority} sizes="160px" className="h-10 w-auto md:h-11" />
    </Link>
  );
}
