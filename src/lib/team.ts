/**
 * Team-Profile der Team-Seite.
 * PERSON_MARKUP steuert, ob die Personen zusätzlich als strukturierte Daten (schema.org/Person)
 * für Suchmaschinen ausgegeben werden. Bis zum Livegang aus.
 */
export const PERSON_MARKUP = false;

export const TEAM_MOTTO = "Transparent testen. Wissenschaftlich prüfen. Tiere schützen. Halter informieren.";

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  qualification: string;
  stations: string[];
  born: string;
  focus: string;
  bio: string;
  education: string[];
  career: string[];
  tasks: string[];
  skills?: string;
  languages: string;
  motto: string;
};

export const TEAM: TeamMember[] = [
  {
    slug: "lena-hoffmann",
    name: "Dr. Lena Hoffmann",
    role: "Chefredakteurin & Projektleiterin",
    qualification: "Tierärztin, Tierernährung",
    stations: ["London", "Davis (USA)"],
    born: "1985 in München",
    focus: "Tierernährung, Redaktion, Unabhängigkeit der Tests",
    bio: "Dr. Lena Hoffmann ist Tierärztin mit Spezialisierung auf Tierernährung. Sie verantwortet die redaktionelle Linie, die wissenschaftliche Qualität aller Veröffentlichungen und die Unabhängigkeit des Portals. Sie koordiniert das Team, spricht mit Herstellern, Laboren und Tierärzten und schreibt Expertisen zu Hunde-, Katzen- und Kleintierfutter.",
    education: [
      "2005–2011: Veterinärmedizin, Ludwig-Maximilians-Universität München",
      "2008: Auslandssemester am Royal Veterinary College, London",
      "2011–2014: Promotion Dr. med. vet., LMU München – Forschungsaufenthalt an der University of California, Davis (Companion Animal Nutrition)",
      "2015–2016: Weiterbildung Tierernährung, Universität Wien",
    ],
    career: [
      "2011–2014: Tierärztin in einer Kleintierpraxis in München",
      "2014–2017: Wissenschaftliche Mitarbeiterin am Institut für Tierernährung, München",
      "2017–2021: Redakteurin für ein großes Tierfachmagazin",
      "Seit 2021: Chefredakteurin & Projektleiterin bei Futterprüfer.de",
    ],
    tasks: ["Leitung der Redaktion und Qualitätssicherung", "Entwicklung von Testkriterien", "Fachliche Freigabe aller Artikel und Bewertungen", "Kontakt zu Tierärzten, Laboren und Herstellern", "Vertretung des Portals in Medien und Fachöffentlichkeit"],
    languages: "Deutsch (Muttersprache), Englisch (C2), Französisch (B1)",
    motto: "Unabhängigkeit beginnt bei der Frage, wer die Daten geprüft hat.",
  },
  {
    slug: "markus-weber",
    name: "Markus Weber",
    role: "Testleiter & Produktexperte",
    qualification: "Lebensmitteltechnologie, Qualitätsmanagement",
    stations: ["Wageningen", "Zürich"],
    born: "1987 in Köln",
    focus: "Testprotokolle, anonyme Produkteinkäufe, Qualitätskontrolle",
    bio: "Markus Weber kommt aus der Futtermittel- und Lebensmittelindustrie. Er entwickelt die Testprotokolle, kauft Produkte anonym ein und dokumentiert jeden Schritt nachvollziehbar. Sein Ziel: Tests, die reproduzierbar, fair und transparent sind.",
    education: [
      "2007–2010: B.Sc. Lebensmitteltechnologie, Technische Universität München",
      "2010–2012: M.Sc. Quality Management, Wageningen University & Research",
      "2011: Auslandssemester an der ETH Zürich – Lebensmittelanalytik",
    ],
    career: [
      "2012–2015: Qualitätsmanager bei einem Futtermittelhersteller in Nordrhein-Westfalen",
      "2015–2018: Produktentwickler für Nass- und Trockenfutter",
      "2018–2020: Auditor für Lebensmittel- und Futtermittelsicherheit",
      "Seit 2020: Testleiter & Produktexperte bei Futterprüfer.de",
    ],
    tasks: ["Entwicklung und Pflege der Testprotokolle", "Anonyme Einkäufe und Probenauswahl", "Koordination externer Labore", "Dokumentation und Rückverfolgbarkeit", "Bewertung von Deklaration, Verpackung und Produktsicherheit"],
    languages: "Deutsch (Muttersprache), Englisch (C1), Niederländisch (B1)",
    motto: "Ein guter Test ist erst dann gut, wenn ihn jeder nachmachen könnte.",
  },
  {
    slug: "sarah-schmidt",
    name: "Dr. Sarah Schmidt",
    role: "Biologin & wissenschaftliche Datenanalyse",
    qualification: "Biologie, Tierernährung, Statistik",
    stations: ["Edinburgh", "Wageningen", "Uppsala", "Davis", "Neuseeland", "Zürich"],
    born: "1989 in Hamburg",
    focus: "Tierernährung, Laboranalytik, Statistik, Datenbank",
    bio: "Dr. Sarah Schmidt ist Biologin mit internationaler akademischer Laufbahn. Sie verbindet Laboranalytik, Ernährungsphysiologie und moderne Datenanalyse, bewertet Inhaltsstoffe, wertet Labor- und Fütterungsdaten aus und pflegt die wissenschaftliche Testdatenbank.",
    education: [
      "2009–2012: B.Sc. Biologie, Universität Hamburg – 2011 Erasmus-Semester, University of Edinburgh",
      "2012–2014: M.Sc. Animal Nutrition & Nutritional Biology, Wageningen University & Research",
      "2014–2018: PhD in Animal Science / Nutritional Physiology, Swedish University of Agricultural Sciences, Uppsala – 2016 Forschungsaufenthalt, University of California, Davis",
      "2018–2020: Postdoc Companion Animal Nutrition, Massey University, Neuseeland",
      "2020–2022: Wissenschaftliche Mitarbeiterin, Universität Zürich",
    ],
    career: ["Seit 2022: Biologin & wissenschaftliche Datenanalyse bei Futterprüfer.de"],
    tasks: ["Bewertung von Nährstoffprofilen und Inhaltsstoffen", "Statistische Auswertung von Labor- und Fütterungsdaten", "Aufbau und Pflege der Testdatenbank", "Qualitätssicherung und Reproduzierbarkeit", "Wissenschaftliche Hintergrundartikel"],
    skills: "HPLC, GC-MS, ICP-OES, ELISA, In-vitro-Verdauungsmodelle, Mikrobiologie, PCR, R, Python, SPSS, SQL, Power BI",
    languages: "Deutsch (Muttersprache), Englisch (C2), Niederländisch (B2), Schwedisch (B1), Spanisch (A2)",
    motto: "Gute Tests beginnen mit guten Daten – und guten Daten geht man am besten international auf den Grund.",
  },
  {
    slug: "tobias-klein",
    name: "Tobias Klein",
    role: "Community-Manager & Redakteur",
    qualification: "Kommunikationswissenschaft, Journalismus",
    stations: ["Wien", "Amsterdam", "Melbourne"],
    born: "1992 in Wien",
    focus: "Kommunikation, Social Media, Nutzerforen, Videos",
    bio: "Tobias Klein übersetzt wissenschaftliche Testergebnisse in verständliche Sprache. Er betreut die Community, organisiert Nutzerumfragen und produziert Artikel, Newsletter und Videos – die Stimme zwischen Labor und Tierhalter.",
    education: [
      "2011–2014: B.A. Kommunikationswissenschaft, Universität Wien",
      "2014–2016: M.A. Journalism, University of Amsterdam",
      "2015: Auslandssemester, University of Melbourne – Digital Media",
      "2017: Weiterbildung Umwelt- und Wissenschaftsjournalismus, Berlin",
    ],
    career: [
      "2016–2018: Online-Redakteur für ein Tiermagazin",
      "2018–2020: Social-Media-Manager bei einem Tierschutzverein",
      "2020–2022: Content-Manager für ein Verbraucherportal",
      "Seit 2022: Community-Manager & Redakteur bei Futterprüfer.de",
    ],
    tasks: ["Betreuung von Forum, Kommentaren und Social Media", "Erstellung verständlicher Artikel und Videos", "Organisation von Nutzerumfragen", "Aufbereitung von Testergebnissen für Laien", "Community-Feedback an das Testteam"],
    languages: "Deutsch (Muttersprache), Englisch (C1), Niederländisch (B1), Französisch (A2)",
    motto: "Wissenschaft wird erst dann wirksam, wenn sie verstanden wird.",
  },
  {
    slug: "julia-braun",
    name: "Dr. Julia Braun",
    role: "Tierärztin & Praxis-Testerin",
    qualification: "Veterinärmedizin, Fütterungsstudien",
    stations: ["Edinburgh", "Cornell", "Utrecht"],
    born: "1988 in Berlin",
    focus: "Fütterungsstudien, Verträglichkeit, Akzeptanz",
    bio: "Dr. Julia Braun ist praktizierende Tierärztin mit Schwerpunkt Kleintierernährung. Sie führt Fütterungsstudien mit Hunden und Katzen durch und beurteilt Verträglichkeit, Akzeptanz und Gesundheitsparameter – die praktische Seite der Futterbewertung.",
    education: [
      "2007–2013: Veterinärmedizin, Freie Universität Berlin",
      "2010–2011: Auslandsjahr, University of Edinburgh",
      "2012: Praktikum, Cornell University (USA) – Clinical Nutrition",
      "2013–2016: Promotion Dr. med. vet., Utrecht University",
      "2017: Fachtierärztin-Weiterbildung Kleintierernährung",
    ],
    career: [
      "2013–2016: Tierärztin in einer Kleintierklinik in Berlin",
      "2016–2019: Tierärztin für Ernährungsberatung in einer Tierklinik",
      "2019–2021: Leiterin einer Fütterungsstudie für Heimtierfutter",
      "Seit 2021: Tierärztin & Praxis-Testerin bei Futterprüfer.de",
    ],
    tasks: ["Durchführung und Betreuung von Fütterungsstudien", "Beurteilung von Verträglichkeit und Akzeptanz", "Gesundheitschecks während der Testphasen", "Beratung bei ernährungsrelevanten Fragen", "Praxisnahe Bewertung von Hunde- und Katzenfutter"],
    languages: "Deutsch (Muttersprache), Englisch (C2), Niederländisch (B1), Spanisch (A2)",
    motto: "Ein Futter ist erst dann gut, wenn das Tier es verträgt – und der Halter es versteht.",
  },
];

export const initials = (name: string) =>
  name.replace(/^Dr\.\s*/, "").split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
