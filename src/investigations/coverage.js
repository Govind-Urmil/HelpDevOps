const coverageEntries = [
  {
    id: 'cloud-iam',
    title: 'Cloud IAM and access failures',
    summary: 'Start from the exact denial and preserve identity, resource, action, and execution context without exposing credentials.',
    href: '/troubleshoot/terraform/init-provider-failure/',
    search: ['cloud iam', 'access denied', 'authorization', 'identity', 'aws', 'azure', 'gcp']
  },
  {
    id: 'cicd',
    title: 'CI/CD pipeline failures',
    summary: 'Separate queue, agent, source, credential, build, and deployment boundaries before retrying work.',
    href: '/troubleshoot/jenkins/build-stuck/',
    search: ['ci cd', 'pipeline', 'jenkins', 'runner', 'agent', 'build']
  },
  {
    id: 'secrets',
    title: 'Secrets and credentials',
    summary: 'Identify the failing credential boundary while keeping secret values out of evidence and exports.',
    href: '/troubleshoot/kubernetes/image-pull-backoff/',
    search: ['secret', 'credential', 'token', 'unauthorized', 'authentication']
  },
  {
    id: 'dns-cdn',
    title: 'DNS and CDN symptoms',
    summary: 'Distinguish resolver, authoritative answer, route, TLS, cache, and origin evidence.',
    href: '/troubleshoot/networking/dns-resolution/',
    search: ['dns', 'cdn', 'resolver', 'cache', 'origin', 'servfail', 'nxdomain']
  },
  {
    id: 'load-balancer',
    title: 'Load balancers and gateways',
    summary: 'Separate listener, backend readiness, route, timeout, and upstream response evidence.',
    href: '/troubleshoot/http/502-bad-gateway/',
    search: ['load balancer', 'gateway', 'ingress', '502', 'upstream']
  },
  {
    id: 'database',
    title: 'Database connectivity',
    summary: 'Use DNS, route, port, refusal, timeout, TLS, and ownership evidence before changing a database.',
    href: '/troubleshoot/networking/connection-timeout/',
    search: ['database', 'postgres', 'mysql', 'connection', 'timeout', 'refused']
  },
  {
    id: 'observability',
    title: 'Observability gaps',
    summary: 'Preserve timestamps and scope, then distinguish missing telemetry from healthy service behavior.',
    href: '/interpret/',
    search: ['observability', 'metrics', 'logs', 'traces', 'telemetry', 'monitoring']
  },
  {
    id: 'limits-cost',
    title: 'Resource limits and cost signals',
    summary: 'Confirm quota, allocation, usage, scope, and ownership before cleanup or capacity changes.',
    href: '/troubleshoot/linux/memory-pressure/',
    search: ['quota', 'limit', 'cost', 'memory', 'disk', 'capacity', 'billing']
  },
  {
    id: 'supply-chain',
    title: 'Supply-chain integrity',
    summary: 'Preserve immutable references and distinguish availability, authentication, checksum, and provenance evidence.',
    href: '/troubleshoot/terraform/init-provider-failure/',
    search: ['supply chain', 'checksum', 'provenance', 'image digest', 'provider lock']
  }
];

const evidenceById = {
  'cloud-iam': ['Capture the exact denied action, resource, principal, account/project, and timestamp.', 'Branch on authentication failure, explicit denial, missing role binding, or wrong scope.'],
  cicd: ['Record stage, runner/agent, commit, exit code, and first failing log line.', 'Branch on queue/agent, checkout, credentials, build, or deployment evidence.'],
  secrets: ['Record secret name, consumer, reference error, and rotation timestamp; never record the value.', 'Branch on missing reference, denied access, expired credential, or injection failure.'],
  observability: ['Compare service timestamps with collector/exporter health and ingestion acknowledgements.', 'Branch on collection, transport, ingestion, query, or dashboard evidence.'],
  'dns-cdn': ['Capture resolver, record type, answer, TTL, authoritative response, and origin comparison.', 'Branch on NXDOMAIN/SERVFAIL, stale cache, TLS edge, or origin evidence.'],
  'load-balancer': ['Capture listener, route, backend membership, health status, and upstream response.', 'Branch on listener, route, unhealthy backend, timeout, or application response.'],
  database: ['Capture resolved address, port result, refusal/timeout/TLS class, and client context.', 'Branch on DNS, route/firewall, listener, TLS, authentication, or capacity evidence.'],
  'limits-cost': ['Capture scoped quota, current usage, requested amount, region, and owner.', 'Branch on hard quota, local limit, unexpected growth, allocation, or billing attribution.'],
  'supply-chain': ['Capture immutable digest/checksum, registry/source, lock data, and verification result.', 'Branch on unavailable artifact, authentication, checksum mismatch, signature/provenance, or policy evidence.']
};
export const guidedCoverageStartingPoints = Object.freeze(coverageEntries.map(item => ({
  ...item,
  evidence: evidenceById[item.id],
  prerequisites: ['Use read-only access first.', 'Confirm the affected scope and owner.', 'Redact credentials and internal identifiers before sharing.'],
  nextStepLabel: `Open ${item.title.toLowerCase()} guidance`
})));