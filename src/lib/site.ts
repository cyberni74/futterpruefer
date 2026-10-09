export const SITE = {
  name: "Futterprüfer",
  domain: "futterpruefer.de",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://futterpruefer.de").replace(/\/$/, ""),
  description:
    "Unabhängige Fachbewertungen von Hunde- und Katzenfutter: Rohstoffe, Schadstoffe, Nährstoffprofil und Deklaration – transparent nach 100-Punkte-Methodik.",
  author: "Futterprüfer-Redaktion",
};

/** Indexierung nur auf der echten Domain – Vercel-Subdomains, localhost und SITE_NOINDEX=1 bleiben noindex. */
export function isIndexable(url = SITE.url, flag = process.env.SITE_NOINDEX): boolean {
  if (flag === "1") return false;
  return !/\.vercel\.app$|localhost|127\.0\.0\.1/.test(new URL(url).hostname);
}

export function absoluteUrl(path = "/"): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
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
  /** Ansprechpartner/Vertreter für Europa (Anschrift in der EU fehlt noch) */
  europeRepresentative: "Beytullah Coscun",
  email: "contactus@teraa-intl.com",
  phone: "+91 95350 96718",
  phoneInternational: "+91 94773 74505",
  hours: "Mo–Sa 10:00–18:00 Uhr (indische Zeit, IST)",
  registrationNo: "AAL 6212",
  gst: ["29ABIFM0599D1Z0", "19ABIFM0599D1Z1"],
} as const;
