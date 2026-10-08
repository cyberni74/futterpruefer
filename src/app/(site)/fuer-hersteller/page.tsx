import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Für Hersteller", description: "Produkte zur unabhängigen Prüfung einreichen. Eine Einreichung kauft keine Note.", alternates: { canonical: "/fuer-hersteller" } };

export default function ManufacturerPage() {
  return (
    <PageShell crumb="Für Hersteller" title="Für Hersteller" intro="Sie möchten ein Produkt prüfen lassen? Wir freuen uns über Einreichungen.">
      <div role="note" className="flex gap-3 rounded-2xl border-2 border-accent bg-surface p-5">
        <ShieldAlert className="size-7 shrink-0 text-accent" aria-hidden />
        <p className="font-semibold">Wichtig: Eine Einreichung kauft keine Note. Bewertet wird ausschließlich nach der offengelegten Methodik – auch dann, wenn das Ergebnis schlecht ausfällt. Eingereichte Produkte werden nicht bevorzugt behandelt.</p>
      </div>
      <div className="prose-fp mt-8">
        <h2>So funktioniert die Einreichung</h2>
        <ol>
          <li>Anfrage über das Kontaktformular (Typ „Herstelleranfrage“) senden</li>
          <li>Vollständige Deklaration, analytische Bestandteile und Zusatzstoffe bereitstellen</li>
          <li>Prüfung nach der <Link href="/methodik">Methodik</Link> – der Zeitpunkt der Veröffentlichung liegt bei der Redaktion</li>
          <li>Bei sachlichen Fehlern können Sie eine Korrektur anregen; die Bewertung selbst ist nicht verhandelbar</li>
        </ol>
      </div>
      <Link href="/kontakt?typ=hersteller" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-bold text-white hover:bg-accent-strong dark:text-black">Herstelleranfrage senden</Link>
    </PageShell>
  );
}
