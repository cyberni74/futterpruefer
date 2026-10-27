"""Kalibrierung Scoring v2 an realen Futtern (Futterprüfer-Testdaten Review.json, nur lesend, keine DB).
Aufruf: python3 kalibrierung_v2.py [Pfad zu Review.json]   (rechner.py und rechner_v1.py im selben Ordner)"""
import json
import sys
SRC=sys.argv[1] if len(sys.argv)>1 else '/workspace/futterpruefer/bestes-hundefutter-2026-10/data/Review.json'
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
rows=laden(); out=[]
for r in rows:
    t=HUND if r['art']=='hund' else KATZE
    a=v1.bewerte(r['futter'],t)
    fz=dict(r['futter']); b0=v2.bewerte(fz,t)            # v2 nur Nährwerte
    fz2=dict(fz, zutaten=COMP[r['slug']]); b1=v2.bewerte(fz2,t)  # v2 + Zutatenfeld
    out.append((r,a,b0,b1))
if __name__=='__main__':
    for key,lab in [(1,'v1'),(2,'v2 Nährwerte'),(3,'v2 + Zutaten')]:
        sc=[o[key]['score'] for o in out]
        c=Counter(band(s) for s in sc); n=len(sc)
        print(lab, 'n',n,'Ø',round(sum(sc)/n,1),'min',min(sc),'max',max(sc),'≥90:',sum(s>=90 for s in sc), {k:f"{v} ({v/n*100:.0f} %)" for k,v in sorted(c.items())}, 'Noten',Counter(o[key]['note'] for o in out))
    for r,a,b0,b1 in sorted(out,key=lambda o:-o[2]['score']):
        print(f"{r['art']:5} {r['typ']:7} {r['preis'][:4]} v1 {a['score']:3} → v2 {b0['basis']:5.1f}-{b0['abzug']} = {b0['score']:3} {b0['note']:12} | +Zut -{b1['kollagen']['abzug_zutaten']} = {b1['score']:3} {b1['note']:12} PF {b0['pf']:.2f} PE {b0['energie_anteile']['p']:.0f}% {b0['pts']} {b1['kollagen']['treffer']} {r['slug'][:32]}")
