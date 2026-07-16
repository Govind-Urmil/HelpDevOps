const normalize=value=>String(value||'').toLowerCase().replace(/\s+/g,' ').trim();
const includes=(text,term)=>text.includes(normalize(term));
export function scoreKnowledge(item,input){
 const text=normalize(input);if(!text)return {score:0,matched:[],missing:item.recognition.requiredContext,excluded:[]};
 const excluded=item.recognition.exclusions.filter(term=>includes(text,term));if(excluded.length)return {score:0,matched:[],missing:[],excluded};
 const matched=item.recognition.positive.filter(term=>includes(text,term));const context=item.recognition.requiredContext.filter(term=>includes(text,term));
 if(!matched.length||!context.length)return {score:matched.length?35:0,matched,missing:item.recognition.requiredContext.filter(term=>!context.includes(term)),excluded:[]};
 const score=Math.min(100,45+matched.length*15+context.length*15);return {score,matched:[...matched,...context],missing:[],excluded:[]};
}
export function confidenceFor(score){return score>=85?'High':score>=65?'Medium':score>=45?'Low':'Insufficient evidence'}
export function matchOperationalKnowledge(input,items){
 const ranked=items.map(item=>({item,...scoreKnowledge(item,input)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.item.id.localeCompare(b.item.id));
 if(!ranked.length)return {status:'insufficient',confidence:'Insufficient evidence',matches:[],alternatives:[]};
 const first=ranked[0];if(first.score<65)return {status:'insufficient',confidence:'Insufficient evidence',matches:[],alternatives:ranked.slice(0,5)};const ties=ranked.filter(x=>x.score===first.score);if(ties.length>1)return {status:'ambiguous',confidence:'Low',matches:ties.slice(0,5),alternatives:ranked.slice(ties.length,8)};
 return {status:first.score>=65?'recognized':'insufficient',confidence:confidenceFor(first.score),matches:[first],alternatives:ranked.slice(1,4)};
}
export function knowledgeResult(match,input){
 if(match.status==='ambiguous')return {status:'ambiguous',kind:'operational-knowledge',title:'More information is needed',summary:'Several reviewed issue families match the supplied evidence. Add the missing command or technology context before acting.',confidence:'Low',evidence:match.matches.flatMap(x=>x.matched.map(signal=>({signal:'matched indicator',source:'input',excerpt:signal}))),notChecked:['Live system state','Which matching issue family is active'],nextActions:['Collect the narrow read-only evidence shown in the matching knowledge directory.'],related:match.matches.map(x=>`/knowledge/${x.item.technology}/#${x.item.id}`)};
 const hit=match.matches[0];if(!hit)return null;const item=hit.item;
 return {status:match.status==='recognized'?'recognized':'ambiguous',kind:`knowledge:${item.id}`,title:item.title,summary:item.assessment.observed,confidence:match.confidence,evidence:hit.matched.map(signal=>({signal:'matched indicator',source:'input',excerpt:signal})),notChecked:item.investigation.missingEvidence,nextActions:[item.investigation.firstStep,...item.investigation.commands],verification:item.action.verification,related:[`/knowledge/${item.technology}/#${item.id}`],knowledgeId:item.id,inputExcerpt:String(input).slice(0,180)};
}
