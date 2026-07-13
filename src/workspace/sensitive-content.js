const rules = [
  { id: 'private-key', severity: 'block', label: 'Private key material', pattern: /-----BEGIN(?: [A-Z0-9]+)? PRIVATE KEY-----/i },
  { id: 'bearer-token', severity: 'warn', label: 'Bearer token', pattern: /authorization\s*:\s*bearer\s+[^\s"']+/i },
  { id: 'github-token', severity: 'warn', label: 'GitHub token-like value', pattern: /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/ },
  { id: 'aws-key', severity: 'warn', label: 'AWS access-key-like value', pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/ },
  { id: 'sensitive-assignment', severity: 'warn', label: 'Sensitive key assignment', pattern: /\b(?:password|passwd|secret|token|api[_-]?key)\b\s*[:=]\s*[^\s#]+/i },
  { id: 'kubernetes-secret', severity: 'warn', label: 'Kubernetes Secret manifest', pattern: /\bkind\s*:\s*Secret\b/i }
];

function lineOf(input, index) { return input.slice(0, index).split('\n').length; }
function redact(value) {
  const [prefix] = value.split(/[:=]/, 1);
  if (value.length < 12) return '••••••••';
  return value.slice(0, Math.min(12, Math.max(2, prefix?.length || 2))) + '••••••••';
}

export function scanSensitiveContent(input) {
  const source = typeof input === 'string' ? input : JSON.stringify(input ?? '');
  return rules.flatMap(rule => {
    const match = rule.pattern.exec(source);
    return match ? [{ id: rule.id, severity: rule.severity, label: rule.label, line: lineOf(source, match.index), excerpt: redact(match[0]) }] : [];
  });
}

export function hasBlockingSensitiveContent(input) {
  return scanSensitiveContent(input).some(item => item.severity === 'block');
}
