import resources from './resources.json';

const KNOWN=new Set(['ADD','ARG','CMD','COPY','ENTRYPOINT','ENV','EXPOSE','FROM','HEALTHCHECK','LABEL','MAINTAINER','ONBUILD','RUN','SHELL','STOPSIGNAL','USER','VOLUME','WORKDIR']);
const redact=value=>value.replace(/(password|secret|token|api[_-]?key)\s*=\s*([^\s]+)/ig,'$1=••••');
function logicalLines(raw){const out=[];let current='';let start=1;raw.replace(/^\uFEFF/,'').split(/\r?\n/).forEach((line,index)=>{const trimmed=line.trimEnd();if(!current)start=index+1;current+=(current?' ':'')+trimmed.replace(/\\\s*$/,'').trim();if(!/\\\s*$/.test(trimmed)){if(current.trim()&&!current.trimStart().startsWith('#'))out.push({line:start,text:current.trim()});current='';}});if(current.trim())out.push({line:start,text:current.trim()});return out;}
function imageConcern(image){if(image==='scratch'||image.includes('@sha256:'))return null;const last=image.split('/').at(-1);if(!last.includes(':'))return 'Base image has no explicit tag or digest.';if(last.endsWith(':latest'))return 'Base image uses the mutable latest tag.';return null;}
export function analyzeDockerfile(raw){
  const input=raw.replace(/^\uFEFF/,'');
  const base={kind:'dockerfile',evidence:[],findings:[],actions:[{label:'Review findings before building the image',type:'review'}],checked:['Instruction structure','Build stages and base-image references','User declaration','Common secret-like ARG/ENV patterns','Selected Dockerfile safety and maintainability signals'],notChecked:resources.limitations,references:resources.references,nextActions:['Build and test the image in an isolated environment.','Use Docker Build checks and your image scanner for deeper validation.']};
  if(!input.trim())return {...base,status:'invalid',title:'No Dockerfile supplied',summary:'Paste Dockerfile instructions to inspect.',actions:[],nextActions:['Load an example or paste a Dockerfile.']};
  if(new Blob([input]).size>262144)return {...base,status:'unsupported',title:'Dockerfile is larger than 256 KB',summary:'Reduce the input size before local inspection.',actions:[]};
  const lines=logicalLines(input),instructions=[];const errors=[];
  for(const item of lines){const match=/^([A-Za-z]+)(?:\s+|$)([\s\S]*)$/.exec(item.text);if(!match){errors.push(`Line ${item.line}: instruction could not be parsed.`);continue;}const op=match[1].toUpperCase();instructions.push({...item,op,args:match[2].trim()});if(!KNOWN.has(op))errors.push(`Line ${item.line}: unknown or unsupported instruction ${op}.`);}
  const from=instructions.filter(x=>x.op==='FROM');if(!from.length)errors.push('No FROM instruction was found.');for(const item of from)if(!item.args)errors.push(`Line ${item.line}: FROM requires an image reference.`);const firstFrom=instructions.findIndex(x=>x.op==='FROM');if(firstFrom>0)for(const item of instructions.slice(0,firstFrom))if(item.op!=='ARG')errors.push(`Line ${item.line}: only ARG may appear before the first FROM instruction.`);
  const findings=[];
  for(const item of from){const image=item.args.replace(/^--platform=\S+\s+/,'').split(/\s+AS\s+/i)[0].trim();const concern=imageConcern(image);if(concern)findings.push(`Line ${item.line}: ${concern} (${image})`);}
  const users=instructions.filter(x=>x.op==='USER');if(!users.length)findings.push('No USER instruction was found; the final image may run with its base-image default user.');else{const final=users.at(-1).args.toLowerCase();if(['0','root','0:0','root:root'].includes(final))findings.push(`Line ${users.at(-1).line}: final USER is explicitly root.`);}
  for(const item of instructions){
    if(['ARG','ENV'].includes(item.op)&&/(password|passwd|secret|token|api[_-]?key|private[_-]?key)/i.test(item.args))findings.push(`Line ${item.line}: ${item.op} contains a secret-like name or value (${redact(item.args).slice(0,120)}). Build arguments and environment layers are not secret storage.`);
    if(item.op==='ADD'&&/^https?:\/\//i.test(item.args))findings.push(`Line ${item.line}: remote URL ADD reduces source verification clarity; prefer an explicit verified download step when appropriate.`);
    if(['CMD','ENTRYPOINT'].includes(item.op)&&item.args&&!item.args.trimStart().startsWith('['))findings.push(`Line ${item.line}: ${item.op} uses shell form; verify signal handling and argument behavior.`);
    if(item.op==='RUN'&&/apt-get\s+update/i.test(item.args)&&!(/apt-get\s+install/i.test(item.args)))findings.push(`Line ${item.line}: apt-get update is not paired with install in the same build step, which can create stale cache behavior.`);
  }
  const stages=from.length;const hasHealth=instructions.some(x=>x.op==='HEALTHCHECK');
  const evidence=[{signal:'instruction-count',source:'input',excerpt:`${instructions.length} logical instruction(s)`},{signal:'build-stages',source:'input',excerpt:`${stages} FROM stage(s)`},{signal:'healthcheck',source:'input',excerpt:hasHealth?'HEALTHCHECK present':'No HEALTHCHECK instruction'}];
  if(errors.length)return {...base,status:'invalid',title:'Dockerfile structure needs attention',summary:`${errors.length} structural problem(s) found.`,evidence,findings:[...errors,...findings],actions:[],nextActions:['Correct structural errors before attempting a build.']};
  return {...base,status:findings.length?'valid-with-notes':'valid',title:'Dockerfile inspected',summary:`${instructions.length} instruction(s), ${stages} stage(s), ${findings.length} review note(s). This is static inspection, not a Docker build.`,evidence,findings};
}
