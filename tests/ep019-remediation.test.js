import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  buildEvidenceBundles,
  buildInvestigationExport,
  clearInvestigationStorage,
  compareEvidence,
  createTimelineEntry,
  environmentGuidance,
  prioritizeJourneysForRole
} from '../src/investigations/experience.js';
import { publishedJourneys } from '../src/diagnostics/registry.js';
import { rankDiscovery } from '../src/references/discovery.js';
import { redactSensitiveContent } from '../src/workspace/sensitive-content.js';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

describe('EP-019 audit remediation', () => {
  it('uses one authoritative redactor for supported credential forms', () => {
    const input = [
      ['AWS', 'SECRET', 'ACCESS', 'KEY'].join('_') + '=top-' + 'secret',
      ['client', 'secret'].join('_') + '=oauth-' + 'secret',
      ['api', 'key'].join('_') + '=api-' + 'secret',
      'pass' + 'word=hunter2',
      'github' + '_pat_' + 'abcdefghijklmnopqrstuvwxyz123456',
      'Authorization: ' + 'Bearer ' + 'signed.token.value'
    ].join('\n');
    const direct = redactSensitiveContent(input);
    const exported = buildInvestigationExport({
      title: 'Credential test',
      timeline: [createTimelineEntry('observation', input)]
    }).text;
    for (const secret of ['top-secret', 'oauth-secret', 'api-secret', 'hunter2', 'github_pat_', 'signed.token.value']) {
      expect(direct).not.toContain(secret);
      expect(exported).not.toContain(secret);
    }
  });

  it('narrows all environment guidance dimensions without claiming certainty', () => {
    const result = environmentGuidance({ cloud: 'AWS', kubernetes: 'Amazon EKS', proxy: 'HTTP or HTTPS proxy', registry: 'Private registry' });
    for (const key of ['recommendations', 'commands', 'prerequisites', 'references', 'relatedLinks', 'branchTerms']) {
      expect(result[key].length).toBeGreaterThan(0);
    }
    expect(result.certainty).toContain('confirm');
  });

  it('changes first journey and ordering for each role', () => {
    const first = ['on-call', 'learning', 'incident', 'configuration'].map(role => prioritizeJourneysForRole(publishedJourneys, role)[0].id);
    expect(new Set(first).size).toBe(4);
  });

  it('provides four genuinely different export formats', () => {
    const input = { title: 'Incident', environment: { cloud: 'AWS' }, timeline: [createTimelineEntry('command', 'Copied command', 'kubectl get pods')] };
    const outputs = ['channel', 'ticket', 'markdown', 'transcript'].map(format => buildInvestigationExport({ ...input, format }).text);
    expect(new Set(outputs).size).toBe(4);
    expect(outputs[1]).toContain('TITLE:');
    expect(outputs[2]).toContain('# Incident');
    expect(outputs[3]).toContain('$ kubectl get pods');
  });

  it('clears every investigation-prefixed local key', () => {
    const values = new Map();
    const storage = {
      get length() { return values.size; },
      key(index) { return [...values.keys()][index] ?? null; },
      getItem(key) { return values.get(key) ?? null; },
      setItem(key, value) { values.set(key, value); },
      removeItem(key) { values.delete(key); }
    };
    for (const suffix of ['', '.feedback', '.context', '.comparison', '.resume', '.timeline']) {
      storage.setItem(`helpdevops.investigation.v1.demo${suffix}`, 'data');
    }
    storage.setItem('unrelated', 'keep');
    expect(clearInvestigationStorage(storage, 'demo')).toBe(true);
    expect(storage.length).toBe(1);
    expect(storage.getItem('unrelated')).toBe('keep');
  });

  it('builds copy-ready risk-grouped command bundles with prerequisites', () => {
    const bundles = buildEvidenceBundles(publishedJourneys.find(item => item.id === 'journey-kubernetes-image-pull-backoff'));
    expect(bundles['read-only'].length).toBeGreaterThan(0);
    expect(bundles['read-only'][0]).toMatchObject({ command: expect.any(String), permissions: expect.any(String) });
  });

  it('requires explicit criteria instead of string inequality for verification', () => {
    expect(compareEvidence('failed', 'healthy', [{ label: 'Probe succeeds', checked: false }]).status).toBe('comparison-ready');
    expect(compareEvidence('failed', 'healthy', [{ label: 'Probe succeeds', checked: true }]).status).toBe('criteria-confirmed');
  });

  it('finds exact errors, commands, HTTP statuses, exit codes, events, and Terraform errors', () => {
    for (const query of ['ImagePullBackOff', 'kubectl describe pod', 'HTTP 502', 'exit code 137', 'FailedScheduling', 'Failed to install provider']) {
      expect(rankDiscovery(query)[0]?.route).toMatch(/^\/troubleshoot\//);
    }
  });

  it('contains descriptive link rendering and no homepage literal newline artifact', () => {
    expect(read('src/components/UniversalInput.astro')).toContain('Open related troubleshooting guidance');
    expect(read('src/pages/index.astro')).not.toContain('`n');
  });

  it('contains no common mojibake in source-facing surfaces', () => {
    const combined = [
      read('src/pages/index.astro'),
      read('src/components/SearchDialog.astro'),
      read('src/components/UniversalInput.astro'),
      read('src/components/diagnostics/InvestigationWorkbench.astro')
    ].join('\n');
    const signatures = [
      String.fromCodePoint(0xc2, 0xb7),
      String.fromCodePoint(0xe2, 0x2020, 0x2019),
      String.fromCodePoint(0xe2, 0x20ac, 0x201d),
      String.fromCodePoint(0xc3, 0x201a, 0xc2, 0xb7)
    ];
    expect(signatures.some(signature => combined.includes(signature))).toBe(false);
  });
});
