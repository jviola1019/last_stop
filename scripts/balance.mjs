/**
 * Deterministic progression simulator; NOT real user telemetry.
 * Active: interacts once per minute around the clock, a theoretical upper bound.
 * Casual: plays ten minutes per day and receives one 8h offline credit per day.
 * Purchases the best immediately affordable incremental income/cost option.
 * --long evaluates purchases every 15 minutes after day 30 (published as a changed policy).
 * No ads, real purchases, login streaks, or paid boosts.
 */
import {initialState,tick,collect,buildCar,carCost,upgradeCar,upgradeCost,hireResident,hireCost,incomeRate,unlockRegion,regionGate,buyStampProject,carIncomeRate} from '../src/economy.js';
import {TYPE_ORDER,CARRIAGES,REGIONS,MAX_ROOM_LEVEL,MAX_CARRIAGES} from '../src/data.js';
const long=process.argv.includes('--long');
const fmt=n=>Number.isFinite(n)?Math.round(n):null;
function choose(s){const choices=[];
 for(const [index,c] of s.cars.entries()){
  if(c.level<MAX_ROOM_LEVEL){const price=upgradeCost(c);const val=carIncomeRate(s,index)*.27;choices.push({cost:price,ratio:val/price,fn:()=>upgradeCar(s,c.id)})}
  if(c.staff+(c.pendingCrew||[]).length<2){const price=hireCost({...c,staff:c.staff+(c.pendingCrew||[]).length});const val=carIncomeRate(s,index)*.18;choices.push({cost:price,ratio:val/price,fn:()=>hireResident(s,c.id)})}
 }
 for(const type of TYPE_ORDER){const c=CARRIAGES[type];if(s.stops<c.unlock||s.cars.length<c.minCars||s.cars.length>=MAX_CARRIAGES)continue;const cost=carCost(s,type);choices.push({cost,ratio:c.rate/cost,fn:()=>buildCar(s,type)})}
 choices.sort((a,b)=>b.ratio-a.ratio);return choices.find(c=>c.cost<=s.coins);
}
function play(policy){const s=initialState(0),points=[],marks=long?[1,10,60,1440,10080,43200,129600,525600]:[1,10,60,1440,10080,43200];const max=marks.at(-1);let purchases=0;
 for(let minute=1;minute<=max;minute++){
  if(policy==='casual'&&minute>10&&minute%1440===0){tick(s,8*3600,{offline:true});collect(s)}
  const present=policy==='active'||(minute%1440<10);
  if(present){tick(s,60);collect(s);
   if(!long||minute<=43200||minute%15===0){
   for(const r of REGIONS)if(!s.regionsUnlocked.includes(r.id)&&regionGate(s,r.id).ok)unlockRegion(s,r.id);
   const c=choose(s);if(c){const ok=c.fn();if(ok===true||ok?.ok===true)purchases++}
   if(s.stamps>=12&&s.regionsUnlocked.length>=3)buyStampProject(s,'postcards');}
  }
  if(marks.includes(minute))points.push({elapsed:minute<60?minute+' minutes':minute===60?'1 hour':minute===1440?'1 day':minute===10080?'7 days':minute===43200?'30 days':minute===129600?'90 days':'365 days',policy,cars:s.cars.length,totalRoomLevels:s.cars.reduce((n,c)=>n+c.level,0),maxRoomLevel:Math.max(...s.cars.map(c=>c.level)),coins:fmt(s.coins),coinsPerMin:fmt(incomeRate(s)*60),stops:s.totalStops,regions:s.regionsUnlocked.length,postcards:s.postcards.length,stamps:s.stamps,serviceHours:Math.round(s.serviceSeconds/3600),medals:s.serviceClaims.length,purchases});
 }
 return points;
}
const report=[...play('active'),...play('casual')];console.table(report);console.log('JSON_START'+JSON.stringify(report)+'JSON_END');
