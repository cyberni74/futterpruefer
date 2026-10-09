/** Abschnitt „Was Blogger und Halter berichten“ für die mammaly-Tests (Okt. 2026). Zitate wörtlich aus öffentlichen Blogs und Kommentaren. */
export const MAMMALY_BLOGS_MARKER = 'id="stimmen"';
const a = (u: string, l: string) => `<a href="${u}">${l}</a>`;
const ANON = a("https://anonymops.de/mammaly-leckerlis-fuer-hunde-erfahrungen-anonymops/", "Anonymops, 24.01.2022, Nachtrag 01.07.2024");
const COUCH = a("https://www.couchdogs.de/wir-testen-die-leckerli-von-mammaly/", "Couchdogs");
const REISEN = a("https://hunde-reisen-mehr.com/persoenlich-gestetet-gesunde-hundesnacks-von-mammaly/", "Hunde reisen mehr");
const BORDER = a("https://www.borderherz.de/erfahrungsbericht-gesunde-hundesnacks/", "Borderherz");

const INTRO = `<p>Studien und Zutaten sind eine Seite. Die andere ist, was Halter im Alltag berichten. Wir haben Blogs und Kommentare zu mammaly durchgesehen. Zwei Einschränkungen vorweg: Mehrere Beiträge sind als Werbung gekennzeichnet oder enthalten Affiliate-Links (Couchdogs, Borderherz, Hunde reisen mehr) oder entstanden auf Anfrage von mammaly (Anonymops). Und die Beiträge stammen von 2022 bis 2024; ein Blogger weist darauf hin, dass die Rezeptur inzwischen geändert wurde (Maltodextrin entfernt, Preis erhöht). Heutige Zutaten stehen oben im Test.</p>`;

const ALLG = `<p><strong>Allgemein:</strong> Borderherz („Werbung“) schreibt: „Bei Holly und Riley sind die gesunden Hundesnacks von Mammaly prima angekommen“, bemängelt aber den Geruch: „der Duft, der einem aus den geöffneten Dosen entgegen kommt ist ziemlich penetrant oder bzw. streng“ (${BORDER}). Anonymops formuliert nüchtern: „Alles in allem finde ich die Idee von Funktionsleckerli ganz gut, aber bei drei Hunden und 36 Leckerli am Tag, wird es wohl günstiger sein, die Nahrungsergänzungsmittel anderweitig zuzuführen.“ (${ANON}).</p>`;

export const MAMMALY_BLOG_SECTIONS: Record<string, string> = {
  "mammaly-lucky-belly-test": `<h2 id="stimmen">Was Blogger und Halter berichten</h2>
${INTRO}
<blockquote>„Marley hatte seit der Einnahme keinen Durchfall und sein Kot hat sich optisch verbessert.“</blockquote>
<p>Blogbeitrag auf ${COUCH} (mit Amazon-Links; ein Update nach einem Jahr ist verlinkt). Die Bloggerin nennt Lucky Belly in der ersten Testphase die Sorte, die sie „am meisten angetan“ habe. Dieselbe Verbesserung habe auch die Hündin einer Freundin gezeigt. Einzelfälle ohne Kontrollbedingungen; ob etwas anderes geändert wurde, steht nicht dabei.</p>
<blockquote>„Auch Raban verträgt die Hundesnacks sehr gut – kein Pupsen, kein Durchfall.“</blockquote>
<p>Blog ${REISEN} (Beitrag als „Werbung“ gekennzeichnet). Hier geht es um Verträglichkeit, nicht um eine Wirkung auf bestehende Beschwerden.</p>
${ALLG}
<p><strong>Auf der Produktseite von mammaly</strong> sind Kundenbewertungen eingebunden, darunter kritische: „Einzig der Preis ist ein Manko.“ und „Die Herzchen schmecken ihm überhaupt nicht, er haut ab, wenn ich die Dose öffne.“ Auf Trusted Shops berichtet ein Nutzer: „Mein Hund hat sich von den Supplements übergeben müssen“ (13.08.2026, Produkt nicht benannt).</p>
<p>Unser Eindruck: Die Berichte zu Lucky Belly sind überwiegend positiv, aber dünn und teils gesponsert. Besserungen nach der Gabe können auch zufällig oder durch gleichzeitige Futteränderungen entstehen.</p>`,

  "mammaly-fresh-smile-test": `<h2 id="stimmen">Was Blogger und Halter berichten</h2>
${INTRO}
<blockquote>„Viel aussagen können wir über die Wirkung aber nicht, da sie kurz zuvor eine Zahnreinigung hatte. Aber es hat sich in den letzten Wochen nichts neu bei ihr gebildet, aber ob es nun an den kleinen Leckerli liegt oder an anderen Kauartikeln die sie ja auch weiterhin bekommt, kann ich jetzt leider nicht sagen.“</blockquote>
<p>Blog ${ANON}. Der Beitrag entstand auf Anfrage von mammaly. Die Bloggerin kritisiert außerdem, dass in der damaligen Rezeptur Maltodextrin enthalten war, obwohl mit „zuckerfrei“ geworben wurde; im Nachtrag von 2024 schreibt sie, die Rezeptur sei „wohl“ geändert worden, der Preis aber „ordentlich angezogen“.</p>
<blockquote>„es hat sofort gewirkt. Die Zähne sind fast alle wieder weiß (sie waren total braun) trotz eines täglichen Kaustreifen“</blockquote>
<p>Kommentar einer Leserin unter demselben Beitrag (01.07.2022). Ein Einzelfall ohne Vorher-Nachher-Prüfung; die Leserin schreibt, sie mache sich nach dem Lesen Sorgen wegen des Maltodextrins.</p>
<blockquote>„Zahnstein, vorher ein grosses problem, ist vergessen! Auch der wirklich üble mundgeruch ist vorbei“</blockquote>
<p>Kommentar unter dem Beitrag bei ${COUCH}, nach der zweiten bestellten Dose. Ebenfalls ein Einzelfall.</p>
${ALLG}
<p>Unser Eindruck: Viele Berichte sprechen von frischerem Atem, die Bloggerin mit der Zahnreinigung vorher macht deutlich, wie schwer eine Wirkung auf Zahnstein zu beurteilen ist. Für einen Wirkungsnachweis reichen solche Berichte nicht; hilfreich ist ein Foto-Vergleich und die Kontrolle durch die Tierärztin.</p>`,

  "mammaly-relax-time-test": `<h2 id="stimmen">Was Blogger und Halter berichten</h2>
${INTRO}
<blockquote>„bei Pepe hatte ich die Relax Leckerli getestet, aber Herr von Unruh ist halt wie er ist. Nicht alles lässt sich mit „Mittelchen“ beheben, es gibt eben auch Hunde, die vom Wesen her schon unsicher sind und das lässt sich allerhöchstens mit einem Funktionsleckerli unterstützen, aber gibt ihm dadurch nicht mehr Sicherheit. Da muss ich als Halterin ran.“</blockquote>
<p>Blog ${ANON}. Eine ehrliche Aussage: kein Effekt beim unsicheren Hund, und der Hinweis, dass Training die Hauptarbeit leistet.</p>
<blockquote>„Dabei habe ich schon den Eindruck, dass Raban etwas entspannter ist, wenn der reizende Gemahl unerwartet Dinge tut, die er sonst nicht macht.“</blockquote>
<p>Blog ${REISEN} (Beitrag als „Werbung“ gekennzeichnet). Wichtig: Der Beitrag beschreibt eine ältere Rezeptur, die laut Blog auch CBD aus Hanf enthielt. Die heutige Zutatenliste (siehe oben) nennt kein CBD. Die Bloggerin schreibt außerdem, sie habe den Snack abends gegeben, wenn der Mann in der Nähe sei: ein Eindruck, kein Test.</p>
<p>Auf der Produktseite von mammaly stehen eingebundene Bewertungen wie „Es scheint irgendwas zu bewirken, aber es ist nur ein minimaler Unterschied … ziemlich teuer ist.“ und „noch kann ich leider keine Wirkung feststellen“.</p>
${ALLG}
<p>Unser Eindruck: Die Wirkung auf Stress ist in den Berichten schwach und vorsichtig. Das passt zur Studienlage und zu unserer Einschätzung der Werbeaussagen: Ein Snack kann Training und tierärztliche Abklärung nicht ersetzen.</p>`,

  "mammaly-active-hips-test": `<h2 id="stimmen">Was Blogger und Halter berichten</h2>
${INTRO}
<p>Zu Active Hips (früher „Happy Hips“) haben wir deutlich weniger Wirkberichte als zu den anderen Sorten gefunden. Das ist typisch bei Gelenkprodukten, weil sich Besserungen schleichend zeigen und schwer zuzuordnen sind.</p>
<blockquote>„Lotta bekommt die Happy Hips nun als Kur zur Unterstützung“</blockquote>
<p>Blog ${ANON}. Ein Ergebnis wird nicht berichtet; die Bloggerin nennt Kur-Gabe statt Dauergabe als ihren Ansatz („Bestenfalls sogar in meinen Augen nur kurweise“).</p>
<p>Bei ${REISEN} (als „Werbung“ gekennzeichnet) heißt es zu einer Hündin mit Gelenkproblemen sinngemäß, die Bloggerin hoffe, dass MSM auch bei der Hündin helfe, wie bei den eigenen Knien. Eine Bewertung der Wirkung steht nicht im Beitrag.</p>
${ALLG}
<p>Auf der Produktseite von mammaly sind 3.277 Bewertungen mit 4,6 Sternen angegeben (ohne Plattform und Datum). Eine Prüfung ist uns nicht möglich.</p>
<p>Unser Eindruck: Belastbare Erfahrungsberichte zur Wirkung auf Gelenke fehlen weitgehend. Wer Active Hips gibt, sollte den Verlauf mit der Tierärztin beobachten, zum Beispiel mit einem Bewegungsvideo vor und nach drei Monaten.</p>`,
};
