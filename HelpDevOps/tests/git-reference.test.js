import { describe, it, expect } from 'vitest';
import { validateRef, suggestRef, explainRevision } from '../src/tools/git-reference/analyzer.js';
describe('Git reference toolkit', () => {
  it.each(['feature/add-login','release/v1.2.0','bugfix/issue-123','v1.0.0'])('accepts valid name %s', (value) => expect(validateRef(value).status).toBe('valid'));
  it('accepts a fully qualified ref in full context', () => expect(validateRef('refs/heads/main','full').status).toBe('valid'));
  it('rejects HEAD as a branch name', () => expect(validateRef('HEAD','branch')).toMatchObject({status:'invalid'}));
  it('preserves HEAD as revision syntax', () => expect(explainRevision('HEAD')).toMatchObject({status:'recognized',title:'HEAD'}));
  it('does not apply the branch-only HEAD restriction to tag context', () => expect(validateRef('HEAD','tag').status).toBe('valid'));
  it.each(['-bad','.hidden/name','bad..name','bad@{name','name.lock','bad.','bad/','bad//name','bad name','bad\\name'])('rejects %s', (value) => expect(validateRef(value).status).toBe('invalid'));
  it('rejects control characters', () => expect(validateRef('bad\u0001name').status).toBe('invalid'));
  it.each([['HEAD','HEAD'],['HEAD~2','ref-relative expression'],['HEAD^','ref-relative expression'],['main~3','ref-relative expression'],['main..feature','two-dot range'],['main...feature','symmetric range'],['refs/heads/main','fully qualified ref'],['abc1234','object-like hexadecimal token'],['main','simple ref name']])('explains %s', (value, type) => expect(explainRevision(value).title).toBe(type));
  it('leaves complex unsupported syntax unsupported', () => expect(explainRevision('main^{tree}').status).toBe('unsupported'));
  it('preserves original input and case in a suggestion', () => { const result=suggestRef(' Feature  Name// '); expect(result.original).toBe(' Feature  Name// '); expect(result.suggestion).toBe('Feature-Name'); });
  it('lowercases only by explicit request', () => expect(suggestRef('Feature/Name',{lowercase:true}).suggestion).toBe('feature/name'));
  it('does not claim repository resolution', () => expect(explainRevision('HEAD').summary).toMatch(/resolution was not performed/));
});
