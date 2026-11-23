import {initialState,tick,collect,buildCar,carCost,upgradeCar,upgradeCost,hireResident,hireCost,incomeRate,unlockRegion,regionGate,buyStampProject} from '../src/economy.js';
import {TYPE_ORDER,CARRIAGES,REGIONS} from '../src/data.js';
const fmt=n=>Number.isFinite(n)?Math.round(n):null;
function choose(s){const choices=[];
 for(const c of s.cars){if(c.level<12){const cost=upgradeCost(c);const gain=CARRIAGES[c.type].rate*Math.pow(1.27,c.level-1)*.27*(1+c.staff*.18);choices.push({cost,ratio:gain/cost,fn:()=>upgradeCar(s,c.id)})}
 if(c.staff<2){const cost=hireCost(c);const gain=CARRIAGES[c.type].rate*Math.pow(1.27,c.level-1)*.18;choices.push({cost,ratio:gain/cost,fn:()=>hireResident(s,c.id)})}}
 for(const type of TYPE_ORDER){if(s.stops<CARRIAGES[type].unlock||s.cars.length<CARRIAGES[type].minCars||s.cars.length>=25)continue;const cost=carCost(s,type);choices.push({cost,ratio:CARRIAGES[type].rate/cost,fn:()=>buildCar(s,type)})}
 choices.sort((a,b)=>b.ratio-a.ratio);return choices.find(c=>c.cost<=s.coins);
}
function play(policy){const s=initialState(0),points=[],marks=[1,10,60,1440,10080,43200],max=marks.at(-1);let purchases=0;
 for(let minute=1;minute<=max;minute++){
   if(policy==='casual'&&minute>10&&minute%1440===0){tick(s,8*3600,{offline:true});collect(s)}
   const present=policy==='active'||(minute%1440<10&&minute%1440>=0); // a relaxed daily ten-minute play window
   if(present){tick(s,60);collect(s);for(const r of REGIONS)if(!s.regionsUnlocked.includes(r.id)&&regionGate(s,r.id).ok)unlockRegion(s,r.id);
     const c=choose(s);if(c&&c.fn()?.ok!==false)purchases++;
     if(s.stamps>=12&&s.regionsUnlocked.length>=3)buyStampProject(s,'postcards');}
   // No income is credited during absent wall-clock minutes; one bounded credit per 24-hour gap.
   if(marks.includes(minute))points.push({elapsed:minute===1?'1 minute':minute===10?'10 minutes':minute===60?'1 hour':minute===1440?'1 day':minute===10080?'7 days':'30 days',play:policy,cars:s.cars.length,levelSum:s.cars.reduce((n,c)=>n+c.level,0),coins:fmt(s.coins),rateMin:fmt(incomeRate(s)*60),stops:s.totalStops,regions:s.regionsUnlocked.length,postcards:s.postcards.length,stamps:s.stamps,purchases});
 }
 return points;
}
const report=[...play('active'),...play('casual')];console.table(report);console.log(JSON.stringify(report));
