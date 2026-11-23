import {initialState,tick,collect,buildCar,carCost,upgradeCar,upgradeCost,hireResident,hireCost,incomeRate} from '../src/economy.js';
import {TYPE_ORDER,CARRIAGES} from '../src/data.js';
const fmt=n=>Number.isFinite(n)?new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(n):String(n);
function choose(s){
 const choices=[];
 for(const c of s.cars){if(c.level<12){const cost=upgradeCost(c);const gain=CARRIAGES[c.type].rate*Math.pow(1.27,c.level-1)*.27*(1+c.staff*.18);choices.push({cost,ratio:gain/cost,fn:()=>upgradeCar(s,c.id),label:'upgrade '+c.type})}
 if(c.staff<2){const cost=hireCost(c);const gain=CARRIAGES[c.type].rate*Math.pow(1.27,c.level-1)*.18;choices.push({cost,ratio:gain/cost,fn:()=>hireResident(s,c.id),label:'resident '+c.type})}}
 for(const type of TYPE_ORDER){if(s.stops<CARRIAGES[type].unlock||s.cars.length>=25)continue;const cost=carCost(s,type);choices.push({cost,ratio:CARRIAGES[type].rate/cost,fn:()=>buildCar(s,type),label:'build '+type});}
 choices.sort((a,b)=>b.ratio-a.ratio);
 return choices.find(o=>o.cost<=s.coins);
}
const s=initialState(0),report=[];let purchases=0;
for(let minute=1;minute<=7*24*60;minute++){
 tick(s,60);collect(s);
 const c=choose(s);if(c){c.fn();purchases++;}
 if([1,10,60,1440,10080].includes(minute))report.push({elapsed:minute+'m',coins:fmt(s.coins),carriages:s.cars.length,stops:s.stops,postcards:s.postcards.length,stamps:s.stamps,levels:s.cars.reduce((sum,c)=>sum+c.level,0),rate_per_minute:fmt(incomeRate(s)*60),purchases});
}
console.table(report);console.log(JSON.stringify(report));
