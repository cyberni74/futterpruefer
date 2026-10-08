export const CONSENT_KEY = "fp-consent-v1";

/** Inline vor dem ersten Paint: blendet den Hinweis aus, wenn bereits bestätigt (kein Flackern, kein LCP-Versatz). */
export const consentScript = `try{if(localStorage.getItem("${CONSENT_KEY}"))document.documentElement.classList.add("fp-consent")}catch(e){}`;
