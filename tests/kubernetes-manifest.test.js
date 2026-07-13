import {describe,it,expect} from 'vitest';
import {analyzeKubernetes} from '../src/tools/kubernetes-manifest/analyzer.js';
const good=`apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  selector:\n    matchLabels: {app: web}\n  template:\n    metadata:\n      labels: {app: web}\n    spec:\n      securityContext: {runAsNonRoot: true}\n      containers:\n      - name: web\n        image: nginx:1.27-alpine\n        resources:\n          requests: {cpu: 100m}\n        readinessProbe:\n          httpGet: {path: /, port: 80}`;
describe('Kubernetes manifest analyzer',()=>{
 it('accepts a common Deployment',()=>expect(analyzeKubernetes(good).status).toMatch(/valid/));
 it('requires apiVersion',()=>expect(analyzeKubernetes('kind: ConfigMap\nmetadata: {name: x}').status).toBe('invalid'));
 it('requires kind',()=>expect(analyzeKubernetes('apiVersion: v1\nmetadata: {name: x}').status).toBe('invalid'));
 it('flags selector mismatch',()=>expect(analyzeKubernetes(good.replace('{app: web}\n  template','{app: api}\n  template')).findings.join(' ')).toMatch(/selector labels/));
 it('flags privileged and host settings',()=>{const r=analyzeKubernetes('apiVersion: v1\nkind: Pod\nmetadata: {name: x}\nspec:\n  hostNetwork: true\n  containers:\n  - name: x\n    image: alpine:latest\n    securityContext: {privileged: true}');expect(r.findings.join(' ')).toMatch(/hostNetwork/);expect(r.findings.join(' ')).toMatch(/privileged/)});
 it('flags absent resources and probes',()=>{const r=analyzeKubernetes('apiVersion: v1\nkind: Pod\nmetadata: {name: x}\nspec:\n  containers: [{name: x, image: alpine:3}]');expect(r.findings.join(' ')).toMatch(/resource requests/);expect(r.findings.join(' ')).toMatch(/probe/)});
 it('handles multiple documents',()=>expect(analyzeKubernetes('apiVersion: v1\nkind: ConfigMap\nmetadata: {name: a}\n---\napiVersion: v1\nkind: Service\nmetadata: {name: b}\nspec: {selector: {app: x}}').summary).toMatch(/2 object/));
 it('warns for Secret without decoding',()=>expect(analyzeKubernetes('apiVersion: v1\nkind: Secret\nmetadata: {name: x}\ndata: {token: ZGVtbw==}').findings.join(' ')).toMatch(/does not decode/));
 it('rejects malformed YAML',()=>expect(analyzeKubernetes('apiVersion: [').status).toBe('invalid'));
 it('limits oversized input',()=>expect(analyzeKubernetes('apiVersion: v1\nkind: ConfigMap\nmetadata: {name: x}\n#'+ 'x'.repeat(300000)).status).toBe('unsupported'));
 it('does not demand probes for a Job',()=>expect(analyzeKubernetes('apiVersion: batch/v1\nkind: Job\nmetadata: {name: x}\nspec:\n  template:\n    spec:\n      restartPolicy: Never\n      containers: [{name: x, image: alpine:3}]').findings.join(' ')).not.toMatch(/probe/));
});
