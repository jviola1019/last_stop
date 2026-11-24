"""Reproducible pixel-art finishing for authored vector assets, not an external image model.
SVG wrappers preserve existing paths and use embedded, palette-quantized PNGs. Original sunset and painted carriage PNGs are unchanged.
Run paint_regions.py, paint_rooms.py, paint_living_rooms.py, paint_engines.py and paint_stations.py first to regenerate source geometry.
Dependencies for art tooling only: CairoSVG, Pillow, NumPy. Runtime remains dependency-free.
"""
from pathlib import Path
import base64,io,re,hashlib
import cairosvg
from PIL import Image
import numpy as np
root=Path(__file__).resolve().parents[1]/'assets'
for p in sorted(root.glob('*.svg')):
 if not p.name.startswith(('car-','engine-','region-','station-')):continue
 svg=p.read_text()
 if 'data:image/png;base64' in svg:continue # idempotent, regenerate geometry for a new pass
 m=re.search(r'viewBox="0 0 (\d+) (\d+)"',svg)
 if not m:raise ValueError(p)
 w,h=map(int,m.groups());ratio=2;sw,sh=round(w/ratio),round(h/ratio)
 # Raster art at the actual pixel grid, followed by subtle, deterministic dither and a warm/cool shadow script.
 raw=cairosvg.svg2png(bytestring=svg.encode(),output_width=sw,output_height=sh)
 im=Image.open(io.BytesIO(raw)).convert('RGBA');a=np.array(im,dtype=np.float32);rgb=a[:,:,:3];alpha=a[:,:,3]
 seed=int.from_bytes(hashlib.sha256(p.name.encode()).digest()[:8],'big');rng=np.random.default_rng(seed)
 noise=rng.normal(0,1.7,(sh,sw,1));lum=rgb.mean(axis=2,keepdims=True)/255
 warm=np.array([5.0,1.5,-3.5]);cool=np.array([-2.0,0.5,3.0]);rgb=np.clip(rgb+noise+lum*warm+(1-lum)*cool,0,255)
 a[:,:,:3]=rgb;a[:,:,3]=np.where(alpha>=128,255,0) if p.name.startswith(('engine-','station-','car-')) else alpha
 art=Image.fromarray(a.astype(np.uint8),'RGBA')
 # Palette supports transparent edges; 256 colors are intentional for consistent pixel-art texture.
 art=art.quantize(colors=256,method=Image.Quantize.FASTOCTREE,dither=Image.Dither.FLOYDSTEINBERG)
 out=io.BytesIO();art.save(out,format='PNG',optimize=True);encoded=base64.b64encode(out.getvalue()).decode()
 wrapper=f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><image x="0" y="0" width="{w}" height="{h}" image-rendering="pixelated" href="data:image/png;base64,{encoded}" xlink:href="data:image/png;base64,{encoded}"/></svg>'
 # SVG2 href is supported by target engines. Avoid duplicating base64 payload; legacy xlink omitted.
 wrapper=wrapper.replace(f' xlink:href="data:image/png;base64,{encoded}"','')
 p.write_text(wrapper)
 print(p.name, len(wrapper))
