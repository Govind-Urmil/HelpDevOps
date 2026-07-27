export const sensitiveContentRules = [
  { id: 'private-key', severity: 'block', label: 'Private key material', pattern: /-----BEGIN(?: [A-Z0-9]+)? PRIVATE KEY-----/i },
  { id: 'bearer-token', severity: 'warn', label: 'Bearer token', pattern: /authorization\s*:\s*bearer\s+[^\s"']+/i },
  { id: 'github-token', severity: 'warn', label: 'GitHub token-like value', pattern: /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/ },
  { id: 'aws-key', severity: 'warn', label: 'AWS access-key-like value', pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/ },
  { id: 'sensitive-assignment', severity: 'warn', label: 'Sensitive key assignment', pattern: /\b(?:password|passwd|secret|token|api[_-]?key|client[_-]?secret|aws[_-]?secret[_-]?access[_-]?key)\b\s*[:=]\s*[^\s#]+/i },
  { id: 'kubernetes-secret', severity: 'warn', label: 'Kubernetes Secret manifest', pattern: /\bkind\s*:\s*Secret\b/i },
  { id: 'email-address', severity: 'warn', label: 'Email or ownership address', pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i },
  { id: 'terraform-state-path', severity: 'warn', label: 'Terraform or remote state path', pattern: /(?:\bPath\s*:\s*)?(?:s3:\/\/[^\s"']+|[^\s"']+\.tfstate\b)/i },
  { id: 'ip-address', severity: 'warn', label: 'IP address', pattern: /\b(?:10\.|127\.|169\.254\.|172\.(?:1[6-9]|2\d|3[01])\.|192\.168\.)\d{1,3}\.\d{1,3}\b/ },
  { id: 'internal-hostname', severity: 'warn', label: 'Likely internal hostname', pattern: /\b(?:[a-z0-9-]+\.)+(?:internal|local|lan|corp|cluster\.local)\b/i },
  { id: 'filesystem-path', severity: 'warn', label: 'Filesystem or state path', pattern: /(?:^|\s)(?:\/[a-z0-9._-]+){3,}(?:\s|$)/i },
  { id: 'docker-environment', severity: 'warn', label: 'Docker environment value', pattern: /\b(?:Env|environment)\b[\s\S]{0,80}\b[A-Z][A-Z0-9_]{2,}\s*[:=]\s*[^\s,]+/i },
  { id: 'ownership-field', severity: 'warn', label: 'Operational owner or username', pattern: /\b(?:Who|Owner|Username|User)\s*:\s*[^\s,;]+/i }
];

function lineOf(input,index){return input.slice(0,index).split('\n').length;}
function redact(value){
  const [prefix]=value.split(/[:=]/,1);
  if(value.length<12)return '••••••••';
  return value.slice(0,Math.min(12,Math.max(2,prefix?.length||2)))+'••••••••';
}
function reviewText(input,depth=0){
  if(depth>8)return '[nested content omitted]';
  if(typeof input==='string'){
    const trimmed=input.trim();
    if((trimmed.startsWith('{')||trimmed.startsWith('['))&&trimmed.length<200000){
      try{return `${input}\n${reviewText(JSON.parse(trimmed),depth+1)}`;}catch{}
    }
    return input;
  }
  if(Array.isArray(input))return input.map((item,index)=>`[${index}]: ${reviewText(item,depth+1)}`).join('\n');
  if(input&&typeof input==='object')return Object.entries(input).map(([key,value])=>`${key}: ${reviewText(value,depth+1)}`).join('\n');
  return String(input??'');
}

export function scanSensitiveContent(input){
  const source=reviewText(input);
  return sensitiveContentRules.flatMap(rule=>{
    const match=rule.pattern.exec(source);
    return match?[{id:rule.id,severity:rule.severity,label:rule.label,line:lineOf(source,match.index),excerpt:redact(match[0])}]:[];
  });
}
export function hasBlockingSensitiveContent(input){return scanSensitiveContent(input).some(item=>item.severity==='block');}

const redactionPatterns = Object.freeze([
  { pattern: /(authorization\s*:\s*bearer\s+)[^\s"']+/ig, replacement: '$1[REDACTED]' },
  { pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g, replacement: '[REDACTED_AWS_ACCESS_KEY]' },
  { pattern: /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/g, replacement: '[REDACTED_GITHUB_TOKEN]' },
  { pattern: /(\b(?:password|passwd|secret|token|api[_-]?key|client[_-]?secret|aws[_-]?secret[_-]?access[_-]?key)\b\s*[:=]\s*)(?:"[^"]*"|'[^']*'|[^\s#;,]+)/ig, replacement: '$1[REDACTED]' }
]);

export function redactSensitiveContent(input) {
  let output = typeof input === 'string' ? input : reviewText(input);
  for (const rule of redactionPatterns) output = output.replace(rule.pattern, rule.replacement);
  return output;
}