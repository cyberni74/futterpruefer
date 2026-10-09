import type { Metadata } from "next";
import Link from "next/link";
import { CRITERIA, HARMFUL_FAIL_RATIO, MAX_TOTAL, RATING_THRESHOLDS, type CriterionKey } from "@/lib/scoring";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Methodik: So bewerten wir Hunde- und Katzenfutter",
  description: "Sechs Kriterien, 100 Punkte, offene Gewichtung: So prüfen wir Rohstoffe, Zusatzstoffe, Nährstoffprofil, Deklaration und Werbeaussagen von Hunde- und Katzenfutter.",
  alternates: { canonical: "/methodik" },
  openGraph: { type: "article", url: "/methodik", title: "Methodik: So bewerten wir Hunde- und Katzenfutter", images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }] },
};

const SECTIONS = [
  ["grundsaetze", "Unsere Grundsätze"],
  ["kriterien", "Die sechs Kriterien im Detail"],
  ["gesamtnote", "Gesamtnote, Ampel und Warnsignal"],
  ["ablauf", "Ablauf einer Bewertung"],
  ["quellen", "Woher die Informationen stammen"],
  ["trockensubstanz", "Vergleichbar durch Trockensubstanz"],
  ["werbeaussagen", "Der Werbeaussagen-Check"],
  ["grenzen", "Was ein Test nicht leisten kann"],
  ["aktualisierung", "Aktualisierung und Korrekturen"],
  ["unabhaengigkeit", "Unabhängigkeit und Hersteller"],
] as const;

const DETAIL: Record<CriterionKey, { fragen: string; punkte: string; abzug: string[] }> = {
  scoreRaw: {
    fragen: "Welche Rohstoffe stecken im Futter, wie hoch ist ihr Anteil und passen sie zur Tierart? Bei Hunden und vor allem bei Katzen zählt ein nachvollziehbarer Anteil an tierischem Eiweiß, möglichst aus klar benannten Fleischsorten.",
    punkte: "Punkte gibt es für eine offene Deklaration mit Mengenangaben, konkret benannte Fleisch- und Gemüsesorten und eine sinnvolle Rohstoffreihenfolge.",
    abzug: ["Sammelbegriffe wie „tierische Nebenerzeugnisse“ oder „pflanzliche Nebenerzeugnisse“ ohne Aufschlüsselung", "Geringer Fleischanteil bei hohem Anteil an Füllstoffen", "Rezepturen, die zur Tierart nicht passen, etwa viel Getreide oder Hülsenfrüchte bei Katzen"],
  },
  scoreHarmful: {
    fragen: "Enthält das Futter Zusätze oder Stoffe, die für Hund oder Katze ungeeignet oder überflüssig sind? Jeder Inhaltsstoff ist im Futter-Lexikon mit einer Ampel eingeordnet.",
    punkte: "Volle Punktzahl gibt es, wenn keine bedenklichen oder überflüssigen Zusätze deklariert sind und Konservierung und Antioxidation nachvollziehbar sind.",
    abzug: ["Zugesetzter Zucker, Karamell, Melasse oder Farbstoffe", "Synthetische Antioxidantien wie BHA, BHT oder Ethoxyquin", "Unspezifische Angaben zu Konservierungsstoffen, die eine Prüfung unmöglich machen", "Bekannte Rückrufe oder Auffälligkeiten bei Schadstoffprüfungen, soweit öffentlich dokumentiert"],
  },
  scoreNutrients: {
    fragen: "Stimmen Protein, Fett, Rohfaser und Rohasche, und wie sieht es bei Vitaminen und Mineralstoffen aus? Wir rechnen die analytischen Bestandteile auf die Trockensubstanz um, damit Nass- und Trockenfutter vergleichbar sind.",
    punkte: "Punkte gibt es für ein ausgewogenes Profil, das zu Tierart und Lebensphase passt, und für plausible Angaben zu Zusatzstoffen wie Vitaminen und Spurenelementen.",
    abzug: ["Auffällig hohe oder niedrige Gehalte im Verhältnis zur Tierart", "Fehlende Angaben, etwa zur Feuchtigkeit, die eine Einordnung erschweren", "Ungünstige Verhältnisse wichtiger Mineralstoffe, soweit angegeben"],
  },
  scoreDeclaration: {
    fragen: "Wie ehrlich und nachvollziehbar informiert der Hersteller? Hier fließt der Werbeaussagen-Check ein: Halten die Versprechen auf Packung und im Shop, was sie ankündigen, und sind sie rechtlich zulässig?",
    punkte: "Volle Punktzahl gibt es für klare, vollständige Angaben und Werbeaussagen, die sachlich belegt und zulässig sind.",
    abzug: ["Irreführende oder unzulässige Werbeaussagen, etwa krankheitsbezogene Versprechen bei Alleinfutter", "Anpreisungen ohne nachprüfbaren Kern (z. B. „das Beste für Ihren Liebling“)", "Unvollständige oder widersprüchliche Angaben auf Verpackung und Herstellerseite"],
  },
  scoreNeeds: {
    fragen: "Passt das Futter zu dem, was das Tier braucht? Wir prüfen, ob es als Alleinfuttermittel den Bedarf deckt oder als Ergänzung korrekt gekennzeichnet ist, und für welche Lebensphase es gedacht ist.",
    punkte: "Punkte gibt es für eine klare Zielgruppe, eine plausible Fütterungsempfehlung und eine Rezeptur, die zum erklärten Zweck passt.",
    abzug: ["Fehlende oder unrealistische Fütterungsempfehlung", "Ergänzungsfutter, das wie ein Alleinfutter beworben wird", "Rezeptur und Zielgruppe passen nicht zusammen, z. B. Senioren-Futter mit auffälligem Phosphorgehalt"],
  },
  scoreValue: {
    fragen: "Steht der Preis in einem angemessenen Verhältnis zu dem, was das Futter bietet? Wir vergleichen Kilopreis und Preis pro Tagesration mit der Qualität der Rezeptur.",
    punkte: "Dieses Kriterium hat bewusst nur wenig Gewicht: Ein günstiges Futter wird dadurch nicht gut, ein teures nicht automatisch schlecht.",
    abzug: ["Hoher Preis bei durchschnittlicher oder schwacher Rezeptur", "Unverhältnismäßig kleine Packungsgrößen oder Tagesrationen"],
  },
};

const SOURCES = [
  "Das Etikett und die Angaben des Herstellers (Zusammensetzung, analytische Bestandteile, Zusatzstoffe, Fütterungsempfehlung)",
  "Produktseiten des Herstellers und gängiger Händler, auch für Werbeaussagen",
  "Öffentlich zugängliche Ergebnisse unabhängiger Prüfungen, etwa von Öko-Test oder Stiftung Warentest, und amtliche Rückrufmeldungen",
  "Rechtliche Vorgaben, vor allem VO (EG) 767/2009 (Kennzeichnung von Futtermitteln), VO (EU) 2020/354 (Katalog der Einzelfuttermittel) und das Gesetz gegen den unlauteren Wettbewerb (UWG)",
  "Nährstoffempfehlungen der FEDIAF, des europäischen Heimtierfutter-Verbands",
];

export default function MethodikPage() {
  return (
    <PageShell crumb="Methodik" title="Unsere Methodik" intro={`Jedes Produkt durchläuft dieselbe Prüfung mit sechs Kriterien und maximal ${MAX_TOTAL} Punkten. Hier steht, was wir prüfen, woher die Informationen stammen und wo die Grenzen eines Tests liegen.`}>
      <nav aria-label="Inhalt dieser Seite" className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        <p className="text-sm font-bold uppercase tracking-wide text-muted">Auf dieser Seite</p>
        <ol className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2">
          {SECTIONS.map(([id, label], i) => (
            <li key={id} className="flex gap-2">
              <span className="w-5 shrink-0 text-right text-sm tabular-nums text-muted">{i + 1}.</span>
              <a href={`#${id}`} className="py-1 font-semibold text-brand hover:underline">{label}</a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="prose-fp mt-10">
        <h2 id="grundsaetze">Unsere Grundsätze</h2>
        <p>Futter ist die wichtigste tägliche Entscheidung für die Gesundheit von Hund und Katze, und die Verpackung zeigt vor allem Werbung. Unsere Bewertung soll Ihnen helfen, hinter diese Werbung zu schauen. Dafür gelten drei Regeln:</p>
        <ul>
          <li><strong>Nachvollziehbar:</strong> Jedes Kriterium, jede Gewichtung und jede Punktzahl ist offengelegt. Auf jeder Testseite sehen Sie, wie die Note zustande kommt.</li>
          <li><strong>Gleiche Maßstäbe:</strong> Alle Produkte werden nach denselben sechs Kriterien bewertet, getrennt nach Hunden und Katzen sowie nach Alleinfutter und Ergänzungsfutter.</li>
          <li><strong>Begründet:</strong> Kritik wird immer erklärt und, wo möglich, mit einer Quelle belegt. Unsere Einstufungen sind begründete fachliche Einschätzungen.</li>
        </ul>
      </div>

      <section id="kriterien" aria-labelledby="kriterien-h" className="mt-12 scroll-mt-28">
        <h2 id="kriterien-h" className="text-2xl font-extrabold">Die sechs Kriterien im Detail</h2>
        <p className="mt-2 text-muted">Die Gewichtung spiegelt, was für Gesundheit und Verträglichkeit am meisten zählt: Rohstoffe und Zusätze zusammen machen die Hälfte der Punkte aus, der Preis nur fünf Prozent.</p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
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

        <div className="mt-8 space-y-5">
          {CRITERIA.map((c, i) => {
            const d = DETAIL[c.key];
            return (
              <article key={c.key} className="rounded-2xl border border-border bg-surface p-5 shadow-card">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-extrabold"><span className="mr-2 text-sm tabular-nums text-muted">{i + 1}.</span>{c.label}</h3>
                  <span className="shrink-0 rounded-full bg-brand-soft px-3 py-1 text-sm font-bold text-brand-strong tabular-nums">{c.max} Punkte</span>
                </div>
                <p className="mt-3"><strong>Was wir prüfen:</strong> {d.fragen}</p>
                <p className="mt-2"><strong>Was Punkte bringt:</strong> {d.punkte}</p>
                <p className="mt-2 font-semibold">Was Punkte kostet:</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-muted">
                  {d.abzug.map((a) => <li key={a}>{a}</li>)}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <div className="prose-fp mt-12">
        <h2 id="gesamtnote">Gesamtnote, Ampel und Warnsignal</h2>
        <p>Die Punkte der sechs Kriterien werden zur Gesamtnote von maximal {MAX_TOTAL} Punkten addiert. Die Ampelfarbe zeigt auf einen Blick, wie das Produkt abschneidet:</p>
        <ul>
          <li><strong className="text-good">Grün (ab {RATING_THRESHOLDS.gut} Punkten):</strong> empfehlenswert</li>
          <li><strong className="text-mid">Gelb ({RATING_THRESHOLDS.mittel}–{RATING_THRESHOLDS.gut - 1} Punkte):</strong> mit Abstrichen</li>
          <li><strong className="text-bad">Rot (unter {RATING_THRESHOLDS.mittel} Punkten):</strong> nicht empfehlenswert</li>
        </ul>
        <p>Erreicht ein Produkt im Kriterium „Schadstoffe &amp; Bedenkliches“ weniger als {HARMFUL_FAIL_RATIO * 100} % der Punkte, erscheint unabhängig von der Gesamtnote ein rotes Warnsignal mit Begründung. Ein Futter kann also insgesamt gut abschneiden und trotzdem eine deutliche Warnung tragen, wenn einzelne Zusätze problematisch sind.</p>
        <p>Zu jeder Note gehören ein kurzes Fazit sowie eine Liste von Pro- und Contra-Punkten. Die Punktzahl ist ein Anhaltspunkt für den Vergleich, kein Urteil über das einzelne Tier.</p>

        <h2 id="ablauf">Ablauf einer Bewertung</h2>
        <ol>
          <li><strong>Erfassen:</strong> Wir übernehmen die vollständige Deklaration, die analytischen Bestandteile, Zusatzstoffe, Gebindegröße und Preise.</li>
          <li><strong>Rohstoffe prüfen:</strong> Qualität, Reihenfolge und Sinnhaftigkeit der Zutaten für die Tierart. Jeder Inhaltsstoff wird mit dem Futter-Lexikon abgeglichen.</li>
          <li><strong>Nährstoffprofil einordnen:</strong> Abgleich mit dem Bedarf von Hund oder Katze, umgerechnet auf die Trockensubstanz.</li>
          <li><strong>Werbeaussagen prüfen:</strong> Jede Aussage auf Packung und im Shop wird auf Zulässigkeit und Richtigkeit geprüft (u. a. VO (EG) 767/2009 Art. 11 und 13, UWG). Unzulässige Aussagen führen zu Abzügen bei „Deklaration &amp; Transparenz“ und werden im Test als Faktencheck dokumentiert.</li>
          <li><strong>Preis einordnen:</strong> Kilopreis und Preis pro Tagesration im Verhältnis zur Qualität.</li>
          <li><strong>Veröffentlichen:</strong> Der Test erscheint mit Datum, Punkten je Kriterium, Fazit und Quellen.</li>
        </ol>

        <h2 id="quellen">Woher die Informationen stammen</h2>
        <p>Wir bewerten auf Grundlage dessen, was Hersteller und Behörden öffentlich zugänglich machen. Eigene Laboranalysen führen wir in der Regel nicht durch. Wo ein Test auf Laborwerten beruht, steht das ausdrücklich im Testbericht. Genutzt werden:</p>
        <ul>{SOURCES.map((s) => <li key={s}>{s}</li>)}</ul>
        <p>Wo Angaben fehlen oder sich widersprechen, schreiben wir das im Test dazu und bewerten vorsichtig. Wir erfinden keine Werte, und fehlende Angaben können sich im Kriterium „Deklaration &amp; Transparenz“ auswirken.</p>

        <h2 id="trockensubstanz">Vergleichbar durch Trockensubstanz</h2>
        <p>Nassfutter besteht oft zu rund 80 % aus Wasser, Trockenfutter zu etwa 10 %. Ein Rohprotein-Wert von 10 % klingt in der Dose deshalb niedrig, ist aber nicht schlechter als 28 % im Trockenfutter. Damit beide fair vergleichbar sind, rechnen wir auf die Trockensubstanz um:</p>
        <p><strong>Wert in der Trockensubstanz = Wert laut Etikett ÷ (100 − Feuchtigkeit in %) × 100</strong></p>
        <p>Beispiel: 10 % Rohprotein bei 80 % Feuchtigkeit ergeben 10 ÷ 20 × 100 = 50 % Rohprotein in der Trockensubstanz. Diese Umrechnung zeigen wir auf jeder Testseite automatisch, sobald die Feuchtigkeit angegeben ist. Fehlt sie, weisen wir darauf hin.</p>

        <h2 id="werbeaussagen">Der Werbeaussagen-Check</h2>
        <p>Aussagen wie „stärkt das Immunsystem“, „natürlich“ oder „für gesunde Gelenke“ klingen nach Information, sind aber oft Marketing. Im Werbeaussagen-Check stellen wir jede Aussage des Herstellers der Bewertung gegenüber. Wir unterscheiden drei Stufen:</p>
        <ul>
          <li><strong className="text-good">Zulässig:</strong> sachlich richtig oder eine erkennbare Anpreisung ohne irreführenden Gehalt.</li>
          <li><strong className="text-mid">Fragwürdig:</strong> nicht ohne Weiteres nachprüfbar oder unscharf, zum Beispiel ein undefinierter Begriff oder fehlende Mengenangaben.</li>
          <li><strong className="text-bad">Unzulässig/irreführend:</strong> nach unserer Einschätzung nicht mit dem Kennzeichnungsrecht oder dem Wettbewerbsrecht vereinbar, zum Beispiel krankheitsbezogene Versprechen bei einem Futtermittel.</li>
        </ul>
        <p>Als Richtwert für den Abzug im Kriterium „Deklaration &amp; Transparenz“ gelten 3 Punkte je unzulässiger und 1 Punkt je fragwürdiger Aussage, insgesamt höchstens 15 Punkte. Der Abzug kann im Einzelfall abweichen. Jede Einstufung ist mit einer Begründung und, wo möglich, einer Rechtsgrundlage versehen. Sie ist unsere fachliche Meinung und keine Rechtsberatung. Unzulässige Aussagen erscheinen zusätzlich als Contra-Punkt und mit einem Hinweis oben im Test.</p>

        <h2 id="grenzen">Was ein Test nicht leisten kann</h2>
        <ul>
          <li><strong>Kein Ersatz für die Tierärztin oder den Tierarzt.</strong> Bei Erkrankungen, Allergien oder besonderen Bedürfnissen gehört die Fütterung in tierärztliche Hand.</li>
          <li><strong>Keine Aussage über Ihr Tier.</strong> Verträglichkeit und Akzeptanz sind individuell. Ein gut bewertetes Futter kann für ein einzelnes Tier ungeeignet sein, ein schwächer bewertetes gut vertragen werden.</li>
          <li><strong>Keine Fütterungsstudie.</strong> Wir bewerten Zusammensetzung und Angaben, nicht die Wirkung im Langzeitversuch.</li>
          <li><strong>Momentaufnahme.</strong> Hersteller ändern Rezepturen. Das Datum der letzten Aktualisierung steht auf jeder Testseite.</li>
        </ul>

        <h2 id="aktualisierung">Aktualisierung und Korrekturen</h2>
        <p>Bei Rezepturänderungen, neuen Erkenntnissen oder Rückrufen wird ein Test überarbeitet. Der Hinweis „Zuletzt aktualisiert“ nennt das Datum. Haben wir einen Fehler gemacht, korrigieren wir ihn sichtbar. Hinweise auf sachliche Fehler senden Sie bitte über das <Link href="/kontakt">Kontaktformular</Link>. Wir prüfen jeden Hinweis anhand der Quellen. Die Bewertung selbst ist nicht verhandelbar.</p>

        <h2 id="unabhaengigkeit">Unabhängigkeit und Hersteller</h2>
        <p>Hersteller können Produkte zur Prüfung einreichen. Eine Einreichung hat keinen Einfluss auf die Bewertung, und Zahlungen oder Kooperationen kaufen keine Note. Mehr dazu auf der Seite <Link href="/fuer-hersteller">Für Hersteller</Link>.</p>
        <p>Begriffe aus den Tests erklären wir im <Link href="/lexikon">Futter-Lexikon</Link> und im <Link href="/glossar">Glossar</Link>. Antworten auf häufige Fragen finden Sie in der <Link href="/faq">FAQ</Link>. Hier geht es direkt zu den <Link href="/tests">Tests</Link>.</p>
      </div>
    </PageShell>
  );
}
