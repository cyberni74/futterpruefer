import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Disclosure() {
  return (
    <aside aria-label="Offenlegung" className="flex gap-3 rounded-2xl border border-border bg-bg-soft p-4 text-sm">
      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
      <p className="text-muted">
        <strong className="text-fg">Nicht vom Hersteller beauftragt.</strong> Dieser Test wurde nicht vom Hersteller beauftragt oder bezahlt, und der Hersteller hatte keinen Einfluss auf die Bewertung. Wir finanzieren uns über Amazon-Partnerlinks: Kaufen Sie über einen als Werbung gekennzeichneten Link, erhalten wir eine Provision. Für Sie ändert sich der Preis nicht. Wie wir bewerten, steht in unserer{" "}
        <Link href="/methodik" className="font-semibold text-brand underline">Methodik</Link>.
      </p>
    </aside>
  );
}
