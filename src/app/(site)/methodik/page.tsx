import type { Metadata } from "next";
import { CRITERIA, HARMFUL_FAIL_RATIO, MAX_TOTAL, RATING_THRESHOLDS } from "@/lib/scoring";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Methodik", description: "So bewerten wir Hunde- und Katzenfutter: sechs Kriterien, 100 Punkte und offengelegte Gewichtung.", alternates: { canonical: "/methodik" } };

export default function MethodikPage() {
  return (
    <PageShell crumb="Methodik" title="Unsere Methodik" intro={`Jedes Produkt durchläuft dieselbe Prüfung mit sechs Kriterien und maximal ${MAX_TOTAL} Punkten. Grundlage sind Deklaration, analytische Bestandteile, Zusatzstoffe und Herstellerangaben.`}>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Bewertungskriterien und Gewichtung</caption>
          <thead className="bg-bg-soft"><tr><th scope="col" className="p-3">Kriterium</th><th scope="col" className="p-3">Inhalt</th><th scope="col" className="p-3 text-right">Punkte</th></tr></thead>
          <tbody>
            {CRITERIA.map((c) => (
              <tr key={c.key} className="border-t border-border"><th scope="row" className="p-3 font-semibold">{c.label}</th><td className="p-3 text-muted">{c.description}</td><td className="p-3 text-right font-bold tabular-nums">{c.max}</td></tr>
            ))}
            <tr className="border-t border-border bg-bg-soft"><th scope="row" className="p-3 font-bold">Gesamt</th><td /><td className="p-3 text-right font-extrabold">{MAX_TOTAL}</td></tr>
          </tbody>
        </table>
      </div>

      <div className="prose-fp mt-10">
        <h2>Ampel und Warnsignal</h2>
        <ul>
          <li><strong className="text-good">Grün (ab {RATING_THRESHOLDS.gut} Punkten):</strong> empfehlenswert</li>
          <li><strong className="text-mid">Gelb ({RATING_THRESHOLDS.mittel}–{RATING_THRESHOLDS.gut - 1} Punkte):</strong> mit Abstrichen</li>
          <li><strong className="text-bad">Rot (unter {RATING_THRESHOLDS.mittel} Punkten):</strong> nicht empfehlenswert</li>
        </ul>
        <p>Erreicht ein Produkt im Kriterium „Schadstoffe &amp; Bedenkliches“ weniger als {HARMFUL_FAIL_RATIO * 100} % der Punkte, erscheint unabhängig von der Gesamtnote ein rotes Warnsignal.</p>
        <h2>Ablauf einer Bewertung</h2>
        <ol>
          <li>Erfassung der vollständigen Deklaration und der analytischen Bestandteile</li>
          <li>Prüfung der Rohstoffe auf Qualität und Sinnhaftigkeit</li>
          <li>Abgleich des Nährstoffprofils mit dem Bedarf der Tierart</li>
          <li>Prüfung der Werbeaussagen auf rechtliche Zulässigkeit und Richtigkeit (u. a. VO (EG) 767/2009 Art. 11 und 13, UWG) – unzulässige Aussagen führen zu Abzügen bei „Deklaration &amp; Transparenz“ und werden im Test als Faktencheck dokumentiert</li>
          <li>Preis-Leistungs-Bewertung auf Basis des Kilopreises</li>
        </ol>
        <p>Bei Rezepturänderungen wird der Test aktualisiert. Das Datum steht auf jeder Testseite.</p>
        <p>Hersteller können Produkte zur Prüfung einreichen. Eine Einreichung hat keinen Einfluss auf die Bewertung.</p>
      </div>
    </PageShell>
  );
}
