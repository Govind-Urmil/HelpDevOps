import { z } from 'zod';

const ID=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const allowedNodeKinds=new Set(['question','check','interpretation','action','verification','completion','escalation']);
const terminalKinds=new Set(['completion','escalation']);
const stateChangingCommand=/\b(terraform\s+(?:apply|destroy|force-unlock|providers\s+lock)|kubectl\s+(?:apply|delete|patch|scale|rollout\s+(?:restart|undo))|docker\s+(?:rm|rmi|prune|restart|stop)|git\s+push\s+.*--force|systemctl\s+(?:start|stop|restart|enable|disable)|chmod|chown)\b/i;
const genericRollback='Restore the previous known-good state or configuration. Stop and escalate if impact increases.';

const commandSchema=z.object({command:z.string().min(1),purpose:z.string().min(1)}).strict();
const choiceSchema=z.object({id:z.string().regex(ID),label:z.string().min(1),nextNodeId:z.string().regex(ID)}).strict();
const nodeSchema=z.object({
  id:z.string().regex(ID),nodeKind:z.enum(['question','check','interpretation','action','verification','completion','escalation']),title:z.string().min(1),summary:z.string().min(1),risk:z.string().min(1),
  why:z.string().optional(),commands:z.array(commandSchema).optional(),choices:z.array(choiceSchema).optional(),prerequisites:z.array(z.string().min(1)).optional(),rollback:z.string().min(1).optional(),verification:z.array(z.string().min(1)).optional(),prevention:z.array(z.string().min(1)).optional()
}).strict();
const referenceSchema=z.object({id:z.string().regex(ID),title:z.string().min(1),url:z.url(),type:z.string().min(1)}).strict();
const exampleSchema=z.object({id:z.string().regex(ID),label:z.string().min(1),input:z.string().min(1),fixtureType:z.literal('synthetic'),containsRealEnvironmentData:z.literal(false),source:z.string().min(1),reviewedAt:z.string().min(1)}).strict();
const journeySchema=z.object({
  id:z.string().regex(ID),slug:z.string().regex(ID),domain:z.string().regex(ID),title:z.string().min(1),summary:z.string().min(1),aliases:z.array(z.string().min(1)).min(1),exactErrors:z.array(z.string().min(1)).min(1),status:z.enum(['reviewed','technical-review']),entryNodeId:z.string().regex(ID),reviewedAt:z.string().min(1),reviewDue:z.string().min(1),riskProfile:z.string().min(1),compatibility:z.object({technology:z.string().min(1),appliesGenerally:z.boolean(),reviewedAgainst:z.array(z.string().min(1)),limitations:z.array(z.string().min(1)).min(1)}).strict(),whatItDoesNotProve:z.array(z.string().min(1)).min(1),firstChecks:z.array(z.string().min(1)).min(1),relatedToolIds:z.array(z.string().min(1)),references:z.array(referenceSchema).min(1),nodes:z.array(nodeSchema).min(1),examples:z.array(exampleSchema).min(1),path:z.string().startsWith('/troubleshoot/').endsWith('/')
}).strict();

export function validateDiagnosticJourney(journey,{riskIds=[]}={}){
  const errors=[]; const nodeMap=new Map();
  const structural=journeySchema.safeParse(journey);
  if(!structural.success)for(const issue of structural.error.issues)errors.push(`${journey?.id||'journey'}: ${issue.path.join('.')||'root'} ${issue.message}`);
  if(!journey?.id||!ID.test(journey.id))errors.push('Journey id must be stable kebab-case.');
  if(!['reviewed','technical-review'].includes(journey?.status))errors.push(`${journey?.id||'journey'}: unsupported publication status.`);
  if(!journey?.entryNodeId)errors.push(`${journey?.id}: entryNodeId is required.`);
  if(!Array.isArray(journey?.references)||journey.references.length===0)errors.push(`${journey?.id}: authoritative references are required.`);
  if(!journey?.reviewedAt||!journey?.reviewDue)errors.push(`${journey?.id}: review dates are required.`);
  for(const node of journey?.nodes||[]){
    if(!node.id||!ID.test(node.id))errors.push(`${journey.id}: invalid node id ${node.id}.`);
    if(nodeMap.has(node.id))errors.push(`${journey.id}: duplicate node id ${node.id}.`); nodeMap.set(node.id,node);
    if(!allowedNodeKinds.has(node.nodeKind))errors.push(`${node.id}: unsupported node kind ${node.nodeKind}.`);
    if(!riskIds.includes(node.risk))errors.push(`${node.id}: unsupported risk ${node.risk}.`);
    if(!terminalKinds.has(node.nodeKind)&&!Array.isArray(node.choices))errors.push(`${node.id}: non-terminal nodes need choices.`);
    if(node.nodeKind==='question'&&!node.choices?.some(c=>['unknown','unclear','unsafe','none'].includes(c.id)))errors.push(`${node.id}: question needs an unknown/escalation option.`);
    if(node.nodeKind==='action'&&['moderate-risk','high-risk','expert-review-required'].includes(node.risk)&&!node.rollback)errors.push(`${node.id}: modifying higher-risk action requires rollback.`);
    if(node.nodeKind==='action'&&node.rollback===genericRollback)errors.push(`${node.id}: action requires a specific rollback.`);
    if(node.risk==='read-only'&&node.commands?.some(item=>stateChangingCommand.test(item.command)))errors.push(`${node.id}: state-changing command cannot be classified read-only.`);
    if(node.nodeKind==='verification'&&!node.verification?.length)errors.push(`${node.id}: verification criteria are required.`);
  }
  if(!nodeMap.has(journey.entryNodeId))errors.push(`${journey.id}: entry node does not exist.`);
  for(const node of nodeMap.values())for(const choice of node.choices||[])if(!nodeMap.has(choice.nextNodeId))errors.push(`${node.id}: broken next node ${choice.nextNodeId}.`);
  const seen=new Set(),stack=[journey.entryNodeId]; while(stack.length){const id=stack.pop();if(seen.has(id))continue;seen.add(id);for(const c of nodeMap.get(id)?.choices||[])stack.push(c.nextNodeId)}
  for(const id of nodeMap.keys())if(!seen.has(id))errors.push(`${journey.id}: unreachable node ${id}.`);
  const active=new Set(),finished=new Set();
  const findCycle=id=>{if(active.has(id))return true;if(finished.has(id)||!nodeMap.has(id))return false;active.add(id);for(const choice of nodeMap.get(id).choices||[])if(findCycle(choice.nextNodeId))return true;active.delete(id);finished.add(id);return false};
  if(findCycle(journey.entryNodeId))errors.push(`${journey.id}: journey graph contains a cycle.`);
  return [...new Set(errors)];
}
export function buildDiagnosticSearchIndex(journeys){return journeys.map(j=>({id:j.id,title:j.title,aliases:j.aliases,exactErrors:j.exactErrors,domain:j.domain,summary:j.summary,path:j.path,status:j.status,entryNodeId:j.entryNodeId}))}
