"""16 original regional platform illustrations, each built from a specific architecture brief."""
from pathlib import Path
from random import Random
root=Path(__file__).resolve().parents[1]/'assets'
# id, style, facade, roof, trim, regional motif
stations=[('willow','gable','#756c57','#344d45','#d9c18a','timber'),('valley','mansard','#b48373','#574952','#f3d7a5','flowers'),('harbor','lighthouse','#77959a','#345a67','#e9d1a5','harbor'),('coastnight','arched','#816d66','#3b536c','#f2c18d','lantern'),('alpine','chalet','#806d56','#536e82','#ecdfbf','snow'),('highlands','stone','#85837b','#414b5a','#d4bf95','mountain'),('desert','adobe','#b78956','#9b6347','#f4d4a0','cactus'),('canyon','mission','#a67858','#694c4c','#f0c498','arch'),('city','deco','#647e85','#334854','#e4c07a','tower'),('neon','glass','#64759a','#334769','#efb6e0','city'),('aurora','dome','#5c7a87','#34495d','#c3e2d9','ice'),('astral','observatory','#52627b','#3c405d','#d8d2af','star'),('moonstone','pier','#768c94','#354c65','#e2dbbc','moon'),('isle','villa','#bf9180','#535e72','#f5d6a5','palms'),('beyond','viaduct','#7b778e','#4b456a','#e2c8ad','bridge'),('cloud','archive','#80738d','#4b465f','#e3d7be','clock')]
for id,style,wall,roof,trim,motif in stations:
 r=Random(id);p=[];A=p.append
 A(f'<svg xmlns="http://www.w3.org/2000/svg" width="440" height="220" viewBox="0 0 440 220"><defs><linearGradient id="wall" x2="0" y2="1"><stop stop-color="{wall}"/><stop offset="1" stop-color="#3a3d43"/></linearGradient><linearGradient id="roof" x2="0" y2="1"><stop stop-color="{roof}"/><stop offset="1" stop-color="#25323c"/></linearGradient><linearGradient id="window" x2="0" y2="1"><stop stop-color="#f6dda6"/><stop offset=".55" stop-color="#d8a675"/><stop offset="1" stop-color="#76565c"/></linearGradient></defs>')
 A('<ellipse cx="220" cy="209" rx="210" ry="8" fill="#1b242c" opacity=".4"/>')
 A(f'<path d="M25 94H415V192H25Z" fill="url(#wall)" stroke="#3d3535" stroke-width="3"/>')
 roofpath={
 'gable':'M6 98L220 19 434 98Z','mansard':'M6 98L60 45H380L434 98Z','lighthouse':'M6 98L70 69H370L434 98Z','arched':'M6 98Q220 -15 434 98Z','chalet':'M6 98L220 8 434 98Z','stone':'M6 98H30V70H75V60H365V70H410V98Z','adobe':'M6 98V70H60V55H380V70H434V98Z','mission':'M6 98H155V66Q220 -14 285 66V98H434Z','deco':'M6 98V68H120V39H165V20H275V39H320V68H434V98Z','glass':'M6 98Q220 1 434 98Z','dome':'M6 98H90Q220 -22 350 98H434Z','observatory':'M6 98H120Q220 -35 320 98H434Z','pier':'M6 98L220 40 434 98Z','villa':'M6 98L220 28 434 98Z','viaduct':'M6 98H434V62H6Z','archive':'M6 98L220 30 434 98Z'}[style]
 A(f'<path d="{roofpath}" fill="url(#roof)" stroke="{trim}" stroke-width="3"/>')
 if style in ('lighthouse','observatory','archive','deco','stone'):
  tx=50 if style=='lighthouse' else 196;ty=12 if style in ('lighthouse','deco') else 25
  A(f'<rect x="{tx}" y="{ty}" width="47" height="87" rx="3" fill="{wall}" stroke="{trim}" stroke-width="2"/><path d="M{tx-5} {ty+2}l28 -15 29 15Z" fill="{roof}" stroke="{trim}" stroke-width="2"/>')
  A(f'<circle cx="{tx+23}" cy="{ty+27}" r="12" fill="#efd9ac" stroke="#4f4e4c" stroke-width="2"/><path d="M{tx+23} {ty+27}v-7m0 7l6 3" stroke="#454345" stroke-width="2"/>')
 for i in range(7):
  x=44+i*52;y=113+(i%2)*3
  A(f'<rect x="{x}" y="{y}" width="34" height="60" rx="{12 if style in ("arched","mission","villa","viaduct") else 2}" fill="url(#window)" stroke="{trim}" stroke-width="3"/><path d="M{x+17} {y}v60m-17 -35h34" stroke="#765b4e" stroke-width="1.5"/>')
 A(f'<rect x="186" y="124" width="68" height="68" rx="4" fill="#443c3c" stroke="{trim}" stroke-width="3"/><rect x="195" y="130" width="50" height="48" fill="url(#window)" opacity=".8"/><path d="M220 130v48" stroke="#6e5652" stroke-width="2"/>')
 if motif=='snow':A('<path d="M6 98L220 8 434 98 412 95 220 24 28 100Z" fill="#e9eeeb" opacity=".9"/>')
 if motif=='timber':
  for x in [29,100,340,411]: A(f'<path d="M{x} 100v90m0-72l36 28" stroke="#4b413a" stroke-width="5"/>')
 if motif in ('harbor','pier','bridge','moon'):A(f'<path d="M12 198H428m-380 0v14m72-14v14m72-14v14m72-14v14m72-14v14" stroke="{trim}" stroke-width="4"/>')
 if motif in ('flowers','palms','cactus'):
  for x in [16,424]:
   A(f'<path d="M{x} 190v-30m0 17l-13-9m13 0l12-16" stroke="#688f71" stroke-width="4" fill="none"/><circle cx="{x}" cy="157" r="6" fill="{trim}"/>')
 if motif in ('city','ice','star','moon'):A(f'<path d="M36 78H404" stroke="{trim}" stroke-width="3" opacity=".75"/><circle cx="220" cy="62" r="8" fill="{trim}"/>')
 for i in range(110):
  x=r.randrange(28,411);y=r.randrange(101,190);A(f'<path d="M{x} {y}h{r.randrange(2,9)}" stroke="{trim}" stroke-opacity=".1" stroke-width="1"/>')
 A(f'<path d="M11 193H429V207H11Z" fill="#5a5651" stroke="{trim}" stroke-width="2"/><path d="M16 198H424" stroke="#e4c897" stroke-width="2"/></svg>')
 (root/f'station-{id}.svg').write_text(''.join(p))
