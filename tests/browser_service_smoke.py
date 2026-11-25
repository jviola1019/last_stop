"""V9 standalone UI with exact CSP and deterministic clock advances, no state mutator."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import subprocess,shutil,json
root=Path(__file__).resolve().parents[1];html=(root/'THE_EVERLINE_PLAY_OFFLINE.html').read_text()
fixture=subprocess.run(['node','--input-type=module','-e',"import {initialState} from './src/economy.js';import {sealState} from './src/save.js';const s=initialState();s.tutorial=3;s.coins=15000;s.stops=s.totalStops=20;s.selected=1;s.cars[1].stock=[0,0,0];console.log(sealState(s))"],cwd=root,capture_output=True,text=True,check=True).stdout.strip()
results=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=shutil.which('chromium'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for device,w,h in [('desktop',1440,900),('iphone',390,844)]:
  ctx=browser.new_context(viewport={'width':w,'height':h},reduced_motion='reduce');page=ctx.new_page();page.clock.install();errors=[];requests=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda e:requests.append(e.url));page.on('dialog',lambda d:d.accept());
  page.evaluate('(save)=>{const m=new Map([["everline-save-v6",save]]);Object.defineProperty(window,"localStorage",{value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}})}',fixture)
  page.set_content(html,wait_until='domcontentloaded');page.wait_for_function('window.__EVERLINE_DIAGNOSTICS__?.().cars.length===2')
  page.locator('[data-action="open-supplies"]').click();assert page.locator('.supply-ticket').count()==3;assert page.locator('[data-action="restock"]').first.is_enabled();assert page.locator('[data-action="restock"]').nth(1).is_disabled()
  page.locator('[data-action="restock"]').first.click();snapshot=page.evaluate('window.__EVERLINE_DIAGNOSTICS__()');delivery=snapshot['cars'][1]['deliveries'][0];assert delivery>0 and snapshot['cars'][1]['stock'][0]==0;assert page.locator('[data-action="restock"]').first.is_disabled();page.screenshot(path=str(root/'docs'/f'v9-{device}-supplies.png'))
  page.clock.fast_forward(int((delivery+1)*1000));assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars[1].stock[0]')>0;assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars[1].deliveries[0]')==0
  page.locator('[data-shop-page="cars"]').click();assert page.locator('.purchase-card').count()==28;page.locator('[data-catalog-filter="Housing"]').click();assert page.locator('.purchase-card').count()==3;page.locator('[data-catalog-filter="All"]').click();page.screenshot(path=str(root/'docs'/f'v9-{device}-catalog.png'))
  page.locator('[data-action="build"][data-type="quarters"]').click();assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars[2].buildRemaining')>0;assert page.locator('[data-action="build"]').count()==0
  page.locator('#close-drawer').click();page.screenshot(path=str(root/'docs'/f'v9-{device}-construction.png'));page.clock.fast_forward(95000);assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars[2].buildRemaining')==0;assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().knownBlueprints.includes("quarters")')
  page.locator('[data-action="upgrade"]').click();assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars[2].level')==2;page.locator('[data-action="upgrade"]').click();assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars[2].level')==2;assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars[2].upgradeTarget')==3;assert page.locator('[data-action="upgrade"]').is_disabled();page.clock.fast_forward(181000);assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars[2].level')==3
  page.locator('[data-page="journal"]').click();page.locator('[data-journal-page="blueprints"]').click();assert page.locator('.purchase-card').count()==28;assert '3/28' in page.locator('.catalog-header').inner_text();assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+2');assert not errors,errors;assert not any(u.startswith(('http:','https:')) for u in requests)
  result={'device':device,'serviceDelivery':True,'uniqueCatalog':28,'construction':True,'timedRenovation':True,'blueprintCollection':True,'errors':errors};print(result,flush=True);results.append(result);ctx.close()
 browser.close()
(root/'docs'/'service-browser-results.json').write_text(json.dumps(results,indent=2))
