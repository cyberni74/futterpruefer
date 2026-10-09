import type { NischenPost } from "./blog-nischen";

/** Ratgeber „Irreführende Werbung bei Tierfutter erkennen“ (Okt. 2026). Beispiele stammen aus unseren Tests und sind dort belegt. */
const fig = (file: string, alt: string) => `<figure><img src="/blog/${file}.webp" alt="${alt}" width="1200" height="675" loading="lazy"></figure>`;
const t = (path: string, label: string) => `<a href="${path}">${label}</a>`;

export const WERBUNG_POSTS: NischenPost[] = [
  {
    slug: "irrefuehrende-werbung-tierfutter-erkennen",
    title: "Irreführende Werbung bei Tierfutter erkennen: Die acht häufigsten Tricks",
    excerpt:
      "Kundenumfrage als Beweis, „frei von“ trotz Zutat, Studien zu ganz anderen Stoffen: Acht Muster, mit denen Hunde- und Katzenfutter beworben wird, mit Beispielen aus unseren Tests und Hinweisen, was Sie tun können.",
    image: "irrefuehrende-werbung-tierfutter-etikett-pruefen.webp",
    imageAlt: "Tierärztin liest aufmerksam die Rückseite eines Futtersacks, um Werbeversprechen zu prüfen",
    metaTitle: "Irreführende Werbung bei Tierfutter erkennen: 8 Tricks",
    metaDescription:
      "Wie erkennen Sie irreführende Werbung bei Hunde- und Katzenfutter? Acht typische Tricks mit Beispielen aus unseren Tests, die Rechtslage und wohin Sie fragwürdige Werbung melden können.",
    keywords: [
      "irreführende Werbung Tierfutter",
      "Werbeaussagen Hundefutter",
      "Hundefutter Werbung Wahrheit",
      "Futtermittel Werbung Gesetz",
      "Tierfutter Werbeversprechen prüfen",
      "Wirkversprechen Ergänzungsfuttermittel",
      "Werbung Hundefutter melden",
    ],
    daysAgo: 9.45,
    bodyHtml: `
<p>„Klinisch getestet“, „reguliert Plaque“, „frei von Milchprodukten“, „nachweislich wirksam“: Auf Futterdosen und Produktseiten steht viel. Manches davon stimmt, manches ist eine Frage der Auslegung, manches hält dem Etikett nicht stand. Wir prüfen die Werbeaussagen in jedem unserer Tests einzeln und haben dabei immer wieder dieselben Muster gefunden. Hier sind acht davon, mit Beispielen aus unseren Tests und mit der Antwort auf die Frage, was erlaubt ist und was Sie tun können.</p>
<p>Wichtig vorab: Alle Einstufungen sind unsere begründete fachliche Einschätzung auf Grundlage veröffentlichter Herstellerangaben, keine rechtsverbindliche Feststellung. Wo wir „unzulässig“ schreiben, steht im jeweiligen Test, warum.</p>

<h2>Das Wichtigste in Kürze</h2>
<ul>
<li>Tierfutter darf nicht irreführen (Art. 11 Abs. 1 der Futtermittel-Kennzeichnungsverordnung VO (EG) 767/2009). Ein Futtermittel darf zudem nicht den Eindruck erwecken, Krankheiten zu verhüten, zu lindern oder zu heilen (Art. 13 Abs. 3), mit Ausnahmen für Diätfuttermittel mit besonderem Ernährungszweck.</li>
<li>Die häufigsten Tricks: eigene Kundenumfragen als Beweis, Studien zu anderen Stoffen oder Darreichungen, „frei von“-Aussagen, die der Zutatenliste widersprechen, Krankheitsnähe und Siegel ohne erklärte Kriterien.</li>
<li>Entscheidend ist das Etikett, nicht die Vorderseite. Zusammensetzung, Analyse, Zusatzstoffe und Futtermittelart („Ergänzungsfuttermittel“ oder „Alleinfuttermittel“) stehen auf dem Etikett.</li>
<li>Fragwürdige Werbung können Sie melden, bei der örtlichen Futtermittelüberwachung, und Verbraucherzentralen Hinweise geben. Auf unserer Seite ${t("/werbeaussagen", "Werbeaussagen-Check")} finden Sie die Auswertung aller Tests.</li>
</ul>

<h2>Was die Werbung darf und was nicht</h2>
<p>Für Tierfutter gilt, anders als bei Arzneimitteln, kein Zulassungsverfahren für Werbeaussagen. Hersteller bringen Futter in Verkehr, indem sie es melden und ordentlich kennzeichnen. Dafür gelten klare Regeln: Aufmachung und Werbung dürfen nicht irreführen (Art. 11 Abs. 1 VO (EG) 767/2009), Angaben müssen belegbar sein, und Futtermittel dürfen nicht als Mittel gegen Krankheiten beworben werden (Art. 13 Abs. 3). Daneben greift das Gesetz gegen den unlauteren Wettbewerb (UWG, § 5): Wer mit unwahren oder täuschenden Angaben wirbt, kann abgemahnt werden. Gerichte haben das für Tierfutter schon entschieden. So hielt das OLG Stuttgart die Bezeichnung „Anti-Zecken-Snack“ für irreführend, weil der Eindruck entstand, die Wirkung sei wissenschaftlich belegt (nach einem Bericht der <a href="https://www.it-recht-kanzlei.de/tierfutter-bewerbung-anti-zecken-snack.html">IT-Recht Kanzlei</a>).</p>
<p>Die Überwachung ist Ländersache, und nicht jede Formulierung wird geprüft; viele bewegen sich in der Grauzone. Deshalb lohnt es sich, selbst hinzusehen.</p>

${fig("tierfutter-werbeversprechen-pruefen-recherche", "Schreibtisch mit Zeitungen und Lupe bei der Recherche zu Werbeversprechen")}

<h2>Die acht häufigsten Tricks</h2>
<table>
<thead><tr><th>Trick</th><th>Beispiel aus unseren Tests</th><th>Worauf Sie achten</th></tr></thead>
<tbody>
<tr><td>1. Eigene Umfrage als Beweis</td><td>„95 % Kundenzufriedenheit“, „87 % sagen, die Kotkonsistenz habe sich verbessert“ (mammaly, ${t("/ergaenzungsfuttermittel-hund/mammaly-lucky-belly-test", "Lucky Belly")})</td><td>Wer hat gefragt, wie viele, ohne Vergleichsgruppe? Die Teilnehmerzahl wich auf der Seite je nach Stelle ab (278 gegen 466).</td></tr>
<tr><td>2. Studie zu etwas anderem</td><td>„nachweislich“ bei Gelenken, belegt mit Studien zu Muschelextrakt und zu Glucosamin plus Chondroitin, die das Produkt nicht enthält (mammaly, ${t("/ergaenzungsfuttermittel-hund/mammaly-active-hips-test", "Active Hips")})</td><td>Stimmen Stoff, Menge, Darreichung und Zielgruppe der Studie mit dem Produkt überein?</td></tr>
<tr><td>3. „Frei von“ trotz Zutat</td><td>„frei von … Milchprodukten“, aber Kaseinat in der Zutatenliste (mammaly, ${t("/ergaenzungsfuttermittel-hund/mammaly-relax-time-test", "Relax Time")})</td><td>Vergleichen Sie jede „frei von“-Aussage mit der Zusammensetzung.</td></tr>
<tr><td>4. Krankheitsnähe</td><td>„Arznei gegen depressive Zustände“, „Beruhigungsmittel“ (Tierliebhaber, ${t("/ergaenzungsfuttermittel-hund/tierliebhaber-chillout-drops", "Chillout Drops")}); „für Hunde mit Blasenentzündungen“ (${t("/ergaenzungsfuttermittel-hund/tierliebhaber-harn-und-nieren-drops", "Harn &amp; Nieren Drops")})</td><td>Behandelt, lindert, heilt, wirkt gegen …: Wörter, die ein Futtermittel nicht verwenden darf (Art. 13 Abs. 3).</td></tr>
<tr><td>5. Unscharfe Wohlfühlwörter</td><td>„harmonisierend“ (Medidog, ${t("/ergaenzungsfuttermittel-hund/medidog-ulmenrinden-paste", "Ulmenrinden Paste")}); „einzigartig“ (Lucky Belly)</td><td>Was soll das konkret heißen, und wo ist es belegt?</td></tr>
<tr><td>6. Siegel ohne Kriterien</td><td>„DLG-prämierte Qualität“ (mammaly): Prüfbescheid verlinkt, Kriterien nicht erklärt</td><td>Was wurde geprüft, von wem, wann? Ein Siegel für die Herstellung belegt keine Wirkung.</td></tr>
<tr><td>7. Widersprüche zwischen Seiten</td><td>Etikett „ab 6 Monaten“, FAQ „für alle Altersgruppen“; Abo-Rabatt 20 % und 25 % auf derselben Seite (mammaly)</td><td>Etikett und Händlerseiten lesen, nicht nur die Vorderseite der Dose.</td></tr>
<tr><td>8. Händlertexte, die weiter gehen als der Hersteller</td><td>„hilft, dem unerwünschten Kotfressen vorzubeugen“, Schlagworte „Durchfall“, „Darmsanierung“ auf einer Händlerseite (Medidog-Paste)</td><td>Auch Händler haften für ihre Texte. Vergleichen Sie Händlertext und Herstellerangaben.</td></tr>
</tbody></table>

<h2>Trick 1 und 2 genauer: Zahlen, die überzeugen sollen</h2>
<p>Wer „82 % unserer Kunden sagen“ liest, denkt an eine Studie. Gemeint ist eine Umfrage unter Kunden, die das Produkt noch nutzen. Wer unzufrieden war, hat längst aufgehört und fehlt in der Gruppe. Dazu kommt der Erwartungseffekt: Wer Geld für ein Mittel ausgibt, achtet genauer auf Besserung. Das gilt besonders bei Dingen, die schwer zu messen sind (Stimmung, „Bewegungsfreude“, Atem). Eine solche Umfrage kann ein Hinweis sein, aber kein Wirkbeweis.</p>
<p>Bei Studien lohnt der Blick auf drei Dinge: Welcher Stoff wurde untersucht (Extrakt oder Mehl, einzelner Wirkstoff oder Kombination)? In welcher Menge? An wem (Hunde mit Diagnose oder gesunde Tiere)? Die Zusammenfassungen auf Produktseiten lassen diese Angaben gern weg. Die beste Gegenprobe: die Studie selbst in einer Datenbank wie PubMed suchen und die Zusammenfassung lesen.</p>

${fig("tierfutter-werbung-hund-napf-versprechen", "Hund schnuppert an einem Futternapf, daneben ein Versprechen auf der Verpackung")}

<h2>Trick 3 bis 5: Worte, die mehr sagen, als sie dürfen</h2>
<p>„Frei von Allergenen“ klingt beruhigend. Es lohnt sich, die Zutatenliste danach zu durchsuchen: Ist der genannte Stoff dort tatsächlich nicht enthalten, auch nicht in einer Form wie „Kaseinat“ für Milcheiweiß? Bei „hypoallergen“ oder „allergikerfreundlich“ ist besondere Vorsicht angebracht, denn die Verträglichkeit ist von Tier zu Tier unterschiedlich.</p>
<p>Besonders heikel sind Verhaltens- und Krankheitsaussagen. Ein Ergänzungsfuttermittel darf die Ernährung ergänzen, aber nicht Angst, Aggression, Blasenentzündung oder Gelenkerkrankungen behandeln. Formulierungen wie „unterstützt die Ausgeglichenheit“ liegen im Rahmen, „wirkt gegen Angst“ nicht. Ob es sich um eine zulässige Unterstützung handelt oder um eine Krankheitsaussage, hängt vom Gesamteindruck ab, und in der Praxis streiten sich Gerichte darüber. In unseren Tests stufen wir Aussagen mit ausdrücklicher Krankheits- oder Behandlungsbezeichnung als unzulässig ein und führen die Begründung auf.</p>
<p>Wichtig für Halterinnen und Halter: Bei Angst, Aggression, Durchfall oder Gelenkbeschwerden hilft zuerst die Tierarztpraxis. Ein Snack ersetzt keine Diagnose.</p>

<h2>Trick 6 bis 8: Siegel, Widersprüche, Händlertexte</h2>
<p>Siegel wirken seriös, weil sie nach Prüfung klingen. Fragen Sie nach: Wer hat geprüft, nach welchen Kriterien, und bezieht sich das Siegel auf Herstellung oder auf Wirkung? Die DLG-Auszeichnung auf der mammaly-Seite bezieht sich nach den Angaben dort auf geprüfte Qualität; eine Wirkung auf die Gesundheit des Hundes belegt sie nicht.</p>
<p>Widersprüche zwischen Etikett, Produktseite und FAQ sind ein Warnsignal, nicht weil sie immer Absicht wären, sondern weil sie zeigen, wie wenig sorgfältig kontrolliert wird. Das Etikett gilt: Was dort steht (Alter, Futtermittelart, Dosierung), ist die verbindliche Angabe.</p>

<h2>Checkliste: So prüfen Sie ein Produkt in fünf Minuten</h2>
<ul>
<li>☐ Futtermittelart auf dem Etikett: Alleinfuttermittel oder Ergänzungsfuttermittel? Nur ein Alleinfuttermittel deckt den Bedarf allein.</li>
<li>☐ Zusammensetzung: offene Deklaration mit Prozentwerten? Welche Zutat steht vorn?</li>
<li>☐ Zusatzstoffe: mit Namen und Funktionsgruppe genannt? „Konservierungsmittel“ allein reicht nicht.</li>
<li>☐ Jede „frei von“-Aussage mit der Zutatenliste abgleichen.</li>
<li>☐ Jede Zahl in der Werbung: Quelle, Anzahl der Teilnehmer, Vergleichsgruppe?</li>
<li>☐ Studienverweise: dieselbe Substanz, derselbe Wirkstoff, ähnliche Menge, Hunde mit der Beschwerde?</li>
<li>☐ Krankheitsbegriffe (Angst, Entzündung, Arthrose, Durchfall): Warnsignal.</li>
<li>☐ Preis pro Tag statt pro Dose ausrechnen und das Abo-Kleingedruckte lesen.</li>
<li>☐ Bei Beschwerden eines Tieres zuerst die Tierarztpraxis fragen.</li>
</ul>

<h2>Fragwürdige Werbung melden: Das können Sie tun</h2>
<ul>
<li><strong>Futtermittelüberwachung vor Ort:</strong> Für Tierfutter ist in der Regel das örtliche Veterinär- oder Lebensmittelüberwachungsamt zuständig. Die Zuständigkeit unterscheidet sich je nach Bundesland und Kommune. Die richtige Adresse finden Sie über die Website Ihres Landkreises oder Ihrer Stadt.</li>
<li><strong>Verbraucherzentrale:</strong> Hinweise zu fragwürdiger Werbung nimmt die Verbraucherzentrale Ihres Bundeslandes entgegen. Die Verbraucherzentralen können Unternehmen bei Verstößen gegen das UWG abmahnen oder verklagen; über einzelne Beschwerden entscheiden sie nicht.</li>
<li><strong>Hersteller und Händler:</strong> Wenn ein Produkt nicht hält, was es verspricht, können Sie Erstattung verlangen. Aufbewahren sollten Sie Kaufbeleg, Verpackung und Screenshots der Produktseite mit Datum.</li>
</ul>
<p>Wir selbst sind keine Behörde und können Beschwerden nicht weiterleiten. Unsere ${t("/werbeaussagen", "Auswertung aller beanstandeten Aussagen")} hilft Ihnen aber, Muster zu erkennen.</p>

<h2>Häufige Fragen</h2>
<h3>Dürfen Hersteller mit Studien werben?</h3>
<p>Ja, aber die Studie muss zum beworbenen Produkt passen. Eine Studie zu einem anderen Stoff, einer anderen Menge oder anderen Tieren ist für die Aussage über das Produkt wenig wert. Der Gesamteindruck darf nicht täuschen (UWG § 5).</p>
<h3>Ist „natürlich“ ein geschützter Begriff?</h3>
<p>Nein, ein einheitlicher Rechtsbegriff für „natürlich“ bei Heimtierfutter existiert nach unserer Kenntnis nicht. Was zählt, sind die tatsächlichen Zutaten und Zusatzstoffe. Zu Zusatzstoffen in Hundefutter lesen Sie auch unseren Ratgeber ${t("/blog/zucker-im-hundefutter-katzenfutter", "Zucker im Hunde- und Katzenfutter")}.</p>
<h3>Wie erkenne ich, ob ein Produkt Alleinfutter ist?</h3>
<p>Das steht auf dem Etikett: „Alleinfuttermittel“ oder „Ergänzungsfuttermittel“. Wie sich beide unterscheiden, erklärt unser Beitrag ${t("/blog/alleinfuttermittel-ergaenzungsfuttermittel", "Alleinfuttermittel und Ergänzungsfuttermittel")}.</p>

<h2>Fazit: Wer Werbung glaubt, muss nachrechnen</h2>
<p>Gute Produkte brauchen keine übertriebenen Versprechen, und übertriebene Versprechen sagen nichts über die Qualität der Zutaten. Es kann ein sauber deklariertes Futter schlecht beworben sein, und ein schlicht aussehendes Produkt kann ehrlich sein. Entscheidend ist, die Werbung mit dem Etikett abzugleichen, Zahlen nach der Quelle zu fragen und bei Beschwerden die Tierarztpraxis einzubinden. Und wenn eine Aussage zu schön klingt, um wahr zu sein, lohnt der Blick auf das Kleingedruckte.</p>
`,
  },
];
