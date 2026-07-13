import {publishedReferences} from './registry.js';import {publishedJourneys} from '../diagnostics/registry.js';import {tools} from '../config/tools.js';import {evidenceDefinitions} from '../core/evidence/registry.js';
const maps={journey:new Map(publishedJourneys.map(x=>[x.id,x])),tool:new Map(tools.map(x=>[x.id,x])),interpreter:new Map(evidenceDefinitions.map(x=>[x.id,x])),reference:new Map(publishedReferences.map(x=>[x.id,x]))};
export function relatedForReference(ref){return [
 ...ref.relatedJourneyIds.map(id=>{const x=maps.journey.get(id);return x&&{type:'DIAGNOSTIC',title:x.title,path:x.path,summary:x.summary}}),
 ...ref.relatedInterpreterIds.map(id=>{const x=maps.interpreter.get(id);return x&&{type:'INTERPRETER',title:x.title,path:x.path,summary:x.summary}}),
 ...ref.relatedToolIds.map(id=>{const x=maps.tool.get(id);return x&&{type:'TOOL',title:x.title,path:x.path,summary:x.description}})
].filter(Boolean).filter((x,i,a)=>a.findIndex(y=>y.path===x.path)===i).slice(0,6)}
export function referencesForJourney(id){return publishedReferences.filter(r=>r.relatedJourneyIds.includes(id)).slice(0,4)}
