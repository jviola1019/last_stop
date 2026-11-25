"""Original 16 carriage cutaways for Service Railway. No network or licensed assets."""
from pathlib import Path
from html import escape
import math, base64, io, hashlib
import cairosvg
from PIL import Image
import numpy as np
ROOT=Path(__file__).resolve().parents[1]/'assets'
# Individual palettes and compositions: same carriage chassis, different purpose-built interiors.
ROOMS={
'quarters':('#64546b','#e8b77e','CREW QUARTERS'), 'newsstand':('#537783','#e9b96f','NEWSSTAND'),
 'tea':('#8b6a58','#d9bba2','TEA SALON'),'barber':('#884b54','#e5c796','BARBER SHOP'),
 'florist':('#547b64','#e5afbd','FLOWER MARKET'),'music':('#65557c','#edd096','MUSIC ROOM'),
 'apothecary':('#536e5f','#edcc8b','APOTHECARY'),'photography':('#5b6074','#dfad81','PHOTO STUDIO'),
 'tailor':('#84565c','#e8bf87','TAILOR ATELIER'),'aquarium':('#347b82','#a7d5b6','AQUARIUM'),
 'cheese':('#9a7047','#f1d59c','CHEESE PANTRY'),'museum':('#766650','#d9be83','RAILWAY MUSEUM'),
 'pottery':('#a0634d','#e8c8a4','POTTERY STUDIO'),'bookshop':('#555a78','#e5c28e','BOOKSHOP'),
 'suite':('#6d475b','#efd09d','PULLMAN SUITE'),'planetarium':('#34445e','#bfd3e6','PLANETARIUM')}

def r(x,y,w,h,col,st='none',rx=1):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{col}" stroke="{st}" stroke-width="1.4"/>'
def e(x,y,rx,ry,col,st='none'):return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{col}" stroke="{st}" stroke-width="1.2"/>'
def l(x,y,x2,y2,col='#e1b87b',w=2):return f'<path d="M{x} {y}L{x2} {y2}" stroke="{col}" stroke-width="{w}" stroke-linecap="round"/>'
def poly(points,col,stroke='none'):return f'<polygon points="{points}" fill="{col}" stroke="{stroke}" stroke-width="1.3"/>'
def label(x,y,t,sz=7,col='#e9c78c'):return f'<text x="{x}" y="{y}" text-anchor="middle" fill="{col}" font-family="Georgia,serif" font-size="{sz}" font-weight="bold">{escape(t)}</text>'
wood='#644a3c';gold='#d2a96e';ivory='#f2d4a3';dark='#292934';teal='#5b8c82';coral='#bb7968'
def shelf(x,y,w,rows=3,items='books'):
 out=r(x,y,w,rows*20+6,wood,gold,2)
 for a in range(rows):
  yy=y+5+a*20
  for i in range(int(w//10)-1):
   xx=x+4+i*10;c=[teal,coral,ivory,'#807396','#c1a35e'][(i+a)%5]
   if items=='books':out+=r(xx,yy+2+(i%3),7,12-i%3,c,dark)+l(xx+2,yy+4,xx+2,yy+11,gold,1)
   elif items=='jars':out+=r(xx+1,yy+4,7,12,c,dark,2)+r(xx+1,yy+2,7,3,gold)
   elif items=='vases':out+=e(xx+4,yy+11,4,5,c,dark)+r(xx+2,yy+2,4,6,c,dark)
   elif items=='paper':out+=r(xx,yy+3,8,11,'#d8c7a0',dark)+l(xx+2,yy+6,xx+6,yy+6,wood,1)+l(xx+2,yy+9,xx+6,yy+9,wood,1)
  out+=r(x+2,yy+16,w-4,3,gold)
 return out

def desk(x,y,w=55):return r(x,y,w,10,gold,wood)+r(x+4,y+10,5,22,wood)+r(x+w-9,y+10,5,22,wood)+r(x+9,y+12,w-18,10,'#785841',gold)
def seat(x,y,c=teal):return r(x,y,20,20,c,gold,4)+r(x-3,y+13,26,8,c,gold,2)+l(x+3,y+21,x+3,y+27,wood,3)+l(x+17,y+21,x+17,y+27,wood,3)
def table(x,y):return e(x,y,20,6,gold,wood)+r(x-2,y+4,4,23,wood)+e(x,y+27,12,3,wood)
def bed(x,y,w=65,c=teal):return r(x,y,w,26,c,gold,4)+r(x+3,y+3,19,20,ivory,gold,3)+r(x+24,y+4,w-29,17,c,wood)+r(x,y+23,w,6,wood,gold)+l(x+3,y+29,x+3,y+34,wood,4)+l(x+w-3,y+29,x+w-3,y+34,wood,4)
def plant(x,y,c=teal):
 out=poly(f'{x-7},{y} {x+7},{y} {x+4},{y+12} {x-4},{y+12}',coral,wood)
 for dx,dy in [(-5,-9),(1,-13),(7,-7)]:out+=l(x,y,x+dx,y+dy,c,1.5)+e(x+dx,y+dy,4,3,c)
 return out

def lamp(x,y):return l(x,48,x,y,wood,1.5)+poly(f'{x-6},{y} {x+6},{y} {x+11},{y+10} {x-11},{y+10}',ivory,gold)+e(x,y+12,5,2,'#fff1c1')
def scenery(x,y,w=50,h=45):
 return r(x,y,w,h,'#537586',gold,4)+poly(f'{x+1},{y+h-9} {x+w*.25},{y+10} {x+w*.53},{y+h-18} {x+w*.78},{y+13} {x+w-1},{y+h-8} {x+w-1},{y+h-1} {x+1},{y+h-1}','#425f62')+l(x+w/2,y+1,x+w/2,y+h-1,gold,1.5)+l(x+1,y+h/2,x+w-1,y+h/2,gold,1)
def vase(x,y,c):return e(x,y,8,13,c,wood)+r(x-4,y-15,8,7,c,gold)+l(x-5,y+1,x+5,y+1,gold,1)
def room(k,c,a):
 if k=='quarters':return r(26,61,104,93,'#625052',gold)+bed(32,78,87,'#5b7e84')+bed(32,119,87,'#896b7d')+l(123,82,123,152,gold,3)+''.join(l(117,y,129,y,gold,2) for y in range(87,150,12))+r(145,73,42,80,wood,gold)+''.join(r(149,77+i*24,34,21,'#937354',gold)+e(178,88+i*24,1.6,1.6,gold) for i in range(3))+desk(195,130,48)+seat(207,111)
 if k=='newsstand':return shelf(22,64,77,4,'paper')+shelf(178,65,74,4,'paper')+r(111,79,56,51,'#d3b98d',wood)+''.join(l(114,84+i*7,164,84+i*7,wood,1) for i in range(6))+desk(103,139,70)+r(128,127,23,13,dark,gold)+label(139,136,'PRESS',5)
 if k=='tea':return shelf(22,66,48,3,'jars')+desk(22,138,58)+seat(92,119,'#9b766a')+table(137,130)+seat(163,119,'#9b766a')+seat(192,119,'#9b766a')+table(225,132)+e(137,124,9,5,ivory,gold)+e(225,126,7,4,ivory,gold)+r(110,65,56,27,'#d9c6a2',gold)+label(138,82,'TEA',11,wood)+plant(248,144)
 if k=='barber':return r(21,65,48,56,wood,gold)+r(26,70,38,41,'#abc2c2',gold,6)+seat(35,118,coral)+r(104,65,48,56,wood,gold)+r(109,70,38,41,'#abc2c2',gold,6)+seat(118,118,coral)+shelf(183,66,66,3,'jars')+desk(181,139,67)+''.join(l(76,y,90,y+4,ivory,3) for y in range(70,114,9))
 if k=='florist':return ''.join(plant(x,y,col) + e(x-5,y-9,5,4,fl) +e(x+6,y-10,5,4,fl) for x,y,col,fl in [(32,125,'#5d986c','#e3a3b1'),(65,130,'#4c8766','#f1c17c'),(104,121,'#6ca077','#b3a3d6'),(172,126,'#519875','#d5908b'),(210,128,'#5c936c','#f2d19a'),(242,117,'#5d986c','#f3b3c4')])+r(21,142,232,10,wood,gold)+r(99,72,78,29,wood,gold)+label(138,91,'FRESH FLOWERS',8)+''.join(e(x,111,7,6,ivory,wood) for x in [44,89,186,227])
 if k=='music':return r(26,95,91,55,dark,gold,5)+r(25,119,93,15,ivory,wood)+''.join(l(28+i*5,119,28+i*5,134,wood,1) for i in range(17))+''.join(r(30+i*7,119,3,8,dark) for i in range(12))+l(31,150,31,163,wood,4)+l(111,150,111,163,wood,4)+seat(73,137,'#806b93')+e(168,122,16,28,coral,gold)+l(168,93,168,72,gold,4)+l(159,119,177,119,wood,2)+desk(196,138,50)+r(207,76,27,45,wood,gold)+e(221,99,11,12,'#ccaf79',dark)+label(139,63,'LIVE RECITAL',7)
 if k=='apothecary':return shelf(22,60,104,4,'jars')+shelf(151,60,101,4,'jars')+desk(83,136,114)+e(136,130,15,7,ivory,wood)+l(132,125,145,113,wood,5)+plant(190,130)+r(125,71,24,33,'#b7c5a7',gold)+label(138,91,'HERBS',5)
 if k=='photography':return r(25,61,69,90,'#3d374d',gold)+r(33,70,53,71,'#a5727d',wood)+seat(48,121,coral)+r(108,93,32,22,dark,gold,3)+e(124,104,8,8,'#718b91',gold)+l(124,115,100,157,wood,3)+l(124,115,148,157,wood,3)+l(124,115,124,157,wood,3)+desk(167,138,79)+r(178,72,52,48,wood,gold)+r(182,76,44,40,'#d8c6a5')+e(204,87,8,8,coral)+poly('185,112 204,93 226,112',teal)+label(205,62,'PORTRAITS',8)
 if k=='tailor':return shelf(24,65,57,3,'paper')+''.join(r(86+i*12,67,10,59,col,gold,4) for i,col in enumerate([teal,coral,'#6f7196',ivory]))+desk(24,138,103)+r(53,125,35,13,dark,gold)+l(59,125,59,117,wood,4)+e(161,81,12,9,ivory,wood)+poly('149,90 173,90 184,137 138,137',teal,gold)+l(161,137,161,159,wood,4)+e(222,81,12,9,ivory,wood)+poly('210,90 234,90 245,138 199,138',coral,gold)+l(222,138,222,159,wood,4)
 if k=='aquarium':
  out=r(24,62,228,84,'#234d62',gold,6)+r(30,68,216,71,'#3e7f8a',ivory,3)+poly('30,125 83,116 125,131 178,112 246,128 246,139 30,139','#5e9c8c')
  for x,y,col in [(52,88,'#eac478'),(94,113,'#d99379'),(143,90,'#e7c078'),(197,110,'#d99379'),(225,84,'#d1da9b')]:out+=e(x,y,9,5,col,wood)+poly(f'{x+8},{y} {x+16},{y-6} {x+16},{y+6}',col)+e(x-4,y-1,1,1,dark)+e(x+6,y-13,2,2,'#b9e1d8')
  return out+''.join(plant(x,131,'#75b599') for x in [45,77,160,214])+r(24,146,228,13,wood,gold)+seat(105,140)+seat(154,140)
 if k=='cheese':return shelf(22,65,68,4,'jars')+r(103,70,146,74,'#426263',gold,4)+r(109,76,134,62,'#9fb9a3',gold)+''.join(e(x,y,16,6,'#f1c875',wood)+r(x-15,y-8,30,8,'#e1b85e',wood) for x in [128,172,218] for y in [96,125])+desk(95,143,155)+label(177,61,'AGED & FRESH',8)
 if k=='museum':return r(24,65,70,76,'#594b41',gold)+e(58,93,22,22,ivory,gold)+l(58,93,58,77,wood,3)+l(58,93,69,99,wood,3)+label(59,133,'1890',8)+r(103,79,147,61,'#6e8b91',gold,4)+r(109,85,135,48,'#b8c7b3',ivory)+r(132,106,65,16,dark,gold,3)+r(150,95,24,17,teal,gold)+r(124,102,8,18,wood,gold)+''.join(e(x,124,6,6,dark,gold) for x in [141,161,185])+l(116,132,235,132,wood,2)+desk(103,140,147)
 if k=='pottery':return shelf(23,63,86,4,'vases')+r(124,76,51,71,coral,gold,9)+r(133,93,33,35,dark,gold,6)+e(149,116,10,9,'#d79159')+r(181,133,66,11,wood,gold)+l(189,144,189,159,wood,4)+l(239,144,239,159,wood,4)+e(213,131,25,6,gold,wood)+vase(213,117,'#dfb38d')+label(150,66,'KILN',7)
 if k=='bookshop':return shelf(22,60,83,4,'books')+shelf(170,60,83,4,'books')+desk(113,137,49)+r(114,128,17,8,teal,gold)+r(136,128,18,8,coral,gold)+seat(118,104,'#86749a')+r(111,65,54,24,wood,gold)+label(138,81,'FIRST EDITIONS',6)+plant(162,146)
 if k=='suite':return r(25,65,128,80,wood,gold,3)+bed(30,114,116,'#78546c')+r(35,76,104,29,'#a98777',gold)+r(41,81,92,19,'#c7a694',gold)+desk(163,132,84)+r(190,90,28,35,wood,gold)+r(194,94,20,27,'#8fb4b9',gold)+seat(184,118,'#6b7f87')+plant(244,143)
 if k=='planetarium':
  out='<path d="M24 131 Q24 56 138 56 Q252 56 252 131Z" fill="#25334e" stroke="#c3b68a" stroke-width="2"/>'
  for i in range(40):
   x=37+(i*53)%202;y=70+(i*31)%51
   if ((x-138)/110)**2+((y-131)/72)**2<1:out+=e(x,y,1.2 if i%5 else 2,1.2 if i%5 else 2,'#e9d6a3')
  return out+l(84,101,123,76,'#91aab7',1)+l(123,76,169,93,'#91aab7',1)+e(185,79,10,10,'#b2a9c6')+''.join(seat(x,132,'#615878') for x in [46,85,154,194,229])+r(124,122,28,30,dark,gold)+e(138,122,14,7,'#6c8995',gold)
 raise ValueError(k)

for k,(c,a,name) in ROOMS.items():
 out=f'''<svg xmlns="http://www.w3.org/2000/svg" width="276" height="226" viewBox="0 0 276 226"><defs><linearGradient id="shell" x2="0" y2="1"><stop stop-color="{c}"/><stop offset="1" stop-color="#272b32"/></linearGradient><linearGradient id="wall" x2="0" y2="1"><stop stop-color="#e6cda3"/><stop offset="1" stop-color="#99775a"/></linearGradient></defs>'''
 out+=e(138,213,127,8,'#29262c')+r(4,25,268,171,'url(#shell)','#332a2d',20)+r(12,34,252,137,'url(#wall)',gold,12)+r(16,46,244,9,'#806049',gold)+r(16,155,244,12,'#594336',gold)
 for x in (24,86,148,210):out+=scenery(x,60,42,48)
 for x in (65,138,211):out+=lamp(x,55)
 out+=room(k,c,a)
 # Cutaway frame, trim, distinct colored roof, destination plate and undercarriage.
 out+=r(12,25,252,12,c,gold,6)+r(16,164,244,7,gold)+r(20,175,236,18,c,wood,5)+r(61,179,154,10,dark,gold,2)+label(138,187,name,7)+r(24,196,228,5,wood)+l(4,188,0,188,gold,4)+l(272,188,276,188,gold,4)
 for x in (62,216):out+=e(x,204,16,16,dark,gold)+e(x,204,8,8,'#69606a',gold)+e(x,204,3,3,gold)
 out+='</svg>\n'
 # Deterministic full-resolution finishing: warm overhead light, cool shadows,
 # subtle grain and a common 256-colour palette treatment with prior art.
 im=Image.open(io.BytesIO(cairosvg.svg2png(bytestring=out.encode()))).convert('RGBA')
 arr=np.array(im,dtype=np.float32); rgb=arr[:,:,:3]; yy,xx=np.mgrid[:226,:276]
 light=np.clip(1-np.sqrt(((xx-138)/175)**2+((yy-63)/180)**2),0,1)[...,None]
 rng=np.random.default_rng(int.from_bytes(hashlib.sha256(k.encode()).digest()[:8],'big'))
 arr[:,:,:3]=np.clip(rgb*(.90+.12*light)+light*np.array([8,4,-2])+rng.normal(0,2.1,(226,276,1)),0,255)
 art=Image.fromarray(arr.astype(np.uint8),'RGBA').quantize(colors=256,method=Image.Quantize.FASTOCTREE,dither=Image.Dither.FLOYDSTEINBERG)
 buf=io.BytesIO();art.save(buf,format='PNG',optimize=True);encoded=base64.b64encode(buf.getvalue()).decode()
 (ROOT/f'car-{k}.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="276" height="226" viewBox="0 0 276 226"><image width="276" height="226" image-rendering="pixelated" href="data:image/png;base64,{encoded}"/></svg>')
print(f'Painted {len(ROOMS)} original room compositions')
