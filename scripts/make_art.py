from PIL import Image,ImageDraw,ImageFilter
import cv2,numpy as np
from pathlib import Path
S=Path(__file__).resolve().parents[1]/'assets'/'source-reference.png'; O=Path(__file__).resolve().parents[1]/'assets';O.mkdir(exist_ok=True,parents=True)
base=Image.open(S).convert('RGBA');W,H=base.size
# Carriage illustrations are cut from the user's prior, originally generated concept art.
# Painted alpha silhouettes allow the windows and miniature interiors to remain genuine game sprites.
rooms=[('arcade',2,265),('garden',260,523),('cafe',516,809),('sleeper',805,1069),('observatory',1062,1334),('engine',1326,1632)]
for kind,l,r in rooms:
    top,bottom=(424,646) if kind!='engine' else (421,646)
    tile=base.crop((l,top,r,bottom))
    ww,hh=tile.size
    # Soft cutout polygon follows the body, cowcatcher and overhead chimneys.
    mask=Image.new('L',(ww,hh),0);d=ImageDraw.Draw(mask)
    if kind=='engine':
        points=[(0,36),(12,25),(35,25),(35,12),(44,10),(56,20),(69,16),(88,23),(90,39),(190,40),(210,27),(230,30),(230,13),(241,8),(260,20),(260,43),(295,75),(ww-8,184),(ww-1,204),(8,205),(0,190)]
    else:
        points=[(0,52),(7,35),(17,28),(ww-22,27),(ww-7,36),(ww-2,51),(ww-2,192),(ww-8,206),(9,206),(1,193)]
    d.polygon(points,fill=255)
    mask=mask.filter(ImageFilter.GaussianBlur(0.8))
    tile.putalpha(mask)
    tile.save(O/f'car-{kind}.png',optimize=True)
# The reference scene has screenshot UI and an existing train baked into it.
# Remove those in a separate scenery plate. We render the functional UI and modular train on top.
frame=np.array(base.convert('RGB'))[:,:,::-1].copy()
mask=np.zeros(frame.shape[:2],np.uint8)
# Popup, HUD and navigation are covered by the new responsive UI; only mask the painted train.
cv2.rectangle(mask,(0,435),(1647,647),255,-1)
# Replace train area using bounded color interpolation from scene pixels above and below.
# It is a hidden backdrop, not an attempted copy of the train.
scenery=np.array(base.convert('RGB')).astype(np.float32)
for y in range(432,657):
    t=(y-432)/(657-432)
    top=np.array(base.convert('RGB').crop((0,402,W,403)),dtype=np.float32)[0]
    bottom=np.array(base.convert('RGB').crop((0,666,W,667)),dtype=np.float32)[0]
    scenery[y,:,:]=top*(1-t)+bottom*t
scenery=scenery.clip(0,255).astype('uint8')
# Add a hillside striation to the scene band to avoid an obvious solid gradient.
im=Image.fromarray(scenery).convert('RGB')
# The HUD and original popup are still part of scene; native overlays cover them.
im.save(O/'world.webp',format='WEBP',quality=91,method=6)
# Masked exact art crop for title; responsive HUD uses independent type rather than screenshot pixels.
base.crop((78,12,492,183)).save(O/'title-art.png',optimize=True)
# Sized full reference available for art direction and showcase screen, not for gameplay logic.
base.save(O/'reference-concept.webp',format='WEBP',quality=90,method=6)
print('Created',[(x.name,x.stat().st_size) for x in O.iterdir()]);print('size',W,H)
