export const SITE = {
  name: "Futterprüfer",
  domain: "futterpruefer.de",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://futterpruefer.de").replace(/\/$/, ""),
  description:
    "Unabhängige Fachbewertungen von Hunde- und Katzenfutter: Rohstoffe, Schadstoffe, Nährstoffprofil und Deklaration – transparent nach 100-Punkte-Methodik.",
  author: "Futterprüfer-Redaktion",
};

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
