import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';import{fileURLToPath}from'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),read=p=>readFile(path.join(root,p));
const assetNames=['world.webp','car-engine.png','car-sleeper.png','car-cafe.png','car-garden.png','car-arcade.png','car-observatory.png'];
const urls={};for(const name of assetNames){const b=await read('assets/'+name);urls[name]=`data:${name.endsWith('webp')?'image/webp':'image/png'};base64,`+b.toString('base64')}
const modules=new Map();async function moduleUrl(file){if(modules.has(file))return modules.get(file);let text=(await read('src/'+file)).toString();
 if(file==='art.js')text=text.replace("const src=n=>new URL('../assets/'+n,import.meta.url).href;","const src=n=>window.__assetUrls[n];");
 if(file==='main.js')text=text.replace("const path=name=>new URL('../assets/'+name,import.meta.url).href;","const path=name=>window.__assetUrls[name];");
 for(const dep of ['data.js','economy.js','art.js'])if(dep!==file&&text.includes(`'./${dep}'`))text=text.replaceAll(`'./${dep}'`,`'${await moduleUrl(dep)}'`);
 const res='data:text/javascript;base64,'+Buffer.from(text).toString('base64');modules.set(file,res);return res}
let html=(await read('index.html')).toString(),css=(await read('src/style.css')).toString();css=css.replaceAll("url('../assets/world.webp')",`url("${urls['world.webp']}")`);
html=html.replace(/<link rel="stylesheet"[^>]*>/,'<style>'+css+'</style>').replace(/<link rel="manifest"[^>]*>/,'');
html=html.replace(/<script type="module"[^>]*><\/script>/,'<script>window.__assetUrls='+JSON.stringify(urls)+'</script>\n<script type="module" src="'+await moduleUrl('main.js')+'"></script>');
html=html.replace(/<link rel="icon"[^>]*>/,'');
await writeFile(path.join(root,'THE_EVERLINE_PLAY_OFFLINE.html'),html);
console.log('Created self-contained, double-clickable art game:',Math.round(Buffer.byteLength(html)/1024)+' KiB');
