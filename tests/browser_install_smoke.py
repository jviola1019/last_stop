"""Actual-origin branding and PWA installability on a Pages-style subpath. Not an OS installation."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from functools import partial
from tempfile import TemporaryDirectory
from playwright.sync_api import sync_playwright
import shutil,json,time
root=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
 def guess_type(self,p):return 'application/manifest+json' if p.endswith('.webmanifest') else super().guess_type(p)
def wait(page,expression):
 end=time.monotonic()+30
 while time.monotonic()<end:
  if page.evaluate(expression):return
  page.wait_for_timeout(100)
 raise AssertionError('Timed out: '+expression)
with TemporaryDirectory() as temp:
 (Path(temp)/'last_stop').symlink_to(root/'dist',target_is_directory=True)
 server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=temp));Thread(target=server.serve_forever,daemon=True).start();url=f'http://127.0.0.1:{server.server_port}/last_stop/'
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(headless=True,**({'executable_path':shutil.which('chromium'),'args':['--no-sandbox']} if shutil.which('chromium') else {}));ctx=browser.new_context(viewport={'width':1280,'height':800},reduced_motion='reduce');page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   assert page.goto(url,wait_until='load').status==200;wait(page,'!!window.__EVERLINE_DIAGNOSTICS__');wait(page,'!!navigator.serviceWorker.controller')
   result=page.evaluate('''async()=>{const link=document.querySelector('link[rel=manifest]');const manifest=await (await fetch(link.href)).json();const result=[];for(const icon of manifest.icons){const u=new URL(icon.src,link.href);const response=await fetch(u);const blob=await response.blob();const img=new Image();img.src=URL.createObjectURL(blob);await img.decode();result.push({url:u.pathname,ok:response.ok,size:[img.naturalWidth,img.naturalHeight],purpose:icon.purpose});URL.revokeObjectURL(img.src);}const apple=document.querySelector('link[rel=apple-touch-icon]');const image=new Image();image.src=apple.href;await image.decode();return {id:new URL(manifest.id,link.href).href,start:new URL(manifest.start_url,link.href).href,scope:new URL(manifest.scope,link.href).href,display:manifest.display,icons:result,apple:[image.naturalWidth,image.naturalHeight]}}''')
   assert result['id']==result['start']==result['scope']==url and result['display']=='standalone',result
   assert all(i['ok'] and i['url'].startswith('/last_stop/assets/') for i in result['icons']);assert result['apple']==[180,180]
   for n in [192,512]:assert any(i['size']==[n,n] and i['purpose']=='any' for i in result['icons'])
   assert any(i['size']==[512,512] and i['purpose']=='maskable' for i in result['icons'])
   session=ctx.new_cdp_session(page);manifest=session.send('Page.getAppManifest');assert not [x for x in manifest.get('errors',[]) if x.get('critical')],manifest
   install_errors=session.send('Page.getInstallabilityErrors').get('installabilityErrors',[]);assert not install_errors,install_errors
   page.locator('#settings').click();assert page.locator('#install-title').inner_text()=='The Everline app';page.locator('#close-settings').click()
   page.locator('#collect').click();coins=page.evaluate('window.__EVERLINE_DIAGNOSTICS__().coins')
   ctx.set_offline(True);page.reload(wait_until='load');wait(page,'!!window.__EVERLINE_DIAGNOSTICS__');assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().coins')==coins
   assert page.evaluate("async()=>{const urls=['icon-32.png','icon-192.png','icon-512.png','icon-maskable.png','apple-touch-icon.png'];return (await Promise.all(urls.map(async u=>(await fetch('./assets/'+u)).ok))).every(Boolean)}")
   assert not errors,errors;result.update({'installabilityErrors':install_errors,'offlineIconFetch':True,'offlineSaveReload':True,'pageErrors':errors});print(result,flush=True);(root/'docs'/'install-browser-results.json').write_text(json.dumps(result,indent=2));ctx.close();browser.close()
 finally:server.shutdown();server.server_close()
