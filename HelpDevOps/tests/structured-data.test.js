import {describe,it,expect} from 'vitest';import {analyzeJson,analyzeYaml,detectAndAnalyze} from '../src/tools/structured-data/analyzer.js';
describe('structured data analyzer',()=>{
  it.each(['{}','[]','"value"','42','true','null'])('parses JSON %s',input=>expect(analyzeJson(input).status).toBe('valid-with-notes'));
  it('formats JSON',()=>expect(analyzeJson('{"a":1}').formatted).toContain('\n'));
  it('reports invalid JSON',()=>expect(analyzeJson('{a:1}').status).toBe('invalid'));
  it.each(['name: api','- one\n- two','enabled: true\ncount: 2'])('parses YAML',input=>expect(analyzeYaml(input).status).toBe('valid-with-notes'));
  it('detects multi-document YAML',()=>expect(analyzeYaml('a: 1\n---\nb: 2').summary).toContain('2 document'));
  it('classifies Compose-like YAML',()=>expect(analyzeYaml('services:\n  web:\n    image: nginx').classification.kind).toBe('compose'));
  it('classifies Kubernetes-like YAML',()=>expect(analyzeYaml('apiVersion: v1\nkind: Pod\nmetadata:\n  name: x').classification.kind).toBe('kubernetes'));
  it('reports malformed YAML',()=>expect(analyzeYaml('a:\n  b: 1\n c: 2').status).toBe('invalid'));
  it('prefers JSON when JSON is valid',()=>expect(detectAndAnalyze('{"a":1}').kind).toBe('json'));
  it('enforces the input size limit',()=>expect(detectAndAnalyze('x'.repeat(262145)).status).toBe('unsupported'));
});
