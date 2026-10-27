import Link from "next/link";
import { Infografik2, Infografik3, Infografik4, Infografik5, Infografik6 } from "./infografiken";

const a = "font-semibold text-brand underline underline-offset-4 hover:text-brand-strong";

export function SeoKatze() {
  return (
    <div className="prose-fp mt-12">
      <h2 id="so-rechnet">So rechnet der Futterrechner</h2>
      <p>
        Auf der Packung stehen nur „analytische Bestandteile“ in Prozent, bezogen auf das Futter samt Wasser. Gerade bei Nassfutter wirken die Werte dadurch niedrig. Der Rechner übersetzt sie in vier Schritten in etwas, das sich mit dem Bedarf Ihrer Katze vergleichen lässt. Wo die Werte auf dem Etikett stehen, zeigt die aufklappbare Etikett-Hilfe im Rechner. Mehr dazu: <Link href="/blog/futterdeklaration-richtig-lesen" className={a}>Futterdeklaration richtig lesen</Link>.
      </p>
      <h3 id="schritt-1">Schritt 1: Trockenmasse</h3>
      <p>
        Die Trockenmasse (TS) ist der Rest ohne Wasser: TS = 100 − Feuchte. Ein Wert in der Trockenmasse ergibt sich aus Wert ÷ TS × 100. Nassfutter mit 80 % Feuchte hat nur 20 % Trockenmasse: 11 % Rohprotein auf der Packung sind dann 55 % in der Trockenmasse. Ausführlich erklärt das der Beitrag <Link href="/blog/trockenmasse-berechnen-nass-trockenfutter" className={a}>Trockenmasse berechnen</Link>.
      </p>
      <Infografik2 />
      <h3 id="schritt-2">Schritt 2: Kalorien (ME) nach NRC 2006</h3>
      <p>
        FEDIAF empfiehlt für Fertigfutter das Vierschrittverfahren des NRC (2006). Für Katzen gilt: Bruttoenergie aus Rohprotein, Rohfett sowie Rohfaser und dem rechnerischen Rest (NfE), dann die Verdaulichkeit (87,9 − 0,88 × Rohfaser in der TS) und zuletzt 0,77 kcal je g Rohprotein abziehen. Nennt der Hersteller die Energie, gilt dieser Wert, und der Rechner zeigt unsere Schätzung daneben.
      </p>
      <h3 id="schritt-3">Schritt 3: Energiebedarf Ihrer Katze</h3>
      <p>
        Der Bedarf (MER) ergibt sich aus Faktor × Gewicht hoch 0,67. Für kastrierte Katzen und Wohnungskatzen nennt FEDIAF 75 (Spanne 52 bis 75), für unkastrierte Freigänger 100. Kitten brauchen ein Vielfaches von 100 × Gewicht hoch 0,67: bis 4 Monate das 2,0- bis 2,5-Fache, von 4 bis 9 Monaten das 1,75- bis 2,0-Fache, danach das 1,5-Fache. Alle Mengen sind Startwerte mit 10 % Spanne, denn Bedarfsangaben können den tatsächlichen Bedarf um 10 bis 60 % überschätzen. Wiegen Sie Ihre Katze alle zwei bis vier Wochen und passen Sie die Menge an.
      </p>
      <Infografik3 art="katze" />
      <h3 id="schritt-4">Schritt 4: Nährstoffe je 1000 kcal gegen FEDIAF</h3>
      <p>
        Der Rechner rechnet Protein und Fett auf 1000 kcal um (Wert ÷ ME × 1000) und vergleicht sie mit den FEDIAF-Mindestwerten für die passende Lebensphase.
      </p>
      <h2 id="rohprotein-rohfett">Wie viel Rohprotein und Rohfett braucht Katzenfutter?</h2>
      <div className="overflow-x-auto">
        <table>
          <thead><tr><th>Katze</th><th>Rohprotein (g/1000 kcal)</th><th>Rohfett (g/1000 kcal)</th></tr></thead>
          <tbody>
            <tr><td>erwachsen, unkastriert mit Freigang</td><td>62,5</td><td>22,5</td></tr>
            <tr><td>erwachsen, kastriert oder Wohnung</td><td>83,3</td><td>22,5</td></tr>
            <tr><td>Kitten (Wachstum)</td><td>70</td><td>22,5</td></tr>
          </tbody>
        </table>
      </div>
      <p>Quelle: FEDIAF 2025, Tab. III-4b.</p>
      <Infografik4 art="katze" />
      <h2 id="kastriert-eiweiss">Warum kastrierte Katzen mehr Eiweiß pro Kalorie brauchen</h2>
      <p>
        Eine kastrierte Katze braucht weniger Energie und frisst deshalb weniger. Der Eiweißbedarf sinkt aber nicht im selben Maß. Darum muss jede Kalorie mehr Eiweiß liefern: FEDIAF nennt für diese Katzen 83,3 g Rohprotein je 1000 kcal statt 62,5 g. Ein Trockenfutter mit 27 % Protein, das für eine Freigängerin reicht, kann für eine kastrierte Wohnungskatze zu knapp sein. Genau das zeigt die Ergebnis-Karte mit dem Hinweis zum Mindestwert.
      </p>
      <h2 id="calcium-phosphor">Calcium, Phosphor und Rohasche richtig einordnen</h2>
      <p>
        Für erwachsene Katzen nennt FEDIAF ein Verhältnis von 1 : 1 bis 2 : 1 bei mindestens 0,40 bis 0,53 % Calcium in der Trockenmasse, für Kitten 1 : 1 bis 1,5 : 1 bei mindestens 1,0 %. Calcium und Phosphor sind freiwillige Angaben. Fehlen sie, vergibt der Rechner höchstens „gut“. Die Rohasche ist die Summe aller Mineralstoffe. Unser Rechner-Band von 3 bis 12 % der Trockenmasse ist eine eigene Festlegung, Nassfutter liegt in unseren Testdaten oft bei 8 bis 14 %. Mehr zum Thema: <Link href="/blog/rohasche-im-futter" className={a}>Rohasche im Futter</Link>.
      </p>
      <Infografik5 />
      <h2 id="taurin">Taurin: was auf der Packung steht</h2>
      <p>
        Taurin ist für Katzen lebensnotwendig. Auf der Packung steht meist nur die zugesetzte Menge unter „Zusatzstoffe je kg“, zum Beispiel „Taurin 1.000 mg“. Der Rechner rechnet sie in Prozent der Trockenmasse um ((mg/kg ÷ 10.000) ÷ TS × 100) und vergleicht mit FEDIAF: für Nassfutter 0,20 bis 0,27 %, für Trockenfutter 0,10 bis 0,13 %, bei Kitten 0,25 beziehungsweise 0,10 %. Die höheren Werte bei Nassfutter begründet FEDIAF mit der geringeren Verfügbarkeit nach Hitzebehandlung. Ohne Angabe prüft der Rechner Taurin nicht und deckelt die Note auch nicht.
      </p>
      <h2 id="rechenbeispiele">Rechenbeispiele</h2>
      <p>Alle Beispiele nutzen fiktive Futter. Ähnlichkeiten mit Produkten sind Zufall.</p>
      <h3>T5 Erwachsene Katze, Nassfutter</h3>
      <p>Nassfutter mit 11 % Rohprotein, 5,5 % Rohfett, 0,4 % Rohfaser, 2 % Rohasche, 80 % Feuchte, 0,3 % Calcium, 0,22 % Phosphor und 1.000 mg/kg Taurin. Katze mit 4,5 kg, kastriert, Wohnung. Energie: 95,4 kcal/100 g. Bedarf: 75 × 4,5<sup>0,67</sup> = 206 kcal, also 215 g Futter (194 bis 237 g). Protein 115 g je 1000 kcal bei einem Minimum von 83,3 g (1,38-Fach), Fett 58 g. Taurin 0,50 % der Trockenmasse bei einem Minimum von 0,27 %. Ergebnis: 100 Punkte, „sehr gut“ für die Nährwerte.</p>
      <h3>T6 Kitten</h3>
      <p>Kitten mit 5 Monaten und 2,5 kg, Trockenfutter mit 34 % Protein, 20 % Fett, 8 % Feuchte und 2.000 mg/kg Taurin. Energie: 409,6 kcal/100 g. Bedarf: 100 × 2,5<sup>0,67</sup> × 1,875 = 346 kcal, das sind 85 g am Tag (76 bis 93 g). Protein 83 g je 1000 kcal (Minimum 70 g). Ergebnis: 95 Punkte, „sehr gut“.</p>
      <h2 id="so-bewerten-wir">So bewerten wir: was die Note sagt und was nicht</h2>
      <p>
        Die Nährwert-Note vergibt bis zu 100 Punkte: Protein 35, Fett 20, Calcium und Phosphor 20, Taurin 10, Plausibilität 15. Liegt Protein oder Fett unter 90 % des FEDIAF-Minimums, gibt es höchstens „mangelhaft“. Die Note bewertet nur die Nährwerte, die Sie eingegeben haben. Zutaten, Rohstoffqualität und Zusatzstoffe kann ein Rechner nicht prüfen. Das tun unsere <Link href="/tests" className={a}>Tests</Link> nach der 100-Punkte-<Link href="/methodik" className={a}>Methodik</Link>. Gute Werte machen noch kein gutes Futter. Ergänzungsfutter und Snacks bekommen keine Note: <Link href="/blog/alleinfuttermittel-ergaenzungsfuttermittel" className={a}>Alleinfutter oder Ergänzungsfutter</Link>.
      </p>
      <Infografik6 />
    </div>
  );
}
