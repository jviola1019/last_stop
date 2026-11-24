"""Reproducible Everline heritage mark; dev-only CairoSVG/Pillow, no runtime dependency."""
from pathlib import Path
from io import BytesIO
import cairosvg
from PIL import Image
root=Path(__file__).resolve().parents[1]
assets=root/'assets'
# Badge fits radius 198 of a 512 canvas; maskable radius is 204.8.
# At 16px the locomotive, gold rim, and sunset remain the identifying marks.
mark='''<defs><clipPath id="roundel"><circle cx="256" cy="256" r="181"/></clipPath></defs>
<circle cx="256" cy="256" r="198" fill="#ad7941"/>
<circle cx="256" cy="256" r="191" fill="#f4d39b"/>
<circle cx="256" cy="256" r="181" fill="#283449"/>
<g clip-path="url(#roundel)">
  <path d="M70 75H442V264H70Z" fill="#68647b"/>
  <path d="M70 163H442V264H70Z" fill="#ac7180"/>
  <path d="M70 199H442V275H70Z" fill="#d88c6c"/>
  <circle cx="318" cy="173" r="57" fill="#f8ce8a"/>
  <path d="M62 275L164 155 214 210 249 186 315 261 358 220 448 285V442H62Z" fill="#4b5770"/>
  <path d="M119 207L164 155 204 200 166 181 151 203Z" fill="#f1c3a1"/>
  <path d="M62 304L129 250 181 285 245 244 302 282 358 254 450 308V442H62Z" fill="#293d4a"/>
  <path d="M65 326H447V442H65Z" fill="#202f37"/>
  <path d="M190 346L136 444M322 346L376 444" stroke="#e5b977" stroke-width="13"/>
  <path d="M159 397H353M143 426H369" stroke="#996a48" stroke-width="10"/>
</g>
<!-- Front-facing steam engine, broad forms intended to survive small-icon rendering. -->
<path d="M166 225Q166 197 190 191H322Q346 197 346 225V346H166Z" fill="#151e29" stroke="#17202b" stroke-width="12" stroke-linejoin="round"/>
<path d="M159 221L174 194H338L353 221Z" fill="#e1b276" stroke="#1a232e" stroke-width="9" stroke-linejoin="round"/>
<path d="M177 226H335V340H177Z" fill="#294f59"/>
<path d="M193 240H222V268H193ZM290 240H319V268H290Z" fill="#f2ca85"/>
<path d="M239 184H273L270 210H242Z" fill="#192630" stroke="#c78e52" stroke-width="6"/>
<circle cx="256" cy="293" r="68" fill="#172530" stroke="#e2ad69" stroke-width="9"/>
<circle cx="256" cy="293" r="49" fill="#2b4854" stroke="#91633f" stroke-width="6"/>
<circle cx="256" cy="293" r="25" fill="#f3d49b" stroke="#192630" stroke-width="8"/>
<path d="M181 343H331L350 367H162Z" fill="#a65243" stroke="#192630" stroke-width="9" stroke-linejoin="round"/>
<path d="M184 367H328L344 390H168Z" fill="#dbad70" stroke="#192630" stroke-width="8" stroke-linejoin="round"/>
<path d="M210 371V388M239 371V388M273 371V388M302 371V388" stroke="#543b35" stroke-width="7"/>
'''
svg=lambda background: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'+background+mark+'</svg>\n'
regular=svg('<rect x="12" y="12" width="488" height="488" rx="108" fill="#1b2634"/>')
maskable=svg('<rect width="512" height="512" fill="#1b2634"/>')
(assets/'icon.svg').write_text(regular)
(assets/'icon-maskable.svg').write_text(maskable)
def draw(source,n):
    return Image.open(BytesIO(cairosvg.svg2png(bytestring=source.encode(),output_width=n,output_height=n))).convert('RGBA')
def save(source,n,path):
    draw(source,n).save(path,optimize=True)
for n in (32,192,512): save(regular,n,assets/f'icon-{n}.png')
save(maskable,512,assets/'icon-maskable.png')
save(maskable,180,assets/'apple-touch-icon.png')
icons=root/'src-tauri'/'icons'; save(regular,512,icons/'icon.png')
draw(regular,256).save(icons/'icon.ico',sizes=[(16,16),(24,24),(32,32),(48,48),(64,64),(128,128),(256,256)])
print('Generated eight PNG/ICO/SVG outputs and source mask variant')
