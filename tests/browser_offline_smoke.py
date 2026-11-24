"""Run exact standalone HTML with its own CSP. Not a physical file:// or OS installation test."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import shutil,json
root=Path(__file__).resolve().parents[1];html=(root/'THE_EVERLINE_PLAY_OFFLINE.html').read_text()
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=shutil.which('chromium'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce');errors=[];requests=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda req:requests.append(req.url))
 page.evaluate('()=>{const m=new Map();Object.defineProperty(window,"localStorage",{value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}})}')
 page.set_content(html,wait_until='domcontentloaded');page.wait_for_function('window.__EVERLINE_DIAGNOSTICS__?.().cars.length===2');page.wait_for_timeout(300)
 page.locator('#collect').click();page.wait_for_function('window.__EVERLINE_DIAGNOSTICS__().coins>160');page.locator('[data-page="shop"]').click();page.locator('#close-drawer').click()
 assert not errors,errors;assert not any(u.startswith(('http:','https:')) for u in requests),requests
 result={'offlineHTML':True,'CSPIntact':True,'networkRequests':0,'pageErrors':errors};print(result);(root/'docs'/'offline-browser-results.json').write_text(json.dumps(result,indent=2));browser.close()
