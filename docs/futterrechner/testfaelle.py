"""Testfälle Futter-Rechner, Bewertung v2. Ausführen: python3 testfaelle.py (prüft per assert, druckt Details).
Die Erwartungswerte hier sind die Sollwerte für src/lib/futterrechner/testfaelle.test.ts (Vitest)."""
import rechner
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
 # --- neu nach Rechtsprüfung 27.10.2026 (A1 Untergrenze) ---
 ('T18 T9-Variante trocken: P:F 1,0, alle FEDIAF-Minima erfüllt, Basis unter 60', dict(p=22,f=22,fa=3,a=7,m=10,ca=1.2,ph=0.9,typ='trocken'), HUND20),
 ('T19 wie T18, Ca 2,9 % TS über Maximum -> Ca-Deckel, Untergrenze greift nicht', dict(p=22,f=22,fa=3,a=7,m=10,ca=2.6,ph=1.6,typ='trocken'), HUND20),
 ('T20 Katze nass fettreich, Taurin unter Minimum -> Untergrenze greift nicht', dict(p=14,f=12,fa=0.3,a=2,m=72,ca=0.35,ph=0.28,taurin_mgkg=300,typ='nass'), KATZE_W),
 ('T21 wie T18 + starke Kollagen-Begriffe -> Untergrenze nach dem Abzug', dict(p=22,f=22,fa=3,a=7,m=10,ca=1.2,ph=0.9,typ='trocken',
      zutaten='Geflügel, Rinderknorpel, Mais, Gelatine, Hühnerfett'), HUND20),
]
# Sollwerte je Konfiguration. Fall -> (punkte, score, note, abzug_naehrwerte, abzug_zutaten, zutaten_geprueft, hinweis, untergrenze_gegriffen)
# „hinweis“ = kollagen.flag (K1/K2/K2-Zusatz wird angezeigt), auch wenn kein Punktabzug greift.
# Konfigurationen:
#   STANDARD   = Auslieferungszustand: KOLLAGEN_ABZUG_AKTIV=False, UNTERGRENZE_FEDIAF_KONFORM=False
#   A5         = Kollagen-Abzug nach A5 an (Stufe 1 = 0 Punkte, Sammelbegriffe 0, starke Begriffe 4/+2, max 6), Untergrenze aus
#   A5_BODEN   = wie A5, zusätzlich Untergrenze 60 (A1) an
#   A5_S1_3    = wie A5, Stufe-1-Abzug auf das erlaubte Maximum 3 (nur falls Manni das will)
P = dict(
 T1={'pf':14.5,'pe':12.3,'pmin':10,'fmin':5,'nfe':2.2,'capr':20,'plaus':10},
 T2={'pf':9.2,'pe':15.0,'pmin':10,'fmin':5,'nfe':5.0,'capr':20,'plaus':10},
 T3={'pf':11.9,'pe':13.1,'pmin':10,'fmin':5,'nfe':4.0,'capr':20,'plaus':10},
 T3b={'pf':14.5,'pe':11.9,'pmin':10,'fmin':5,'nfe':2.2,'capr':20,'plaus':10},
 T4={'pf':22.1,'pe':10.7,'pmin':10,'fmin':5,'nfe':0.3,'plaus':8},
 T5={'pf':20.0,'pe':12.1,'pmin':10,'fmin':5,'nfe':10.0,'capr':20,'taurin':10,'plaus':10},
 T6={'pf':14.0,'pe':9.2,'pmin':10,'fmin':5,'nfe':3.6,'capr':20,'taurin':10,'plaus':10},
 T7={'pf':35.0,'pe':0.0,'pmin':5.0,'fmin':5,'nfe':0.0,'capr':0,'plaus':10},
 T9={'pf':2.0,'pe':14.7,'pmin':10,'fmin':5,'nfe':5.0,'capr':20,'plaus':10},
 T10={'pf':35.0,'pe':15.0,'pmin':10,'fmin':5,'nfe':5.0,'capr':20,'plaus':10},
 T11={'pf':35.0,'pe':15.0,'pmin':10,'fmin':5,'nfe':10.0,'capr':20,'taurin':10,'plaus':7},
 T13={'pf':16.7,'pe':15.0,'pmin':10,'fmin':5,'nfe':5.0,'plaus':10},
 T16={'pf':15.8,'pe':12.8,'pmin':10,'fmin':5,'nfe':2.5,'capr':20,'plaus':10},
 T15={'pf':21.5,'pe':13.8,'pmin':10,'fmin':5,'nfe':3.0,'capr':20,'plaus':7},
 T18={'pf':0.0,'pe':9.6,'pmin':10,'fmin':5,'nfe':3.8,'capr':20,'plaus':10},
 T19={'pf':0.0,'pe':9.6,'pmin':10,'fmin':5,'nfe':3.8,'capr':0,'plaus':10},
 T20={'pf':3.3,'pe':8.6,'pmin':10,'fmin':5,'nfe':10.0,'capr':20,'taurin':0,'plaus':10},
)
P['T12']=P['T11']; P['T14']=P['T13']; P['T17']=P['T16']; P['T21']=P['T18']
SOLL_A5 = {
 'T1': (74,'befriedigend',0,0,False,False,False), 'T2': (74,'befriedigend',0,0,False,False,False),
 'T3': (74,'befriedigend',0,0,False,False,False), 'T3b':(74,'befriedigend',0,0,False,False,False),
 'T4': (70,'befriedigend',0,0,False,False,False), 'T5': (84,'gut',0,0,False,False,False),
 'T6': (71,'befriedigend',0,0,False,False,False), 'T7': (55,'mangelhaft',0,0,False,False,False),
 'T9': (67,'ausreichend',0,0,False,False,False),  'T10':(100,'sehr gut',0,0,False,False,False),
 'T11':(97,'sehr gut',0,0,False,True,False),      # A5(a): Stufe 1 nur Hinweis K1, kein Abzug (vorher 89 gut, -8)
 'T12':(97,'sehr gut',0,0,True,True,False),       # A5(b): Sammelbegriff nur K2-Zusatz, kein Abzug (vorher 87 gut, 8/2)
 'T13':(71,'befriedigend',0,6,True,True,False),   # A5(c): starke Begriffe Luftröhre + Knorpel, Abzug bleibt
 'T14':(77,'befriedigend',0,0,True,False,False),
 'T16':(76,'befriedigend',0,0,True,False,False),  'T17':(76,'befriedigend',0,0,False,False,False),
 'T15':(80,'gut',0,0,False,True,False),           # A5(a): kein Abzug, auch kein Ca-Zusatzabzug (vorher 75 befriedigend, -5)
 'T18':(58,'mangelhaft',0,0,False,False,False),   # Untergrenze aus: FEDIAF-konform, aber 58
 'T19':(38,'mangelhaft',0,0,False,False,False),
 'T20':(58,'mangelhaft',0,0,False,False,False),
 'T21':(52,'mangelhaft',0,6,True,True,False),
}
def ab(d, **ch):
    o = dict(d)
    for k, v in ch.items(): o[k] = v
    return o
SOLL = {
 'STANDARD': ab(SOLL_A5, T13=(77,'befriedigend',0,0,True,True,False), T21=(58,'mangelhaft',0,0,True,True,False)),
 'A5':       SOLL_A5,
 'A5_BODEN': ab(SOLL_A5, T18=(60,'ausreichend',0,0,False,False,True),   # A1: Boden 60
                         T21=(60,'ausreichend',0,6,True,True,True)),    # A1(d): Boden nach dem Kollagen-Abzug
                         # T19 (Ca-Deckel) und T20 (Taurin unter Minimum) bleiben 38 bzw. 58: Boden greift nicht
 'A5_S1_3':  ab(SOLL_A5, T11=(94,'sehr gut',3,0,False,True,False), T12=(94,'sehr gut',3,0,True,True,False),
                         T15=(78,'befriedigend',2,0,False,True,False)),
}
KONFIG = {'STANDARD': dict(), 'A5': dict(abzug_aktiv=True), 'A5_BODEN': dict(abzug_aktiv=True, untergrenze=True),
          'A5_S1_3': dict(abzug_aktiv=True, stufe1_max=3)}
assert rechner.KOLLAGEN_ABZUG_AKTIV is False and rechner.UNTERGRENZE_FEDIAF_KONFORM is False and rechner.KOLL_STUFE1_MAX == 0, \
    'Auslieferungszustand: Kollagen-Abzug AUS, Untergrenze AUS, Stufe-1-Abzug 0'
fehler = []; anzahl = 0
for kname, cfg in KONFIG.items():
    print('\n######## Konfiguration', kname, cfg)
    for name, f, t in cases:
        r = bewerte(f, t, **cfg); key = name.split()[0]
        if kname == 'STANDARD':
            print('\n==', name)
            ea = r['energie_anteile']
            print(f"  P:F {r['pf']:.3f} | Energie P/F/KH {ea['p']:.2f}/{ea['f']:.2f}/{ea['c']:.2f} % | pe_lo {r['pe_lo']:.2f} | NfE TS {r['nfe_dm']:.2f} | Asche TS {r['a_dm']:.2f}")
            print(f"  ME {r['me']:.2f} kcal/100 g | p1000 {r['p1000']:.2f} f1000 {r['f1000']:.2f} | Spalte {r['col']} rp {r['rp']:.3f} rf {r['rf']:.3f}")
            print(f"  punkte {r['pts']}  max {r['maxp']}")
        k = r['kollagen']
        print(f"  {kname:8} {key:4} basis {r['basis']:6.2f} | abzug {k['abzug_naehrwerte']}/{k['abzug_zutaten']} | hinweis {k['flag']} | fediaf_konform {r['fediaf_konform']} | boden {r['untergrenze_gegriffen']} | score {r['score']} {r['note']}")
        ist = (r['pts'], r['score'], r['note'], k['abzug_naehrwerte'], k['abzug_zutaten'], k['zutaten_geprueft'], k['flag'], r['untergrenze_gegriffen'])
        soll = (P[key],) + SOLL[kname][key]
        anzahl += 1
        if ist != soll: fehler.append((kname, key, ist, soll))
assert not fehler, fehler
# A5(a): mehr als 3 Punkte Stufe-1-Abzug ist ausgeschlossen
try:
    bewerte(cases[0][1], cases[0][2], abzug_aktiv=True, stufe1_max=4); raise SystemExit('Stufe-1-Abzug > 3 hätte abgelehnt werden müssen')
except AssertionError: pass
print('\nAlle', anzahl, 'Sollwerte erfüllt (', len(cases), 'Fälle ×', len(KONFIG), 'Konfigurationen).')
e = energie('katze', 30, 12, 2, 7, 18); b = bedarf(KATZE_W)
print('\n== T8 Snack Katze (unverändert)', {k: round(v, 2) for k, v in e.items()}, 'MER', round(b['kcal'], 1))
