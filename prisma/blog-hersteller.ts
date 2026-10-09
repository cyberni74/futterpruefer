import type { NischenPost } from "./blog-nischen";

/** Hersteller-Porträts (Okt. 2026): Fakten mit Quelle, Selbstangaben als solche gekennzeichnet. Recherchestand 9. Oktober 2026. */
const fig = (file: string, alt: string) => `<figure><img src="/blog/${file}.webp" alt="${alt}" width="1200" height="675" loading="lazy"></figure>`;
const a = (url: string, label: string) => `<a href="${url}">${label}</a>`;

type Firma = { name: string; facts: string; history: string[]; good: string[]; bad: string[]; quote: string; src: string };

const render = (f: Firma) => `<h3>${f.name}</h3>
<p>${f.facts}</p>
<p><strong>Historie:</strong> ${f.history.join(" ")}</p>
<p><strong>Das spricht für das Unternehmen:</strong></p>
<ul>${f.good.map((g) => `<li>${g}</li>`).join("")}</ul>
<p><strong>Das wird kritisch gesehen:</strong></p>
<ul>${f.bad.map((g) => `<li>${g}</li>`).join("")}</ul>
<blockquote>${f.quote}</blockquote>
<p>${f.src}</p>`;

const KONZERNE: Firma[] = [
  {
    name: "1. Mars Petcare (Pedigree, Whiskas, Cesar, Royal Canin, Iams, Nutro, Orijen, Acana)",
    facts: `Mars Petcare ist die Heimtiersparte von Mars, Incorporated. Der Mutterkonzern wurde am 23. Juni 1911 von Franklin C. Mars in Tacoma (Washington) gegründet, Sitz ist McLean (Virginia), und er ist vollständig in Familienbesitz. Weil Mars privat ist, legt der Konzern keinen Umsatz der Tiersparte offen. ${a("https://en.wikipedia.org/wiki/Mars_Petcare", "Wikipedia")}`,
    history: [
      "2002 kaufte Mars Royal Canin für über 1,5 Milliarden Euro, 2007 Doane Petcare, 2014 Iams, Eukanuba und Natura von Procter &amp; Gamble für 2,9 Milliarden US-Dollar.",
      "2017 folgte die Tierklinikkette VCA für rund 9,1 Milliarden US-Dollar; Ende Februar 2023 schloss Mars die Übernahme von Champion Petfoods (Orijen, Acana) ab.",
    ],
    good: [
      `Das Waltham Centre for Pet Nutrition wurde im Dezember 2019 nach „über 50 Jahren“ zum Waltham Petcare Science Institute umgebaut und auf Tiergesundheit, Diagnostik und Pet-Technologie erweitert (${a("https://www.veterinarypracticenews.com/?p=30125", "Veterinary Practice News")}).`,
    ],
    bad: [
      `Bei der VCA-Übernahme 2017 sah die US-Wettbewerbsbehörde FTC Risiken in der Fach- und Notfalltiermedizin in zehn Regionen. Mars musste zwölf Kliniken an drei Käufer abgeben und zehn Jahre lang weitere Zukäufe in bestimmten Gebieten melden. Das ist eine Behördenauflage und kein Verstoß (${a("https://www.veterinarypracticenews.com/?p=13555", "Veterinary Practice News, 04.09.2017")}).`,
      "Wer Mars sagt, meint nicht eine Marke, sondern ein ganzes Portfolio: Pedigree, Whiskas, Cesar, Royal Canin, Iams, Nutro und seit 2023 auch Orijen und Acana kommen aus demselben Haus.",
    ],
    quote: "„We are thrilled to welcome Champion Petfoods and its more than 800 talented people to the Mars Petcare family.“ (Ikdeep Singh, Global President Mars Pet Nutrition, Mars-Pressemitteilung vom 01.11.2022, englisches Original)",
    src: `Quelle: ${a("https://www.petbusinessworld.co.uk/trade-news/manufacturers/mars-petcare-to-acquire-owner-of-orijen-and-acana-brands.html", "Pet Business World")}`,
  },
  {
    name: "2. Nestlé Purina PetCare (Pro Plan, Dog Chow, Friskies, Beneful, Purina ONE)",
    facts: `Die Wurzeln liegen 1894 in St. Louis (Missouri), wo William H. Danforth die Futtermittelfirma Purina Mills gründete; die Quellen nennen auch 1893. Seit Dezember 2001 gehört das Geschäft zu Nestlé, das Ralston Purina für 10,3 Milliarden US-Dollar übernahm und mit Friskies PetCare verschmolz (${a("https://en.wikipedia.org/wiki/Nestl%C3%A9_Purina_PetCare", "Wikipedia")}).`,
    history: ["1902 Umbenennung in Ralston Purina, 2013 Kauf der Adoptionsplattform Petfinder, 2018 Start des Purina Institute, 2020 Kauf von Lily’s Kitchen."],
    good: [
      `Eine Lebensspannen-Studie an 48 Labradoren aus sieben Würfen über 14 Jahre ergab: Hunde mit 25 % weniger Kalorien lebten im Median 13 statt 11,2 Jahre, veröffentlicht im Journal of the American Veterinary Medical Association. Das sind Herstellerangaben (${a("https://newscenter.purina.com/LifeSpanStudy", "Purina Newscenter")}).`,
    ],
    bad: [
      `Hundesnacks aus China („Jerky Treats“): Nach Meldungen über Erkrankungen bei über 5.600 Hunden und über 1.000 Todesfällen, die die FDA nicht abschließend mit den Snacks verknüpfen konnte, einigte sich Purina am 30.05.2014 auf einen Vergleich über 6,5 Millionen US-Dollar ohne Schuldeingeständnis (${a("https://www.veterinarypracticenews.com/?p=2788", "Veterinary Practice News")}, ${a("https://www.nbcnews.com/health/health-news/jerky-pet-treat-deal-makers-agree-6-5-million-fund-n119021", "NBC News")}).`,
      "Im Streit mit Blue Buffalo (siehe dort) warf Purina dem Konkurrenten irreführende Werbung vor.",
    ],
    quote: "„At Purina, what goes in the bag goes on the label.“ (Steven Crimmins, Purina-Pressemitteilung vom 06.05.2014, englisches Original)",
    src: `Quelle: ${a("https://newscenter.purina.com/2014-05-06-Purina-Sues-Blue-Buffalo-For-False-Advertising-And-Disparagement", "Purina Newscenter")}`,
  },
  {
    name: "3. Royal Canin",
    facts: `Der französische Tierarzt Jean Cathary gründete Royal Canin 1968 in der Region Gard, Sitz ist Aimargues. Seit Juli 2002 gehört die Marke Mars; das Sortiment umfasst rund 450 Rezepturen (${a("https://en.wikipedia.org/wiki/Royal_Canin", "Wikipedia")}).`,
    history: ["1972 Verkauf an die Guyomarc’h-Gruppe, 1973 Forschungszentrum Saint-Nolff, 1997 Börsengang in Paris, 2004 Kauf der Tiermedizin-Marken IVD, Medi-Cal und Techni-Cal von Del Monte für 82,5 Millionen US-Dollar."],
    good: [
      "Nach den Melamin-Funden 2007 kündigte Royal Canin USA an, keine chinesischen pflanzlichen Eiweißlieferanten mehr zu nutzen (Herstellerangabe).",
      "Mars kündigte 2021 46 Millionen Euro Investitionen am Standort Frankreich an.",
    ],
    bad: [
      `Am 11.05.2007 weitete Royal Canin USA einen Rückruf wegen melaminbelasteten Reisproteinkonzentrats auf Produkte der Marken Sensible Choice und Kasco aus. Bestätigte Erkrankungen gab es laut Unternehmen nicht (${a("https://ebarrelracing.com/watching/sensible-choice-dry-dog-cat-food-recalled-royal-canin-usa/", "Rückruf-Mitteilung")}).`,
    ],
    quote: "„We deeply regret the concern and anxiety this announcement today will cause our loyal customers and the entire pet community.“ (Olivier Amice, CEO Royal Canin USA, Rückruf-Mitteilung vom 11.05.2007, englisches Original)",
    src: `Quelle: ${a("https://ebarrelracing.com/watching/sensible-choice-dry-dog-cat-food-recalled-royal-canin-usa/", "Rückruf-Mitteilung")}`,
  },
  {
    name: "4. Hill’s Pet Nutrition (Science Diet, Prescription Diet)",
    facts: `Burton Hill gründete 1907 in Kansas die „Hill Rendering Works“, ein Verwertungsbetrieb. Hill’s gehört zu Colgate-Palmolive. Den Durchbruch brachten Diätfutter für Tiere mit Nierenproblemen (1948, Canine k/d) und Science Diet, das ab 1968 über Tierärzte und Fachhandel vertrieben wurde (${a("https://en.wikipedia.org/wiki/Hill%27s_Pet_Nutrition", "Wikipedia")}).`,
    history: ["Der Sitz liegt in Kansas; deshalb wurden die Sammelklagen dort gebündelt."],
    good: [
      "Hill’s gilt als Vorreiter veterinärmedizinischer Diätnahrung; das Unternehmen sagt, Science Diet sei in den 1960ern von Dr. Mark Morris Jr. entwickelt worden.",
      "„Food, Shelter &amp; Love“ unterstützt nach Herstellerangabe seit 2002 über 16 Millionen Adoptionen.",
    ],
    bad: [
      `Vitamin-D-Rückruf 2019: Am 31.01.2019 begann ein Rückruf von 25 Dosenfuttersorten, im März kamen 19 weitere dazu. Insgesamt betroffen waren 86 Chargen von 33 Sorten. Zu viel Vitamin D kann Nierenversagen oder den Tod verursachen. Die FDA beendete den Rückruf am 21.12.2021 (${a("https://www.fda.gov/animal-veterinary/news-events/fda-alerts-pet-owners-and-veterinarians-about-potentially-toxic-levels-vitamin-d-33-varieties-hills", "FDA")}). Ursache laut Hill’s: ein Fehler eines Zulieferers bei der Vitaminmischung.`,
      `Am 30.07.2021 genehmigte das Gericht einen Verbrauchervergleich über 12,5 Millionen US-Dollar. Hill’s und Colgate-Palmolive bestritten die Vorwürfe (${a("https://www.stuevesiegel.com/how-news-hills-settlement-pet-food", "Stueve Siegel")}).`,
    ],
    quote: "„Hill’s own investigation confirmed the presence of elevated levels of vitamin D due to a supplier error.“ (Rückruf-Mitteilung von Hill’s, Februar 2019, englisches Original)",
    src: `Quelle: ${a("https://www.foodsafetynews.com/2019/02/hills-canned-dog-food-recalled-due-to-elevated-vitamin-d-levels/", "Food Safety News, 01.02.2019")}`,
  },
  {
    name: "5. Iams / Eukanuba",
    facts: `Der Tierernährer Paul Iams gründete die Firma nach Wikipedia 1946 bei Dayton (Ohio). Clay Mathile wurde 1982 Alleineigentümer, 1999 ging Iams an Procter &amp; Gamble und 2014 außerhalb Europas an Mars; in Europa übernahm Spectrum Brands (${a("https://en.wikipedia.org/wiki/Iams", "Wikipedia")}).`,
    history: ["Iams 999 gilt laut Wikipedia als das erste Trockenfutter mit tierischem Protein (1950er)."],
    good: [
      `2003 veröffentlichte Iams eine Forschungsrichtlinie: keine Studien, die die Tötung von Hunden oder Katzen verlangen (Selbstverpflichtung, ${a("https://newspaper.animalpeopleforum.org/2003/04/01/pg-iams-fire-testing-lab-over-peta-disclosures/", "Animal People")}).`,
    ],
    bad: [
      "Im März 2003 veröffentlichte PETA Undercover-Material aus einem Vertragslabor; Iams und P&amp;G beendeten daraufhin die Zusammenarbeit mit dem Labor.",
      `August 2013: Rückruf von 29 Eukanuba- und Iams-Sorten wegen möglicher Salmonellen; Erkrankungen wurden nicht gemeldet (${a("https://dvm360.com/view/more-two-dozen-eukanuba-and-iams-products-recalled-due-salmonella", "dvm360")}).`,
    ],
    quote: "„If something is not being followed, we will act to correct it.“ (Linda Ulrey, Unternehmenskommunikation P&amp;G/Iams, 26.03.2003, englisches Original)",
    src: `Quelle: ${a("https://newspaper.animalpeopleforum.org/2003/04/01/pg-iams-fire-testing-lab-over-peta-disclosures/", "Animal People News, 01.04.2003")}`,
  },
];

const USA: Firma[] = [
  {
    name: "6. Champion Petfoods (Orijen, Acana)",
    facts: `Champion stammt aus einer Kleinstadt in Alberta (Kanada) und verkauft in über 90 Ländern. Seit 28.02.2023 gehört das Unternehmen mit mehr als 800 Beschäftigten zu Mars; vorher war eine Investorengruppe um Bedford Capital und den Healthcare of Ontario Pension Plan beteiligt (${a("https://www.torys.com/en/work/2022/11/903d8757-9a3f-4cc3-bcbc-2037680377db", "Torys")}).`,
    history: [`2016 eröffnete Champion in Auburn (Kentucky) die „DogStar“-Küchen (${a("https://gray.com/insights/champion-petfoods-celebrates-grand-opening-of-kentucky-dogstar-kitchens", "Gray")}).`],
    good: [
      "Das Konzept „BAFRINO“ (Biologically Appropriate Fresh Regional Ingredients Never Outsourced) setzt auf regionale Zutaten und eigene Küchen in Kanada und den USA.",
      "Orijen wirbt mit bis zu 90 % tierischen Zutaten (Herstellerangabe).",
    ],
    bad: [
      `Die US-Behörde FDA berichtete 2019 über 524 Meldungen zu Herzerkrankungen (DCM) bei Hunden und sah einen komplexen, nicht abschließend geklärten Zusammenhang mit meist getreidefreien Futtern (${a("https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigation-potential-link-between-certain-diets-and-canine-dilated-cardiomyopathy", "FDA")}). Medien berichteten, auch Champion-Marken stünden in der Markenliste; Champion wies das zurück.`,
    ],
    quote: "„Legumes are not a significant feature in Champion’s recipes, and never have been.“ (Stellungnahme von Champion Petfoods zum FDA-Bericht, Juni 2019, englisches Original)",
    src: `Quelle: ${a("https://www.actionnewsjax.com/amp/news/trending-now/see-the-list-fda-announces-dog-food-brands-it-says-could-cause-heart-disease/962297800", "Action News Jax, 28.06.2019")}`,
  },
  {
    name: "7. Blue Buffalo (General Mills)",
    facts: `Blue Buffalo wurde 2002 oder 2003 gegründet (die Quellen unterscheiden sich). General Mills kündigte die Übernahme am 23.02.2018 an und schloss sie am 24.04.2018 ab, bei einem Unternehmenswert von rund 8 Milliarden US-Dollar (${a("https://www.clearygottlieb.com/news-and-insights/news-listing/general-mills-completes-8-billion-acquisition-of-blue-buffalo-pet-products", "Cleary Gottlieb")}).`,
    history: ["Im Mai 2014 verklagte Purina Blue Buffalo wegen irreführender Werbung; im Dezember 2015 einigte sich Blue Buffalo mit Verbrauchern auf 32 Millionen US-Dollar."],
    good: [`Eine Spende von 6 Millionen US-Dollar ging an die Ohio State University für klinische Studien der Tiermedizin (${a("https://news.osu.edu/blue-buffalo-co-6-million-gift-will-advance-clinical-trials-at-college-of-veterinary-medicine/", "OSU")}).`],
    bad: [
      `Purina warf Blue Buffalo vor, mit „NO Chicken/Poultry By-Product Meals“ zu werben, obwohl Labortests Gegenteiliges gezeigt hätten. Das ist die Darstellung von Purina (${a("https://newscenter.purina.com/2014-05-06-Purina-Sues-Blue-Buffalo-For-False-Advertising-And-Disparagement", "Purina")}).`,
      `Der Verbrauchervergleich über 32 Millionen US-Dollar erfolgte ohne Schuldeingeständnis (${a("https://www.bursor.com/result/32-million-blue-buffalo-settlement/", "Bursor &amp; Fisher")}).`,
      `Am 17.03.2017 rief Blue Buffalo eine Charge Wilderness Rocky Mountain Recipe (Nassfutter) zurück, weil das Rindfleisch erhöhte natürliche Schilddrüsenhormone enthalten konnte; ein Hund erkrankte und erholte sich (${a("https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts/blue-buffalo-voluntarily-recalls-one-lot-blue-wildernessr-rocky-mountain-recipe-tm-red-meat-dinner", "FDA")}).`,
    ],
    quote: "„misconduct of a former ingredient supplier and a broker“ (Bill Bishop, Gründer, zum Vergleich 2015, laut AP, Teilzitat, englisches Original)",
    src: `Quelle: ${a("https://www.kbia.org/news/2015-12-16/blue-buffalo-to-pay-32-million-settlement", "KBIA/AP, 16.12.2015")}`,
  },
  {
    name: "8. Wellness Pet Company (Wellness, Old Mother Hubbard, Whimzees, Eagle Pack)",
    facts: `Die Wurzeln liegen in Old Mother Hubbard, 1926 in Gloucester (Massachusetts); 1961 kaufte Jim Scott die Firma. Seit November 2020 gehört WellPet laut Clearlake Capital zu Clearlake, vorher zu Berwind (${a("https://en.wikipedia.org/wiki/Wellness_Pet_Company", "Wikipedia")}, ${a("https://clearlake.com/clearlake-to-acquire-wellpet-a-branded-leader-in-premium-natural-pet-food-and-treats/", "Clearlake")}).`,
    history: ["2008 kaufte Berwind Wellness und Old Mother Hubbard (rund 400 Millionen US-Dollar), 2016 Sojos, 2017 Whimzees."],
    good: ["Mehrere Werke erreichten BRC-Auditnoten (Indiana „AA“, Minnesota „A“, Veendam „AA“)."],
    bad: [`Mai 2012: Ein Wellness-Rezept wurde zurückgerufen, weil es in einem Diamond-Werk mit Salmonellenverdacht produziert worden war (${a("https://www.thedrakecenter.com/services/pets/blog/diamond-pet-food-recall-includes-several-popular-brands", "The Drake Center")}).`],
    quote: "„we do whatever it takes to make high-quality, nutritious food and treats for the pets that depend on us.“ (Wellness Pet, Unternehmenswebsite, Selbstdarstellung, englisches Original)",
    src: `Quelle: ${a("https://www.wellpet.com/", "wellpet.com")}`,
  },
  {
    name: "9. Diamond Pet Foods (Taste of the Wild)",
    facts: `Gary Schell und Richard Kampeter gründeten Diamond 1970 in Meta (Missouri). Laut Branchenberichten ist die Firma weiter in Familienhand; Taste of the Wild startete 2007.`,
    history: ["Dezember 2005: Aflatoxin-Rückruf. April/Mai 2012: Salmonellen-Rückrufe."],
    good: ["Nach 2005 erklärte Diamond, Maßnahmen gegen weitere Versäumnisse ergriffen zu haben (Selbstangabe). Einen unabhängig belegten Pluspunkt fanden wir nicht."],
    bad: [
      `Aflatoxine 2005: Die FDA meldete, mindestens 76 Hunde seien vermutlich gestorben; 19 Sorten wurden zurückgerufen. Laut Inspektion lagen für zwölf Maislieferungen keine Testergebnisse vor, und Diamond räumte ein, interne Testvorgaben seien nicht befolgt worden (${a("https://www.nbcnews.com/health/health-news/toxic-pet-food-may-have-killed-dozens-dogs-flna1C9436547", "NBC News")}, ${a("https://www.nbcnews.com/health/health-news/maker-toxic-pet-food-admits-testing-failures-flna1c9444390", "NBC News")}).`,
      `Salmonellen 2012: Bis 04.05.2012 waren 14 Menschen in mindestens neun US-Staaten erkrankt, mindestens fünf mussten ins Krankenhaus. Es gab vier Rückrufrunden und bis 18.05.2012 acht Ausweitungen. Diamond erklärte, es seien keine Tiere erkrankt (${a("https://www.bangordailynews.com/2012/05/04/news/salmonella-in-dog-food-sickens-14-people-across-us/", "Bangor Daily News")}, ${a("https://www.foodsafetynews.com/after-eight-expansions-how-big-is-the-diamond-pet-foods-recall/", "Food Safety News")}). Betroffen waren auch Marken Dritter wie Natural Balance, Wellness und Canidae, die dort produzieren ließen.`,
    ],
    quote: "„It was apparent by the FDA report that those guidelines were not followed.“ (Diamond-Stellungnahme, NBC News, englisches Original)",
    src: `Quelle: ${a("https://www.nbcnews.com/health/health-news/maker-toxic-pet-food-admits-testing-failures-flna1c9444390", "NBC News")}`,
  },
  {
    name: "10. J.M. Smucker (Milk-Bone, Meow Mix)",
    facts: `Jerome Monroe Smucker gründete das Unternehmen 1897 in Orrville (Ohio) als Apfelmus-Hersteller; es ist börsennotiert. Heimtiermarken sind heute vor allem Milk-Bone und Meow Mix. Im Geschäftsjahr 2026 (bis 30.04.2026) lag der Nettoumsatz bei 9,1 Milliarden US-Dollar, das Segment „U.S. Retail Pet Foods“ steuerte 1.600 Millionen US-Dollar bei (${a("https://s203.q4cdn.com/703080298/files/doc_news/The-J-M--Smucker-Co--Announces-Fiscal-Year-2026-Fourth-Quarter-Results-and-Provides-Full-Year-Fiscal-2027-Outlook-2026.pdf", "Smucker-Pressemitteilung, 09.06.2026")}).`,
    history: ["2015 Kauf von Big Heart Pet Brands (5,8 Milliarden US-Dollar), 2018 Ainsworth Pet Nutrition; am 28.04.2023 gingen Nutrish, 9Lives, Kibbles ’n Bits, Gravy Train und das Private-Label-Geschäft für rund 1,2 Milliarden US-Dollar an Post Holdings."],
    good: ["Eine heimtierspezifische Qualitäts- oder Forschungsinitiative konnten wir nicht belegen."],
    bad: [
      `Februar 2018: Smucker zog Nassfutter (Gravy Train, Kibbles ’n Bits, Ol’ Roy, Skippy) vom Markt, nachdem im Talg Pentobarbital nachgewiesen worden war. Betroffen waren alle Chargen ab 2016, über 107 Millionen Dosen. Die FDA hielt das niedrige Niveau für unwahrscheinlich gesundheitsgefährdend, doch jede Menge macht das Produkt zum verfälschten Lebensmittel (${a("https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-alerts-pet-owners-about-potential-pentobarbital-contamination-canned-dog-food-manufactured-jm", "FDA")}, ${a("https://www.foodsafetynews.com/2018/03/smucker-confirms-euthinasia-drug-in-popular-dog-food-brands", "Food Safety News")}).`,
    ],
    quote: "„pentobarbital, an illegal substance in pet food at any amount“ (FDA-Warnmeldung, März 2018, englisches Original)",
    src: `Quelle: ${a("https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-alerts-pet-owners-about-potential-pentobarbital-contamination-canned-dog-food-manufactured-jm", "FDA")}`,
  },
];

const DACH: Firma[] = [
  {
    name: "11. Fressnapf (Premiere, Multifit und weitere Eigenmarken)",
    facts: `Der erste „Freßnapf“-Markt öffnete 1990 in Erkelenz (NRW). Gründer Torsten Toeller ist weiter Inhaber, die Zentrale sitzt in Krefeld. Die Gruppe nennt 2021 einen Umsatz von 3,17 Milliarden Euro (plus 19,8 %) und zum Januar 2022 rund 1.900 Märkte in 13 Ländern; in Deutschland führen überwiegend selbstständige Franchisepartner die Märkte (${a("https://www.mynewsdesk.com/de/fressnapf-holding-se/pressreleases/halbe-milliarde-euro-umsatzplus-fressnapf-gruppe-baut-europaeische-marktfuhrerschaft-konsequent-aus-3163271", "Fressnapf-Pressemitteilung, 19.01.2022")}).`,
    history: ["2022 und 2024 folgte die Beteiligung an der italienischen Kette Arcaplanet, 2024 stieg der Finanzinvestor Cinven als Minderheitsgesellschafter ein."],
    good: ["„Tierisch engagiert“ leitete 2021 nach Unternehmensangabe mehr als 2 Millionen Euro an Tierschutzeinrichtungen weiter."],
    bad: [`Januar 2025: Rückruf wegen Salmonellen. Betroffen waren etliche Trockenfutter für Katzen (Multifit, Premiere), drei Premiere-Hundefutter und ein Multifit-Katzennassfutter; der Kaufpreis wurde erstattet (${a("https://www.test.de/Rueckruf-bei-Fressnapf-Salmonellen-in-Hunde-und-Katzenfutter-6189408-0/", "test.de")}).`],
    quote: "„Tierliebe kennt keine Krise: Wir entwickeln uns gerade unter den jetzigen Rahmenbedingungen auf allen Kanälen und in allen Ländern deutlich positiv.“ (Torsten Toeller, Fressnapf-Pressemitteilung „Trading Statement“, 19.01.2022)",
    src: `Quelle: ${a("https://www.mynewsdesk.com/de/fressnapf-holding-se/pressreleases/halbe-milliarde-euro-umsatzplus-fressnapf-gruppe-baut-europaeische-marktfuhrerschaft-konsequent-aus-3163271", "Mynewsdesk")}`,
  },
  {
    name: "12. Interquell (Happy Dog, Happy Cat)",
    facts: `Interquell sitzt in Wehringen (Schwaben); Eigentümer und Geschäftsführer ist Georg Müller. Die Wurzeln reichen laut Eigenangabe bis 1765 zurück, zu einer Getreidemühle an der Singold; andere Quellen nennen 1760 (${a("https://globalpetindustry.com/article/interquell-gmbh-germany/", "GlobalPETS")}).`,
    history: ["Laut Eigenangabe ist Happy Dog die Nummer 1 im Trockenhundefutter des deutschen Fachhandels."],
    good: [
      "Die Rezepturen kommen laut Hersteller ohne Sojaprotein, Farb- und Konservierungsstoffe aus (Herstellerangabe).",
      "Bei „Happy Dog Africa“ gehen 2 % des Verkaufspreises an die SOS-Kinderdörfer in Afrika, laut Hersteller über 840.000 Euro.",
    ],
    bad: [
      `Rückrufe nach Salmonellenfunden bei Eigenkontrollen: 22.02.2024 (Happy Dog fit &amp; vital Puppy und Sensible France) und 07.03.2024 (Happy Dog fit &amp; vital Junior). Beide Rückrufe hat Interquell selbst veröffentlicht (${a("https://www.lgl.bayern.de/lebensmittel/ueberwachung/lebensmittelwarnungen/doc/happy_dog_heimtierfuttermittel.pdf", "LGL Bayern")}, ${a("https://www.lgl.bayern.de/lebensmittel/ueberwachung/lebensmittelwarnungen/doc/happy_dog_heimtierfuttermittel_02.pdf", "LGL Bayern")}).`,
    ],
    quote: "„Interquell GmbH bedauert den Vorfall und bittet für die Unannehmlichkeiten um Entschuldigung.“ (Produktrückruf der Interquell GmbH, 22.02.2024)",
    src: `Quelle: ${a("https://www.lgl.bayern.de/lebensmittel/ueberwachung/lebensmittelwarnungen/doc/happy_dog_heimtierfuttermittel.pdf", "LGL Bayern")}`,
  },
  {
    name: "13. Bosch Tiernahrung (Bosch, Sanabelle)",
    facts: `Kurt Bosch gründete das Unternehmen 1960 in Blaufelden, zunächst für Mineralfutter und Fertigfutter für Nutztiere. Das Heimtierfutter folgte 24 Jahre später; 2001 endete die Agrarfutter-Produktion, im selben Jahr startete die Katzenlinie Sanabelle. 2014 exportierte Bosch in über 40 Länder (${a("https://petworldwide.net/content-1/pet-worldwide/2014/05/5-2014/blaufelden-family-firm-conquers-the-world.html", "PET worldwide, 05/2014")}).`,
    history: [`2010 gründete Bosch mit Saturn Petfood (Heristo-Gruppe) ein Joint Venture zur Übernahme des Rodi-Petfood-Werks in Nettetal (${a("https://petworldwide.net/content-1/pet-worldwide/2010/03/3-4-2010/joint-venture-in-pet-food.html", "PET worldwide, 2010")}); 2014 folgte der Relaunch von Sanabelle.`],
    good: ["Die Sanabelle-Rezepturen sind laut Bericht frei von glutenhaltigem Getreide und mit frischem Geflügel hergestellt (Stand 2014)."],
    bad: ["Einen Rückruf oder ein Verfahren haben wir nicht gefunden; das ist eine Lücke unserer Suche und kein Entlastungsbeweis."],
    quote: "„Our products are now sold in over 40 countries.“ (Jan Vos, Export Manager, PET worldwide, Mai 2014, englisches Original)",
    src: `Quelle: ${a("https://petworldwide.net/content-1/pet-worldwide/2014/05/5-2014/blaufelden-family-firm-conquers-the-world.html", "PET worldwide")}`,
  },
  {
    name: "14. Platinum Petfood",
    facts: `Platinum sitzt in Bingen am Rhein und wurde 2004 gegründet (früher Pro Developments GmbH &amp; Co. KG). Der Vertrieb läuft laut Pressemitteilungen direkt an Kunden (${a("https://www.presseportal.de/pm/100694/3118333", "Presseportal, 10.09.2015")}).`,
    history: [
      "2011: „Platinum Menu“, laut Hersteller die „weltweit erste ‚unverwässerte‘ Nassvollnahrung für Hunde“ mit 83 % Frischfleisch.",
      "2012: Iberico+Greens (Hundetrockenfutter aus Fleisch des Iberischen Schweins), 2022: Katzentrockenfutter „MeatCrisp“.",
    ],
    good: ["Der TÜV Rheinland zertifizierte 2015 Frischfleischanteil (mindestens 50 %), Deklaration und Schadstoffprüfung der Hundenahrung, mit jährlichen Audits. Der Stand von 2015 ist nicht für heute geprüft."],
    bad: ["Rückruf, Urteil oder Verfahren haben wir nicht gefunden."],
    quote: "„Wir legen seit jeher größten Wert auf die Hochwertigkeit unserer Produkte und die Klarheit unserer Produktdeklarationen.“ (Doreen Jähne, Geschäftsführerin, Presseportal, 10.09.2015)",
    src: `Quelle: ${a("https://www.presseportal.de/pm/100694/3118333", "Presseportal")}`,
  },
  {
    name: "15. Josera",
    facts: `Joseph und Pauline Erbacher gründeten 1941 in Weilbach eine Futterkalk-Anlage; der Name leitet sich von „Josef Erbacher Agrar“ ab. 1980 zog die Firma nach Kleinheubach um, 1988 begann die Heimtierfutter-Produktion. Heute gehört Josera zur Familiengruppe „ERBACHER the food family“ (${a("https://food.family/en/about-us/history", "Unternehmensgeschichte")}).`,
    history: ["2025 eröffnete in Nowy Tomyśl (Polen) eine neue Heimtierfutter-Fabrik mit 40.000 m²."],
    good: [`Die Pet Sustainability Coalition zeichnete Josera 2020/21 als nachhaltigsten Heimtierfutterhersteller in der Kategorie aus (${a("https://www.petworldwide.net/content-1/news/2020/08/27/recognition-for-josera.html", "PET worldwide, 27.08.2020")}).`],
    bad: [`September 2025: Rückruf „Josera Meatlovers Pure Lamm“ (Nassfutter, 6 x 400 g), weil eine geringe Zahl von Dosen sichtbar gewölbt war. Vorsorglich, die Ursache wurde noch untersucht (Händlerseite ${a("https://www.zooplus.de/info/about/recall", "zooplus")}).`],
    quote: "„Our result was that the company strategy and products were judged to be outstanding.“ (Kirsten Seidl, Brand Manager Josera, PET worldwide, 27.08.2020, englisches Original)",
    src: `Quelle: ${a("https://www.petworldwide.net/content-1/news/2020/08/27/recognition-for-josera.html", "PET worldwide")}`,
  },
  {
    name: "16. Animonda (Carny, Vom Feinsten)",
    facts: `Animonda wurde 1991 gegründet, Sitz ist Bad Rothenfelde, und gehört zur Heristo-Gruppe. 2016 umfasste das Sortiment über 450 Produkte, ohne Soja, Zucker, künstliche Farb- und Konservierungsstoffe (${a("https://globalpetindustry.com/article/animonda-petcare-germany/", "GlobalPETS")}).`,
    history: ["Weitere belegte Jahreszahlen zur Firmengeschichte haben wir nicht gefunden."],
    good: ["Das Unternehmen beschäftigt eine Tierärztin für Heimtierernährung und bietet eine Diätlinie mit rund 70 Produkten an (Herstellerangabe, Stand 2016)."],
    bad: ["Rückruf, Urteil oder Verfahren haben wir nicht gefunden."],
    quote: "„animonda focuses on the welfare of pets.“ (Firmenprofil auf GlobalPETS, 2016, englisch; Profiltext, keine Presseerklärung)",
    src: `Quelle: ${a("https://globalpetindustry.com/article/animonda-petcare-germany/", "GlobalPETS")}`,
  },
  {
    name: "17. Dr. Clauder’s",
    facts: `Gründer Alwin Hübers machte sich nach dem elterlichen Betrieb Rheinkrone in Brünen selbständig und starb 2021 mit 82 Jahren; seit 2006 führen Sohn Malte Hübers und Alexander Gerards das Unternehmen (${a("https://petworldwide.net/content-1/news/2021/03/23/alwin-huebers-passes-away.html", "PET worldwide, 23.03.2021")}). Ende 2025 erwarb die Mühldorfer-Gruppe mit KKA Partners eine Mehrheit (${a("https://carlsquare.com/deal-history/carlsquare-advised-kka-partners-and-its-portfolio-company-muehldorfer-nutrition-holding-on-the-acquisition-of-a-majority-stake-in-dr-clauder-group-of-companies/", "Carlsquare")}).`,
    history: ["Das Gründungsjahr der Firma ist in unseren Quellen nicht belegt."],
    good: ["Spezialisiert auf Ergänzungsprodukte und funktionale Snacks für Hunde und Katzen."],
    bad: ["Rückruf oder Verfahren haben wir nicht gefunden."],
    quote: "„With the death of Alwin Hübers we have lost a figure to whom we owe a great deal.“ (Nachruf von Dr. Clauder’s, PET worldwide, 23.03.2021, englische Fassung)",
    src: `Quelle: ${a("https://petworldwide.net/content-1/news/2021/03/23/alwin-huebers-passes-away.html", "PET worldwide")}`,
  },
  {
    name: "18. Markus-Mühle (NaturNah, Black Angus, Rotwild Hirsch)",
    facts: `Markus-Mühle GmbH &amp; Co. KG sitzt in Langenhahn im Westerwald; Geschäftsführer sind Stefanie und Markus Olberts (${a("https://www.markus-muehle.de/impressum", "Impressum")}). Müllermeister Josef Olberts legte den Grundstein „vor über 60 Jahren“, Sohn Markus entwickelte das erste vitalstoffschonend hergestellte Hundetrockenfutter (${a("https://www.markus-muehle.de/", "markus-muehle.de")}).`,
    history: ["2013 entstand ein dritter Firmenkomplex mit einer Kapazität von 50.000 Tonnen Heimtierfutter im Jahr; die Firma fertigt auch rund 80 Handelsmarken-Produkte."],
    good: ["Die Firma wirbt mit kaltgepresster, vitalstoffschonender Herstellung und gibt an, einen großen Teil des Erlöses in Stiftungen für Kinder und Tiere zu geben (beides Selbstangaben)."],
    bad: ["Das Portal Hundeo bewertet NaturNah mit 37 von 100 Punkten; das ist eine Portalbewertung nach eigener Methodik, kein unabhängiger Test."],
    quote: "„We will now have the capacity to produce 50 000 t of pet food per year on site.“ (Markus Olberts, PET worldwide, 11.10.2013, englisches Original)",
    src: `Quelle: ${a("https://www.petworldwide.net/content-1/news/2013/10/11/markus-muehle-has-big-plans.html", "PET worldwide")}`,
  },
  {
    name: "19. Terra Canis",
    facts: `Birgitta Ornau gründete Terra Canis 2005. Seit Frühjahr 2017 hielt Nestlé Purina die Mehrheit; 2022 stockte Purina von 80 auf 100 % auf, Ornau übergab zum 1. April 2022 und blieb beratend tätig. Sitz ist Garching bei München (${a("https://www.petworldwide.net/content-1/news/2022/03/01/terra-canis-under-new-management.html", "PET worldwide, 01.03.2022")}).`,
    history: ["2024 gründete Ornau die Marke Dog’s Heaven für frische Mahlzeiten für Hunde."],
    good: ["„Human grade“ ist ein Selbstanspruch des Herstellers; unabhängige Belege haben wir nicht gefunden."],
    bad: [`Dezember 2024: Rückruf der 400-g-Dose „Classic Rind mit Karotte, Apfel und Naturreis“ (zwei Chargen, MHD 02./03.07.2027) nach Reklamationen über Fremdkörper in einzelnen Dosen; Verletzungen oder Erkrankungen wurden nicht gemeldet (${a("https://www.infranken.de/deutschland/gefahr-durch-fremdkoerper-terra-canis-ruft-hundefutter-zurueck-art-5976488,PRINT", "infranken.de, 02.12.2024")}).`],
    quote: "„wenige Reklamationen über den Fund von Fremdkörpern in vereinzelten Dosen“ (Mitteilung des Unternehmens, infranken.de, 02.12.2024)",
    src: `Quelle: ${a("https://www.infranken.de/deutschland/gefahr-durch-fremdkoerper-terra-canis-ruft-hundefutter-zurueck-art-5976488,PRINT", "infranken.de")}`,
  },
  {
    name: "20. MjAMjAM",
    facts: `Die MjAMjAM Petfood GmbH sitzt in Neumarkt-Sankt Veit (Bayern), Geschäftsführer laut Impressum sind Jens Kern, Kristina Kern und Simon Hucke (${a("https://www.mjamjam-petfood.de/impressum", "Impressum")}). Gegründet 2016 von Jens Kern, nach Portalangaben mit rund 100 Beschäftigten (${a("https://www.hundeo.com/hundefutter/marken/mjamjam", "Hundeo")}); 2026 feiert die Marke „10 Jahre MjAMjAM“.`,
    history: ["Weitere Meilensteine konnten wir nicht belegen."],
    good: [
      "Das Konzept „artgerecht, natur- und beutenah“ kommt nach Herstellerangabe ohne Getreide, Zucker, Soja und Tiermehle aus; Dampfsterilisation ohne chemische Konservierung.",
      "Hundeo bewertet „Leckeres Rind an gekochten Kartoffeln“ mit 87 von 100 Punkten (63 % Fleisch); das ist die Wertung eines Portals mit Affiliate-Links.",
    ],
    bad: ["Rückruf, Urteil oder Verfahren haben wir nicht gefunden."],
    quote: "„Bei MjAMjAM hat das Tierwohl oberste Priorität.“ (Unternehmenswebsite, Selbstdarstellung, keine Presseerklärung)",
    src: `Quelle: ${a("https://www.mjamjam-petfood.de/UEber-uns/Unser-Versprechen/", "mjamjam-petfood.de")}`,
  },
  {
    name: "21. Rinti / Finnern (Rinti, Miamor, Kattovit, Schmusy)",
    facts: `Roswitha und Joachim Finnern gründeten das Unternehmen 1983 in Verden (Aller); erste Produkte waren Rinti und Schmusy, Ende der 1980er kam die Katzenmarke Miamor. Das Unternehmen bezeichnet sich als inhabergeführten Familienbetrieb (${a("https://www.finnern.de/wir-sind-finnern", "finnern.de")}).`,
    history: ["Der Aufbau lief über den Fachhandel, anfangs durch Direktbesuche der Gründer."],
    good: ["Beworben wird Dosenfutter ohne Formfleisch und Fleischmehle, entwickelt mit Ernährungswissenschaftlern und Tierärzten (Herstellerangabe)."],
    bad: [`2017 meldete ein Kunde Keramikscherben in einer Rinti-Dose. Laut Herstellerauskunft, zitiert vom Faktencheck Mimikama, wurde die Charge zurückgerufen; eine amtliche Meldung haben wir dazu nicht gefunden (${a("https://www.mimikama.org/rinti-hundefutter-faktencheck/", "Mimikama")}).`],
    quote: "„In unsere Produkte kommt nichts, was Hunde und Katzen nicht brauchen.“ (Unternehmenswebsite, Selbstdarstellung)",
    src: `Quelle: ${a("https://www.finnern.de/wir-sind-finnern", "finnern.de")}`,
  },
  {
    name: "22. Wolf of Wilderness und Wolfsblut",
    facts: `Zwei Marken, zwei Eigentümer. <strong>Wolf of Wilderness</strong> ist die Eigenmarke des Online-Händlers zooplus; das Hundefutter stellt nach zooplus Mera Tiernahrung her. <strong>Wolfsblut</strong> gehört zur Healthfood24 GmbH in Leipzig (gegründet 2005 von Felix Becker, Marke seit 2006) und seit 22.01.2020 zu AlphaPet Ventures in München (${a("https://www.alpha.pet/en/news-archiv/alphapet-acquires-healthfood24", "AlphaPet")}).`,
    history: ["2020 führte Wolf of Wilderness eine recycelbare Verpackung ein (Mondi-Pressemitteilung); Wolfsblut brachte 2019 eine Diätlinie „VetLine“."],
    good: [`Wolf of Wilderness setzte 2020 auf eine recyclingfähige Mono-Material-Verpackung (${a("https://www.mondigroup.com/news-and-insight/2020/howling-success-zooplus-own-brand-wolf-of-wilderness-introduces-recyclable-packaging-delivered-by-mondi/", "Mondi, 17.08.2020")}).`],
    bad: [`Wolfsblut Atlantic Tuna: Rückruf einer 500-g-Charge am 18.11.2022 wegen erhöhter Bleiwerte (freiwillig, österreichische Behörde BAES) und eine weitere Warnung am 26.01.2023 zu den Packungen 2 kg und 15 kg (${a("https://www.baes.gv.at/en/details/produktrueckruf-hundefutter-wolfsblut-atlantic-tuna-500g", "BAES")}, ${a("https://www.baes.gv.at/en/details/produktwarnung-hundefutter-wolfsblut-adult-atlantic-tuna-thunfisch-und-meeressalat-2-kg-und-15-kg", "BAES")}).`],
    quote: "„That is why Mera Tiernahrung, who has been contributing to our success for years, manufactures the dog food.“ (Dominik Mayer, zooplus, Mondi-Pressemitteilung vom 17.08.2020, englisches Original)",
    src: `Quelle: ${a("https://www.mondigroup.com/news-and-insight/2020/howling-success-zooplus-own-brand-wolf-of-wilderness-introduces-recyclable-packaging-delivered-by-mondi/", "Mondi")}`,
  },
  {
    name: "23. Bewital petfood (Belcando, Bewi Dog, Leonardo)",
    facts: `Bernhard Wigger gründete BEWITAL 1963; Sitz ist Südlohn-Oeding, Eigentümer sind Familie Wigger und Familie Petershagen. Die Gruppe nennt rund 600 Beschäftigte. 1988 begann die Hunde- und Katzenfutterproduktion, 1996 starteten Belcando und Leonardo (${a("https://bewital.de/en/about-us/", "bewital.de")}).`,
    history: ["Seit 2015 ersetzt ein neues Verfahren Fleischmehl durch Frischfleisch; die Entwicklung wurde aus dem Umweltinnovationsprogramm des Bundesumweltministeriums gefördert."],
    good: ["Fleischvorbereitung, Trocken- und Feuchtproduktion laufen laut Hersteller in einem Werk (Herstellerangabe)."],
    bad: ["Rückruf, Urteil oder Verfahren haben wir nicht gefunden."],
    quote: "„How can I feed my animals better?“ (Leitfrage des Gründers, Unternehmenswebsite, englisch)",
    src: `Quelle: ${a("https://bewital.de/en/about-us/", "bewital.de")}`,
  },
  {
    name: "24. Vitakraft",
    facts: `Heinrich Wührmann gründete das Unternehmen 1837 als Futtermittelhandel in Heiligenrode bei Bremen (nicht 1897); die Marke Vitakraft gibt es seit 1929. Sitz ist Bremen, seit 2013 gehört die Firma als selbstständiges Unternehmen zur Deuerer-Gruppe. Das Unternehmen nennt rund 1.100 Beschäftigte (${a("https://www.vitakraft.com/asia/en/about-us", "Vitakraft")}, ${a("https://www.weser-kurier.de/bremen/wirtschaft/vitakraft-will-sich-weiter-spezialisieren-doc7e43demr8aw113ududr0", "Weser-Kurier, 07.10.2017")}).`,
    history: ["1966 erste ausländische Tochter in der Schweiz, 2021 Hochregallager „VitaCube“ und Marken-Relaunch."],
    good: ["Es gibt einen Nachhaltigkeitsbericht 2022 zu den Jahren 2020/21 (Herstellerangabe)."],
    bad: [`Juni 2024: Die US-Tochter Vitakraft Sun Seed weitete einen Rückruf von Igelfutter wegen möglicher Salmonellen aus. Das war Kleintierfutter für den US-Markt, kein Hunde- oder Katzenfutter (${a("https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts/vitakraft-sun-seed-recall-sun-seed-vita-prima-hedgehog-food-due-possible-salmonella-health-risk-0", "FDA")}).`],
    quote: "„Wir sind schon lange nicht mehr nur der Futterhersteller für Nager und Vögel.“ (Dieter Meyer, Pressesprecher, Weser Report, 02.01.2017)",
    src: `Quelle: ${a("https://weserreport.de/2017/01/bremen-bremen/wirtschaft/unternehmen-profitiert-vom-wachsenden-heimtiermarkt/", "Weser Report")}`,
  },
  {
    name: "25. Mera Tiernahrung (mera, meracat, essential)",
    facts: `Karl Vos gründete das Unternehmen 1949 mit dem Kauf einer Mühle in Kevelaer; der Name „mera“ entstand 1983. Heute führt Felix Vos in dritter Generation. Mera stellt über 70.000 Tonnen Hunde- und Katzenfutter im Jahr her (${a("https://www.petonline.de/daten/pet/2024/11-2024/75-jahre-made-in-germany.html", "pet, 11/2024")}).`,
    history: ["1979 startete „MERA Dog“ mit dem Familienrezept „brocken“, 1987 die erste Extrusionsanlage, 2019 die ZNU-Zertifizierung („Nachhaltiges Wirtschaften“)."],
    good: ["Mera nennt den Standort Kevelaer seit 2020 CO2-neutral (Werbebeitrag, kein unabhängiger Nachweis) und produziert Hundefutter für die zooplus-Eigenmarke Wolf of Wilderness."],
    bad: ["Rückruf, Urteil oder Verfahren haben wir nicht gefunden."],
    quote: "„Die Erfahrungen haben uns gelehrt, offen für Veränderungen zu sein und den Mut zu haben, neue Richtungen einzuschlagen.“ (Felix Vos, pet, Ausgabe 11/2024)",
    src: `Quelle: ${a("https://www.petonline.de/daten/pet/2024/11-2024/75-jahre-made-in-germany.html", "pet")}`,
  },
  {
    name: "26. GranataPet (Fox 4 Pets)",
    facts: `Markus Fuchsenthaler gründete GranataPet 2005 zunächst als Altina („Allgäuer Tiernahrung“), weil sein Hund Fellprobleme hatte. Sitz ist Dietmannsried im Allgäu; seit 01.03.2024 firmiert das Unternehmen als Fox 4 Pets GmbH &amp; Co. KG, mit rund 30 Beschäftigten (${a("https://www.zza-online.de/industrie/20-jahre-granatapet-wir-haben-einfach-gesagt-los-gehts/", "ZZA, 25.09.2025")}).`,
    history: ["2019 übernahm Fuchsenthaler die Anteile seines stillen Gesellschafters; 2024 kam die Umbenennung."],
    good: ["Die Verarbeitung der Granatapfelkerne ist nach Aussage des Gründers patentiert; das Patent haben wir nicht im Register geprüft."],
    bad: ["Rückruf, Urteil oder Verfahren haben wir nicht gefunden."],
    quote: "„Premiumisierung war von Anfang an unser Ansatz.“ (Markus Fuchsenthaler, ZZA-Interview, 25.09.2025)",
    src: `Quelle: ${a("https://www.zza-online.de/industrie/20-jahre-granatapet-wir-haben-einfach-gesagt-los-gehts/", "ZZA")}`,
  },
];

const EUROPA: Firma[] = [
  {
    name: "27. Affinity Petcare (Advance, Ultima, Brekkies)",
    facts: `Der Zeitstrahl des Unternehmens nennt 1963 als Gründung von Gallina Blanca Purina, gemeinsam von Agrolimen und Ralston Purina. Seit 2002 gehört Affinity zu 100 % Agrolimen; Sitz ist L’Hospitalet de Llobregat bei Barcelona. Ende 2025 hatte das Unternehmen 1.025 Beschäftigte und drei eigene Werke (Spanien, Frankreich, Italien) (${a("https://www.affinity-petcare.com/en/who-we-are", "Affinity Petcare")}).`,
    history: ["2003 Advance Veterinary Diets, 2016 Ultima Nature als erste natürliche Linie im Lebensmittelhandel (Herstellerangabe)."],
    good: [
      "Die Werke sind nach ISO 22000 zertifiziert; 2025 stammte der gesamte Strom aus erneuerbaren Quellen, die Klimaziele wurden im April 2025 von der Science Based Targets initiative validiert (Herstellerangaben).",
    ],
    bad: ["Einen Rückruf von Advance, Ultima oder Brekkies haben wir nicht gefunden. Der oft zitierte Rückruf „Advance Dermocare“ (Australien, 2018) betraf Mars und nicht Affinity."],
    quote: "„Spanish company Agrolimen has now created a new company for its future activities in the pet product segment: Affinity Petcare.“ (PET worldwide, 04/2002, englisch)",
    src: `Quelle: ${a("https://www.petworldwide.net/content-1/pet-worldwide/2002/04/4-2002/affinity-petcare-on-the-starting-blocks.html", "PET worldwide")}`,
  },
  {
    name: "28. Almo Nature",
    facts: `Pier Giovanni Capellino gründete Almo Nature 2000 in Genua. Seit 28.06.2019 gehört das Unternehmen zu 100 % der Fondazione Capellino, einer gemeinnützigen Stiftung; es ist eine Benefit-SpA. Der konsolidierte Umsatz lag 2021 laut Eigenangabe bei rund 100,7 Millionen Euro (${a("https://www.almonature.com/en-gb/about-us", "Almo Nature")}).`,
    history: ["2000 erstes Nassfutter in „Human Food Chain“-Qualität, 2013 derselbe Standard auch für Trockenfutter, 2018 Gründung der Stiftung."],
    good: ["Dividenden gehen an die Stiftung: 48,09 Millionen Euro vom 01.01.2018 bis Ende 2025 (Eigenangabe, " + a("https://almonature.com/en/our-history", "Almo Nature") + ")."],
    bad: ["Unabhängige Auszeichnungen haben wir nicht belegen können; einen Rückruf haben wir nicht gefunden."],
    quote: "„Salento and all dogs and cats deserve the kind of quality I would provide for myself, too.“ (Pier Giovanni Capellino, PET worldwide, 02/2023, englische Übersetzung)",
    src: `Quelle: ${a("https://www.petworldwide.net/content-1/pet-worldwide/2023/05/2-2023/strong-commitment-to-biodiversity.html", "PET worldwide")}`,
  },
  {
    name: "29. Farmina (Natural &amp; Delicious, Vet Life)",
    facts: `Francesco Russo gründete 1965 Russo Mangimi (Tierfutter); 1999 wandte sich sein Sohn Angelo Russo dem Heimtierfutter zu. Farmina ist ein Familienunternehmen mit Sitz in Italien, CEO ist Angelo Russo. Am 11.06.2025 eröffnete das erste US-Werk in Reidsville (North Carolina) mit 115 Millionen US-Dollar Investition und 200 geplanten Stellen (${a("https://www.prnewswire.com/news-releases/farmina-opens-first-us-manufacturing-facility-in-reidsville-north-carolina-302479578.html", "PR Newswire, 11.06.2025")}).`,
    history: ["Vertrieb in mehr als 60 Ländern (Pet Age, 11/2025)."],
    good: ["Eine eigene Forschungseinheit „Farmina Vet Research“ (Herstellerangabe)."],
    bad: ["Rückrufe oder Behördenverfahren haben wir nicht gefunden; das ist eine Lücke unserer Suche und kein Entlastungsbeweis."],
    quote: "„As Italians, family is at the heart of everything we do – and that includes our pets.“ (Loris Rinaldi, CEO Farmina Pet Foods North America, 11.06.2025, englisches Original)",
    src: `Quelle: ${a("https://www.prnewswire.com/news-releases/farmina-opens-first-us-manufacturing-facility-in-reidsville-north-carolina-302479578.html", "PR Newswire")}`,
  },
  {
    name: "30. Lily’s Kitchen",
    facts: `Henrietta Morrison gründete die Marke im November 2008 in London. Nestlé Purina PetCare kündigte die Übernahme am 01.04.2020 an; die Marke wird als eigenständiges Unternehmen weitergeführt. Zum Zeitpunkt der Übernahme nannte Nestlé 85 Millionen Pfund Umsatz in rund 6.000 Geschäften und 30 Ländern (${a("https://globalpetindustry.com/news/nestle-purina-petcare-acquires-lilys-kitchen/", "GlobalPETS")}).`,
    history: ["Der Finanzinvestor L Catterton war zuvor Gesellschafter."],
    good: ["Nestlé nennt „strong ethical values“; das ist das Urteil des Käufers und kein unabhängiger Beleg."],
    bad: [`22.01.2026: Rückruf „Pasta al Ragu“ (400 g, Charge 5212T9097F) wegen Kunststoffteilen; Auslöser war laut Hersteller ein einzelner Rohstofflieferant (${a("https://www.foodmanufacture.co.uk/Article/2026/01/22/tesco-has-issued-an-urgent-recall-notice-after-a-foreign-body-contamination-was-detected-in-certain-batches-of-lilys-kitchen-dog-food", "Food Manufacture")}).`],
    quote: "„Through undertaking a thorough investigation, we have established how this situation has arisen and traced it to one supplier of a raw material.“ (Sprecher von Lily’s Kitchen, Food Manufacture, 22.01.2026, englisches Original)",
    src: `Quelle: ${a("https://www.foodmanufacture.co.uk/Article/2026/01/22/tesco-has-issued-an-urgent-recall-notice-after-a-foreign-body-contamination-was-detected-in-certain-batches-of-lilys-kitchen-dog-food", "Food Manufacture")}`,
  },
];

const bodyHtml = `
<p>Im Futterregal stehen Hunderte Marken, dahinter steht erstaunlich wenig Auswahl. Wer die Eigentümer der Dosen und Säcke nachverfolgt, landet bei einer Handvoll Konzerne, ein paar Investoren und einigen Familienbetrieben. Wir haben 30 der bekanntesten Hersteller und Marken-Häuser durchgesehen: ihre Geschichte, wem sie heute gehören, was für sie spricht, was gegen sie vorgebracht wird, und was sie selbst der Presse gesagt haben.</p>
<p><strong>So haben wir gearbeitet.</strong> Recherchestand ist der 9. Oktober 2026. Jede Tatsachenbehauptung steht mit Quelle, Zitate geben wir im Original wieder (englische Originalzitate lassen wir englisch). Angaben der Unternehmen selbst kennzeichnen wir als Herstellerangaben. „Keinen Rückruf gefunden“ heißt nur, dass unsere Suche keinen ergeben hat: Das Lebensmittelwarnungs-Portal und die Behördendatenbanken konnten wir nicht lückenlos durchsuchen. Fehlt etwas oder stimmt etwas nicht, schreiben Sie uns über die <a href="/kontakt">Kontaktseite</a>, wir korrigieren umgehend.</p>

<h2>Das Wichtigste in Kürze</h2>
<ul>
<li>Mars, Nestlé Purina und Colgate-Palmolive (Hill’s) prägen den Weltmarkt; Mars besitzt seit 2023 mit Royal Canin, Iams und Champion gleich mehrere der bekanntesten „Premium“-Namen.</li>
<li>Fast jeder große Hersteller hat Rückrufe in der Geschichte: Melamin 2007, Aflatoxine 2005, Salmonellen 2012, Vitamin D 2019 sind die größten Fälle. Entscheidend ist, wie sie aufgearbeitet wurden.</li>
<li>Viele deutsche Marken sind Familienbetriebe mit langer Mühlen- oder Landhandelstradition; einige gehören inzwischen Investoren oder Konzernen (Terra Canis, Wolfsblut, Dr. Clauder’s).</li>
<li>Siegel, „Human grade“ und „Premium“ sind meist Eigenangaben. Prüfbar sind Deklaration, Analyse und Rückrufhistorie.</li>
</ul>

${fig("futtermittel-hersteller-ueberblick-supermarktregal", "Kunde steht ratlos vor einem Supermarktregal mit Hunde- und Katzenfutter von vielen Herstellern")}

<h2>Überblick: Wem gehört was?</h2>
<table>
<thead><tr><th>Hersteller</th><th>Gegründet</th><th>Eigentümer heute</th><th>Bekannte Marken</th></tr></thead>
<tbody>
<tr><td>Mars Petcare</td><td>1911 (Mars)</td><td>Familie Mars</td><td>Pedigree, Whiskas, Royal Canin, Iams, Orijen</td></tr>
<tr><td>Nestlé Purina</td><td>1894</td><td>Nestlé</td><td>Pro Plan, Dog Chow, Friskies, Beneful</td></tr>
<tr><td>Royal Canin</td><td>1968</td><td>Mars</td><td>Royal Canin</td></tr>
<tr><td>Hill’s</td><td>1907</td><td>Colgate-Palmolive</td><td>Science Diet, Prescription Diet</td></tr>
<tr><td>Iams/Eukanuba</td><td>1946</td><td>Mars (Europa: Spectrum)</td><td>Iams, Eukanuba</td></tr>
<tr><td>Champion Petfoods</td><td>1985 (Heimtier)</td><td>Mars</td><td>Orijen, Acana</td></tr>
<tr><td>Blue Buffalo</td><td>2002/2003</td><td>General Mills</td><td>Blue Buffalo</td></tr>
<tr><td>Wellness Pet Company</td><td>1926</td><td>Clearlake Capital</td><td>Wellness, Whimzees, Eagle Pack</td></tr>
<tr><td>Diamond Pet Foods</td><td>1970</td><td>Familie (Branchenangabe)</td><td>Taste of the Wild</td></tr>
<tr><td>J.M. Smucker</td><td>1897</td><td>Börse (SJM)</td><td>Milk-Bone, Meow Mix</td></tr>
<tr><td>Fressnapf</td><td>1990</td><td>Toeller, Cinven (Minderheit)</td><td>Premiere, Multifit</td></tr>
<tr><td>Interquell</td><td>Wurzeln 1765</td><td>Georg Müller</td><td>Happy Dog, Happy Cat</td></tr>
<tr><td>Bosch Tiernahrung</td><td>1960</td><td>Familie</td><td>Bosch, Sanabelle</td></tr>
<tr><td>Platinum Petfood</td><td>2004</td><td>nicht belegt</td><td>Platinum</td></tr>
<tr><td>Josera</td><td>1941</td><td>Familie Erbacher</td><td>Josera</td></tr>
<tr><td>Animonda</td><td>1991</td><td>Heristo-Gruppe</td><td>Carny, Vom Feinsten</td></tr>
<tr><td>Dr. Clauder’s</td><td>nicht belegt</td><td>Mühldorfer/KKA (Mehrheit)</td><td>Dr. Clauder’s</td></tr>
<tr><td>Markus-Mühle</td><td>nicht belegt</td><td>Familie Olberts</td><td>NaturNah, Black Angus</td></tr>
<tr><td>Terra Canis</td><td>2005</td><td>Nestlé Purina</td><td>Terra Canis</td></tr>
<tr><td>MjAMjAM</td><td>2016</td><td>nicht belegt</td><td>MjAMjAM</td></tr>
<tr><td>Rinti/Finnern</td><td>1983</td><td>Familie Finnern</td><td>Rinti, Miamor, Kattovit</td></tr>
<tr><td>Wolf of Wilderness / Wolfsblut</td><td>2005/2006 (Wolfsblut)</td><td>zooplus / AlphaPet</td><td>Wolf of Wilderness, Wolfsblut</td></tr>
<tr><td>Bewital petfood</td><td>1963</td><td>Familien Wigger/Petershagen</td><td>Belcando, Bewi Dog</td></tr>
<tr><td>Vitakraft</td><td>1837</td><td>Deuerer-Gruppe</td><td>Vitakraft</td></tr>
<tr><td>Mera Tiernahrung</td><td>1949</td><td>Familie Vos</td><td>mera, meracat</td></tr>
<tr><td>GranataPet</td><td>2005</td><td>Markus Fuchsenthaler</td><td>GranataPet, Kitty Cat</td></tr>
<tr><td>Affinity Petcare</td><td>1963</td><td>Agrolimen</td><td>Advance, Ultima, Brekkies</td></tr>
<tr><td>Almo Nature</td><td>2000</td><td>Fondazione Capellino</td><td>Almo Nature</td></tr>
<tr><td>Farmina</td><td>1965 (Russo Mangimi)</td><td>Familie Russo</td><td>N&amp;D, Vet Life</td></tr>
<tr><td>Lily’s Kitchen</td><td>2008</td><td>Nestlé Purina</td><td>Lily’s Kitchen</td></tr>
</tbody></table>

${fig("futtermittelindustrie-geschichte-hundekuchen-baeckerei", "Historische Bäckerei im 19. Jahrhundert mit Hundekuchen auf Holzregalen")}

<h2>Die Konzerne: Mars, Purina, Hill’s</h2>
<p>Die großen Fünf prägen den Weltmarkt, nicht nur im Supermarkt, sondern auch beim Tierarzt: Veterinärdiäten, Forschungsinstitute und Tierkliniken gehören zum selben Geschäft.</p>
${KONZERNE.map(render).join("\n")}

${fig("tierfutter-konzerne-konzernzentrale", "Moderne Konzernzentrale mit Glasfassade bei Dämmerung")}

<h2>Die großen Marken aus den USA</h2>
<p>Hier sitzen die Marken, die im Netz am heftigsten diskutiert werden: Premium-Versprechen, Sammelklagen und der Streit um getreidefreies Futter.</p>
${USA.map(render).join("\n")}

${fig("tierfutter-produktion-extruder-trockenfutter", "Produktionshalle für Trockenfutter mit Edelstahl-Extruder und Förderbändern")}

${fig("futtermittel-rohstoffe-getreidesilos-anlieferung", "Getreidesilos und Lkw bei der Rohstoffanlieferung an einem Futtermittelwerk")}

<h2>Deutsche Hersteller, Handelsmarken und Familienbetriebe</h2>
<p>Zwischen Konzern und Hofladen liegt der deutsche Markt: Mühlen, die zum Futterhersteller wurden, Handelsketten mit Eigenmarken und junge Marken mit Frischfleisch-Versprechen.</p>
${DACH.map(render).join("\n")}

${fig("tierfutter-mittelstand-familienbetrieb-muehle", "Kleine traditionelle Mühle eines Familienbetriebs mit Mehlsäcken und Holzkisten")}

<h2>Europäische Marken zwischen Konzern und Stiftung</h2>
${EUROPA.map(render).join("\n")}

${fig("futtermittel-rueckruf-lager-paletten", "Lagerhalle mit abgesperrten Paletten voller Futtersäcke bei einem Produktrückruf")}

${fig("futtermittel-qualitaetskontrolle-labor-hundefutter", "Labortechnikerin prüft eine Probe Hundefutter im Qualitätslabor")}

<h2>Rückrufe im Überblick: Was die Pannen verraten</h2>
<table>
<thead><tr><th>Hersteller</th><th>Jahr</th><th>Anlass</th></tr></thead>
<tbody>
<tr><td>Diamond</td><td>2005</td><td>Aflatoxine, mindestens 76 Hunde vermutlich gestorben (FDA)</td></tr>
<tr><td>Royal Canin, Hill’s, Iams u. a.</td><td>2007</td><td>Melamin in Rohstoffen aus China</td></tr>
<tr><td>Diamond (und Marken Dritter)</td><td>2012</td><td>Salmonellen, 14 Erkrankte</td></tr>
<tr><td>Iams</td><td>2013</td><td>mögliche Salmonellen, 29 Sorten</td></tr>
<tr><td>Purina</td><td>2014</td><td>Vergleich zu Jerky-Treats, 6,5 Mio. US-$</td></tr>
<tr><td>Blue Buffalo</td><td>2015</td><td>Vergleich 32 Mio. US-$, ohne Schuldeingeständnis</td></tr>
<tr><td>Blue Buffalo</td><td>2017</td><td>erhöhte Schilddrüsenhormone, eine Charge</td></tr>
<tr><td>Smucker</td><td>2018</td><td>Pentobarbital im Nassfutter, über 107 Mio. Dosen</td></tr>
<tr><td>Hill’s</td><td>2019</td><td>zu viel Vitamin D, 86 Chargen</td></tr>
<tr><td>Wolfsblut</td><td>2022/2023</td><td>erhöhte Bleiwerte (Atlantic Tuna)</td></tr>
<tr><td>Interquell</td><td>2024</td><td>Salmonellen, zwei Rückrufe</td></tr>
<tr><td>Terra Canis</td><td>2024</td><td>Fremdkörper in einzelnen Dosen</td></tr>
<tr><td>Fressnapf</td><td>2025</td><td>Salmonellen in mehreren Chargen</td></tr>
<tr><td>Josera</td><td>2025</td><td>gewölbte Dosen</td></tr>
<tr><td>Lily’s Kitchen</td><td>2026</td><td>Kunststoffteile, ein Rohstofflieferant</td></tr>
</tbody></table>
<p>Auffällig ist das Muster der Erklärungen: Fast immer liegt die Ursache laut Hersteller bei einem Zulieferer oder in einer einzelnen Charge. Das kann stimmen. Es ändert nichts daran, dass die Verantwortung für das Produkt beim Hersteller liegt, und es zeigt, wie lang und unübersichtlich die Lieferketten sind.</p>

${fig("futtermittel-hersteller-pressemitteilung-pressekonferenz", "Pressekonferenz mit Mikrofonen und Kameras im Vordergrund")}

<h2>Was die Pressestimmen sagen und was sie verschweigen</h2>
<p>Pressemitteilungen sind Werbung in Amtsdeutsch. Das heißt nicht, dass sie falsch sind, aber sie sagen, was das Unternehmen gesagt haben will. Vier Muster tauchen immer wieder auf:</p>
<ul>
<li><strong>Das Bedauern:</strong> „Wir bedauern den Vorfall“ (Interquell) oder „We deeply regret“ (Royal Canin) steht fast immer am Anfang eines Rückrufs und kostet nichts.</li>
<li><strong>Der Zulieferer:</strong> Hill’s, Lily’s Kitchen und Blue Buffalo verweisen auf Lieferanten oder Broker. Was die Verträge mit diesen Lieferanten sagen, steht nicht in der Mitteilung.</li>
<li><strong>Die Beruhigung:</strong> „Keine Erkrankungen gemeldet“ heißt nur, dass keine gemeldet wurden. Ob ein erkranktes Tier dem Hersteller oder einer Behörde überhaupt auffällt, hängt von der Halterin oder dem Halter ab.</li>
<li><strong>Das Versprechen:</strong> „Premium“, „natürlich“, „Human grade“ und „artgerecht“ sind in der Regel Selbstbeschreibungen ohne gesetzliche Definition.</li>
</ul>
<p>Die Pressemitteilungen mit Wachstumszahlen (Fressnapf, Smucker, Farmina) erzählen die andere Hälfte der Geschichte: Heimtierfutter ist ein Wachstumsmarkt, und ein Teil des Wachstums kommt aus Zukäufen (Mars/Champion, Nestlé/Lily’s Kitchen, Fressnapf/Arcaplanet).</p>

${fig("futtermittel-hersteller-presseberichte-recherche", "Schreibtisch mit Zeitungen, Tablet und Lupe bei der Recherche")}

<h2>Woran Sie ein gutes Produkt erkennen, unabhängig vom Namen</h2>
<ul>
<li><strong>Offene Deklaration:</strong> Jede Zutat mit Prozentangabe statt „tierische Nebenerzeugnisse“.</li>
<li><strong>Analyse in der Trockenmasse:</strong> Nur so lassen sich Nass- und Trockenfutter vergleichen.</li>
<li><strong>Rückrufhistorie prüfen:</strong> Das Bundesamt für Verbraucherschutz und Lebensmittelsicherheit und Portale wie lebensmittelwarnung.de führen Warnungen.</li>
<li><strong>Eigentümer kennen:</strong> Wer hinter der Marke steht, sehen Sie im Impressum oder bei den Herstellerangaben auf der Packung.</li>
<li><strong>Tierärztin fragen:</strong> Bei Erkrankungen gehört die Futterwahl in fachliche Hände (<a href="/blog/hundefutter-ohne-hochglanz-was-im-napf-zaehlt">Hundefutter ohne Hochglanz</a>).</li>
</ul>
${fig("tierarzt-liest-futteretikett-hundefutter", "Tierärztin liest aufmerksam das Etikett eines neutralen Futtersacks")}

${fig("hund-katze-napf-futter-kueche", "Hund und Katze fressen aus separaten Näpfen in einer hellen Küche")}

<h2>Fazit: Der Hund kauft nicht selbst</h2>
<p>Man muss sich das einmal vorstellen: Ein Wirtschaftszweig verkauft Milliarden Packungen an Kunden, die niemals probiert haben, was drin ist, und Konsumenten, die nicht lesen können, was draufsteht. Der Hund hat keine Stimme, keine Verbraucherzentrale und keinen Geschmack für die Feinheiten der Deklaration. Er frisst, was vor ihm steht, und das mit Begeisterung, wofür notfalls Aromen sorgen. Dass er jubelt, ist daher kein Qualitätsmerkmal. Auch ein Kind jubelt über Gummibärchen.</p>
<p>Die Geschichte der 30 Hersteller liest sich wie eine Familienchronik mit Besitzerwechsel: Wo einst ein Mühlenbesitzer stand, steht heute ein Investor; wo ein Tierarzt Gründer war, steht ein Konzernlogo. Und weil Mars Royal Canin, Iams und Orijen besitzt, Nestlé Terra Canis und Lily’s Kitchen, ist die Auswahl am Regal oft eine Auswahl im selben Hause. Der Kunde wählt zwischen Marken, die sich gegenseitig Konkurrenz machen und demselben Eigentümer gehören. Das nennt man Vielfalt, wenn man Marketing studiert hat.</p>
<p>Die Rückrufe sind dabei die ehrlichsten Dokumente der Branche. Dort steht, was sonst keiner sagt: dass in der Lieferkette etwas schiefgehen kann, dass Chargen geprüft werden müssen und dass Vitamin D in Dosen nichts verloren hat, wenn es zehnmal über dem Soll liegt. Bemerkenswert ist weniger, dass es Rückrufe gibt, als dass ihre Begründung so selten beim Hersteller liegt: Der Zulieferer war’s, der Broker war’s, die Charge war’s. Bei einer Lieferkette, die vom Maisfeld bis zur Dose reicht, ist zuletzt immer jemand anderes schuld, nur nicht der, dessen Name auf der Packung steht.</p>
<p>Auch das Wort „Premium“ will bedacht sein. Es ist rechtlich nirgends definiert und kostet daher nichts. Ob „Human grade“, „artgerecht“ oder „wie vom Wolf“: Das sind Wörter, die der Hersteller selbst über sich spricht, so wie jeder Wirt sein Bier das beste der Stadt nennt. Der Hund stimmt zu, er stimmt ja immer zu. Wer wirklich wissen will, was im Napf liegt, muss das Kleingedruckte lesen: Zutatenliste, Analyse, Eigentümer, Rückrufe.</p>
<p>Zieht man Bilanz, bleibt die ernüchternde Erkenntnis: Es gibt auch bei großen Namen Unterschiede zwischen guter und schlechter Arbeit, nur eben nicht dort, wo die Werbung sie vermutet. Ein Familienbetrieb ist nicht automatisch besser und ein Konzern nicht automatisch schlechter; es gibt Rückrufe bei beiden, und es gibt solide Qualität bei beiden. Misstrauen Sie darum weder dem Großen noch dem Kleinen, sondern der Packung, auf der zu viel Prosa und zu wenig Prozent steht. Gutes Futter erkennt man nicht an der Gründergeschichte auf der Rückseite, sondern an dem, was der Hund nach Wochen noch immer gut verträgt, an Gewicht, Fell und Kot. Der Napf ist die einzige Instanz, die nicht für Werbung bezahlt wird.</p>
<p><em>Hinweis:</em> Dieser Beitrag gibt Quellen wieder und stellt eine Einordnung dar. Er ersetzt keine tierärztliche Beratung, und einzelne Rückrufe sagen nichts über die heutige Qualität eines Herstellers aus. Hinweise auf Fehler richten Sie bitte an die <a href="/kontakt">Redaktion</a>.</p>

<h2>Quellen</h2>
<p>Alle Quellen stehen direkt in den Porträts oben als Links. Weitere Grundlagen: ${a("https://www.fda.gov/animal-veterinary/news-events/fda-alerts-pet-owners-and-veterinarians-about-potentially-toxic-levels-vitamin-d-33-varieties-hills", "FDA zum Hill’s-Rückruf 2019")}, ${a("https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigation-potential-link-between-certain-diets-and-canine-dilated-cardiomyopathy", "FDA-Untersuchung zu DCM")}, ${a("https://www.lgl.bayern.de/lebensmittel/ueberwachung/lebensmittelwarnungen/doc/happy_dog_heimtierfuttermittel.pdf", "LGL Bayern: Rückruf Happy Dog")}, ${a("https://www.test.de/Rueckruf-bei-Fressnapf-Salmonellen-in-Hunde-und-Katzenfutter-6189408-0/", "test.de zum Fressnapf-Rückruf")}, ${a("https://www.petworldwide.net/", "PET worldwide")}, ${a("https://globalpetindustry.com/", "GlobalPETS")}.</p>
`;

export const HERSTELLER_POSTS: NischenPost[] = [
  {
    slug: "futtermittel-hersteller-die-30-bekanntesten",
    title: "Die 30 bekanntesten Futtermittel-Hersteller: Geschichte, Gegenwart, Pannen und Pressestimmen",
    excerpt:
      "Wer steckt hinter Pedigree, Happy Dog, Royal Canin oder Terra Canis? 30 Hersteller im Porträt: Gründung, heutiger Eigentümer, Stärken, Rückrufe und Zitate aus der Presse, mit einem Fazit, das nichts schönredet.",
    image: "futtermittel-hersteller-ueberblick-supermarktregal.webp",
    imageAlt: "Ratloser Kunde vor einem Supermarktregal voller Hunde- und Katzenfutter verschiedener Hersteller",
    metaTitle: "Futtermittel-Hersteller im Überblick: 30 Marken, Geschichte, Rückrufe",
    metaDescription:
      "30 bekannte Hunde- und Katzenfutter-Hersteller im Porträt: Gründung, Eigentümer, Stärken, Rückrufe und Pressestimmen mit Quellen, dazu ein kritisches Fazit.",
    keywords: [
      "Futtermittel Hersteller",
      "Hundefutter Hersteller Übersicht",
      "Katzenfutter Hersteller",
      "Tierfutter Konzerne",
      "Hundefutter Rückrufe",
      "Mars Petcare Nestlé Purina",
      "Hundefutter Marken Eigentümer",
      "Futtermittelindustrie Geschichte",
    ],
    daysAgo: 4.62,
    bodyHtml,
  },
];
