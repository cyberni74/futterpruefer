import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Disclosure() {
  return (
    <aside aria-label="Offenlegung" className="flex gap-3 rounded-2xl border border-border bg-bg-soft p-4 text-sm">
      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
      <p className="text-muted">
        <strong className="text-fg">Unabhängig bewertet.</strong> Dieser Test wurde nicht vom Hersteller beauftragt oder bezahlt; eine Produkteinreichung hat keinen Einfluss auf die Note. Mögliche Interessenkonflikte des Autors legen wir in der{" "}
        <Link href="/methodik#interessenkonflikte" className="font-semibold text-brand underline">Methodik</Link> offen.
      </p>
    </aside>
  );
}
