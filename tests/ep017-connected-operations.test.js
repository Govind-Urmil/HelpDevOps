import {describe,it,expect} from 'vitest';
import {capabilityRegistry,invokeCapability,getCapability,WORKFLOWS} from '../src/core/capability-registry.js';
import {orchestrateInput} from '../src/core/analyze-input.js';
import {createInvestigationState,addFinding,importCapabilityResult,applyBranchTransition,rebuildInvestigationState,normalizeInvestigationState,setVerification,investigationToBrief,isInvestigationState} from '../src/investigations/state.js';
import {connectedInvestigations} from '../src/investigations/registry.js';
import {publishedJourneys} from '../src/diagnostics/registry.js';
import {tools} from '../src/config/tools.js';
import {analyzeCron} from '../src/tools/cron/analyzer.js';
import {createWorkspace,validateWorkspace} from '../src/workspace/model.js';
import {createIncidentBrief} from '../src/incident-brief/brief.js';

const crashJourney=publishedJourneys.find(item=>item.id==='journey-kubernetes-crashloopbackoff');
const crashNodes=Object.fromEntries(crashJourney.nodes.map(node=>[node.id,node]));
const crashAnswer={nodeId:'crash-start',choiceId:'main',label:'Application or sidecar'};
const kubernetesManifest='apiVersion: v1\nkind: Pod\nmetadata:\n  name: api\nspec:\n  containers:\n    - name: api\n      image: nginx:1.27';

describe('EP-017 connected guided operations',()=>{
  it('keeps one complete capability entry for every available tool',()=>{
    expect(capabilityRegistry).toHaveLength(tools.length);expect(new Set(capabilityRegistry.map(x=>x.id)).size).toBe(tools.length);
    for(const item of capabilityRegistry){expect(item.inputKinds.length).toBeGreaterThan(0);expect(item.privacy).toEqual({processing:'browser-local',network:false,persistsAutomatically:false});expect(item.workflows).toContain('standalone');}
  });
  it('reuses the same cron analyzer for standalone and workflow execution',async()=>{
    const direct=analyzeCron('*/5 * * * *');const connected=await invokeCapability('cron',{text:'*/5 * * * *'},{workflow:'investigation'});
    expect(connected.raw).toEqual(direct);expect(connected.contractVersion).toBe(1);
  });
  it('enforces invocation policy and workflow support',async()=>{
    expect(getCapability('encoding-hash').invocationPolicy).toBe('confirmation-required');
    await expect(invokeCapability('encoding-hash',{text:'safe',operation:'base64-encode'},{workflow:'investigation'})).rejects.toThrow('explicit confirmation');
    expect(WORKFLOWS).toContain('incident-brief');
  });
  it.each([
    ['*/5 * * * *','recognized'],['{"service":"api"}','recognized'],['hello','unsupported-input']
  ])('reports a stable recognition state for %s',async(input,state)=>expect((await orchestrateInput(input)).recognitionState).toBe(state));
  it('imports structured findings and supports all finding transitions',async()=>{
    let state=createInvestigationState({id:'i-1',title:'Cron failure',journeyId:'journey-cron-job-not-running',originalEvidence:'job missed'});
    state=importCapabilityResult(state,await invokeCapability('cron',{text:'0 2 * * *'},{workflow:'investigation'}));
    for(const status of ['observed','confirmed','unknown','excluded'])state=addFinding(state,status,{id:'shared',label:status});
    state=setVerification(state,'verified',['Observed the next scheduled run.']);expect(isInvestigationState(state)).toBe(true);expect(state.findings.excluded[0].label).toBe('excluded');expect(state.stage).toBe('preserve');
    expect(investigationToBrief(state).verification).toContain('verified');
  });
  it('defines ten durable investigations and at least five embedded connected flows',()=>{
    expect(connectedInvestigations).toHaveLength(10);expect(connectedInvestigations.filter(x=>x.connected).length).toBeGreaterThanOrEqual(5);
    for(const item of connectedInvestigations)expect(item.loop).toEqual(['observe','scope','explain','test','act','verify','preserve']);
  });
  it('updates every applicable canonical field from a branch and destination node',()=>{
    const source=crashNodes[crashAnswer.nodeId],choice=source.choices.find(item=>item.id===crashAnswer.choiceId),destination=crashNodes[choice.nextNodeId];
    const state=applyBranchTransition(createInvestigationState({id:'crash',title:crashJourney.title,journeyId:crashJourney.id}),{sourceNode:source,choice,destinationNode:destination},'2026-07-18T00:00:00.000Z');
    expect(state.findings.observed.some(item=>item.label==='Application or sidecar')).toBe(true);
    expect(state.findings.confirmed.some(item=>item.label==='Application or sidecar')).toBe(true);
    expect(state.findings.unknown.some(item=>item.label===destination.title)).toBe(true);
    expect(state.findings.excluded.map(item=>item.label)).toEqual(expect.arrayContaining(['Init container','Unclear']));
    expect(state.verification.status).toBe('not-started');expect(state.unresolvedRisks).toHaveLength(1);expect(state.nextAction).toBe(destination.summary);
  });
  it('imports and de-duplicates embedded Kubernetes findings in canonical state',async()=>{
    let state=createInvestigationState({id:'crash',title:crashJourney.title,journeyId:crashJourney.id});const result=await invokeCapability('kubernetes-manifest',{text:kubernetesManifest},{workflow:'investigation'});
    state=importCapabilityResult(state,result);state=importCapabilityResult(state,result);
    expect(state.capabilityResults).toHaveLength(1);expect(state.findings.observed.filter(item=>item.source==='capability')).toHaveLength(5);
    expect(state.findings.observed.map(item=>item.value).join('\n')).toContain('no resource requests or limits');
    expect(state.findings.observed.map(item=>item.value).join('\n')).toContain('no readiness, liveness, or startup probe');
    expect(state.findings.observed.map(item=>item.value).join('\n')).toContain('runAsNonRoot is not explicitly true');
  });
  it('preserves canonical state through workspace serialization and conservative restoration',async()=>{
    let state=createInvestigationState({id:'crash',title:crashJourney.title,journeyId:crashJourney.id});state=importCapabilityResult(state,await invokeCapability('kubernetes-manifest',{text:kubernetesManifest},{workflow:'investigation'}));state=rebuildInvestigationState(state,[crashAnswer],crashNodes);
    const workspace=createWorkspace({id:'hotfix1',title:'CrashLoopBackOff',toolStates:[{toolId:crashJourney.id,toolSchemaVersion:1,input:{answers:JSON.stringify([crashAnswer]),investigationState:JSON.stringify(state),currentNodeId:'crash-evidence'},options:{entityType:'diagnostic-journey'},resultSnapshot:null}]});
    const restored=validateWorkspace(JSON.parse(JSON.stringify(workspace)));const input=restored.toolStates[0].input;const rebuilt=rebuildInvestigationState(normalizeInvestigationState(JSON.parse(input.investigationState)),JSON.parse(input.answers),crashNodes);
    expect({...rebuilt,updatedAt:state.updatedAt}).toEqual(state);expect(rebuilt.capabilityResults).toHaveLength(1);expect(rebuilt.findings.confirmed).toHaveLength(1);
  });
  it('generates Incident Brief fields from canonical state including capability findings',async()=>{
    let state=createInvestigationState({id:'crash',title:crashJourney.title,journeyId:crashJourney.id});state=importCapabilityResult(state,await invokeCapability('kubernetes-manifest',{text:kubernetesManifest},{workflow:'investigation'}));state=rebuildInvestigationState(state,[crashAnswer],crashNodes);const data=investigationToBrief(state);
    expect(data.observations).toContain('Capability: Kubernetes Manifest Analyzer');expect(data.observations).toContain('Validation status: recognized');expect(data.observations).toContain('no resource requests or limits');expect(data.observations.match(/no resource requests or limits/g)).toHaveLength(1);expect(data.observations).toContain('Application or sidecar');
    expect(data.verification).toContain('not-started');expect(data.riskNotes).toContain(crashNodes['crash-evidence'].title);expect(data.nextStep).toBe(crashNodes['crash-evidence'].summary);
  });
  it('does not duplicate branch findings after replay or restore',()=>{
    let state=createInvestigationState({id:'crash',title:crashJourney.title,journeyId:crashJourney.id});state=rebuildInvestigationState(state,[crashAnswer],crashNodes);state=rebuildInvestigationState(state,[crashAnswer],crashNodes);
    expect(state.findings.confirmed.filter(item=>item.id==='branch:crash-start:confirmed')).toHaveLength(1);expect(state.actions.filter(item=>item.id==='branch:crash-start:action')).toHaveLength(1);
  });
  it('removes stale branch state when navigating back or restarting',async()=>{
    let state=createInvestigationState({id:'crash',title:crashJourney.title,journeyId:crashJourney.id});state=importCapabilityResult(state,await invokeCapability('kubernetes-manifest',{text:kubernetesManifest},{workflow:'investigation'}));state=rebuildInvestigationState(state,[crashAnswer],crashNodes);state=rebuildInvestigationState(state,[],crashNodes);
    expect(state.findings.confirmed).toEqual([]);expect(state.findings.unknown).toEqual([]);expect(state.findings.excluded).toEqual([]);expect(state.unresolvedRisks).toEqual([]);expect(state.verification).toEqual({status:'not-started',checks:[]});expect(state.nextAction).toContain('server-side field validation');
  });
  it('keeps investigations without embedded capabilities deterministic',()=>{
    const journey=publishedJourneys.find(item=>item.id==='journey-linux-disk-full'),nodes=Object.fromEntries(journey.nodes.map(node=>[node.id,node])),source=nodes[journey.entryNodeId],choice=source.choices[0];
    const state=applyBranchTransition(createInvestigationState({id:'disk',title:journey.title,journeyId:journey.id}),{sourceNode:source,choice,destinationNode:nodes[choice.nextNodeId]});expect(state.capabilityResults).toEqual([]);expect(state.findings.confirmed[0].label).toBe(choice.label);
  });
  it('preserves Incident Brief raw-evidence privacy controls for canonical transfers',()=>{
    const data=investigationToBrief(createInvestigationState({id:'privacy',title:'Private incident',journeyId:'journey-linux-disk-full',originalEvidence:'safe summary'}));data.rawEvidence='secret raw evidence';
    expect(createIncidentBrief(data,'structured').rawEvidence).toBe('');expect(()=>createIncidentBrief(data,'raw')).toThrow(/acknowledge/);expect(createIncidentBrief(data,'raw',true).rawEvidence).toBe('secret raw evidence');
  });
});
