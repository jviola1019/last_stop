// Authored, offline-first content. All mechanical constraints live with the simulation.
export const CARRIAGES = Object.freeze({
 sleeper:{name:'Sleeper',label:'Restful rooms',icon:'moon',cost:220,rate:1.45,color:'#8c5773',accent:'#f5caa1',people:3,unlock:0,minCars:2,desc:'A snug place to dream between stations.'},
 cafe:{name:'Café',label:'Coffee & company',icon:'cup',cost:285,rate:2.1,color:'#aa7649',accent:'#ffe0a5',people:4,unlock:0,minCars:2,desc:'Hot drinks and warm conversations.'},
 garden:{name:'Glasshouse',label:'A little wilderness',icon:'leaf',cost:420,rate:2.8,color:'#557c68',accent:'#b7d8a9',people:3,unlock:2,minCars:2,desc:'A travelling forest under glass.'},
 library:{name:'Library',label:'Books & quiet',icon:'book',cost:650,rate:3.7,color:'#6c7295',accent:'#ecd5a3',people:3,unlock:6,minCars:3,desc:'The stories are always moving.'},
 diner:{name:'Dining Car',label:'The midnight special',icon:'fork',cost:1020,rate:5.2,color:'#af664f',accent:'#f0ca93',people:5,unlock:14,minCars:4,desc:'A three-course journey through the countryside.'},
 arcade:{name:'Arcade',label:'Play all the way',icon:'star',cost:1650,rate:7.7,color:'#7a6095',accent:'#f2bf74',people:4,unlock:30,minCars:5,desc:'Little victories, big grins.'},
 workshop:{name:'Workshop',label:'The busy little makers',icon:'gear',cost:2450,rate:10.1,color:'#698293',accent:'#edc78f',people:3,unlock:65,minCars:7,desc:'Every journey needs a little tinkering.'},
 observatory:{name:'Observatory',label:'Above the clouds',icon:'sparkle',cost:3700,rate:14.5,color:'#476b81',accent:'#badfe0',people:3,unlock:120,minCars:9,desc:'The universe has the best window seats.'},
 postal:{name:'Postal Car',label:'Letters along the line',icon:'mail',cost:4800,rate:17.6,color:'#4e6b6a',accent:'#d7b386',people:3,unlock:200,minCars:10,desc:'Sort parcels and letters between the villages.'},
 bakery:{name:'Bakery',label:'Fresh from the oven',icon:'bread',cost:5900,rate:21.4,color:'#7c5745',accent:'#e0bc81',people:4,unlock:350,minCars:12,desc:'Warm bread and pastries for the next station.'},
 cinema:{name:'Picture House',label:'Silver-screen journeys',icon:'film',cost:7200,rate:26.1,color:'#53435a',accent:'#c7a377',people:5,unlock:700,minCars:15,desc:'A tiny moving picture house for travelers.'},
 lounge:{name:'Grand Lounge',label:'A quiet place to watch',icon:'sofa',cost:8700,rate:31.8,color:'#455c58',accent:'#ddc08b',people:4,unlock:1500,minCars:18,desc:'Velvet seats and broad panoramic windows.'},
 quarters:{name:"Crew Quarters",label:"Housing",icon:'star',cost:340,rate:1.4,color:'#64546b',accent:'#e8b77e',people:4,unlock:0,minCars:2,desc:"A bunkhouse for the people who keep the railway running."},
 newsstand:{name:"Newsstand",label:"Retail",icon:'star',cost:510,rate:2.6,color:'#537783',accent:'#e9b96f',people:3,unlock:3,minCars:3,desc:"Daily papers and pocket maps for passengers."},
 tea:{name:"Tea Salon",label:"Food",icon:'star',cost:770,rate:3.4,color:'#8b6a58',accent:'#d9bba2',people:4,unlock:10,minCars:4,desc:"Porcelain cups, tea tins and a quiet ceremony."},
 barber:{name:"Barber Shop",label:"Service",icon:'star',cost:1150,rate:4.8,color:'#884b54',accent:'#e5c796',people:3,unlock:18,minCars:4,desc:"A travelling barber with polished mirrors and leather chairs."},
 florist:{name:"Flower Market",label:"Retail",icon:'star',cost:1550,rate:6.5,color:'#547b64',accent:'#e5afbd',people:3,unlock:28,minCars:5,desc:"Buckets of cut flowers and seasonal bouquets."},
 music:{name:"Music Room",label:"Culture",icon:'star',cost:2050,rate:8.0,color:'#65557c',accent:'#edd096',people:4,unlock:45,minCars:6,desc:"Piano recitals and late-night jazz on the rails."},
 apothecary:{name:"Apothecary",label:"Service",icon:'star',cost:2750,rate:10.2,color:'#536e5f',accent:'#edcc8b',people:3,unlock:70,minCars:7,desc:"A cabinet of botanical soaps, balms and remedies."},
 photography:{name:"Photo Studio",label:"Creative",icon:'star',cost:3250,rate:12.0,color:'#5b6074',accent:'#dfad81',people:3,unlock:95,minCars:8,desc:"A darkroom and portrait studio for railway memories."},
 tailor:{name:"Tailor Atelier",label:"Creative",icon:'star',cost:4050,rate:15.0,color:'#84565c',accent:'#e8bf87',people:3,unlock:150,minCars:9,desc:"Patterns, bolts of fabric and beautifully cut jackets."},
 aquarium:{name:"Aquarium",label:"Culture",icon:'star',cost:5200,rate:17.5,color:'#347b82',accent:'#a7d5b6',people:4,unlock:240,minCars:10,desc:"A miniature underwater garden with shimmering fish."},
 cheese:{name:"Cheese Pantry",label:"Food",icon:'star',cost:6200,rate:21.0,color:'#9a7047',accent:'#f1d59c',people:3,unlock:380,minCars:12,desc:"A cool pantry of farmhouse cheeses and tasting boards."},
 museum:{name:"Railway Museum Car",label:"Culture",icon:'star',cost:7100,rate:23.5,color:'#766650',accent:'#d9be83',people:4,unlock:550,minCars:13,desc:"Old signals, model trains and a treasured station clock."},
 pottery:{name:"Pottery Studio",label:"Creative",icon:'star',cost:7950,rate:26.0,color:'#a0634d',accent:'#e8c8a4',people:3,unlock:850,minCars:15,desc:"A small kiln and shelves of handmade ceramics."},
 bookshop:{name:"Bookshop",label:"Retail",icon:'star',cost:9000,rate:29.0,color:'#555a78',accent:'#e5c28e',people:3,unlock:1200,minCars:16,desc:"New novels, travel journals and first editions."},
 suite:{name:"Pullman Suite",label:"Housing",icon:'star',cost:9800,rate:18.0,color:'#6d475b',accent:'#efd09d',people:3,unlock:1800,minCars:18,desc:"A private compartment with upholstered beds and a writing desk."},
 planetarium:{name:"Planetarium",label:"Culture",icon:'star',cost:11600,rate:35.0,color:'#34445e',accent:'#bfd3e6',people:4,unlock:2500,minCars:20,desc:"A miniature dome projecting constellations over velvet seats."}
});
export const TYPE_ORDER=Object.keys(CARRIAGES);
export const SERVICE_CATALOG=Object.freeze({
 "sleeper": {
  "category": "Housing",
  "products": [
   "Room rent",
   "Linen",
   "Concierge"
  ],
  "duration": 2400,
  "lead": 90
 },
 "cafe": {
  "category": "Food",
  "products": [
   "Espresso",
   "Pastries",
   "Coffee flights"
  ],
  "duration": 2880,
  "lead": 120
 },
 "garden": {
  "category": "Creative",
  "products": [
   "Seedlings",
   "Terrariums",
   "Rare orchids"
  ],
  "duration": 3360,
  "lead": 150
 },
 "library": {
  "category": "Culture",
  "products": [
   "Reading passes",
   "Book loans",
   "Literary salons"
  ],
  "duration": 3840,
  "lead": 180
 },
 "diner": {
  "category": "Food",
  "products": [
   "Breakfast",
   "Lunch",
   "Dinner service"
  ],
  "duration": 4320,
  "lead": 210
 },
 "arcade": {
  "category": "Culture",
  "products": [
   "Game tokens",
   "Prize tickets",
   "Tournament passes"
  ],
  "duration": 2400,
  "lead": 240
 },
 "workshop": {
  "category": "Creative",
  "products": [
   "Repairs",
   "Model kits",
   "Custom machinery"
  ],
  "duration": 2880,
  "lead": 90
 },
 "observatory": {
  "category": "Culture",
  "products": [
   "Star maps",
   "Telescope sessions",
   "Astronomy talks"
  ],
  "duration": 3360,
  "lead": 120
 },
 "postal": {
  "category": "Service",
  "products": [
   "Letters",
   "Parcels",
   "Express dispatch"
  ],
  "duration": 3840,
  "lead": 150
 },
 "bakery": {
  "category": "Food",
  "products": [
   "Bread",
   "Pastries",
   "Celebration cakes"
  ],
  "duration": 4320,
  "lead": 180
 },
 "cinema": {
  "category": "Culture",
  "products": [
   "Matinees",
   "Evening shows",
   "Private screenings"
  ],
  "duration": 2400,
  "lead": 210
 },
 "lounge": {
  "category": "Service",
  "products": [
   "Day passes",
   "Cocktail service",
   "Private events"
  ],
  "duration": 2880,
  "lead": 240
 },
 "quarters": {
  "category": "Housing",
  "products": [
   "Bunks",
   "Laundry",
   "Lockers"
  ],
  "duration": 3360,
  "lead": 90
 },
 "newsstand": {
  "category": "Retail",
  "products": [
   "Morning papers",
   "Maps",
   "Travel guides"
  ],
  "duration": 3840,
  "lead": 120
 },
 "tea": {
  "category": "Food",
  "products": [
   "Green tea",
   "Cream tea",
   "Afternoon service"
  ],
  "duration": 4320,
  "lead": 150
 },
 "barber": {
  "category": "Service",
  "products": [
   "Trims",
   "Shaves",
   "Grooming kits"
  ],
  "duration": 2400,
  "lead": 180
 },
 "florist": {
  "category": "Retail",
  "products": [
   "Posies",
   "Bouquets",
   "Wedding flowers"
  ],
  "duration": 2880,
  "lead": 210
 },
 "music": {
  "category": "Culture",
  "products": [
   "Sheet music",
   "Recitals",
   "Private concerts"
  ],
  "duration": 3360,
  "lead": 240
 },
 "apothecary": {
  "category": "Service",
  "products": [
   "Soap",
   "Herbal balms",
   "Bath kits"
  ],
  "duration": 3840,
  "lead": 90
 },
 "photography": {
  "category": "Creative",
  "products": [
   "Prints",
   "Portraits",
   "Albums"
  ],
  "duration": 4320,
  "lead": 120
 },
 "tailor": {
  "category": "Creative",
  "products": [
   "Alterations",
   "Waistcoats",
   "Bespoke suits"
  ],
  "duration": 2400,
  "lead": 150
 },
 "aquarium": {
  "category": "Culture",
  "products": [
   "Viewing passes",
   "Guided tours",
   "Sea journals"
  ],
  "duration": 2880,
  "lead": 180
 },
 "cheese": {
  "category": "Food",
  "products": [
   "Cheese rolls",
   "Tasting boards",
   "Hampers"
  ],
  "duration": 3360,
  "lead": 210
 },
 "museum": {
  "category": "Culture",
  "products": [
   "Admission",
   "Model kits",
   "Archive tours"
  ],
  "duration": 3840,
  "lead": 240
 },
 "pottery": {
  "category": "Creative",
  "products": [
   "Cups",
   "Vases",
   "Custom ceramics"
  ],
  "duration": 4320,
  "lead": 90
 },
 "bookshop": {
  "category": "Retail",
  "products": [
   "Paperbacks",
   "Journals",
   "First editions"
  ],
  "duration": 2400,
  "lead": 120
 },
 "suite": {
  "category": "Housing",
  "products": [
   "Room rent",
   "Linen",
   "Concierge"
  ],
  "duration": 2880,
  "lead": 150
 },
 "planetarium": {
  "category": "Culture",
  "products": [
   "Star charts",
   "Dome shows",
   "Night lectures"
  ],
  "duration": 3360,
  "lead": 180
 }
});
export const NEW_BLUEPRINTS=["quarters", "newsstand", "tea", "barber", "florist", "music", "apothecary", "photography", "tailor", "aquarium", "cheese", "museum", "pottery", "bookshop", "suite", "planetarium"];
export const ROOM_CATEGORIES=["Housing","Food","Service","Retail","Creative","Culture"];
export const ECONOMY_RATE_SCALE=.14;
export const REGIONS=Object.freeze([
 {id:'heartland',name:'The Green Line',subtitle:'Fern valleys & sleepy towns',stops:0,cars:2,stamps:0,accent:'#88ad8a',biome:'forest'},
 {id:'coast',name:'Saltwind Coast',subtitle:'Harbors & lantern-lit quays',stops:8,cars:3,stamps:2,accent:'#79b6c0',biome:'coast'},
 {id:'highland',name:'Cloudpine Highlands',subtitle:'Snow, cliffs & stone bridges',stops:35,cars:5,stamps:6,accent:'#a3b3cc',biome:'snow'},
 {id:'desert',name:'Golden Expanse',subtitle:'Desert light & copper canyons',stops:110,cars:8,stamps:12,accent:'#edbd78',biome:'desert'},
 {id:'metropolis',name:'Lumen Corridor',subtitle:'Electric cities after dark',stops:400,cars:12,stamps:18,accent:'#ac9ecb',biome:'city'},
 {id:'frontier',name:'The Far Horizon',subtitle:'Aurora stations & starlit ice',stops:1200,cars:17,stamps:26,accent:'#accfd4',biome:'aurora'},
 {id:'archipelago',name:'Moonstone Isles',subtitle:'Moonlit sea bridges & island rails',stops:8000,cars:22,stamps:55,accent:'#9dc0ca',biome:'coast'},
 {id:'beyond',name:'Beyond the Last Bridge',subtitle:'The edge of the painted map',stops:23000,cars:25,stamps:95,accent:'#d4b6db',biome:'mountain'}
]);
export const DESTINATIONS=[
 {id:'willow',region:'heartland',name:'Willowmere',subtitle:'Forest & fern country',biome:'forest',accent:'#527d64',postcard:'The Green Mile',description:'A station tucked beneath enormous sleeping trees.'},
 {id:'valley',region:'heartland',name:'Rosewater Vale',subtitle:'Fields of flowers',biome:'valley',accent:'#9c8263',postcard:'Wildflower Day',description:'Where every platform is a garden.'},
 {id:'harbor',region:'coast',name:'Bellweather Bay',subtitle:'The salt-air coast',biome:'coast',accent:'#568f9c',postcard:'A Sea of Windows',description:'Seagulls escort the train over a glittering causeway.'},
 {id:'coastnight',region:'coast',name:'Lantern Quay',subtitle:'Seaside lamplight',biome:'coast',accent:'#497b87',postcard:'The Last Lantern',description:'Evening ferries float past the sleeping port.'},
 {id:'alpine',region:'highland',name:'Cloudpine Pass',subtitle:'Above the snowline',biome:'snow',accent:'#7398a9',postcard:'Snow on the Roof',description:'Ice crystals shine on the station clock.'},
 {id:'highlands',region:'highland',name:'Whistling Ridge',subtitle:'The old mountains',biome:'mountain',accent:'#687e72',postcard:'High Country',description:'Stone bridges ring above the cloudbanks.'},
 {id:'desert',region:'desert',name:'Saffron Flats',subtitle:'Ochre sand & sunshine',biome:'desert',accent:'#b78654',postcard:'Golden Hour',description:'An amber platform with a thousand-mile view.'},
 {id:'canyon',region:'desert',name:'Copper Canyon',subtitle:'Wind-carved sandstone',biome:'desert',accent:'#be7756',postcard:'Red Rock Rails',description:'The railway threads between copper-colored canyon walls.'},
 {id:'city',region:'metropolis',name:'Lumen Junction',subtitle:'The city of tomorrow',biome:'city',accent:'#737ca1',postcard:'After Dark',description:'A hundred apartment lights blink hello.'},
 {id:'neon',region:'metropolis',name:'Neon Harbor',subtitle:'Skyline above the water',biome:'city',accent:'#8965a6',postcard:'Electric Tides',description:'Elevated track winds among glowing platforms.'},
 {id:'aurora',region:'frontier',name:'Aurora Point',subtitle:'The northern lights',biome:'aurora',accent:'#7095a7',postcard:'Green Night',description:'Ribbons of color shimmer above a silent station.'},
 {id:'astral',region:'frontier',name:'Starfall Terminus',subtitle:'Beyond the last map',biome:'aurora',accent:'#618caa',postcard:'Farther Still',description:'An observatory waits at the edge of the known rails.'},
 {id:'moonstone',region:'archipelago',name:'Moonstone Pier',subtitle:'Pearl-blue sea mist',biome:'coast',accent:'#8daab7',postcard:'Moon on the Water',description:'A lighthouse guides the train through midnight sea bridges.'},
 {id:'isle',region:'archipelago',name:'Tideglass Island',subtitle:'Sunken gardens',biome:'coast',accent:'#5d92a5',postcard:'Salt & Stardust',description:'Coral-colored houses perch above the glittering tide.'},
 {id:'beyond',region:'beyond',name:'The Last Bridge',subtitle:'The final map fold',biome:'mountain',accent:'#bb9bbf',postcard:'The Bridge Beyond',description:'A railway viaduct curves past the far edge of the atlas.'},
 {id:'cloud',region:'beyond',name:'Cloud Archive',subtitle:'The station of stories',biome:'aurora',accent:'#c6a6b8',postcard:'Everywhere At Once',description:'An old clock keeps time beneath a sky of stars.'}
];
export const RESIDENTS=Object.freeze([
 {name:'Mira',dream:'cafe',craft:'Barista'}, {name:'Theo',dream:'sleeper',craft:'Porter'},
 {name:'Pippa',dream:'garden',craft:'Botanist'}, {name:'Jun',dream:'library',craft:'Librarian'},
 {name:'Nell',dream:'diner',craft:'Chef'}, {name:'Ezra',dream:'arcade',craft:'Gamekeeper'},
 {name:'Bea',dream:'workshop',craft:'Mechanic'}, {name:'Orion',dream:'observatory',craft:'Stargazer'},
 {name:'Luca',dream:'garden',craft:'Florist'}, {name:'Faye',dream:'cafe',craft:'Baker'},
 {name:'Kit',dream:'diner',craft:'Host'}, {name:'Ada',dream:'workshop',craft:'Inventor'},
 {name:'Ivy',dream:'library',craft:'Storyteller'}, {name:'Rowan',dream:'sleeper',craft:'Conductor'},
 {name:'Sol',dream:'observatory',craft:'Navigator'}, {name:'Iris',dream:'arcade',craft:'Artist'}, {name:'Sage',dream:'postal',craft:'Postmaster'}, {name:'Cora',dream:'bakery',craft:'Pastry chef'}, {name:'Ellis',dream:'cinema',craft:'Projectionist'}, {name:'Mae',dream:'lounge',craft:'Host'},
 {name:"Ellie",dream:'quarters',craft:"Crew Quarters"}, {name:"Hugo",dream:'newsstand',craft:"Newsstand"}, {name:"Min",dream:'tea',craft:"Tea Salon"}, {name:"Alfie",dream:'barber',craft:"Barber Shop"}, {name:"Violet",dream:'florist',craft:"Flower Market"}, {name:"Felix",dream:'music',craft:"Music Room"}, {name:"Rose",dream:'apothecary',craft:"Apothecary"}, {name:"Niko",dream:'photography',craft:"Photo Studio"}, {name:"Tess",dream:'tailor',craft:"Tailor Atelier"}, {name:"Coral",dream:'aquarium',craft:"Aquarium"}, {name:"Otto",dream:'cheese',craft:"Cheese Pantry"}, {name:"Arthur",dream:'museum',craft:"Railway Museum Car"}, {name:"Clay",dream:'pottery',craft:"Pottery Studio"}, {name:"Opal",dream:'bookshop',craft:"Bookshop"}, {name:"Lena",dream:'suite',craft:"Pullman Suite"}, {name:"Nova",dream:'planetarium',craft:"Planetarium"}
]);
export const STAMP_PROJECTS=Object.freeze([
 {id:'postcards',name:'Postcard Gallery',cost:3,desc:'Each region passport stamp now gives your train a permanent +2% earning bonus.'},
 {id:'concierge',name:'Concierge Academy',cost:7,desc:'All hired residents earn an additional +5% each.'},
 {id:'souvenirs',name:'Souvenir Counter',cost:10,desc:'Station fares increase by 20%.'},
 {id:'network',name:'Grand Railway Network',cost:35,desc:'An additional 1.8% train-wide income for each distinct carriage type beyond two.'},
 {id:'archive',name:'Heritage Archive',cost:65,desc:'Establish a permanent archive of the line; station fares increase another 12%.'}
]);
export const DECOR=[
 {id:'lanterns',name:'Amber Lanterns',cost:390,glyph:'✧',desc:'A warm light outside every room after dusk.'},
 {id:'flowers',name:'Window Planters',cost:680,glyph:'✿',desc:'Little flower boxes brighten the entire train.'},
 {id:'pennants',name:'Festival Pennants',cost:1100,glyph:'⚑',desc:'Tiny celebratory flags dance above the carriage roofs.'}
];
export const PAINTS=[
 {id:'midnight',name:'Midnight Blue',color:'#344857',cost:0,stampCost:0},
 {id:'copper',name:'Old Copper',color:'#98613e',cost:450,stampCost:0},
 {id:'sage',name:'Forest Sage',color:'#507867',cost:1050,stampCost:0},
 {id:'plum',name:'Night Plum',color:'#745b7d',cost:0,stampCost:7},
 {id:'claret',name:'Claret Express',color:'#8f4448',cost:2400,stampCost:0},
 {id:'ivory',name:'Ivory Pullman',color:'#d8c39c',cost:6500,stampCost:0},
 {id:'teal',name:'Ocean Teal',color:'#397d81',cost:18000,stampCost:3},
 {id:'royal',name:'Royal Ochre',color:'#b79142',cost:65000,stampCost:8}
];
export const LIVERY_FILTERS=Object.freeze({midnight:'none',copper:'sepia(.52) saturate(1.35)',sage:'sepia(.25) hue-rotate(54deg) saturate(.8)',plum:'sepia(.25) hue-rotate(233deg) saturate(.9)',claret:'sepia(.6) hue-rotate(315deg) saturate(1.4)',ivory:'sepia(.6) saturate(.45) brightness(1.3)',teal:'sepia(.6) hue-rotate(115deg) saturate(1.5)',royal:'sepia(.85) saturate(1.65) brightness(1.12)'});
export const SIGHTINGS=[
 {id:'fox',name:'Moonlit Fox',emoji:'✦',text:'A fox raced alongside the Everline.'},
 {id:'whale',name:'Silver Whale',emoji:'◈',text:'A distant whale surfaced by the rails.'},
 {id:'balloon',name:'Wayward Balloon',emoji:'✧',text:'A striped balloon floated past the dining car.'},
 {id:'comet',name:'Falling Star',emoji:'★',text:'A falling star kept pace with the train.'},
 {id:'owl',name:'Clockwork Owl',emoji:'✦',text:'A curious owl landed on the signal box.'},
 {id:'deer',name:'Silver Stag',emoji:'✧',text:'A stag paused at the forest edge.'},
 {id:'festival',name:'Village Lanterns',emoji:'✦',text:'A village festival lit the valley.'}
];
export const ACHIEVEMENTS=[
 {id:'hello',title:'All Aboard',detail:'Collect your first earnings.',reward:1},
 {id:'upgrade',title:'A Fresh Coat',detail:'Upgrade any carriage.',reward:1},
 {id:'newcar',title:'Making Room',detail:'Build your fourth carriage.',reward:1},
 {id:'fivecars',title:'A Longer Story',detail:'Own five carriages.',reward:2},
 {id:'station',title:'Next Stop!',detail:'Arrive at a new station.',reward:1},
 {id:'traveler',title:'People Person',detail:'Carry twenty passengers.',reward:2},
 {id:'threecards',title:'Dear Diary',detail:'Discover three unique postcards.',reward:2},
 {id:'sighting',title:'Look Outside!',detail:'Collect a rare scenery sighting.',reward:1},
 {id:'grand',title:'The Grand Tour',detail:'Reach 10,000 lifetime coins.',reward:3},
 {id:'routes',title:'Beyond the Valley',detail:'Unlock three railway regions.',reward:3},
 {id:'magnate',title:'All Your Carriages',detail:'Build 20 carriages.',reward:5},
 {id:'season',title:'A Timetable Renewed',detail:'Begin a new railway season.',reward:5}
];
// Local-save migrations preserve the player's original rooms, region permits, currency and crew.
export const STORAGE_KEY='everline-save-v6';
export const V5_STORAGE_KEY='everline-save-v5';
export const V4_STORAGE_KEY='everline-save-v4';
export const LEGACY_STORAGE_KEY='everline-save-v3';
export const MAX_OFFLINE_SECONDS=8*60*60;
export const MAX_CARRIAGES=25;
export const MAX_ROOM_LEVEL=20;
export const ROOM_GRADES=[
 {level:1,name:'Heritage',detail:'Original warm interior'},
 {level:5,name:'Refined',detail:'Polished brass and fresh upholstery'},
 {level:9,name:'Grand',detail:'Extra lighting, plants and room flourishes'},
 {level:13,name:'Royal',detail:'Ornate trim, custom signage and stained glass'},
 {level:17,name:'Legendary',detail:'Signature illuminated carriage and prestige crest'}
];
// Optional long-tail milestones reward cumulative service, not compulsory daily check-ins.
// Since offline service is capped at eight hours per absence, the final medals take real months/years.
export const SERVICE_MILESTONES=[
 {id:'first-shift',hours:1,name:'First Shift',stamps:1},
 {id:'first-night',hours:8,name:'Night Express',stamps:1},
 {id:'daylong',hours:24,name:'Day and Night',stamps:2},
 {id:'weeklong',hours:168,name:'Silver Timetable',stamps:3},
 {id:'monthlong',hours:720,name:'Golden Timetable',stamps:4},
 {id:'quarterlong',hours:2160,name:'The Hundred Bridges',stamps:5},
 {id:'halfy',hours:4380,name:'Six Months of Stories',stamps:6},
 {id:'year',hours:8760,name:'The Everline Yearbook',stamps:8}
];

// Locomotive eras are optional cosmetic achievements, never paid content.
export const ENGINES=Object.freeze([
 {id:'steam',name:'Heritage Steam',era:'1890 · Age of Steam',asset:'car-engine.png',stops:0,coins:0,stamps:0},
 {id:'express',name:'Pacific Express',era:'1935 · Streamline Age',asset:'engine-express.svg',stops:60,coins:2500,stamps:2},
 {id:'diesel',name:'Continental Diesel',era:'1955 · Golden Age',asset:'engine-diesel.svg',stops:250,coins:18000,stamps:6},
 {id:'electric',name:'Lumen Electric',era:'1985 · Electric Age',asset:'engine-electric.svg',stops:1000,coins:100000,stamps:12},
 {id:'mountain',name:'Mountaineer',era:'1910 · Mountain Rail',asset:'engine-mountain.svg',stops:20,coins:1200,stamps:1},
 {id:'artdeco',name:'Silver Arrow',era:'1940 · Art Deco',asset:'engine-artdeco.svg',stops:120,coins:8000,stamps:3},
 {id:'alpine',name:'Alpine Railcar',era:'1965 · Alpine Electric',asset:'engine-alpine.svg',stops:550,coins:42000,stamps:9},
 {id:'horizon',name:'Horizon Limited',era:'2040 · Future Rail',asset:'engine-horizon.svg',stops:5000,coins:850000,stamps:30}
]);
export const TALES=Object.freeze([
 {id:'mira',name:'Mira’s first cup',stops:1,lines:['A young barista boards at Willowmere, carrying a silver kettle.','She discovers a new blend at the coast and shares it with her fellow travelers.','Her café becomes a place where strangers write letters to each other.']},
 {id:'theo',name:'Theo’s blue suitcase',stops:8,lines:['Theo is searching for a village he remembers from childhood.','A postcard from Cloudpine Pass gives him a clue.','He finally recognizes the old station clock and sends a postcard home.']},
 {id:'pippa',name:'Pippa’s traveling garden',stops:25,lines:['Pippa plants a seed in a tiny terracotta pot.','She collects a cutting from a distant island station.','Her traveling garden flowers beneath the northern lights.']},
 {id:'orion',name:'Orion’s star atlas',stops:80,lines:['Orion boards with a hand-drawn chart of the stars.','The clear desert sky fills a missing page in his atlas.','He finishes the chart and leaves a copy in the library for the next passenger.']},
 {id:'sage',name:'The letter that traveled',stops:200,lines:['An unaddressed letter arrives at the station.','Sage follows an old railway stamp to a village by the sea.','The letter finds its home; a reply is left in the postal carriage.']}
]);
export const HERITAGE_PROJECTS=Object.freeze([
 {id:'conservation',name:'Station Conservation',coins:1e6,stamps:15,stops:500},
 {id:'museum',name:'Railway Museum',coins:5e7,stamps:40,stops:2500},
 {id:'endowment',name:'The Everline Endowment',coins:5e8,stamps:100,stops:8000}
]);
export const SEASONS=['Spring','Summer','Autumn','Winter'];

// Optional workshop licenses: four individually visible service improvements per carriage.
export const WORKSHOP_STAGES=Object.freeze([
 {level:5,name:'Craft finish',detail:'Solid wood and hand-set brass',bonus:.12},
 {level:9,name:'Signature service',detail:'Tailored furnishings and illuminated service plaque',bonus:.12},
 {level:13,name:'Grand commission',detail:'Ornamental carriage fascia and commissioned fittings',bonus:.12},
 {level:17,name:'Master certificate',detail:'Heritage enamel and illuminated masterwork crest',bonus:.12}
]);
export const SERVICE_RANKS=Object.freeze([
 {id:'r1',stops:1,name:'First Departure',stamps:1},
 {id:'r2',stops:5,name:'Local Service',stamps:1},
 {id:'r3',stops:20,name:'Branch Line',stamps:2},
 {id:'r4',stops:60,name:'Regional Express',stamps:2},
 {id:'r5',stops:150,name:'Grand Touring',stamps:3},
 {id:'r6',stops:400,name:'Continental Service',stamps:4},
 {id:'r7',stops:1000,name:'International Railway',stamps:5},
 {id:'r8',stops:2500,name:'Heritage Line',stamps:6},
 {id:'r9',stops:5000,name:'Railway of Distinction',stamps:8},
 {id:'r10',stops:10000,name:'Everline Master',stamps:10}
]);
