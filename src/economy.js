import { CARRIAGES,DESTINATIONS,ACHIEVEMENTS,PAINTS,TYPE_ORDER,MAX_OFFLINE_SECONDS,MAX_CARRIAGES } from './data.js';
const clamp = (n, min, max)=>Math.min(max,Math.max(min,n));
const integer = (n,min=0,max=1e12)=>Number.isFinite(n)?Math.trunc(clamp(n,min,max)):min;
const money = (n)=>Number.isFinite(n)?Math.round(clamp(n,0,1e12)*100)/100:0;
export const initialState = (now=Date.now())=>({
  version:3,seed:38619,coins:160,pending:42,stamps:0,lifetime:0,stage:0,stops:0,lastTime:now,
  stationProgress:0,eventProgress:0,events:0,trainPaint:'midnight',ownedPaints:['midnight'],
  stationBoost:0,collectBoost:0,comfort:0,selected:0,
  cars:[{id:1,type:'sleeper',level:1},{id:2,type:'cafe',level:1}],
  seen:['willow'],postcards:[],sightings:[],achievements:[],log:[],tutorial:0,
  lastOffline:0
});
export function randomStep(seed){const next=(Math.imul(seed,1664525)+1013904223)>>>0;return [next,next/4294967296]}
export const carCost=(state,type)=> Math.round(CARRIAGES[type].cost*Math.pow(1.24,Math.max(0,state.cars.length-2)));
export const upgradeCost=(car)=>Math.round((55+CARRIAGES[car.type].cost*.20)*Math.pow(1.67,car.level-1));
export function capacity(state){return state.cars.reduce((s,c)=>s+CARRIAGES[c.type].people+(c.level>=4?1:0),0)}
export function satisfaction(state){const types=new Set(state.cars.map(c=>c.type));return Math.min(100,65+state.comfort*5+types.size*3+Math.floor(state.cars.reduce((a,b)=>a+b.level,0)/6));}
export function hourlyRate(state){return Math.round(incomeRate(state)*3600)}
export function incomeRate(state){return state.cars.reduce((sum,car,index)=>{
  const val=CARRIAGES[car.type].rate*Math.pow(1.42,car.level-1);
  // Complementary neighbor pairings provide a small, optional reward for rearrangement.
  const neighbors=[state.cars[index-1]?.type,state.cars[index+1]?.type];
  const synergy=(car.type==='cafe'&&neighbors.includes('library'))||(car.type==='garden'&&neighbors.includes('sleeper'))||(car.type==='diner'&&neighbors.includes('observatory'));
  return sum+val*(synergy?1.12:1);
},0)*(1+state.comfort*.06)}
export function canBuild(state,type){return Object.hasOwn(CARRIAGES,type) && state.cars.length<MAX_CARRIAGES && state.stops>=CARRIAGES[type].unlock && state.coins>=carCost(state,type)}
export function buildCar(state,type){if(!canBuild(state,type))return {ok:false,reason:'Not yet affordable or unlocked.'};
  const price=carCost(state,type);state.coins=money(state.coins-price);state.cars.push({id:Math.max(...state.cars.map(c=>c.id))+1,type,level:1});
  state.selected=state.cars.length-1;record(state,'A new '+CARRIAGES[type].name+' joined the Everline.');checkAchievements(state);return {ok:true,cost:price};}
export function upgradeCar(state,id){const c=state.cars.find(c=>c.id===id);if(!c||c.level>=12)return {ok:false,reason:'This carriage is fully upgraded.'};
  const cost=upgradeCost(c);if(state.coins+1e-7<cost)return {ok:false,reason:'Not enough coins.'};state.coins=money(state.coins-cost);c.level++;record(state,CARRIAGES[c.type].name+' is now level '+c.level+'.');checkAchievements(state);return {ok:true,cost};}
export function moveCar(state,id,direction){const a=state.cars.findIndex(c=>c.id===id),b=a+direction;if(a<0||b<0||b>=state.cars.length)return false;
  [state.cars[a],state.cars[b]]=[state.cars[b],state.cars[a]];state.selected=b;return true;}
export function collect(state){if(state.pending<.01)return 0;const amount=money(state.pending);state.coins=money(state.coins+amount);state.lifetime=money(state.lifetime+amount);state.pending=0;checkAchievements(state);return amount;}
export function tick(state,seconds,{offline=false}={}){if(!Number.isFinite(seconds)||seconds<=0)return {earned:0,arrivals:[],sighting:null};
  const elapsed=clamp(seconds,0,offline?MAX_OFFLINE_SECONDS:MAX_OFFLINE_SECONDS), earned=money(incomeRate(state)*elapsed);
  state.pending=money(state.pending+earned);const arrivals=[];let sighting=null;
  if(!offline){
    state.stationProgress+=elapsed;state.eventProgress+=elapsed;
    const duration=Math.max(38,85-state.stationBoost*8);
    let iterations=0;
    while(state.stationProgress>=duration && iterations++<100){state.stationProgress-=duration;arrivals.push(arrive(state));}
    if(state.eventProgress>=170){state.eventProgress%=170;const [seed,rand]=randomStep(state.seed);state.seed=seed;state.events++;sighting={...SIGHTING_BY_INDEX(Math.floor(rand*5)),created:Date.now()};}
  }
  return {earned,arrivals,sighting};}
import {SIGHTINGS} from './data.js';
function SIGHTING_BY_INDEX(i){return SIGHTINGS[i]||SIGHTINGS[0]}
export function arrive(state){state.stops++;state.stage=state.stops%DESTINATIONS.length;
  const destination=DESTINATIONS[state.stage];
  const fare=Math.round((27+state.cars.length*15+Math.floor(capacity(state)*1.1))*(1+state.stationBoost*.2));
  state.coins=money(state.coins+fare);state.lifetime=money(state.lifetime+fare);
  const isNew=!state.seen.includes(destination.id);if(isNew)state.seen.push(destination.id);
  if(!state.postcards.includes(destination.id)){state.postcards.push(destination.id);state.stamps+=1;}
  record(state,`Arrived in ${destination.name} · +${fare} fares${isNew?' · new postcard!':''}`);
  checkAchievements(state);
  return {destination,fare,isNew};}
export function claimSighting(state,id){if(!SIGHTINGS.some(x=>x.id===id)||state.sightings.includes(id))return false;
  state.sightings.push(id);
  state.stamps+=1;state.coins=money(state.coins+35);state.lifetime=money(state.lifetime+35);
  record(state,'A little wonder! +1 Stamp · +35 coins');checkAchievements(state);return true;}
export function buyTrainUpgrade(state,type){if(type==='station'){
 const cost=Math.round(440*Math.pow(2,state.stationBoost));if(state.stationBoost>=4||state.coins<cost)return false;
 state.coins=money(state.coins-cost);state.stationBoost++;record(state,'Faster journeys unlocked.');return true;
 }if(type==='comfort'){
 const cost=Math.round(300*Math.pow(2,state.comfort));if(state.comfort>=5||state.coins<cost)return false;
 state.coins=money(state.coins-cost);state.comfort++;record(state,'Comfier journeys, happier passengers.');return true;
 }return false;}
export const trainUpgradeCost=(state,type)=>type==='station'?Math.round(440*Math.pow(2,state.stationBoost)):Math.round(300*Math.pow(2,state.comfort));
export function buyPaint(state,id){const p=PAINTS.find(x=>x.id===id);if(!p)return false;
 if(state.ownedPaints.includes(id)){state.trainPaint=id;return true;}
 if(state.coins<p.cost||state.stamps<p.stampCost)return false;
 state.coins=money(state.coins-p.cost);state.stamps-=p.stampCost;state.ownedPaints.push(id);state.trainPaint=id;record(state,p.name+' locomotive livery applied.');return true;}
export function checkAchievements(state){for(const a of ACHIEVEMENTS){if(state.achievements.includes(a.id))continue;
 const yes= a.id==='hello'?state.lifetime>0:a.id==='upgrade'?state.cars.some(c=>c.level>1):a.id==='newcar'?state.cars.length>=4:a.id==='fivecars'?state.cars.length>=5:a.id==='station'?state.stops>=1:a.id==='traveler'?capacity(state)>=20:a.id==='threecards'?state.postcards.length>=3:a.id==='sighting'?state.sightings.length>=1:a.id==='grand'?state.lifetime>=1e4:false;
 if(yes){state.achievements.push(a.id);state.stamps+=a.reward;record(state,'Achievement: '+a.title+' · +'+a.reward+' stamps');}
 }}
export function record(state,msg){state.log.unshift({text:String(msg).slice(0,160),stop:state.stops});state.log=state.log.slice(0,25)}
export function formatCoins(n){if(n>=1e9)return (n/1e9).toFixed(2)+'b';if(n>=1e6)return(n/1e6).toFixed(2)+'m';if(n>=1e4)return (n/1e3).toFixed(1)+'k';return Math.floor(n).toLocaleString('en-US')}
export function offlineCredit(state,now=Date.now()){const diff=Math.max(0,(now-state.lastTime)/1000);const credited=Math.min(MAX_OFFLINE_SECONDS,diff);const result=tick(state,credited,{offline:true});state.lastTime=now;state.lastOffline=credited>3?money(result.earned):0;return state.lastOffline;}
export function validateState(raw,now=Date.now()){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.version!==3)throw new Error('Unsupported save version');
 const s=initialState(now);
 const types=TYPE_ORDER, cars=Array.isArray(raw.cars)?raw.cars:[];
 if(cars.length<2||cars.length>MAX_CARRIAGES)throw new Error('Invalid number of carriages');
 const ids=new Set();s.cars=cars.map(c=>{if(!c||typeof c!=='object'||!types.includes(c.type))throw new Error('Unknown carriage');
 const id=integer(c.id,1,1e9),level=integer(c.level,1,12);if(ids.has(id))throw new Error('Duplicate carriage ID');ids.add(id);return {id,type:c.type,level};});
 const bounded=(key,max=1e12)=>{if(typeof raw[key]!=='number'||!Number.isFinite(raw[key])||raw[key]<0||raw[key]>max)throw new Error('Invalid '+key);return raw[key];};
 for(const k of ['coins','pending','lifetime'])s[k]=money(bounded(k));
 for(const k of ['stamps','stops','stationBoost','comfort','seed','events'])s[k]=integer(bounded(k,k==='seed'?4294967295:1e7),0,k==='stationBoost'?4:k==='comfort'?5:1e7);
 s.seed=(s.seed>>>0)||38619;s.stops=integer(s.stops,0,1e7);s.stage=s.stops%DESTINATIONS.length;
 for(const k of ['stationProgress','eventProgress'])s[k]=clamp(bounded(k,1e9),0,k==='stationProgress'?85:170);
 s.lastTime=typeof raw.lastTime==='number'&&Number.isFinite(raw.lastTime)?clamp(raw.lastTime,0,now+1e4):now;
 s.selected=integer(raw.selected,0,s.cars.length-1);s.tutorial=integer(raw.tutorial,0,3);
 const allowed=(items,valid,max)=>Array.isArray(items)?[...new Set(items.filter(v=>typeof v==='string'&&valid.includes(v)))].slice(0,max):[];
 s.seen=allowed(raw.seen,DESTINATIONS.map(d=>d.id),DESTINATIONS.length);if(!s.seen.length)s.seen=['willow'];
 s.postcards=allowed(raw.postcards,DESTINATIONS.map(d=>d.id),DESTINATIONS.length);
 s.sightings=allowed(raw.sightings,SIGHTINGS.map(v=>v.id),SIGHTINGS.length);
 s.achievements=allowed(raw.achievements,ACHIEVEMENTS.map(v=>v.id),ACHIEVEMENTS.length);
 s.ownedPaints=allowed(raw.ownedPaints,PAINTS.map(p=>p.id),PAINTS.length);if(!s.ownedPaints.includes('midnight'))s.ownedPaints.unshift('midnight');
 s.trainPaint=s.ownedPaints.includes(raw.trainPaint)?raw.trainPaint:'midnight';
 s.log=Array.isArray(raw.log)?raw.log.slice(0,25).filter(x=>x&&typeof x.text==='string').map(x=>({text:x.text.slice(0,160),stop:integer(x.stop,0,1e7)})):[];
 return s;
}
