export const SITE = {
  name: "Futterprüfer",
  domain: "futterpruefer.de",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://futterpruefer.de").replace(/\/$/, ""),
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

/** Indexierung nur auf der echten Domain – Vercel-Subdomains, localhost und SITE_NOINDEX=1 bleiben noindex. */
export function isIndexable(url = SITE.url, flag = process.env.SITE_NOINDEX): boolean {
  if (flag === "1") return false;
  return !/\.vercel\.app$|localhost|127\.0\.0\.1/.test(new URL(url).hostname);
}

export function absoluteUrl(path = "/"): string {
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
  name: "Teraa International",
  nameSuffix: "c/o Blue Vale Lifetech LLP",
  address: [
    ["No 36, Opp. 09, Arekempanhally, Wilson Garden", "Bengaluru – 560027, Indien"],
    ["A1, Gouranganagar, North 24 Parganas", "West Bengal – 700162, Indien"],
  ],
  /** Ansprechpartner/Vertreter für Europa */
  europeRepresentative: "Beytullah Coscun",
  europeAddress: "Via della Moscova, 20121 Mailand, Italien",
  email: "contactus@teraa-intl.com",
  phone: "+91 95350 96718",
  phoneInternational: "+91 94773 74505",
  hours: "Mo–Sa 10:00–18:00 Uhr (indische Zeit, IST)",
  registrationNo: "AAL-6212",
  gst: ["29ABIFM0599D1Z0", "19ABIFM0599D1Z1"],
} as const;
