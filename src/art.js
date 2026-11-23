// An asset-led Canvas2D scene. Gameplay state is owned by economy.js, never this render loop.
import {CARRIAGES} from './data.js';
const W=1672,H=941,CAR_W=276,ENGINE_W=318;
const sprites={sleeper:'sleeper',cafe:'cafe',garden:'garden',library:'observatory',diner:'cafe',arcade:'arcade',workshop:'garden',observatory:'observatory'};
const names={sleeper:'SLEEPER',cafe:'CAFÉ',garden:'GREENHOUSE',library:'LIBRARY',diner:'DINING CAR',arcade:'ARCADE',workshop:'WORKSHOP',observatory:'OBSERVATORY'};
const src=n=>new URL('../assets/'+n,import.meta.url).href;
function asset(name){const img=new Image();img.src=src(name);return img}
function ready(img){return img?.complete&&img.naturalWidth>0}
function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
export class LivingScene {
  constructor(canvas,onSelect,onSighting){
    this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.images={world:asset('world.webp'),engine:asset('car-engine.png')};
    for(const [key,value] of Object.entries(sprites))this.images[key]=asset('car-'+value+'.png');
    this.onSelect=onSelect;this.onSighting=onSighting;this.state=null;this.motion=true;this.sighting=null;
    this.pan=0;this.panGoal=0;this.renderedAt=0;this.hintDone=false;this.pointer=null;this.last=0;this.t=0;this.burst=[];this.width=1;this.height=1;
    canvas.addEventListener('pointerdown',e=>this.down(e));canvas.addEventListener('pointermove',e=>this.move(e));canvas.addEventListener('pointerup',e=>this.up(e));canvas.addEventListener('pointercancel',()=>this.pointer=null);
    canvas.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){this.onSelect(Math.min(this.state.cars.length-1,this.state.selected+1));e.preventDefault()}if(e.key==='ArrowLeft'){this.onSelect(Math.max(0,this.state.selected-1));e.preventDefault()}});
    window.addEventListener('resize',()=>this.resize());this.resize();requestAnimationFrame(t=>this.frame(t));
  }
  resize(){const rect=this.canvas.getBoundingClientRect();this.width=Math.max(1,rect.width);this.height=Math.max(1,rect.height);const d=Math.min(window.devicePixelRatio||1,2);this.canvas.width=Math.round(this.width*d);this.canvas.height=Math.round(this.height*d);this.ctx.setTransform(d,0,0,d,0,0);this.dpr=d}
  scale(){const isNarrow=this.width<750;return isNarrow?Math.max(.75,Math.min(1.08,this.height/941)) : Math.max(this.width/W,this.height/H)}
  bound(){if(!this.state)return 0;return Math.max(0,(this.state.cars.length*CAR_W+ENGINE_W)-this.width/this.scale()+120)/2}
  focus(index){if(!this.state)return;const length=this.state.cars.length*CAR_W+ENGINE_W;const selected=(index<0?length-ENGINE_W*.5:index*CAR_W+CAR_W/2)-length/2;
   const narrow=this.width<950;this.panGoal=narrow?Math.max(-this.bound(),Math.min(this.bound(),selected)):0;}
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
  pop(x,y){for(let k=0;k<17;k++)this.burst.push({x,y,dx:(Math.random()-.5)*125,dy:(Math.random()-.5)*130,life:1,color:k%2?'#ffcf70':'#fff5bb'});}
  frame(now){if(now-this.renderedAt<(this.width<900?30:16)){requestAnimationFrame(t=>this.frame(t));return;}this.renderedAt=now;const dt=this.last?Math.min(.06,(now-this.last)/1000):0;this.last=now;this.t+=this.motion?dt:0;
    this.pan+=(this.panGoal-this.pan)*(this.motion?.13:1);if(this.state)this.paint(dt);
    if(!document.hidden)requestAnimationFrame(t=>this.frame(t));else setTimeout(()=>requestAnimationFrame(t=>this.frame(t)),750);
  }
  paint(dt){const c=this.ctx,w=this.width,h=this.height,l=this.layout();c.save();c.clearRect(0,0,w,h);c.fillStyle='#29233d';c.fillRect(0,0,w,h);
    const world=this.images.world;const scale=Math.max(w/W,h/H),bx=(w-W*scale)/2,by=(h-H*scale)/2-(w<900?82:0);
    if(ready(world))c.drawImage(world,bx,by,W*scale,H*scale);else {const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#615079');g.addColorStop(.5,'#efad84');g.addColorStop(1,'#244447');c.fillStyle=g;c.fillRect(0,0,w,h)}
    // Externally authored background and internally simulated motion are separate layers.
    this.weather(c,w,h,scale,bx,by);
    const engineX=l.base+this.state.cars.length*CAR_W;
    const underY=l.y0+638*l.s;
    // Animated rails and rolling ballast scroll beneath the stationary camera.
    c.fillStyle='#312b3e';c.fillRect(0,underY,w,8*l.s);c.fillStyle='#d5a45e';c.fillRect(0,underY,w,2.5*l.s);
    c.fillStyle='#392b2c';const step=49*l.s;for(let px=-step+(this.motion?this.t*110*l.s:0)%step;px<w;px+=step)c.fillRect(px,underY+5*l.s,23*l.s,7*l.s);
    this.state.cars.forEach((car,i)=>{
      const x=l.drawX(l.base+i*CAR_W),y=l.trainY;if(x+CAR_W*l.s<0||x>this.width)return;const sprite=this.images[car.type];const ww=CAR_W*l.s,hh=226*l.s;
      if(ready(sprite))c.drawImage(sprite,x,y,ww,hh);else{c.fillStyle=CARRIAGES[car.type].color;c.fillRect(x,y+23*l.s,ww,hh-23*l.s)}
      // Repaint the signage as an actual stateful prop. Also fixes source labels when sprites are reused.
      const sigW=145*l.s,sigX=x+(ww-sigW)/2,sigY=y+169*l.s;
      c.fillStyle='#1d1a26';rr(c,sigX,sigY,sigW,27*l.s,6*l.s);c.fill();c.strokeStyle='#dba354';c.lineWidth=2*l.s;c.stroke();
      c.font=`bold ${Math.max(9,15*l.s)}px Georgia,serif`;c.fillStyle='#f7ce80';c.textAlign='center';c.fillText(names[car.type],x+ww/2,sigY+18*l.s);
      if(car.level>1){c.fillStyle='#ffc576';for(let k=0;k<Math.min(car.level,10);k++)c.fillRect(x+(34+k*17)*l.s,y+44*l.s,8*l.s,3*l.s)}
      if(car.staff>0){for(let k=0;k<car.staff;k++)this.person(c,x+(95+k*44)*l.s,y+(121+Math.sin(this.t*2+k*1.1)*3)*l.s,l.s,k)}
      if(this.state.decor.includes('flowers')){c.fillStyle='#6f9d59';for(let k=0;k<5;k++){c.beginPath();c.arc(x+(35+k*43)*l.s,y+156*l.s,6*l.s,0,7);c.fill();c.fillStyle='#f1b0a9';c.fillRect(x+(35+k*43)*l.s,y+152*l.s,4*l.s,4*l.s);c.fillStyle='#6f9d59'}}
      if(this.state.decor.includes('lanterns')){c.fillStyle='#ffdc80';c.shadowColor='#ffc16a';c.shadowBlur=15*l.s;for(const k of [26,245]){c.beginPath();c.arc(x+k*l.s,y+62*l.s,4*l.s,0,7);c.fill()}c.shadowBlur=0}
      if(i===this.state.selected){c.shadowColor='#ffcc76';c.shadowBlur=(17+Math.sin(this.t*3)*5)*l.s;c.strokeStyle='#ffe2a2';c.lineWidth=3*l.s;rr(c,x+3*l.s,y+20*l.s,ww-6*l.s,180*l.s,20*l.s);c.stroke();c.shadowBlur=0}
      // Every painted wheel is an actual moving mechanical overlay, not a CSS animation unrelated to the train.
      for(const q of [62,216])this.wheel(c,x+q*l.s,y+204*l.s,8*l.s);
    });
    const ix=l.drawX(engineX),iy=l.trainY;
    if(ready(this.images.engine)){
      const filters={copper:'sepia(.52) saturate(1.35)',sage:'sepia(.25) hue-rotate(54deg) saturate(.8)',plum:'sepia(.25) hue-rotate(233deg) saturate(.9)'};
      c.filter=filters[this.state.trainPaint]||'none';c.drawImage(this.images.engine,ix,iy,ENGINE_W*l.s,226*l.s);c.filter='none';
    }
    else{c.fillStyle='#1e2934';c.fillRect(ix,iy+54*l.s,ENGINE_W*l.s,140*l.s)}
    this.wheel(c,ix+73*l.s,iy+197*l.s,24*l.s);this.wheel(c,ix+143*l.s,iy+197*l.s,24*l.s);
    this.steam(c,ix+145*l.s,iy+52*l.s,l.s);
    if(this.state.decor.includes('pennants')){for(let k=0;k<this.state.cars.length;k++){const x=l.drawX(l.base+k*CAR_W+130);c.fillStyle=k%2?'#ef9b75':'#f2ca71';c.beginPath();c.moveTo(x,l.trainY+10*l.s);c.lineTo(x+18*l.s,l.trainY+14*l.s);c.lineTo(x,l.trainY+25*l.s);c.fill();}}
    if(this.sighting){const xx=l.drawX(this.sighting.x),yy=l.y0+this.sighting.y*l.s;
      c.font=`${Math.floor(39*l.s)}px Georgia,serif`;c.textAlign='center';c.shadowColor='#fff3b1';c.shadowBlur=15;c.fillText('✦',xx,yy+Math.sin(this.t*3)*5);c.shadowBlur=0;
      c.font=`bold ${Math.floor(12*l.s)}px Georgia,serif`;c.fillStyle='#ffe9bb';c.fillText('TAP FOR A STAMP',xx,yy+22*l.s);}
    for(const b of this.burst){b.x+=b.dx*dt;b.y+=b.dy*dt;b.life-=dt*1.3;if(b.life>0){c.globalAlpha=b.life;c.fillStyle=b.color;c.beginPath();c.arc(b.x,b.y,Math.max(1,b.life*4),0,7);c.fill();}}this.burst=this.burst.filter(b=>b.life>0);c.globalAlpha=1;
    // Traveling speed is illustrated by a fine foreground layer; earnings only advance via wall-clock tick().
    if(this.motion){c.globalAlpha=.24;c.strokeStyle='#ffe1a7';c.lineWidth=1;const speed=(this.t*38)%82;for(let k=0;k<15;k++){const xx=((k*109+speed*2)%Math.max(1,w)),yy=h*.79+Math.sin(k*2)*15;c.beginPath();c.moveTo(xx,yy);c.lineTo(xx+17,yy);c.stroke()}c.globalAlpha=1}
    c.restore();
  }
  wheel(c,x,y,r){c.save();c.translate(x,y);c.rotate(this.motion?this.t*2.8:0);c.strokeStyle='#eebc78';c.globalAlpha=.75;c.lineWidth=1.7;for(let k=0;k<6;k++){const t=k*Math.PI/3;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(t)*r,Math.sin(t)*r);c.stroke()}c.restore()}
  person(c,x,y,s,k){c.save();c.translate(x,y);c.fillStyle=k?'#e8ac72':'#e4bc90';c.fillRect(-4*s,-15*s,9*s,9*s);c.fillStyle=k?'#698c9e':'#a75a4e';c.fillRect(-5*s,-5*s,11*s,15*s);c.fillStyle='#2b273a';c.fillRect(-3*s,9*s,3*s,6*s);c.fillRect(3*s,9*s,3*s,6*s);c.restore()}
  steam(c,x,y,s){if(!this.motion)return;for(let j=0;j<8;j++){const p=(this.t*.21+j/8)%1;const xx=x-(p*175+Math.sin(j*1.4+p*4)*15)*s,yy=y-(p*125)*s;
   c.globalAlpha=(1-p)*.45;c.fillStyle='#fff0e7';c.beginPath();c.arc(xx,yy,(16+34*p)*s,0,Math.PI*2);c.fill();}c.globalAlpha=1}
  weather(c,w,h,s,bx,by){const st=this.state;
    // Gentle 6-minute day/night cycle and biome-dependent atmospheric motifs.
    const twilight=(Math.sin(this.t/175)*.5+.5);
    c.fillStyle='#182242';c.globalAlpha=twilight*.17;c.fillRect(0,0,w,h*.85);c.globalAlpha=1;
    const region=st.activeRegion||'heartland';const snowy=['highland','frontier','beyond'].includes(region);const tint={coast:'#356e9d',highland:'#7198b8',desert:'#a9733b',metropolis:'#574081',frontier:'#3c8d87',archipelago:'#315f9a',beyond:'#864989'}[region];if(tint){c.fillStyle=tint;c.globalAlpha=.17;c.fillRect(0,0,w,h*.92);c.globalAlpha=1;}
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
