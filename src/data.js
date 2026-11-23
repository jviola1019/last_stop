// All gameplay content is static, locally authored, and never fetched from external services.
export const CARRIAGES = Object.freeze({
  sleeper: {name:'Sleeper',label:'Restful rooms',icon:'moon',cost:220,rate:1.45,color:'#8c5773',accent:'#f5caa1',people:3,unlock:0,desc:'A snug place to dream between stations.'},
  cafe: {name:'Café',label:'Coffee & company',icon:'cup',cost:285,rate:2.1,color:'#aa7649',accent:'#ffe0a5',people:4,unlock:0,desc:'Hot drinks and warm conversations.'},
  garden: {name:'Glasshouse',label:'A little wilderness',icon:'leaf',cost:420,rate:2.8,color:'#557c68',accent:'#b7d8a9',people:3,unlock:1,desc:'A travelling forest under glass.'},
  library: {name:'Library',label:'Books & quiet',icon:'book',cost:650,rate:3.7,color:'#6c7295',accent:'#ecd5a3',people:3,unlock:2,desc:'The stories are always moving.'},
  diner: {name:'Dining Car',label:'The midnight special',icon:'fork',cost:1020,rate:5.2,color:'#af664f',accent:'#f0ca93',people:5,unlock:3,desc:'A three-course journey through the countryside.'},
  arcade: {name:'Arcade',label:'Play all the way',icon:'star',cost:1650,rate:7.7,color:'#7a6095',accent:'#f2bf74',people:4,unlock:4,desc:'Little victories, big grins.'},
  workshop: {name:'Workshop',label:'The busy little makers',icon:'gear',cost:2450,rate:10.1,color:'#698293',accent:'#edc78f',people:3,unlock:5,desc:'Every journey needs a little tinkering.'},
  observatory: {name:'Observatory',label:'Above the clouds',icon:'sparkle',cost:3700,rate:14.5,color:'#476b81',accent:'#badfe0',people:3,unlock:6,desc:'The universe has the best window seats.'}
});
export const TYPE_ORDER = Object.keys(CARRIAGES);
export const DESTINATIONS = [
  {id:'willow',name:'Willowmere',subtitle:'Forest & fern country',biome:'forest',accent:'#527d64',postcard:'The Green Mile',description:'A station tucked beneath enormous sleeping trees.'},
  {id:'harbor',name:'Bellweather Bay',subtitle:'The salt-air coast',biome:'coast',accent:'#568f9c',postcard:'A Sea of Windows',description:'Seagulls escort the train over a glittering causeway.'},
  {id:'alpine',name:'Cloudpine Pass',subtitle:'Above the snowline',biome:'snow',accent:'#7398a9',postcard:'Snow on the Roof',description:'Ice crystals shine on the station clock.'},
  {id:'desert',name:'Saffron Flats',subtitle:'Ochre sand & sunshine',biome:'desert',accent:'#b78654',postcard:'Golden Hour',description:'An amber platform with a thousand-mile view.'},
  {id:'city',name:'Lumen Junction',subtitle:'The city of tomorrow',biome:'city',accent:'#737ca1',postcard:'After Dark',description:'A hundred apartment lights blink hello.'},
  {id:'valley',name:'Rosewater Vale',subtitle:'Fields of flowers',biome:'valley',accent:'#9c8263',postcard:'Wildflower Day',description:'Where every platform is a garden.'},
  {id:'coastnight',name:'Lantern Quay',subtitle:'Seaside lamplight',biome:'coast',accent:'#497b87',postcard:'The Last Lantern',description:'Evening ferries float past the sleeping port.'},
  {id:'highlands',name:'Whistling Ridge',subtitle:'The old mountains',biome:'mountain',accent:'#687e72',postcard:'High Country',description:'Stone bridges ring above the cloudbanks.'}
];
export const DECOR = [
  {id:'lanterns',name:'Amber Lanterns',cost:390,glyph:'✧',desc:'A warm light outside every room after dusk.'},
  {id:'flowers',name:'Window Planters',cost:680,glyph:'✿',desc:'Little flower boxes brighten the entire train.'},
  {id:'pennants',name:'Festival Pennants',cost:1100,glyph:'⚑',desc:'Tiny celebratory flags dance above the carriage roofs.'}
];
export const PAINTS = [
  {id:'midnight',name:'Midnight Blue',color:'#344857',cost:0,stampCost:0},
  {id:'copper',name:'Old Copper',color:'#98613e',cost:450,stampCost:0},
  {id:'sage',name:'Forest Sage',color:'#507867',cost:1050,stampCost:0},
  {id:'plum',name:'Night Plum',color:'#745b7d',cost:0,stampCost:7}
];
export const SIGHTINGS = [
  {id:'fox',name:'Moonlit Fox',emoji:'✦',text:'A fox raced alongside the Everline.'},
  {id:'whale',name:'Silver Whale',emoji:'◈',text:'A distant whale surfaced by the rails.'},
  {id:'balloon',name:'Wayward Balloon',emoji:'✧',text:'A striped balloon floated past the dining car.'},
  {id:'comet',name:'Falling Star',emoji:'★',text:'A falling star kept pace with the train.'},
  {id:'owl',name:'Clockwork Owl',emoji:'✦',text:'A curious owl landed on the signal box.'}
];
export const ACHIEVEMENTS = [
  {id:'hello',title:'All Aboard',detail:'Collect your first earnings.',reward:1},
  {id:'upgrade',title:'A Fresh Coat',detail:'Upgrade any carriage.',reward:1},
  {id:'newcar',title:'Making Room',detail:'Build your fourth carriage.',reward:1},
  {id:'fivecars',title:'A Longer Story',detail:'Own five carriages.',reward:2},
  {id:'station',title:'Next Stop!',detail:'Arrive at a new station.',reward:1},
  {id:'traveler',title:'People Person',detail:'Carry twenty passengers.',reward:2},
  {id:'threecards',title:'Dear Diary',detail:'Discover three unique postcards.',reward:2},
  {id:'sighting',title:'Look Outside!',detail:'Collect a rare scenery sighting.',reward:1},
  {id:'grand',title:'The Grand Tour',detail:'Reach 10,000 lifetime coins.',reward:3}
];
export const STORAGE_KEY = 'everline-save-v3';
export const MAX_OFFLINE_SECONDS = 8 * 60 * 60;
export const MAX_CARRIAGES = 25;
