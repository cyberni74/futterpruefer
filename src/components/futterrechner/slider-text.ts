const fmtZahl = (x: number, step: number) => {
  const dec = step >= 1 ? 0 : step >= 0.1 ? 1 : 2;
  return new Intl.NumberFormat("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: Math.max(dec, 2) }).format(x);
};

/**
 * Ein Text für Anzeige und Wert-Blase eines Reglers, damit beide nie auseinanderlaufen.
 * Mit `textAnzeige` (z. B. Altersregler, dessen Wert eine Position ist) kommt der formatierte Text von dort,
 * sonst Zahl und Einheit („20 kg“, „25 %“).
 */
export function sliderText(value: number, opts: { step: number; einheit: string; textAnzeige?: (v: number) => string }): string {
  if (opts.textAnzeige) return opts.textAnzeige(value);
  return `${fmtZahl(value, opts.step)}${opts.einheit ? ` ${opts.einheit}` : ""}`;
}

export const sliderZahl = fmtZahl;
