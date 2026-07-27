import {describe,it,expect} from 'vitest';
import {diagnosticJourneys,publishedJourneys} from '../src/diagnostics/registry.js';
import {validateDiagnosticJourney,buildDiagnosticSearchIndex} from '../src/diagnostics/validation.js';
import risks from '../src/diagnostics/config/risk-levels.json' with {type:'json'};

const options={riskIds:risks.map(item=>item.id)};
const clone=value=>JSON.parse(JSON.stringify(value));

describe('EP-010 diagnostic knowledge model',()=>{
  it('loads thirty reviewed or technical-review journeys',()=>{
    expect(publishedJourneys).toHaveLength(30);
    expect(publishedJourneys.every(item=>['reviewed','technical-review'].includes(item.status))).toBe(true);
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
    expect(candidate.title).toContain('Guidance with stated limitations');
    expect(candidate.summary).toContain('guidance with stated limitations');
    expect(candidate.checked[0]).toContain('Guidance with stated limitations');
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
  it('routes CrashLoopBackOff',()=>expect(analyzeInput('CrashLoopBackOff').kind).toBe('diagnostic:journey-kubernetes-crashloopbackoff'));
  it('routes Terraform lock errors',()=>expect(analyzeInput('Error acquiring the state lock').kind).toBe('diagnostic:journey-terraform-state-lock'));
  it('routes HTTP 502',()=>expect(analyzeInput('502 Bad Gateway').kind).toBe('diagnostic:journey-http-502'));
  it('routes systemd failures',()=>expect(analyzeInput('Failed to start example.service').kind).toBe('diagnostic:journey-linux-systemd-service-start'));
  it('does not choose a journey for an unrelated sentence',()=>expect(analyzeInput('please review this deployment later').kind).not.toMatch(/^diagnostic:/));
});


describe('EP-008 remediation regressions',()=>{
  const journey=id=>diagnosticJourneys.find(item=>item.id===id);
  const reachable=(item,startId)=>{
    const map=new Map(item.nodes.map(node=>[node.id,node]));
    const seen=new Set(),stack=[startId];
    while(stack.length){const id=stack.pop();if(seen.has(id))continue;seen.add(id);for(const choice of map.get(id)?.choices||[])stack.push(choice.nextNodeId)}
    return seen;
  };

  it('keeps local Terraform locks away from force-unlock',()=>{
    const item=journey('journey-terraform-state-lock');
    const start=item.nodes.find(node=>node.id==='tf-start');
    expect(start.choices.find(choice=>choice.id==='local').nextNodeId).toBe('tf-local');
    expect(reachable(item,'tf-local').has('tf-force')).toBe(false);
    expect(reachable(item,'tf-active').has('tf-force')).toBe(true);
  });

  it('does not route a standalone AWS conditional-write error to Terraform',()=>{
    expect(analyzeInput('ConditionalCheckFailedException').kind).not.toBe('diagnostic:journey-terraform-state-lock');
    expect(analyzeInput('Terraform state lock ConditionalCheckFailedException').kind).toBe('diagnostic:journey-terraform-state-lock');
  });

  it('keeps Docker cache deletion inside a high-risk action',()=>{
    const item=journey('journey-docker-disk-usage');
    const destructive=item.nodes.flatMap(node=>(node.commands||[]).filter(command=>/prune/.test(command.command)).map(command=>({node,command})));
    expect(destructive).toHaveLength(1);
    expect(destructive[0].node.id).toBe('dockdisk-cache-clean');
    expect(destructive[0].node.risk).toBe('high-risk');
  });

  it('does not route non-Docker host usage into Docker cleanup',()=>{
    const item=journey('journey-docker-disk-usage');
    const host=item.nodes.find(node=>node.id==='dockdisk-host');
    expect(host.choices.find(choice=>choice.id==='found').nextNodeId).toBe('dockdisk-host-followup');
    expect(reachable(item,'dockdisk-host-followup').has('dockdisk-clean')).toBe(false);
  });

  it('offers current and previous init-container logs conditionally',()=>{
    const item=journey('journey-kubernetes-crashloopbackoff');
    const node=item.nodes.find(candidate=>candidate.id==='crash-init');
    expect(node.commands.map(command=>command.command)).toEqual([
      'kubectl logs <pod> -n <namespace> -c <init-container>',
      'kubectl logs <pod> -n <namespace> -c <init-container> --previous'
    ]);
    expect(node.commands[1].purpose).toContain('when restart history exists');
  });
});


describe('EP-010 operational coverage regressions',()=>{
  const byId=id=>diagnosticJourneys.find(item=>item.id===id);
  const reachable=(item,start)=>{const map=new Map(item.nodes.map(n=>[n.id,n]));const seen=new Set(),stack=[start];while(stack.length){const id=stack.pop();if(seen.has(id))continue;seen.add(id);for(const c of map.get(id)?.choices||[])stack.push(c.nextNodeId)}return seen};
  it('adds six reviewed operational journeys',()=>{
    for(const id of ['journey-git-push-rejected','journey-jenkins-agent-offline','journey-networking-dns-resolution','journey-networking-connection-refused','journey-cron-job-not-running','journey-bash-execution-failure'])expect(byId(id)?.status).toBe('reviewed');
  });
  it('keeps Git normal integration separate from guarded history rewrite',()=>{const j=byId('journey-git-push-rejected');expect(reachable(j,'git-integrate').has('git-rewrite')).toBe(false);expect(j.nodes.find(n=>n.id==='git-rewrite').commands[0].command).toContain('--force-with-lease')});
  it('triages Jenkins offline reasons before launch method',()=>{
    const j=byId('journey-jenkins-agent-offline');
    const start=j.nodes.find(n=>n.id==='jenkins-start');
    expect(start.choices.map(c=>c.id)).toEqual(expect.arrayContaining(['manual','monitor','channel','launch','unknown']));
    expect(start.choices.find(c=>c.id==='manual').nextNodeId).toBe('jenkins-manual-offline');
    expect(start.choices.find(c=>c.id==='monitor').nextNodeId).toBe('jenkins-monitor-offline');
    expect(start.choices.find(c=>c.id==='channel').nextNodeId).toBe('jenkins-launch-method');
    expect(reachable(j,'jenkins-manual-offline').has('jenkins-auth')).toBe(false);
    expect(reachable(j,'jenkins-monitor-offline').has('jenkins-auth')).toBe(false);
    expect(j.nodes.find(n=>n.id==='jenkins-launch-method').choices.map(c=>c.id)).toEqual(expect.arrayContaining(['ssh','inbound','service','container','unknown']));
  });
  it('distinguishes DNS response classes',()=>{const ids=byId('journey-networking-dns-resolution').nodes.find(n=>n.id==='dns-start').choices.map(c=>c.id);expect(ids).toEqual(expect.arrayContaining(['nxdomain','servfail','timeout','wrong','context']))});
  it('does not recommend disabling firewall or binding broadly as a default',()=>{const text=JSON.stringify(byId('journey-networking-connection-refused'));expect(text).not.toMatch(/disable (the )?firewall/i);expect(text).not.toMatch(/bind.*0\.0\.0\.0 as/i)});
  it('separates cron launch from command failure',()=>{const ids=byId('journey-cron-job-not-running').nodes.find(n=>n.id==='cron-start').choices.map(c=>c.id);expect(ids).toEqual(expect.arrayContaining(['no','yes-fail','yes-ok']))});
  it('separates cron read-only inspection from temporary instrumentation',()=>{
    const j=byId('journey-cron-job-not-running');
    const observe=j.nodes.find(n=>n.id==='cron-observe');
    const instrument=j.nodes.find(n=>n.id==='cron-instrument');
    expect(observe.risk).toBe('read-only');
    expect(JSON.stringify(observe)).not.toMatch(/env\s*\|\s*sort/i);
    expect(observe.summary).toMatch(/interactive shell output is not cron execution evidence/i);
    expect(instrument.risk).not.toBe('read-only');
    expect(instrument.summary).toMatch(/selected non-sensitive environment/i);
    expect(JSON.stringify(instrument)).not.toMatch(/env\s*\|\s*sort/i);
    expect(instrument.rollback).toMatch(/remove the temporary diagnostic entry/i);
    expect(instrument.verification.join(' ')).toMatch(/removed/i);
  });
  it('never offers chmod 777 or disabling security controls as commands or actions',()=>{const j=byId('journey-bash-execution-failure');const commands=j.nodes.flatMap(n=>(n.commands||[]).map(c=>c.command));expect(commands.join(' ')).not.toMatch(/chmod\s+777/i);expect(j.nodes.filter(n=>n.nodeKind==='action').map(n=>n.title+' '+n.summary).join(' ')).not.toMatch(/disable (SELinux|AppArmor)/i)});
  it('routes strong reviewed signals conservatively',()=>{expect(analyzeInput('[rejected] main -> main (non-fast-forward) failed to push some refs').kind).toBe('diagnostic:journey-git-push-rejected');expect(analyzeInput('curl: (7) Connection refused').kind).toBe('diagnostic:journey-networking-connection-refused');expect(analyzeInput('Temporary failure in name resolution').kind).toBe('diagnostic:journey-networking-dns-resolution')});
  it('does not route generic operational words without context',()=>{
    for(const text of ['offline','Permission denied','rejected','This guide explains NXDOMAIN responses','The phrase command not found appears in documentation']){
      expect(analyzeInput(text).kind).not.toMatch(/^diagnostic:journey-(jenkins-agent-offline|bash-execution-failure|git-push-rejected|networking-dns-resolution)$/);
    }
  });
});
