import {describe,it,expect} from 'vitest';
import {capabilityRegistry,invokeCapability,getCapability,WORKFLOWS} from '../src/core/capability-registry.js';
import {orchestrateInput} from '../src/core/analyze-input.js';
import {createInvestigationState,addFinding,importCapabilityResult,setVerification,investigationToBrief,isInvestigationState} from '../src/investigations/state.js';
import {connectedInvestigations} from '../src/investigations/registry.js';
import {tools} from '../src/config/tools.js';
import {analyzeCron} from '../src/tools/cron/analyzer.js';

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
});
