import {describe,it,expect} from 'vitest';
import {diagnosticJourneys,publishedJourneys} from '../src/diagnostics/registry.js';
import {validateDiagnosticJourney,buildDiagnosticSearchIndex} from '../src/diagnostics/validation.js';
import risks from '../src/diagnostics/config/risk-levels.json' with {type:'json'};

const options={riskIds:risks.map(item=>item.id)};
const clone=value=>JSON.parse(JSON.stringify(value));

describe('EP-007 diagnostic knowledge model',()=>{
  it('loads exactly three independently reviewed pilot journeys',()=>{
    expect(publishedJourneys).toHaveLength(3);
    expect(publishedJourneys.every(item=>item.status==='reviewed')).toBe(true);
    expect(publishedJourneys.map(item=>item.id)).toEqual([
      'journey-linux-disk-full','journey-docker-container-exits','journey-kubernetes-pod-pending'
    ]);
  });
  it.each(diagnosticJourneys.map(item=>[item.id,item]))('%s passes semantic validation',(_,journey)=>{
    expect(validateDiagnosticJourney(journey,options)).toEqual([]);
  });
  it('rejects a broken relationship',()=>{
    const journey=clone(diagnosticJourneys[0]);journey.nodes[0].choices[0].nextNodeId='missing-node';
    expect(validateDiagnosticJourney(journey,options).join('\n')).toContain('broken next node');
  });
  it('rejects an unreachable node',()=>{
    const journey=clone(diagnosticJourneys[0]);journey.nodes.push({id:'orphan-node',nodeKind:'completion',title:'Orphan',risk:'read-only'});
    expect(validateDiagnosticJourney(journey,options).join('\n')).toContain('unreachable node');
  });
  it('rejects a question without an unclear path',()=>{
    const journey=clone(diagnosticJourneys[0]);journey.nodes[0].choices=journey.nodes[0].choices.filter(item=>item.id!=='unknown');
    expect(validateDiagnosticJourney(journey,options).join('\n')).toContain('unknown/escalation option');
  });
  it('rejects a higher-risk action without rollback',()=>{
    const journey=clone(diagnosticJourneys[0]);const action=journey.nodes.find(item=>item.nodeKind==='action');delete action.rollback;
    expect(validateDiagnosticJourney(journey,options).join('\n')).toContain('requires rollback');
  });
  it('rejects a verification node without criteria',()=>{
    const journey=clone(diagnosticJourneys[0]);const node=journey.nodes.find(item=>item.nodeKind==='verification');delete node.verification;
    expect(validateDiagnosticJourney(journey,options).join('\n')).toContain('verification criteria');
  });
  it('builds a compact discoverable search index',()=>{
    const index=buildDiagnosticSearchIndex(diagnosticJourneys);
    expect(index.find(item=>item.id==='journey-kubernetes-pod-pending').exactErrors).toContain('FailedScheduling');
    expect(index.every(item=>!('nodes' in item))).toBe(true);
  });
  it('all modifying actions have prerequisites and rollback',()=>{
    for(const journey of diagnosticJourneys)for(const node of journey.nodes.filter(item=>item.nodeKind==='action')){
      expect(node.prerequisites?.length).toBeGreaterThan(0);expect(node.rollback).toBeTruthy();
    }
  });
  it('all fixtures are synthetic and exclude real environment data',()=>{
    for(const journey of diagnosticJourneys)for(const fixture of journey.examples){expect(fixture.fixtureType).toBe('synthetic');expect(fixture.containsRealEnvironmentData).toBe(false)}
  });
});

import {analyzeInput,buildDiagnosticDiscoveryResult} from '../src/core/analyze-input.js';
describe('diagnostic discovery',()=>{
  it('derives discovery wording from candidate and reviewed statuses',()=>{
    const base={id:'journey-test',title:'Test journey',path:'/troubleshoot/test/example/'};
    const candidate=buildDiagnosticDiscoveryResult({...base,status:'technical-review'},'example symptom');
    expect(candidate.title).toContain('Technical review candidate');
    expect(candidate.summary).toContain('technical-review candidate');
    expect(candidate.checked[0]).toContain('Technical review candidate');
    expect(candidate.title).not.toContain('Reviewed diagnostic');
    const reviewed=buildDiagnosticDiscoveryResult({...base,status:'reviewed'},'example symptom');
    expect(reviewed.title).toContain('Reviewed diagnostic journey');
    expect(reviewed.summary).toContain('reviewed symptom or error entry');
    expect(reviewed.checked[0]).toContain('Reviewed exact-error');
  });

  it('routes stable Kubernetes scheduling evidence to the reviewed journey',()=>{
    const result=analyzeInput('Warning FailedScheduling: 0/3 nodes are available: 3 Insufficient memory.');
    expect(result.kind).toBe('diagnostic:journey-kubernetes-pod-pending');
    expect(result.summary).toContain('does not prove one root cause');
  });
  it('routes a stable disk error to the Linux journey',()=>expect(analyzeInput('write failed: No space left on device').kind).toBe('diagnostic:journey-linux-disk-full'));
  it('does not choose a journey for an unrelated sentence',()=>expect(analyzeInput('please review this deployment later').kind).not.toMatch(/^diagnostic:/));
});
