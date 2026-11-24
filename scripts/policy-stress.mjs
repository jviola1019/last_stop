/** Seeded player-policy stress scenarios. These are not empirical retention or market backtests. */
import {initialState,tick,collect,buildCar,upgradeCar,hireResident,hireCost,carCost,upgradeCost,carIncomeRate,incomeRate,carriageGate,regionGate,unlockRegion,buyStampProject,buyPaint,buyDecor,validateState,randomStep,refitGate,refitCost,queueRefit} from '../src/economy.js';
import {TYPE_ORDER,CARRIAGES,REGIONS,PAINTS,DECOR,STAMP_PROJECTS,MAX_CARRIAGES,MAX_ROOM_LEVEL} from '../src/data.js';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const profiles=[{name:'short visits',days:365,minutes:5,sessions:1,style:'variety'},{name:'regular visits',days:365,minutes:10,sessions:2,style:'balanced'},{name:'collector',days:365,minutes:15,sessions:2,style:'variety'},{name:'optimizer',days:365,minutes:20,sessions:3,style:'income'}];
const reports=[];
for(const p of profiles){for(let seed=1;seed<=6;seed++){const s=initialState(0);s.seed=(seed*12569)>>>0;let rng=seed,firstCar=null,firstUpgrade=null,totalActions=0,failed=0;const points=[];const draw=()=>{let r;[rng,r]=randomStep(rng);return r};
  function options(){const list=[];const seen=new Set(s.cars.flatMap(c=>[c.type,c.pendingRefit].filter(Boolean)));
   for(const c of s.cars){const ix=s.cars.indexOf(c);if(c.level<MAX_ROOM_LEVEL&&!c.pendingRefit)list.push({cost:upgradeCost(c),v:carIncomeRate(s,ix)*.27,kind:'upgrade',fn:()=>upgradeCar(s,c.id).ok});if(c.staff+c.pendingCrew.length<2)list.push({cost:hireCost({...c,staff:c.staff+c.pendingCrew.length}),v:carIncomeRate(s,ix)*.18,kind:'hire',fn:()=>hireResident(s,c.id)})}
   for(const t of TYPE_ORDER){if(carriageGate(s,t).ok)list.push({cost:carCost(s,t),v:CARRIAGES[t].rate,kind:'build',new:!seen.has(t),fn:()=>buildCar(s,t).ok});}
   if(s.cars.length===MAX_CARRIAGES&&p.style==='variety'){for(const c of s.cars)if(!c.pendingRefit&&s.cars.filter(x=>x.type===c.type&&!x.pendingRefit).length>1)for(const t of TYPE_ORDER)if(!seen.has(t)&&refitGate(s,c.id,t).ok)list.push({cost:refitCost(s,c,t),v:CARRIAGES[t].rate,kind:'refit',new:true,fn:()=>queueRefit(s,c.id,t).ok});}
   return list.filter(c=>c.cost<=s.coins);}
  for(let day=1;day<=p.days;day++){for(let sess=0;sess<p.sessions;sess++){
    tick(s,Math.min(8*3600,(24*3600/p.sessions)-p.minutes*60),{offline:true});collect(s);
    for(let min=0;min<p.minutes;min++){tick(s,60);if(draw()>.12)collect(s);
     for(const r of REGIONS)if(!s.regionsUnlocked.includes(r.id)&&regionGate(s,r.id).ok)unlockRegion(s,r.id);
     const available=options();if(available.length){const preferNew=p.style==='variety'&&draw()<.45;const focus=preferNew&&available.some(c=>c.new)?available.filter(c=>c.new):available;focus.sort((a,b)=>b.v/b.cost-a.v/a.cost);const pick=p.style==='income'?focus[0]:focus[Math.min(focus.length-1,Math.floor(draw()*Math.min(5,focus.length)))];const good=pick.fn();totalActions++;if(!good)failed++;else if(pick.kind==='build'&&!firstCar)firstCar=day;else if(pick.kind==='upgrade'&&!firstUpgrade)firstUpgrade=day;}
     if(p.style==='variety'&&draw()<.02){for(const paint of PAINTS)if(!s.ownedPaints.includes(paint.id)&&buyPaint(s,paint.id))break;for(const d of DECOR)if(!s.decor.includes(d.id)&&buyDecor(s,d.id))break;}
     if(draw()<.08)for(const proj of STAMP_PROJECTS)if(!s.stampProjects.includes(proj.id)&&s.stamps>=proj.cost+10){buyStampProject(s,proj.id);break;}
    }
   }
   assert.ok(s.coins>=0&&s.coins<=1e12&&s.pending>=0&&s.stamps>=0);assert.ok(s.cars.length<=MAX_CARRIAGES&&s.cars.every(c=>c.level<=MAX_ROOM_LEVEL));assert.ok(Number.isFinite(incomeRate(s)));validateState(s,0);
   if([1,7,30,90,365].includes(day))points.push({day,cars:s.cars.length,types:new Set(s.cars.map(c=>c.type)).size,highestLevel:Math.max(...s.cars.map(c=>c.level)),regions:s.regionsUnlocked.length,stops:s.totalStops,coins:Math.round(s.coins),stamps:s.stamps,ratePerMinute:Math.round(incomeRate(s)*60)});
  }
  assert.equal(failed,0);reports.push({profile:p.name,seed,firstCar,firstUpgrade,totalActions,failed,points});
}}
const summary=profiles.map(p=>{const group=reports.filter(r=>r.profile===p.name);const range=(key)=>{const a=group.map(r=>r.points.at(-1)[key]);return [Math.min(...a),Math.max(...a)]};return {profile:p.name,runs:group.length,cars:range('cars').join('–'),types:range('types').join('–'),level:range('highestLevel').join('–'),regions:range('regions').join('–'),stops:range('stops').join('–'),rejectedPurchases:group.reduce((n,r)=>n+r.failed,0)}});console.table(summary);writeFileSync(new URL('../docs/policy-stress-results.json',import.meta.url),JSON.stringify({profiles,summary,reports},null,2));console.log(`${reports.length} policy runs, ${reports.length*365} day-end validated states`);
