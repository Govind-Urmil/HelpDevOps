export const INVESTIGATION_STATE_VERSION=1;
export const FINDING_STATES=Object.freeze(['observed','confirmed','unknown','excluded']);
const list=value=>Array.isArray(value)?value:[];

export function createInvestigationState({id,title,journeyId,originalEvidence='',now=new Date().toISOString()}={}){
  if(!id||!title||!journeyId)throw new Error('Investigation id, title, and journey are required.');
  return {contractVersion:INVESTIGATION_STATE_VERSION,id,title,journeyId,stage:'observe',originalEvidence,
    capabilityResults:[],findings:{observed:[],confirmed:[],unknown:[],excluded:[]},actions:[],verification:{status:'not-started',checks:[]},
    unresolvedRisks:[],nextAction:'Continue investigation.',sourceMetadata:[],createdAt:now,updatedAt:now};
}

export function addFinding(state,status,finding,now=new Date().toISOString()){
  if(!FINDING_STATES.includes(status))throw new Error(`Unsupported finding state: ${status}`);
  const next=structuredClone(state);for(const key of FINDING_STATES)next.findings[key]=list(next.findings[key]).filter(item=>item.id!==finding.id);
  next.findings[status].push({...finding,status});next.updatedAt=now;return next;
}

export function importCapabilityResult(state,result,now=new Date().toISOString()){
  const next=structuredClone(state);next.capabilityResults.push(result);for(const [index,item] of list(result.evidence).entries()){
    next.findings.observed.push({id:`${result.capability.id}-${next.capabilityResults.length}-${index}`,status:'observed',label:item.signal||String(item),value:item.excerpt||String(item)});
  }next.nextAction=result.suggestedNextAction||next.nextAction;next.stage='scope';next.updatedAt=now;return next;
}

export function recordInvestigationAction(state,action,now=new Date().toISOString()){const next=structuredClone(state);next.actions.push(action);next.stage=action.stage||'test';next.updatedAt=now;return next;}
export function setVerification(state,status,checks=[],now=new Date().toISOString()){const next=structuredClone(state);next.verification={status,checks};next.stage=status==='verified'?'preserve':'verify';next.updatedAt=now;return next;}
export function investigationToBrief(state){return{summary:state.title,symptom:state.originalEvidence,context:`Guided investigation · ${state.journeyId}`,
  observations:state.findings.observed.map(x=>x.label||x.value).join('\n'),unknowns:state.findings.unknown.map(x=>x.label||x.value).join('\n'),
  checks:state.actions.map(x=>x.label||x.summary).join('\n'),actions:state.actions.map(x=>x.result||x.label).join('\n'),
  verification:[state.verification.status,...state.verification.checks].join('\n'),nextStep:state.nextAction};}

export function isInvestigationState(value){return value?.contractVersion===INVESTIGATION_STATE_VERSION&&typeof value.id==='string'&&FINDING_STATES.every(key=>Array.isArray(value.findings?.[key]));}
