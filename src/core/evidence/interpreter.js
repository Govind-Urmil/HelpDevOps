import {normalizeEvidenceInput} from './normalize.js';
import {invalid,unsupported} from './result.js';
import {parseDf} from './parsers/df.js';
import {parseKubernetesPod} from './parsers/kubernetes-pod.js';
import {parseDockerState} from './parsers/docker-state.js';
import {parseTerraformLock} from './parsers/terraform-lock.js';
import {parseSystemdUnit} from './parsers/systemd-unit.js';

const parsers={
  'df-usage':parseDf,
  'kubernetes-pod':parseKubernetesPod,
  'docker-state':parseDockerState,
  'terraform-lock':parseTerraformLock,
  'systemd-unit':parseSystemdUnit
};

const dockerStateKeys=['Status','Running','Paused','Restarting','OOMKilled','Dead','Pid','ExitCode','Error','StartedAt','FinishedAt'];
const dockerListKeys=['ID','Image','Names','Status'];

function parseJson(text){try{return JSON.parse(text);}catch{return null;}}
function looksLikeDockerJson(text){
  const parsed=parseJson(text);
  if(!parsed || typeof parsed!=='object' || Array.isArray(parsed))return false;
  const state=parsed.State && typeof parsed.State==='object' && !Array.isArray(parsed.State)?parsed.State:parsed;
  const stateMatches=dockerStateKeys.filter(key=>Object.hasOwn(state,key)).length;
  if(stateMatches>=2)return true;
  const listMatches=dockerListKeys.filter(key=>Object.hasOwn(parsed,key)).length;
  return listMatches>=3 && Object.hasOwn(parsed,'Status');
}
function strongCandidates(text){
  const out=[];
  if(/^\s*Filesystem\b.*(?:Use%|IUse%|Capacity).*(?:Mounted on|Mounted|Target)?/im.test(text))out.push('df-usage');
  if(/^\s*\{/.test(text)&&/"kind"\s*:\s*"Pod"/.test(text))out.push('kubernetes-pod');
  if(/^\s*\{/.test(text)&&looksLikeDockerJson(text))out.push('docker-state');
  if(/Error(?:\s*:\s*)?(?:Error )?(?:acquiring|locking) the state lock|Error locking state/i.test(text))out.push('terraform-lock');
  if(/^(?:Id|LoadState|ActiveState|SubState|Result|ExecMainStatus)=/m.test(text)||(/\.service\s+-/m.test(text)&&/\bActive:\s/m.test(text)))out.push('systemd-unit');
  return [...new Set(out)];
}
export function interpretEvidence(input,{source='auto'}={}){
  const normalized=normalizeEvidenceInput(input);
  if(!normalized.ok)return invalid(normalized.reason);
  if(!normalized.text)return invalid('No evidence was supplied.');
  if(source!=='auto'){
    const parser=parsers[source];
    return parser?parser(normalized.text):unsupported('The selected evidence source is not supported.');
  }
  const candidates=strongCandidates(normalized.text);
  if(candidates.length===1)return parsers[candidates[0]](normalized.text);
  if(candidates.length>1)return {
    ...unsupported('This input matches more than one supported evidence format. Choose the known source before interpretation.',{status:'ambiguous',candidates}),
    status:'ambiguous',
    title:'Evidence source is ambiguous'
  };
  return unsupported('The input did not contain enough reviewed structural signals for one supported evidence interpreter.');
}
