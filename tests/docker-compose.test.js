import {describe,it,expect} from 'vitest';
import {analyzeCompose} from '../src/tools/docker-compose/analyzer.js';
describe('Docker Compose analyzer',()=>{
 it('accepts services mapping',()=>{const r=analyzeCompose('services:\n  web:\n    image: nginx:1.27-alpine');expect(r.status).toMatch(/valid/);expect(r.summary).toMatch(/1 service/)});
 it('requires services',()=>expect(analyzeCompose('networks: {}').status).toBe('invalid'));
 it('notes obsolete version',()=>expect(analyzeCompose("version: '3.8'\nservices:\n  web:\n    image: nginx:1.27").findings.join(' ')).toMatch(/obsolete/));
 it('flags privileged and socket mount',()=>{const r=analyzeCompose('services:\n  x:\n    image: alpine:3\n    privileged: true\n    volumes:\n      - /var/run/docker.sock:/var/run/docker.sock');expect(r.findings.join(' ')).toMatch(/privileged/);expect(r.findings.join(' ')).toMatch(/Docker socket/)});
 it('flags literal secret-like environment',()=>expect(analyzeCompose('services:\n  x:\n    image: alpine:3\n    environment:\n      API_TOKEN: demo').findings.join(' ')).toMatch(/secret-like/));
 it('allows variable interpolation without literal-secret warning',()=>expect(analyzeCompose('services:\n  x:\n    image: alpine:3\n    environment:\n      API_TOKEN: ${API_TOKEN}').findings.join(' ')).not.toMatch(/secret-like/));
 it('rejects malformed YAML',()=>expect(analyzeCompose('services: [').status).toBe('invalid'));
 it('rejects multi-document input',()=>expect(analyzeCompose('services: {}\n---\nservices: {}').status).toBe('unsupported'));
 it('limits oversized input',()=>expect(analyzeCompose('services:\n  x:\n    image: alpine:3\n#'+ 'x'.repeat(300000)).status).toBe('unsupported'));
});
