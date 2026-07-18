import {tools} from '../config/tools.js';
import {analyzeCron} from '../tools/cron/analyzer.js';
import {detectAndAnalyze} from '../tools/structured-data/analyzer.js';
import {analyzeDockerfile} from '../tools/dockerfile/analyzer.js';
import {analyzeCompose} from '../tools/docker-compose/analyzer.js';
import {analyzeKubernetes} from '../tools/kubernetes-manifest/analyzer.js';
import {calculateIPv4} from '../tools/ipv4-cidr/analyzer.js';
import {analyzePermissions} from '../tools/linux-permissions/analyzer.js';
import {validateRef} from '../tools/git-reference/analyzer.js';
import {transformText,hashText} from '../tools/encoding-hash/analyzer.js';

export const CAPABILITY_RESULT_VERSION=1;
export const INVOCATION_POLICIES=Object.freeze(['automatic-safe','user-input','confirmation-required']);
export const WORKFLOWS=Object.freeze(['standalone','universal-input','investigation','workspace','incident-brief']);

const definitions={
  cron:{run:input=>analyzeCron(input.text??input),policy:'automatic-safe'},
  'structured-data':{run:input=>detectAndAnalyze(input.text??input),policy:'automatic-safe'},
  dockerfile:{run:input=>analyzeDockerfile(input.text??input),policy:'automatic-safe'},
  'docker-compose':{run:input=>analyzeCompose(input.text??input),policy:'automatic-safe'},
  'kubernetes-manifest':{run:input=>analyzeKubernetes(input.text??input),policy:'automatic-safe'},
  'ipv4-cidr':{run:input=>calculateIPv4(typeof input==='string'?{cidr:input}:input),policy:'user-input'},
  'linux-permissions':{run:input=>analyzePermissions(input.text??input,input.context??'file'),policy:'user-input'},
  'git-reference':{run:input=>validateRef(input.text??input,input.context??'full'),policy:'user-input'},
  'encoding-hash':{run:input=>input.operation?.startsWith('SHA-')?hashText(input.text??'',input.operation):transformText(input.text??'',input.operation,input.options),policy:'confirmation-required'}
};

export const capabilityRegistry=Object.freeze(tools.map(tool=>Object.freeze({
  id:tool.id,title:tool.title,description:tool.description,inputKinds:Object.freeze([...tool.inputKinds]),
  workflows:Object.freeze(tool.id==='encoding-hash'?['standalone','investigation','workspace','incident-brief']:WORKFLOWS),
  invocationPolicy:definitions[tool.id].policy,resultVersion:CAPABILITY_RESULT_VERSION,
  privacy:Object.freeze({processing:'browser-local',network:false,persistsAutomatically:false}),
  reviewed:'2026-07-18',path:tool.path
})));

export const getCapability=id=>capabilityRegistry.find(item=>item.id===id);

export async function invokeCapability(id,input,{workflow='standalone',confirmed=false}={}){
  const capability=getCapability(id),implementation=definitions[id];
  if(!capability||!implementation)throw new Error(`Unknown capability: ${id}`);
  if(!capability.workflows.includes(workflow))throw new Error(`${id} is not available in ${workflow}.`);
  if(capability.invocationPolicy==='confirmation-required'&&!confirmed)throw new Error(`${id} requires explicit confirmation.`);
  let raw;
  try{raw=await implementation.run(input)}catch(error){raw={status:'invalid',title:'Capability could not complete',summary:error.message};}
  if(!raw)raw={status:'unsupported',title:'Input not supported',summary:'This capability could not classify the supplied input.'};
  const status=['valid','valid-with-notes','recognized'].includes(raw.status)?'recognized':raw.status==='ambiguous'?'partial-match':raw.status==='unsupported'?'unsupported':raw.status==='invalid'?'more-context-needed':raw.status||'recognized';
  return {contractVersion:CAPABILITY_RESULT_VERSION,capability:{id,title:capability.title,reviewed:capability.reviewed},status,
    summary:raw.summary||raw.title||'Capability completed.',findings:raw.findings||raw.diagnostics||[],warnings:raw.warnings||raw.cautions||[],
    normalizedOutput:raw.formatted||raw.output||null,evidence:raw.evidence||[],suggestedNextAction:(raw.nextActions||[])[0]||null,
    verification:raw.verification||['Confirm the result against the target environment before acting.'],raw};
}
