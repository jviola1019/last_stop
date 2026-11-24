// An asset-led Canvas2D scene. Gameplay state is owned by economy.js, never this render loop.
import {CARRIAGES,REGIONS,DESTINATIONS,LIVERY_FILTERS,ENGINES} from './data.js';
import {journeyMotion,roomGrade,nextDestination,visualSeason,workshopRank} from './economy.js';
const W=1672,H=941,CAR_W=276,ENGINE_W=318;
const sprites={sleeper:'car-sleeper.png',cafe:'car-cafe.png',garden:'car-garden.png',library:'car-library.svg',diner:'car-diner.svg',arcade:'car-arcade.png',workshop:'car-workshop.svg',observatory:'car-observatory.png',postal:'car-postal.svg',bakery:'car-bakery.svg',cinema:'car-cinema.svg',lounge:'car-lounge.svg'};
const names={sleeper:'SLEEPER',cafe:'CAFÉ',garden:'GREENHOUSE',library:'LIBRARY',diner:'DINING CAR',arcade:'ARCADE',workshop:'WORKSHOP',observatory:'OBSERVATORY',postal:'POSTAL CAR',bakery:'BAKERY',cinema:'PICTURE HOUSE',lounge:'GRAND LOUNGE'};
const src=n=>new URL('../assets/'+n,import.meta.url).href;
function asset(name){const img=new Image();img.src=src(name);return img}
function ready(img){return img?.complete&&img.naturalWidth>0}
function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
export class LivingScene {
  constructor(canvas,onSelect,onSighting){
    this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.images={world:asset('world.webp'),engine:asset('car-engine.png')};
    for(const [key,value] of Object.entries(sprites))this.images[key]=asset(value);
    for(const engine of ENGINES)if(engine.id!=='steam')this.images['engine-'+engine.id]=asset(engine.asset);
    for(const d of DESTINATIONS)this.images['station-'+d.id]=asset('station-'+d.id+'.svg');
    for(const region of REGIONS){if(region.id!=='heartland')this.images['region-'+region.id]=asset('region-'+region.id+'.svg');}
    this.rasters=new Map();this.frameDurations=[];this.onSelect=onSelect;this.onSighting=onSighting;this.state=null;this.motion=true;this.scenic=false;this.lowPower=false;this.sighting=null;
    this.pan=0;this.panGoal=0;this.zoom=1;this.distance=0;this.wheelRotation=0;this.travelSpeed=1;this.renderedAt=0;this.frames=0;this.hintDone=false;this.pointer=null;this.last=0;this.t=0;this.burst=[];this.width=1;this.height=1;
    canvas.addEventListener('pointerdown',e=>this.down(e));canvas.addEventListener('pointermove',e=>this.move(e));canvas.addEventListener('pointerup',e=>this.up(e));canvas.addEventListener('pointercancel',()=>this.pointer=null);
    canvas.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){this.onSelect(Math.min(this.state.cars.length-1,this.state.selected+1));e.preventDefault()}if(e.key==='ArrowLeft'){this.onSelect(Math.max(0,this.state.selected-1));e.preventDefault()}});
    window.addEventListener('resize',()=>this.resize());this.resize();this.raf=requestAnimationFrame(t=>this.frame(t));document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(this.raf);this.raf=0;this.last=0;}else if(!this.raf){this.raf=requestAnimationFrame(t=>this.frame(t));}});
  }
  resize(){const rect=this.canvas.getBoundingClientRect();this.width=Math.max(1,rect.width);this.height=Math.max(1,rect.height);const d=Math.min(this.lowPower?1:Math.min(window.devicePixelRatio||1,2),Math.sqrt(4000000/(this.width*this.height)));this.canvas.width=Math.round(this.width*d);this.canvas.height=Math.round(this.height*d);this.ctx.setTransform(d,0,0,d,0,0);this.dpr=d;this.rasters.clear();if(this.state){this.panGoal=Math.max(-this.bound(),Math.min(this.bound(),this.panGoal));}}
  // Current-viewport raster cache. Keep less than 48 MiB of pixel buffers, including on HiDPI devices.
  cached(id,width,height,render){const hit=this.rasters.get(id);if(hit){this.rasters.delete(id);this.rasters.set(id,hit);return hit;}const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;render(canvas.getContext('2d'));let pixels=width*height;for(const item of this.rasters.values())pixels+=item.width*item.height;while(this.rasters.size&&(pixels>12000000||this.rasters.size>=48)){const oldest=this.rasters.keys().next().value;const v=this.rasters.get(oldest);pixels-=v.width*v.height;this.rasters.delete(oldest);}this.rasters.set(id,canvas);return canvas;}
  raster(key,img,w,h,filter='none'){
    if(!ready(img))return img;const d=this.lowPower?1:this.dpr||1;
    const width=Math.max(1,Math.round(w*d)),height=Math.max(1,Math.round(h*d));
    return this.cached(`${key}:${width}:${height}:${filter}`,width,height,ctx=>{ctx.filter=filter;ctx.drawImage(img,0,0,width,height);});
  }
  background(key,img,w,h,bx,by,scale){const d=this.dpr||1,width=Math.round(w*d),height=Math.round(h*d);return this.cached(`world:${key}:${width}:${height}`,width,height,ctx=>{ctx.scale(d,d);ctx.fillStyle='#29233d';ctx.fillRect(0,0,w,h);ctx.drawImage(img,bx,by,W*scale,H*scale);});}
  roomRaster(car,s){const img=this.images[car.type];if(!ready(img))return null;const d=this.dpr||1,ww=CAR_W*s,hh=226*s,width=Math.max(1,Math.round(ww*d)),height=Math.max(1,Math.round(hh*d));return this.cached(`room:${car.type}:${car.level}:${workshopRank(car)}:${width}:${height}`,width,height,ctx=>{ctx.scale(d,d);ctx.drawImage(img,0,0,ww,hh);const sigW=145*s,sigX=(ww-sigW)/2,sigY=169*s;ctx.fillStyle='#1d1a26';rr(ctx,sigX,sigY,sigW,27*s,6*s);ctx.fill();ctx.strokeStyle='#dba354';ctx.lineWidth=2*s;ctx.stroke();ctx.font=`bold ${Math.max(9,15*s)}px Georgia,serif`;ctx.fillStyle='#f7ce80';ctx.textAlign='center';ctx.fillText(names[car.type],ww/2,sigY+18*s);this.roomDetails(ctx,0,0,s,car);});}
  scale(){const isNarrow=this.width<750;return (isNarrow?Math.max(.75,Math.min(1.08,this.height/941)) : Math.max(this.width/W,this.height/H))*this.zoom}
  bound(){if(!this.state)return 0;return Math.max(0,(this.state.cars.length*CAR_W+ENGINE_W)-this.width/this.scale()+120)/2}
  focus(index){if(!this.state)return;const length=this.state.cars.length*CAR_W+ENGINE_W;const selected=(index<0?length-ENGINE_W*.5:index*CAR_W+CAR_W/2)-length/2;
   const needsPan=length*this.scale()>this.width-40;this.panGoal=needsPan?Math.max(-this.bound(),Math.min(this.bound(),selected)):0;}
  setZoom(zoom){this.zoom=Math.max(.7,Math.min(1.6,zoom));this.rasters.clear();this.panGoal=Math.max(-this.bound(),Math.min(this.bound(),this.panGoal));this.pan=this.panGoal;}
  layout(){const state=this.state;if(!state)return null;const s=this.scale(),length=state.cars.length*CAR_W+ENGINE_W;const base=(W-length)/2;
   const x0=this.width/2-(W/2+this.pan)*s;const y0=(this.height-H*s)/2-(this.width<900?82:0);
   return {s,base,x0,y0,length,trainY:y0+421*s,drawX:x=>x0+x*s};}
  down(e){this.canvas.setPointerCapture?.(e.pointerId);this.pointer={x:e.clientX,y:e.clientY,origin:e.clientX,pan:this.panGoal,at:performance.now()};}
  move(e){if(!this.pointer)return;const diff=e.clientX-this.pointer.x;this.panGoal=Math.max(-this.bound(),Math.min(this.bound(),this.pointer.pan-diff/this.scale()));this.pan=this.panGoal;}
  up(e){if(!this.pointer)return;const p=this.pointer;this.pointer=null;if(Math.abs(e.clientX-p.origin)>12)return;
    const r=this.canvas.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top,l=this.layout();if(!l)return;
    const wx=(x-l.x0)/l.s, wy=(y-l.y0)/l.s;
    if(this.sighting&&wx>this.sighting.x-38&&wx<this.sighting.x+55&&wy>this.sighting.y-55&&wy<this.sighting.y+60){this.onSighting();return}
    if(wy>431&&wy<651){const pos=wx-l.base;const index=Math.floor(pos/CAR_W);if(index>=0&&index<this.state.cars.length)this.onSelect(index);else if(pos>=this.state.cars.length*CAR_W&&pos<=l.length)this.onSelect(-1);}
  }
  pop(x,y){if(!this.motion||this.scenic)return;for(let k=0;k<17;k++)this.burst.push({x,y,dx:(Math.random()-.5)*125,dy:(Math.random()-.5)*130,life:1,color:k%2?'#ffcf70':'#fff5bb'});}
  frame(now){this.raf=0;if(document.hidden)return;if(now-this.renderedAt<(this.lowPower||!this.motion?32:15)){this.raf=requestAnimationFrame(t=>this.frame(t));return;}this.renderedAt=now;this.frames++;const dt=this.last?Math.min(.06,(now-this.last)/1000):0;this.last=now;this.t+=this.motion?dt:0;
    this.pan+=(this.panGoal-this.pan)*(this.motion?.13:1);if(this.state){const travel=journeyMotion(this.state);this.travelSpeed=this.motion?travel.speed:0;this.distance+=dt*110*this.travelSpeed;this.wheelRotation+=dt*4.2*this.travelSpeed;const start=performance.now();this.paint(dt);this.frameDurations.push(performance.now()-start);if(this.frameDurations.length>120)this.frameDurations.shift();}
    if(!document.hidden)this.raf=requestAnimationFrame(t=>this.frame(t));
  }
  paint(dt){const c=this.ctx,w=this.width,h=this.height,l=this.layout();c.save();c.fillStyle='#29233d';c.fillRect(0,0,w,h);
    const region=this.state.activeRegion;const regional=this.images['region-'+region];const world=ready(regional)?regional:this.images.world;const scale=Math.max(w/W,h/H),bx=(w-W*scale)/2,by=(h-H*scale)/2-(w<900?82:0);
    if(ready(world))c.drawImage(this.background(ready(regional)?region:'heartland',world,w,h,bx,by,scale),0,0,w,h);else {const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#615079');g.addColorStop(.5,'#efad84');g.addColorStop(1,'#244447');c.fillStyle=g;c.fillRect(0,0,w,h)}
    // When the autopilot moves to a new region, the previous station holds the frame until departure.
    const last=this.state.lastStationRegion,phase=journeyMotion(this.state);
    if(last!==region&&(phase.phase==='platform'||phase.phase==='departing')){
      const previous=this.images['region-'+last];const old=ready(previous)?previous:this.images.world;
      if(ready(old)){c.globalAlpha=phase.phase==='platform'?1:Math.max(0,1-phase.speed);c.drawImage(this.background(ready(previous)?last:'heartland',old,w,h,bx,by,scale),0,0,w,h);c.globalAlpha=1;}
    }
    // Externally authored background and internally simulated motion are separate layers.
    this.weather(c,w,h,scale,bx,by);
    this.sceneryTravel(c,w,h,l);this.stationArrival(c,w,h,l);
    const engineX=l.base+this.state.cars.length*CAR_W;
    const underY=l.y0+638*l.s;
    // Animated rails and rolling ballast scroll beneath the stationary camera.
    c.fillStyle='#312b3e';c.fillRect(0,underY,w,8*l.s);c.fillStyle='#d5a45e';c.fillRect(0,underY,w,2.5*l.s);
    c.fillStyle='#392b2c';const step=49*l.s;for(let px=-step+(this.motion?this.distance*l.s:0)%step;px<w;px+=step)c.fillRect(px,underY+5*l.s,23*l.s,7*l.s);
    this.state.cars.forEach((car,i)=>{
      const x=l.drawX(l.base+i*CAR_W),y=l.trainY+(this.motion?Math.sin(this.distance*.025+i*.6)*this.travelSpeed*.8*l.s:0);if(x+CAR_W*l.s<0||x>this.width)return;const ww=CAR_W*l.s,hh=226*l.s;
      const surface=this.roomRaster(car,l.s);if(surface)c.drawImage(surface,x,y,ww,hh);else{c.fillStyle=CARRIAGES[car.type].color;c.fillRect(x,y+23*l.s,ww,hh-23*l.s)}
      // Local cabin illumination changes with the same visual day/night clock as the scene.
      const dusk=(Math.sin(this.t/175)*.5+.5);c.save();c.fillStyle='#f7be6b';c.globalAlpha=.035+dusk*.065;rr(c,x+16*l.s,y+48*l.s,244*l.s,108*l.s,8*l.s);c.fill();c.restore();
      // Source artwork establishes ambience; independent live people represent actual manifest.
      for(let k=0;k<(car.riders??0);k++){const px=x+(45+(k%4)*55+(this.motion?Math.sin(this.t*.9+k*1.8)*9:0))*l.s,py=y+(133+Math.sin(this.t*1.5+k*1.3)*2)*l.s;this.person(c,px,py,l.s*.84,k,car.type,false);}
      for(let k=0;k<car.staff;k++)this.person(c,x+(97+k*46)*l.s,y+(126+(this.motion?Math.sin(this.t*1.9+k*1.1)*2:0))*l.s,l.s,k+4,car.type,true);
      c.font=`600 ${Math.max(10,12*l.s)}px Georgia,serif`;c.textAlign='center';c.fillStyle='#f0cf93';c.fillText(`${car.riders??0} ABOARD · LV ${car.level}`,x+ww/2,y+15*l.s);

      if(this.state.decor.includes('flowers')){c.fillStyle='#6f9d59';for(let k=0;k<5;k++){c.beginPath();c.arc(x+(35+k*43)*l.s,y+156*l.s,6*l.s,0,7);c.fill();c.fillStyle='#f1b0a9';c.fillRect(x+(35+k*43)*l.s,y+152*l.s,4*l.s,4*l.s);c.fillStyle='#6f9d59'}}
      if(this.state.decor.includes('lanterns')){c.fillStyle='#ffdc80';c.shadowColor='#ffc16a';c.shadowBlur=this.lowPower?0:8*l.s;for(const k of [26,245]){c.beginPath();c.arc(x+k*l.s,y+62*l.s,4*l.s,0,7);c.fill()}c.shadowBlur=0}
      if(i===this.state.selected&&!this.scenic){c.shadowColor='#ffcc76';c.shadowBlur=this.lowPower?0:8*l.s;c.strokeStyle='#ffe2a2';c.lineWidth=3*l.s;rr(c,x+3*l.s,y+20*l.s,ww-6*l.s,180*l.s,20*l.s);c.stroke();c.shadowBlur=0}
      // Every painted wheel is an actual moving mechanical overlay, not a CSS animation unrelated to the train.
      for(const q of [62,216])this.wheel(c,x+q*l.s,y+204*l.s,8*l.s);
    });
    const ix=l.drawX(engineX),iy=l.trainY+(this.motion?Math.sin(this.distance*.025)*this.travelSpeed*.8*l.s:0);
    const engineId=this.state.engine||'steam',engineSprite=this.images['engine-'+engineId]||this.images.engine;
    if(ready(engineSprite)&&ix+ENGINE_W*l.s>=0&&ix<=w){
      c.drawImage(this.raster('engine-'+engineId,engineSprite,ENGINE_W*l.s,226*l.s,LIVERY_FILTERS[this.state.trainPaint]||'none'),ix,iy,ENGINE_W*l.s,226*l.s);
    }
    else if(ix+ENGINE_W*l.s>=0&&ix<=w){c.fillStyle='#1e2934';c.fillRect(ix,iy+54*l.s,ENGINE_W*l.s,140*l.s)}
    if(ix+ENGINE_W*l.s>=0&&ix<=w){if(engineId==='steam'){this.wheel(c,ix+73*l.s,iy+197*l.s,24*l.s);this.wheel(c,ix+143*l.s,iy+197*l.s,24*l.s);}else{const modern=['diesel','electric','alpine','horizon'].includes(engineId);for(const axle of modern?[54,99,220,264]:[73,143,252])this.wheel(c,ix+axle*l.s,iy+196*l.s,(modern?15:20)*l.s);}
    if(['steam','express','mountain','artdeco'].includes(engineId))this.steam(c,ix+145*l.s,iy+52*l.s,l.s);}
    if(this.state.decor.includes('pennants')){for(let k=0;k<this.state.cars.length;k++){const x=l.drawX(l.base+k*CAR_W+130);if(x<-20||x>w+20)continue;c.fillStyle=k%2?'#ef9b75':'#f2ca71';c.beginPath();c.moveTo(x,l.trainY+10*l.s);c.lineTo(x+18*l.s,l.trainY+14*l.s);c.lineTo(x,l.trainY+25*l.s);c.fill();}}
    if(this.sighting&&!this.scenic){const xx=l.drawX(this.sighting.x),yy=l.y0+this.sighting.y*l.s;
      c.font=`${Math.floor(39*l.s)}px Georgia,serif`;c.textAlign='center';c.shadowColor='#fff3b1';c.shadowBlur=15;this.drawSighting(c,xx,yy,l.s,this.sighting.id); c.shadowBlur=0;
      c.font=`bold ${Math.floor(12*l.s)}px Georgia,serif`;c.fillStyle='#ffe9bb';c.fillText('TAP FOR A STAMP',xx,yy+22*l.s);}
    for(const b of this.burst){b.x+=b.dx*dt;b.y+=b.dy*dt;b.life-=dt*1.3;if(b.life>0){c.globalAlpha=b.life;c.fillStyle=b.color;c.beginPath();c.arc(b.x,b.y,Math.max(1,b.life*4),0,7);c.fill();}}this.burst=this.burst.filter(b=>b.life>0);c.globalAlpha=1;
    // Traveling speed is illustrated by a fine foreground layer; earnings only advance via wall-clock tick().
    if(this.motion&&!this.lowPower){c.globalAlpha=.24;c.strokeStyle='#ffe1a7';c.lineWidth=1;const speed=(this.distance*.9)%82;for(let k=0;k<15;k++){const xx=((k*109+speed*2)%Math.max(1,w)),yy=h*.79+Math.sin(k*2)*15;c.beginPath();c.moveTo(xx,yy);c.lineTo(xx+17,yy);c.stroke()}c.globalAlpha=1}
    c.restore();
  }
  drawSighting(c,x,y,s,id){c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle='#ffe7ac';c.fillStyle='#f3c775';c.lineWidth=2;
    if(id==='balloon'){c.beginPath();c.ellipse(0,-14,13,18,0,0,7);c.fill();c.stroke();c.beginPath();c.moveTo(-7,2);c.lineTo(-4,13);c.lineTo(4,13);c.lineTo(7,2);c.stroke();c.fillRect(-5,13,10,8);}
    else if(id==='fox'||id==='deer'){c.fillStyle=id==='fox'?'#c87943':'#b6a284';c.beginPath();c.ellipse(0,0,15,7,0,0,7);c.fill();c.beginPath();c.moveTo(8,-4);c.lineTo(15,-17);c.lineTo(20,-9);c.lineTo(25,-15);c.lineTo(25,-3);c.closePath();c.fill();c.beginPath();c.moveTo(-10,0);c.quadraticCurveTo(-27,-9,-28,6);c.stroke();for(const xx of [-8,8]){c.beginPath();c.moveTo(xx,4);c.lineTo(xx-3,14);c.stroke();}}
    else if(id==='whale'){c.fillStyle='#88b8c0';c.beginPath();c.ellipse(0,3,24,9,-.15,0,7);c.fill();c.beginPath();c.moveTo(-17,1);c.lineTo(-34,-9);c.lineTo(-28,6);c.closePath();c.fill();c.beginPath();c.moveTo(6,-8);c.quadraticCurveTo(4,-24,-7,-18);c.moveTo(6,-8);c.quadraticCurveTo(12,-24,20,-18);c.stroke();}
    else if(id==='festival'){for(let j=-1;j<=1;j++){rr(c,j*13-5,-9-(j%2)*5,10,16,3);c.fill();c.stroke();}}
    else if(id==='owl'){c.fillStyle='#baa684';c.beginPath();c.ellipse(0,1,11,14,0,0,7);c.fill();for(const j of [-5,5]){c.fillStyle='#f6dc9b';c.beginPath();c.arc(j,-5,4,0,7);c.fill();c.fillStyle='#303234';c.beginPath();c.arc(j,-5,1.8,0,7);c.fill();}}
    else{c.beginPath();c.moveTo(-25,9);c.lineTo(11,-12);c.stroke();c.fillStyle='#fff1bd';c.beginPath();c.arc(13,-13,5,0,7);c.fill();}c.restore();}
  roomDetails(c,x,y,s,car){
    const grade=roomGrade(car.level),tier=Math.floor((grade.level-1)/4);
    // Each paid tier is visible across its cabin, not just in a menu progress bar.
    if(car.level>1){c.fillStyle='#f9c374';for(let k=0;k<Math.min(car.level,20);k++)c.fillRect(x+(21+k*11)*s,y+45*s,6*s,3*s);}
    if(tier===0)return;
    // A visible full-frame restoration: material, corner plates and roof lining are tier-dependent.
    c.save();const frames=['#786e59','#516f65','#376b68','#3c4a72','#753e49'];const metal=['#ac875b','#cba36b','#e0c092','#d5b572','#f3d59b'];
    const g=c.createLinearGradient(x,y+25*s,x,y+170*s);g.addColorStop(0,metal[tier]);g.addColorStop(.25,frames[tier]);g.addColorStop(.82,frames[tier]);g.addColorStop(1,metal[tier]);c.strokeStyle=g;c.lineWidth=(4+tier)*s;rr(c,x+12*s,y+23*s,252*s,145*s,10*s);c.stroke();
    c.strokeStyle=metal[tier];c.lineWidth=1.1*s;rr(c,x+17*s,y+28*s,242*s,135*s,8*s);c.stroke();
    if(tier>=2){c.fillStyle=frames[tier];c.fillRect(x+22*s,y+166*s,233*s,7*s);for(let q=0;q<12;q++){c.fillStyle=metal[tier];c.fillRect(x+(24+q*20)*s,y+168*s,2*s,3*s)}}
    // Workshop licenses are separate visual commissions: enamel plaques, corner inlays and a master crest.
    const rank=workshopRank(car);for(let i=0;i<rank;i++){const xx=x+(28+i*18)*s;c.fillStyle='#223a35';rr(c,xx,y+177*s,13*s,13*s,2*s);c.fill();c.strokeStyle=metal[tier];c.lineWidth=s;c.stroke();c.fillStyle=metal[tier];c.beginPath();c.moveTo(xx+6.5*s,y+179*s);c.lineTo(xx+11*s,y+183.5*s);c.lineTo(xx+6.5*s,y+188*s);c.lineTo(xx+2*s,y+183.5*s);c.closePath();c.fill();}
    if(rank>=2){for(const xx of [23,246]){c.fillStyle='#233c38';rr(c,x+xx*s,y+48*s,9*s,84*s,3*s);c.fill();c.strokeStyle=metal[tier];c.stroke();}}
    if(rank>=3){c.fillStyle='#f1d9a3';for(const xx of [22,246]){c.beginPath();c.arc(x+xx*s,y+35*s,4*s,0,Math.PI*2);c.fill();}}
    if(rank===4){c.fillStyle='#722f3d';rr(c,x+125*s,y+12*s,26*s,24*s,7*s);c.fill();c.strokeStyle='#f1d9a3';c.stroke();c.fillStyle='#f1d9a3';c.font=`bold ${14*s}px Georgia,serif`;c.textAlign='center';c.fillText('M',x+138*s,y+29*s);}
    c.restore();
    c.save();
    // Modular furnishings are rendered on the actual room, with increasingly ornate materials.
    const palettes=[['#6e6953','#af8060'],['#627f72','#d6ba86'],['#356c62','#e9c88c'],['#405069','#e0b979'],['#6e3f42','#f4d99e']];const [cloth,trim]=palettes[tier];
    c.fillStyle=cloth;c.globalAlpha=.9;for(const xx of [22,239]){rr(c,x+xx*s,y+72*s,14*s,67*s,4*s);c.fill();c.fillStyle=trim;c.fillRect(x+xx*s,y+109*s,14*s,3*s);c.fillStyle=cloth;}
    if(tier>=2){c.fillStyle=cloth;rr(c,x+79*s,y+148*s,118*s,11*s,4*s);c.fill();c.strokeStyle=trim;c.lineWidth=1.4*s;c.stroke();}
    if(tier>=3){c.fillStyle=trim;for(const xx of [55,219]){rr(c,x+xx*s,y+88*s,10*s,13*s,3*s);c.fill();}c.strokeStyle=trim;rr(c,x+15*s,y+26*s,246*s,139*s,11*s);c.stroke();}
    c.strokeStyle=tier>=3?'#f9e5b2':'#d8a966';c.lineWidth=(2+tier*.38)*s;c.globalAlpha=.78;
    c.beginPath();c.moveTo(x+19*s,y+38*s);c.lineTo(x+258*s,y+38*s);c.stroke();
    c.fillStyle='#f6d18d';for(const xx of [34,242]){c.beginPath();c.arc(x+xx*s,y+61*s,(3+tier)*s,0,7);c.fill();}
    if(tier>=2){c.fillStyle='#68a48c';for(const xx of [47,221]){c.fillRect(x+xx*s,y+144*s,24*s,6*s);c.beginPath();c.arc(x+(xx+12)*s,y+138*s,9*s,0,7);c.fill();}}
    if(tier>=3){c.strokeStyle='#ffdb99';c.lineWidth=2*s;for(let q=0;q<4;q++){const px=x+(54+q*50)*s;c.beginPath();c.moveTo(px,y+60*s);c.lineTo(px+7*s,y+69*s);c.lineTo(px,y+78*s);c.stroke();}}
    if(tier>=2){const x0=x+138*s,y0=y+112*s;c.save();c.translate(x0,y0);c.scale(s,s);c.strokeStyle=trim;c.lineWidth=1.3;c.fillStyle=cloth;
      if(['library','postal'].includes(car.type)){rr(c,-32,-24,64,32,2);c.fill();c.stroke();for(let q=0;q<9;q++){c.fillStyle=q%2?'#c39765':'#69887b';c.fillRect(-27+q*6,-20,4,11);c.fillRect(-27+q*6,-4,4,9);}}
      else if(['cafe','bakery','diner'].includes(car.type)){rr(c,-36,-7,72,16,3);c.fill();c.stroke();for(let q=0;q<5;q++){c.fillStyle='#e7c391';c.beginPath();c.ellipse(-24+q*12,-8,5,3,0,0,7);c.fill();}}
      else if(car.type==='garden'){for(let q=-1;q<=1;q++){c.fillStyle='#a27756';c.fillRect(q*18-5,-1,10,9);c.fillStyle='#8bb28a';for(let j=0;j<3;j++){c.beginPath();c.ellipse(q*18+(j-1)*5,-8-j%2*4,6,3,j-1,0,7);c.fill();}}}
      else if(['sleeper','lounge'].includes(car.type)){rr(c,-37,-4,74,15,4);c.fill();c.stroke();c.fillStyle='#e8d4a7';rr(c,-33,-7,15,11,3);c.fill();rr(c,18,-7,15,11,3);c.fill();}
      else if(['arcade','cinema','observatory'].includes(car.type)){rr(c,-24,-23,48,30,3);c.fill();c.stroke();c.fillStyle='#a4beb9';c.fillRect(-18,-17,36,17);c.fillStyle='#f8de9d';for(const q of [-12,0,12])c.fillRect(q,-10,3,3);}
      else{rr(c,-25,-6,50,12,2);c.fill();c.stroke();c.fillStyle='#c9b48c';for(let q=0;q<5;q++)c.fillRect(-20+q*9,-13,4,8);}
      c.restore();}
    if(tier>=4){c.shadowColor='#ffd58c';c.shadowBlur=16*s;c.fillStyle='#ffdb8f';c.font=`bold ${18*s}px Georgia,serif`;c.textAlign='center';c.fillText('✦  ✦  ✦',x+138*s,y+31*s);c.shadowBlur=0;}
    c.restore();
  }
  sceneryTravel(c,w,h,l){if(!this.motion)return;
    const region=this.state.activeRegion,s=l.s,dist=this.distance;
    // Passing foreground landmarks visibly slow and stop with the locomotive.
    const count=w<650?3:6;c.save();
    // Distinct, speed-coupled depth layers. Their distance phases remain fixed at a station.
    for(let i=0;i<6;i++){const xx=((i*267-dist*.095)%(w+260)+(w+260))%(w+260)-100;const yy=l.trainY+34*s+Math.sin(i*2)*8*s;c.globalAlpha=.11;c.fillStyle=region==='desert'?'#725b50':'#3d5851';c.beginPath();c.moveTo(xx-18*s,yy);c.lineTo(xx,yy-52*s);c.lineTo(xx+19*s,yy);c.fill();}
    for(let i=0;i<count;i++){
      const x=((i*417-dist*.38)%(w+260)+(w+260))%(w+260)-100;
      const y=l.trainY+270*s;
      c.globalAlpha=.32;c.strokeStyle=region==='desert'?'#f1bd83':'#a3b5a0';c.lineWidth=2*s;
      c.beginPath();c.moveTo(x,y);c.lineTo(x,y-33*s);c.stroke();
      if(region==='metropolis'){c.fillStyle='#d1a8f1';c.fillRect(x-5*s,y-35*s,10*s,9*s)}
      else{c.fillStyle=region==='desert'?'#b29a73':'#568f74';c.beginPath();c.arc(x,y-39*s,8*s,0,7);c.fill();}
    }c.restore();
  }
  stationArrival(c,w,h,l){const phase=journeyMotion(this.state);
    if(phase.phase==='enroute')return;
    const isNext=phase.phase==='approaching';const destination=isNext?nextDestination(this.state):DESTINATIONS.find(d=>d.id===this.state.lastStation);
    if(!destination)return;
    const signW=Math.min(350,w*.46);const baseX=w<650?Math.max(10,w-signW-12):Math.max(w*.65,w-400),sx=baseX+(this.motion?(phase.phase==='approaching'?phase.speed*w*.45:phase.phase==='departing'?-phase.speed*w*.65:0):0),sy=l.trainY+85*l.s,scale=Math.max(.8,l.s);
    c.save();c.globalAlpha=phase.phase==='approaching'?.75:1;
    const stationRegion=REGIONS.find(r=>r.id===destination.region);c.fillStyle=stationRegion?.accent||'#987b65';c.globalAlpha=.88;
    // Region-specific platform canopy silhouette and posts; actual arrival sign stays on top.
    const stationAsset=this.images['station-'+destination.id];if(ready(stationAsset)){c.drawImage(this.raster('station-'+destination.id,stationAsset,signW+28*scale,166*scale),sx-14*scale,sy-143*scale,signW+28*scale,166*scale);}else{const stationIndex=DESTINATIONS.findIndex(d=>d.id===destination.id),roof=stationIndex%4;const roofY=sy-116*scale,mid=sx+signW*.5;
    c.fillStyle=destination.biome==='desert'?'#ba9063':destination.biome==='snow'?'#b4c8cc':destination.biome==='city'?'#40566a':destination.biome==='coast'?'#66858a':'#816951';
    c.fillRect(sx-12*scale,roofY,signW+24*scale,119*scale);
    c.strokeStyle='#e0bf88';c.lineWidth=2*scale;for(let j=0;j<4;j++){const xx=sx+signW*(j+.5)/4;c.fillStyle='#554d43';rr(c,xx-10*scale,roofY+48*scale,20*scale,33*scale,roof===2?10*scale:2*scale);c.fill();c.stroke();c.fillStyle='#eed6a3';c.globalAlpha=.48;c.fillRect(xx-7*scale,roofY+52*scale,14*scale,23*scale);c.globalAlpha=.88;}
    c.fillStyle=stationRegion?.accent||'#987b65';c.beginPath();c.moveTo(sx-18*scale,roofY);if(roof===0){c.lineTo(mid,roofY-35*scale);}else if(roof===1){c.lineTo(sx+signW*.22,roofY-23*scale);c.lineTo(sx+signW*.78,roofY-23*scale);}else if(roof===2){c.quadraticCurveTo(mid,roofY-67*scale,sx+signW+18*scale,roofY);}else{c.lineTo(sx+signW*.15,roofY-12*scale);c.lineTo(sx+signW*.15,roofY-29*scale);c.lineTo(sx+signW*.85,roofY-29*scale);c.lineTo(sx+signW*.85,roofY-12*scale);}c.lineTo(sx+signW+18*scale,roofY);c.closePath();c.fill();c.stroke();
    if(stationIndex%2===0){c.fillStyle='#383b3d';c.fillRect(mid-9*scale,roofY-47*scale,18*scale,25*scale);c.fillStyle='#f5ddb0';c.beginPath();c.arc(mid,roofY-37*scale,7*scale,0,7);c.fill();c.strokeStyle='#3d3936';c.beginPath();c.moveTo(mid,roofY-37*scale);c.lineTo(mid+3*scale,roofY-41*scale);c.moveTo(mid,roofY-37*scale);c.lineTo(mid,roofY-42*scale);c.stroke();}else{c.fillStyle='#dfc794';c.fillRect(sx-18*scale,roofY-36*scale,3*scale,36*scale);c.fillRect(sx-15*scale,roofY-36*scale,21*scale,10*scale);}c.fillStyle='#8e7760';for(const x of [sx+4*scale,sx+signW-10*scale])c.fillRect(x,sy-116*scale,6*scale,163*scale);c.globalAlpha=1;}
    c.globalAlpha=1;c.fillStyle='#2a2939';c.strokeStyle='#eac58b';c.lineWidth=3*scale;
    rr(c,sx,sy-110*scale,signW,60*scale,7*scale);c.fill();c.stroke();
    c.fillStyle='#f7d8a6';c.font=`bold ${Math.min(19,17*scale)}px Georgia,serif`;c.textAlign='center';c.fillText(destination.name.toUpperCase(),sx+signW/2,sy-75*scale,Math.min(325,w*.43));
    c.fillStyle='#eebf79';c.font=`bold ${Math.max(9,11*scale)}px Georgia,serif`;c.fillText(phase.phase==='approaching'?'ARRIVING SOON':phase.phase==='platform'?'ALL ABOARD':'DEPARTING',sx+signW/2,sy-55*scale);
    if(phase.phase==='platform'){
       c.fillStyle='#745d48';c.fillRect(sx-10*scale,sy+49*scale,signW+20*scale,6*scale);c.fillStyle='#d5bd92';c.fillRect(sx-10*scale,sy+45*scale,signW+20*scale,4*scale);
       // Platform crowds change only at the physical arrival event in economy.js.
       const n=Math.min(7,this.state.lastBoarding+this.state.lastAlighting);
       for(let i=0;i<n;i++)this.person(c,sx+22*scale+i*38*scale,sy+40*scale,scale*.8,i+5);
       c.font=`bold ${Math.max(10,12*scale)}px Georgia,serif`;c.textAlign='left';c.fillStyle='#ffe9b7';
       c.fillText(`${this.state.lastBoarding} BOARDING  ·  ${this.state.lastAlighting} ALIGHTING`,sx,sy+65*scale);
    }c.restore();
  }
  wheel(c,x,y,r){c.save();c.translate(x,y);c.rotate(this.motion?this.wheelRotation:0);c.strokeStyle='#eebc78';c.globalAlpha=.75;c.lineWidth=1.7;for(let k=0;k<6;k++){const t=k*Math.PI/3;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(t)*r,Math.sin(t)*r);c.stroke()}c.restore()}
  person(c,x,y,s,k,type='platform',staff=false){c.save();c.translate(x,y);const phase=this.motion?this.t*3.1+k*1.6:0;const resting=!staff&&type==='sleeper'&&Math.sin(phase*.15)<.25;const working=staff||['library','postal','bakery','workshop','cafe','diner'].includes(type);if(resting){c.translate(1*s,8*s);c.rotate(-Math.PI/2);}c.fillStyle=k?'#e8ac72':'#e4bc90';c.fillRect(-4*s,-15*s,9*s,9*s);c.fillStyle=['#a75a4e','#698c9e','#6d875b','#b18a58','#79566c'][k%5];c.fillRect(-5*s,-5*s,11*s,15*s);c.fillStyle='#2b273a';const step=this.motion&&!resting&&!working?Math.sin(phase)*3*s:0;c.fillRect(-3*s+step,9*s,3*s,6*s);c.fillRect(3*s-step,9*s,3*s,6*s);c.strokeStyle='#dab58a';c.lineWidth=2*s;c.beginPath();c.moveTo(-4*s,-1*s);c.lineTo(-8*s,(working?1+Math.sin(phase)*4:6)*s);c.moveTo(5*s,-1*s);c.lineTo(9*s,(working?1-Math.sin(phase)*4:6)*s);c.stroke();if(type==='library'&&!staff){c.fillStyle='#eed5a8';c.fillRect(6*s,0,7*s,5*s);}c.restore()}
  steam(c,x,y,s){if(!this.motion)return;for(let j=0;j<8;j++){const p=(this.t*(.12+.14*this.travelSpeed)+j/8)%1;const xx=x-(p*175+Math.sin(j*1.4+p*4)*15)*s,yy=y-(p*125)*s;
   c.globalAlpha=(1-p)*.45;c.fillStyle='#fff0e7';c.beginPath();c.arc(xx,yy,(16+34*p)*s,0,Math.PI*2);c.fill();}c.globalAlpha=1}
  weather(c,w,h,s,bx,by){const st=this.state;
    // Gentle 6-minute day/night cycle and biome-dependent atmospheric motifs.
    const twilight=(Math.sin(this.t/175)*.5+.5);const season=visualSeason(st);
    c.fillStyle='#182242';c.globalAlpha=twilight*.17;c.fillRect(0,0,w,h*.85);c.globalAlpha=1;
    const region=st.activeRegion||'heartland';const snowy=['highland','frontier','beyond'].includes(region);const tint={coast:'#356e9d',highland:'#7198b8',desert:'#a9733b',metropolis:'#574081',frontier:'#3c8d87',archipelago:'#315f9a',beyond:'#864989'}[region];if(tint){c.fillStyle=tint;c.globalAlpha=.17;c.fillRect(0,0,w,h*.92);c.globalAlpha=1;}
    // Seasonal light and particles are driven by service time or the user's selected season.
    const seasonTint={Spring:'#e0b5b3',Summer:'#f2ce8d',Autumn:'#be7840',Winter:'#b6d8e7'}[season];c.fillStyle=seasonTint;c.globalAlpha=season==='Autumn'?.10:.055;c.fillRect(0,0,w,h);c.globalAlpha=1;
    if(this.motion&&!this.lowPower&&(season==='Winter'||season==='Autumn'||season==='Spring')){c.save();c.fillStyle=season==='Winter'?'#eef5ee':season==='Autumn'?'#d6a060':'#efc6c6';c.globalAlpha=.5;for(let i=0;i<22;i++){const xx=(i*97+this.t*(9+i%7))%w,yy=(i*131+this.t*(12+i%4))%h;c.beginPath();c.ellipse(xx,yy,season==='Winter'?1.7:3,season==='Winter'?1.7:1.5,i,0,Math.PI*2);c.fill();}c.restore();}
    // Locally generated regional weather motifs: geometry is tied to the route,
    // not a decorative animation independent of simulation state.
    if(region==='archipelago'||region==='coast'){
      c.save();c.globalAlpha=.28;c.strokeStyle='#fff3d6';c.lineWidth=2;
      for(let j=0;j<8;j++){let x=(j*176+(this.motion?this.t*20:0))%Math.max(1,w),y=h*(.28+(j%3)*.09);c.beginPath();c.moveTo(x-12,y+3);c.quadraticCurveTo(x,y-8,x+12,y+3);c.stroke();}c.restore();
    }
    if(region==='desert'){
      c.save();c.globalAlpha=.23;c.strokeStyle='#fbe4af';c.lineWidth=1.5;
      for(let j=0;j<14;j++){const x=(j*127+(this.motion?this.t*37:0))%Math.max(1,w),y=h*(.31+(j%5)*.04);c.beginPath();c.moveTo(x-22,y);c.quadraticCurveTo(x,y-5,x+22,y);c.stroke()}c.restore();
    }
    if(region==='metropolis'){
      c.save();c.globalAlpha=.23;for(let j=0;j<19;j++){const x=j*w/19,y=h*.31+Math.sin(j*9)*17;c.fillStyle=j%3?'#fbca8a':'#c4e4ed';c.fillRect(x,y,2.2,4);c.fillRect(x+7,y+11,2.2,4)}c.restore();
    }
    if(region==='frontier'||region==='beyond'){
      c.save();c.globalAlpha=.14;c.strokeStyle=region==='frontier'?'#93efbd':'#f9b8f3';c.lineWidth=Math.max(4,w*.009);
      for(let j=0;j<3;j++){c.beginPath();for(let x=0;x<=w;x+=12){const y=h*(.16+j*.025)+Math.sin(x/w*9+j*2+(this.motion?this.t*.35:0))*h*.032;x===0?c.moveTo(x,y):c.lineTo(x,y)}c.stroke()}c.restore();
    }
    if(snowy&&this.motion){c.fillStyle='#fffcdf';for(let j=0;j<45;j++){const x=((j*127.3+this.t*(9+j%4))%w),y=((j*81.7+this.t*(16+j%4))%(h*.77));c.globalAlpha=.35+(j%3)*.13;c.beginPath();c.arc(x,y,1+j%2,0,7);c.fill()}c.globalAlpha=1}
    if(this.motion){c.globalAlpha=.1;c.fillStyle='#fff3d0';for(let j=0;j<11;j++){const x=(j*211+this.t*(8+j%3))%w,y=70+(j*67)%(Math.max(100,h*.4));c.beginPath();c.ellipse(x,y,10+j%5*7,3+j%3*3,0,0,7);c.fill()}c.globalAlpha=1}
  }
}
