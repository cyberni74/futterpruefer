"""Referenzimplementierung Futter-Rechner, Bewertung v2 (Scoring v2, 27.10.2026).
Python-Spiegel des TS-Moduls src/lib/futterrechner. Energie/Bedarf/Spalten unverändert gegenüber v1;
geändert ist nur die Punktevergabe in bewerte() (siehe docs/futterrechner/scoring-v2.md).
"""
import math, re
# ---------------- unverändert aus v1 ----------------
# FEDIAF 2025 Tab. III-3b / III-4b: Mindestwerte je 1000 kcal ME
MIN = {
 'hund': {'adult110': dict(p=45.0,f=13.75), 'adult95': dict(p=52.1,f=13.75),
          'wachstum_frueh': dict(p=62.5,f=21.25), 'wachstum_spaet': dict(p=50.0,f=21.25)},
 'katze': {'adult100': dict(p=62.5,f=22.5), 'adult75': dict(p=83.3,f=22.5), 'wachstum': dict(p=70.0,f=22.5)},
}
def ca_rules(sp, col, endgewicht=None):
    if sp=='hund':
        if col=='adult110': return dict(ca_min=0.50, ca_max=2.50, p_min=0.40, p_max=1.60, r_min=1.0, r_max=2.0)
        if col=='adult95':  return dict(ca_min=0.58, ca_max=2.50, p_min=0.46, p_max=1.60, r_min=1.0, r_max=2.0)
        if col=='wachstum_frueh': return dict(ca_min=1.00, ca_max=1.60, p_min=0.90, p_max=None, r_min=1.0, r_max=1.6)
        if endgewicht is not None and endgewicht<=15: return dict(ca_min=0.80, ca_max=1.80, p_min=0.70, p_max=None, r_min=1.0, r_max=1.8)
        return dict(ca_min=1.00, ca_max=1.80, p_min=0.70, p_max=None, r_min=1.0, r_max=1.6)
    if col=='adult100': return dict(ca_min=0.40, ca_max=None, p_min=0.26, p_max=None, r_min=1.0, r_max=2.0)
    if col=='adult75':  return dict(ca_min=0.53, ca_max=None, p_min=0.35, p_max=None, r_min=1.0, r_max=2.0)
    return dict(ca_min=1.00, ca_max=None, p_min=0.84, p_max=None, r_min=1.0, r_max=1.5)
TAURIN_MIN = {('adult100','nass'):0.20,('adult75','nass'):0.27,('wachstum','nass'):0.25,
              ('adult100','trocken'):0.10,('adult75','trocken'):0.13,('wachstum','trocken'):0.10}

def energie(sp, P,F,Fa,A,M):
    nfe = 100-(P+F+Fa+A+M)
    nfe_c = max(nfe,0.0)
    ge = 5.7*P + 9.4*F + 4.1*(nfe_c+Fa)
    ts = 100-M
    fa_ts = Fa/ts*100
    dig = (91.2-1.43*fa_ts) if sp=='hund' else (87.9-0.88*fa_ts)
    de = ge*dig/100
    me = de - (1.04*P if sp=='hund' else 0.77*P)
    return dict(nfe=nfe, ge=ge, dig=dig, de=de, me=me)  # kcal/100 g

def bedarf(t):
    sp=t['art']; kg=t['gewicht']
    if sp=='hund':
        if t['phase']=='welpe':
            ew=t['endgewicht']; mer=(254.1-135.0*(kg/ew))*kg**0.75
            return dict(kcal=mer, lo=mer*0.9, hi=mer*1.1, faktor=None, formel='FEDIAF VII-8b Wachstum')
        f={'wenig':95,'normal':{'jung':130,'adult':110,'senior':95}[t['alter']],'sportlich':125,'arbeit':162.5}[t['aktiv']]
        if t['aktiv']=='sportlich' and t['alter']=='jung': f=130
        if t.get('kastriert'): f*=0.9
        mer=f*kg**0.75
        return dict(kcal=mer, lo=mer*0.9, hi=mer*1.1, faktor=f, formel='FEDIAF VII-6/VII-7')
    base = 75 if (t.get('kastriert') or t['aktiv'] in ('wenig','wohnung')) else 100
    if t['phase']=='kitten':
        m=t['monate']; lo,hi = (2.0,2.5) if m<4 else ((1.75,2.0) if m<9 else (1.5,1.5))
        mer100=100*kg**0.67
        mer=mer100*(lo+hi)/2
        return dict(kcal=mer, lo=mer*0.9, hi=mer*1.1, faktor=100*(lo+hi)/2, formel='FEDIAF VII-10')
    mer=base*kg**0.67
    return dict(kcal=mer, lo=mer*0.9, hi=mer*1.1, faktor=base, formel='FEDIAF VII-9')

def spalte(t, faktor):
    sp=t['art']
    if sp=='hund':
        if t['phase']=='welpe': return 'wachstum_frueh' if t['wochen']<14 else 'wachstum_spaet'
        return 'adult95' if faktor<=100 else 'adult110'
    if t['phase']=='kitten': return 'wachstum'
    return 'adult75' if faktor<=75 else 'adult100'

# ---------------- neu in v2 ----------------
# Rundung wie TypeScript Math.round (Python-round() rundet .5 auf gerade Zahl!)
def rund(x): return math.floor(x + 0.5)
def r1(x): return math.floor(x * 10 + 0.5) / 10

# Modifizierte Atwater-Faktoren (kcal/g) NUR für die Energieverteilung (NRC 2006): Protein 3,5, Fett 8,5, NfE 3,5.
ATWATER = dict(p=3.5, f=8.5, c=3.5)

# (1) Protein:Fett-Verhältnis in g:g (wie gefüttert = in TS). lo -> 0 Punkte, hi -> volle Punkte, linear dazwischen.
#   lo 1,0 : 1 g Protein je g Fett = 29 % Energie aus Protein, 71 % aus Fett (ohne NfE). Fettreicher geht es kaum.
#   hi Hund 2,9 : Energieverteilung der Wolfsbeute 54 % Protein : 45 % Fett (Bosch et al. 2015)
#                 -> (54/3,5) / (45/8,5) = 2,91 g Protein je g Fett.
#   hi Katze 2,75: Beute verwilderter Katzen 62,7 % RP : 22,8 % RFe in der TS (Plantinga et al. 2011) -> 2,75.
PF_BAND = {'hund': (1.0, 2.9), 'katze': (1.0, 2.75)}
# (2) Protein-Energieanteil (% der Energie nach Atwater).
#   lo = FEDIAF-Minimum der Bedarfsspalte, in Energie-% umgerechnet (min g/1000 kcal × 3,5 / 10). Unter lo: 0 Punkte.
#   hi = Ziel: Hund 30 % (selbst gewählte Verteilung, Hewson-Hughes et al. 2013), Katze 52 % (Hewson-Hughes et al. 2011;
#        Plantinga et al. 2011). Ab lo gibt es schon PE_SOCKEL (50 %) der Punkte, weil das Minimum erfüllt ist.
PE_ZIEL = {'hund': 30.0, 'katze': 52.0}
PE_SOCKEL = 0.5
# (4) NfE (rechnerische Kohlenhydrate) in % TS: volle Punkte bis lo, 0 Punkte ab hi, linear dazwischen.
NFE_BAND = {'hund': (35.0, 55.0), 'katze': (15.0, 40.0)}
# Gewichte (Höchstpunkte). Hund 100, Katze 115 (+ NfE 5, + Taurin 10); Ca/P und Taurin zählen nur, wenn angegeben.
GEWICHT = {'hund': dict(pf=35, pe=15, pmin=10, fmin=5, nfe=5, capr=20, plaus=10),
           'katze': dict(pf=35, pe=15, pmin=10, fmin=5, nfe=10, capr=20, taurin=10, plaus=10)}
# Plausibilitätsabzüge (von 10)
PLAUS_ABZUG = dict(feuchte_geschaetzt=2, asche_ausserhalb=3, faser_hund=3)

# (8) Kollagen-Heuristik: Abzug in Score-Punkten nach der Normierung, KEIN Deckel.
#   Stufe 1 (immer, nur Nährwerte): Rohprotein TS >= protein_ts_ab UND Rohasche TS > 10 %
#            -> rund(lin(Asche TS; 10; 14) × 6), zusätzlich 2, wenn Ca TS > 2,0 %.  Max. 8.
#   Stufe 2 (nur mit Feld „Erste Zutaten“): Schlagwort in den ersten 5 Zutaten.
#            stark: 4 + 2 je weiterem starken Begriff; schwach (Sammelbegriff): 2. Max. 6.
KOLL = dict(asche_ab=10.0, asche_voll=14.0, asche_max=6, ca_ts_ab=2.0, ca_abzug=2,
            protein_ts_ab={'hund': 25.0, 'katze': 30.0}, zutaten_positionen=5, zutaten_max=6)
# Schlagwörter, geprüft auf jede der ersten 5 Zutaten (klein geschrieben, Regex ohne Wortanfang, damit Komposita greifen)
KOLL_STARK = [r'kollagen', r'gelatine', r'knorpel', r'haut\b', r'häute', r'schwarte', r'feder(n|mehl|hydrolysat)?\b',
              r'sehne', r'luftröhre', r'grieben', r'knochenmehl', r'tiermehl', r'schlachtabf']
KOLL_SCHWACH = [r'nebenerzeugnis']
# „hydrolys…“ zählt nur als schwacher Treffer, wenn ein tierisches/unklares Protein gemeint ist,
# nicht bei Leber-, Hefe-, Fisch- oder Pflanzenhydrolysat (Aromageber bzw. hochwertig).
HYDRO_JA = r'hydrolys'
HYDRO_KONTEXT = r'protein|tier'
HYDRO_NEIN = r'leber|hefe|fisch|pflanz|soja|reis|weizen|mais|erbs|kartoffel'

def lin(x, lo, hi):
    """0 bei x<=lo, 1 bei x>=hi, linear dazwischen."""
    if hi == lo: return 1.0 if x >= hi else 0.0
    return min(1.0, max(0.0, (x-lo)/(hi-lo)))

def zutaten_liste(text, n):
    """Oberste Ebene an Komma/Semikolon trennen (Klammerinhalte bleiben beim Bestandteil), erste n Positionen."""
    teile=[]; tiefe=0; cur=''
    for ch in text or '':
        if ch in '([': tiefe+=1
        elif ch in ')]': tiefe=max(0,tiefe-1)
        if ch in ',;' and tiefe==0:
            if cur.strip(): teile.append(cur.strip())
            cur=''
        else: cur+=ch
    if cur.strip(): teile.append(cur.strip())
    return teile[:n]

def kollagen(sp, p_ts, a_ts, ca_ts, zutaten):
    """Gibt dict(abzug_naehrwerte, abzug_zutaten, treffer, flag) zurück. Abzug in Punkten (0–12)."""
    a1=0; ca_extra=0
    if p_ts >= KOLL['protein_ts_ab'][sp] and a_ts > KOLL['asche_ab']:
        a1 = rund(lin(a_ts, KOLL['asche_ab'], KOLL['asche_voll']) * KOLL['asche_max'])
        if ca_ts is not None and ca_ts > KOLL['ca_ts_ab']: ca_extra = KOLL['ca_abzug']
    stark=[]; schwach=[]
    if zutaten:
        for z in zutaten_liste(zutaten, KOLL['zutaten_positionen']):
            zl=z.lower()
            for k in KOLL_STARK:
                if re.search(k, zl) and k not in stark: stark.append(k)
            for k in KOLL_SCHWACH:
                if re.search(k, zl) and k not in schwach: schwach.append(k)
            if (re.search(HYDRO_JA, zl) and re.search(HYDRO_KONTEXT, zl) and not re.search(HYDRO_NEIN, zl)
                    and 'hydrolysat' not in schwach and not any(re.search(k, zl) for k in KOLL_STARK)):
                schwach.append('hydrolysat')
    a2 = (4 + 2*(len(stark)-1) if stark else 0) + (2 if schwach else 0)   # schwach zählt einmal
    a2 = min(a2, KOLL['zutaten_max'])
    return dict(abzug_naehrwerte=a1+ca_extra, abzug_zutaten=a2, treffer=stark+schwach,
                flag=(a1+ca_extra+a2)>0, zutaten_geprueft=bool((zutaten or '').strip()))

def bewerte(futter, tier):
    sp=tier['art']; caps=[]
    P,F,Fa,A=futter['p'],futter['f'],futter['fa'],futter['a']
    M=futter.get('m'); est_m=False
    if M is None:
        if futter['typ']=='trocken': M=10.0; est_m=True
        else: return dict(status='fehlt', msg='Feuchte fehlt')
    summe=P+F+Fa+A+M
    if summe>102: return dict(status='unplausibel', msg=f'Summe {summe:.1f} % > 100 %')
    e=energie(sp,P,F,Fa,A,M)
    if e['nfe']<-2: return dict(status='unplausibel', msg='NfE negativ')
    me = futter.get('me_hersteller') or e['me']
    ts=100-M
    dm=lambda x: x/ts*100
    b=bedarf(tier); col=spalte(tier,b['faktor'] or 0)
    mins=MIN[sp][col]; W=GEWICHT[sp]
    p1000=P/me*1000; f1000=F/me*1000
    rp=p1000/mins['p']; rf=f1000/mins['f']
    pts={}; maxp={}
    # 1) Protein:Fett-Verhältnis (35)
    pf = P/F if F>0 else 99.0
    lo,hi=PF_BAND[sp]; pts['pf']=r1(W['pf']*lin(pf,lo,hi)); maxp['pf']=W['pf']
    # 2) Protein-Energieanteil (15)
    nfe_c=max(e['nfe'],0.0)
    eP,eF,eC = ATWATER['p']*P, ATWATER['f']*F, ATWATER['c']*nfe_c
    eS=eP+eF+eC
    pe=eP/eS*100; fe=eF/eS*100; ce=eC/eS*100
    pe_lo = mins['p']*ATWATER['p']/10   # g/1000 kcal → % Energie
    pts['pe']=r1(W['pe']*(PE_SOCKEL+(1-PE_SOCKEL)*lin(pe,pe_lo,PE_ZIEL[sp]))) if pe>=pe_lo else 0.0; maxp['pe']=W['pe']
    # 3) FEDIAF-Minimum Protein (10) / Fett (5) – Deckel wie v1
    pts['pmin']=W['pmin'] if rp>=1.0 else (W['pmin']/2 if rp>=0.9 else 0); maxp['pmin']=W['pmin']
    pts['fmin']=W['fmin'] if rf>=1.0 else (W['fmin']/2 if rf>=0.9 else 0); maxp['fmin']=W['fmin']
    if rp<0.9 or rf<0.9: caps.append('mangelhaft')
    elif rp<1.0 or rf<1.0: caps.append('ausreichend')
    # 4) NfE / Kohlenhydrate (Hund 5, Katze 10)
    nfe_ts=dm(nfe_c); lo,hi=NFE_BAND[sp]
    pts['nfe']=r1(W['nfe']*(1-lin(nfe_ts,lo,hi))); maxp['nfe']=W['nfe']
    # 5) Ca/P (20) – Regeln wie v1
    ca,ph=futter.get('ca'),futter.get('ph'); capr=None; ca_ts=None
    if ca is not None and ph is not None and ph>0:
        cr=ca_rules(sp,col,tier.get('endgewicht')); ratio=ca/ph; ca_ts=dm(ca); p_dm=dm(ph)
        ok_r = cr['r_min']<=ratio<=cr['r_max']; ok_ca = ca_ts>=cr['ca_min'] and (cr['ca_max'] is None or ca_ts<=cr['ca_max'])
        ok_p = p_dm>=cr['p_min'] and (cr['p_max'] is None or p_dm<=cr['p_max'])
        near = (cr['r_min']-0.1)<=ratio<=(cr['r_max']+0.1)
        pts['capr']=W['capr'] if (ok_r and ok_ca and ok_p) else (W['capr']/2 if near and ok_ca else 0); maxp['capr']=W['capr']
        if pts['capr']==0 and col.startswith('wachstum'): caps.append('ausreichend')
        if cr['ca_max'] is not None and ca_ts>cr['ca_max']: caps.append('mangelhaft' if col.startswith('wachstum') else 'ausreichend')
        capr=dict(ratio=ratio, ca_dm=ca_ts, p_dm=p_dm, rules=cr)
    else:
        caps.append('gut')
    # 6) Taurin (Katze, 10) – unverändert, kein Deckel
    if sp=='katze':
        tau=futter.get('taurin_mgkg')
        if tau is not None:
            tdm=tau/10000/ts*100; tmin=TAURIN_MIN[(col,'nass' if futter['typ']=='nass' else 'trocken')]
            pts['taurin']=W['taurin'] if tdm>=tmin else 0; maxp['taurin']=W['taurin']
    # 7) Plausibilität (10)
    a_dm=dm(A); plaus=W['plaus']
    if est_m: plaus-=PLAUS_ABZUG['feuchte_geschaetzt']
    if not (3<=a_dm<=12): plaus-=PLAUS_ABZUG['asche_ausserhalb']
    if dm(Fa)>8 and sp=='hund': plaus-=PLAUS_ABZUG['faser_hund']
    pts['plaus']=max(plaus,0); maxp['plaus']=W['plaus']
    basis=sum(pts.values())/sum(maxp.values())*100
    # 8) Kollagen-Heuristik: Abzug vom Score, kein Deckel
    k=kollagen(sp, dm(P), a_dm, ca_ts, futter.get('zutaten'))
    abzug=k['abzug_naehrwerte']+k['abzug_zutaten']
    score=max(0, rund(basis - abzug))
    note = 'sehr gut' if score>=90 else 'gut' if score>=80 else 'befriedigend' if score>=70 else 'ausreichend' if score>=60 else 'mangelhaft'
    order=['sehr gut','gut','befriedigend','ausreichend','mangelhaft']
    for c in caps:
        if order.index(c)>order.index(note): note=c
    menge=b['kcal']/me*100
    return dict(status='ok', M=M, est_m=est_m, ts=ts, nfe=e['nfe'], nfe_dm=nfe_ts, ge=e['ge'], dig=e['dig'], de=e['de'], me_calc=e['me'], me=me,
                p_dm=dm(P), f_dm=dm(F), a_dm=a_dm, fa_dm=dm(Fa), p1000=p1000, f1000=f1000, col=col, mins=mins, rp=rp, rf=rf,
                pf=pf, energie_anteile=dict(p=pe, f=fe, c=ce), pe_lo=pe_lo,
                capr=capr, pts=pts, maxp=maxp, basis=basis, kollagen=k, abzug=abzug, score=score, note=note, caps=caps, bedarf=b, menge=menge,
                menge_lo=b['lo']/me*100, menge_hi=b['hi']/me*100)
