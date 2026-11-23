import json,re,base64,time
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path('/mnt/data/last_stop')
module_cache={}
def uri(name):
 if name in module_cache:return module_cache[name]
 code=(root/'src'/name).read_text()
 for other in ['data.js','economy.js','scene.js']:
  code=code.replace(f"'./{other}'",f"'{uri(other)}'") if other!=name and f"'./{other}'" in code else code
 url='data:text/javascript;base64,'+base64.b64encode(code.encode()).decode()
 module_cache[name]=url
 return url
# make module graph without needing fetch()
script=uri('main.js')
html=(root/'index.html').read_text();html=re.sub(r'<link rel="stylesheet"[^>]+>','',html);html=re.sub(r'<script type="module"[^>]+></script>','',html)
css=(root/'src/style.css').read_text()
result=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for name,size in [('desktop',(1440,900)),('iphone',(390,844)),('small',(320,650))]:
  ctx=b.new_context(viewport={'width':size[0],'height':size[1]},device_scale_factor=1,reduced_motion='reduce')
  page=ctx.new_page();errors=[];page.on('pageerror',lambda ex:errors.append(str(ex)))
  page.set_content(html,wait_until='domcontentloaded');page.add_style_tag(content=css)
  page.evaluate('''() => {const m=new Map();Object.defineProperty(window,'localStorage',{value:{getItem(k){return m.get(k)||null},setItem(k,v){m.set(k,String(v))},removeItem(k){m.delete(k)}}});}''')
  page.evaluate('(src)=>{const el=document.createElement("script");el.type="module";el.src=src;document.body.appendChild(el)}',script)
  page.wait_for_timeout(900)
  print(name,'title:',page.title(),'coins:',page.locator('#coins').inner_text(),'errs:',errors[:2])
  page.screenshot(path=str(root/'docs'/f'{name}-initial.png'))
  assert not errors,errors
  assert page.locator('#tutorial').is_visible()
  page.locator('#collect-button').click();page.wait_for_timeout(200)
  assert '02 / 03' in page.locator('#tutorial').inner_text(),page.locator('#tutorial').inner_text()
  if page.locator('[data-action="upgrade"]').count()==0:raise Exception('Missing upgrade')
  page.locator('[data-action="upgrade"]').first.click();page.wait_for_timeout(100)
  assert '03 / 03' in page.locator('#tutorial').inner_text(),page.locator('#tutorial').inner_text()
  page.locator('[data-action="finish-tutorial"]').click()
  page.locator('[data-tab="shop"]').click();assert page.locator('#bottom-panel').is_visible()
  page.locator('[data-shop-tab="paints"]').click();assert page.get_by_role('heading',name='Old Copper').is_visible()
  page.locator('[data-tab="journal"]').click();assert page.get_by_text('Letters from the line.').is_visible()
  page.locator('[data-tab="route"]').click();assert page.get_by_text('Bellweather Bay').count()>0
  page.locator('[data-tab="train"]').click()
  assert page.locator('[data-action="hire"]').count()==1
  page.locator('#settings-btn').click()
  loaded=json.loads(page.evaluate('localStorage.getItem("everline-save-v3")'))
  loaded['coins']=5000
  page.locator('#import-text').fill(json.dumps(loaded))
  page.locator('#import-btn').click()
  page.locator('[data-action="hire"]').click()
  assert '(1/2)' in page.locator('#inspector').inner_text()
  page.locator('[data-tab="shop"]').click()
  page.locator('[data-shop-tab="decor"]').click()
  assert page.get_by_role('heading',name='Amber Lanterns').is_visible()
  page.locator('[data-action="decor"][data-type="lanterns"]').click()
  assert json.loads(page.evaluate('localStorage.getItem("everline-save-v3")'))['decor']==['lanterns']
  page.locator('[data-tab="train"]').click()
  page.screenshot(path=str(root/'docs'/f'{name}-played.png'))
  assert 'LEVEL 2' in page.locator('#inspector').inner_text(),page.locator('#inspector').inner_text()
  dimensions=page.evaluate('''() => ({scrollW:document.documentElement.scrollWidth,viewport:innerWidth,canvasW:document.getElementById('scene').width,gameH:document.querySelector('.vista').getBoundingClientRect().height})''')
  assert dimensions['scrollW']<=size[0],dimensions
  saved=page.evaluate('localStorage.getItem("everline-save-v3")');assert saved and json.loads(saved)['cars'][0]['level']==2 and json.loads(saved)['cars'][0]['staff']==1
  result.append(dict(viewport=name,width=size[0],height=size[1],saved=True,panelNavigation=True,canvas=dimensions,errors=errors))
  print('PASSED',name,dimensions)
  ctx.close()
 b.close()
(root/'docs'/'browser-results.json').write_text(json.dumps(result,indent=2))
