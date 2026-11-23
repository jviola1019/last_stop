import {rm,mkdir,copyFile,readFile} from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),dist=path.join(root,'dist');
await rm(dist,{recursive:true,force:true});await mkdir(path.join(dist,'src'),{recursive:true});await mkdir(path.join(dist,'assets'),{recursive:true});
for(const file of ['index.html','src/main.js','src/economy.js','src/data.js','src/scene.js','src/style.css','assets/icon.svg'])await copyFile(path.join(root,file),path.join(dist,file));
const html=await readFile(path.join(dist,'index.html'),'utf8');if(!html.includes('src/main.js'))throw Error('Missing application script');console.log('Static production build: dist/ (7 files, zero third-party dependencies).');
