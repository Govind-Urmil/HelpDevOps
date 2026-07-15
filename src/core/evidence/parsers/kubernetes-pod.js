import {buildEvidenceResult,unsupported} from '../result.js';
const MAX_STATUS_ENTRIES=50;
function statusObservations(status={}){
  const entries=[];
  if(status.phase)entries.push({label:'Pod phase',value:status.phase});
  const combined=[...(status.containerStatuses||[]).map(item=>['container',item]),...(status.initContainerStatuses||[]).map(item=>['init container',item])];
  const limited=combined.slice(0,MAX_STATUS_ENTRIES);
  for(const [kindLabel,item] of limited){
    const prefix=`${kindLabel} ${item.name||'unknown'}`;
    entries.push({label:`${prefix} restart count`,value:String(item.restartCount??0)});
    const current=item.state||{};
    for(const [kind,state] of Object.entries(current))if(state){
      if(state.reason)entries.push({label:`${prefix} current ${kind} reason`,value:state.reason});
      if(state.message)entries.push({label:`${prefix} current ${kind} message`,value:state.message});
      if(kind==='terminated'){
        if(state.exitCode!==undefined)entries.push({label:`${prefix} current exit code`,value:String(state.exitCode)});
        if(state.signal!==undefined)entries.push({label:`${prefix} current signal`,value:String(state.signal)});
      }
    }
    const previous=item.lastState?.terminated;
    if(previous){
      if(previous.reason)entries.push({label:`${prefix} previous termination reason`,value:previous.reason});
      if(previous.message)entries.push({label:`${prefix} previous termination message`,value:previous.message});
      if(previous.exitCode!==undefined)entries.push({label:`${prefix} previous exit code`,value:String(previous.exitCode)});
      if(previous.signal!==undefined)entries.push({label:`${prefix} previous signal`,value:String(previous.signal)});
    }
  }
  const scheduled=(status.conditions||[]).find(c=>c.type==='PodScheduled');
  if(scheduled){entries.push({label:'PodScheduled',value:String(scheduled.status)});if(scheduled.reason)entries.push({label:'Scheduling reason',value:scheduled.reason});if(scheduled.message)entries.push({label:'Scheduling message',value:scheduled.message});}
  return {entries,truncated:combined.length>MAX_STATUS_ENTRIES,total:combined.length};
}
export function parseKubernetesPod(text){
  let parsed;try{parsed=JSON.parse(text);}catch{}
  if(parsed&&parsed.kind==='Pod'&&parsed.status){
    const statusResult=statusObservations(parsed.status);
    const observations=[{label:'Pod name',value:parsed.metadata?.name||'not provided'},{label:'Namespace',value:parsed.metadata?.namespace||'not provided'},...statusResult.entries];
    const values=observations.map(o=>o.value);const interpretations=[];
    if(values.includes('OOMKilled'))interpretations.push('A container termination state reports OOMKilled. This is strong termination evidence, but it does not identify why memory demand exceeded the applicable limit or capacity.');
    if(values.includes('CrashLoopBackOff'))interpretations.push('A container is in restart backoff after repeated exits. CrashLoopBackOff is a condition, not the root cause.');
    if(values.includes('FailedScheduling'))interpretations.push('The scheduler reported a placement failure. Inspect the full scheduling message before changing requests or constraints.');
    if(!interpretations.length)interpretations.push('Pod status fields were parsed, but none of the reviewed high-signal conditions was present.');
    const journey=values.includes('CrashLoopBackOff')||values.includes('OOMKilled')?'journey-kubernetes-crashloopbackoff':values.includes('FailedScheduling')||parsed.status.phase==='Pending'?'journey-kubernetes-pod-pending':null;
    const unknowns=['This does not validate the live cluster, admission behavior, custom schedulers, provider-specific events, or application logs.','A status reason does not by itself prove the underlying operational cause.'];
    if(statusResult.truncated)unknowns.push(`Only the first ${MAX_STATUS_ENTRIES} container/status entries were interpreted from ${statusResult.total}.`);
    return buildEvidenceResult({
      parserId:'kubernetes-pod',title:'Structured Kubernetes Pod evidence recognized',summary:'Parsed allowlisted Pod identity, phase, condition, and container-status fields from JSON.',
      recognition:{status:'recognized-structured',format:'pod-json',statusEntriesParsed:Math.min(statusResult.total,MAX_STATUS_ENTRIES),statusEntriesTotal:statusResult.total},observations,interpretations,unknowns,
      nextChecks:journey==='journey-kubernetes-pod-pending'?['Inspect kubectl describe pod events and the exact scheduler message.']:['Inspect the failing container current and previous logs, termination state, and relevant events.'],relatedJourneyId:journey,formatted:observations.map(o=>`${o.label}: ${o.value}`).join('\n')
    });
  }
  const hasContext=/\b(?:State|Last State|Restart Count|FailedScheduling|PodScheduled|Containers?|Init Containers?)\s*:/im.test(text)&&/\b(?:CrashLoopBackOff|OOMKilled|FailedScheduling|Pending|Terminated|Waiting)\b/i.test(text);
  if(!hasContext)return unsupported('A complete Kubernetes Pod JSON object or a bounded multi-signal Pod status excerpt was not found.',{source:'kubernetes-pod'});
  const observations=[];
  for(const re of [/Reason:\s*([^\n]+)/gi,/Restart Count:\s*(\d+)/gi,/Phase:\s*([^\n]+)/gi]){let match;while((match=re.exec(text))&&observations.length<50)observations.push({label:re.source.split('\\s')[0].replace(/[^A-Za-z ]/g,'').trim()||'Pod evidence',value:match[1].trim()});}
  const interpretations=[];if(/OOMKilled/i.test(text))interpretations.push('The excerpt reports OOMKilled termination evidence.');if(/CrashLoopBackOff/i.test(text))interpretations.push('The excerpt reports repeated restart backoff.');if(/FailedScheduling/i.test(text))interpretations.push('The excerpt reports a scheduling failure.');
  return buildEvidenceResult({parserId:'kubernetes-pod',title:'Human-readable Kubernetes Pod evidence recognized',summary:'Recognized a bounded Pod status excerpt. Human-readable formatting can vary.',recognition:{status:'recognized-human-readable',format:'pod-status-excerpt'},observations:observations.length?observations:[{label:'Recognized condition',value:(text.match(/CrashLoopBackOff|OOMKilled|FailedScheduling/i)||[])[0]||'Pod status'}],interpretations,unknowns:['The excerpt may omit container identity, namespace, current versus previous state, events, or provider-specific context.'],nextChecks:['Collect bounded Pod JSON or inspect the relevant container state and events.'],relatedJourneyId:/FailedScheduling/i.test(text)?'journey-kubernetes-pod-pending':'journey-kubernetes-crashloopbackoff'});
}
