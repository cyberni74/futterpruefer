import json
from rechner import bewerte, energie, bedarf
cases=[
 ('T1 Hund adult, Trockenfutter', dict(p=25,f=14,fa=2.5,a=7,m=10,ca=1.3,ph=0.95,typ='trocken'), dict(art='hund',gewicht=20,phase='adult',alter='adult',aktiv='normal')),
 ('T2 Hund adult, Nassfutter, kastriert, wenig aktiv', dict(p=10.5,f=7,fa=0.5,a=2.2,m=78,ca=0.3,ph=0.22,typ='nass'), dict(art='hund',gewicht=10,phase='adult',alter='adult',aktiv='wenig',kastriert=True)),
 ('T3 Welpe 17 Wochen, 12 kg, Endgewicht 30 kg', dict(p=28,f=17,fa=2.5,a=7.5,m=10,ca=1.3,ph=1.0,typ='trocken'), dict(art='hund',gewicht=12,phase='welpe',wochen=17,endgewicht=30)),
 ('T3b gleicher Welpe mit Adult-Futter aus T1', dict(p=25,f=14,fa=2.5,a=7,m=10,ca=1.3,ph=0.95,typ='trocken'), dict(art='hund',gewicht=12,phase='welpe',wochen=17,endgewicht=30)),
 ('T4 Senior-Hund 10 J, 25 kg, kastriert, Feuchte fehlt, kein Ca/P', dict(p=22,f=10,fa=3.5,a=6,m=None,typ='trocken'), dict(art='hund',gewicht=25,phase='adult',alter='senior',aktiv='normal',kastriert=True)),
 ('T5 Katze adult, Nassfutter, kastriert, Wohnung', dict(p=11,f=5.5,fa=0.4,a=2.0,m=80,ca=0.3,ph=0.22,taurin_mgkg=1000,typ='nass'), dict(art='katze',gewicht=4.5,phase='adult',aktiv='normal',kastriert=True)),
 ('T6 Kitten 5 Monate, 2,5 kg, Trockenfutter', dict(p=34,f=20,fa=2,a=7.5,m=8,ca=1.2,ph=1.0,taurin_mgkg=2000,typ='trocken'), dict(art='katze',gewicht=2.5,phase='kitten',monate=5,aktiv='normal')),
 ('T7 Mangelhaft: Hund adult, Trockenfutter, wenig aktiv', dict(p=15,f=4.5,fa=4,a=9.5,m=10,ca=2.4,ph=0.8,typ='trocken'), dict(art='hund',gewicht=15,phase='adult',alter='adult',aktiv='wenig')),
]
out=[]
for name,f,t in cases:
    r=bewerte(f,t)
    print('\n==',name); 
    for k in ['M','est_m','ts','nfe','nfe_dm','ge','dig','de','me','p_dm','f_dm','a_dm','fa_dm','p1000','f1000','col','mins','rp','rf','capr','pts','maxp','score','note','caps','menge','menge_lo','menge_hi']:
        v=r.get(k); 
        if isinstance(v,float): v=round(v,2)
        print(f'  {k}: {v}')
    print('  bedarf:', {k:(round(v,1) if isinstance(v,float) else v) for k,v in r['bedarf'].items()})
# Snack
e=energie('katze',30,12,2,7,18); b=bedarf(dict(art='katze',gewicht=4.5,phase='adult',aktiv='normal',kastriert=True))
print('\n== T8 Snack Katze', {k:round(v,2) for k,v in e.items()}, 'MER',round(b['kcal'],1),'10%',round(b['kcal']*0.1,1),'g',round(b['kcal']*0.1/e['me']*100,1))
