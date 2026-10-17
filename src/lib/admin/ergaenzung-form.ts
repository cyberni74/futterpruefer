import {
  EF_FIELDS,
  scoreErgaenzung,
  validateEfSave,
  type EfEinheit,
  type EfEvidenz,
  type EfFieldKey,
  type EfInput,
  type EfRichtung,
  type EfSicherheit,
  type EfTierart,
  type StudieInput,
  type WirkstoffInput,
  type Zieltier,
} from "@/lib/ergaenzung";

export type WirkstoffDraft = {
  key: string;
  name: string;
  menge: string;
  referenz: string;
};

export type StudieDraft = {
  key: string;
  wirkstoffKey: string;
  titel: string;
  autoren: string;
  jahr: string;
  zeitschrift: string;
  tierart: EfTierart;
  dosis: string;
  einheit: EfEinheit | "";
  original: string;
  ergebnis: string;
  link: string;
  freigabe: boolean;
  evidenz: EfEvidenz;
  richtung: EfRichtung;
  geprueftAm: string;
};

export type EfFormState = {
  auswahl: string;
  auswahlBegruendung: string;
  dosierung: string;
  dosierungBegruendung: string;
  werbung: string;
  werbungBegruendung: string;
  traeger: string;
  traegerBegruendung: string;
  mengen: string;
  mengenBegruendung: string;
  unterlagen: string;
  unterlagenBegruendung: string;
  alibi: boolean;
  keineReferenz: boolean;
  heilaussage: boolean;
  sicherheit: EfSicherheit;
  sicherheitBegruendung: string;
  tierschutz: string;
  traegerAbzuege: string[];
  preisTagesdosis: string;
  wirkstoffe: WirkstoffDraft[];
  studien: StudieDraft[];
};

const num = (v: { toString(): string } | number | null | undefined) => (v == null || v === "" ? "" : String(v).replace(".", ","));

export const EMPTY_EF_FORM: EfFormState = {
  auswahl: "0",
  auswahlBegruendung: "",
  dosierung: "0",
  dosierungBegruendung: "",
  werbung: "0",
  werbungBegruendung: "",
  traeger: "0",
  traegerBegruendung: "",
  mengen: "0",
  mengenBegruendung: "",
  unterlagen: "0",
  unterlagenBegruendung: "",
  alibi: false,
  keineReferenz: false,
  heilaussage: false,
  sicherheit: "OK",
  sicherheitBegruendung: "",
  tierschutz: "",
  traegerAbzuege: [],
  preisTagesdosis: "",
  wirkstoffe: [],
  studien: [],
};

type StoredWirkstoff = {
  id: string;
  name: string;
  mengeMgProTagesdosis: { toString(): string } | null;
  referenzMgProKg: { toString(): string } | null;
  studien: Array<{
    id: string;
    titel: string;
    autoren: string;
    jahr: number;
    zeitschrift: string;
    tierart: EfTierart;
    studiendosisJeKg: { toString(): string } | null;
    einheit: EfEinheit | null;
    studiendosisOriginal: string;
    ergebnisKurz: string;
    link: string;
    linkFreigabe: boolean;
    evidenzstufe: EfEvidenz;
    richtung: EfRichtung;
    geprueftAm: Date;
  }>;
};

export function efFormFromReview(r: {
  efWirkstoffAuswahl: number | null;
  efWirkstoffAuswahlBegruendung: string;
  efWirkstoffDosierung: number | null;
  efWirkstoffDosierungBegruendung: string;
  efWerbung: number | null;
  efWerbungBegruendung: string;
  efTraeger: number | null;
  efTraegerBegruendung: string;
  efTransparenzMengen: number | null;
  efTransparenzMengenBegruendung: string;
  efTransparenzUnterlagen: number | null;
  efTransparenzUnterlagenBegruendung: string;
  efAlibiDosierung: boolean;
  efKeineReferenzdosis: boolean;
  efHeilaussage: boolean;
  efSicherheit: EfSicherheit;
  efSicherheitBegruendung: string;
  efTierschutzText: string;
  efTraegerAbzuege: string[];
  efPreisTagesdosisEur: { toString(): string } | null;
  wirkstoffe?: StoredWirkstoff[];
}): EfFormState {
  const punkt = (v: number | null) => (v == null ? "0" : String(v));
  return {
    auswahl: punkt(r.efWirkstoffAuswahl),
    auswahlBegruendung: r.efWirkstoffAuswahlBegruendung,
    dosierung: punkt(r.efWirkstoffDosierung),
    dosierungBegruendung: r.efWirkstoffDosierungBegruendung,
    werbung: punkt(r.efWerbung),
    werbungBegruendung: r.efWerbungBegruendung,
    traeger: punkt(r.efTraeger),
    traegerBegruendung: r.efTraegerBegruendung,
    mengen: punkt(r.efTransparenzMengen),
    mengenBegruendung: r.efTransparenzMengenBegruendung,
    unterlagen: punkt(r.efTransparenzUnterlagen),
    unterlagenBegruendung: r.efTransparenzUnterlagenBegruendung,
    alibi: r.efAlibiDosierung,
    keineReferenz: r.efKeineReferenzdosis,
    heilaussage: r.efHeilaussage,
    sicherheit: r.efSicherheit,
    sicherheitBegruendung: r.efSicherheitBegruendung,
    tierschutz: r.efTierschutzText,
    traegerAbzuege: r.efTraegerAbzuege,
    preisTagesdosis: num(r.efPreisTagesdosisEur),
    wirkstoffe: (r.wirkstoffe ?? []).map((w) => ({
      key: w.id,
      name: w.name,
      menge: num(w.mengeMgProTagesdosis),
      referenz: num(w.referenzMgProKg),
    })),
    studien: (r.wirkstoffe ?? []).flatMap((w) =>
      w.studien.map((s) => ({
        key: s.id,
        wirkstoffKey: w.id,
        titel: s.titel,
        autoren: s.autoren,
        jahr: String(s.jahr),
        zeitschrift: s.zeitschrift,
        tierart: s.tierart,
        dosis: num(s.studiendosisJeKg),
        einheit: s.einheit ?? "",
        original: s.studiendosisOriginal,
        ergebnis: s.ergebnisKurz,
        link: s.link,
        freigabe: s.linkFreigabe,
        evidenz: s.evidenzstufe,
        richtung: s.richtung,
        geprueftAm: s.geprueftAm.toISOString().slice(0, 10),
      })),
    ),
  };
}

const scoreKey: Record<EfFieldKey, keyof EfFormState> = {
  auswahl: "auswahl",
  dosierung: "dosierung",
  werbung: "werbung",
  traeger: "traeger",
  mengen: "mengen",
  unterlagen: "unterlagen",
};

const reasonKey: Record<EfFieldKey, keyof EfFormState> = {
  auswahl: "auswahlBegruendung",
  dosierung: "dosierungBegruendung",
  werbung: "werbungBegruendung",
  traeger: "traegerBegruendung",
  mengen: "mengenBegruendung",
  unterlagen: "unterlagenBegruendung",
};

function parseDecimal(raw: string): number | null {
  const v = raw.trim().replace(/\s|€/g, "").replace(",", ".");
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function whole(raw: string): number {
  const n = Number(String(raw).trim().replace(",", "."));
  return Number.isFinite(n) ? Math.round(n) : Number.NaN;
}

export function efInputFromForm(state: EfFormState): EfInput {
  return {
    auswahl: whole(state.auswahl),
    dosierung: whole(state.dosierung),
    werbung: whole(state.werbung),
    traeger: whole(state.traeger),
    mengen: whole(state.mengen),
    unterlagen: whole(state.unterlagen),
    alibi: state.alibi,
    keineReferenzdosis: state.keineReferenz,
    heilaussage: state.heilaussage,
    sicherheit: state.sicherheit,
  };
}

export function previewEf(state: EfFormState) {
  const input = efInputFromForm(state);
  const clean: EfInput = {
    ...input,
    auswahl: Number.isFinite(input.auswahl) ? input.auswahl : 0,
    dosierung: Number.isFinite(input.dosierung) ? input.dosierung : 0,
    werbung: Number.isFinite(input.werbung) ? input.werbung : 0,
    traeger: Number.isFinite(input.traeger) ? input.traeger : 0,
    mengen: Number.isFinite(input.mengen) ? input.mengen : 0,
    unterlagen: Number.isFinite(input.unterlagen) ? input.unterlagen : 0,
  };
  return { input: clean, result: scoreErgaenzung(clean) };
}

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}

export function efFormFromFormData(fd: FormData): EfFormState {
  let payload: { wirkstoffe?: WirkstoffDraft[]; studien?: StudieDraft[] } = {};
  try {
    const parsed = JSON.parse(str(fd, "efPayload") || "{}") as { wirkstoffe?: WirkstoffDraft[]; studien?: StudieDraft[] };
    if (parsed && typeof parsed === "object") payload = parsed;
  } catch {
    payload = {};
  }
  const base = { ...EMPTY_EF_FORM };
  for (const field of EF_FIELDS) {
    (base[scoreKey[field.key]] as string) = str(fd, field.column);
    (base[reasonKey[field.key]] as string) = str(fd, field.begruendung);
  }
  return {
    ...base,
    alibi: str(fd, "efAlibiDosierung") === "true",
    keineReferenz: str(fd, "efKeineReferenzdosis") === "true",
    heilaussage: str(fd, "efHeilaussage") === "true",
    sicherheit: str(fd, "efSicherheit") === "SCHWER" ? "SCHWER" : str(fd, "efSicherheit") === "MITTEL" ? "MITTEL" : "OK",
    sicherheitBegruendung: str(fd, "efSicherheitBegruendung"),
    tierschutz: str(fd, "efTierschutzText"),
    traegerAbzuege: fd.getAll("efTraegerAbzuege").filter((v): v is string => typeof v === "string" && v !== ""),
    preisTagesdosis: str(fd, "efPreisTagesdosisEur"),
    wirkstoffe: Array.isArray(payload.wirkstoffe) ? payload.wirkstoffe : [],
    studien: Array.isArray(payload.studien) ? payload.studien : [],
  };
}

export function draftsToInputs(state: EfFormState): { wirkstoffe: WirkstoffInput[]; studien: StudieInput[] } {
  const wirkstoffe = state.wirkstoffe
    .filter((w) => w.name.trim() || w.menge.trim() || w.referenz.trim())
    .map((w) => ({
      key: w.key,
      name: w.name.trim(),
      mengeMgProTagesdosis: parseDecimal(w.menge),
      referenzMgProKg: parseDecimal(w.referenz),
    }));
  const known = new Set(wirkstoffe.map((w) => w.key));
  const studien = state.studien
    .filter((s) => s.titel.trim() || s.autoren.trim() || s.link.trim() || s.ergebnis.trim())
    .map((s) => ({
      wirkstoffKey: known.has(s.wirkstoffKey) ? s.wirkstoffKey : "",
      titel: s.titel.trim(),
      autoren: s.autoren.trim(),
      jahr: whole(s.jahr),
      zeitschrift: s.zeitschrift.trim(),
      tierart: s.tierart,
      studiendosisJeKg: parseDecimal(s.dosis),
      einheit: s.einheit,
      studiendosisOriginal: s.original.trim(),
      ergebnisKurz: s.ergebnis.trim(),
      link: s.link.trim(),
      linkFreigabe: s.freigabe,
      evidenzstufe: s.evidenz,
      richtung: s.richtung,
      geprueftAm: s.geprueftAm,
    }));
  return { wirkstoffe, studien };
}

export function checkEfForm(state: EfFormState, tierart: Zieltier, publishing: boolean) {
  const scores = efInputFromForm(state);
  const { wirkstoffe, studien } = draftsToInputs(state);
  return validateEfSave({
    scores: {
      auswahl: scores.auswahl,
      dosierung: scores.dosierung,
      werbung: scores.werbung,
      traeger: scores.traeger,
      mengen: scores.mengen,
      unterlagen: scores.unterlagen,
    },
    begruendungen: {
      auswahl: state.auswahlBegruendung,
      dosierung: state.dosierungBegruendung,
      werbung: state.werbungBegruendung,
      traeger: state.traegerBegruendung,
      mengen: state.mengenBegruendung,
      unterlagen: state.unterlagenBegruendung,
    },
    alibi: state.alibi,
    keineReferenzdosis: state.keineReferenz,
    heilaussage: state.heilaussage,
    sicherheit: state.sicherheit,
    sicherheitBegruendung: state.sicherheitBegruendung,
    tierschutz: state.tierschutz,
    wirkstoffe,
    studien,
    tierart,
    publishing,
  });
}

export function preisTagesdosis(raw: string): number | null {
  return parseDecimal(raw);
}
