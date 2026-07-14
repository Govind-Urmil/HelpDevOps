import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {securityPolicy} from '../src/config/security.js';

export const CLOUDFLARE_HEADER_LINE_LIMIT=2000;
export const CLOUDFLARE_RULE_LIMIT=100;

export function inlineScriptHashes(html){
 const hashes=new Set();
 for(const match of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g))hashes.add(`'sha256-${crypto.createHash('sha256').update(match[1]).digest('base64')}'`);
 return [...hashes];
}

export function cspForHashes(hashes){
 const directives=structuredClone(securityPolicy.contentSecurityPolicy);
 directives['script-src']=[...directives['script-src'],...hashes];
 return Object.entries(directives).map(([name,values])=>`${name}${values.length?` ${values.join(' ')}`:''}`).join('; ');
}

export function routeForHtml(relativeFile){
 const file=relativeFile.replaceAll('\\','/');
 if(file==='index.html')return '/';
 if(file.endsWith('/index.html'))return `/${file.slice(0,-'index.html'.length)}`;
 return `/${file}`;
}

export function generateHeaders({pages,channel='local'}){
 const common={...securityPolicy.headers,...(channel==='preview'?{'X-Robots-Tag':'noindex, nofollow'}:{})};
 if(securityPolicy.hsts.enabled)common['Strict-Transport-Security']=`${securityPolicy.hsts.value}${securityPolicy.hsts.includeSubDomains?'; includeSubDomains':''}`;
 const blocks=[`/*\n${Object.entries(common).map(([name,value])=>`  ${name}: ${value}`).join('\n')}`];
 for(const page of pages)blocks.push(`${page.route}\n  Content-Security-Policy: ${cspForHashes(page.hashes)}`);
 blocks.push('/_astro/*\n  Cache-Control: public, max-age=31536000, immutable');
 return `${blocks.join('\n\n')}\n`;
}

export function readBuiltPages(dist){
 const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
 return walk(dist).filter(file=>file.endsWith('.html')).map(file=>{const relative=path.relative(dist,file).replaceAll('\\','/');const html=fs.readFileSync(file,'utf8');return {file:relative,route:routeForHtml(relative),html,hashes:inlineScriptHashes(html)}}).sort((a,b)=>a.route.localeCompare(b.route));
}

export function validateGeneratedHeaders({body,pages,channel='local'}){
 const errors=[];const lines=body.split(/\r?\n/);const blocks=body.trim().split(/\r?\n\r?\n/);const rules=new Map();
 for(const block of blocks){const [rule,...headerLines]=block.split(/\r?\n/);rules.set(rule,new Map(headerLines.map(line=>{const match=line.match(/^\s+([^:]+):\s*(.*)$/);return match?[match[1],match[2]]:[line,'']})))}
 if(blocks.length>CLOUDFLARE_RULE_LIMIT)errors.push(`Cloudflare rule limit exceeded: ${blocks.length}/${CLOUDFLARE_RULE_LIMIT}`);
 for(const [index,line] of lines.entries())if(line.length>=CLOUDFLARE_HEADER_LINE_LIMIT)errors.push(`Header line ${index+1} is ${line.length} characters; it must be below ${CLOUDFLARE_HEADER_LINE_LIMIT}`);
 const global=rules.get('/*');if(!global)errors.push('Global security-header rule missing');
 else{
  if(global.has('Content-Security-Policy'))errors.push('Global rule must not contain the route-specific CSP');
  for(const [name,value] of Object.entries(securityPolicy.headers))if(global.get(name)!==value)errors.push(`Global security header mismatch: ${name}`);
  if(channel==='preview'&&global.get('X-Robots-Tag')!=='noindex, nofollow')errors.push('Preview X-Robots-Tag is missing or incorrect');
 }
 for(const page of pages){const actual=rules.get(page.route)?.get('Content-Security-Policy');const expected=cspForHashes(page.hashes);if(!actual)errors.push(`CSP rule missing for HTML route: ${page.route}`);else if(actual!==expected)errors.push(`CSP rule or inline-script hashes mismatch for HTML route: ${page.route}`)}
 if(rules.get('/_astro/*')?.get('Cache-Control')!=='public, max-age=31536000, immutable')errors.push('Immutable asset cache rule is missing or changed');
 return {errors,stats:{rules:blocks.length,longestLine:Math.max(...lines.map(line=>line.length)),longestCspLine:Math.max(...lines.filter(line=>line.trimStart().startsWith('Content-Security-Policy:')).map(line=>line.length),0)}};
}
