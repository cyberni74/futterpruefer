import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { faqPageJsonLd } from "@/lib/faq-schema";
import { trimMetaDescription } from "@/lib/seo";

const TITLE = "Methodik Ergänzungsfutter: So testen wir";
const DESCRIPTION = trimMetaDescription(
  "Wirkstoff, Dosis je kg, Träger, Werbung, Transparenz: So bewerten wir Pasten, Tabletten, Pulver und Smoothies für Hund und Katze. 100 Punkte, Ampel.",
);

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/methodik/ergaenzungsfutter" },
  openGraph: { type: "article", url: "/methodik/ergaenzungsfutter", title: TITLE, images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }] },
};

const SECTIONS = [
  ["warum", "Warum eine eigene Bewertung für Ergänzungsfutter?"],
  ["kriterien", "Welche Kriterien zählen?"],
  ["auswahl", "Wie bewerten wir die Auswahl der Wirkstoffe? (20 Punkte)"],
  ["dosierung", "Wie bewerten wir die Dosierung? (30 Punkte)"],
  ["referenzdosen", "Welche Dosis ist wirksam? Referenzdosen je kg Körpergewicht"],
  ["werbeaussagen", "Wie prüfen wir die Werbeaussagen? (20 Punkte)"],
  ["traeger", "Was macht einen guten Träger aus? (15 Punkte)"],
  ["transparenz", "Wann gibt es Punkte für Transparenz? (15 Punkte)"],
  ["sicherheit", "Wie gehen Sicherheit und Tierschutz ein?"],
  ["gesamtnote", "Wie entstehen Gesamtnote und Ampel?"],
  ["faq", "Häufige Fragen"],
] as const;

/** Sichtbare Fragen, 1:1 auch im FAQPage-JSON-LD. */
export const ERGAENZUNG_FAQ = [
  {
    question: "Warum zählt der Wirkstoff die Hälfte der Punkte?",
    answer: "Für ihn kaufen Sie das Produkt. Stimmen Auswahl oder Menge nicht, hilft der beste Träger nicht.",
  },
  {
    question: "Was ist eine Alibi-Dosierung?",
    answer: "Der Wirkstoff steht auf der Packung, aber es steckt weniger als ein Viertel der wirksamen Menge drin, oder die Menge fehlt ganz. Solche Produkte sind immer Rot.",
  },
  {
    question: "Bekommen Diätfuttermittel automatisch mehr Punkte?",
    answer: "Nein. Ein gelisteter Diätzweck nach VO (EU) 2020/354 muss rechtlich vollständig gekennzeichnet sein, bringt aber keine Pauschalpunkte. Die Auswahl-Punkte richten sich wie bei jedem Wirkstoff nach der Studienlage; 17–20 Punkte gibt es nur bei guter Evidenz.",
  },
  {
    question: "Wie viel Glucosamin braucht ein Hund?",
    answer: "In der bekanntesten Studie bekam ein Hund mit 20 kg rund 1,4 g Glucosamin-HCl pro Tag, das sind etwa 70 mg je kg. Das ist die Studiendosis, keine Empfehlung für Ihren Hund. Eine Metaanalyse von 2022 fand keinen überzeugenden Beleg für eine schmerzlindernde Wirkung und rät davon ab; fragen Sie im Zweifel Ihre Tierärztin oder Ihren Tierarzt.",
  },
  {
    question: "Wirkt Ulmenrinde beim Hund?",
    answer: "Kontrollierte Studien bei Hunden haben wir nicht gefunden. Deshalb gibt es keine Referenzdosis.",
  },
  {
    question: "Warum gibt es für Sicherheit keine Punkte?",
    answer: "Weil Sicherheit Pflicht ist und kein Bonus. Ein Sicherheitsproblem führt zu einem Warnsignal und begrenzt die Note.",
  },
  {
    question: "Warum hat Ergänzungsfutter keine Nährstoffbewertung?",
    answer: "Die Tagesmenge ist klein und trägt kaum zum Bedarf bei.",
  },
  {
    question: "Kann ich die Punkte mit Alleinfutter vergleichen?",
    answer: "Die Ampel bedeutet dasselbe, die Kriterien sind andere.",
  },
  {
    question: "Wann bekommt ein Hersteller volle Transparenz-Punkte?",
    answer: "Wenn alle Wirkstoffmengen deklariert sind und eine echte Laboranalyse des fertigen Produkts vorliegt.",
  },
  {
    question: "Ersetzt Ergänzungsfutter den Tierarzt?",
    answer: "Nein. Bei Beschwerden gehört Ihr Tier zum Tierarzt. Futtermittel dürfen nicht mit dem Verhüten, Behandeln oder Heilen von Krankheiten werben.",
  },
  {
    question: "Haftet Futterprüfer für die Angaben?",
    answer: "Wir prüfen sorgfältig und mit Quellen, können aber nicht jede Rezepturänderung sofort erfassen. Maßgeblich ist das Etikett des gekauften Produkts. Unsere Tests ersetzen keine tierärztliche Beratung. Fehler korrigieren wir und vermerken das im Änderungsprotokoll.",
  },
] as const;

function Quelle({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function ErgaenzungsfutterMethodikPage() {
  const faqLd = faqPageJsonLd([...ERGAENZUNG_FAQ]);
  return (
    <PageShell
      crumb="Ergänzungsfutter"
      path="/methodik/ergaenzungsfutter"
      title="Wie bewertet Futterprüfer Ergänzungsfutter für Hund und Katze?"
    >
      {faqLd && <JsonLd data={faqLd} />}
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
        <p><strong>Kurz gesagt:</strong> Ergänzungsfutter deckt allein nicht den Tagesbedarf, sondern soll vor allem bestimmte Stoffe liefern (vgl. Art. 3 Abs. 2 Buchst. j VO (EG) Nr. 767/2009). Darum gibt es die Hälfte der Punkte nur für den Wirkstoff: Ist es der richtige, und steckt genug davon drin? Die andere Hälfte verteilt sich auf ehrliche Werbung, einen sauberen Träger und offene Angaben. Sicherheitsprobleme bringen keine Punkte, sondern ein Warnsignal und eine schlechtere Ampel. Die Ampel ist dieselbe wie bei Alleinfutter.</p>
        <p><em>Stand: 17.10.2026 · Verantwortlich: Redaktion Futterprüfer · Methodik-Version: ergaenzung-v1</em></p>
        <p><strong>Änderungsprotokoll:</strong> 17.10.2026 – Erstveröffentlichung</p>

        <h2 id="warum">Warum eine eigene Bewertung für Ergänzungsfutter?</h2>
        <p>Ein Alleinfutter muss den ganzen Tagesbedarf decken, deshalb zählen dort Rohstoffe und Nährstoffprofil (<Link href="/methodik">Methodik Alleinfutter</Link>). Ergänzungsfutter wird in kleinen Mengen gegeben und soll einen bestimmten Stoff liefern, etwa Glucosamin, Omega-3-Fettsäuren oder Flohsamen. Alles andere ist Träger, der den Wirkstoff schmackhaft und haltbar macht. Eine Bewertung von Protein und Fett wäre hier sinnlos.</p>

        <h2 id="kriterien">Welche Kriterien zählen?</h2>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Kriterien der Ergänzungsfutter-Bewertung</caption>
          <thead className="bg-bg-soft">
            <tr>
              <th scope="col" className="p-3">Kriterium</th>
              <th scope="col" className="p-3">Was wir prüfen</th>
              <th scope="col" className="p-3 text-right">Punkte</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border"><th scope="row" className="p-3 font-semibold">Wirkstoff</th><td className="p-3" /><td className="p-3 text-right font-bold tabular-nums">50</td></tr>
            <tr className="border-t border-border"><th scope="row" className="p-3 font-semibold">– Auswahl der Wirkstoffe</th><td className="p-3 text-muted">Passen die Wirkstoffe zum beworbenen Zweck, und ist die Wirkung beim Tier durch Studien belegt? Auch gelistete Diätzwecke nur nach Studienlage</td><td className="p-3 text-right font-bold tabular-nums">20</td></tr>
            <tr className="border-t border-border"><th scope="row" className="p-3 font-semibold">– Dosierung</th><td className="p-3 text-muted">Erreicht die Tagesmenge je kg Körpergewicht die wirksame Dosis aus Studien?</td><td className="p-3 text-right font-bold tabular-nums">30</td></tr>
            <tr className="border-t border-border"><th scope="row" className="p-3 font-semibold">Werbeaussagen</th><td className="p-3 text-muted">Sind die Aussagen erlaubt und belegt (VO (EG) Nr. 767/2009)?</td><td className="p-3 text-right font-bold tabular-nums">20</td></tr>
            <tr className="border-t border-border"><th scope="row" className="p-3 font-semibold">Trägerqualität</th><td className="p-3 text-muted">Gute Rohstoffe oder Zucker, Füllstoffe und überflüssige Zusätze?</td><td className="p-3 text-right font-bold tabular-nums">15</td></tr>
            <tr className="border-t border-border"><th scope="row" className="p-3 font-semibold">Transparenz</th><td className="p-3 text-muted">deklarierte Wirkstoffmengen (5) und prüfbare Herstellerunterlagen (10)</td><td className="p-3 text-right font-bold tabular-nums">15</td></tr>
            <tr className="border-t border-border bg-bg-soft"><th scope="row" className="p-3 font-bold">Gesamt</th><td className="p-3" /><td className="p-3 text-right font-extrabold tabular-nums">100</td></tr>
            <tr className="border-t border-border"><th scope="row" className="p-3 font-semibold">Sicherheit</th><td className="p-3 text-muted">keine Punkte, harte Regeln: Warnsignal und Deckel</td><td className="p-3 text-right font-bold">–</td></tr>
            <tr className="border-t border-border"><th scope="row" className="p-3 font-semibold">Tierschutz</th><td className="p-3 text-muted">keine Punkte, eigener Abschnitt auf jeder Testseite</td><td className="p-3 text-right font-bold">–</td></tr>
          </tbody>
        </table>
      </div>

      <div className="prose-fp mt-6">
        <p>Der Preis ist kein Kriterium. Wir nennen auf jeder Testseite den Preis pro Tagesdosis für einen Hund mit 10 kg bzw. eine Katze mit 4 kg.</p>

        <h2 id="auswahl">Wie bewerten wir die Auswahl der Wirkstoffe? (20 Punkte)</h2>
        <ul>
          <li><strong>17–20:</strong> mehrere kontrollierte, möglichst verblindete Studien beim Zieltier mit klinisch relevantem Ergebnis</li>
          <li>Ein in VO (EU) 2020/354 gelisteter Diätzweck bringt keine Pauschalpunkte. Wir bewerten ihn wie jeden Wirkstoff nach der Studienlage.</li>
          <li><strong>11–16:</strong> einzelne kontrollierte Studien beim Zieltier oder eine widersprüchliche Studienlage</li>
          <li><strong>5–10:</strong> nur Studien an anderen Tierarten oder am Menschen, Fallberichte, ein plausibler Mechanismus</li>
          <li><strong>0–4:</strong> keine Studien, nur Tradition oder Herstellerbehauptung, oder der Wirkstoff passt nicht zum beworbenen Zweck</li>
          <li>Bei Mischungen zählt der Hauptwirkstoff. Für jeden beigemischten Stoff ohne Beleg ziehen wir 1–2 Punkte ab („viel draufgeschrieben, wenig drin“).</li>
        </ul>

        <h2 id="dosierung">Wie bewerten wir die Dosierung? (30 Punkte)</h2>
        <p>Wir rechnen die Tagesmenge laut Hersteller in mg je kg Körpergewicht um, für einen Hund mit 10 kg und 30 kg bzw. eine Katze mit 4 kg, und vergleichen sie mit der Referenzdosis in der Tabelle unten.</p>
        <ul>
          <li><strong>26–30:</strong> im wirksamen Bereich</li>
          <li><strong>18–25:</strong> 75–99 % der Referenzdosis</li>
          <li><strong>8–17:</strong> 25–74 % der Referenzdosis</li>
          <li><strong>0: Alibi-Dosierung.</strong> Das sind weniger als 25 % der Referenzdosis, oder die Menge ist nicht deklariert.</li>
          <li><strong>Keine belegte Referenzdosis</strong> (in der Tabelle als Lücke markiert): höchstens 10 Punkte, weil sich eine Wirkung nicht beurteilen lässt.</li>
        </ul>
        <p><strong>Alibi-Regel:</strong> Wird ein Wirkstoff beworben, aber als Alibi dosiert, ist die Gesamtnote <strong>höchstens 59 Punkte (Rot)</strong>.</p>

        <h2 id="referenzdosen">Welche Dosis ist wirksam? Referenzdosen je kg Körpergewicht</h2>
        <p>Alle Quellen wurden am 17.10.2026 aufgerufen (PubMed, Verlagsseite oder EUR-Lex); wo wir eine Zahl nicht selbst im Volltext prüfen konnten, steht das in der Zeile.</p>
        <p><strong>Wichtig:</strong> Die Referenzdosen sind ein Bewertungsmaßstab für unsere Tests, <strong>keine Dosierempfehlung und kein tierärztlicher Rat</strong>. Viele Werte stammen aus Studien an kranken Tieren oder aus Therapieschemata (z. B. Zink, Taurin). Geben Sie Ihrem Tier keine höheren Mengen als vom Hersteller angegeben, und sprechen Sie Dosis und Dauer mit Ihrer Tierärztin oder Ihrem Tierarzt ab, besonders bei Vorerkrankungen, Trächtigkeit, Jungtieren und Medikamenten. Wo eine Studie feste Mengen pro Tier statt je kg nennt, steht die Originalangabe dabei; die Umrechnung je kg ist unsere eigene Rechnung. „Lücke“ heißt: keine belastbare Dosis beim Hund oder bei der Katze gefunden. In diesem Fall gibt es höchstens 10 Punkte für die Dosierung.</p>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Referenzdosen je kg Körpergewicht, Stand 17.10.2026</caption>
          <thead className="bg-bg-soft">
            <tr>
              <th scope="col" className="p-3">Wirkstoff</th>
              <th scope="col" className="p-3">Referenzdosis (pro Tag)</th>
              <th scope="col" className="p-3">Tier</th>
              <th scope="col" className="p-3">Quelle</th>
              <th scope="col" className="p-3">Beleglage / Hinweis</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <th scope="row" className="p-3 font-semibold">Glucosamin-HCl</th>
              <td className="p-3">Studie: Kombipräparat mit 475 mg Glucosamin-HCl je g; 2 g/Tag (5–19,9 kg), 3 g/Tag (20–40 kg), 4 g/Tag (&gt;40 kg) → <strong>mind. ca. 35–50 mg/kg</strong> (eigene Umrechnung, Untergrenze je Gewichtsklasse)</td>
              <td className="p-3">Hund</td>
              <td className="p-3">McCarthy G. et al., Vet J 2007;174:54–61, <Quelle href="https://pubmed.ncbi.nlm.nih.gov/16647870/">PMID 16647870</Quelle>, doi:10.1016/j.tvjl.2006.02.015</td>
              <td className="p-3">Wirkung umstritten: Review ohne klares Ergebnis (Bhathal A. et al., Open Vet J 2017, <Quelle href="https://pubmed.ncbi.nlm.nih.gov/28331832/">PMID 28331832</Quelle>); Metaanalyse rät bei Schmerz ab (Barbeau-Grégoire M. et al., Int J Mol Sci 2022, <Quelle href="https://doi.org/10.3390/ijms231810384">doi:10.3390/ijms231810384</Quelle>)</td>
            </tr>
            <tr className="border-t border-border">
              <th scope="row" className="p-3 font-semibold">Chondroitinsulfat</th>
              <td className="p-3">Studie wie oben, 350 mg Chondroitinsulfat je g → <strong>mind. ca. 25–35 mg/kg</strong> (eigene Umrechnung)</td>
              <td className="p-3">Hund</td>
              <td className="p-3">McCarthy 2007 (s. o.)</td>
              <td className="p-3">nur in Kombination untersucht, Bewertung wie Glucosamin</td>
            </tr>
            <tr className="border-t border-border">
              <th scope="row" className="p-3 font-semibold">Grünlippmuschel (gefriergetrocknetes Pulver)</th>
              <td className="p-3">450 mg/Tag (&lt;25 kg), 750 mg/Tag (25–34 kg), 1000 mg/Tag (&gt;34 kg) → <strong>mind. ca. 20 mg/kg</strong> (eigene Umrechnung)</td>
              <td className="p-3">Hund</td>
              <td className="p-3">Bierer T. L., Bui L. M., J Nutr 2002, <Quelle href="https://jn.nutrition.org/article/S0022-3166(22)15171-0/fulltext">Volltext</Quelle>; Bui &amp; Bierer, Vet Ther 2003;4:397–407, <Quelle href="https://pubmed.ncbi.nlm.nih.gov/15136981/">PMID 15136981</Quelle> (0,3 % im Futter)</td>
              <td className="p-3">in der Metaanalyse 2022 unter Omega-3 positiv eingeordnet; gilt nur für ganzes, schonend getrocknetes Muschelfleisch</td>
            </tr>
            <tr className="border-t border-border">
              <th scope="row" className="p-3 font-semibold">EPA + DHA</th>
              <td className="p-3">Arthrose: <strong>310 mg × kg KG^0,75</strong> (für einen 10-kg-Hund ca. 1,7 g/Tag); sichere Obergrenze (NRC): <strong>370 mg × kg KG^0,75</strong></td>
              <td className="p-3">Hund</td>
              <td className="p-3">Bauer J. E., JAVMA 2011;239:1441–1451 (Tabelle wiedergegeben in Bauer, JAVMA 2016;249:1267, <Quelle href="https://avmajournals.avma.org/downloadpdf/view/journals/javma/249/11/javma.249.11.1267.pdf">PDF</Quelle>); Studienbeleg: Roush J. K. et al., JAVMA 2010;236:59–66, <Quelle href="https://pubmed.ncbi.nlm.nih.gov/20043800/">PMID 20043800</Quelle></td>
              <td className="p-3">gut belegt (Metaanalyse 2022)</td>
            </tr>
            <tr className="border-t border-border">
              <th scope="row" className="p-3 font-semibold">MSM</th>
              <td className="p-3">–</td>
              <td className="p-3">–</td>
              <td className="p-3">–</td>
              <td className="p-3"><strong>Lücke</strong></td>
            </tr>
            <tr className="border-t border-border">
              <th scope="row" className="p-3 font-semibold">Kollagen, nicht denaturiert (UC-II)</th>
              <td className="p-3"><strong>10 mg pro Hund und Tag</strong> (fest, nicht je kg)</td>
              <td className="p-3">Hund</td>
              <td className="p-3">Gupta R. C. et al., J Anim Physiol Anim Nutr 2012;96:770–777, <Quelle href="https://pubmed.ncbi.nlm.nih.gov/21623931/">PMID 21623931</Quelle>, doi:10.1111/j.1439-0396.2011.01166.x</td>
              <td className="p-3">kleine Gruppen (n = 7–10); <strong>Lücke: Kollagenhydrolysat</strong></td>
            </tr>
            <tr className="border-t border-border">
              <th scope="row" className="p-3 font-semibold">Probiotika (Enterococcus faecium SF68)</th>
              <td className="p-3">ca. <strong>2,1 × 10⁹ KBE pro Tier und Tag</strong></td>
              <td className="p-3">Katze (Hund: kein Effekt)</td>
              <td className="p-3">Bybee S. N. et al., JVIM 2011;25:856–860, <Quelle href="https://pubmed.ncbi.nlm.nih.gov/21689152/">PMID 21689152</Quelle></td>
              <td className="p-3">gilt nur für diesen Stamm; <strong>Lücke: allgemeine Dosis je kg und andere Stämme</strong></td>
            </tr>
            <tr className="border-t border-border">
              <th scope="row" className="p-3 font-semibold">Biotin</th>
              <td className="p-3"><strong>ca. 0,5 mg/kg</strong> (5 mg je 10 kg)</td>
              <td className="p-3">Hund</td>
              <td className="p-3">Frigg M. et al., Schweiz Arch Tierheilkd 1989, <Quelle href="https://pubmed.ncbi.nlm.nih.gov/2602924/">PMID 2602924</Quelle></td>
              <td className="p-3">unkontrollierte Studie, schwacher Beleg</td>
            </tr>
            <tr className="border-t border-border">
              <th scope="row" className="p-3 font-semibold">Zink (elementar)</th>
              <td className="p-3">Zinkreaktive Dermatose: <strong>2–3 mg/kg</strong></td>
              <td className="p-3">Hund</td>
              <td className="p-3">White S. D. et al., Vet Dermatol 2001, <Quelle href="https://doi.org/10.1046/j.1365-3164.2001.00233.x">doi:10.1046/j.1365-3164.2001.00233.x</Quelle>; <Quelle href="https://www.merckvetmanual.com/pharmacology/systemic-pharmacotherapeutics-of-the-integumentary-system/vitamins-and-minerals-for-integumentary-disease-in-animals">Merck Veterinary Manual</Quelle></td>
              <td className="p-3">nur bei dieser Erkrankung und nur unter tierärztlicher Kontrolle. Gesetzlicher Höchstgehalt (Hund, Katze): 200 mg Zink je kg Alleinfuttermittel bei 12 % Feuchte, beim Ergänzungsfutter bezogen auf die Tagesration, <Quelle href="https://eur-lex.europa.eu/eli/reg_impl/2016/1095/oj/eng">VO (EU) 2016/1095</Quelle></td>
            </tr>
            <tr className="border-t border-border">
              <th scope="row" className="p-3 font-semibold">Ulmenrinde</th>
              <td className="p-3">–</td>
              <td className="p-3">–</td>
              <td className="p-3">–</td>
              <td className="p-3"><strong>Lücke</strong></td>
            </tr>
            <tr className="border-t border-border">
              <th scope="row" className="p-3 font-semibold">Flohsamen (Psyllium)</th>
              <td className="p-3">–</td>
              <td className="p-3">Hund</td>
              <td className="p-3">Leib M. S., JVIM 2000;14:27–32, <Quelle href="https://pubmed.ncbi.nlm.nih.gov/10668813/">PMID 10668813</Quelle></td>
              <td className="p-3"><strong>Lücke:</strong> Der Volltext ist nicht frei zugänglich (Wiley, Abo nötig; Stand 17.10.2026). Das Abstract nennt nur einen Median von 2 Esslöffeln Metamucil pro Tag, keine Menge je kg. Keine Zahl übernommen.</td>
            </tr>
            <tr className="border-t border-border">
              <th scope="row" className="p-3 font-semibold">Taurin</th>
              <td className="p-3">Katze: <strong>250 mg pro Katze alle 12 h</strong> (bei DCM); Hund: <strong>1000–3000 mg pro Hund und Tag</strong> (bei Mangel mit DCM)</td>
              <td className="p-3">Katze/Hund</td>
              <td className="p-3">Pion P. D. et al., Science 1987, <Quelle href="https://pubmed.ncbi.nlm.nih.gov/3616607/">PMID 3616607</Quelle>; Pion et al., JAVMA 1992;201:275 (<Quelle href="https://avmajournals.avma.org/downloadpdf/view/journals/javma/201/2/javma.1992.201.02.275.pdf">PDF</Quelle>); Fascetti A. J. et al., JAVMA 2003;223:1137, <Quelle href="https://pubmed.ncbi.nlm.nih.gov/14584743/">PMID 14584743</Quelle></td>
              <td className="p-3">belegt nur bei Mangel bzw. DCM, nicht für gesunde Tiere</td>
            </tr>
            <tr className="border-t border-border">
              <th scope="row" className="p-3 font-semibold">L-Carnitin</th>
              <td className="p-3"><strong>50–100 mg/kg alle 8 h</strong> (systemischer Mangel); bei Mangel im Herzmuskel ggf. 200 mg/kg (nur wenige Fälle)</td>
              <td className="p-3">Hund</td>
              <td className="p-3">McCauley S. R. et al., J Anim Sci 2020 (Übersichtsarbeit), Volltext geprüft am 17.10.2026: <Quelle href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7447921/">PMC7447921</Quelle>. Die Arbeit nennt als Herkunft Keene 1991 und Sanderson 2006; diese Originalquellen sind nicht geprüft.</td>
              <td className="p-3">nur bei Carnitinmangel/DCM, Grundlage sind Fallberichte; die Übersichtsarbeit wurde von BSM Partners (Branchenberatung) finanziert</td>
            </tr>
            <tr className="border-t border-border">
              <th scope="row" className="p-3 font-semibold">Hyaluronsäure (oral)</th>
              <td className="p-3">–</td>
              <td className="p-3">–</td>
              <td className="p-3">–</td>
              <td className="p-3"><strong>Lücke</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="prose-fp mt-6">
        <h2 id="werbeaussagen">Wie prüfen wir die Werbeaussagen? (20 Punkte)</h2>
        <p>Grundlage ist die VO (EG) Nr. 767/2009, vor allem Art. 11 (keine Irreführung) und Art. 13 (Angaben). Nach Art. 13 Abs. 3 darf nicht behauptet werden, dass ein Futtermittel eine Krankheit verhindert, behandelt oder heilt; ausgenommen sind nur Kokzidiostatika/Histomonostatika und Angaben zu ernährungsbedingten Mängeln ohne krankhaften Zusammenhang. Angaben zur Optimierung der Ernährung müssen wissenschaftlich belegt sein (Art. 13 Abs. 1). Ein Diätzweck ist nur zulässig, wenn er in VO (EU) 2020/354 gelistet ist und alle dort genannten Merkmale und Kennzeichnungen erfüllt sind (Art. 9, 10 und 18 VO (EG) Nr. 767/2009).</p>
        <ul>
          <li><strong>18–20:</strong> alle Aussagen zulässig, belegt und mit allen Pflichtangaben (z. B. „Ergänzungsfuttermittel für Hunde“)</li>
          <li><strong>12–17:</strong> übertreibend, aber zulässig</li>
          <li><strong>6–11:</strong> unbelegte Wirkversprechen, fehlende Pflichtangaben oder widersprüchliche Angaben (z. B. „Ergänzung“ und „vollwertige Mahlzeit“)</li>
          <li><strong>0–5:</strong> unzulässige Krankheitsbezüge („bei Arthrose“, „heilt Durchfall“) oder Angaben, die wir nach Prüfung als irreführend einstufen; jede Einstufung begründen wir im Faktencheck</li>
        </ul>
        <p><strong>Heilaussagen-Deckel:</strong> höchstens 79 Punkte (nie Grün). Jede beanstandete Aussage steht wörtlich und mit Quelle im Faktencheck.</p>

        <h2 id="traeger">Was macht einen guten Träger aus? (15 Punkte)</h2>
        <p>Wir starten bei 15 Punkten. Gute, klar benannte und sinnvolle Rohstoffe halten die Punkte, jeder Mangel kostet:</p>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Abzüge bei der Trägerqualität</caption>
          <thead className="bg-bg-soft">
            <tr>
              <th scope="col" className="p-3">Befund</th>
              <th scope="col" className="p-3 text-right">Abzug</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border"><td className="p-3">Zugesetzter Zucker, Glukosesirup, Melasse, Honig als Süßungsmittel, Karamell</td><td className="p-3 text-right font-bold tabular-nums">−4</td></tr>
            <tr className="border-t border-border"><td className="p-3">Synthetische Antioxidantien (BHA, BHT, Ethoxyquin, Propylgallat)</td><td className="p-3 text-right font-bold tabular-nums">−4</td></tr>
            <tr className="border-t border-border"><td className="p-3">Farbstoffe, auch „natürliche“, die nur der Optik dienen</td><td className="p-3 text-right font-bold tabular-nums">−3</td></tr>
            <tr className="border-t border-border"><td className="p-3">Füllstoffe als Hauptbestandteil (Stärke, Cellulose, Getreidemehl, Maltodextrin)</td><td className="p-3 text-right font-bold tabular-nums">−2 bis −4</td></tr>
            <tr className="border-t border-border"><td className="p-3">Konservierungsstoffe ohne technische Notwendigkeit oder nur als Gruppenangabe</td><td className="p-3 text-right font-bold tabular-nums">−2</td></tr>
            <tr className="border-t border-border"><td className="p-3">Nicht bezeichnete Aromen, Geschmacksverstärker</td><td className="p-3 text-right font-bold tabular-nums">−2</td></tr>
            <tr className="border-t border-border"><td className="p-3">Sammelbegriffe („tierische/pflanzliche Nebenerzeugnisse“)</td><td className="p-3 text-right font-bold tabular-nums">−2</td></tr>
            <tr className="border-t border-border"><td className="p-3">Weitere überflüssige Zusätze</td><td className="p-3 text-right font-bold tabular-nums">−1 je Stoff</td></tr>
          </tbody>
        </table>
      </div>

      <div className="prose-fp mt-6">
        <p>Mindestwert 0. Bei Tabletten sind Hilfsstoffe nötig. Wir ziehen nur ab, wenn sie die Rezeptur dominieren oder vermeidbar sind.</p>

        <h2 id="transparenz">Wann gibt es Punkte für Transparenz? (15 Punkte)</h2>
        <p><strong>Deklarierte Wirkstoffmengen (0–5):</strong> 5 = alle Wirkstoffe mit Menge pro Tagesdosis oder pro kg; 2–3 = nur Prozentangaben oder nur teilweise; 0 = keine Menge.</p>
        <p><strong>Herstellerunterlagen (0–10)</strong>, wie bei Alleinfutter:</p>
        <ul>
          <li><strong>10:</strong> nur mit echter Laboranalyse des fertigen Produkts (akkreditiertes Labor, Charge, Datum) mit Wirkstoffgehalt</li>
          <li><strong>6–8:</strong> unterschriebene Unterlagen, Wirkstoffspezifikation, Rohstoffzertifikate</li>
          <li><strong>3–5:</strong> unsignierte Dokumente oder Datenblätter</li>
          <li><strong>1–2:</strong> nur E-Mail-Antworten ohne Belege</li>
          <li><strong>0:</strong> keine Unterlagen</li>
        </ul>
        <p>Wir fragen jeden Hersteller vor der Veröffentlichung gleich an. Unterlagen bringen nur Punkte in diesem Teilkriterium (höchstens 10 von 100) und verändern die übrigen Kriterien nur, wenn sie dort einen Sachverhalt belegen (z. B. eine gemessene Wirkstoffmenge). Für Bewertungen nehmen wir kein Geld. Wir bewerten anhand öffentlicher Angaben und eigener Recherche. Bei manchen Produkten verdienen wir über als Werbung gekennzeichnete Amazon-Links eine Provision, das hat keinen Einfluss auf die Note; rot bewertete Produkte erhalten keinen Kauflink.</p>

        <h2 id="sicherheit">Wie gehen Sicherheit und Tierschutz ein?</h2>
        <p>Sicherheit bringt keine Punkte, weil Sicherheit selbstverständlich sein muss. Ein Problem zieht die Note nach unten:</p>
        <ul>
          <li><strong>Schwer:</strong> Der Stoff ist für die Tierart ungeeignet (z. B. Xylit, Knoblauch/Zwiebel in relevanter Menge, ätherische Öle bei Katzen), oder bei Fütterung nach Herstellerangabe kann der sichere Bereich oder ein gesetzlicher Höchstgehalt nach den Zusatzstoff-Zulassungen (VO (EG) Nr. 1831/2003), umgerechnet auf die Tagesration, überschritten werden (z. B. Vitamin D, Vitamin A, Selen, Kupfer, Zink). <strong>Folge: rotes Warnsignal, höchstens 39 Punkte.</strong></li>
          <li><strong>Mittel:</strong> Ein Hinweis auf bekannte Wechselwirkungen fehlt (sofern in der Fachliteratur belegt), ebenso nötige Warnhinweise (Trächtigkeit, Jungtiere, Nieren- oder Leberkranke) oder die Angabe der Fütterungsdauer, wo sie nötig ist. <strong>Folge: rotes Warnsignal, höchstens 59 Punkte.</strong></li>
        </ul>
        <p><strong>Tierschutz:</strong> Jede Testseite hat einen Abschnitt „Tierschutz“. Darin steht, ob Tierversuche gemacht wurden (Herstellerauskunft) und woher die tierischen Rohstoffe stammen, z. B. Grünlippmuschel aus Aquakultur oder Haifischknorpel. Kritische Befunde nennen wir im Fazit und unter Contra.</p>

        <h2 id="gesamtnote">Wie entstehen Gesamtnote und Ampel?</h2>
        <p>Punkte addieren, dann Deckel anwenden (der niedrigste gilt):</p>
        <ul>
          <li>Alibi-Dosierung oder keine Mengenangabe: max. 59</li>
          <li>Heilaussagen: max. 79</li>
          <li>Sicherheit mittel: max. 59 + Warnsignal</li>
          <li>Sicherheit schwer: max. 39 + Warnsignal</li>
        </ul>
        <p><strong className="text-good">Grün</strong> ab 80 (empfehlenswert) · <strong className="text-mid">Gelb</strong> 60–79 (mit Abstrichen) · <strong className="text-bad">Rot</strong> unter 60 (nicht empfehlenswert). Produkte mit roter Ampel bekommen keinen Kauf-Button.</p>

        <h2 id="faq">Häufige Fragen</h2>
        {ERGAENZUNG_FAQ.map((item) => (
          <p key={item.question}><strong>{item.question}</strong> {item.answer}</p>
        ))}
      </div>
    </PageShell>
  );
}
