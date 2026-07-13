import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {securityPolicy} from '../src/config/security.js';
const hashes=new Set();const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):path.join(d,e.name));
for(const file of walk('dist').filter(f=>f.endsWith('.html'))){const html=fs.readFileSync(file,'utf8');for(const match of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)){hashes.add(`'sha256-${crypto.createHash('sha256').update(match[1]).digest('base64')}'`)}}
const directives=structuredClone(securityPolicy.contentSecurityPolicy);directives['script-src']=[...directives['script-src'],...[...hashes]];
const csp=Object.entries(directives).map(([name,values])=>`${name}${values.length?` ${values.join(' ')}`:''}`).join('; ');
const headers={'Content-Security-Policy':csp,...securityPolicy.headers};
if(securityPolicy.hsts.enabled){headers['Strict-Transport-Security']=`${securityPolicy.hsts.value}${securityPolicy.hsts.includeSubDomains?'; includeSubDomains':''}`}
const body=`/*\n${Object.entries(headers).map(([name,value])=>`  ${name}: ${value}`).join('\n')}\n`;
fs.writeFileSync(path.join('dist','_headers'),body);console.log(`Generated _headers host adapter from the central policy with ${hashes.size} structured-data hash(es); HSTS ${securityPolicy.hsts.enabled?'enabled':'disabled'}.`);
