/** Live-Primärdomain (Punycode). Canonical, Sitemap, robots, OG, Schema und RSS zeigen hierhin – ohne 301, damit WhatsApp & Co. die Vorschau laden. */
export const CANONICAL_ORIGIN = "https://xn--futterprfer-0hb.de";

/**
 * Hosts, die per 301 auf die Hauptdomain zeigen.
 * Die Hauptdomain selbst steht nicht in der Liste.
 * futterpruefer.de leitet Vercel an der Kante auf die Umlaut-Domain um;
 * eine App-Weiterleitung in die Gegenrichtung würde eine Schleife erzeugen.
 * www- und vercel.app-Hosts erreichen die App bzw. werden hier zusätzlich abgefangen.
 */
export const REDIRECT_HOSTS = [
  "www.futterpruefer.de",
  "www.xn--futterprfer-0hb.de",
  "www.futterprüfer.de",
  "futterpruefer.vercel.app",
  "futterpruefer-bernhardehmer-3885s-projects.vercel.app",
  "futterpruefer-git-main-bernhardehmer-3885s-projects.vercel.app",
] as const;

/** Hosts, deren konfigurierte Site-URL auf die Hauptdomain normalisiert wird. */
const CANONICAL_HOSTS = new Set<string>([
  "futterpruefer.de",
  "xn--futterprfer-0hb.de",
  "futterprüfer.de",
  ...REDIRECT_HOSTS,
]);

/** Lokale und Vorschau-URLs bleiben. ASCII-, www- und Produktions-vercel.app-Hosts werden zur Punycode-Hauptdomain. */
export function resolveSiteUrl(raw = process.env.NEXT_PUBLIC_SITE_URL): string {
  const value = (raw ?? "").trim().replace(/\/$/, "");
  if (!value) return CANONICAL_ORIGIN;
  try {
    const host = new URL(value).hostname.toLowerCase();
    if (CANONICAL_HOSTS.has(host)) return CANONICAL_ORIGIN;
    return value;
  } catch {
    return CANONICAL_ORIGIN;
  }
}

export const SITE = {
  name: "Futterprüfer",
  domain: "futterpruefer.de",
  url: resolveSiteUrl(),
  // „Unabhängig“ und „Schadstoffe“ bewusst nicht: Beleg bzw. Labor stehen aus. Formulierung hier zentral tauschen.
  description:
    "Hunde- und Katzenfutter im Test: Rohstoffe, bedenkliche Zusatzstoffe, Nährstoffprofil und Deklaration – bewertet nach offengelegter 100-Punkte-Methodik.",
  author: "Futterprüfer",
};

/** Dateibasiertes OG-Bild. Seiten mit eigenem `openGraph` müssen es setzen, sonst fällt es weg. */
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: `${SITE.name} – Hunde- und Katzenfutter im Test`,
} as const;

/** Footer-Claim. Zweiter Satz nur solange keine bezahlte Einreichung angeboten wird. */
export const FOOTER_CLAIM =
  "Transparente Bewertungen für Hunde- und Katzenfutter. Eine Einreichung kauft keine Note.";

/** Pflichttext Amazon-PartnerNet, Footer und Impressum. */
export const AMAZON_PARTNER_NOTICE = "Als Amazon-Partner verdiene ich an qualifizierten Verkäufen.";

/** Indexierung nur auf der echten Domain – Vercel-Subdomains, localhost und SITE_NOINDEX=1 bleiben noindex. */
export function isIndexable(url = SITE.url, flag = process.env.SITE_NOINDEX): boolean {
  if (flag === "1") return false;
  return !/\.vercel\.app$|localhost|127\.0\.0\.1/.test(new URL(url).hostname);
}

export function absoluteUrl(path = "/"): string {
  if (path === "/" || path === "") return SITE.url; // Startseite ohne Schrägstrich, wie Canonical und og:url
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Canonical plus RSS. Ein eigenes `alternates` auf der Seite ersetzt das aus dem Layout komplett. */
export function pageAlternates(canonical: string) {
  return {
    canonical,
    types: { "application/rss+xml": [{ url: "/rss.xml", title: `${SITE.name} – Tests & Fachblog` }] },
  };
}

export const NAV = [
  { href: "/", label: "Start" },
  { href: "/tests", label: "Tests" },
  { href: "/blog", label: "Fachblog" },
  { href: "/lexikon", label: "Lexikon" },
  { href: "/methodik", label: "Methodik" },
  { href: "/team", label: "Team" },
] as const;

export const MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric", timeZone: "Europe/Berlin" }).format(date);
}

export const PRICE_CLASS_LABEL = { GUENSTIG: "Günstig", MITTEL: "Mittel", PREMIUM: "Premium" } as const;
export const ANIMAL_LABEL = { HUND: "Hund", KATZE: "Katze" } as const;

/** Anbieter der Website (Impressum, Datenschutzerklärung). */
export const OPERATOR = {
  name: "Karpas Web Solutions Ltd.",
  address: ["Mavi Çam Sokak 12", "Gazimağusa 99450", "Türkische Republik Nordzypern"],
  /** Geschäftsführer und Vertretungsberechtigter */
  managingDirector: "Manuel Stark",
  /** Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV */
  responsibleContent: "Sebastian Kraft",
  /** Vertreter für Europa nach Art. 27 DSGVO. */
  europeRepresentative: "Sebastian Kraft",
  europeAddress: "P.O. Box 20520, CY1678 Nicosia, Cyprus",
  email: "manuel.stark@karpasweb.com",
  phone: "+90 533 821 44 09",
} as const;
