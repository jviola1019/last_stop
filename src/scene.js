import {CARRIAGES,DESTINATIONS,PAINTS} from './data.js';
import {satisfaction} from './economy.js';
const PI=Math.PI, TAU=PI*2;
function path(ctx,coords,fill,stroke,lw=1){ctx.beginPath();ctx.moveTo(coords[0],coords[1]);for(let i=2;i<coords.length;i+=2)ctx.lineTo(coords[i],coords[i+1]);ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}}
function rr(c,x,y,w,h,r,fill,stroke='',lw=1){if(w<=0||h<=0)return;c.beginPath();c.roundRect(x,y,w,h,Math.min(r,w/2,h/2));if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke()}}
function circle(c,x,y,r,fill,stroke='',lw=1){c.beginPath();c.arc(x,y,Math.max(.1,r),0,TAU);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke()}}
function line(c,x1,y1,x2,y2,color,width=1){c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.strokeStyle=color;c.lineWidth=width;c.stroke()}
function text(c,str,x,y,size,color='#fff',font='sans-serif',align='left',weight='400'){c.fillStyle=color;c.font=`${weight} ${size}px ${font}`;c.textAlign=align;c.fillText(str,x,y)}
const palette={ink:'#203b46',navy:'#28454c',dark:'#172f39',cream:'#f4e9ce',gold:'#f2ce86',wood:'#8a5539',soil:'#9e8969',faint:'#b0c6bf',copper:'#d4915a'};
function star(c,x,y,r,col='#ffefd0'){line(c,x-r,y,x+r,y,col,1.3);line(c,x,y-r,x,y+r,col,1.3)}
function cloud(c,x,y,scale,alpha=.5){c.save();c.globalAlpha=alpha;circle(c,x,y+6,21*scale,'#fff8e2');circle(c,x+22*scale,y,31*scale,'#fff8e2');circle(c,x+52*scale,y+7,23*scale,'#fff8e2');rr(c,x-7*scale,y+6*scale,74*scale,23*scale,11,'#fff8e2');c.restore()}
function hills(c,w,h,t,biome,night){const coast=biome==='coast',snow=biome==='snow',city=biome==='city',desert=biome==='desert';const valley=biome==='valley';
  const baseY=h*.72;
  const ranges=[[210,36,.12],[140,26,.24],[70,13,.39]];
  ranges.forEach(([size,speed,z],idx)=>{
    let fill=idx===0?'#93aeb0':idx===1?'#7f9d92':'#668878';
    if(snow)fill=['#a5bcc9','#a0afb4','#698b8d'][idx];
    if(desert)fill=['#d8ab79','#be9c70','#a47b59'][idx];
    if(coast)fill=['#a0c2b7','#79a9a5','#4e8c8b'][idx];
    if(valley)fill=['#b3b69d','#91a18b','#738b6e'][idx];
    if(city)fill=['#a4a9b2','#7f91a3','#5e748c'][idx];
    c.beginPath();c.moveTo(-5,h+5);
    let xx=-size*3-((t*speed*32)%size);c.lineTo(xx,baseY+idx*22);
    while(xx<w+size*3){const wave= Math.sin((xx+t*2)*.004+idx)*12;const y=baseY-66+idx*32+wave;
      if(desert){c.quadraticCurveTo(xx+size*.55,y-36,xx+size,y+6)}
      else if(city){c.lineTo(xx+size*.1,baseY+2);c.lineTo(xx+size*.1,y);c.lineTo(xx+size*.65,y);c.lineTo(xx+size*.65,baseY+7)}
      else{c.lineTo(xx+size*.18,baseY+3);c.lineTo(xx+size*.55,y-(idx===0?32:18));c.lineTo(xx+size*.88,baseY+4)}
      xx+=size;
    }c.lineTo(w+10,h+3);c.closePath();c.fillStyle=fill;c.fill();
    if(snow&&idx<2){c.globalAlpha=.75;const step=size;for(let x=-step*2-((t*speed*32)%step);x<w+step;x+=step){path(c,[x+step*.42,baseY-63+idx*32,x+step*.55,baseY-93+idx*32,x+step*.68,baseY-66+idx*32],'#ecf1e7')}c.globalAlpha=1}
  });
  if(coast){rr(c,0,baseY+12,w,h-baseY,0,'#5d9ca5');for(let i=0;i<24;i++){const x=(i*101-t*19)%(w+170);line(c,x,baseY+39+(i%3)*10,x+27,baseY+39+(i%3)*10,night?'#95b8b6':'#d4e3d0',1.8)}}
}
function trees(c,w,h,t,biome){const y=h*.77;
  if(['coast','city','desert'].includes(biome)){
    for(let i=0;i<21;i++){const x=((i*133-t*55)%(w+310)+w+310)%(w+310)-90;
      if(biome==='desert'){line(c,x,y-30,x,y,'#6a755d',5);line(c,x,y-23,x-11,y-31,'#6a755d',4);line(c,x-11,y-31,x-11,y-40,'#6a755d',4);}
      if(biome==='city'){rr(c,x,y-60+(i%3)*9,24,65,1,i%2?'#597b84':'#476d7c');for(let j=0;j<3;j++)for(let k=0;k<4;k++)rr(c,x+5+j*6,y-52+(i%3)*9+k*12,2,4,1,(j+k+i)%3?'#eed2a0':'#394f66')}
      if(biome==='coast'){line(c,x,y-42,x,y,'#a0af98',2);path(c,[x-12,y-42,x,y-65,x+12,y-42],'#557c66');}
    }
  }else{
    for(let i=0;i<30;i++){const x=((i*119-t*60)%(w+250)+w+250)%(w+250)-65;
      line(c,x,y-22,x,y,'#785946',5);
      if(biome==='snow'){for(let p=0;p<3;p++)path(c,[x-20+p*4,y-20-p*15,x,y-53-p*18,x+20-p*4,y-20-p*15],p%2?'#527a70':'#62847c');path(c,[x-9,y-54,x,y-73,x+9,y-54],'#ebf1df')}
      else {circle(c,x,y-40,18,'#5d8773');circle(c,x-10,y-33,14,'#6e9880');circle(c,x+10,y-36,14,'#6e987b');}
    }
  }
}
function railbed(c,w,h,t){const y=h*.82;rr(c,0,y,w,h-y,0,'#5c7369');rr(c,0,y+13,w,30,0,'#7b7970');for(let i=0;i<Math.ceil(w/30)+2;i++){const x=(i*32-(t*54)%32);rr(c,x,y+23,18,6,1,'#a18a71')}
  line(c,0,y+27,w,y+27,'#b6b2a0',4);line(c,0,y+44,w,y+44,'#c2bb9f',3);
  rr(c,0,y+55,w,h-y,0,'#4c6660');for(let i=0;i<45;i++){const x=((i*83-t*52)%(w+130)+w+130)%(w+130),yy=y+57+(i*19)%(h-y);line(c,x,yy,x+4,yy-3,'#789482',1)}
}
function wheels(c,x,y,w,time){const spins=time*6.5;for(const wx of [x+39,x+102,x+w-94,x+w-32]){
  circle(c,wx,y+4,15,'#1e3538','#d3a36b',3);circle(c,wx,y+4,8,'#59737a');for(let i=0;i<5;i++){const a=spins+i*TAU/5;line(c,wx+Math.sin(a)*4,y+4+Math.cos(a)*4,wx+Math.sin(a)*11,y+4+Math.cos(a)*11,'#d9bd92',1.6)}circle(c,wx,y+4,3,'#f6dab0');}
  line(c,x+36,y+9,x+w-33,y+9,'#a9a48b',3);
}
function tinyPerson(c,x,y,seed,t,scale=1,uniform=false){c.save();c.translate(x,y+Math.sin(t*2.9+seed*1.7)*1.5);c.scale(scale,scale);
  const shirts=['#7a859a','#b7786c','#779782','#c1a06e','#a186a0'];const shirt=uniform?'#d29e6e':shirts[seed%shirts.length];
  line(c,-3,19,-3,28,'#344651',3);line(c,4,19,4,28,'#344651',3);
  rr(c,-8,2,16,20,4,shirt);line(c,-8,7,-12,17+Math.sin(t*2+seed)*2,'#d5aa81',3);line(c,8,7,12,16-Math.sin(t*2+seed)*2,'#d5aa81',3);
  circle(c,0,-6,10,'#e2b88e');rr(c,-10,-15,20,8,4,seed%3===0?'#423b42':seed%3===1?'#8d5e43':'#665749');
  circle(c,3,-6,1.15,'#4a3735');line(c,3,-1,7,-1,'#ad705d',1);c.restore()}
function plants(c,x,y,kind,t){rr(c,x-9,y,19,7,2,'#b57454');line(c,x,y,x,y-26,'#4e835e',2);for(let i=0;i<4;i++){const yy=y-7-i*5;circle(c,x+Math.sin(t*.7+i)*2+(i%2?-7:7),yy,5+i%2,kind==='garden'?'#72a580':'#90a78b')}}
function room(c,type,x,y,w,h,time,level){const cfg=CARRIAGES[type];rr(c,x,y,w,h,3,'#f2debb');
  const accent=cfg.color;rr(c,x,y,w,12,1,accent);rr(c,x,y+h-19,w,19,1,'#a77858');
  // Wood-panel texture and tiny wallpaper motif.
  for(let j=0;j<8;j++){line(c,x+j*31,y+16,x+j*31,y+h-20,'#c8ad88',.5)}
  for(let j=0;j<20;j++){circle(c,x+9+j*11,y+23+(j%2)*3,.75,'#bda27c')}
  const shelf=(xx,yy,ww=40)=>{rr(c,xx,yy,ww,4,1,'#885942');line(c,xx+2,yy,xx+2,yy+4,'#594331',1)};
  if(type==='sleeper'){
    for(let j=0;j<2;j++){const xx=x+14+j*105;rr(c,xx,y+77,88,23,4,'#966a69');rr(c,xx+5,y+72,78,12,3,'#e5c9ae');rr(c,xx+5,y+67,23,13,5,'#fff2d6');line(c,xx+2,y+99,xx+2,y+111,'#795240',4);line(c,xx+84,y+99,xx+84,y+111,'#795240',4)}
    rr(c,x+w/2-11,y+32,22,42,2,'#b88d6a');circle(c,x+w/2,y+49,9,'#e8d2a8');
  }else if(type==='cafe'){
    rr(c,x+12,y+52,66,51,3,'#84614b');rr(c,x+18,y+58,55,28,2,'#d3aa80');for(let j=0;j<3;j++){circle(c,x+27+j*17,y+72,5,'#e5cf9f')}
    rr(c,x+104,y+82,101,7,2,'#93694a');for(let j=0;j<3;j++){rr(c,x+116+j*29,y+89,11,20,2,'#865c52');circle(c,x+121+j*29,y+80,3,'#f6ead3')}
    shelf(x+94,y+39,110);for(let j=0;j<6;j++)rr(c,x+104+j*15,y+25,8,13,1,'#e0b17c');
  }else if(type==='garden'){
    for(let j=0;j<8;j++)plants(c,x+23+j*27,y+94,'garden',time+j);
    rr(c,x+80,y+39,71,6,3,'#a88e69');for(let j=0;j<3;j++)circle(c,x+94+j*19,y+34,7,'#9cb77f');
    line(c,x+171,y+91,x+171,y+28,'#7d987e',3);circle(c,x+171,y+29,21,'#8db69b');
  }else if(type==='library'){
    for(let j=0;j<2;j++){rr(c,x+12+j*134,y+23,101,76,4,'#7e6157');for(let k=0;k<8;k++){rr(c,x+18+j*134+k*11,y+32,8,29,1,['#597887','#bb8466','#e1c08b'][k%3]);rr(c,x+18+j*134+k*11,y+68,8,25,1,['#b78961','#7f9e85','#a36c79'][k%3]);}}
    rr(c,x+108,y+80,38,5,2,'#bb9367');
  }else if(type==='diner'){
    for(let j=0;j<2;j++){rr(c,x+24+j*119,y+72,80,8,3,'#9c674c');rr(c,x+30+j*119,y+81,8,27,1,'#79594d');rr(c,x+90+j*119,y+81,8,27,1,'#79594d');circle(c,x+64+j*119,y+69,8,'#e5caa7');}
    rr(c,x+94,y+25,51,27,2,'#c39d78');for(let j=0;j<4;j++)circle(c,x+106+j*10,y+38,3,'#d88a66');
  }else if(type==='arcade'){
    for(let j=0;j<5;j++){const xx=x+17+j*44;rr(c,xx,y+37,32,70,3,['#776286','#64848f','#a77569'][j%3]);rr(c,xx+4,y+43,24,26,2,'#343e50');rr(c,xx+7,y+47,18,16,2,['#c3ac90','#9dd0bd','#f5c27c'][j%3]);circle(c,xx+16,y+85,4,'#deb67e')}
  }else if(type==='workshop'){
    rr(c,x+8,y+76,220,15,3,'#a17a5a');for(let j=0;j<7;j++){rr(c,x+14+j*31,y+64,14,15,1,['#a4b6ac','#c09a67','#8f9b9d'][j%3]);circle(c,x+22+j*31,y+60,5,'#d3b076')}
    rr(c,x+56,y+29,113,17,3,'#7c8791');for(let j=0;j<5;j++)line(c,x+66+j*21,y+35,x+66+j*21,y+45,'#ddc79f',2);
  }else if(type==='observatory'){
    rr(c,x+28,y+47,173,48,6,'#516b79');circle(c,x+119,y+68,39,'#35465b','#d9cfa3',3);for(let j=0;j<12;j++){const a=j*2.4;star(c,x+119+Math.sin(a)*30,y+67+Math.cos(a)*25,2,'#e9e3bd')}
    line(c,x+117,y+59,x+148,y+43,'#d6c29f',4);
  }
  // Upgrade level appears as functional, visible detail: more lamps, bunting, and flowerpots.
  for(let j=0;j<Math.min(6,Math.floor(level/2));j++){circle(c,x+22+j*40,y+8,3,'#ffeaab');line(c,x+22+j*40,y+8,x+22+j*40,y+21,'#f1d8aa',1);}
  if(level>=3){plants(c,x+w-19,y+h-23,'garden',time)}
  if(level>=6){for(let j=0;j<4;j++)star(c,x+40+j*52,y+18,2.3,'#fff2cf')}
  rr(c,x,y,w,h,3,'','#b28a69',2);
  // Window frames and warm door at the far end.
  rr(c,x+w-36,y+28,25,54,9,'#acc4c4','#a1846d',3);line(c,x+w-24,y+29,x+w-24,y+78,'#d9c19a',2);
}
function carriage(c,x,ground,car,time,index,selected){const cfg=CARRIAGES[car.type],w=252,h=175;const y=ground-h;
  rr(c,x+1,y-13,w-2,15,7,'#354f56','#c09b68',2);
  // Panel and sides frame the open dollhouse room.
  rr(c,x,y,w,h+9,10,'#3a5960','#e1bd8e',2.5);
  room(c,car.type,x+10,y+13,w-20,126,time,car.level);
  rr(c,x,y,w,11,5,cfg.color);rr(c,x,y+139,w,33,2,'#364e58');
  line(c,x+6,y+156,x+w-6,y+156,'#d4a675',2);
  for(let i=0;i<4;i++)rr(c,x+14+i*61,y+143,44,9,4,'#59757a');
  // Persons walk/idle in cutaway, depending on carriage type; separate silhouettes.
  for(let p=0;p<cfg.people;p++){
    const xx=x+34+p*((w-66)/(Math.max(1,cfg.people-1)))+Math.sin(time*.3+p*13+index)*3;
    tinyPerson(c,xx,y+88,p+index*3,time,.70,car.type==='cafe'&&p===0);
  }
  text(c,cfg.name.toUpperCase(),x+19,y+160,10,'#f0dec1','sans-serif','left','700');
  rr(c,x+w-45,y+148,34,15,6,'#e9ca92');text(c,'LV '+car.level,x+w-28,y+159,9,'#4b4b3f','sans-serif','center','700');
  rr(c,x+5,ground+8,w-10,19,4,'#273d43');wheels(c,x+4,ground+18,w-8,time);
  line(c,x+w,ground+12,x+w+17,ground+12,'#d6b283',6);
  if(selected){rr(c,x-4,y-19,w+8,13,4,'#e9c87f');text(c,'✦ YOUR CARRIAGE',x+w/2,y-10,9,'#36515a','sans-serif','center','700');}
}
function engine(c,x,ground,time,color,selected=false){const y=ground-171;
  rr(c,x+10,y+57,219,107,8,color,'#e3bb83',3);
  rr(c,x+130,y+5,81,113,9,color,'#e9cb98',3);
  rr(c,x+139,y+15,61,57,7,'#8eb4ba','#edce9a',4);
  line(c,x+169,y+17,x+169,y+68,'#e8d0a0',2);
  rr(c,x+9,y+89,130,43,14,'#2b444b');rr(c,x+7,y+127,220,16,4,'#8d5f46');
  rr(c,x+12,y+50,26,40,7,'#334c54','#d6b185',3);
  rr(c,x+2,y+38,45,14,3,'#45595b');rr(c,x+14,y+27,20,12,2,'#d8aa72');
  circle(c,x+60,y+106,32,'#4f6770','#ddbc8a',5);circle(c,x+60,y+106,18,'#a69a7c');
  rr(c,x+91,y+61,52,46,7,'#597984');circle(c,x+117,y+84,17,'#e9c789');
  rr(c,x+152,y+83,44,48,4,'#394c59');tinyPerson(c,x+172,y+93,2,time,.76,true);
  rr(c,x+130,y-1,92,13,3,'#263f49');line(c,x+133,y+119,x+221,y+119,'#e3bd89',4);
  rr(c,x+216,y+123,23,11,3,'#bf8763');rr(c,x+24,ground+1,213,26,5,'#293f46');
  wheels(c,x+23,ground+19,209,time);
  rr(c,x+105,y+141,112,14,2,'#d3a76e');text(c,'E V E R L I N E',x+160,y+151,11,'#34474b','Georgia','center','700');
  circle(c,x+15,y+112,6,'#fae3a0');
  for(let i=0;i<4;i++){const phase=(time*.54+i*.8)%3.7;const alpha=1-phase/3.7;c.save();c.globalAlpha=Math.max(0,alpha*.6);circle(c,x+24+phase*11,y+32-phase*29+Math.sin(time+i)*4,10+phase*7,'#f6ebd8');c.restore()}
  if(selected){rr(c,x+1,y-20,230,13,5,'#e9c87f');text(c,'✦ THE LOCOMOTIVE',x+116,y-10,9,'#36515a','sans-serif','center','700');}
}
export class TrainScene{
  constructor(canvas,onSelect,onSighting){this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.onSelect=onSelect;this.onSighting=onSighting;this.camera=0;this.target=0;this.pointer=null;this.t=0;this.width=0;this.height=0;this.zoom=1;this.state=null;this.activeSighting=null;this.motion=true;this.lastPaint=0;this.selected=-1;
    const down=e=>{this.pointer={x:e.clientX,y:e.clientY,camera:this.target,moved:false};canvas.setPointerCapture?.(e.pointerId)};
    canvas.addEventListener('pointerdown',down);
    canvas.addEventListener('pointermove',e=>{if(!this.pointer)return;const d=(e.clientX-this.pointer.x)/this.zoom;if(Math.abs(d)>7)this.pointer.moved=true;if(this.pointer.moved)this.target=this.pointer.camera-d;});
    canvas.addEventListener('pointerup',e=>{if(!this.pointer)return;const moved=this.pointer.moved;this.pointer=null;if(!moved){const rect=canvas.getBoundingClientRect();const sx=(e.clientX-rect.left)/this.zoom+this.camera;const sy=(e.clientY-rect.top)/this.zoom;
      const y=(this.height/this.zoom)*.82-205;
      if(this.activeSighting&&sx>=this.activeSighting.x-23&&sx<=this.activeSighting.x+38&&sy>=this.activeSighting.y-40&&sy<=this.activeSighting.y+35){this.onSighting();return}
      if(sy>y&&sy<y+205){let idx=Math.floor((sx-100-255)/265);if(sx>=94&&sx<=342)idx=-1;if(idx>=-1&&idx<this.state.cars.length)this.onSelect(idx)}
    }});
    canvas.addEventListener('pointercancel',()=>{this.pointer=null});
    canvas.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>3||e.shiftKey){e.preventDefault();this.target+=e.deltaX||e.deltaY; }},{passive:false});
    this.resize();new ResizeObserver(()=>this.resize()).observe(canvas);
  }
  resize(){const r=this.canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);this.width=Math.max(1,r.width);this.height=Math.max(1,r.height);this.zoom=this.width<580?Math.min(.92,Math.max(.72,this.width/520)):(this.width<850?.9:1.1);
    this.canvas.width=Math.round(this.width*dpr);this.canvas.height=Math.round(this.height*dpr);this.dpr=dpr;}
  focus(index,immediate=false){const carX=index<0?90:355+index*265;const target=carX-(this.width/this.zoom)*.40;this.target=target;if(immediate)this.camera=target}
  bounds(){const w=this.width/this.zoom,total=365+(this.state?.cars.length||2)*265+100;this.target=Math.max(-30,Math.min(Math.max(0,total-w+35),this.target));}
  draw(state,now=performance.now()){this.state=state;if(!this.ctx)return;const w=this.width/this.zoom,h=this.height/this.zoom;
    if(!w||!h)return;this.bounds();if(!this.pointer||!this.pointer.moved)this.camera+=(this.target-this.camera)*(this.motion?.12:1);
    this.t=this.motion?now/1000+95:120;
    const c=this.ctx;c.setTransform(this.dpr*this.zoom,0,0,this.dpr*this.zoom,0,0);
    c.clearRect(0,0,w,h);
    const biome=DESTINATIONS[state.stage]?.biome||'forest';const phase=(this.t%240)/240;const night=phase>.70||phase<.12;
    const sky=c.createLinearGradient(0,0,0,h);if(night){sky.addColorStop(0,'#263c54');sky.addColorStop(.65,'#69808e');sky.addColorStop(1,'#e0ae8a')}else{sky.addColorStop(0,'#94b9c4');sky.addColorStop(.68,'#d6d9b8');sky.addColorStop(1,'#f4ddb0')}c.fillStyle=sky;c.fillRect(0,0,w,h);
    const sunx=w*.77+Math.sin(this.t*.01)*20,suny=h*.20;circle(c,sunx,suny,night?18:35,night?'#efe7cb':'#fff0b3');
    if(night){for(let i=0;i<35;i++){const x=((i*137)%Math.round(w+1)),y=(i*53)%(Math.max(100,h*.50));star(c,x,y,i%4===0?2:1,'#e6e4da')}}
    else for(let i=0;i<5;i++)cloud(c,((i*255-this.t*6)%(w+300)+w+300)%(w+300)-110,h*.12+(i%3)*40,1.1,.30);
    hills(c,w,h,this.t,biome,night);trees(c,w,h,this.t,biome);railbed(c,w,h,this.t);
    // Scenic signage repeats only when near a station.
    if(state.stationProgress>60){const side=Math.max(20,w-143);rr(c,side,h*.45,4,h*.36,2,'#6d6759');rr(c,side-35,h*.45,77,55,4,'#294c55','#ebd4a4',3);text(c,'NEXT',side+3,h*.45+18,11,'#efddb9','sans-serif','center','700');text(c,'STOP',side+3,h*.45+36,13,'#efddb9','Georgia','center','700');}
    c.save();c.translate(-this.camera,0);const ground=h*.82-37;
    engine(c,100,ground,this.t,PAINTS.find(p=>p.id===state.trainPaint)?.color||'#344857',this.selected===-1);
    state.cars.forEach((car,i)=>carriage(c,355+i*265,ground,car,this.t,i,this.selected===i));
    c.restore();
    // Persistent film-grain micro-dots, no external image assets.
    c.save();c.globalAlpha=.035;for(let i=0;i<220;i++){const x=(i*71.9)%w,y=(i*41.7)%h;circle(c,x,y,.6,'#112b34')}c.restore();
    // Special sightseeing event, drawn in the world and independently tappable.
    if(this.activeSighting){const ev=this.activeSighting;c.save();c.translate(-this.camera,0);const pulse=Math.sin(this.t*4)*3;circle(c,ev.x,ev.y,24+pulse,'#fae1a4','#fff2d0',3);text(c,ev.emoji,ev.x,ev.y+9,29,'#5c655d','Georgia','center');star(c,ev.x+28,ev.y-17,6,'#f7e7ac');c.restore();}
    const rate=satisfaction(state);if(rate>90){c.globalAlpha=.3;rr(c,7,h*.82-11,100,3,2,'#edc887');c.globalAlpha=1;}
  }
}
