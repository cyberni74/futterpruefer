/** Entscheidung im Datenschutzhinweis: "all" = Zustimmen (inkl. Gäste-Anzeige), "essential" = Nur notwendige. */
export const CONSENT_KEY = "fp-consent-v2";
/** Zeitpunkt der Entscheidung (ms). Der Hinweis erscheint nach 182 Tagen (sechs Monaten) erneut, für „Zustimmen“ und „Nur notwendige“ gleich; die bisherige Entscheidung gilt bis zur neuen Wahl. */
export const CONSENT_AT_KEY = "fp-consent-v2-at";
export const CONSENT_GUELTIG_TAGE = 182;
/** Früherer Hinweis („Verstanden“) war keine Einwilligung; der Schlüssel wird nicht mehr gelesen und beim Entscheiden entfernt. */
export const LEGACY_CONSENT_KEY = "fp-consent-v1";
/** Zufällige Besucher-Kennung für die Gäste-Anzeige, nur nach Zustimmung angelegt, bei Widerruf gelöscht. */
export const VISITOR_KEY = "fp-visitor-id";
export const CONSENT_CHANGE_EVENT = "fp-consent-change";
export const CONSENT_OPEN_EVENT = "fp-consent-open";

export type Consent = "all" | "essential" | null;

/** Inline vor dem ersten Paint: blendet den Hinweis aus, solange die Entscheidung jünger als 182 Tage ist (kein Flackern, kein LCP-Versatz). */
export const consentScript = `try{var a=+localStorage.getItem("${CONSENT_AT_KEY}");if(localStorage.getItem("${CONSENT_KEY}")&&a&&a<=Date.now()&&Date.now()-a<${CONSENT_GUELTIG_TAGE}*864e5)document.documentElement.classList.add("fp-consent")}catch(e){}`;

/** Liegt die Entscheidung im Datenschutzhinweis weniger als 182 Tage zurück? */
export function entscheidungAktuell(jetzt = Date.now()): boolean {
  try {
    const at = Number(localStorage.getItem(CONSENT_AT_KEY));
    return readConsent() !== null && at > 0 && at <= jetzt && jetzt - at < CONSENT_GUELTIG_TAGE * 864e5;
  } catch {
    return false;
  }
}

export function readConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}

/** Speichert die Entscheidung. Bei „Nur notwendige“ (und beim Widerruf) wird die Besucher-Kennung sofort gelöscht. */
export function writeConsent(v: "all" | "essential"): void {
  try {
    localStorage.setItem(CONSENT_KEY, v);
    localStorage.setItem(CONSENT_AT_KEY, String(Date.now()));
    localStorage.removeItem(LEGACY_CONSENT_KEY);
    if (v !== "all") localStorage.removeItem(VISITOR_KEY);
  } catch {
    /* Speicher gesperrt: ohne Speicher gibt es auch keine Zustimmung */
  }
  document.documentElement.classList.add("fp-consent");
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: v }));
}

/** Kennung nur mit Zustimmung anlegen. Alle Tabs desselben Browsers verwenden dieselbe Kennung. */
export function visitorId(): string | null {
  if (readConsent() !== "all") return null;
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id || !/^[A-Za-z0-9-]{16,64}$/.test(id)) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

/** Öffnet den Hinweis erneut („Datenschutz-Einstellungen“): Widerruf ist so einfach wie die Zustimmung. */
export function openConsentBanner(): void {
  document.documentElement.classList.remove("fp-consent");
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
  window.scrollTo({ top: 0 });
}
