"""Reconstruct the inherited flattened scene into a HUD-free plate and an independent brand sprite.
All artwork derives from the approved reference, not new network assets. Keep original source immutable.
"""
from pathlib import Path
import cv2, numpy as np
import subprocess,sys
from PIL import Image, ImageFilter, ImageDraw
p=Path(__file__).resolve().parents[1]/'assets'
a=np.asarray(Image.open(p/'source-reference.png').convert('RGB'));h,w=a.shape[:2]
# Start with the exact original plate; reconstruct only UI and old train footprints.
subprocess.run([sys.executable,str(Path(__file__).with_name('clean_world.py'))],check=True)
old=np.asarray(Image.open(p/'world.webp').convert('RGB')); b=old.copy(); rng=np.random.default_rng(17)
# Preserve title letters and emblem as a separate transparent sprite, not a screenshot panel.
x0,y0,x1,y1=85,20,510,179
crop=a[y0:y1,x0:x1].astype(float);r,g,bl=np.moveaxis(crop,2,0)
# Ivory/brass title lettering; suppress the twilight-blue scene behind the lettering.
mask=np.clip((r-123)/45,0,1)*np.clip((g-103)/40,0,1)*np.clip((g-bl+5)/27,0,1)
# Suppress surrounding sky/foliage beyond the actual logotype silhouette.
mask[:8]=0;mask[-4:]=0;mask[:,:6]=0;mask[:,-6:]=0
alpha=(mask*255).astype('uint8')
Image.fromarray(np.dstack([crop.astype('uint8'),alpha])).save(p/'brand.png',optimize=True)
# Remove the title, including antialiased dark edges. Inpaint the small lettering shapes, not a full rectangle.
brandmask=np.zeros((h,w),np.uint8);brandmask[y0:y1,x0:x1]=cv2.dilate((alpha>30).astype(np.uint8)*255,np.ones((9,9),np.uint8))
b=cv2.inpaint(b,brandmask,7,cv2.INPAINT_TELEA)
# Restore the twilight under the former title without flattening the surrounding tree canopy.
for y in range(20,180):
 for x in range(80,515):
  f=min(1,(x-80)/45,(515-x)/40,(y-20)/25,(180-y)/30)
  v=b[y,x].astype(float);chroma=v[2]-v[0];sky=np.array([66,55,91],float)*(1-y/180)+np.array([155,102,129],float)*(y/180)
  if chroma>8 and v.mean()<125: # former translucent navy shadow only
   b[y,x]=np.clip(v*(1-.42*f)+sky*(.42*f),0,255)

# Upper twilight sky: low-pass *horizontal* color variation; no columns of copied HUD pixels.
# Use a pixel-scale texture sampled from the original and preserve clouds beyond the HUD footprint.
anchor=cv2.GaussianBlur(a[106:148].astype(np.float32),(0,0),18).mean(axis=0)
for y in range(0,142):
 t=y/142;top=np.array([53,48,88],np.float32)
 sky=(1-t)*top+t*anchor+ rng.normal(0,.75,(w,1))
 x=np.arange(w);feather=np.clip((x-505)/35,0,1)*np.clip((142-y)/34,0,1)
 b[y]=np.clip(b[y]*(1-feather[:,None])+sky*feather[:,None],0,255).astype(np.uint8)
# The popup masks mountains/forest. Reconstruct with nearby same-height mountain/wood textures.
# Source patches deliberately exclude windows, train, lettering and sky/sun.
mask_popup=np.zeros((h,w),np.uint8);cv2.rectangle(mask_popup,(490,224),(884,444),255,-1)
# Use previous reconstruction only in popup region; blend with approved source outside.
# Rebuild the shadowed trackside band by blending different clean forest/rock textures,
# eliminating repeating suns and old stations. All patches come from clean areas of the reference.
# Pixel-scale forest bank from a controlled palette, distinct from the existing distant mountains.
# A single deterministic topographic layer is more natural than repeating screenshot structures.
bw,bh=w//2,110
bank=Image.new('RGB',(bw,bh));d=ImageDraw.Draw(bank)
for yy in range(bh):
 t=yy/(bh-1);color=tuple(int(c) for c in np.array([60,63,80])*(1-t)+np.array([43,61,53])*t)
 d.line((0,yy,bw,yy),fill=color)
for layer in range(3):
 col=[(54,68,75),(39,59,59),(31,49,45)][layer];outline=[(42,55,69),(31,49,55),(25,43,41)][layer];highlight=[(79,81,84),(65,83,71),(61,81,57)][layer]
 for x in range(-10,bw+14,10-layer):
  xx=x+int(rng.integers(-5,6));base=int(43+layer*26+9*np.sin(xx/37)+rng.integers(-8,9));height=int(rng.integers(18+layer*7,43+layer*10));wide=int(height*.31)
  d.line((xx,base-height//3,xx,base+3),fill=outline,width=2)
  for i in range(5):
   top=base-height+int(height*i*.115);bottom=top+int(height*.43);half=max(2,int(wide*(.34+i*.16)));d.polygon([(xx,top),(xx-half,bottom-2),(xx-half//2,bottom+2),(xx,bottom),(xx+half,bottom)],fill=outline);d.polygon([(xx,top+2),(xx-half+2,bottom-2),(xx+1,bottom-1),(xx+half-3,bottom-1)],fill=col)
   d.line((xx-half+2,bottom-2,xx-2,bottom-5),fill=highlight,width=1)
for i in range(1600):
 x=int(rng.integers(0,bw));y=int(rng.integers(75,bh));color=[(85,90,62),(111,95,65),(51,71,49),(69,79,61)][i%4];d.point((x,y),fill=color)
band=np.asarray(bank.resize((w,220),Image.Resampling.NEAREST)).astype(np.float32)
# Replace the original inspector and train above the animated rails. Keep the original clean field beyond.
for y in range(403,646):
 if y<425:
  f=(y-403)/22
  row=band[0]
 elif y>=625:
  f=(646-y)/21;row=band[-1]
 else:
  f=1;row=band[min(219,y-425)]
 b[y]=(b[y]*(1-f)+row*f).clip(0,255).astype(np.uint8)
# Extend the clean illustrated riverbank beyond the old navigation footprint.
# Mirrored reflection of the natural river detail; darkens gradually to ground the scene.
for y in range(812,h):
 sy=max(655,811-(y-812));factor=1-.20*(y-812)/(h-812)
 b[y]=np.clip(a[sy].astype(float)*factor,0,255).astype('uint8')
Image.fromarray(b).save(p/'world.webp','WEBP',quality=92,method=6)
print('HUD-free landscape and independent brand exported')
