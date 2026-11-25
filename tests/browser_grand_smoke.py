"""V7 UI regression: actual source + asset data, with no network or external dependencies."""
from pathlib import Path
import base64,json,re,subprocess,shutil
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
images={}
for f in (root/'assets').iterdir():
 if f.suffix in ('.png','.webp','.svg'):
  mime={'.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'}[f.suffix];images[f.name]=f'data:{mime};base64,'+base64.b64encode(f.read_bytes()).decode()
urls={}
def module(name):
 if name in urls:return urls[name]
 text=(root/'src'/name).read_text().replace("const src=n=>new URL('../assets/'+n,import.meta.url).href;","const src=n=>window.__assetUrls[n];").replace("const path=name=>new URL('../assets/'+name,import.meta.url).href;","const path=name=>window.__assetUrls[name];")
 for dep in ['data.js','economy.js','art.js','save.js']:
  if dep!=name and f"'./{dep}'" in text:text=text.replace(f"'./{dep}'",f"'{module(dep)}'")
 urls[name]='data:text/javascript;base64,'+base64.b64encode(text.encode()).decode();return urls[name]
script=module('main.js');html=re.sub(r'<link rel="stylesheet"[^>]*>','',re.sub(r'<meta http-equiv="Content-Security-Policy"[^>]*>','',(root/'index.html').read_text()));html=re.sub(r'<script type="module"[^>]*></script>','',html);css=(root/'src/style.css').read_text().replace("url('../assets/brand.png')",f'url("{images["brand.png"]}")').replace("url('../assets/world.webp')",f'url("{images["world.webp"]}")')
fixture=subprocess.run(['node','--input-type=module','-e',"import {initialState,arrive} from './src/economy.js';import {TYPE_ORDER,REGIONS} from './src/data.js';import {sealState} from './src/save.js';const s=initialState();s.cars=Array.from({length:25},(_,i)=>({id:i+1,type:TYPE_ORDER[i%12],level:i%20+1,staff:0,crew:[],pendingCrew:[],riders:2}));s.coins=1e12;s.stamps=500;s.stops=s.totalStops=25000;s.regionsUnlocked=REGIONS.map(r=>r.id);s.tutorial=3;s.lastTime=Date.now();s.stationProgress=70;s.selected=0;s.cars[0].level=17;arrive(s);console.log(sealState(s))"],cwd=root,capture_output=True,text=True,check=True).stdout.strip()
results=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=shutil.which('chromium'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for device,size in [('desktop',(1440,900)),('iphone',(390,844))]:
  ctx=browser.new_context(viewport={'width':size[0],'height':size[1]},device_scale_factor=1,is_mobile=device=='iphone',reduced_motion='reduce',accept_downloads=True)
  page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('dialog',lambda d:d.accept());page.set_content(html,wait_until='domcontentloaded');page.add_style_tag(content=css)
  page.evaluate('(x)=>{const m=new Map([["everline-save-v6",x]]);Object.defineProperty(window,"localStorage",{value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}})}',fixture);page.evaluate('(m)=>window.__assetUrls=m',images);page.evaluate('(s)=>{const m=document.createElement("script");m.type="module";m.src=s;document.body.appendChild(m)}',script)
  page.wait_for_function('window.__EVERLINE_DIAGNOSTICS__?.().cars.length===25');page.wait_for_timeout(300)
  # Decode and inspect actual artwork, including pixel-finished SVGs; transparent sprites must have visible pixels.
  art=page.evaluate('''async () => {const names=Object.keys(window.__assetUrls).filter(n=>/^(station-|engine-|car-|region-)/.test(n));return await Promise.all(names.map(async name=>{const img=new Image();img.src=window.__assetUrls[name];await img.decode();const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.drawImage(img,0,0,64,64);const p=x.getImageData(0,0,64,64).data;let visible=0;for(let i=3;i<p.length;i+=4)if(p[i]>0)visible++;return {name,visible}}))}''');assert len(art)>=40 and all(x['visible']>100 for x in art),art
  assert page.evaluate('''()=>{const before=window.__EVERLINE_DIAGNOSTICS__().cars[0].passengers.length;window.__EVERLINE_DIAGNOSTICS__().cars[0].passengers.push({id:'test'});return window.__EVERLINE_DIAGNOSTICS__().cars[0].passengers.length===before}''')
  page.locator('[data-page="shop"]').click();page.locator('[data-shop-page="paint"]').click();assert page.locator('[data-action="engine"]').count()==8
  page.locator('[data-action="engine"][data-type="electric"]').click();assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().engine')=='electric'
  page.wait_for_function('Array.from(document.querySelectorAll(".purchase-card .preview img")).slice(0,4).every(i=>i.complete&&i.naturalWidth>0)')
  page.screenshot(path=str(root/'docs'/f'v7-{device}-engine-shop.png'))
  page.locator('[data-shop-page="heritage"]').click();assert page.locator('[data-action="heritage"]').count()==3;page.locator('[data-action="heritage"][data-type="conservation"]').click();assert 'conservation' in page.evaluate('window.__EVERLINE_DIAGNOSTICS__().heritageProjects')
  page.locator('[data-shop-page="workshop"]').click();assert page.locator('[data-action="workshop"]').count()==4
  before=page.evaluate('window.__EVERLINE_DIAGNOSTICS__().coins');page.locator('[data-action="workshop"]').first.click();assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars[0].mastery')==1;assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().coins')<before
  page.locator('[data-action="next-grade"]').click();assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars[0].level')==17;assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars[0].upgradeTarget')==20
  previews=page.locator('.purchase-card .preview img').evaluate_all('(imgs)=>imgs.map(i=>i.src)');assert len(set(previews))==4 and all(x.startswith('data:image/png') for x in previews)
  page.screenshot(path=str(root/'docs'/f'v8-{device}-workshop.png'))
  page.locator('#close-drawer').click();page.locator('[data-page="journal"]').click();page.locator('[data-journal-page="ranks"]').click();assert page.locator('.rank-card').count()==10
  stamps=page.evaluate('window.__EVERLINE_DIAGNOSTICS__().stamps');page.locator('[data-action="claim-rank"][data-type="r1"]').click();assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().stamps')==stamps+1;assert page.locator('[data-action="claim-rank"][data-type="r1"]').is_disabled();page.screenshot(path=str(root/'docs'/f'v8-{device}-ranks.png'))
  page.locator('[data-journal-page="stories"]').click();assert page.locator('.story-card').count()==5;assert 'Mira' in page.locator('.story-card').first.inner_text()
  page.locator('[data-journal-page="manifest"]').click();assert page.locator('.story-card').count()==25;assert page.locator('.story-card').first.inner_text().find('ABOARD')>=0
  page.locator('#close-drawer').click();page.locator('#settings').click();page.locator('#season-setting').select_option('Winter');assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().season')=='Winter'
  page.locator('#train-name').fill('<img src=x onerror=alert(1)>');page.locator('[data-settings-action="rename"]').click();assert '<' not in page.evaluate('window.__EVERLINE_DIAGNOSTICS__().trainName');assert page.locator('#settings-body img').count()==1;assert page.locator('#settings-body .install-panel img').get_attribute('src')==page.evaluate('window.__assetUrls["icon-192.png"]');assert not page.locator('#settings-body [onerror],#settings-body [onload]').count();assert page.locator('[data-settings-action="fleet"]').count()==3
  page.locator('#close-settings').click();page.locator('#scenic').click();page.screenshot(path=str(root/'docs'/f'v7-{device}-scenic.png'));page.keyboard.press('Escape')
  page.locator('#world').focus();page.keyboard.press('ArrowRight');assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().selected')==1
  assert not errors,errors
  diagnostics=page.evaluate('window.__EVERLINE_DIAGNOSTICS__()');assert diagnostics['cachePixels']<=12000000
  results.append({'device':device,'engine':'electric','heritage':True,'stories':5,'manifest':25,'season':'Winter','escapedName':True,'decodedArtAssets':len(art),'workshop':True,'rankClaim':True,'distinctPreviews':len(set(previews)),'detachedDiagnostics':True,'cachePixels':diagnostics['cachePixels'],'paintP95':diagnostics['paintP95'],'pageErrors':errors});print(results[-1],flush=True);ctx.close()
 browser.close()
(root/'docs'/'grand-browser-results.json').write_text(json.dumps(results,indent=2))
