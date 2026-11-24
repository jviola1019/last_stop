import {CARRIAGES,DESTINATIONS,REGIONS,RESIDENTS,STAMP_PROJECTS,ACHIEVEMENTS,PAINTS,DECOR,SIGHTINGS,TYPE_ORDER,MAX_OFFLINE_SECONDS,MAX_CARRIAGES,MAX_ROOM_LEVEL,ROOM_GRADES,SERVICE_MILESTONES} from './data.js';
const clamp=(n,lo,hi)=>Math.min(hi,Math.max(lo,n));
const integer=(n,min=0,max=1e12)=>Number.isFinite(n)?Math.trunc(clamp(n,min,max)):min;
const money=n=>Number.isFinite(n)?Math.round(clamp(n,0,1e12)*100)/100:0;
export const initialState=(now=Date.now())=>({
 version:6,trainName:'The Everline',seed:38619,eventSeed:872129,coins:160,pending:42,stamps:0,lifetime:0,stage:0,stops:0,totalStops:0,lastTime:now,
 stationProgress:20,eventProgress:0,incomeRemainder:0,autoTour:true,regionRunStops:0,lastStationRegion:'heartland',serviceSeconds:0,serviceClaims:[],lastStation:'willow',lastBoarding:0,lastAlighting:0,events:0,trainPaint:'midnight',ownedPaints:['midnight'],decor:[],
 stationBoost:0,collectBoost:0,comfort:0,selected:0,regionsUnlocked:['heartland'],activeRegion:'heartland',
 stampProjects:[],legacyCount:0,hires:0,seasonBest:2,
 cars:[{id:1,type:'sleeper',level:1,staff:0,crew:[],pendingCrew:[],riders:2},{id:2,type:'cafe',level:1,staff:0,crew:[],pendingCrew:[],riders:3}],
 seen:['willow'],postcards:[],sightings:[],achievements:[],log:[],tutorial:0,lastOffline:0
});
export function normalizeTrainName(value){
 if(typeof value!=='string')return 'The Everline';
 const name=Array.from(value.normalize('NFC').replace(/\s+/g,' ').replace(/[\p{Cc}\p{Cf}<>]/gu,'').trim()).slice(0,32).join('');return name||'The Everline';
}
export function renameTrain(s,value){s.trainName=normalizeTrainName(value);return s.trainName;}
export function randomStep(seed){const next=(Math.imul(seed,1664525)+1013904223)>>>0;return [next,next/4294967296]}
export const carCost=(s,type)=>Object.hasOwn(CARRIAGES,type)?Math.round(CARRIAGES[type].cost*Math.pow(1.95,Math.max(0,s.cars.length-2))):Infinity;
// First four levels remain inviting; costly masterwork rooms form an optional multi-year goal.
export const upgradeCost=car=>car.level>=MAX_ROOM_LEVEL?Infinity:Math.round((55+CARRIAGES[car.type].cost*.2)*Math.pow(2.4,Math.min(4,car.level-1))*Math.pow(3.0,Math.max(0,car.level-5)));
export function roomGrade(level){return ROOM_GRADES.reduce((acc,g)=>level>=g.level?g:acc,ROOM_GRADES[0])}
export function nextRoomGrade(level){return ROOM_GRADES.find(g=>g.level>level)||null}
export function ridersCount(s){return s.cars.reduce((n,c)=>n+(c.riders??Math.max(1,CARRIAGES[c.type].people-1)),0)}
export function journeyDuration(s){const rank=Math.max(0,REGIONS.findIndex(r=>r.id===s.activeRegion));return Math.max(68,100+rank*36-s.stationBoost*9)}
// Derived motion matches the deterministic station clock; rendering cannot cause arrivals.
export function journeyMotion(s){const progress=Math.max(0,Math.min(journeyDuration(s),s.stationProgress)),duration=journeyDuration(s);
 const smooth=t=>{const x=clamp(t,0,1);return x*x*(3-2*x)};
 if(progress<7)return {speed:0,phase:'platform',seconds:Math.max(0,7-progress)};
 if(progress<19)return {speed:smooth((progress-7)/12),phase:'departing',seconds:Math.max(0,19-progress)};
 if(progress>duration-16)return {speed:1-smooth((progress-(duration-16))/16),phase:'approaching',seconds:Math.max(0,duration-progress)};
 return {speed:1,phase:'enroute',seconds:Math.max(0,duration-progress-16)};
}
export const hireCost=car=>Math.round((110+CARRIAGES[car.type].cost*.26)*Math.pow(1.85,car.staff));
export function nextResident(s){const [next,value]=randomStep((s.seed^Math.imul(s.hires+1,7919))>>>0);return RESIDENTS[(next+Math.floor(value*13))%RESIDENTS.length]}
export function capacity(s){return s.cars.reduce((n,c)=>n+CARRIAGES[c.type].people+(c.level>=4?1:0)+c.staff,0)}
export function satisfaction(s){const types=new Set(s.cars.map(c=>c.type));const dream=s.cars.reduce((n,c)=>n+(c.crew||[]).filter(p=>p.dream===c.type).length,0);return clamp(65+s.comfort*5+types.size*3+Math.floor(s.cars.reduce((n,c)=>n+c.level,0)/6)+dream*2,0,100)}
export function carIncomeRate(s,index){const c=s.cars[index];if(!c)return 0;
 const neighbors=[s.cars[index-1]?.type,s.cars[index+1]?.type];const synergy=(c.type==='cafe'&&neighbors.includes('library'))||(c.type==='garden'&&neighbors.includes('sleeper'))||(c.type==='diner'&&neighbors.includes('observatory'))||(c.type==='postal'&&neighbors.includes('library'))||(c.type==='bakery'&&neighbors.includes('cafe'))||(c.type==='cinema'&&neighbors.includes('lounge'))||(c.type==='lounge'&&neighbors.includes('observatory'));
 const dream=(c.crew||[]).filter(p=>p.dream===c.type).length;
 const staffFactor=(1+c.staff*.18+dream*.10+(s.stampProjects.includes('concierge')?c.staff*.05:0));
 const happiness=(0.82+satisfaction(s)*0.002)*(0.82+0.18*Math.min(1,ridersCount(s)/Math.max(1,s.cars.reduce((n,c)=>n+CARRIAGES[c.type].people,0))));
 const legacy=(1+s.legacyCount*.16)*(1+(s.stampProjects.includes('postcards')?s.regionsUnlocked.length*.02:0));
 return CARRIAGES[c.type].rate*Math.pow(1.27,c.level-1)*(synergy?1.12:1)*staffFactor*(1+s.comfort*.06)*happiness*legacy;
}
export function incomeRate(s){return s.cars.reduce((sum,_c,i)=>sum+carIncomeRate(s,i),0)}
export const hourlyRate=s=>Math.round(incomeRate(s)*3600);
export function carriageUnlockGate(s,type){const c=Object.hasOwn(CARRIAGES,type)?CARRIAGES[type]:null;if(!c)return {ok:false,reason:'Unknown carriage'};if(s.stops<c.unlock)return {ok:false,reason:`Reach ${c.unlock} stops (${s.stops}/${c.unlock})`};if(s.cars.length<c.minCars)return {ok:false,reason:`Own ${c.minCars} carriages first`};return {ok:true,reason:''}}
export function carriageGate(s,type){const gate=carriageUnlockGate(s,type);if(!gate.ok)return gate;if(s.cars.length>=MAX_CARRIAGES)return {ok:false,reason:'Train is at its 25-carriage limit · refit an existing room'};return gate;}
// A refit is not a new slot. Charge a workshop fee plus the positive difference in invested room costs.
// This avoids acquiring high levels cheaply in a sleeper then changing to a premium type for free.
export function refitCost(s,car,type){if(!car||!Object.hasOwn(CARRIAGES,type)||car.type===type)return Infinity;let differential=0;for(let level=1;level<car.level;level++)differential+=Math.max(0,upgradeCost({type,level})-upgradeCost({type:car.type,level}));const baseDiff=Math.max(0,CARRIAGES[type].cost-CARRIAGES[car.type].cost);return Math.round(CARRIAGES[type].cost*.75+baseDiff+differential)}
export function refitGate(s,id,type){const car=s.cars.find(c=>c.id===id),gate=carriageUnlockGate(s,type);if(!gate.ok)return gate;if(!car)return {ok:false,reason:'Choose a carriage to refit'};if(car.type===type)return {ok:false,reason:'Already this carriage type'};if(car.pendingRefit)return {ok:false,reason:'Refit scheduled at the next stop'};const cost=refitCost(s,car,type);return s.coins<cost?{ok:false,reason:'Not enough coins',cost}:{ok:true,reason:'',cost}}
export function queueRefit(s,id,type){const gate=refitGate(s,id,type);if(!gate.ok)return gate;const car=s.cars.find(c=>c.id===id);s.coins=money(s.coins-gate.cost);car.pendingRefit=type;record(s,`${CARRIAGES[car.type].name} will be refitted as ${CARRIAGES[type].name} at the next stop.`);return gate;}

export function canBuild(s,type){return carriageGate(s,type).ok&&s.coins>=carCost(s,type)}
export function buildCar(s,type){const gate=carriageGate(s,type);if(!gate.ok)return {ok:false,reason:gate.reason};const price=carCost(s,type);if(s.coins<price)return {ok:false,reason:'Not enough coins'};s.coins=money(s.coins-price);s.cars.push({id:Math.max(...s.cars.map(c=>c.id))+1,type,level:1,staff:0,crew:[],pendingCrew:[],riders:0});s.selected=s.cars.length-1;s.seasonBest=Math.max(s.seasonBest,s.cars.length);record(s,'A new '+CARRIAGES[type].name+' joined the Everline.');checkAchievements(s);return {ok:true,cost:price}}
export function upgradeCar(s,id){const c=s.cars.find(c=>c.id===id);if(!c||c.level>=MAX_ROOM_LEVEL)return {ok:false,reason:'This carriage is fully upgraded.'};if(c.pendingRefit)return {ok:false,reason:'Room refit is pending at the next stop.'};const price=upgradeCost(c);if(s.coins<price)return {ok:false,reason:'Not enough coins.'};s.coins=money(s.coins-price);c.level++;record(s,CARRIAGES[c.type].name+' is now level '+c.level+'.');checkAchievements(s);return {ok:true,cost:price}}
export function hireResident(s,id){const c=s.cars.find(c=>c.id===id);if(!c||c.staff+(c.pendingCrew||[]).length>=2)return false;const cost=hireCost({...c,staff:c.staff+(c.pendingCrew||[]).length});if(s.coins<cost)return false;const p=nextResident(s);s.coins=money(s.coins-cost);c.pendingCrew=(c.pendingCrew||[]).concat([{id:s.hires+1,name:p.name,dream:p.dream,craft:p.craft}]);s.hires++;record(s,`${p.name} booked a place in ${CARRIAGES[c.type].name}; boards at the next stop.`);checkAchievements(s);return true}
export function buyDecor(s,id){const d=DECOR.find(x=>x.id===id);if(!d||s.decor.includes(id)||s.coins<d.cost)return false;s.coins=money(s.coins-d.cost);s.decor.push(id);record(s,'Decorated the train with '+d.name+'.');return true}
export function moveCar(s,id,d){if(d!==-1&&d!==1)return false;const a=s.cars.findIndex(c=>c.id===id),b=a+d;if(a<0||b<0||b>=s.cars.length)return false;[s.cars[a],s.cars[b]]=[s.cars[b],s.cars[a]];s.selected=b;return true}
export function collect(s){if(s.pending<.01)return 0;const amount=money(s.pending);s.coins=money(s.coins+amount);s.lifetime=money(s.lifetime+amount);s.pending=0;checkAchievements(s);return amount}
export function routeStops(s){return DESTINATIONS.filter(d=>d.region===s.activeRegion)}
export function nextDestination(s){const options=routeStops(s);return options[(s.stops+1)%options.length]||DESTINATIONS[0]}
export function regionGate(s,id){const r=REGIONS.find(x=>x.id===id);if(!r)return {ok:false,reason:'Unknown region'};if(s.regionsUnlocked.includes(id))return {ok:true,reason:'Already unlocked'};if(s.totalStops<r.stops)return {ok:false,reason:`Reach ${r.stops} lifetime stops (${s.totalStops}/${r.stops})`};if(s.cars.length<r.cars)return {ok:false,reason:`Build ${r.cars} carriages (${s.cars.length}/${r.cars})`};if(s.stamps<r.stamps)return {ok:false,reason:`Collect ${r.stamps} Stamps (${s.stamps}/${r.stamps})`};return {ok:true,reason:''}}
export function unlockRegion(s,id){const r=REGIONS.find(x=>x.id===id);if(!r||s.regionsUnlocked.includes(id)||!regionGate(s,id).ok)return false;s.stamps-=r.stamps;s.regionsUnlocked.push(id);s.activeRegion=id;s.regionRunStops=0;s.stage=0;record(s,`New route open: ${r.name} · ${r.stamps} stamps`);checkAchievements(s);return true}
export function travelRegion(s,id){if(!s.regionsUnlocked.includes(id)||!REGIONS.some(r=>r.id===id))return false;s.activeRegion=id;s.regionRunStops=0;s.autoTour=false;s.stage=0;return true}
export function setAutoTour(s,enabled){if(typeof enabled!=='boolean')return false;s.autoTour=enabled;s.regionRunStops=0;record(s,enabled?'Scenic roaming enabled — change regions every six stops.':'Staying on the selected railway route.');return true}
export function buyStampProject(s,id){const p=STAMP_PROJECTS.find(x=>x.id===id);if(!p||s.stampProjects.includes(id)||s.stamps<p.cost)return false;s.stamps-=p.cost;s.stampProjects.push(id);record(s,`Stamp project complete: ${p.name}`);return true}
export function checkService(s){for(const m of SERVICE_MILESTONES){if(s.serviceSeconds+1e-7>=m.hours*3600&&!s.serviceClaims.includes(m.id)){
  s.serviceClaims.push(m.id);s.stamps+=m.stamps;record(s,`Service medal: ${m.name} · +${m.stamps} stamps`);
 }}}
function earnFor(s,seconds){if(seconds<=0)return 0;const exactCents=incomeRate(s)*seconds*100+s.incomeRemainder;
 const earnedCents=Math.floor(exactCents+1e-7),earned=earnedCents/100;
 s.incomeRemainder=clamp(exactCents-earnedCents,0,0.99999999);s.pending=money(s.pending+earned);
 s.serviceSeconds=Math.min(1e11,s.serviceSeconds+seconds);checkService(s);return earned;
}
export function tick(s,seconds,{offline=false}={}){
 if(!Number.isFinite(seconds)||seconds<=0)return {earned:0,arrivals:[],sighting:null};
 const elapsed=clamp(seconds,0,MAX_OFFLINE_SECONDS),arrivals=[];let earned=0,sighting=null;
 if(offline){earned=earnFor(s,elapsed);return {earned,arrivals,sighting}}
 let left=elapsed,iterations=0;
 // Calculate each segment with the occupancy and hired staff valid *before* that station.
 while(left>1e-8&&iterations++<1000){const duration=journeyDuration(s);
  const until=Math.max(0,duration-s.stationProgress);if(until<=1e-8){s.stationProgress=0;arrivals.push(arrive(s));continue;}const step=Math.min(left,until);
  earned+=earnFor(s,step);s.stationProgress+=step;s.eventProgress+=step;left-=step;
  if(s.stationProgress+1e-7>=duration){s.stationProgress=Math.max(0,s.stationProgress-duration);arrivals.push(arrive(s));}
  else if(step<=0)break;
 }
 if(s.eventProgress>=170){const count=Math.floor(s.eventProgress/170);s.eventProgress%=170;
  for(let i=0;i<count;i++){const [seed,rand]=randomStep(s.eventSeed);s.eventSeed=seed;s.events++;sighting={...SIGHTINGS[Math.floor(rand*SIGHTINGS.length)],created:Date.now()}}}
 return {earned:money(earned),arrivals,sighting};
}
export function arrive(s){const d=nextDestination(s);s.stops++;s.totalStops++;s.stage=s.stops%Math.max(1,routeStops(s).length);s.lastStationRegion=s.activeRegion;s.regionRunStops=Math.min(6,s.regionRunStops+1);
 let boarding=0,alighting=0,crewJoined=0;
 for(const car of s.cars){if(car.pendingRefit){const target=car.pendingRefit;car.type=target;delete car.pendingRefit;record(s,`${CARRIAGES[target].name} refit complete · level ${car.level} and crew preserved.`);}const seats=CARRIAGES[car.type].people+(car.level>=4?1:0);
  const before=car.riders??Math.max(1,seats-1);
  const [seed,rand]=randomStep((s.seed+car.id*887+s.totalStops*31)>>>0);s.seed=seed;
  const target=Math.min(seats,Math.max(0,Math.floor(rand*(seats+1))));
  // At least one passenger can board/alight per arrival, but individual rooms remain deterministic.
  car.riders=target;boarding+=Math.max(0,target-before);alighting+=Math.max(0,before-target);
  if((car.pendingCrew||[]).length){const n=car.pendingCrew.length;car.crew=[...(car.crew||[]),...car.pendingCrew];car.staff+=n;crewJoined+=n;car.pendingCrew=[];}
 }
 s.lastStation=d.id;s.lastBoarding=boarding;s.lastAlighting=alighting;
 const fare=Math.round((27+s.cars.length*12+boarding*18+Math.floor(capacity(s)*.7))*(1+s.stationBoost*.2)*(0.85+satisfaction(s)*.002)*(s.stampProjects.includes('souvenirs')?1.2:1));
 s.coins=money(s.coins+fare);s.lifetime=money(s.lifetime+fare);
 const isNew=!s.seen.includes(d.id);if(isNew)s.seen.push(d.id);
 if(!s.postcards.includes(d.id)){s.postcards.push(d.id);s.stamps++}
 if(s.totalStops%18===0){s.stamps++;record(s,'Milestone: 18 more stations · +1 Stamp')}
 record(s,`Arrived in ${d.name} · ${boarding} boarding · ${alighting} departing${crewJoined?' · '+crewJoined+' crew joined':''} · +${fare} fares`);
 checkAchievements(s);
 if(s.autoTour&&s.regionRunStops>=6&&s.regionsUnlocked.length>1){const at=s.regionsUnlocked.indexOf(s.activeRegion);s.activeRegion=s.regionsUnlocked[(at+1)%s.regionsUnlocked.length];s.regionRunStops=0;record(s,'Changing scenery · '+REGIONS.find(r=>r.id===s.activeRegion).name)}
 return {destination:d,fare,isNew,boarding,alighting,crewJoined};
}
export function claimSighting(s,id){if(!SIGHTINGS.some(x=>x.id===id)||s.sightings.includes(id))return false;s.sightings.push(id);s.stamps++;s.coins=money(s.coins+35);s.lifetime=money(s.lifetime+35);record(s,'A little wonder! +1 Stamp · +35 coins');checkAchievements(s);return true}
export function buyTrainUpgrade(s,type){if(type==='station'){const price=Math.round(440*Math.pow(2,s.stationBoost));if(s.stationBoost>=4||s.coins<price)return false;s.coins=money(s.coins-price);s.stationBoost++;record(s,'Faster journeys unlocked.');return true}if(type==='comfort'){const price=Math.round(300*Math.pow(2,s.comfort));if(s.comfort>=5||s.coins<price)return false;s.coins=money(s.coins-price);s.comfort++;record(s,'Comfier journeys, happier passengers.');return true}return false}
export const trainUpgradeCost=(s,type)=>type==='station'?Math.round(440*Math.pow(2,s.stationBoost)):Math.round(300*Math.pow(2,s.comfort));
export function buyPaint(s,id){const p=PAINTS.find(x=>x.id===id);if(!p)return false;if(s.ownedPaints.includes(id)){s.trainPaint=id;return true}if(s.coins<p.cost||s.stamps<p.stampCost)return false;s.coins=money(s.coins-p.cost);s.stamps-=p.stampCost;s.ownedPaints.push(id);s.trainPaint=id;record(s,p.name+' locomotive livery applied.');return true}
export function canStartSeason(s){return s.cars.length>=20&&s.regionsUnlocked.length>=3&&s.legacyCount<10}
export function startSeason(s){if(!canStartSeason(s))return false;const next=initialState(s.lastTime);const keep=['trainName','seed','eventSeed','stamps','lifetime','totalStops','seen','postcards','sightings','achievements','ownedPaints','trainPaint','decor','regionsUnlocked','stampProjects','events','hires','seasonBest','autoTour','serviceSeconds','serviceClaims','lastStation','lastBoarding','lastAlighting'];for(const k of keep)next[k]=structuredClone(s[k]);next.legacyCount=s.legacyCount+1;next.activeRegion=s.activeRegion;next.tutorial=3;next.log=[...s.log].slice(0,12);Object.assign(s,next);record(s,`Season ${s.legacyCount+1} begins · permanent +${s.legacyCount*16}% earning bonus`);checkAchievements(s);return true}
export function checkAchievements(s){for(const a of ACHIEVEMENTS){if(s.achievements.includes(a.id))continue;const yes=a.id==='hello'?s.lifetime>0:a.id==='upgrade'?s.cars.some(c=>c.level>1):a.id==='newcar'?s.cars.length>=4:a.id==='fivecars'?s.cars.length>=5:a.id==='station'?s.totalStops>=1:a.id==='traveler'?capacity(s)>=20:a.id==='threecards'?s.postcards.length>=3:a.id==='sighting'?s.sightings.length>=1:a.id==='grand'?s.lifetime>=1e4:a.id==='routes'?s.regionsUnlocked.length>=3:a.id==='magnate'?s.cars.length>=20:a.id==='season'?s.legacyCount>=1:false;if(yes){s.achievements.push(a.id);s.stamps+=a.reward;record(s,'Achievement: '+a.title+' · +'+a.reward+' stamps')}}}
export function record(s,msg){s.log.unshift({text:String(msg).slice(0,160),stop:s.totalStops});s.log=s.log.slice(0,25)}
export function formatCoins(n){if(n>=1e9)return(n/1e9).toFixed(2)+'b';if(n>=1e6)return(n/1e6).toFixed(2)+'m';if(n>=1e4)return(n/1e3).toFixed(1)+'k';return Math.floor(n).toLocaleString('en-US')}
export function offlineCredit(s,now=Date.now()){const seconds=Math.max(0,(now-s.lastTime)/1000);const earned=tick(s,Math.min(MAX_OFFLINE_SECONDS,seconds),{offline:true}).earned;s.lastTime=now;s.lastOffline=seconds>3?money(earned):0;return s.lastOffline}
export function validateState(raw,now=Date.now()){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||![3,4,5,6].includes(raw.version))throw new Error('Unsupported save version');const s=initialState(now),legacy=raw.version===3;s.trainName=normalizeTrainName(raw.trainName);
 const allowed=(items,valid,max)=>Array.isArray(items)?[...new Set(items.filter(v=>typeof v==='string'&&valid.includes(v)))].slice(0,max):[];
 const bounded=(key,max=1e12,defaultValue=0)=>{const v=raw[key];if(v===undefined&&(legacy||raw.version===4))return defaultValue;if(typeof v!=='number'||!Number.isFinite(v)||v<0||v>max)throw new Error('Invalid '+key);return v};
 const cars=Array.isArray(raw.cars)?raw.cars:[];if(cars.length<2||cars.length>MAX_CARRIAGES)throw new Error('Invalid number of carriages');const ids=new Set();s.cars=cars.map(c=>{if(!c||typeof c!=='object'||!TYPE_ORDER.includes(c.type))throw new Error('Unknown carriage');const id=integer(c.id,1,1e9),level=integer(c.level,1,MAX_ROOM_LEVEL),staff=integer(c.staff,0,2);if(ids.has(id)||!Number.isInteger(c.id)||c.id<1)throw new Error('Duplicate or invalid carriage ID');ids.add(id);const crew=Array.isArray(c.crew)?c.crew.slice(0,staff).filter(p=>p&&typeof p.name==='string'&&TYPE_ORDER.includes(p.dream)).map(p=>({id:integer(p.id,0,1e8),name:p.name.slice(0,30),dream:p.dream,craft:String(p.craft||'Crew').slice(0,30)})):[];const pendingCrew=Array.isArray(c.pendingCrew)?c.pendingCrew.slice(0,Math.max(0,2-staff)).filter(p=>p&&typeof p.name==='string'&&TYPE_ORDER.includes(p.dream)).map(p=>({id:integer(p.id,0,1e8),name:p.name.slice(0,30),dream:p.dream,craft:String(p.craft||'Crew').slice(0,30)})):[];
 const riderDefault=Math.max(1,CARRIAGES[c.type].people-1);const riders=c.riders===undefined?riderDefault:integer(c.riders,0,CARRIAGES[c.type].people+(level>=4?1:0));
 return {id,type:c.type,level,staff,crew,pendingCrew,riders,...(TYPE_ORDER.includes(c.pendingRefit)&&c.pendingRefit!==c.type?{pendingRefit:c.pendingRefit}:{})}});
 for(const k of ['coins','pending','lifetime'])s[k]=money(bounded(k));for(const k of ['stamps','stops','stationBoost','comfort','seed','events'])s[k]=integer(bounded(k,k==='seed'?4294967295:1e7),0,k==='stationBoost'?4:k==='comfort'?5:k==='seed'?4294967295:1e7);
 s.totalStops=integer(bounded('totalStops',1e7,s.stops),0,1e7);s.totalStops=Math.max(s.stops,s.totalStops);
 s.serviceSeconds=bounded('serviceSeconds',1e11,0);s.serviceClaims=allowed(raw.serviceClaims,SERVICE_MILESTONES.map(x=>x.id),SERVICE_MILESTONES.length);
 s.lastStation=DESTINATIONS.some(d=>d.id===raw.lastStation)?raw.lastStation:'willow';
 s.autoTour=typeof raw.autoTour==='boolean'?raw.autoTour:true;
 // Older v5 saves can contain more than six consecutive stops; repair without losing progress.
 s.regionRunStops=integer(bounded('regionRunStops',1e7,0),0,6);
 s.lastStationRegion=REGIONS.some(r=>r.id===raw.lastStationRegion)?raw.lastStationRegion:'heartland';
 s.lastBoarding=integer(bounded('lastBoarding',1000,0),0,1000);s.lastAlighting=integer(bounded('lastAlighting',1000,0),0,1000);
 s.hires=integer(bounded('hires',1e7,0),0,1e7);s.legacyCount=integer(bounded('legacyCount',10,0),0,10);s.seasonBest=integer(bounded('seasonBest',25,s.cars.length),2,MAX_CARRIAGES);
 s.regionsUnlocked=allowed(raw.regionsUnlocked,REGIONS.map(r=>r.id),REGIONS.length);if(!s.regionsUnlocked.includes('heartland'))s.regionsUnlocked.unshift('heartland');s.activeRegion=s.regionsUnlocked.includes(raw.activeRegion)?raw.activeRegion:'heartland';s.stampProjects=allowed(raw.stampProjects,STAMP_PROJECTS.map(x=>x.id),STAMP_PROJECTS.length);
 s.seed=(s.seed>>>0)||38619;s.eventSeed=integer(bounded('eventSeed',4294967295,872129),0,4294967295)||872129;s.stage=s.stops%Math.max(1,routeStops(s).length);
 for(const k of ['stationProgress','eventProgress'])s[k]=clamp(bounded(k,1e9),0,k==='stationProgress'?journeyDuration(s):170);s.incomeRemainder=clamp(bounded('incomeRemainder',1,0),0,.99999999);
 s.lastTime=typeof raw.lastTime==='number'&&Number.isFinite(raw.lastTime)?clamp(raw.lastTime,0,now+10000):now;s.selected=integer(raw.selected,-1,s.cars.length-1);s.tutorial=integer(raw.tutorial,0,3);
 s.decor=allowed(raw.decor,DECOR.map(d=>d.id),DECOR.length);s.seen=allowed(raw.seen,DESTINATIONS.map(d=>d.id),DESTINATIONS.length);if(!s.seen.length)s.seen=['willow'];s.postcards=allowed(raw.postcards,DESTINATIONS.map(d=>d.id),DESTINATIONS.length);s.sightings=allowed(raw.sightings,SIGHTINGS.map(v=>v.id),SIGHTINGS.length);s.achievements=allowed(raw.achievements,ACHIEVEMENTS.map(v=>v.id),ACHIEVEMENTS.length);s.ownedPaints=allowed(raw.ownedPaints,PAINTS.map(p=>p.id),PAINTS.length);if(!s.ownedPaints.includes('midnight'))s.ownedPaints.unshift('midnight');s.trainPaint=s.ownedPaints.includes(raw.trainPaint)?raw.trainPaint:'midnight';s.log=Array.isArray(raw.log)?raw.log.slice(0,25).filter(x=>x&&typeof x.text==='string').map(x=>({text:x.text.slice(0,160),stop:integer(x.stop,0,1e7)})):[];return s}
