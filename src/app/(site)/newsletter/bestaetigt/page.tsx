import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Newsletter bestätigt", robots: { index: false } };

export default function NewsletterConfirmed() {
  return (
    <PageShell crumb="Newsletter" title="Danke – Ihre Anmeldung ist bestätigt" intro="Ab sofort erhalten Sie neue Testergebnisse, Produktwarnungen und Fachwissen per E-Mail.">
      <Link href="/tests" className="inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-bold text-white hover:bg-accent-strong dark:text-black">Zu den neuesten Tests</Link>
    </PageShell>
  );
}
