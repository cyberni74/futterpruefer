import type { Eingabe } from "./index";
import type { Ergebnis, ErgebnisOk, Grund, Hinweis, Note } from "./types";
import { FASER_GRENZE_HUND, LECKERLI_ANTEIL, MINDEST, NOTEN_REIHE, NOTEN_SCHWELLEN } from "./fediaf";
import { inTs, meNrc2006 } from "./energie";
import { bedarf, rer, spalte as waehleSpalte } from "./bedarf";
import { ascheImBand, caPCheck, proTausendKcal, stufe, taurinCheck } from "./naehrstoffe";
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

  punkte.protein = stufe(rp, [[1.3, 35], [1.1, 30], [1.0, 22], [0.9, 10]]);
  max.protein = 35;
  punkte.fett = stufe(rf, [[1.2, 20], [1.0, 14], [0.9, 6]]);
  max.fett = 20;
  if (rp < 0.9 || rf < 0.9) deckel.push("mangelhaft");
  else if (rp < 1 || rf < 1) deckel.push("ausreichend");

  gruende.push({ id: "protein", art: rp >= 1 ? "ok" : rp >= 0.9 ? "warn" : "bad", titel: "Rohprotein", text: T.proteinGrund(p1000, mindest.p, rp, col), verhaeltnis: rp });
  const wechsel = T.spaltenWechsel(col, mindest.p);
  if (wechsel) gruende.push({ id: "spalte", art: "info", titel: "Warum dieser Mindestwert?", text: wechsel });
  gruende.push({ id: "fett", art: rf >= 1 ? "ok" : rf >= 0.9 ? "warn" : "bad", titel: "Rohfett", text: T.fettGrund(f1000, mindest.f, rf), verhaeltnis: rf });

  // Calcium / Phosphor
  const ca = futter.ca ?? null;
  const ph = futter.ph ?? null;
  let capr: ErgebnisOk["capr"] = null;
  if (ca != null && ph != null && ph > 0) {
    const c = caPCheck(tier.art, col, ca, ph, m, tier.art === "hund" && tier.phase === "welpe" ? tier.endgewicht : null, tier.art === "hund" && tier.phase === "welpe" ? tier.wochen : undefined);
    punkte.capr = c.okRatio && c.okCa && c.okP ? 20 : c.nah && c.okCa ? 10 : 0;
    max.capr = 20;
    if (punkte.capr === 0 && welpe) deckel.push("ausreichend");
    if (c.caUeber) deckel.push(welpe ? "mangelhaft" : "ausreichend");
    capr = { ratio: c.ratio, caTs: c.caTs, pTs: c.pTs, regel: c.regel };
    gruende.push(
      c.caUeber
        ? { id: "ca", art: "bad", titel: "Calcium", text: welpe ? T.caZuHoch : T.caZuHochAdult }
        : punkte.capr === 20
          ? { id: "ca", art: "ok", titel: "Calcium und Phosphor", text: T.caPPasst(c.ratio, c.regel.rMin, c.regel.rMax) }
          : { id: "ca", art: punkte.capr === 10 ? "warn" : "bad", titel: "Calcium und Phosphor", text: T.caPDaneben(c.ratio, c.regel.rMax, T.zielgruppe(col)) },
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
  let plaus = 15;
  if (feuchteGeschaetzt) plaus -= 5;
  if (!ascheImBand(aTs)) plaus -= 5;
  if (tier.art === "hund" && faTs > FASER_GRENZE_HUND) plaus -= 5;
  punkte.plaus = Math.max(plaus, 0);
  max.plaus = 15;
  if (feuchteGeschaetzt) gruende.push({ id: "feuchte", art: "warn", titel: "Feuchte geschätzt", text: T.feuchteGeschaetzt });
  gruende.push(
    ascheImBand(aTs)
      ? { id: "asche", art: "ok", titel: "Rohasche", text: T.ascheOk(aTs) }
      : { id: "asche", art: "warn", titel: "Rohasche", text: T.ascheAuffaellig(aTs) },
  );
  const nfeTs = inTs(Math.max(e.nfe, 0), m);
  gruende.push({ id: "nfe", art: "info", titel: "NfE", text: T.nfeInfo(nfeTs) });

  const summePunkte = Object.values(punkte).reduce((x, y) => x + y, 0);
  const summeMax = Object.values(max).reduce((x, y) => x + y, 0);
  const score = Math.round((summePunkte / summeMax) * 100);
  let note = noteFuer(score);
  for (const c of deckel) if (schlechter(c, note)) note = c;

  const mengeOk = Number.isFinite(b.kcal);
  hinweise.push({ id: "menge", text: T.MENGEN_HINWEIS });
  if (welpe) hinweise.push({ id: "welpe", text: T.WELPEN_HINWEIS });
  if (welpe && !mengeOk) hinweise.push({ id: "endgewicht", text: "Ohne erwartetes Endgewicht kann die Tagesmenge für Welpen nicht berechnet werden. Die Bewertung läuft mit der strengeren Annahme „Endgewicht über 15 kg“." });
  hinweise.push({ id: "erk", text: T.ERKRANKUNG_HINWEIS });

  return {
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
  };
}
