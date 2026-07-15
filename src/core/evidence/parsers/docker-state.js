import {buildEvidenceResult,unsupported} from '../result.js';

const stateFields=['Status','Running','Paused','Restarting','OOMKilled','Dead','Pid','ExitCode','Error','StartedAt','FinishedAt'];
const listFields=['ID','Image','Names','Status'];

function parseJson(text){try{return JSON.parse(text);}catch{return null;}}
function dockerStateCandidate(parsed){
  if(!parsed || typeof parsed!=='object' || Array.isArray(parsed))return null;
  const nested=parsed.State && typeof parsed.State==='object' && !Array.isArray(parsed.State);
  const state=nested?parsed.State:parsed;
  const matches=stateFields.filter(key=>Object.hasOwn(state,key));
  return matches.length>=2?{state,matches,nested}:null;
}
function dockerListCandidate(parsed){
  if(!parsed || typeof parsed!=='object' || Array.isArray(parsed))return null;
  const matches=listFields.filter(key=>Object.hasOwn(parsed,key));
  return matches.length>=3 && Object.hasOwn(parsed,'Status')?{record:parsed,matches}:null;
}

export function parseDockerState(text){
  const parsed=parseJson(text);
  const stateCandidate=dockerStateCandidate(parsed);
  if(stateCandidate){
    const {state}=stateCandidate;
    const observations=stateFields.filter(key=>Object.hasOwn(state,key)).map(key=>({label:key,value:String(state[key])}));
    if(state.Health?.Status)observations.push({label:'Health status',value:String(state.Health.Status)});
    const interpretations=[];
    if(state.OOMKilled===true)interpretations.push('Docker reports that the container was killed after an out-of-memory condition.');
    if(state.Status==='exited')interpretations.push(`The container state is exited${Number.isInteger(state.ExitCode)?` with exit code ${state.ExitCode}`:''}.`);
    if(state.Restarting===true)interpretations.push('The container is currently restarting.');
    if(!interpretations.length)interpretations.push('Allowlisted Docker state fields were parsed. Container state alone does not establish application health.');
    return buildEvidenceResult({
      parserId:'docker-state',title:'Structured Docker container state recognized',
      summary:'Parsed allowlisted state fields without echoing unrelated container configuration.',
      recognition:{status:'recognized-structured',format:'docker-state-json'},observations,interpretations,
      unknowns:['This does not establish why the process exited, whether dependencies are available, or whether the application is functionally healthy.','Full docker inspect output may contain sensitive configuration; only allowlisted state fields were used.'],
      nextChecks:['Review the container logs and configured command for the relevant failed instance before changing restart policy.'],
      relatedJourneyId:'journey-docker-container-exits',formatted:observations.map(o=>`${o.label}: ${o.value}`).join('\n')
    });
  }
  const listCandidate=dockerListCandidate(parsed);
  if(listCandidate){
    const observations=listFields.filter(key=>Object.hasOwn(parsed,key)).map(key=>({label:key,value:String(parsed[key])}));
    return buildEvidenceResult({
      parserId:'docker-state',title:'Structured Docker container-list record recognized',
      summary:'Parsed a Docker CLI JSON-formatted container record.',
      recognition:{status:'recognized-structured',format:'docker-ps-json'},observations,
      interpretations:['The record reports a container lifecycle status, but it does not establish application health or root cause.'],
      unknowns:['The record may omit exact exit code, OOM state, restart history, and detailed runtime errors.'],
      nextChecks:["Collect a bounded State object with docker inspect --format='{{json .State}}' <container>."],
      relatedJourneyId:'journey-docker-container-exits',formatted:observations.map(o=>`${o.label}: ${o.value}`).join('\n')
    });
  }
  const lines=text.split('\n').filter(Boolean);
  if(lines.length>=2 && /\bCONTAINER ID\b/i.test(lines[0]) && /\bSTATUS\b/i.test(lines[0])){
    const statusLines=lines.slice(1,201).filter(line=>/\b(?:Exited|Up|Restarting|Created|Dead)\b/i.test(line));
    if(!statusLines.length)return unsupported('Docker list headers were found but no recognizable status rows were parsed.',{source:'docker-state',status:'partial'});
    return buildEvidenceResult({
      parserId:'docker-state',title:'Human-readable Docker container list recognized',
      summary:`Recognized ${statusLines.length} status row(s). Column widths and terminal wrapping can vary.`,
      recognition:{status:'recognized-human-readable',format:'docker-ps-table'},
      observations:statusLines.map((line,i)=>({label:`Container row ${i+1}`,value:line})),
      interpretations:['The list reports container lifecycle states, but it does not establish application health or root cause.'],
      unknowns:['Human-readable rows may omit exact exit code, OOM state, restart history, and error detail.'],
      nextChecks:["Collect a bounded State object with docker inspect --format='{{json .State}}' <container>."],relatedJourneyId:'journey-docker-container-exits'
    });
  }
  return unsupported('A Docker State JSON object or supported container-list record/table was not found.',{source:'docker-state'});
}
