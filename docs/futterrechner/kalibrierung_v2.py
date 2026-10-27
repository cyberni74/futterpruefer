"""Kalibrierung Scoring v2 an realen Futtern (Futterprüfer-Testdaten Review.json, nur lesend, keine DB).
Aufruf: python3 kalibrierung_v2.py [Pfad zu Review.json] [-v]   (rechner.py und rechner_v1.py im selben Ordner)"""
import json
import sys
SRC=next((x for x in sys.argv[1:] if not x.startswith('-')), None) or '/workspace/futterpruefer/bestes-hundefutter-2026-10/data/Review.json'
CAT={'cmuz23zll':'hund','cmuz23zoi':'katze'}
def g(a,names):
    for x in a:
        if x['name'].lower() in names:
            try: return float(str(x['value']).replace(',','.'))
            except: return None
def laden():
    out=[]
    for r in json.load(open(SRC)):
        sp=CAT.get(r['categoryId'][:9])
        if not sp or r['status']!='PUBLISHED' or not r['analysis']: continue
        a=r['analysis']
        P=g(a,['rohprotein','protein']); F=g(a,['rohfett','fettgehalt','fett']); Fa=g(a,['rohfaser']); A=g(a,['rohasche','asche'])
        M=g(a,['feuchtigkeit','feuchte','feuchtegehalt']); ca=g(a,['calcium']); ph=g(a,['phosphor'])
        tau=g(a,['taurin'])
        if None in (P,F,Fa,A): continue
        typ='nass' if (M or 0)>20 else 'trocken'
        out.append(dict(slug=r['slug'],art=sp,typ=typ,preis=r['priceClass'],test=r['totalScore'],
            futter=dict(p=P,f=F,fa=Fa,a=A,m=M,ca=ca,ph=ph,typ=typ,taurin_mgkg=(tau*10000 if tau is not None else None))))
    return out
HUND=dict(art='hund',gewicht=20,phase='adult',alter='adult',aktiv='normal')
KATZE=dict(art='katze',gewicht=4.5,phase='adult',aktiv='wohnung',kastriert=True)
KATZE_FREI=dict(art='katze',gewicht=4.5,phase='adult',aktiv='freigang')
from collections import Counter
import rechner_v1 as v1, rechner as v2
COMP={r['slug']:(r.get('composition') or '') for r in json.load(open(SRC))}
def band(s): return 'grün ≥80' if s>=80 else ('gelb 70–79' if s>=70 else ('orange 60–69' if s>=60 else 'rot <60'))
def ampel(s): return 'grün' if s>=80 else ('gelb' if s>=60 else 'rot')
rows=laden()
# Konfigurationen nach Rechtsprüfung 27.10.2026 (A1, A5). Jeweils ohne und mit Zutatenfeld.
KONFIG = [('Standard (Abzug aus, Boden aus)', dict()),
          ('A5 an, Boden aus', dict(abzug_aktiv=True)),
          ('A5 an, Boden an', dict(abzug_aktiv=True, untergrenze=True)),
          ('Abzug aus, Boden an', dict(untergrenze=True))]
def lauf(cfg):
    out=[]
    for r in rows:
        t=HUND if r['art']=='hund' else KATZE
        a=v1.bewerte(r['futter'],t)
        fz=dict(r['futter']); b0=v2.bewerte(fz,t,**cfg)                     # v2 nur Nährwerte
        fz2=dict(fz, zutaten=COMP[r['slug']]); b1=v2.bewerte(fz2,t,**cfg)   # v2 + Zutatenfeld
        out.append((r,a,b0,b1))
    return out
def vert(sc, notes):
    c=Counter(band(s) for s in sc); n=len(sc)
    return (f"n {n} Ø {sum(sc)/n:.1f} min {min(sc)} max {max(sc)} | "
            + ' | '.join(f"{k}: {c.get(k,0)} ({c.get(k,0)/n*100:.0f} %)" for k in ['grün ≥80','gelb 70–79','orange 60–69','rot <60'])
            + ' | Noten ' + ', '.join(f"{k} {v}" for k,v in sorted(Counter(notes).items())))
out = lauf({})
if __name__=='__main__':
    print('v1                                  ', vert([o[1]['score'] for o in out], [o[1]['note'] for o in out]))
    for lab,cfg in KONFIG:
        o2=lauf(cfg)
        print(f"{lab:32} Nährwerte ", vert([o[2]['score'] for o in o2], [o[2]['note'] for o in o2]))
        print(f"{lab:32} + Zutaten ", vert([o[3]['score'] for o in o2], [o[3]['note'] for o in o2]),
              '| Boden gegriffen:', sum(o[3]['untergrenze_gegriffen'] for o in o2), '| K-Hinweis:', sum(o[3]['kollagen']['flag'] for o in o2))
    if '-v' in sys.argv:
        o2=lauf(dict(abzug_aktiv=True, untergrenze=True))
        for r,a,b0,b1 in sorted(o2,key=lambda o:-o[2]['score']):
            print(f"{r['art']:5} {r['typ']:7} {r['preis'][:4]} v1 {a['score']:3} → v2 {b0['basis']:5.1f}-{b0['abzug']} = {b0['score']:3} {b0['note']:12} | +Zut -{b1['kollagen']['abzug_zutaten']} = {b1['score']:3} {b1['note']:12} Boden {b1['untergrenze_gegriffen']} PF {b0['pf']:.2f} PE {b0['energie_anteile']['p']:.0f}% {b1['kollagen']['treffer']} {r['slug'][:32]}")
