import {interpretEvidence} from './evidence/interpreter.js';
import {analyzeCron} from '../tools/cron/analyzer.js';
import {analyzeDockerfile} from '../tools/dockerfile/analyzer.js';
import {detectAndAnalyze} from '../tools/structured-data/analyzer.js';
import {publishedJourneys} from '../diagnostics/registry.js';
import {calculateIPv4} from '../tools/ipv4-cidr/analyzer.js';import {analyzePermissions} from '../tools/linux-permissions/analyzer.js';import {validateRef} from '../tools/git-reference/analyzer.js';
export function buildDiagnosticDiscoveryResult(diagnostic,trimmed){
  const isReviewed=diagnostic.status==='reviewed';
  const statusLabel=isReviewed?'Reviewed':'Technical review candidate';
  const statusPhrase=isReviewed?'reviewed':'technical-review candidate';
  return {status:'recognized',kind:`diagnostic:${diagnostic.id}`,title:`${statusLabel} diagnostic journey found: ${diagnostic.title}`,summary:`The text matches a ${statusPhrase} symptom or error entry. It routes to evidence collection; it does not prove one root cause.`,evidence:[{signal:isReviewed?'reviewed-diagnostic-match':'candidate-diagnostic-match',source:'input',excerpt:trimmed.slice(0,180)}],findings:[],actions:[{label:'Open guided diagnosis',type:'link'}],checked:[`${statusLabel} exact-error tokens and symptom aliases`],notChecked:['Live system state, command output context, root cause, and production impact'],nextActions:['Open the journey and begin with the first read-only check.'],related:[diagnostic.path]};
}

export function analyzeInput(input, context='auto'){
  const trimmed=input.trim();
  const validContexts=new Set(['auto','symptom','command-output','configuration','reference']);
  if(!validContexts.has(context))context='auto';
  if(context==='reference')return {status:'ambiguous',kind:'reference-lookup',title:'Choose a supported lookup path',summary:'Reference context does not reinterpret this text as evidence. Search the reviewed indexes for an exact supported concept.',evidence:[],findings:[],actions:[{label:'Browse operational references',path:'/reference/'},{label:'Browse errors and symptoms',path:'/errors/'}],checked:['Context hint only'],notChecked:['Live systems, root cause, and unsupported free-form lookup'],nextActions:['Search for a command, error token, or operational concept.'],related:['/reference/','/errors/']};
  if(/^(?:#\s*syntax=.*\n)?\s*(?:ARG\s+[^\n]+\n)?\s*FROM\s+\S+/im.test(input)){const value=analyzeDockerfile(input);return {...value,evidence:[{signal:'dockerfile-from',source:'input',excerpt:'FROM instruction detected'},...(value.evidence||[])]};}
  const normalized=trimmed.toLowerCase().replace(/\s+/g,' ');
  const evidenceResult=interpretEvidence(input);
  if(context!=='symptom'&&context!=='configuration'&&['recognized','ambiguous'].includes(evidenceResult.status))return evidenceResult;
  if(context==='command-output')return {...evidenceResult,status:'unsupported',title:'Command output not recognized',summary:'The context hint narrowed analysis, but this output does not match a supported interpreter. It was not forced into a diagnosis.',nextActions:['Open the interpreter directory or browse troubleshooting by symptom.'],related:['/interpret/','/troubleshoot/']};
  const looksLikeMetaDiscussion=/\b(guide|documentation|docs|article|phrase|term|acronym)\b/.test(normalized) && normalized.split(/\s+/).length>3;
  const diagnostic=context!=='configuration'&&publishedJourneys.find(journey=>
    (!looksLikeMetaDiscussion && journey.exactErrors.some(token=>token.length>=6&&normalized.includes(token.toLowerCase()))) ||
    journey.aliases.some(alias=>normalized===alias.toLowerCase())
  );
  if(diagnostic)return buildDiagnosticDiscoveryResult(diagnostic,trimmed);
  const structured=detectAndAnalyze(input);if(structured){if(structured.classification?.kind)return {...structured,kind:structured.classification.kind,title:`${structured.title} · ${structured.classification.label}`,evidence:[...(structured.evidence||[]),{signal:'structured-classification',source:'parsed document',excerpt:structured.classification.evidence.join(', ')}]};return structured;}if(/^\d{1,3}(?:\.\d{1,3}){3}\/\d{1,2}$/.test(trimmed)){const value=calculateIPv4({cidr:trimmed});return value.status==='valid'?{...value,title:'IPv4 CIDR recognized',summary:`${value.address}/${value.prefix} belongs to network ${value.network}.`,evidence:[{signal:'exact-ipv4-cidr',source:'input',excerpt:trimmed}],findings:[],actions:[{label:'Open IPv4 calculator',type:'link'}],nextActions:['Open the IPv4 CIDR Calculator for full output.']}:value}if(/^[r-][w-][xSs-][r-][w-][xSs-][r-][w-][xTt-]$/.test(trimmed)){const value=analyzePermissions(trimmed);return{...value,title:'Symbolic Linux permissions recognized',evidence:[{signal:'nine-permission-positions',source:'input',excerpt:trimmed}],findings:[],actions:[],nextActions:['Open the Linux Permissions Calculator.']}}if(/^refs\/(heads|tags)\/.+/.test(trimmed)){const value=validateRef(trimmed,'full');return{...value,kind:'git-ref',summary:'This resembles a fully qualified Git ref. Repository resolution was not performed.',evidence:[{signal:'fully-qualified-ref',source:'input',excerpt:trimmed}],findings:value.diagnostics,actions:[],nextActions:['Open the Git Reference Toolkit.']}}
  const cron=analyzeCron(input);if(cron.status!=='invalid'||input.trim().split(/\s+/).length>=5)return cron;
  return {status:'unsupported',kind:'unknown',title:'Input was not recognized',summary:'The supplied text did not match the supported evidence, diagnostic symptoms, Dockerfile, Compose, Kubernetes, JSON, YAML, Cron, networking, Linux-permission, or Git-ref subsets.',evidence:[],findings:[],actions:[],checked:['Dockerfile signature check','JSON parse attempt','YAML parse attempt','Common five-field cron analysis'],notChecked:['Shell commands, logs, Jenkinsfiles, Terraform, live clusters/engines, and other planned domains'],nextActions:['Open the tools directory or try a supported example.']};
}
