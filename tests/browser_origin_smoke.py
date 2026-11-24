"""Real-origin production build on localhost. CI requires Chromium, Firefox and WebKit. Not a device-certification test."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from functools import partial
from playwright.sync_api import sync_playwright
import json,subprocess,shutil,os
root=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root/'dist')));Thread(target=server.serve_forever,daemon=True).start();url=f'http://127.0.0.1:{server.server_port}/';results=[]
fixture=subprocess.run(['node','--input-type=module','-e',"import {initialState} from './src/economy.js';import {sealState} from './src/save.js';const s=initialState();s.tutorial=3;s.coins=1e9;s.stamps=300;s.stops=s.totalStops=8000;s.regionsUnlocked=['heartland','coast','highland'];while(s.cars.length<20)s.cars.push({...s.cars[0],id:s.cars.length+1,passengers:[],riders:0});console.log(sealState(s))"],cwd=root,capture_output=True,text=True,check=True).stdout.strip()
try:
 with sync_playwright() as pw:
  for engine in ['chromium','firefox','webkit']:
   browser=getattr(pw,engine).launch(headless=True,**({'executable_path':shutil.which('chromium'),'args':['--no-sandbox']} if engine=='chromium' and shutil.which('chromium') else {}));ctx=browser.new_context(viewport={'width':390 if engine=='webkit' else 1280,'height':844 if engine=='webkit' else 800},reduced_motion='reduce',accept_downloads=True);page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   ctx.add_init_script(script=f"if(location.origin==={json.dumps(url.rstrip('/'))}&&!localStorage.getItem('everline-save-v6')){{localStorage.setItem('everline-save-v6',{json.dumps(fixture)});}}")
   response=page.goto(url,wait_until='load',timeout=30000);assert response.status==200;page.wait_for_function('window.__EVERLINE_DIAGNOSTICS__?.().cars.length===20');page.wait_for_function("localStorage.getItem('everline-fleet-unlocked')==='true'")
   page.locator('#settings').click();page.locator('#train-name').fill('Origin Verified');page.locator('[data-settings-action="rename"]').click();page.locator('#close-settings').click();assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().trainName')=='Origin Verified'
   page.reload(wait_until='load');page.wait_for_function('window.__EVERLINE_DIAGNOSTICS__?.().trainName==="Origin Verified"')
   page.locator('#settings').click();page.locator('[data-settings-action="fleet"][data-slot="1"]').click();page.wait_for_function('window.__EVERLINE_DIAGNOSTICS__?.().activeSlot===1');assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars.length')==2
   page.locator('#settings').click();page.locator('[data-settings-action="fleet"][data-slot="0"]').click();page.wait_for_function('window.__EVERLINE_DIAGNOSTICS__?.().activeSlot===0');assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().trainName')=='Origin Verified'
   # Workers are independently verified on real Chromium origin; WebKit/Firefox gameplay also tested.
   offline=False
   if engine=='chromium':
    page.wait_for_function('!!navigator.serviceWorker.controller',timeout=30000);cache_names=page.evaluate('caches.keys()');assert any('living-v7' in k for k in cache_names)
    ctx.set_offline(True);page.reload(wait_until='load');page.wait_for_function('window.__EVERLINE_DIAGNOSTICS__?.().trainName==="Origin Verified"');assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars.length')==20;offline=True;ctx.set_offline(False)
   assert not errors,errors;results.append({'browser':engine,'origin':True,'fleetRoundTrip':True,'offlineReload':offline,'pageErrors':errors});print(results[-1],flush=True);ctx.close();browser.close()
finally:server.shutdown();server.server_close()
(root/'docs'/'origin-browser-results.json').write_text(json.dumps(results,indent=2))
