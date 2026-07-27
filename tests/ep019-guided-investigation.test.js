import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  roleStartingPoints, normalizeEnvironmentContext, narrowGuidance, commandPrerequisites,
  compareEvidence, createTimelineEntry, normalizeTimeline, redactForHandoff,
  buildInvestigationExport, BRANCH_FEEDBACK
} from '../src/investigations/experience.js';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

describe('EP-019 guided investigation experience', () => {
  it('provides four role-based starts without duplicate content systems', () => {
    expect(roleStartingPoints.map(item => item.id)).toEqual(['on-call', 'learning', 'incident', 'configuration']);
    expect(roleStartingPoints.every(item => item.href.startsWith('/'))).toBe(true);
  });

  it('normalizes optional environment context and only narrows matching guidance', () => {
    const context = normalizeEnvironmentContext({ cloud: 'AWS', versions: 'Terraform 1.11', ignored: 'x' });
    expect(context).toMatchObject({ cloud: 'AWS', versions: 'Terraform 1.11' });
    expect(narrowGuidance([{ id: 'general' }, { id: 'aws', environments: { cloud: ['AWS'] } }, { id: 'gcp', environments: { cloud: ['GCP'] } }], context).map(item => item.id)).toEqual(['general', 'aws']);
  });

  it('derives command risk, placeholders, prerequisites, and expected evidence', () => {
    const meta = commandPrerequisites({ command: 'kubectl get pod <pod> -n <namespace>', purpose: 'Read Pod state.' }, 'read-only');
    expect(meta.risk).toBe('read-only');
    expect(meta.placeholders).toEqual(['<pod>', '<namespace>']);
    expect(meta.permissions).toBeTruthy();
    expect(meta.expectedEvidence).toBeTruthy();
  });

  it('requires before and after evidence without claiming recovery', () => {
    expect(compareEvidence('', 'healthy').status).toBe('incomplete');
    const result = compareEvidence('failed', 'ready', ['Probe succeeds']);
    expect(result.status).toBe('comparison-ready');
    expect(result.reminder).toContain('not proof');
  });

  it('normalizes a bounded timeline and supports local feedback values', () => {
    const entry = createTimelineEntry('evidence', 'Observed timeout');
    expect(normalizeTimeline([entry])).toHaveLength(1);
    expect(BRANCH_FEEDBACK).toEqual(['solved', 'did-not-solve', 'missing-scenario', 'guidance-outdated']);
  });

  it('redacts credential-like content in handoff exports', () => {
    expect(redactForHandoff('Authorization: Bearer abc.def.ghi').text).toContain('[REDACTED]');
    expect(redactForHandoff('token=super-secret-value').text).not.toContain('super-secret-value');
    const exported = buildInvestigationExport({ title: 'API incident', timeline: [createTimelineEntry('observation', 'token=secret-value')] });
    expect(exported.reviewRequired).toBe(true);
    expect(exported.text).toContain('[REDACTED]');
  });

  it('uses progressive disclosure, mobile progress, human links, local resume and feedback', () => {
    const result = read('src/components/results/AnalysisResult.astro');
    const workbench = read('src/components/diagnostics/InvestigationWorkbench.astro');
    const route = read('src/pages/troubleshoot/[domain]/[slug].astro');
    expect(result).toContain('<summary>Why this result?</summary>');
    expect(workbench).toContain('data-current-step-bar');
    expect(read('src/investigations/experience.js')).toContain('helpdevops.investigation');
    expect(workbench).toContain('Feedback recorded locally');
    expect(route).toContain('<Breadcrumbs');
  });

  it('migrates GitHub Actions to v5 without changing Node 22', () => {
    const workflow = read('.github/workflows/quality.yml');
    expect(workflow).toContain('actions/checkout@v5');
    expect(workflow).toContain('actions/setup-node@v5');
    expect(workflow).toContain('node-version: 22');
    expect(workflow).not.toMatch(/actions\/(?:checkout|setup-node)@v4/);
  });
});
