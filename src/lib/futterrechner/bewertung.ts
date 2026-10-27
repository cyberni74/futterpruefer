import type { Eingabe } from "./index";
import { mengenRisiko, risikenFuer, type RisikoGrund } from "./risiken";
import type { Ergebnis, ErgebnisOk, Grund, Hinweis, Note } from "./types";
import {
  ASCHE_BAND, ATWATER, FASER_GRENZE_HUND, GEWICHT, KOLLAGEN_TEXT_FREIGEGEBEN, LECKERLI_ANTEIL, MINDEST, NFE_BAND, NOTEN_REIHE, NOTEN_SCHWELLEN,
  PE_SOCKEL, PE_ZIEL, PF_BAND, PLAUS_ABZUG,
} from "./fediaf";
import { inTs, meNrc2006 } from "./energie";
import { bedarf, rer, spalte as waehleSpalte } from "./bedarf";
import { ascheImBand, caPCheck, kollagen, lin, proTausendKcal, r1, taurinCheck } from "./naehrstoffe";
import * as T from "./texte";

export const noteFuer = (score: number): Note => NOTEN_SCHWELLEN.find(([s]) => score >= s)?.[1] ?? "mangelhaft";
const schlechter = (a: Note, b: Note) => NOTEN_REIHE.indexOf(a) > NOTEN_REIHE.indexOf(b);

export function bewerte({ futter, tier, ergaenzung, stueckGramm }: Eingabe): Ergebnis {
  const { p, f, fa, a } = futter;
  let m = futter.m ?? null;
  let feuchteGeschaetzt = false;
  if (m == null) {
    if (futter.typ === "trocken") {
      m = 10;
      feuchteGeschaetzt = true;
    } else return { status: "fehlt", msg: "Feuchte fehlt" };
  }
  const summe = p + f + fa + a + m;
  if (summe > 102) return { status: "unplausibel", msg: `Die Werte ergeben zusammen ${T.n1(summe)} %, das sind mehr als 100 %. Bitte prüfen Sie die Eingabe.` };
  const e = meNrc2006(tier.art, p, f, fa, a, m);
  if (e.nfe < -2) return { status: "unplausibel", msg: "Die Werte passen nicht zusammen (rechnerischer NfE unter −2 %). Bitte prüfen Sie die Eingabe." };

  const me = futter.meHersteller || e.me;
  const ts = 100 - m;
  const b = bedarf(tier);
  const hinweise: Hinweis[] = [];
  const faTs = inTs(fa, m);

  if (futter.meHersteller && Math.abs(futter.meHersteller - e.me) / e.me > 0.15) {
    hinweise.push({ id: "me", text: `Der Herstellerwert (${T.n0(futter.meHersteller)} kcal/100 g) weicht um mehr als 15 % von unserer Schätzung (${T.n0(e.me)} kcal/100 g) ab. Der Herstellerwert gilt.` });
  }
  if (e.nfe < 0) hinweise.push({ id: "nfe", text: "Der rechnerische NfE war leicht negativ und wurde auf 0 gesetzt (Rundung)." });
  if (tier.art === "hund" && faTs > FASER_GRENZE_HUND) hinweise.push({ id: "faser", text: T.FASER_HINWEIS });

  if (ergaenzung) {
    const budgetKcal = b.kcal * LECKERLI_ANTEIL;
    return {
      status: "ergaenzung",
      feuchte: m,
      ts,
      me,
      meSchaetzung: e.me,
      mer: b.kcal,
      budgetKcal,
      budgetGramm: (budgetKcal / me) * 100,
      kcalStueck: stueckGramm ? (me * stueckGramm) / 100 : null,
      leckerliRisiko: "R-LECKERLI",
      hinweise: [...hinweise, { id: "erk", text: T.ERKRANKUNG_HINWEIS }],
    };
  }

  const col = waehleSpalte(tier, b.faktor);
  const mindest = MINDEST[col];
  const p1000 = proTausendKcal(p, me);
  const f1000 = proTausendKcal(f, me);
  const rp = p1000 / mindest.p;
  const rf = f1000 / mindest.f;
  const welpe = col.startsWith("wachstum");
  const punkte: Record<string, number> = {};
  const max: Record<string, number> = {};
  const deckel: Note[] = [];
  const gruende: Grund[] = [];

  const W = GEWICHT[tier.art];
  const art = tier.art;

  // 1) Protein:Fett-Verhältnis (35): stärkstes Kriterium, linear von lo (0 Punkte) bis hi (volle Punkte)
  const pf = f > 0 ? p / f : 99;
  const band = PF_BAND[art];
  const pfAnteil = lin(pf, band.lo, band.hi);
  punkte.pf = r1(W.pf * pfAnteil);
  max.pf = W.pf;
  // 2) Protein-Energieanteil (15): unter dem FEDIAF-Minimum (in Energie-%) 0, ab Minimum Sockel, voll beim Ziel
  const nfeC = Math.max(e.nfe, 0);
  const eP = ATWATER.p * p;
  const eF = ATWATER.f * f;
  const eC = ATWATER.c * nfeC;
  const eS = eP + eF + eC;
  const energieAnteile = { p: (eP / eS) * 100, f: (eF / eS) * 100, c: (eC / eS) * 100 };
  const peLo = (mindest.p * ATWATER.p) / 10;
  punkte.pe = energieAnteile.p >= peLo ? r1(W.pe * (PE_SOCKEL + (1 - PE_SOCKEL) * lin(energieAnteile.p, peLo, PE_ZIEL[art]))) : 0;
  max.pe = W.pe;
  // 3) FEDIAF-Minimum Protein (10) und Fett (5); die Deckel aus v1 bleiben
  punkte.pmin = rp >= 1 ? W.pmin : rp >= 0.9 ? W.pmin / 2 : 0;
  max.pmin = W.pmin;
  punkte.fmin = rf >= 1 ? W.fmin : rf >= 0.9 ? W.fmin / 2 : 0;
  max.fmin = W.fmin;
  if (rp < 0.9 || rf < 0.9) deckel.push("mangelhaft");
  else if (rp < 1 || rf < 1) deckel.push("ausreichend");
  // 4) NfE / Kohlenhydrate: Hund 5, Katze 10 Punkte
  const nfeTs = inTs(nfeC, m);
  const nfeBand = NFE_BAND[art];
  punkte.nfe = r1(W.nfe * (1 - lin(nfeTs, nfeBand.lo, nfeBand.hi)));
  max.nfe = W.nfe;

  gruende.push({ id: "protein", art: rp >= 1 ? "ok" : rp >= 0.9 ? "warn" : "bad", titel: "Rohprotein", text: T.proteinGrund(p1000, mindest.p, rp, col), verhaeltnis: rp });
  const wechsel = T.spaltenWechsel(col, mindest.p);
  if (wechsel) gruende.push({ id: "spalte", art: "info", titel: "Warum dieser Mindestwert?", text: wechsel });
  gruende.push({ id: "fett", art: rf >= 1 ? "ok" : rf >= 0.9 ? "warn" : "bad", titel: "Rohfett", text: T.fettGrund(f1000, mindest.f, rf), verhaeltnis: rf });
  gruende.push({
    id: "pf", art: pfAnteil >= 0.75 ? "ok" : pfAnteil >= 0.35 ? "warn" : "bad", titel: "Protein-Fett-Verhältnis",
    text: T.pfGrund(pf, energieAnteile.p, energieAnteile.f, energieAnteile.c, band.hi, pfAnteil < 0.35),
  });

  // Calcium / Phosphor
  const ca = futter.ca ?? null;
  const ph = futter.ph ?? null;
  let capr: ErgebnisOk["capr"] = null;
  if (ca != null && ph != null && ph > 0) {
    const c = caPCheck(tier.art, col, ca, ph, m, tier.art === "hund" && tier.phase === "welpe" ? tier.endgewicht : null, tier.art === "hund" && tier.phase === "welpe" ? tier.wochen : undefined);
    punkte.capr = c.okRatio && c.okCa && c.okP ? W.capr : c.nah && c.okCa ? W.capr / 2 : 0;
    max.capr = W.capr;
    if (punkte.capr === 0 && welpe) deckel.push("ausreichend");
    if (c.caUeber) deckel.push(welpe ? "mangelhaft" : "ausreichend");
    capr = { ratio: c.ratio, caTs: c.caTs, pTs: c.pTs, regel: c.regel };
    const ziel = T.zielgruppe(col);
    const artPunkte: Grund["art"] = punkte.capr === W.capr ? "ok" : punkte.capr > 0 ? "warn" : "bad";
    gruende.push(
      c.caUeber
        ? { id: "ca", art: "bad", titel: "Calcium", text: welpe ? T.caZuHoch : T.caZuHochAdult }
        : !c.okCa
          ? { id: "ca", art: artPunkte, titel: "Calcium", text: T.caZuNiedrig(c.caTs, c.regel.caMin) }
          : c.ratio < c.regel.rMin
            ? { id: "ca", art: artPunkte, titel: "Calcium und Phosphor", text: T.caPZuNiedrig(c.ratio, c.regel.rMin, ziel) }
            : c.ratio > c.regel.rMax
              ? { id: "ca", art: artPunkte, titel: "Calcium und Phosphor", text: T.caPDaneben(c.ratio, c.regel.rMax, ziel) }
              : !c.okP
                ? { id: "ca", art: artPunkte, titel: "Phosphor", text: T.phosphorAusserhalb(c.pTs, c.regel.pMin, c.regel.pMax) }
                : { id: "ca", art: "ok", titel: "Calcium und Phosphor", text: T.caPPasst(c.ratio, c.regel.rMin, c.regel.rMax) },
    );
  } else {
    deckel.push("gut");
    gruende.push({ id: "ca", art: "info", titel: "Calcium und Phosphor", text: T.caPFehlt });
  }

  // Taurin (nur Katze, nur wenn angegeben)
  let taurin: ErgebnisOk["taurin"] = null;
  if (tier.art === "katze") {
    if (futter.taurinMgKg != null) {
      const t = taurinCheck(futter.taurinMgKg, m, col, futter.typ === "nass" || m >= 60);
      punkte.taurin = t.ok ? 10 : 0;
      max.taurin = 10;
      taurin = { ts: t.ts, min: t.min };
      gruende.push({ id: "taurin", art: t.ok ? "ok" : "bad", titel: "Taurin", text: T.taurinText(t.ts, t.min, t.ok) });
    } else gruende.push({ id: "taurin", art: "info", titel: "Taurin", text: T.taurinFehlt });
  }

  // Plausibilität & Vollständigkeit
  const aTs = inTs(a, m);
  let plaus: number = W.plaus;
  if (feuchteGeschaetzt) plaus -= PLAUS_ABZUG.feuchteGeschaetzt;
  if (!ascheImBand(aTs)) plaus -= PLAUS_ABZUG.ascheAusserhalb;
  if (tier.art === "hund" && faTs > FASER_GRENZE_HUND) plaus -= PLAUS_ABZUG.faserHund;
  punkte.plaus = Math.max(plaus, 0);
  max.plaus = W.plaus;
  if (feuchteGeschaetzt) gruende.push({ id: "feuchte", art: "warn", titel: "Feuchte geschätzt", text: T.feuchteGeschaetzt });
  gruende.push(
    ascheImBand(aTs)
      ? { id: "asche", art: "ok", titel: "Rohasche", text: T.ascheOk(aTs) }
      : { id: "asche", art: "warn", titel: "Rohasche", text: aTs < ASCHE_BAND.min ? T.ascheNiedrig(aTs) : T.ascheAuffaellig(aTs) },
  );
  if (tier.art === "hund" && faTs > FASER_GRENZE_HUND) gruende.push({ id: "faser", art: "warn", titel: "Rohfaser", text: T.FASER_HINWEIS });
  gruende.push({ id: "nfe", art: "info", titel: "NfE", text: T.nfeInfo(nfeTs, W.nfe, nfeBand.lo, nfeBand.hi) });
  // Kollagen-Heuristik: Abzug vom Score nach der Normierung, kein Deckel
  const koll = kollagen(art, inTs(p, m), aTs, capr?.caTs ?? null, futter.zutaten);
  const abzug = koll.abzugNaehrwerte + koll.abzugZutaten;
  if (koll.flag) {
    const treffer = koll.treffer.join(", ");
    const teile: string[] = [];
    if (koll.abzugZutaten > 0) {
      teile.push(KOLLAGEN_TEXT_FREIGEGEBEN ? T.kollagenLangZutaten(treffer) : T.kollagenKurzZutaten(treffer));
      if (KOLLAGEN_TEXT_FREIGEGEBEN && koll.schwach) teile.push(T.KOLLAGEN_LANG_SAMMELBEGRIFF);
    }
    if (koll.abzugNaehrwerte > 0) teile.push(KOLLAGEN_TEXT_FREIGEGEBEN ? T.kollagenLangNaehrwerte(inTs(p, m), aTs) : T.KOLLAGEN_KURZ_NAEHRWERTE);
    if (KOLLAGEN_TEXT_FREIGEGEBEN) teile.push(T.KOLLAGEN_QUELLEN_ZEILE);
    gruende.push({
      id: "kollagen", art: "warn", titel: koll.abzugZutaten > 0 ? T.KOLLAGEN_TITEL_ZUTATEN : T.KOLLAGEN_TITEL_NAEHRWERTE, text: teile.join(" "),
    });
  }

  const summePunkte = Object.values(punkte).reduce((x, y) => x + y, 0);
  const summeMax = Object.values(max).reduce((x, y) => x + y, 0);
  const basis = (summePunkte / summeMax) * 100;
  const score = Math.max(0, Math.round(basis - abzug));
  let note = noteFuer(score);
  for (const c of deckel) if (schlechter(c, note)) note = c;

  const mengeOk = Number.isFinite(b.kcal);
  hinweise.push({ id: "menge", text: T.MENGEN_HINWEIS });
  if (welpe) hinweise.push({ id: "welpe", text: T.WELPEN_HINWEIS });
  if (welpe && !mengeOk) hinweise.push({ id: "endgewicht", text: "Ohne erwartetes Endgewicht kann die Tagesmenge für Welpen nicht berechnet werden. Die Bewertung läuft mit der strengeren Annahme „Endgewicht über 15 kg“." });
  hinweise.push({ id: "erk", text: T.ERKRANKUNG_HINWEIS });

  const ergebnis: ErgebnisOk = {
    status: "ok",
    feuchte: m,
    feuchteGeschaetzt,
    ts,
    nfe: e.nfe,
    nfeTs,
    ge: e.ge,
    dig: e.dig,
    de: e.de,
    meSchaetzung: e.me,
    me,
    pTs: inTs(p, m),
    fTs: inTs(f, m),
    aTs,
    faTs,
    p1000,
    f1000,
    spalte: col,
    mindest,
    rp,
    rf,
    capr,
    taurin,
    punkte,
    max,
    score,
    note,
    deckel,
    bedarf: b,
    rer: rer(tier.gewicht),
    menge: mengeOk ? (b.kcal / me) * 100 : null,
    mengeLo: mengeOk ? (b.lo / me) * 100 : null,
    mengeHi: mengeOk ? (b.hi / me) * 100 : null,
    gruende,
    hinweise,
    pf,
    energieAnteile,
    peLo,
    basis,
    kollagen: koll,
    abzug,
    mengeRisiko: null,
  };
  const auswahl = risikenFuer(ergebnis, { futter, tier });
  for (const g of ergebnis.gruende) {
    const t = auswahl[g.id as RisikoGrund];
    if (!t?.length) continue;
    g.risiken = t.map((x) => x.id);
    g.risikoStufen = t.map((x) => x.art);
    if (t.some((x) => x.art === "bad") && g.art !== "bad") g.art = "bad";
    else if (g.art === "ok" || g.art === "info") g.art = "warn";
  }
  ergebnis.mengeRisiko = mengenRisiko(ergebnis, { tier });
  return ergebnis;
}
