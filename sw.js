const CACHE='everline-diorama-v2-20261123';
const ASSETS=['./','./index.html','./manifest.webmanifest','./src/main.js','./src/art.js','./src/economy.js','./src/data.js','./src/style.css','./assets/icon.svg','./assets/world.webp','./assets/car-engine.png','./assets/car-sleeper.png','./assets/car-cafe.png','./assets/car-garden.png','./assets/car-arcade.png','./assets/car-observatory.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>res.ok?(caches.open(CACHE).then(c=>c.put(e.request,res.clone())),res):res)))});
