"""Actual Chromium interaction/screenshot smoke test using the production-source module graph.
Local HTTP navigation is blocked by this runtime; source and images are injected as data URIs
without modifying logic, except rewriting asset path resolution to the same image bytes.
"""
from pathlib import Path
import base64,re,json
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent.parent
images={}
for p in (root/'assets').iterdir():
 if p.suffix in ['.png','.webp','.svg']:
  media='image/webp' if p.suffix=='.webp' else 'image/png' if p.suffix=='.png' else 'image/svg+xml'
  images[p.name]=f'data:{media};base64,'+base64.b64encode(p.read_bytes()).decode()
urls={}
def module(name):
 if name in urls:return urls[name]
 text=(root/'src'/name).read_text()
 if name=='art.js':text=text.replace("const src=n=>new URL('../assets/'+n,import.meta.url).href;","const src=n=>window.__assetUrls[n];")
 if name=='main.js':text=text.replace("const path=name=>new URL('../assets/'+name,import.meta.url).href;","const path=name=>window.__assetUrls[name];")
 for dep in ['data.js','economy.js','art.js']:
  if dep!=name and f"'./{dep}'" in text:text=text.replace(f"'./{dep}'",f"'{module(dep)}'")
 urls[name]='data:text/javascript;base64,'+base64.b64encode(text.encode()).decode()
 return urls[name]
script=module('main.js')
html=(root/'index.html').read_text()
html=re.sub(r'<link rel="stylesheet"[^>]*>','',html)
html=re.sub(r'<script type="module"[^>]*></script>','',html)
css=(root/'src/style.css').read_text().replace("url('../assets/world.webp')",f'url("{images["world.webp"]}")')
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for name,wh in [('desktop',(1440,900)),('tablet',(820,1180)),('iphone',(390,844)),('small',(320,650))]:
  context=browser.new_context(viewport={'width':wh[0],'height':wh[1]},device_scale_factor=1,reduced_motion='reduce',is_mobile=name in ['iphone','small'])
  page=context.new_page();errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
  page.set_content(html,wait_until='domcontentloaded');page.add_style_tag(content=css)
  # Same-origin persistence stub for data-URL-based modules.
  page.evaluate("""() => { const m=new Map();Object.defineProperty(window,'localStorage',{value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}}); }""")
  page.evaluate('(a) => { window.__assetUrls=a; }',images)
  page.evaluate('(s) => { const m=document.createElement("script");m.type="module";m.src=s;document.body.appendChild(m) }',script)
  page.wait_for_timeout(1400)
  if errors:raise AssertionError((name,errors[:5]))
  assert page.locator('#coins').inner_text()=='160',(name,page.locator('#coins').inner_text())
  assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars.length')==2
  canvas=page.locator('#world');pix=canvas.evaluate('(el)=>{const ctx=el.getContext("2d");return Array.from(ctx.getImageData(Math.floor(el.width/2),Math.floor(el.height/2),1,1).data)}')
  assert max(pix[:3])>12 and pix[3]==255,(name,pix)
  page.screenshot(path=str(root/'docs'/f'{name}-scene.png'),full_page=True)
  # Real computed-layout geometry: validate 44px targets, clipping and overlap.
  layout=page.evaluate("""() => {
    const box = sel => {const e=document.querySelector(sel),r=e.getBoundingClientRect();
      return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom,
        font:getComputedStyle(e).fontFamily,fontSize:getComputedStyle(e).fontSize};};
    const targets=[...document.querySelectorAll('#collect,#settings,.nav-choice,.upgrade,.secondary-tools button')].map(e=>{
      const r=e.getBoundingClientRect();return {label:e.getAttribute('aria-label')||e.textContent.trim(),w:r.width,h:r.height};
    });
    const labels=[...document.querySelectorAll('.nav-label,.room-name,.room-kicker,.room-earn,.pill strong')].map(e=>({
      value:e.textContent.trim(),scroll:e.scrollWidth,client:e.clientWidth}));
    return {inspector:box('#inspector'),nav:box('.nav'),tour:box('#tour'),
      roomTitle:box('.room-name'),navTitle:box('.nav-label'),targets,labels,
      horizontalOverflow:document.documentElement.scrollWidth>innerWidth+2};
  }""")
  assert all(t['w']>=43.5 and t['h']>=43.5 for t in layout['targets']),(name,layout['targets'])
  assert layout['inspector']['bottom']<=layout['nav']['y']+2,(name,'Inspector overlaps nav',layout)
  assert layout['tour']['bottom']<layout['inspector']['y'] or name=='desktop',(name,'Tutorial overlaps inspector')
  assert all(t['scroll']<=t['client']+2 for t in layout['labels']),(name,'Clipped labels',layout['labels'])
  assert 'serif' in layout['roomTitle']['font'].lower(),(name,layout['roomTitle'])
  assert not layout['horizontalOverflow'],(name,'horizontal overflow')
  # Dynamic economy and 3-step tutorial
  page.locator('#collect').click();assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().tutorial')==1
  page.locator('[data-action="upgrade"]').click();assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().tutorial')==2
  page.locator('[data-action="finish-tutorial"]').click();assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().tutorial')==3
  # Shop and journal render genuine in-game items and navigation
  page.locator('[data-page="shop"]').click();assert page.locator('#drawer').is_visible();assert page.locator('.purchase-card').count()==8
  if name in ('desktop','iphone'):page.screenshot(path=str(root/'docs'/f'{name}-shop.png'),full_page=True)
  page.locator('[data-shop-page="paint"]').click();assert page.get_by_text('Old Copper').count()>=1
  page.locator('#close-drawer').click();page.locator('[data-page="journal"]').click();assert page.locator('.postcard').count()==8
  page.locator('[data-journal-page="achievements"]').click();assert page.locator('.sticker').count()==9
  page.locator('#close-drawer').click();page.locator('#settings').click();assert page.locator('#settings-dialog').is_visible()
  page.locator('[data-settings-action="export"]').click();page.locator('#close-settings').click()
  # Canvas can be controlled without a mouse or touch.
  page.locator('#world').focus();page.keyboard.press('ArrowRight');assert page.evaluate('window.__EVERLINE_DIAGNOSTICS__().selected')==1
  saved=page.evaluate("localStorage.getItem('everline-save-v3')")
  assert saved and json.loads(saved)['cars'][0]['level']==2
  # A new runtime is hydrated from the serialized save, then performs genuine purchases.
  prep=json.loads(saved);prep['coins']=15000;prep['stops']=8;prep['lastTime']=int(__import__('time').time()*1000)
  new_page=context.new_page();new_errors=[];new_page.on('pageerror',lambda error:new_errors.append(str(error)))
  new_page.set_content(html,wait_until='domcontentloaded');new_page.add_style_tag(content=css)
  new_page.evaluate("""(save) => {const m=new Map([['everline-save-v3',save]]);Object.defineProperty(window,'localStorage',{value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}})}""",json.dumps(prep))
  new_page.evaluate('(a)=>window.__assetUrls=a',images)
  new_page.evaluate('(s)=>{const m=document.createElement("script");m.type="module";m.src=s;document.body.appendChild(m)}',script)
  new_page.wait_for_timeout(650)
  assert new_page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars[0].level')==2
  new_page.locator('[data-page="shop"]').click()
  new_page.locator('[data-action="build"][data-type="garden"]').click()
  assert new_page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars.length')==3
  new_page.locator('#close-drawer').click()
  new_page.locator('[data-action="hire"]').click()
  assert new_page.evaluate('window.__EVERLINE_DIAGNOSTICS__().cars[2].staff')==1
  new_page.locator('[data-page="shop"]').click();new_page.locator('[data-shop-page="decoration"]').click()
  new_page.locator('[data-action="decor"][data-type="flowers"]').click()
  assert 'flowers' in json.loads(new_page.evaluate("localStorage.getItem('everline-save-v3')"))['decor']
  new_page.locator('#close-drawer').click()
  if name in ('desktop','iphone'):new_page.screenshot(path=str(root/'docs'/f'{name}-expanded.png'),full_page=True)
  assert not new_errors,(name,new_errors)
  new_page.close()
  assert not errors,(name,errors)
  over=page.evaluate('({page:document.documentElement.scrollWidth,view:window.innerWidth})')
  assert over['page']<=over['view']+2,(name,over)
  result={'viewport':name,'size':wh,'canvas_pixel':pix,'screenshots':f'docs/{name}-scene.png','tutorial':'passed','shop':'passed','journal':'passed','settings':'passed','save_reload':'passed','build_hire_decor':'passed','keyboard':'passed','errors':errors,'horizontal_overflow':over['page']>over['view'],'layout':layout}
  results.append(result);print(name,'PASS',result['canvas_pixel'])
  context.close()
 browser.close()
(root/'docs'/'browser-results.json').write_text(json.dumps(results,indent=2))
print('Total browser viewport smoke checks:',len(results))
