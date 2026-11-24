"""Real-origin production build on localhost. CI requires Chromium, Firefox and WebKit. Not a device-certification test."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from functools import partial
from playwright.sync_api import sync_playwright
import json,subprocess,shutil,os,time
root=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root/'dist')));Thread(target=server.serve_forever,daemon=True).start();url=f'http://127.0.0.1:{server.server_port}/';results=[]
def wait_condition(page,expression,timeout=30000):
 deadline=time.monotonic()+timeout/1000
 while time.monotonic()<deadline:
  try:
   if page.evaluate(expression):return
  except Exception as e:
   if 'Execution context was destroyed' not in str(e):raise
  page.wait_for_timeout(75)
 raise AssertionError('Timed out: '+expression)
fixture=subprocess.run(['node','--input-type=module','-e',"import {initialState} from './src/economy.js';import {sealState} from './src/save.js';const s=initialState();s.tutorial=3;s.cars[0].level=5;s.coins=1e9;s.stamps=300;s.stops=s.totalStops=8000;s.regionsUnlocked=['heartland','coast','highland'];while(s.cars.length<20)s.cars.push({...s.cars[0],id:s.cars.length+1,passengers:[],riders:0});console.log(sealState(s))"],cwd=root,capture_output=True,text=True,check=True).stdout.strip()
try:
 with sync_playwright() as pw:
  for engine in ['chromium','firefox','webkit']:
   browser=getattr(pw,engine).launch(headless=True,**({'executable_path':shutil.which('chromium'),'args':['--no-sandbox']} if engine=='chromium' and shutil.which('chromium') else {}));ctx=browser.new_context(viewport={'width':390 if engine=='webkit' else 1280,'height':844 if engine=='webkit' else 800},reduced_motion='reduce',accept_downloads=True);page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   ctx.add_init_script(script=f"if(location.origin==={json.dumps(url.rstrip('/'))}&&!localStorage.getItem('everline-save-v6')){{localStorage.setItem('everline-save-v6',{json.dumps(fixture)});}}")
   response=page.goto(url,wait_until='load',timeout=30000);assert response.status==200;wait_condition(page,'window.__EVERLINE_DIAGNOSTICS__?.().cars.length===20');wait_condition(page,"localStorage.getItem('everline-fleet-unlocked')==='true'")
   page.locator('#settings').click();assert page.locator('#install-title').inner_text()=='The Everline app';assert page.locator('.install-panel img').evaluate('(im)=>im.decode().then(()=>im.naturalWidth>0)');page.locator('#train-name').fill('Origin Verified');page.locator('[data-settings-action="rename"]').click();page.locator('#close-settings').click();assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().trainName')=='Origin Verified'
   page.locator('[data-page="shop"]').click();page.locator('[data-shop-page="workshop"]').click();page.locator('[data-action="workshop"]').first.click();assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars[0].mastery')==1;page.locator('#close-drawer').click()
   page.locator('[data-page="journal"]').click();page.locator('[data-journal-page="ranks"]').click();page.locator('[data-action="claim-rank"][data-type="r1"]').click();assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().rankClaims.includes("r1")');page.locator('#close-drawer').click()
   page.reload(wait_until='load');wait_condition(page,'window.__EVERLINE_DIAGNOSTICS__?.().trainName==="Origin Verified"');assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars[0].mastery')==1;assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().rankClaims.includes("r1")')
   page.locator('#settings').click();page.locator('[data-settings-action="fleet"][data-slot="1"]').click();wait_condition(page,'window.__EVERLINE_DIAGNOSTICS__?.().activeSlot===1');assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars.length')==2
   page.locator('#settings').click();page.locator('[data-settings-action="fleet"][data-slot="0"]').click();wait_condition(page,'window.__EVERLINE_DIAGNOSTICS__?.().activeSlot===0');assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().trainName')=='Origin Verified'
   # Workers are independently verified on real Chromium origin; WebKit/Firefox gameplay also tested.
   offline=False
   if engine=='chromium':
    wait_condition(page,'!!navigator.serviceWorker.controller',timeout=30000);cache_names=page.evaluate('caches.keys()');assert any('living-v8.1-' in k for k in cache_names)
    ctx.set_offline(True);page.reload(wait_until='load');wait_condition(page,'window.__EVERLINE_DIAGNOSTICS__?.().trainName==="Origin Verified"');assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars.length')==20;offline=True;ctx.set_offline(False)
   assert not errors,errors;results.append({'browser':engine,'origin':True,'fleetRoundTrip':True,'workshopAndRankRoundTrip':True,'offlineReload':offline,'pageErrors':errors});print(results[-1],flush=True);ctx.close();browser.close()
finally:server.shutdown();server.server_close()
(root/'docs'/'origin-browser-results.json').write_text(json.dumps(results,indent=2))
