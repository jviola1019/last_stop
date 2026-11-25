import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {initialState,arrive,hireResident,upgradeCost,upgradeCar,roomGrade,nextRoomGrade,journeyMotion,journeyDuration,tick,offlineCredit,validateState,startSeason,incomeRate,carIncomeRate,buildCar,setAutoTour,travelRegion} from '../src/economy.js';
import {MAX_ROOM_LEVEL,SERVICE_MILESTONES,V4_STORAGE_KEY,STORAGE_KEY,REGIONS} from '../src/data.js';
import {sealState,saveGame,loadGame} from '../src/save.js';

test('masterwork upgrade tiers have a real 20-level limit and superlinear long tail',()=>{
  const s=initialState();const c=s.cars[0];assert.equal(MAX_ROOM_LEVEL,20);
  assert.equal(upgradeCost(c),99);const prices=[];
  for(let level=1;level<MAX_ROOM_LEVEL;level++)prices.push(upgradeCost({...c,level}));
  assert.ok(prices.every((x,i)=>i===0||x>prices[i-1]));
  assert.ok(prices.at(-1)>1_000_000_000,'final upgrade should be a multi-year goal for casual play');
  assert.equal(roomGrade(1).name,'Heritage');assert.equal(roomGrade(5).name,'Refined');
  assert.equal(roomGrade(9).name,'Grand');assert.equal(roomGrade(13).name,'Royal');assert.equal(roomGrade(17).name,'Legendary');
  assert.equal(nextRoomGrade(20),null);
  c.level=20;s.coins=1e12;assert.equal(upgradeCar(s,c.id).ok,false);assert.equal(s.coins,1e12);
});

test('arrival/departure motion is deterministic and tied to modeled trip time',()=>{
 const s=initialState();const d=journeyDuration(s);
 for(const [progress,phase] of [[0,'platform'],[8,'departing'],[40,'enroute'],[d-5,'approaching']]){
  s.stationProgress=progress;const motion=journeyMotion(s);
  assert.equal(motion.phase,phase);assert.ok(motion.speed>=0&&motion.speed<=1);
 }
 s.stationProgress=0;assert.equal(journeyMotion(s).speed,0);
 s.stationProgress=d-1;assert.ok(journeyMotion(s).speed<0.1);
 s.stationProgress=40;assert.equal(journeyMotion(s).speed,1);
 s.activeRegion='desert';assert.ok(journeyDuration(s)>d);
});

test('passengers and crew only change at the station, not when ticking between stations',()=>{
 const s=initialState();s.coins=10000;const car=s.cars[0];const before=car.riders;
 assert.ok(hireResident(s,car.id));assert.equal(car.staff,0);assert.equal(car.pendingCrew.length,1);
 tick(s,40);assert.equal(car.riders,before);assert.equal(car.staff,0);assert.equal(car.pendingCrew.length,1);
 const next=arrive(s);assert.equal(car.staff,1);assert.equal(car.pendingCrew.length,0);
 assert.equal(next.boarding>=0,true);assert.equal(next.alighting>=0,true);
 const after=car.riders;s.stationProgress=0;tick(s,40);assert.equal(car.riders,after);assert.equal(car.staff,1);
});

test('arrival passenger manifest and fare are reproducible from the same state seed',()=>{
 const a=initialState(),b=initialState();const ra=arrive(a),rb=arrive(b);
 assert.deepEqual(ra,rb);assert.deepEqual(a.cars,b.cars);assert.equal(a.seed,b.seed);
 assert.equal(a.lastStation,ra.destination.id);
 for(let k=0;k<15;k++)arrive(a);
 assert.ok(a.cars.some(c=>c.riders!==0),'boarding is not permanently zero');
});

test('passive income and station receipts are invariant to tick granularity',()=>{
 const a=initialState(),b=initialState();
 tick(a,600);for(let k=0;k<600;k++)tick(b,1);
 assert.equal(a.stops,b.stops);assert.equal(a.totalStops,b.totalStops);
 assert.equal(a.seed,b.seed);assert.deepEqual(a.cars.map(c=>c.riders),b.cars.map(c=>c.riders));
 assert.ok(Math.abs(a.pending-b.pending)<.05,[a.pending,b.pending]);
 assert.equal(a.coins,b.coins);
});

test('service ledger grants medals automatically and does not create offline stops',()=>{
 const s=initialState();tick(s,8*3600,{offline:true});
 assert.equal(s.totalStops,0);assert.equal(s.stops,0);
 assert.deepEqual(s.serviceClaims,['first-shift','first-night']);
 assert.equal(s.stamps,2);
 const again=tick(s,3600,{offline:true});assert.ok(again.earned>0);assert.equal(s.stamps,2);
 assert.ok(SERVICE_MILESTONES.at(-1).hours>=8760);
});

test('week-long absence credits only eight hours once; playing again advances the service clock',()=>{
 const now=Date.UTC(2026,10,23),s=initialState(now-7*86400000);
 offlineCredit(s,now);assert.equal(s.serviceSeconds,8*3600);assert.equal(s.totalStops,0);
 offlineCredit(s,now);assert.equal(s.serviceSeconds,8*3600);
 tick(s,60);assert.equal(s.serviceSeconds,8*3600+60);
});

test('v4 JSON envelope is migrated through v6 key without erasing cosmetics, routes or crew',()=>{
 const map=new Map(),storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};
 const s=initialState(1000);s.version=4;s.coins=2100;s.cars[0].level=12;s.cars[0].crew=[{id:1,name:'Mira',dream:'cafe',craft:'Barista'}];s.cars[0].staff=1;
 s.regionsUnlocked=['heartland','coast'];s.activeRegion='coast';s.decor=['lanterns'];
 map.set(V4_STORAGE_KEY,sealState(s));const loaded=loadGame(storage,1000);
 assert.equal(loaded.recovered,true);assert.equal(loaded.state.version,6);assert.equal(loaded.state.coins,2100);
 assert.equal(loaded.state.cars[0].level,12);assert.equal(loaded.state.cars[0].crew[0].name,'Mira');
 assert.deepEqual(loaded.state.decor,['lanterns']);assert.equal(loaded.state.activeRegion,'coast');
 saveGame(storage,loaded.state);assert.ok(map.has(STORAGE_KEY));
});

test('v5 save validation bounds passenger counts and waiting crew size',()=>{
 const state=initialState(),original=JSON.parse(JSON.stringify(state));
 const hacked=JSON.parse(JSON.stringify(state));hacked.cars[0].riders=1e9;
 const fixed=validateState(hacked);assert.ok(fixed.cars[0].riders<=3);
 const oversized=JSON.parse(JSON.stringify(state));oversized.coins=-1;assert.throws(()=>validateState(oversized));
 assert.deepEqual(state,original);
});

test('all seven added regional backdrops and three new rooms are self-contained SVG illustrations',()=>{
 for(const r of REGIONS.filter(r=>r.id!=='heartland')){
  const s=readFileSync(new URL(`../assets/region-${r.id}.svg`,import.meta.url),'utf8');
  assert.ok(s.includes('<svg')&&s.includes('</svg>'));
  assert.ok(s.length>20000);assert.ok(!s.includes('<script'));assert.ok(!s.includes('http://')||s.includes('http://www.w3.org/2000/svg'));
 }
 for(const type of ['library','diner','workshop']){
  const s=readFileSync(new URL(`../assets/car-${type}.svg`,import.meta.url),'utf8');
  assert.ok(s.length>1200&&s.includes('<svg'));
 }
});


test('freshly constructed carriages remain empty until passengers board at a station',()=>{
 const s=initialState();s.coins=100000;
 const result=buildCar(s,'quarters');assert.equal(result.ok,true);
 const next=s.cars.at(-1);assert.equal(next.riders,0);
 tick(s,10);assert.equal(next.riders,0);assert.ok(next.buildRemaining>0);arrive(s);assert.equal(next.riders,0);tick(s,next.buildRemaining,{offline:true});assert.equal(next.riders,0);
 let hadBoarding=false;for(let i=0;i<12;i++){arrive(s);hadBoarding ||= next.riders>0;}
 assert.ok(hadBoarding,'passengers can fill a new carriage at a stop');
});

test('scenic autopilot changes regions after exactly six completed stops, manual selection stays',()=>{
 const s=initialState();s.regionsUnlocked=['heartland','coast','highland'];s.activeRegion='heartland';
 for(let n=0;n<5;n++)arrive(s);
 assert.equal(s.activeRegion,'heartland');assert.equal(s.regionRunStops,5);
 arrive(s);assert.equal(s.activeRegion,'coast');assert.equal(s.regionRunStops,0);
 for(let n=0;n<6;n++)arrive(s);
 assert.equal(s.activeRegion,'highland');
 assert.equal(travelRegion(s,'heartland'),true);assert.equal(s.autoTour,false);
 for(let n=0;n<12;n++)arrive(s);assert.equal(s.activeRegion,'heartland');
 assert.equal(setAutoTour(s,true),true);for(let n=0;n<6;n++)arrive(s);
 assert.equal(s.activeRegion,'coast');
 assert.equal(setAutoTour(s,'yes'),false);assert.equal(s.autoTour,true);
});
