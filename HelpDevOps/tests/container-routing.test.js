import {describe,it,expect} from 'vitest';
import {analyzeInput} from '../src/core/analyze-input.js';
describe('EP-006 Universal Input routing classifications',()=>{
 it('recognizes Dockerfile before generic text',()=>expect(analyzeInput('FROM alpine:3.21\nUSER 1000').kind).toBe('dockerfile'));
 it('recognizes Compose YAML',()=>expect(analyzeInput('services:\n  web:\n    image: nginx:1.27').kind).toBe('compose'));
 it('recognizes Kubernetes YAML',()=>expect(analyzeInput('apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: x').kind).toBe('kubernetes'));
 it('does not mistake ordinary FROM prose for a Dockerfile',()=>expect(analyzeInput('A note from the operator').kind).not.toBe('dockerfile'));
});
