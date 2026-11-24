import {STORAGE_KEY,LEGACY_STORAGE_KEY,V4_STORAGE_KEY,V5_STORAGE_KEY} from './data.js';
import {validateState} from './economy.js';
const MAX_BYTES=200_000;
// FNV-1a detects damaged saves; it is not authentication (offline saves are user-editable).
export function checksum(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16).padStart(8,'0')}
export function sealState(state){const payload=JSON.stringify(state);if(payload.length>MAX_BYTES)throw Error('Save exceeds size limit');return JSON.stringify({schema:1,checksum:checksum(payload),payload});}
export function unsealState(raw,now=Date.now()){if(typeof raw!=='string'||raw.length>MAX_BYTES+300)throw Error('Invalid save size');const envelope=JSON.parse(raw);if(!envelope||envelope.schema!==1||typeof envelope.payload!=='string'||typeof envelope.checksum!=='string')throw Error('Invalid save envelope');if(checksum(envelope.payload)!==envelope.checksum)throw Error('Save checksum mismatch');return validateState(JSON.parse(envelope.payload),now)}
export const backupKeys=(key=STORAGE_KEY)=>[key+'-backup-1',key+'-backup-2',key+'-backup-3'];
export function saveGame(storage,state){const sealed=sealState(state),old=storage.getItem(STORAGE_KEY),keys=backupKeys();
 // Never evict all previous good states just because a primary was corrupted.
 if(old&&old!==sealed){try{unsealState(old);for(let i=keys.length-1;i>0;i--){const prev=storage.getItem(keys[i-1]);if(prev)storage.setItem(keys[i],prev)}storage.setItem(keys[0],old)}catch{}}
 storage.setItem(STORAGE_KEY,sealed);return true;
}
export function loadGame(storage,now=Date.now()){
 const candidates=[STORAGE_KEY,...backupKeys(),V5_STORAGE_KEY,...backupKeys(V5_STORAGE_KEY),V4_STORAGE_KEY,...backupKeys(V4_STORAGE_KEY),LEGACY_STORAGE_KEY];let failed=0;
 for(const key of candidates){let raw;try{raw=storage.getItem(key)}catch{throw Error('Storage unavailable')};if(!raw)continue;
 try{const state=key===LEGACY_STORAGE_KEY?validateState(JSON.parse(raw),now):unsealState(raw,now);return {state,recovered:key!==STORAGE_KEY,source:key,failures:failed}}catch{failed++}}
 return {state:null,recovered:false,source:null,failures:failed};
}
export function clearGame(storage){for(const key of [STORAGE_KEY,V5_STORAGE_KEY,V4_STORAGE_KEY,LEGACY_STORAGE_KEY,...backupKeys(),...backupKeys(V5_STORAGE_KEY),...backupKeys(V4_STORAGE_KEY)])storage.removeItem(key)}

export const FLEET_SLOTS=3;
export function storageForSlot(storage,slot=0){if(!Number.isInteger(slot)||slot<0||slot>=FLEET_SLOTS)throw Error('Invalid fleet slot');if(slot===0)return storage;const key=k=>`everline-fleet-${slot}:${k}`;return {getItem:k=>storage.getItem(key(k)),setItem:(k,v)=>storage.setItem(key(k),v),removeItem:k=>storage.removeItem(key(k))};}
export function canOpenFleet(state){return state.cars.length>=20&&state.regionsUnlocked.length>=3;}
export function loadBackup(storage,now=Date.now()){for(const key of backupKeys()){try{const raw=storage.getItem(key);if(raw)return {state:unsealState(raw,now),source:key,recovered:true}}catch{}}return {state:null,source:null,recovered:false};}
