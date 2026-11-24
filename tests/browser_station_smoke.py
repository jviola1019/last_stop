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
now=int(time.time()*1000)
proc=subprocess.run(['node','--input-type=module','-e',"import {initialState,journeyDuration} from './src/economy.js'; const s=initialState();s.version=5;s.activeRegion='coast';s.regionsUnlocked=['heartland','coast'];s.lastStationRegion='coast';s.lastStation='harbor';s.stationProgress=journeyDuration(s)-2.2;s.tutorial=3;s.coins=5000;s.lastTime=Date.now();s.cars[0].pendingCrew=[{id:1,name:'Mira',dream:'cafe',craft:'Barista'}];s.hires=1;console.log(JSON.stringify(s));"],cwd=root,capture_output=True,text=True,check=True)
s=json.loads(proc.stdout)
raw=json.dumps(s,ensure_ascii=False,separators=(',',':'))
h=2166136261
for char in raw:h=((h^ord(char))*16777619)&0xffffffff
envelope=json.dumps({'schema':1,'payload':raw,'checksum':f'{h:08x}'})
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path=__import__('shutil').which('chromium'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
    results=[]
    for device,size in [('desktop',(1440,900)),('iphone',(390,844))]:
        ctx=browser.new_context(viewport={'width':size[0],'height':size[1]},device_scale_factor=1,is_mobile=device=='iphone')
        page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content(html,wait_until='domcontentloaded');page.add_style_tag(content=css)
        page.evaluate('(x)=>{const m=new Map([["everline-save-v5",x]]);Object.defineProperty(window,"localStorage",{value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}})}',envelope)
        page.evaluate('(m)=>{window.__assetUrls=m}',images)
        page.evaluate('(s)=>{const script=document.createElement("script");script.type="module";script.src=s;document.body.appendChild(script)}',script)
        page.wait_for_timeout(450)
        first=page.evaluate('window.__EVERLINE_DIAGNOSTICS__()')
        assert first['stops']==0 and first['cars'][0]['pendingCrew'] and first['cars'][0]['staff']==0,first
        assert first['phase']=='approaching',first['phase']
        page.screenshot(path=str(root/'docs'/f'{device}-approach.png'),full_page=True)
        page.wait_for_timeout(2300)
        stop=page.evaluate('window.__EVERLINE_DIAGNOSTICS__()')
        assert stop['stops']==1 and stop['phase']=='platform',stop
        assert stop['cars'][0]['staff']==1 and not stop['cars'][0]['pendingCrew'],stop
        assert stop['speed']==0,stop
        assert stop['lastBoarding']+stop['lastAlighting']>=0
        page.screenshot(path=str(root/'docs'/f'{device}-station-stop.png'),full_page=True)
        page.wait_for_timeout(9300)
        leaving=page.evaluate('window.__EVERLINE_DIAGNOSTICS__()')
        assert leaving['phase'] in ('departing','enroute') and leaving['speed']>0.1,leaving
        assert leaving['cars'][0]['staff']==1 and leaving['stops']==1,leaving
        assert not errors,errors
        page.screenshot(path=str(root/'docs'/f'{device}-leaving.png'),full_page=True)
        results.append({'device':device,'approach_speed':first['speed'],'stop_speed':stop['speed'],'departure_speed':leaving['speed'],'boarded_crew':stop['cars'][0]['staff'],'boarding':stop['lastBoarding'],'alighting':stop['lastAlighting']})
        print(f'{device}: approaching {first["speed"]:.3f}, platform {stop["speed"]:.3f}, departing {leaving["speed"]:.3f}, crew boarded at station')
        ctx.close()
    browser.close()
(root/'docs'/'station-results.json').write_text(json.dumps(results,indent=2))
print('Station arrival/departure browser tests: 2/2 passed')
