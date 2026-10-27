import { z } from "zod";
import { ALTER_MAX, startState, type FormState, type FutterartWahl, type Num, type Werte } from "./state";
import type { Art } from "./types";

/**
 * Teilen-Link: Werte im #-Fragment (wird nicht an den Server übertragen). Nur Zahlen und Enums, Version v=1.
 * Beispiel: #v=1&t=hund&ft=trocken&p=25&f=14&fa=2.5&a=7&m=10&kg=20&al=60&ak=normal
 */
const num = (min: number, max: number) => z.coerce.number().finite().min(min).max(max);

const SCHEMA = z.object({
  v: z.literal("1"),
  t: z.enum(["hund", "katze"]),
  ft: z.enum(["trocken", "nass", "snack"]).optional(),
  ty: z.enum(["alleinfutter", "ergaenzung"]).optional(),
});

const WERT_FELDER = {
  p: [0, 100], f: [0, 100], fa: [0, 100], a: [0, 100], m: [0, 100], ca: [0, 100], ph: [0, 100],
  tau: [0, 20000], me: [0, 100000], sg: [0, 1000],
} as const;

type WertKey = keyof typeof WERT_FELDER;
const MAP: Record<WertKey, keyof Werte> = { p: "p", f: "f", fa: "fa", a: "a", m: "m", ca: "ca", ph: "ph", tau: "taurin", me: "me", sg: "stueck" };

const fmt = (x: number) => String(Math.round(x * 1000) / 1000);

export function encodeHash(s: FormState): string {
  const q = new URLSearchParams();
  q.set("v", "1");
  q.set("t", s.art);
  q.set("ft", s.futterart);
  q.set("ty", s.typ);
  const w = s.werte[s.futterart];
  (Object.keys(MAP) as WertKey[]).forEach((k) => {
    const v = w[MAP[k]] as Num;
    if (v != null) q.set(k, fmt(v));
  });
  if (w.me != null) q.set("meu", w.meEinheit);
  if (s.gewicht != null) q.set("kg", fmt(s.gewicht));
  if (s.alterPos != null) q.set("al", String(s.alterPos));
  if (s.endgewicht != null) q.set("ew", fmt(s.endgewicht));
  if (s.art === "hund" && s.hundAktiv) q.set("ak", s.hundAktiv);
  if (s.art === "katze" && s.katzeAktiv) q.set("ak", s.katzeAktiv);
  if (s.kastriert != null) q.set("ka", s.kastriert ? "1" : "0");
  return q.toString();
}

/** Liest ein Fragment. Ungültige Werte werden verworfen (nie Fehler); unbekannte Version → null. */
export function decodeHash(hash: string, artVorgabe?: Art): FormState | null {
  const raw = Object.fromEntries(new URLSearchParams(hash.replace(/^#/, "")));
  // Deep-Link der Startseite: #typ=trocken|nass ohne Version
  if (raw.v === undefined) {
    if (raw.typ === "trocken" || raw.typ === "nass") return startState(artVorgabe ?? "hund", raw.typ);
    return null;
  }
  const kopf = SCHEMA.safeParse(raw);
  if (!kopf.success) return null;
  const art = kopf.data.t;
  const futterart: FutterartWahl = kopf.data.ft ?? "trocken";
  const s = startState(art, futterart);
  s.typ = kopf.data.ty ?? s.typ;
  const w = s.werte[futterart];
  (Object.keys(WERT_FELDER) as WertKey[]).forEach((k) => {
    if (raw[k] === undefined) return;
    const [min, max] = WERT_FELDER[k];
    const p = num(min, max).safeParse(raw[k]);
    if (p.success) (w[MAP[k]] as Num) = p.data;
  });
  if (raw.meu === "kcal100g" || raw.meu === "kcalkg" || raw.meu === "mjkg") w.meEinheit = raw.meu;
  const kg = num(0.3, 100).safeParse(raw.kg);
  if (raw.kg !== undefined && kg.success) s.gewicht = kg.data;
  const al = z.coerce.number().int().min(0).max(ALTER_MAX[art]).safeParse(raw.al);
  if (raw.al !== undefined && al.success) s.alterPos = al.data;
  const ew = num(0.3, 100).safeParse(raw.ew);
  if (raw.ew !== undefined && ew.success) s.endgewicht = ew.data;
  if (art === "hund" && ["wenig", "normal", "sportlich", "arbeit"].includes(raw.ak ?? "")) s.hundAktiv = raw.ak as FormState["hundAktiv"];
  if (art === "katze" && ["wohnung", "freigang"].includes(raw.ak ?? "")) s.katzeAktiv = raw.ak as FormState["katzeAktiv"];
  if (raw.ka === "1" || raw.ka === "0") s.kastriert = raw.ka === "1";
  return s;
}
