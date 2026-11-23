from pathlib import Path
from PIL import Image,ImageFilter,ImageEnhance,ImageDraw,ImageOps
import numpy as np
src=Image.open(Path(__file__).resolve().parents[1]/'assets'/'source-reference.png').convert('RGB')
w,h=src.size
bg=src.copy()
# Repaint only the HUD footprint with a continuous twilight sky.
# Prevents obsolete resource numbers from being visible underneath real controls.
import numpy as np
arr=np.array(bg).astype(np.float32)
for y in range(0,125):
 t=min(1,y/122)
 bottom=np.array(src.crop((0,122,w,123)))[0].astype(np.float32)
 top=np.array([55,49,96],dtype=np.float32)
 pixels=top*(1-t)+bottom*t
 left=520
 feather=np.minimum(1,np.maximum(0,np.arange(w-left,dtype=np.float32)/30))[:,None]
 a=(t if y>104 else 1)*feather
 arr[y,left:]=arr[y,left:]*(1-a)+pixels[left:]*a
bg=Image.fromarray(np.uint8(np.clip(arr,0,255)))
# Extend the authentic wooded slopes across an area that originally contained
# the rendered train. A new modular train is composed above this plate.
forest=src.crop((1128,160,1378,400)).convert('RGB')
for i,left in enumerate(range(0,w,260)):
 patch=forest.resize((260,228),Image.Resampling.LANCZOS)
 if i%2:patch=ImageOps.mirror(patch)
 patch=ImageEnhance.Brightness(patch).enhance(.75+(i%3)*.035)
 patch=ImageEnhance.Color(patch).enhance(.81)
 dest=Image.new('RGB',(260,228))
 dest.paste(patch)
 bg.paste(dest,(left,423))
# Blend top and bottom rows to avoid a visible horizontal strip seam.
for y in range(423,453):
 a=(y-423)/30
 upper=src.crop((0,y,w,y+1)).convert('RGB')
 lower=bg.crop((0,y,w,y+1)).convert('RGB')
 bg.paste(Image.blend(upper,lower,a),(0,y))
for y in range(622,651):
 a=(651-y)/29
 upper=src.crop((0,y,w,y+1)).convert('RGB')
 lower=bg.crop((0,y,w,y+1)).convert('RGB')
 bg.paste(Image.blend(upper,lower,a),(0,y))
# Blend a matching section of the original valley with seamless Poisson cloning
# so the removed screenshot's interface has no visible hard-edged photo seams.
import cv2
arr=cv2.cvtColor(np.array(bg),cv2.COLOR_RGB2BGR)
patch=arr[195:470,910:1380].copy()
clone_mask=np.ones((275,470),dtype=np.uint8)*255
clone_mask[:8,:]=0;clone_mask[-8:,:]=0;clone_mask[:,:8]=0;clone_mask[:,-8:]=0
newarr=cv2.seamlessClone(patch,arr,clone_mask,(680,332),cv2.NORMAL_CLONE)
bg=Image.fromarray(cv2.cvtColor(newarr,cv2.COLOR_BGR2RGB))
# Restore low rail bed color under cutouts, no bright baked scenery/duplicate train.
bg.save(str(Path(__file__).resolve().parents[1]/'assets'/'world.webp'),'WEBP',quality=92,method=6)
print('wrote',w,h)
