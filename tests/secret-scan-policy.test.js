import {readFileSync} from 'node:fs';
import {describe,expect,it} from 'vitest';
import {analyzeInput} from '../src/core/analyze-input.js';
import independentCorpus from './fixtures/universal-input-independent.js';
import {
  normalizeEntryPath,
  sha256,
  validateCredentialContent,
  validateSecurityFixturePolicy
} from '../scripts/secret-scan-policy.mjs';

const readFixture=name=>readFileSync(new URL(`./fixtures/${name}`,import.meta.url),'utf8');
const syntheticSamples={
  aws:['AWS_SECRET_ACCESS_KEY','syntheticExampleValue123'].join('='),
  bearer:['Authorization:','Bearer','synthetic-token-value-123'].join(' '),
  privateKey:['-----BEGIN','PRIVATE KEY-----'].join(' '),
  github:['github','pat_synthetic_example_token_1234567890'].join('_'),
  assignment:['api','key: synthetic-example-value'].join('_')
};

describe('audited synthetic credential fixture policy',()=>{
  it('uses the same canonical fingerprint for LF and CRLF versions of an approved fixture',()=>{
    const lf=readFixture('universal-input-regression.json').replaceAll('\r\n','\n');
    expect(sha256(lf.replaceAll('\n','\r\n'))).toBe(sha256(lf));
  });

  it('accepts only the exact fingerprinted security corpora',()=>{
    expect(validateCredentialContent('tests/fixtures/universal-input-independent.js',readFixture('universal-input-independent.js'))).toEqual([]);
    expect(validateCredentialContent('tests/fixtures/universal-input-regression.json',readFixture('universal-input-regression.json'))).toEqual([]);
  });

  it.each(Object.entries(syntheticSamples))('rejects an unapproved %s pattern',(_name,sample)=>{
    expect(validateCredentialContent('tests/unapproved-fixture.js',sample)).not.toEqual([]);
  });

  it('rejects extra content and renamed copies of an approved fixture',()=>{
    const approved=readFixture('universal-input-independent.js');
    expect(validateCredentialContent('tests/fixtures/universal-input-independent.js',`${approved}\n${syntheticSamples.github}`)).not.toEqual([]);
    expect(validateCredentialContent('tests/fixtures/renamed-independent.js',approved)).not.toEqual([]);
    expect(validateCredentialContent('tests/anything.js',syntheticSamples.bearer)).not.toEqual([]);
  });

  it('fails closed for unsafe paths and malformed policies',()=>{
    expect(()=>normalizeEntryPath('../tests/fixtures/universal-input-independent.js')).toThrow(/Unsafe secret-scan path/);
    expect(validateSecurityFixturePolicy({'tests/fixture.js':{reason:'short',sha256:'invalid',expected:{}}})).not.toEqual([]);
  });

  it('keeps every approved independent sensitive case active',()=>{
    const sensitiveCases=independentCorpus.filter(item=>item.expectedResultType==='SENSITIVE_CONTENT');
    expect(sensitiveCases).toHaveLength(10);
    for(const testCase of sensitiveCases)expect(analyzeInput(testCase.input).resultType).toBe('SENSITIVE_CONTENT');
  });
});