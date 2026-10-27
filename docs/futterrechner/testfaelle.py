"""Testfälle Futter-Rechner, Bewertung v2. Ausführen: python3 testfaelle.py (prüft per assert, druckt Details).
Die Erwartungswerte hier sind die Sollwerte für src/lib/futterrechner/testfaelle.test.ts (Vitest)."""
from rechner import bewerte, energie, bedarf
HUND20 = dict(art='hund', gewicht=20, phase='adult', alter='adult', aktiv='normal')
KATZE_W = dict(art='katze', gewicht=4.5, phase='adult', aktiv='wohnung', kastriert=True)
cases = [
 # --- v1-Fälle, Eingaben unverändert ---
 ('T1 Hund adult, Trockenfutter', dict(p=25,f=14,fa=2.5,a=7,m=10,ca=1.3,ph=0.95,typ='trocken'), HUND20),
 ('T2 Hund adult, Nassfutter, kastriert, wenig aktiv', dict(p=10.5,f=7,fa=0.5,a=2.2,m=78,ca=0.3,ph=0.22,typ='nass'), dict(art='hund',gewicht=10,phase='adult',alter='adult',aktiv='wenig',kastriert=True)),
 ('T3 Welpe 17 Wochen, 12 kg, Endgewicht 30 kg', dict(p=28,f=17,fa=2.5,a=7.5,m=10,ca=1.3,ph=1.0,typ='trocken'), dict(art='hund',gewicht=12,phase='welpe',wochen=17,endgewicht=30)),
 ('T3b gleicher Welpe mit Adult-Futter aus T1', dict(p=25,f=14,fa=2.5,a=7,m=10,ca=1.3,ph=0.95,typ='trocken'), dict(art='hund',gewicht=12,phase='welpe',wochen=17,endgewicht=30)),
 ('T4 Senior-Hund 10 J, 25 kg, kastriert, Feuchte fehlt, kein Ca/P', dict(p=22,f=10,fa=3.5,a=6,m=None,typ='trocken'), dict(art='hund',gewicht=25,phase='adult',alter='senior',aktiv='normal',kastriert=True)),
 ('T5 Katze adult, Nassfutter, kastriert, Wohnung', dict(p=11,f=5.5,fa=0.4,a=2.0,m=80,ca=0.3,ph=0.22,taurin_mgkg=1000,typ='nass'), KATZE_W),
 ('T6 Kitten 5 Monate, 2,5 kg, Trockenfutter', dict(p=34,f=20,fa=2,a=7.5,m=8,ca=1.2,ph=1.0,taurin_mgkg=2000,typ='trocken'), dict(art='katze',gewicht=2.5,phase='kitten',monate=5,aktiv='normal')),
 ('T7 Mangelhaft: Hund adult, Trockenfutter, wenig aktiv', dict(p=15,f=4.5,fa=4,a=9.5,m=10,ca=2.4,ph=0.8,typ='trocken'), dict(art='hund',gewicht=15,phase='adult',alter='adult',aktiv='wenig')),
 # --- neu in v2 ---
 ('T9 Fettreiches Nassfutter Hund (P:F 1,1, 64 % Energie aus Fett), FEDIAF erfüllt', dict(p=10,f=9,fa=0.5,a=2.3,m=76,ca=0.35,ph=0.25,typ='nass'), HUND20),
 ('T10 Proteinreiches Trockenfutter Hund (45 % RP) – kein Protein-Deckel', dict(p=45,f=15,fa=2.5,a=8,m=8,ca=1.6,ph=1.1,typ='trocken'), HUND20),
 ('T11 Kollagen Stufe 1: Katze nass, Asche 13,9 % TS, ohne Zutaten', dict(p=11.5,f=2.4,fa=0.3,a=2.5,m=82,ca=0.42,ph=0.3,taurin_mgkg=500,typ='nass'), KATZE_W),
 ('T12 wie T11, Feld Zutaten mit Sammelbegriff an Pos. 1', dict(p=11.5,f=2.4,fa=0.3,a=2.5,m=82,ca=0.42,ph=0.3,taurin_mgkg=500,typ='nass',
      zutaten='Fleisch und tierische Nebenerzeugnisse (davon 4 % Huhn), pflanzliche Eiweißextrakte, Fisch und Fischnebenerzeugnisse, Mineralstoffe, Zucker'), KATZE_W),
 ('T13 Kollagen Stufe 2 stark: Hund nass, Luftröhre + Knorpel in den ersten 5', dict(p=10.5,f=5.5,fa=0.5,a=2.0,m=78,typ='nass',
      zutaten='Kaninchen 40 % (Fleisch, Herz, Luftröhre), Rinderknorpel, Karotte, Kartoffel, Leinöl, Mineralstoffe'), HUND20),
 ('T14 Kollagen-Begriff erst an Position 6 -> kein Abzug; Komma in Klammer zählt nicht', dict(p=10.5,f=5.5,fa=0.5,a=2.0,m=78,typ='nass',
      zutaten='Huhn 60 % (Brust, Herz, Leber), Reis, Karotte, Erbsen, Leinöl, Gelatine'), HUND20),
 ('T16 Hydrolysierte Hühnerleber / Hefehydrolysat -> kein Treffer', dict(p=26,f=14,fa=2.5,a=7,m=10,ca=1.3,ph=0.95,typ='trocken',
      zutaten='Huhn getrocknet 30 %, Reis, hydrolysierte Hühnerleber 4 %, Hefehydrolysat, Hühnerfett'), HUND20),
 ('T17 Feld nur Leerzeichen -> wie ohne Feld', dict(p=26,f=14,fa=2.5,a=7,m=10,ca=1.3,ph=0.95,typ='trocken', zutaten='   '), HUND20),
 ('T15 Ca hoch + Asche hoch: Hund trocken, Asche 12 % TS, Ca 2,3 % TS', dict(p=26,f=12,fa=2.5,a=10.8,m=10,ca=2.07,ph=1.25,typ='trocken'), HUND20),
]
# Sollwerte: Fall -> (punkte, score, note, abzug_naehrwerte, abzug_zutaten, zutaten_geprueft)
SOLL = {
 'T1':  ({'pf':14.5,'pe':12.3,'pmin':10,'fmin':5,'nfe':2.2,'capr':20,'plaus':10}, 74, 'befriedigend', 0, 0, False),
 'T2':  ({'pf':9.2,'pe':15.0,'pmin':10,'fmin':5,'nfe':5.0,'capr':20,'plaus':10}, 74, 'befriedigend', 0, 0, False),
 'T3':  ({'pf':11.9,'pe':13.1,'pmin':10,'fmin':5,'nfe':4.0,'capr':20,'plaus':10}, 74, 'befriedigend', 0, 0, False),
 'T3b': ({'pf':14.5,'pe':11.9,'pmin':10,'fmin':5,'nfe':2.2,'capr':20,'plaus':10}, 74, 'befriedigend', 0, 0, False),
 'T4':  ({'pf':22.1,'pe':10.7,'pmin':10,'fmin':5,'nfe':0.3,'plaus':8}, 70, 'befriedigend', 0, 0, False),
 'T5':  ({'pf':20.0,'pe':12.1,'pmin':10,'fmin':5,'nfe':10.0,'capr':20,'taurin':10,'plaus':10}, 84, 'gut', 0, 0, False),
 'T6':  ({'pf':14.0,'pe':9.2,'pmin':10,'fmin':5,'nfe':3.6,'capr':20,'taurin':10,'plaus':10}, 71, 'befriedigend', 0, 0, False),
 'T7':  ({'pf':35.0,'pe':0.0,'pmin':5.0,'fmin':5,'nfe':0.0,'capr':0,'plaus':10}, 55, 'mangelhaft', 0, 0, False),
 'T9':  ({'pf':2.0,'pe':14.7,'pmin':10,'fmin':5,'nfe':5.0,'capr':20,'plaus':10}, 67, 'ausreichend', 0, 0, False),
 'T10': ({'pf':35.0,'pe':15.0,'pmin':10,'fmin':5,'nfe':5.0,'capr':20,'plaus':10}, 100, 'sehr gut', 0, 0, False),
 'T11': ({'pf':35.0,'pe':15.0,'pmin':10,'fmin':5,'nfe':10.0,'capr':20,'taurin':10,'plaus':7}, 89, 'gut', 8, 0, False),
 'T12': ({'pf':35.0,'pe':15.0,'pmin':10,'fmin':5,'nfe':10.0,'capr':20,'taurin':10,'plaus':7}, 87, 'gut', 8, 2, True),
 'T13': ({'pf':16.7,'pe':15.0,'pmin':10,'fmin':5,'nfe':5.0,'plaus':10}, 71, 'befriedigend', 0, 6, True),
 'T14': ({'pf':16.7,'pe':15.0,'pmin':10,'fmin':5,'nfe':5.0,'plaus':10}, 77, 'befriedigend', 0, 0, True),
 'T16': ({'pf':15.8,'pe':12.8,'pmin':10,'fmin':5,'nfe':2.5,'capr':20,'plaus':10}, 76, 'befriedigend', 0, 0, True),
 'T17': ({'pf':15.8,'pe':12.8,'pmin':10,'fmin':5,'nfe':2.5,'capr':20,'plaus':10}, 76, 'befriedigend', 0, 0, False),
 'T15': ({'pf':21.5,'pe':13.8,'pmin':10,'fmin':5,'nfe':3.0,'capr':20,'plaus':7}, 75, 'befriedigend', 5, 0, False),
}
res = {}
for name, f, t in cases:
    r = bewerte(f, t); res[name.split()[0]] = r
    print('\n==', name)
    if r['status'] != 'ok': print(' ', r); continue
    ea = r['energie_anteile']
    print(f"  P:F {r['pf']:.3f} | Energie P/F/KH {ea['p']:.2f}/{ea['f']:.2f}/{ea['c']:.2f} % | pe_lo {r['pe_lo']:.2f} | NfE TS {r['nfe_dm']:.2f} | Asche TS {r['a_dm']:.2f}")
    print(f"  ME {r['me']:.2f} kcal/100 g | p1000 {r['p1000']:.2f} f1000 {r['f1000']:.2f} | Spalte {r['col']} rp {r['rp']:.3f} rf {r['rf']:.3f}")
    print(f"  punkte {r['pts']}  max {r['maxp']}")
    print(f"  basis {r['basis']:.2f} | kollagen {r['kollagen']} | score {r['score']} | note {r['note']} | deckel {r['caps']}")
fehler = []
for k, (pts, score, note, a1, a2, geprueft) in SOLL.items():
    r = res[k]; ist = (r['pts'], r['score'], r['note'], r['kollagen']['abzug_naehrwerte'], r['kollagen']['abzug_zutaten'], r['kollagen']['zutaten_geprueft'])
    if ist != (pts, score, note, a1, a2, geprueft): fehler.append((k, ist))
assert not fehler, fehler
print('\nAlle', len(SOLL), 'Sollwerte erfüllt.')
e = energie('katze', 30, 12, 2, 7, 18); b = bedarf(KATZE_W)
print('\n== T8 Snack Katze (unverändert)', {k: round(v, 2) for k, v in e.items()}, 'MER', round(b['kcal'], 1))
