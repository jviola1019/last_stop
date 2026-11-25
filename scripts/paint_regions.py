"""Reproducible, locally authored SVG panorama paintings. No external images or fonts."""
from pathlib import Path
import random, math
root=Path(__file__).resolve().parents[1]
regions={
 'coast':('Saltwind Coast','#c5807c','#edc4a3','#497b8b','#254867','#88b4b7','#f4cc90'),
 'highland':('Cloudpine Highlands','#3e587b','#bad0db','#6b8aa0','#324f6c','#c4d5d8','#f4daba'),
 'desert':('Golden Expanse','#814c60','#fac38d','#b97856','#74516a','#e2a46f','#fff0b9'),
 'metropolis':('Lumen Corridor','#212b56','#786ba2','#454d89','#202c58','#68679a','#f4b879'),
 'frontier':('The Far Horizon','#162f52','#5c8eaa','#517e8d','#244b6b','#9cc8ce','#c0ffe4'),
 'archipelago':('Moonstone Isles','#342d5a','#ab7c98','#42698f','#244967','#759aab','#dce9ca'),
 'beyond':('Beyond the Last Bridge','#322546','#9d6aa6','#5e4b7e','#302d69','#967aaf','#f7d5f9')
}
for name,(title,top,bottom,mountain,near,water,light) in regions.items():
 rng=random.Random(sum(map(ord,name)));items=[]
 A=items.append
 A(f'<svg xmlns="http://www.w3.org/2000/svg" width="1672" height="941" viewBox="0 0 1672 941" role="img" aria-label="{title} illustrated railway landscape">')
 A(f'''<defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="{top}"/><stop offset=".74" stop-color="{bottom}"/><stop offset="1" stop-color="{near}"/></linearGradient><linearGradient id="lake" x2="0" y2="1"><stop stop-color="{water}"/><stop offset="1" stop-color="{near}"/></linearGradient><radialGradient id="sun"><stop stop-color="{light}" stop-opacity=".95"/><stop offset="1" stop-color="{light}" stop-opacity="0"/></radialGradient><linearGradient id="mount" x2="0" y2="1"><stop stop-color="{mountain}"/><stop offset="1" stop-color="{near}"/></linearGradient><linearGradient id="glass" x2="0" y2="1"><stop stop-color="{light}"/><stop offset="1" stop-color="#9e7390"/></linearGradient></defs>''')
 A('<rect width="1672" height="941" fill="url(#sky)"/>')
 A(f'<ellipse cx="1148" cy="258" rx="335" ry="278" fill="url(#sun)"/>')
 A(f'<circle cx="1148" cy="260" r="72" fill="{light}" opacity=".82"/>')
 for i in range(14):
  x=rng.randint(-60,1600);y=rng.randint(62,255);rx=rng.randint(52,180);
  A(f'<path d="M{x-rx} {y+12} Q{x-rx//2} {y-14} {x} {y-7} Q{x+rx//3} {y-18} {x+rx} {y+18}" stroke="#f6d6cb" stroke-opacity=".28" stroke-width="{rng.randint(10,22)}" fill="none" stroke-linecap="round"/>')
 if name=='beyond':
  for i in range(80):
   x=rng.randint(0,1672);y=rng.randint(0,490);A(f'<circle cx="{x}" cy="{y}" r="{rng.choice([1,2,3])}" fill="{light}" opacity=".65"/>')
 if name in ['frontier','beyond']:
  for i in range(4):
   y=80+i*44;A(f'<path d="M-60 {y+30} Q300 {y-110} 640 {y+24} T1370 {y-15} T1760 {y+54}" stroke="{["#7becc1","#baa9f3","#93ecca","#f2c0e9"][i]}" stroke-opacity=".18" fill="none" stroke-width="{30+i*5}"/>')
 for layer in range(4):
  base=420+layer*70;pts=[(-60,710)];
  for j in range(-100,1820,75):
   y=base+rng.randint(-190+layer*18,30);pts.append((j,y))
  pts += [(1800,790),(-60,790)]
  polygon=' '.join(f'{x},{y}' for x,y in pts)
  color=[mountain,'#66819b' if name=='highland' else near,near,'#334455'][layer]
  A(f'<polygon points="{polygon}" fill="{color}" opacity="{[.44,.63,.86,.94][layer]}"/>')
  if layer<2:
   for x,y in pts[2:]:
    if y<base-80:A(f'<path d="M{x-38} {y+70} L{x} {y} L{x+40} {y+70} L{x+14} {y+36} L{x} {y+43} L{x-16} {y+37}Z" fill="#f7e6dd" opacity="{.14+layer*.13}"/>')
 # Distinct regional landmarks and architecture; placed behind train cutaways.
 if name in ('coast','archipelago'):
  A(f'<path d="M0 620 Q350 603 630 648 T1170 646 T1672 622 L1672 941 H0Z" fill="url(#lake)"/>')
  for k in range(4):
   x=1220+k*94; y=457+rng.randint(-45,45)
   A(f'<path d="M{x} {y+200} V{y} h58 v200Z" fill="{near}" stroke="{light}" stroke-opacity=".32" stroke-width="4"/><path d="M{x+8} {y+40}h40v45h-40Z" fill="{light}" opacity=".75"/>')
  A(f'<path d="M1380 600 V323 h60 v277 M1370 337h80l-12-20h-56Z" fill="{light}" stroke="{near}" stroke-width="6"/><ellipse cx="1411" cy="320" rx="90" ry="21" fill="{light}" opacity=".12"/>')
 elif name=='desert':
  for i in range(5):
   x=1150+i*117;h=180+rng.randint(20,150);A(f'<path d="M{x} 650 v{-h} l15 -25 h64 l25 25 v{h}Z" fill="#96566b" stroke="#e5ad78" stroke-width="5"/>')
  for i in range(16):
   x=rng.randint(20,1640);y=rng.randint(590,780);A(f'<path d="M{x} {y} v-45 m0 28 q-15 0-15-21 m15 15 q16-2 16-22" stroke="#507b66" stroke-width="8" stroke-linecap="round" fill="none" opacity=".8"/>')
 elif name=='metropolis':
  for i in range(26):
   x=i*69-10;h=rng.randint(180,490);z=610-h
   A(f'<rect x="{x}" y="{z}" width="{rng.randint(48,74)}" height="{h}" fill="{near}" stroke="{light}" stroke-opacity=".17" stroke-width="3"/>')
   for j in range(4):
    for k in range(0,h-35,36):
     if rng.random()>.3:A(f'<rect x="{x+9+j*11}" y="{z+19+k}" width="6" height="11" fill="{light}" opacity="{rng.random()*.5+.25:.2f}"/>')
  A('<path d="M0 425 Q400 320 850 450 T1672 396" fill="none" stroke="#b2a4e0" stroke-width="7" opacity=".65"/>')
 elif name in ('highland','frontier'):
  for i in range(20):
   x=rng.randint(0,1670);y=rng.randint(500,710);h=rng.randint(45,120)
   A(f'<path d="M{x} {y} l20 -{h} l20 {h}h-12 l-8-29-8 29Z" fill="#1a5162" opacity=".8"/><path d="M{x+10} {y-h//2} l10 -{h//2} 10 {h//2}" fill="none" stroke="#d7e8e4" stroke-opacity=".4" stroke-width="4"/>')
 else:
  for i in range(4):
   x=1230+i*100;h=120+rng.randint(30,110)
   A(f'<path d="M{x} 630 v{-h} l22-24 h39 l22 24 v{h}Z" fill="#4a467b" stroke="#cfb3ba" stroke-opacity=".5" stroke-width="4"/>')
 # Railway station and its canopy — unique per region by silhouette and color.
 stationX=1280
 A(f'<path d="M{stationX} 628V465L{stationX+185} 415L{stationX+340} 468V628Z" fill="{near}" stroke="{light}" stroke-opacity=".6" stroke-width="5"/>')
 A(f'<path d="M{stationX-15} 474L{stationX+175} 401L{stationX+355} 474" fill="none" stroke="{light}" stroke-width="13" stroke-linejoin="round"/>')
 for j in range(5):
  x=1300+j*62;A(f'<rect x="{x}" y="498" width="38" height="72" fill="url(#glass)" stroke="{light}" stroke-width="5" opacity=".83"/>')
 A(f'<circle cx="1451" cy="452" r="21" fill="{light}" opacity=".9" stroke="{near}" stroke-width="4"/>')
 A(f'<path d="M1451 452v-12m0 12l10 5" stroke="{near}" stroke-width="3"/>')
 # Water/rivers/flowers fill the visible lower band. Ground and trestles are behind the train.
 if name not in ['coast','archipelago']:
  A(f'<path d="M0 692 Q400 656 710 699 T1672 688L1672 941H0Z" fill="url(#lake)"/>')
 for i in range(105):
  x=rng.randint(0,1672);y=rng.randint(720,910);width=rng.randint(9,51)
  A(f'<path d="M{x} {y}h{width}" stroke="{light}" stroke-opacity="{rng.random()*.29+.08:.2f}" stroke-width="{rng.choice([1,2,3])}" stroke-linecap="round"/>')
 A(f'<path d="M0 790Q330 761 630 794T1672 773v180H0Z" fill="{near}" opacity=".6"/>')
 for i in range(150):
  x=rng.randint(0,1672);y=rng.randint(770,940);r=rng.randint(1,4);
  A(f'<path d="M{x} {y}l{rng.randint(-8,8)} -{rng.randint(6,24)}" stroke="#8fa58b" stroke-opacity=".55" stroke-width="2"/>')
  if i%3==0:A(f'<circle cx="{x}" cy="{y-16}" r="{r}" fill="{light}" opacity=".73"/>')
 # Dappled painterly grain, no external filter dependencies.
 for i in range(200):
  x=rng.randint(0,1672);y=rng.randint(300,930);A(f'<path d="M{x} {y}l{rng.randint(2,16)} -{rng.randint(1,5)}" stroke="{light}" stroke-opacity=".06" stroke-width="2"/>')
 A('</svg>')
 out=root/'assets'/('region-'+name+'.svg');out.write_text('\n'.join(items))
 print(f'{name}: {len(items)} illustrated elements, {out.stat().st_size//1024}KB')
