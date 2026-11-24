"""Production-source Chromium boarding/arrival/departure regression.
Uses identical module source and real image bytes via an in-memory URL rewrite because
localhost is blocked by the browser administrator in this environment.
"""
from pathlib import Path
import base64, json, re, subprocess, time
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
images={}
for f in (root/'assets').iterdir():
    if f.suffix in ('.png','.webp','.svg'):
        mime={'.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'}[f.suffix]
        images[f.name]=f'data:{mime};base64,'+base64.b64encode(f.read_bytes()).decode('ascii')
urls={}
def module(name):
    if name in urls:return urls[name]
    text=(root/'src'/name).read_text()
    if name=='art.js':text=text.replace("const src=n=>new URL('../assets/'+n,import.meta.url).href;","const src=n=>window.__assetUrls[n];")
    if name=='main.js':text=text.replace("const path=name=>new URL('../assets/'+name,import.meta.url).href;","const path=name=>window.__assetUrls[name];")
    for dep in ['data.js','economy.js','art.js','save.js']:
        if dep!=name and f"'./{dep}'" in text:text=text.replace(f"'./{dep}'",f"'{module(dep)}'")
    urls[name]='data:text/javascript;base64,'+base64.b64encode(text.encode()).decode()
    return urls[name]
script=module('main.js')
html=(root/'index.html').read_text()
html=re.sub(r'<link rel="stylesheet"[^>]*>','',html)
html=re.sub(r'<script type="module"[^>]*></script>','',html)
css=(root/'src/style.css').read_text()
# Max-consist stress and real refit UI. Frame measurements are headless Chromium only.
proc=subprocess.run(['node','--input-type=module','-e',"import {initialState,journeyDuration} from './src/economy.js';import {TYPE_ORDER,REGIONS} from './src/data.js';const s=initialState();s.cars=Array.from({length:25},(_,i)=>({id:i+1,type:TYPE_ORDER[i%12],level:i%20+1,staff:2,crew:[],pendingCrew:[],riders:2}));s.selected=24;s.coins=1e10;s.stops=s.totalStops=25000;s.regionsUnlocked=REGIONS.map(r=>r.id);s.tutorial=3;s.lastTime=Date.now();s.stationProgress=journeyDuration(s)-22;console.log(JSON.stringify(s))"],cwd=root,capture_output=True,text=True,check=True)
s=json.loads(proc.stdout); raw=json.dumps(s,ensure_ascii=False,separators=(',',':'));h=2166136261
for char in raw:h=((h^ord(char))*16777619)&0xffffffff
envelope=json.dumps({'schema':1,'payload':raw,'checksum':f'{h:08x}'})
results=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path=__import__('shutil').which('chromium'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
    for device,size in [('desktop',(1440,900)),('iphone',(390,844))]:
        ctx=browser.new_context(viewport={'width':size[0],'height':size[1]},device_scale_factor=1,is_mobile=device=='iphone',accept_downloads=True)
        page=ctx.new_page(); errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('dialog',lambda d:d.accept())
        page.set_content(html,wait_until='domcontentloaded');page.add_style_tag(content=css)
        page.evaluate('(x)=>{const m=new Map([["everline-save-v6",x]]);Object.defineProperty(window,"localStorage",{value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}})}',envelope)
        page.evaluate('(m)=>{window.__assetUrls=m}',images)
        page.evaluate('(s)=>{const script=document.createElement("script");script.type="module";script.src=s;document.body.appendChild(script)}',script)
        page.wait_for_function('window.__EVERLINE_DIAGNOSTICS__?.().cars.length===25')
        page.wait_for_timeout(600);first=page.evaluate('window.__EVERLINE_DIAGNOSTICS__()');assert first['selected']==24
        page.locator('[data-page="shop"]').click();page.locator('[data-shop-page="refit"]').click();page.locator('[data-action="refit"][data-type="lounge"]').click()
        queued=page.evaluate('window.__EVERLINE_DIAGNOSTICS__()');assert queued['cars'][24]['pendingRefit']=='lounge' and queued['cars'][24]['type']=='sleeper';assert queued['coins']<first['coins']
        page.locator('#close-drawer').click();page.locator('#scenic').click();page.locator('#zoom-out').click()
        start=page.evaluate('({t:performance.now(),f:window.__EVERLINE_DIAGNOSTICS__().frames})');page.wait_for_timeout(2000);end=page.evaluate('({t:performance.now(),f:window.__EVERLINE_DIAGNOSTICS__().frames})');fps=(end['f']-start['f'])*1000/(end['t']-start['t']);assert fps>0
        page.screenshot(path=str(root/'docs'/f'{device}-25-cars.png'));page.keyboard.press('Escape');page.locator('#settings').click();page.locator('#power-setting').check();page.locator('#close-settings').click()
        start=page.evaluate('({t:performance.now(),f:window.__EVERLINE_DIAGNOSTICS__().frames})');page.wait_for_timeout(2000);end=page.evaluate('({t:performance.now(),f:window.__EVERLINE_DIAGNOSTICS__().frames})');low=(end['f']-start['f'])*1000/(end['t']-start['t']);assert 0<low<=35
        page.wait_for_function('window.__EVERLINE_DIAGNOSTICS__().cars[24].type==="lounge"',timeout=35000)
        final=page.evaluate('window.__EVERLINE_DIAGNOSTICS__()');assert final['cars'][24]['level']==first['cars'][24]['level'];assert final['cars'][24]['staff']==2 and len(final['cars'])==25;assert not errors,errors
        results.append({'device':device,'cars':25,'fps_sample':round(fps,1),'low_power_fps_sample':round(low,1),'refit_at_station':True,'errors':errors});print(results[-1]);ctx.close()
    browser.close()
(root/'docs'/'living-browser-results.json').write_text(json.dumps(results,indent=2))
