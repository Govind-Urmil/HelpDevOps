export const technologies=['kubernetes','docker','linux','git','terraform'];
export const confidenceLevels=['High','Medium','Low','Insufficient evidence'];
export const safetyClasses=['Observe','Read-only','Low risk','Review required','Service impact','Destructive','Irreversible'];
export const maturityLevels={0:'Placeholder',1:'Recognition only',2:'Evidence and next action',3:'Remediation, verification and safety complete',4:'Versioned, extensively tested and deeply reviewed'};

export function createKnowledgeObject(seed,technology){
 const meta=technologyMetadata[technology];
 const id=`${technology}.${seed[0]}`;const [,family,title,indicators,contexts,exclusions,command,check,versionNote='No material difference is documented across the reviewed range.']=seed;
 return Object.freeze({
  id,technology,family,title,summary:`Recognize ${title.toLowerCase()} from corroborating ${technologyLabel(technology)} evidence before choosing a change.`,status:'reviewed',maturity:3,
  versions:meta.versions,reviewedAt:'2026-07-16',compatibility:`Reviewed against ${meta.versions}; vendor packaging and managed services may add different evidence.`,versionNotes:[versionNote],deprecations:[],
  recognition:{positive:indicators,requiredContext:contexts,exclusions,supportedInputs:['error or symptom','command output'],falsePositiveGuard:`Do not classify from “${indicators[0]}” alone without ${contexts.join(' or ')} context.`},
  assessment:{observed:`Evidence is consistent with ${title.toLowerCase()}.`,layer:family,confidenceBasis:'Corroborating indicators and required technology context; exclusions take precedence.',severity:'Context dependent',hypotheses:[title],alternatives:[`A neighboring ${family.toLowerCase()} issue may produce similar output.`],rejected:[]},
  investigation:{firstStep:`Collect the narrow read-only evidence needed to confirm ${title.toLowerCase()}.`,commands:[command],expectedSignals:[check],branches:[`If the expected signal is absent, inspect related ${family.toLowerCase()} evidence.`],missingEvidence:[...contexts]},
  action:{next:`Review the collected evidence and change only the confirmed layer.`,preconditions:['Confirm the target and preserve the original evidence.'],impact:'No state change from the first recommendation.',safety:'Read-only',verification:[check],recovery:['Stop if the target or scope is unclear.'],rollback:[],stopCriteria:['Escalate when evidence conflicts, access is unavailable, or a production change would be required.']},
  knowledge:{prevention:[`Monitor and review ${family.toLowerCase()} signals before releases.`],mistakes:['Treating a familiar phrase as proof of one root cause.'],relatedIssues:[],relatedTools:meta.tools,references:[meta.reference],limitations:['No live system access; provider-specific behavior and omitted evidence remain unknown.']}
 });
}

export const technologyLabel=value=>({kubernetes:'Kubernetes',docker:'Docker',linux:'Linux/systemd',git:'Git',terraform:'Terraform'}[value]||value);
export const technologyMetadata={
 kubernetes:{versions:'1.34–1.36',tools:['kubernetes-manifest'],reference:{title:'Kubernetes documentation',url:'https://kubernetes.io/docs/'}},
 docker:{versions:'Docker Engine 27–28; Compose 2.32–2.39',tools:['dockerfile','docker-compose'],reference:{title:'Docker documentation',url:'https://docs.docker.com/'}},
 linux:{versions:'Linux kernel 6.1–6.16; systemd 252–257',tools:['linux-permissions'],reference:{title:'systemd manual',url:'https://www.freedesktop.org/software/systemd/man/latest/'}},
 git:{versions:'Git 2.43–2.50',tools:['git-reference'],reference:{title:'Git documentation',url:'https://git-scm.com/docs'}},
 terraform:{versions:'Terraform CLI 1.9–1.13',tools:[],reference:{title:'Terraform documentation',url:'https://developer.hashicorp.com/terraform/docs'}}
};

export function validateKnowledgeObject(item){
 const errors=[];const need=(condition,message)=>{if(!condition)errors.push(`${item?.id||'unknown'}: ${message}`)};
 need(/^[a-z]+\.[a-z0-9-]+$/.test(item?.id||''),'invalid stable ID');need(technologies.includes(item?.technology),'unsupported technology');need(item?.family&&item?.title&&item?.summary,'identity fields missing');
 need(item?.status==='reviewed','released guidance must be reviewed');need(item?.maturity>=3,'reviewed guidance requires maturity 3 or 4');need(/^20\d\d-\d\d-\d\d$/.test(item?.reviewedAt||''),'invalid review date');need(item?.versions&&item?.compatibility&&item?.versionNotes?.length,'version metadata missing');
 need(item?.recognition?.positive?.length&&item?.recognition?.requiredContext?.length&&item?.recognition?.exclusions?.length,'recognition guards incomplete');need(item?.investigation?.commands?.length,'read-only first command missing');need(safetyClasses.includes(item?.action?.safety),'invalid safety class');need(['Observe','Read-only'].includes(item?.action?.safety),'first recommendation must be observation or read-only');
 need(item?.action?.verification?.length&&item?.action?.recovery?.length&&item?.action?.stopCriteria?.length,'action safety boundaries incomplete');need(item?.knowledge?.references?.some(ref=>/^https:\/\//.test(ref.url)),'official reference missing');need(item?.knowledge?.limitations?.length,'known limitation missing');
 const unsafe=/\b(kubectl\s+delete|docker\s+rm|git\s+reset\s+--hard|git\s+push\s+--force|terraform\s+force-unlock|terraform\s+state\s+rm|terraform\s+destroy|rm\s+-rf)\b/i;
 need(!item?.investigation?.commands?.some(command=>unsafe.test(command)),'unsafe first recommendation');return errors;
}
