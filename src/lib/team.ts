/**
 * Redaktionsteam ohne Klarnamen. Die Mitglieder arbeiten in der Branche und werden bewusst nur mit
 * Kürzel, Rolle und Qualifikation genannt. Keine Namen, Fotos, Geburtsdaten oder Stationen eintragen,
 * die Rückschlüsse auf die Person erlauben. Nur Qualifikationen nennen, die tatsächlich zutreffen.
 */
export const TEAM_MOTTO = "Transparent testen. Wissenschaftlich prüfen. Tiere schützen. Halter informieren.";

export type TeamMember = {
  slug: string;
  /** Kürzel, z. B. „Dr. L.“ */
  label: string;
  role: string;
  qualification: string;
  bio: string;
  tasks: string[];
  skills?: string;
};

export const TEAM: TeamMember[] = [
  {
    slug: "chefredaktion",
    label: "Dr. L.",
    role: "Chefredaktion & Projektleitung",
    qualification: "Tierärztin, Schwerpunkt Tierernährung",
    bio: "Verantwortet die redaktionelle Linie, die fachliche Qualität aller Veröffentlichungen und die Unabhängigkeit des Portals. Koordiniert das Team und steht im Austausch mit Tierärzten, Laboren und Herstellern.",
    tasks: ["Leitung der Redaktion und Qualitätssicherung", "Entwicklung der Testkriterien", "Fachliche Freigabe aller Artikel und Bewertungen", "Kontakt zu Tierärzten, Laboren und Herstellern"],
  },
  {
    slug: "testleitung",
    label: "M. W.",
    role: "Testleitung & Produktexpertise",
    qualification: "Lebensmitteltechnologie, Qualitätsmanagement",
    bio: "Entwickelt die Testprotokolle und dokumentiert jeden Prüfschritt nachvollziehbar. Ziel ist eine Bewertung, die reproduzierbar, fair und transparent ist.",
    tasks: ["Entwicklung und Pflege der Testprotokolle", "Bewertung von Deklaration, Verpackung und Produktsicherheit", "Dokumentation und Rückverfolgbarkeit", "Abstimmung mit externen Laboren"],
  },
  {
    slug: "datenanalyse",
    label: "Dr. S.",
    role: "Wissenschaftliche Datenanalyse",
    qualification: "Biologie, Tierernährung, Statistik",
    bio: "Verbindet Ernährungsphysiologie und Datenanalyse. Bewertet Inhaltsstoffe, wertet Nährstoffprofile aus und pflegt die Testdatenbank.",
    tasks: ["Bewertung von Nährstoffprofilen und Inhaltsstoffen", "Statistische Auswertung und Qualitätssicherung", "Pflege der Testdatenbank", "Wissenschaftliche Hintergrundartikel"],
    skills: "Laboranalytik, Statistik, Datenbanken",
  },
  {
    slug: "praxistest",
    label: "Dr. J.",
    role: "Praxis-Test & Verträglichkeit",
    qualification: "Tierärztin, Schwerpunkt Kleintierernährung",
    bio: "Beurteilt die praktische Seite der Futterbewertung: Verträglichkeit, Akzeptanz und Gesundheitsparameter bei Hunden und Katzen.",
    tasks: ["Beurteilung von Verträglichkeit und Akzeptanz", "Beratung bei ernährungsrelevanten Fragen", "Praxisnahe Einordnung von Hunde- und Katzenfutter"],
  },
  {
    slug: "kommunikation",
    label: "T. K.",
    role: "Redaktion & Community",
    qualification: "Kommunikationswissenschaft, Journalismus",
    bio: "Übersetzt Testergebnisse in verständliche Sprache, betreut die Community und schreibt Artikel und Newsletter.",
    tasks: ["Verständliche Artikel und Newsletter", "Betreuung von Rückmeldungen und Anfragen", "Aufbereitung von Testergebnissen für Laien"],
  },
];

export const initials = (label: string) => label.replace(/^Dr\.\s*/, "").replace(/[^A-ZÄÖÜ]/g, "").slice(0, 2);
