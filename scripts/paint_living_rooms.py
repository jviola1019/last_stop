"""Original modular SVG cutaways; no baked passenger silhouettes. Deterministic."""
from pathlib import Path
import random
root=Path(__file__).resolve().parents[1]/'assets'
rooms={'postal':('#4e6b6a','#bf9869','#8e493d'),'bakery':('#7c5745','#e0bc81','#8e725c'),'cinema':('#53435a','#c7a377','#893f50'),'lounge':('#455c58','#ddc08b','#35665a')}
for name,(wall,brass,accent) in rooms.items():
 r=random.Random(name)
 p=[f'<svg xmlns="http://www.w3.org/2000/svg" width="276" height="226" viewBox="0 0 276 226"><defs><linearGradient id="w" x2="0" y2="1"><stop stop-color="{wall}"/><stop offset="1" stop-color="#282c32"/></linearGradient><linearGradient id="wood" x2="0" y2="1"><stop stop-color="#a37d59"/><stop offset="1" stop-color="#49382f"/></linearGradient><radialGradient id="lamp"><stop stop-color="#ffe5ab" stop-opacity=".7"/><stop offset="1" stop-color="#ffe5ab" stop-opacity="0"/></radialGradient></defs>',f'<rect x="4" y="22" width="268" height="173" rx="18" fill="#202d36" stroke="{brass}" stroke-width="3"/><rect x="13" y="36" width="250" height="126" rx="6" fill="url(#w)"/><path d="M15 156H261V185H15Z" fill="url(#wood)"/><path d="M19 27H257M18 39H258M17 183H259" stroke="{brass}" stroke-width="2.5"/><path d="M19 161H257" stroke="#e4bc84" stroke-width="1.2"/>']
 for i in range(8):p.append(f'<path d="M{20+i*31} 161l-9 24" stroke="#322c29" opacity=".5"/>')
 for x in (37,138,238):p.extend([f'<circle cx="{x}" cy="69" r="36" fill="url(#lamp)"/>',f'<path d="M{x} 40V55" stroke="{brass}" stroke-width="2"/><path d="M{x-7} 57h14l4 10h-22Z" fill="#f5db9e" stroke="#946e48" stroke-width="1.5"/>'])
 def rect(x,y,w,h,fill,stroke='#47392e',rx=1):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="1.2"/>'
 def window(x,y,w,h):return rect(x,y,w,h,'#789a9f',brass,3)+f'<path d="M{x+2} {y+h-4}l{w*.27} {-h*.46} {w*.24} {h*.26} {w*.28} {-h*.4} {w*.14} {h*.6}Z" fill="#405f66"/><path d="M{x+w/2} {y}v{h}" stroke="{brass}" stroke-width="2"/>'
 if name=='postal':
  for x in (25,178):
   p.append(rect(x,78,73,75,'#624c3a',brass,2))
   for row in range(3):
    for col in range(4):
     a=x+4+col*17;b=82+row*22;p.append(rect(a,b,15,19,'#373b38','#ac875d'));p.append(rect(a+2,b+5,11,8,r.choice(['#b99870','#d8c3a0','#947c5e']),'#514438'));p.append(f'<path d="M{a+2} {b+5}l5.5 4 5.5-4" fill="none" stroke="#73634c" stroke-width=".7"/>')
  p.extend([window(108,78,59,42),rect(104,131,68,12,'#bc9767',brass),rect(110,143,6,22,'#6b4d38'),rect(160,143,6,22,'#6b4d38'),rect(119,121,19,10,'#c9aa7d'),rect(142,117,16,14,'#99704a')])
 elif name=='bakery':
  p.extend([window(20,77,59,45),rect(20,127,77,26,'#9b744f',brass),rect(104,80,64,72,'#514947',brass,4),rect(112,88,48,39,'#352a29','#b89973',3),rect(111,133,50,10,'#967451'),rect(177,79,71,73,'#72503e',brass)])
  for row in range(3):
   p.append(f'<path d="M180 {103+row*23}h65" stroke="{brass}" stroke-width="2"/>')
   for col in range(4):p.append(f'<ellipse cx="{187+col*17}" cy="{96+row*23}" rx="6.8" ry="5.5" fill="{r.choice(["#eac88f","#b47c43","#e3ae6b"])}" stroke="#795133"/>')
  p.append(rect(25,119,65,8,'#f0ce99'))
 elif name=='cinema':
  p.extend([rect(79,75,118,58,'#23252e',brass,3),rect(85,80,106,45,'#b8ac92','#f0d3a2'),f'<path d="M85 125l29-24 18 8 26-22 33 38Z" fill="#6b8585"/><circle cx="165" cy="91" r="7" fill="#edd6a0"/>',rect(22,77,42,60,accent,brass,3),rect(212,77,42,60,accent,brass,3)])
  for x in (44,95,147,198):p.extend([rect(x,142,33,16,accent,brass,4),rect(x+3,134,27,11,accent,brass,4),rect(x+4,158,25,5,'#5c443d')])
 else:
  for x in (23,99,175):p.append(window(x,75,74,50))
  for x in (25,180):p.extend([rect(x,132,72,25,accent,brass,6),rect(x,126,72,13,accent,brass,5),rect(x-2,136,9,20,'#9a744f',brass,3),rect(x+65,136,9,20,'#9a744f',brass,3)])
  p.extend([rect(111,142,55,11,'#af865d',brass,5),rect(118,153,5,12,'#795c43'),rect(155,153,5,12,'#795c43'),'<ellipse cx="138" cy="140" rx="8" ry="4" fill="#f1d9af"/>'])
 for x in (12,264):p.append(f'<path d="M{x} 45v132" stroke="{brass}" stroke-width="3"/>')
 p.extend(['<rect x="11" y="192" width="254" height="10" rx="4" fill="#2d3139"/>','<path d="M27 205H248" stroke="#8b7152" stroke-width="4"/>'])
 for x in (62,216):p.append(f'<circle cx="{x}" cy="204" r="13" fill="#2b3335" stroke="{brass}" stroke-width="3"/><circle cx="{x}" cy="204" r="4" fill="{brass}"/>')
 p.append('</svg>');(root/f'car-{name}.svg').write_text('\n'.join(p))
