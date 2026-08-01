import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { diagnosticJourneys, publishedJourneys } from '../src/diagnostics/registry.js';
import { normalizeEvidenceInput, LIMITS } from '../src/core/evidence/normalize.js';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const allNodes = diagnosticJourneys.flatMap(journey => journey.nodes.map(node => ({ journey, node })));

describe('EP-023 final production hardening', () => {
  it('keeps the feature-complete inventory at 37 investigations', () => {
    expect(publishedJourneys).toHaveLength(37);
  });

  it('has no generic rollback and every modifying action is recoverable', () => {
    const actions = allNodes.filter(({ node }) => node.nodeKind === 'action');
    for (const { node } of actions) {
      expect(node.prerequisites?.length).toBeGreaterThan(0);
      expect(node.rollback).toBeTruthy();
      expect(node.rollback).not.toBe('Restore the previous known-good state or configuration. Stop and escalate if impact increases.');
    }
  });

  it('classifies Terraform lock-file generation as a reviewed modifying action', () => {
    const commands = allNodes.flatMap(({ node }) => (node.commands || []).map(command => ({ node, command })));
    const lock = commands.filter(({ command }) => /terraform providers lock/.test(command.command));
    expect(lock).toHaveLength(1);
    expect(lock[0].node.risk).toBe('moderate-risk');
    expect(lock[0].node.rollback).toContain('.terraform.lock.hcl');
  });

  it('ties force-with-lease to an explicitly reviewed remote SHA', () => {
    const journey = diagnosticJourneys.find(item => item.id === 'journey-git-push-rejected');
    const command = journey.nodes.flatMap(node => node.commands || []).find(item => item.command.includes('--force-with-lease'));
    expect(command.command).toContain('git fetch');
    expect(command.command).toContain('git rev-parse');
    expect(command.command).toContain('--force-with-lease=refs/heads/<branch>:<expected-remote-sha>');
  });

  it('normalizes terminal control sequences and line endings without corrupting Unicode', () => {
    const result = normalizeEvidenceInput('\u001b[31mERROR\u001b[0m\r\n\tPod café → failed\rnext');
    expect(result).toEqual({ ok:true, text:'ERROR\n\tPod café → failed\nnext', lines:['ERROR', '\tPod café → failed', 'next'] });
  });

  it('rejects oversized evidence before parsing', () => {
    expect(normalizeEvidenceInput('x'.repeat(LIMITS.maxBytes + 1))).toEqual({ ok:false, reason:'Input exceeds the 64 KB evidence limit.' });
  });

  it('derives homepage counts, fixes singular grammar, and preserves conservative typo search', () => {
    expect(read('src/pages/index.astro')).toContain('publishedJourneys.length');
    expect(read('src/pages/troubleshoot/index.astro')).toContain("journey.nodes.length === 1 ? 'node' : 'nodes'");
    const ui = read('public/scripts/ui.js');
    expect(ui).toContain("kubernets:'kubernetes'");
    expect(ui).toContain("terrafrom:'terraform'");
    expect(ui).toContain("imagepullbackof:'imagepullbackoff'");
    expect(ui).toContain('No approximate result was fabricated.');
  });

  it('keeps production smoke assertions aligned with the current brand and HSTS contract', () => {
    const smoke = read('scripts/production-smoke.mjs');
    expect(smoke).toContain('class="brand-mark"');
    expect(smoke).toContain("'strict-transport-security'");
  });
});
