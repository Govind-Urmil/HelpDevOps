import {describe, it, expect} from 'vitest';
import {publishedReferences} from '../src/references/registry.js';
import {errorEntries, rankDiscovery, discoveryIndex} from '../src/references/discovery.js';
import {relatedForReference} from '../src/references/relations.js';

describe('EP-011 references and discovery', () => {
  it('publishes fourteen complete references', () => {
    expect(publishedReferences).toHaveLength(14);
    for (const reference of publishedReferences) {
      expect(reference.status).toBe('reviewed');
      expect(reference.concepts.length).toBeGreaterThan(0);
      expect(reference.limitations.length).toBeGreaterThan(0);
      expect(reference.references.length).toBeGreaterThan(0);
    }
  });

  it.each([
    ['pod pending', 'Kubernetes Pod remains Pending'],
    ['df -i', 'How to read df disk-usage output'],
    ['failed to push some refs', 'Git push rejected or non-fast-forward'],
    ['502', 'HTTP 502 Bad Gateway'],
    ['cron path', 'Cron execution environment']
  ])('ranks %s', (query, title) => expect(rankDiscovery(query)[0].title).toBe(title));

  it('keeps generic signals non-diagnostic', () => {
    for (const query of ['failed', 'offline', 'status', 'lock', 'permission']) {
      expect(rankDiscovery(query)[0]?.score || 0).toBeLessThan(90);
    }
  });

  it('does not match short query tokens inside unrelated words', () => {
    expect(rankDiscovery('lock').map(result => result.title)).not.toContain('Filesystem blocks versus inodes');
    expect(rankDiscovery('lock').map(result => result.title)).not.toContain('How to read df disk-usage output');
    expect(rankDiscovery('port').map(result => result.title)).not.toContain('Transport troubleshooting');
  });

  it('normalizes equivalent case and spacing consistently', () => {
    expect(rankDiscovery('CrashLoopBackOff')[0].id).toBe(rankDiscovery(' crashloopbackoff ')[0].id);
    expect(rankDiscovery('502 Bad Gateway')[0].id).toBe(rankDiscovery('502   bad gateway')[0].id);
  });

  it('generates canonical error entries from reviewed truth', () => {
    expect(errorEntries.length).toBeGreaterThan(20);
    expect(errorEntries.every(entry => entry.route.startsWith('/troubleshoot/'))).toBe(true);
    const keys = errorEntries.map(entry => `${entry.journeyId}:${entry.normalizedTerm}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('makes exact errors override equivalent symptom aliases', () => {
    const signal = errorEntries.find(entry => entry.normalizedTerm === '502 bad gateway');
    expect(signal?.kind).toBe('exact-error');
    expect(errorEntries.filter(entry => entry.journeyId === signal.journeyId && entry.normalizedTerm === signal.normalizedTerm)).toHaveLength(1);
  });

  it('uses globally unique discovery IDs', () => {
    const ids = discoveryIndex.map(item => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('connects every reference to real destinations', () => {
    for (const reference of publishedReferences) expect(relatedForReference(reference).length).toBeGreaterThan(0);
  });

  it('indexes all supported types', () => {
    expect(new Set(discoveryIndex.map(item => item.type))).toEqual(new Set(['TOOL', 'DIAGNOSTIC', 'INTERPRETER', 'REFERENCE', 'ERROR', 'HUB']));
  });
});
