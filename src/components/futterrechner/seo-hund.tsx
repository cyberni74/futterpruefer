import Link from "next/link";
import { gewichtungSatz } from "@/lib/futterrechner/texte";
import { Infografik2, Infografik3, Infografik4, Infografik5, Infografik6 } from "./infografiken";

const a = "font-semibold text-brand underline underline-offset-4 hover:text-brand-strong";

export function SeoHund() {
  return (
    <div className="prose-fp mt-12">
      <h2 id="so-rechnet">So rechnet der Futterrechner</h2>
      <p>
        Auf der Packung stehen nur „analytische Bestandteile“ in Prozent, bezogen auf das Futter samt Wasser. Damit lassen sich Nass- und Trockenfutter nicht direkt vergleichen. Der Rechner übersetzt die Werte in vier Schritten in etwas, das sich mit dem Bedarf Ihres Hundes vergleichen lässt. Wo die Werte auf dem Etikett stehen, zeigt die aufklappbare Etikett-Hilfe im Rechner. Mehr dazu: <Link href="/blog/futterdeklaration-richtig-lesen" className={a}>Futterdeklaration richtig lesen</Link>.
      </p>
      <h3 id="schritt-1">Schritt 1: Trockenmasse</h3>
      <p>
        Die Trockenmasse (TS) ist der Rest ohne Wasser: TS = 100 − Feuchte. Ein Wert in der Trockenmasse ergibt sich aus Wert ÷ TS × 100. Ein Nassfutter mit 10,5 % Rohprotein und 78 % Feuchte hat 47,7 % Protein in der Trockenmasse, ein Trockenfutter mit 25 % Protein und 10 % Feuchte nur 27,8 %. Ausführlich erklärt das der Beitrag <Link href="/blog/trockenmasse-berechnen-nass-trockenfutter" className={a}>Trockenmasse berechnen</Link>.
      </p>
      <Infografik2 />
      <h3 id="schritt-2">Schritt 2: Kalorien (ME) nach NRC 2006</h3>
      <p>
        Die Energie steht selten auf der Packung. FEDIAF empfiehlt für Fertigfutter das Vierschrittverfahren des NRC (2006): Aus Rohprotein, Rohfett sowie Rohfaser und dem rechnerischen Rest (NfE) ergibt sich die Bruttoenergie. Davon zieht der Rechner die Verdaulichkeit ab (91,2 − 1,43 × Rohfaser in der TS) und von der verdaulichen Energie noch 1,04 kcal je g Rohprotein. Übrig bleibt die umsetzbare Energie (ME) je 100 g. Bei mehr als 8 % Rohfaser in der Trockenmasse unterschätzt die Formel die Energie eher, dann zeigt der Rechner einen Hinweis. Nennt der Hersteller die Energie, gilt dieser Wert.
      </p>
      <h3 id="schritt-3">Schritt 3: Energiebedarf Ihres Hundes</h3>
      <p>
        Der Bedarf (MER) ergibt sich aus einem Faktor mal Gewicht hoch 0,75. FEDIAF nennt je nach Alter und Aktivität 95 bis 130, für Arbeitshunde 150 bis 175. Für kastrierte Hunde rechnen wir mit rund 10 % weniger. Das ist eine eigene Ableitung aus den AAHA-Leitlinien von 2021 (1,4 bis 1,6 statt 1,6 bis 1,8 × Ruheenergiebedarf), keine FEDIAF-Zahl. Für Welpen gilt die Wachstumsformel (254,1 − 135 × aktuelles Gewicht ÷ Endgewicht) × Gewicht hoch 0,75. Die Tagesmenge ist dann Bedarf ÷ Energie des Futters × 100. Alle Mengen sind Startwerte mit 10 % Spanne: FEDIAF weist darauf hin, dass Bedarfsangaben den tatsächlichen Bedarf um 10 bis 60 % überschätzen können.
      </p>
      <Infografik3 art="hund" />
      <h3 id="schritt-4">Schritt 4: Nährstoffe je 1000 kcal gegen FEDIAF</h3>
      <p>
        Wer wenig frisst, braucht pro Kalorie mehr Nährstoffe. Darum rechnet der Rechner Protein und Fett auf 1000 kcal um (Wert ÷ ME × 1000) und vergleicht sie mit den FEDIAF-Mindestwerten für die passende Lebensphase.
      </p>
      <h2 id="rohprotein-rohfett">Wie viel Rohprotein und Rohfett braucht Hundefutter?</h2>
      <div className="overflow-x-auto">
        <table>
          <thead><tr><th>Hund</th><th>Rohprotein (g/1000 kcal)</th><th>Rohfett (g/1000 kcal)</th></tr></thead>
          <tbody>
            <tr><td>erwachsen, Faktor über 100</td><td>45</td><td>13,75</td></tr>
            <tr><td>erwachsen, Faktor 100 oder weniger (wenig aktiv, Senior, kastriert)</td><td>52,1</td><td>13,75</td></tr>
            <tr><td>Welpe unter 14 Wochen</td><td>62,5</td><td>21,25</td></tr>
            <tr><td>Welpe ab 14 Wochen</td><td>50</td><td>21,25</td></tr>
          </tbody>
        </table>
      </div>
      <p>Quelle: FEDIAF 2025, Tab. III-3b. Fett ist an sich nicht essenziell, solange die essenziellen Fettsäuren gedeckt sind. Das Minimum zu erreichen bringt Punkte, den größeren Teil der Note bestimmt aber das Verhältnis von Protein zu Fett: Volle Punkte gibt es ab 2,9 g Protein je g Fett. So sieht die Energieverteilung der Wolfsbeute aus, 54 % Protein zu 45 % Fett (Bosch et al. 2015). Bei 1 : 1 gibt es keine Punkte, denn dann stammen rund zwei Drittel der Energie aus Fett. Hohes Protein kostet nie Punkte, ein Maximum nennt FEDIAF dafür nicht.</p>
      <Infografik4 art="hund" />
      <h2 id="calcium-phosphor">Calcium, Phosphor und Rohasche richtig einordnen</h2>
      <p>
        Calcium und Phosphor müssen im Verhältnis stimmen: Für erwachsene Hunde nennt FEDIAF 1 : 1 bis 2 : 1, für Welpen unter 14 Wochen 1 : 1 bis 1,6 : 1. Beide Werte sind freiwillige Angaben, viele Hersteller nennen sie auf Nachfrage. Ohne sie vergibt der Rechner höchstens „gut“. Die Rohasche ist die Summe aller Mineralstoffe. Bei 30 Hunde-Trockenfuttern lag sie zwischen 4,8 und 9,9 % der Trockenmasse, im Mittel bei 7,1 % (Kazimierska et al. 2020). Unser Rechner-Band von 3 bis 12 % ist eine eigene Festlegung. Außerhalb gibt es 3 Punkte Abzug unter „Plausibilität“, aber keine Abwertung als „schlecht“. Liegt die Rohasche über 10 % der Trockenmasse und ist das Rohprotein hoch, zieht der Rechner zusätzlich bis zu 6 Punkte ab: Dann kann ein Teil des Eiweißes aus Knochen, Knorpel oder Haut stammen, und die Analyse unterscheidet das nicht (Schätzung nach den Nährwerten). Mehr zum Thema: <Link href="/blog/rohasche-im-futter" className={a}>Rohasche im Futter</Link>.
      </p>
      <Infografik5 />
      <h2 id="rechenbeispiele">Rechenbeispiele</h2>
      <p>Alle Beispiele nutzen fiktive Futter. Ähnlichkeiten mit Produkten sind Zufall.</p>
      <h3>T1 Erwachsener Hund</h3>
      <p>Trockenfutter mit 25 % Rohprotein, 14 % Rohfett, 2,5 % Rohfaser, 7 % Rohasche, 10 % Feuchte, 1,3 % Calcium und 0,95 % Phosphor. Hund mit 20 kg, 3 bis 7 Jahre, normal aktiv. Energie: 370,5 kcal/100 g. Bedarf: 110 × 20<sup>0,75</sup> = 1.040 kcal am Tag, also 281 g Futter (253 bis 309 g). Protein: 67 g je 1000 kcal, das 1,5-Fache des Minimums von 45 g. Fett 38 g. Ca : P = 1,37 : 1. Auf 1 g Fett kommen 1,79 g Protein, 25 % der Energie stammen aus Protein. Ergebnis: 74 Punkte, „befriedigend“ für die Nährwerte: Die Mindestwerte sind weit übertroffen, das Verhältnis von Protein zu Fett liegt aber deutlich unter dem Ziel von 2,9 : 1.</p>
      <h3>T3 Welpe</h3>
      <p>Welpe mit 17 Wochen und 12 kg, erwartetes Endgewicht 30 kg, Welpenfutter mit 28 % Protein und 17 % Fett. Bedarf: (254,1 − 135 × 12 ÷ 30) × 12<sup>0,75</sup> = 1.290 kcal, das sind 336 g am Tag. Protein 73 g (Minimum 50 g), Fett 44 g (Minimum 21,25 g). Das Adult-Futter aus T1 erreicht beim Welpen ebenfalls 74 Punkte, weil der Rechner nur die Werte prüft, die er kennt, nicht etwa Aminosäuren oder Spurenelemente. Das Welpenfutter selbst kommt auf 74 Punkte, „befriedigend“. Für Welpen ist ein Futter mit der Angabe „für Welpen/Wachstum“ der sichere Weg.</p>
      <h3>T4 Senior</h3>
      <p>Hund mit 10 Jahren, 25 kg, kastriert, normal aktiv. Das Futter nennt keine Feuchte und kein Calcium oder Phosphor. Der Rechner nimmt 10 % Feuchte an, zieht dafür 2 Punkte ab und vergibt wegen der fehlenden Mineralstoffwerte höchstens „gut“. Bedarf: 85,5 × 25<sup>0,75</sup> = 956 kcal, das sind 275 g. Ergebnis: 70 Punkte, „befriedigend“.</p>
      <h3>T7 Knappes Futter</h3>
      <p>Trockenfutter mit 15 % Protein, 4,5 % Fett, 9,5 % Rohasche, 2,4 % Calcium und 0,8 % Phosphor für einen wenig aktiven Hund mit 15 kg. Das Protein liegt bei 49 g je 1000 kcal bei einem Minimum von 52,1 g, also bei 94 %. Calcium liegt mit 2,67 % der Trockenmasse über dem Höchstwert von 2,5 %, Ca : P bei 3 : 1. Ergebnis: 55 Punkte, „mangelhaft“.</p>
      <h3>T9 Fettreiches Nassfutter</h3>
      <p>Nassfutter mit 10 % Rohprotein, 9 % Rohfett, 2,3 % Rohasche und 76 % Feuchte für einen Hund mit 20 kg. Es erfüllt alle FEDIAF-Mindestwerte, auf 1 g Fett kommen aber nur 1,11 g Protein, und 64 % der Energie stammen aus Fett. Fett macht schmackhaft und liefert viel Energie, deshalb fressen Tiere davon leicht mehr als nötig (Hewson-Hughes et al. 2013). Ergebnis: 67 Punkte, „ausreichend“.</p>
      <h2 id="so-bewerten-wir">So bewerten wir: was die Note sagt und was nicht</h2>
      <p>
        Der Nährwert-Check vergibt bis zu 100 Punkte: Protein-Fett-Verhältnis 35, Calcium und Phosphor 20, Protein-Energieanteil 15, Protein-Minimum 10, Plausibilität 10, Fett-Minimum 5, Kohlenhydrate 5. {gewichtungSatz()} Liegt Protein oder Fett unter 90 % des FEDIAF-Minimums, gibt es höchstens „mangelhaft“. Die Note bewertet nur die Nährwerte, die Sie eingegeben haben. Zutaten, Rohstoffqualität und Zusatzstoffe kann ein Rechner nicht prüfen. Das tun unsere <Link href="/tests" className={a}>Tests</Link> nach der 100-Punkte-<Link href="/methodik" className={a}>Methodik</Link>. Gute Werte machen noch kein gutes Futter. Ergänzungsfutter und Snacks bekommen keine Note, mehr dazu in <Link href="/blog/alleinfuttermittel-ergaenzungsfuttermittel" className={a}>Alleinfutter oder Ergänzungsfutter</Link>.
      </p>
      <Infografik6 />
    </div>
  );
}
