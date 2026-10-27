"""Referenzimplementierung Futter-Rechner (Konzept). Python-Spiegel des geplanten TS-Moduls."""
import math
# FEDIAF 2025 Tab. III-3b / III-4b: Mindestwerte je 1000 kcal ME
MIN = {
 'hund': {'adult110': dict(p=45.0,f=13.75), 'adult95': dict(p=52.1,f=13.75),
          'wachstum_frueh': dict(p=62.5,f=21.25), 'wachstum_spaet': dict(p=50.0,f=21.25)},
 'katze': {'adult100': dict(p=62.5,f=22.5), 'adult75': dict(p=83.3,f=22.5), 'wachstum': dict(p=70.0,f=22.5)},
}
# Ca (g/100 g TS) min/max und Ca:P  (Tab. III-3a, III-4a, Fußnoten a, b)
def ca_rules(sp, col, endgewicht=None):
    if sp=='hund':
        if col=='adult110': return dict(ca_min=0.50, ca_max=2.50, p_min=0.40, p_max=1.60, r_min=1.0, r_max=2.0)
        if col=='adult95':  return dict(ca_min=0.58, ca_max=2.50, p_min=0.46, p_max=1.60, r_min=1.0, r_max=2.0)
        if col=='wachstum_frueh': return dict(ca_min=1.00, ca_max=1.60, p_min=0.90, p_max=None, r_min=1.0, r_max=1.6)
        # spaet
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
    # katze
    base = 75 if (t.get('kastriert') or t['aktiv']=='wenig') else 100
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

def stufe_ratio(r, steps):
    for thr,pts in steps:
        if r>=thr: return pts
    return 0

def bewerte(futter, tier):
    sp=tier['art']; reasons=[]; caps=[]
    P,F,Fa,A=futter['p'],futter['f'],futter['fa'],futter['a']
    M=futter.get('m'); est_m=False
    if M is None:
        if futter['typ']=='trocken': M=10.0; est_m=True
        else: return dict(status='fehlt', msg='Feuchte fehlt')
    summe=P+F+Fa+A+M
    if summe>102: return dict(status='unplausibel', msg=f'Summe {summe:.1f} % > 100 %')
    e=energie(sp,P,F,Fa,A,M)
    me = futter.get('me_hersteller') or e['me']
    ts=100-M
    dm=lambda x: x/ts*100
    b=bedarf(tier); col=spalte(tier,b['faktor'] or 0)
    mins=MIN[sp][col]
    p1000=P/me*1000; f1000=F/me*1000
    rp=p1000/mins['p']; rf=f1000/mins['f']
    pts={}; maxp={}
    pts['protein']=stufe_ratio(rp,[(1.3,35),(1.1,30),(1.0,22),(0.9,10)]); maxp['protein']=35
    pts['fett']=stufe_ratio(rf,[(1.2,20),(1.0,14),(0.9,6)]); maxp['fett']=20
    if rp<0.9 or rf<0.9: caps.append('mangelhaft')
    elif rp<1.0 or rf<1.0: caps.append('ausreichend')
    # Ca/P
    ca,ph=futter.get('ca'),futter.get('ph')
    if ca is not None and ph is not None and ph>0:
        cr=ca_rules(sp,col,tier.get('endgewicht')); ratio=ca/ph; ca_dm=dm(ca); p_dm=dm(ph)
        ok_r = cr['r_min']<=ratio<=cr['r_max']; ok_ca = ca_dm>=cr['ca_min'] and (cr['ca_max'] is None or ca_dm<=cr['ca_max'])
        ok_p = p_dm>=cr['p_min'] and (cr['p_max'] is None or p_dm<=cr['p_max'])
        near = (cr['r_min']-0.1)<=ratio<=(cr['r_max']+0.1)
        pts['capr']=20 if (ok_r and ok_ca and ok_p) else (10 if near and ok_ca else 0); maxp['capr']=20
        if pts['capr']==0 and col.startswith('wachstum'): caps.append('ausreichend')
        if cr['ca_max'] is not None and ca_dm>cr['ca_max']: caps.append('mangelhaft' if col.startswith('wachstum') else 'ausreichend')
        capr=dict(ratio=ratio, ca_dm=ca_dm, p_dm=p_dm, rules=cr)
    else:
        capr=None; caps.append('gut')
    # Taurin
    if sp=='katze':
        tau=futter.get('taurin_mgkg')
        if tau is not None:
            tdm=tau/10000/ts*100; tmin=TAURIN_MIN[(col,'nass' if futter['typ']=='nass' else 'trocken')]
            pts['taurin']=10 if tdm>=tmin else 0; maxp['taurin']=10
        # sonst nicht bewertbar, kein cap (Taurin oft nur als Zusatzstoff deklariert)
    # Rohasche / Plausibilitaet (15)
    a_dm=dm(A); plaus=15
    if e['nfe']<-2: return dict(status='unplausibel', msg='NfE negativ')
    if est_m: plaus-=5
    if not (3<=a_dm<=12): plaus-=5
    if dm(Fa)>8 and sp=='hund': plaus-=5
    pts['plaus']=max(plaus,0); maxp['plaus']=15
    score=round(sum(pts.values())/sum(maxp.values())*100)
    note = 'sehr gut' if score>=90 else 'gut' if score>=80 else 'befriedigend' if score>=70 else 'ausreichend' if score>=60 else 'mangelhaft'
    order=['sehr gut','gut','befriedigend','ausreichend','mangelhaft']
    for c in caps:
        if order.index(c)>order.index(note): note=c
    menge=b['kcal']/me*100
    return dict(status='ok', M=M, est_m=est_m, ts=ts, nfe=e['nfe'], nfe_dm=dm(max(e['nfe'],0)), ge=e['ge'], dig=e['dig'], de=e['de'], me_calc=e['me'], me=me,
                p_dm=dm(P), f_dm=dm(F), a_dm=a_dm, fa_dm=dm(Fa), p1000=p1000, f1000=f1000, col=col, mins=mins, rp=rp, rf=rf,
                capr=capr, pts=pts, maxp=maxp, score=score, note=note, caps=caps, bedarf=b, menge=menge,
                menge_lo=b['lo']/me*100, menge_hi=b['hi']/me*100)
