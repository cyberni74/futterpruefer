export const CONSENT_KEY = "fp-consent-v1";
export const CONSENT_COOKIE = "fp_consent";
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE = 31_536_000; // 12 Monate
export const CONSENT_OPEN_EVENT = "fp-open-consent";
export const CONSENT_CHOICES = ["ok", "essential"] as const;

export type ConsentChoice = (typeof CONSENT_CHOICES)[number];

export const CONSENT_COOKIE_OPTIONS = {
  path: "/",
  maxAge: CONSENT_MAX_AGE,
  sameSite: "lax" as const,
  secure: true,
  httpOnly: false,
};

export function isConsentChoice(value: unknown): value is ConsentChoice {
  return value === "ok" || value === "essential";
}

export function serializeConsent(choice: ConsentChoice): string {
  return `v${CONSENT_VERSION}.${choice}`;
}

export function parseConsentValue(value: string | undefined | null): { version: number; choice: ConsentChoice } | null {
  if (!value) return null;
  const match = /^v(\d+)\.(ok|essential)$/.exec(value.trim());
  if (!match) return null;
  return { version: Number(match[1]), choice: match[2] as ConsentChoice };
}

/** Gültig nur bei der aktuellen, bewusst gesetzten Consent-Version. */
export function hasCurrentConsent(value: string | undefined | null): boolean {
  const parsed = parseConsentValue(value);
  return parsed !== null && parsed.version === CONSENT_VERSION;
}

/**
 * Inline vor dem ersten Paint: blendet den Hinweis aus, wenn Cookie oder älterer localStorage-Eintrag vorliegt.
 * Versteckt per eigenem Style-Tag – nicht nur per Klasse auf <html>, weil React/next-themes die html-class beim Hydrate überschreiben.
 */
export const consentScript = `try{var k="${CONSENT_KEY}";var n="${CONSENT_COOKIE}";var v=${CONSENT_VERSION};function fpHasConsent(){var cs=document.cookie.split(";");for(var i=0;i<cs.length;i++){var c=cs[i].trim();if(c.indexOf(n+"=v"+v+".")===0)return true}try{var ls=localStorage.getItem(k);if(ls==="ok"||ls==="essential")return true}catch(e){}return false}if(fpHasConsent()){if(!document.getElementById("fp-consent-hide")){var s=document.createElement("style");s.id="fp-consent-hide";s.textContent="#fp-cookie{display:none!important}";(document.head||document.documentElement).appendChild(s)}document.documentElement.classList.add("fp-consent")}}catch(e){}`;
