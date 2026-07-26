import {createHash} from 'node:crypto';

const detectors=Object.freeze([
  {id:'aws-secret-assignment',pattern:/\bAWS_SECRET_ACCESS_KEY\s*[:=]\s*[A-Za-z0-9/+=-]{10,}/gi},
  {id:'bearer-token',pattern:/\b(?:Authorization\s*:\s*)?Bearer\s+[A-Za-z0-9._~+\/-]{12,}/gi},
  {id:'private-key-marker',pattern:/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g},
  {id:'github-token',pattern:/\b(?:ghp_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/g},
  {id:'sensitive-assignment',pattern:/\b(?:client_secret|api_key|password)\s*[:=]\s*[^\s'",]{4,}/gi}
]);

export const approvedSecurityFixtures=Object.freeze({
  'tests/fixtures/universal-input-independent.js':Object.freeze({
    reason:'Permanent EP-017.2 synthetic sensitive-content generalization corpus.',
    sha256:'220208a16b13ea2682ec89c067a00ed3b54aa4b0d062ecb1d8b0d8b3b085e7e1',
    expected:Object.freeze({'aws-secret-assignment':1,'bearer-token':2,'private-key-marker':1,'github-token':2,'sensitive-assignment':4})
  }),
  'tests/fixtures/universal-input-regression.json':Object.freeze({
    reason:'Permanent EP-017.2 audited regression corpus containing four synthetic sensitive-content controls.',
    sha256:'2d9096e98dce4ac736ea520fa952371cabdfeb7b5c9b08ee13e6a30c451fb06d',
    expected:Object.freeze({'aws-secret-assignment':1,'bearer-token':1,'private-key-marker':1,'github-token':0,'sensitive-assignment':1})
  })
});

export function validateSecurityFixturePolicy(policy=approvedSecurityFixtures){
  const errors=[],categories=detectors.map(item=>item.id).sort();
  if(!policy||Array.isArray(policy)||typeof policy!=='object')return['Security fixture policy must be an object.'];
  for(const [entryPath,entry] of Object.entries(policy)){
    try{normalizeEntryPath(entryPath);}catch(error){errors.push(error.message);continue;}
    if(!entry||typeof entry.reason!=='string'||entry.reason.length<20)errors.push(`Security fixture policy reason is missing for ${entryPath}`);
    if(!/^[a-f0-9]{64}$/.test(entry?.sha256||''))errors.push(`Security fixture policy fingerprint is invalid for ${entryPath}`);
    const keys=Object.keys(entry?.expected||{}).sort();
    if(keys.join('|')!==categories.join('|')||keys.some(key=>!Number.isInteger(entry.expected[key])||entry.expected[key]<0))errors.push(`Security fixture policy detector counts are malformed for ${entryPath}`);
  }
  return errors;
}
const configuredPolicyErrors=validateSecurityFixturePolicy();
if(configuredPolicyErrors.length)throw new Error(configuredPolicyErrors.join('\n'));

export const sha256 = text =>
  createHash('sha256')
    .update(String(text).replace(/\r\n?/g, '\n'))
    .digest('hex');
export function normalizeEntryPath(value){
  const name=String(value||'').replaceAll('\\','/');
  if(!name||name.startsWith('/')||/^[A-Za-z]:\//.test(name)||name.split('/').some(part=>part==='..'||part===''))throw new Error(`Unsafe secret-scan path: ${value}`);
  return name;
}
export function detectCredentialLikeContent(text){
  const findings=[];
  for(const detector of detectors){detector.pattern.lastIndex=0;for(const match of String(text).matchAll(detector.pattern))findings.push({category:detector.id,index:match.index});}
  return findings;
}
export function validateCredentialContent(entryPath,text){
  const name=normalizeEntryPath(entryPath),findings=detectCredentialLikeContent(text),policy=approvedSecurityFixtures[name];
  if(!policy)return findings.map(item=>`Credential-like ${item.category} in ${name}`);
  const errors=[];
  if(sha256(text)!==policy.sha256)errors.push(`Approved security fixture fingerprint mismatch: ${name}`);
  const actual=Object.fromEntries(detectors.map(item=>[item.id,findings.filter(finding=>finding.category===item.id).length]));
  for(const key of Object.keys(actual))if(actual[key]!==policy.expected[key])errors.push(`Approved security fixture ${name} has ${actual[key]} ${key} finding(s); expected ${policy.expected[key]}`);
  for(const key of Object.keys(policy.expected))if(!Object.prototype.hasOwnProperty.call(actual,key))errors.push(`Malformed security fixture policy category ${key} for ${name}`);
  return errors;
}
