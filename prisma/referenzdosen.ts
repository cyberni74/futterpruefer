/** Interne Referenzdosen für das Admin-Dropdown. Keine öffentliche Methodikseite. Stand 17.10.2026. */
export const REFERENZDOSEN: Array<{
  wirkstoff: string;
  tierart: "HUND" | "KATZE";
  mgProKgMin: number | null;
  mgProKgMax: number | null;
  einheit: string;
  quelle: string;
  luecke: boolean;
  hinweis: string;
}> = [
  { wirkstoff: "Glucosamin-HCl", tierart: "HUND", mgProKgMin: 35, mgProKgMax: 50, einheit: "mg/kg", quelle: "https://pubmed.ncbi.nlm.nih.gov/16647870/", luecke: false, hinweis: "McCarthy 2007, eigene Umrechnung mind. ca. 35–50 mg/kg. Wirkung umstritten (PMID 28331832)." },
  { wirkstoff: "Chondroitinsulfat", tierart: "HUND", mgProKgMin: 25, mgProKgMax: 35, einheit: "mg/kg", quelle: "https://pubmed.ncbi.nlm.nih.gov/16647870/", luecke: false, hinweis: "Nur in Kombination mit Glucosamin untersucht, McCarthy 2007." },
  { wirkstoff: "Grünlippmuschel", tierart: "HUND", mgProKgMin: 20, mgProKgMax: null, einheit: "mg/kg", quelle: "https://pubmed.ncbi.nlm.nih.gov/15136981/", luecke: false, hinweis: "Bierer & Bui, gefriergetrocknetes Pulver, mind. ca. 20 mg/kg." },
  { wirkstoff: "EPA + DHA", tierart: "HUND", mgProKgMin: null, mgProKgMax: null, einheit: "mg × kg^0,75", quelle: "https://pubmed.ncbi.nlm.nih.gov/20043800/", luecke: false, hinweis: "Arthrose: 310 mg × kg^0,75 (Bauer 2011). Kein linearer mg/kg-Wert." },
  { wirkstoff: "MSM", tierart: "HUND", mgProKgMin: null, mgProKgMax: null, einheit: "mg/kg", quelle: "", luecke: true, hinweis: "Lücke: keine belastbare Dosis beim Hund gefunden (Stand 17.10.2026)." },
  { wirkstoff: "MSM", tierart: "KATZE", mgProKgMin: null, mgProKgMax: null, einheit: "mg/kg", quelle: "", luecke: true, hinweis: "Lücke: keine belastbare Dosis bei der Katze gefunden (Stand 17.10.2026)." },
  { wirkstoff: "Kollagen, nicht denaturiert (UC-II)", tierart: "HUND", mgProKgMin: null, mgProKgMax: null, einheit: "mg/Tier", quelle: "https://pubmed.ncbi.nlm.nih.gov/21623931/", luecke: false, hinweis: "10 mg pro Hund und Tag, nicht je kg (Gupta 2012)." },
  { wirkstoff: "Kollagenhydrolysat", tierart: "HUND", mgProKgMin: null, mgProKgMax: null, einheit: "mg/kg", quelle: "", luecke: true, hinweis: "Lücke: keine Referenzdosis für Kollagenhydrolysat." },
  { wirkstoff: "Probiotika (Enterococcus faecium SF68)", tierart: "KATZE", mgProKgMin: null, mgProKgMax: null, einheit: "KBE/Tier", quelle: "https://pubmed.ncbi.nlm.nih.gov/21689152/", luecke: false, hinweis: "ca. 2,1 × 10⁹ KBE pro Tier und Tag. Nur dieser Stamm. Hund: kein Effekt." },
  { wirkstoff: "Biotin", tierart: "HUND", mgProKgMin: 0.5, mgProKgMax: null, einheit: "mg/kg", quelle: "https://pubmed.ncbi.nlm.nih.gov/2602924/", luecke: false, hinweis: "ca. 0,5 mg/kg, unkontrollierte Studie (Frigg 1989)." },
  { wirkstoff: "Zink (elementar)", tierart: "HUND", mgProKgMin: 2, mgProKgMax: 3, einheit: "mg/kg", quelle: "https://doi.org/10.1046/j.1365-3164.2001.00233.x", luecke: false, hinweis: "2–3 mg/kg nur bei zinkreaktiver Dermatose (White 2001)." },
  { wirkstoff: "Ulmenrinde", tierart: "HUND", mgProKgMin: null, mgProKgMax: null, einheit: "mg/kg", quelle: "", luecke: true, hinweis: "Lücke: keine kontrollierte Dosis beim Hund gefunden." },
  { wirkstoff: "Ulmenrinde", tierart: "KATZE", mgProKgMin: null, mgProKgMax: null, einheit: "mg/kg", quelle: "", luecke: true, hinweis: "Lücke: keine kontrollierte Dosis bei der Katze gefunden." },
  { wirkstoff: "Flohsamen (Psyllium)", tierart: "HUND", mgProKgMin: 1330, mgProKgMax: null, einheit: "mg/kg", quelle: "https://pubmed.ncbi.nlm.nih.gov/10668813/", luecke: false, hinweis: "Median 1,33 g/kg (Leib 2000). Hier in mg/kg umgerechnet." },
  { wirkstoff: "Taurin", tierart: "KATZE", mgProKgMin: null, mgProKgMax: null, einheit: "mg/Tier", quelle: "https://pubmed.ncbi.nlm.nih.gov/3616607/", luecke: false, hinweis: "250 mg pro Katze alle 12 h bei DCM (Pion 1987). Nicht für gesunde Tiere." },
  { wirkstoff: "Taurin", tierart: "HUND", mgProKgMin: null, mgProKgMax: null, einheit: "mg/Tier", quelle: "https://pubmed.ncbi.nlm.nih.gov/14584743/", luecke: false, hinweis: "1000–3000 mg pro Hund und Tag bei Mangel mit DCM." },
  { wirkstoff: "L-Carnitin", tierart: "HUND", mgProKgMin: 50, mgProKgMax: 100, einheit: "mg/kg", quelle: "https://pubmed.ncbi.nlm.nih.gov/2019534/", luecke: false, hinweis: "50–100 mg/kg alle 8 h bei systemischem Mangel. Dosis in der Grundlage nicht geprüft." },
  { wirkstoff: "Hyaluronsäure (oral)", tierart: "HUND", mgProKgMin: null, mgProKgMax: null, einheit: "mg/kg", quelle: "", luecke: true, hinweis: "Lücke: keine belastbare orale Dosis beim Hund gefunden." },
  { wirkstoff: "Hyaluronsäure (oral)", tierart: "KATZE", mgProKgMin: null, mgProKgMax: null, einheit: "mg/kg", quelle: "", luecke: true, hinweis: "Lücke: keine belastbare orale Dosis bei der Katze gefunden." },
];
