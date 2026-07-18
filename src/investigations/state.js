export const INVESTIGATION_STATE_VERSION=1;
export const FINDING_STATES=Object.freeze(['observed','confirmed','unknown','excluded']);
const list=value=>Array.isArray(value)?value:[];
const BRANCH_PREFIX='branch:';
const CAPABILITY_PREFIX='capability:';
const stageByNodeKind=Object.freeze({question:'scope',check:'test',interpretation:'explain',action:'act',verification:'verify',completion:'preserve',escalation:'preserve'});

const uniqueById=items=>[...new Map(list(items).filter(Boolean).map((item,index)=>[item.id||`legacy-${index}`,item])).values()];
const findingText=item=>item?.value&&item.value!==item.label?`${item.label}: ${item.value}`:item?.label||item?.value||'';
const withoutGenerated=(items,prefix)=>list(items).filter(item=>!String(item?.id||'').startsWith(prefix));

export function createInvestigationState({id,title,journeyId,originalEvidence='',now=new Date().toISOString()}={}){
  if(!id||!title||!journeyId)throw new Error('Investigation id, title, and journey are required.');
  return {contractVersion:INVESTIGATION_STATE_VERSION,id,title,journeyId,stage:'observe',originalEvidence,
    capabilityResults:[],findings:{observed:[],confirmed:[],unknown:[],excluded:[]},actions:[],verification:{status:'not-started',checks:[]},
    unresolvedRisks:[],nextAction:'Continue investigation.',sourceMetadata:[],createdAt:now,updatedAt:now};
}

export function normalizeInvestigationState(value,fallback=null){
  if(!value||value.contractVersion!==INVESTIGATION_STATE_VERSION||typeof value.id!=='string')return fallback?structuredClone(fallback):null;
  const next=structuredClone(value);next.capabilityResults=uniqueById(list(next.capabilityResults).map((result,index)=>({...result,id:result.id||result.capability?.id||`legacy-capability-${index}`})));
  next.findings=next.findings&&typeof next.findings==='object'?next.findings:{};for(const key of FINDING_STATES)next.findings[key]=uniqueById(next.findings[key]);
  next.actions=uniqueById(next.actions);next.verification={status:next.verification?.status||'not-started',checks:list(next.verification?.checks)};
  next.unresolvedRisks=uniqueById(next.unresolvedRisks);next.sourceMetadata=uniqueById(next.sourceMetadata);next.nextAction=next.nextAction||'Continue investigation.';
  return next;
}

export function addFinding(state,status,finding,now=new Date().toISOString()){
  if(!FINDING_STATES.includes(status))throw new Error(`Unsupported finding state: ${status}`);
  const next=normalizeInvestigationState(state,state);for(const key of FINDING_STATES)next.findings[key]=list(next.findings[key]).filter(item=>item.id!==finding.id);
  next.findings[status].push({...finding,status});next.updatedAt=now;return next;
}

export function importCapabilityResult(state,result,now=new Date().toISOString()){
  if(!result?.capability?.id)throw new Error('Capability result identity is required.');
  const next=normalizeInvestigationState(state,state);const capabilityId=result.capability.id;const prefix=`${CAPABILITY_PREFIX}${capabilityId}:`;
  next.capabilityResults=next.capabilityResults.filter(item=>(item.capability?.id||item.id)!==capabilityId);next.capabilityResults.push({...result,id:capabilityId});
  for(const key of FINDING_STATES)next.findings[key]=withoutGenerated(next.findings[key],prefix);
  list(result.evidence).forEach((item,index)=>next.findings.observed.push({id:`${prefix}evidence:${index}`,status:'observed',source:'capability',capabilityId,label:item.signal||String(item),value:item.excerpt||String(item)}));
  list(result.findings).forEach((item,index)=>next.findings.observed.push({id:`${prefix}finding:${index}`,status:'observed',source:'capability',capabilityId,label:'Review finding',value:String(item)}));
  next.sourceMetadata=next.sourceMetadata.filter(item=>item.id!==`${prefix}result`);next.sourceMetadata.push({id:`${prefix}result`,type:'capability',capabilityId,title:result.capability.title,status:result.status,summary:result.summary});
  next.nextAction=result.suggestedNextAction||next.nextAction;next.stage='scope';next.updatedAt=now;return next;
}

export function applyBranchTransition(state,{sourceNode,choice,destinationNode},now=new Date().toISOString()){
  if(!sourceNode?.id||!choice?.id||!destinationNode?.id)throw new Error('Source node, selected branch, and destination node are required.');
  const next=normalizeInvestigationState(state,state);const prefix=`${BRANCH_PREFIX}${sourceNode.id}:`;
  for(const key of FINDING_STATES)next.findings[key]=withoutGenerated(next.findings[key],prefix);
  next.actions=withoutGenerated(next.actions,prefix);next.unresolvedRisks=withoutGenerated(next.unresolvedRisks,prefix);
  const selected={id:`${prefix}selected`,label:choice.label,value:`Observed at ${sourceNode.title}`,source:'branch'};
  next.findings.observed.push({...selected,status:'observed'});next.findings.confirmed.push({...selected,id:`${prefix}confirmed`,status:'confirmed'});
  for(const alternative of list(sourceNode.choices).filter(item=>item.id!==choice.id))next.findings.excluded.push({id:`${prefix}excluded:${alternative.id}`,status:'excluded',source:'branch',label:alternative.label,value:`Not selected at ${sourceNode.title}`});
  if(destinationNode.choices?.length)next.findings.unknown.push({id:`${prefix}pending`,status:'unknown',source:'branch',label:destinationNode.title,value:destinationNode.summary||'Further evidence is required.'});
  next.actions.push({id:`${prefix}action`,stage:stageByNodeKind[destinationNode.nodeKind]||'test',label:`${sourceNode.title}: ${choice.label}`,result:`Continued to ${destinationNode.title}`});
  next.verification={status:destinationNode.verification?.length?'pending':'not-started',checks:list(destinationNode.verification)};
  next.unresolvedRisks.push({id:`${prefix}risk`,label:destinationNode.title,level:destinationNode.risk||'unknown',mitigation:destinationNode.rollback||destinationNode.summary||'Review the destination step before acting.'});
  next.nextAction=destinationNode.summary||`Continue with ${destinationNode.title}.`;next.stage=stageByNodeKind[destinationNode.nodeKind]||'test';next.updatedAt=now;return next;
}

export function rebuildInvestigationState(state,answers=[],nodes={},now=new Date().toISOString()){
  const next=normalizeInvestigationState(state,state);for(const key of FINDING_STATES)next.findings[key]=withoutGenerated(next.findings[key],BRANCH_PREFIX);
  next.actions=withoutGenerated(next.actions,BRANCH_PREFIX);next.unresolvedRisks=withoutGenerated(next.unresolvedRisks,BRANCH_PREFIX);
  const latestCapability=next.capabilityResults.at(-1);next.stage=latestCapability?'scope':'observe';next.verification={status:'not-started',checks:[]};next.nextAction=latestCapability?.suggestedNextAction||'Continue investigation.';
  let rebuilt=next;for(const answer of list(answers)){const sourceNode=nodes[answer.nodeId];const choice=sourceNode?.choices?.find(item=>item.id===answer.choiceId);const destinationNode=choice?nodes[choice.nextNodeId]:null;if(sourceNode&&choice&&destinationNode)rebuilt=applyBranchTransition(rebuilt,{sourceNode,choice,destinationNode},now);}
  return rebuilt;
}

export function recordInvestigationAction(state,action,now=new Date().toISOString()){const next=normalizeInvestigationState(state,state);next.actions=uniqueById([...next.actions,action]);next.stage=action.stage||'test';next.updatedAt=now;return next;}
export function setVerification(state,status,checks=[],now=new Date().toISOString()){const next=normalizeInvestigationState(state,state);next.verification={status,checks};next.stage=status==='verified'?'preserve':'verify';next.updatedAt=now;return next;}
export function investigationToBrief(state){
  const safe=normalizeInvestigationState(state,state);const capabilities=safe.capabilityResults.flatMap(result=>[
    `Capability: ${result.capability?.title||result.capability?.id||'Unknown capability'}`,
    `Validation status: ${result.status||'unknown'}`,
    `Inspection summary: ${result.summary||'No summary supplied.'}`,
    ...list(result.findings).map(item=>`Finding: ${item}`)
  ]);
  const sections=(key,label)=>safe.findings[key].filter(item=>key!=='observed'||item.source!=='capability').map(item=>`${label}: ${findingText(item)}`);
  return{summary:safe.title,symptom:safe.originalEvidence,context:`Guided investigation · ${safe.journeyId}`,
    observations:[...sections('observed','Observed'),...sections('confirmed','Confirmed'),...sections('excluded','Excluded'),...capabilities].filter(Boolean).join('\n'),
    unknowns:sections('unknown','Unknown').join('\n'),checks:safe.actions.map(item=>item.label||item.summary).filter(Boolean).join('\n'),
    actions:safe.actions.map(item=>item.result||item.label).filter(Boolean).join('\n'),
    riskNotes:safe.unresolvedRisks.map(item=>`${item.label}: ${item.level}${item.mitigation?` — ${item.mitigation}`:''}`).join('\n'),
    verification:[safe.verification.status,...safe.verification.checks].filter(Boolean).join('\n'),nextStep:safe.nextAction};
}

export function isInvestigationState(value){return Boolean(normalizeInvestigationState(value));}
