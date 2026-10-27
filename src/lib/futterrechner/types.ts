export type Art = "hund" | "katze";
export type Futterart = "trocken" | "nass";
export type Note = "sehr gut" | "gut" | "befriedigend" | "ausreichend" | "mangelhaft";
export type HundAktiv = "wenig" | "normal" | "sportlich" | "arbeit";
export type KatzeAktiv = "wohnung" | "freigang";

/** Analysewerte in % wie gefüttert (so, wie sie auf der Packung stehen). */
export type FutterInput = {
  typ: Futterart;
  p: number;
  f: number;
  fa: number;
  a: number;
  m?: number | null;
  ca?: number | null;
  ph?: number | null;
  /** zugesetzte Taurin-Menge in mg/kg (nur Katze) */
  taurinMgKg?: number | null;
  /** Herstellerangabe ME in kcal/100 g */
  meHersteller?: number | null;
};

export type TierInput =
  | {
      art: "hund";
      gewicht: number;
      phase: "welpe";
      wochen: number;
      endgewicht?: number | null;
    }
  | {
      art: "hund";
      gewicht: number;
      phase: "adult";
      /** jung = 1–2 Jahre, adult = 3–7 Jahre, senior = ab 8 Jahren */
      alter: "jung" | "adult" | "senior";
      aktiv: HundAktiv;
      kastriert?: boolean;
    }
  | { art: "katze"; gewicht: number; phase: "kitten"; monate: number }
  | { art: "katze"; gewicht: number; phase: "adult"; aktiv: KatzeAktiv; kastriert?: boolean };

export type Spalte = "adult110" | "adult95" | "wachstum_frueh" | "wachstum_spaet" | "adult100" | "adult75" | "wachstum";

export type Mindest = { p: number; f: number };
export type CaRegel = { caMin: number; caMax: number | null; pMin: number; pMax: number | null; rMin: number; rMax: number };

export type Energie = { nfe: number; ge: number; dig: number; de: number; me: number };
export type Bedarf = { kcal: number; lo: number; hi: number; faktor: number | null; formel: string };

export type Grund = {
  id: string;
  art: "ok" | "warn" | "bad" | "info";
  titel: string;
  text: string;
  /** Ist-Wert im Verhältnis zum Minimum (1 = FEDIAF-Minimum), für die Balken */
  verhaeltnis?: number;
};

export type Hinweis = { id: string; text: string };

export type Rechenweg = {
  ts: number;
  nfe: number;
  nfeTs: number;
  ge: number;
  dig: number;
  de: number;
  meSchaetzung: number;
  me: number;
  rer: number;
  mer: number;
  faktor: number | null;
  formel: string;
  spalte: Spalte;
};

export type ErgebnisOk = {
  status: "ok";
  feuchte: number;
  feuchteGeschaetzt: boolean;
  ts: number;
  nfe: number;
  nfeTs: number;
  ge: number;
  dig: number;
  de: number;
  meSchaetzung: number;
  me: number;
  pTs: number;
  fTs: number;
  aTs: number;
  faTs: number;
  p1000: number;
  f1000: number;
  spalte: Spalte;
  mindest: Mindest;
  rp: number;
  rf: number;
  capr: { ratio: number; caTs: number; pTs: number; regel: CaRegel } | null;
  taurin: { ts: number; min: number } | null;
  punkte: Record<string, number>;
  max: Record<string, number>;
  score: number;
  note: Note;
  deckel: Note[];
  bedarf: Bedarf;
  rer: number;
  /** null, wenn die Menge nicht berechnet werden kann (Welpe ohne Endgewicht) */
  menge: number | null;
  mengeLo: number | null;
  mengeHi: number | null;
  gruende: Grund[];
  hinweise: Hinweis[];
};

export type ErgebnisFehler = { status: "fehlt" | "unplausibel"; msg: string };

export type ErgebnisErgaenzung = {
  status: "ergaenzung";
  feuchte: number;
  ts: number;
  me: number;
  meSchaetzung: number;
  mer: number;
  budgetKcal: number;
  budgetGramm: number;
  kcalStueck: number | null;
  hinweise: Hinweis[];
};

export type Ergebnis = ErgebnisOk | ErgebnisFehler | ErgebnisErgaenzung;
