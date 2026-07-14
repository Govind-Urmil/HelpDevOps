import {describe,it,expect} from 'vitest';
import {CLOUDFLARE_HEADER_LINE_LIMIT,CLOUDFLARE_RULE_LIMIT,cspForHashes,generateHeaders,inlineScriptHashes,routeForHtml,validateGeneratedHeaders} from '../scripts/security-headers.mjs';

describe('Cloudflare route-specific security headers',()=>{
 const home='<script type="application/ld+json">{"page":"home"}</script>';const tool='<script type="application/ld+json">{"page":"tool"}</script>';
 const pages=[{route:'/',hashes:inlineScriptHashes(home)},{route:'/tools/example/',hashes:inlineScriptHashes(tool)}];
 it('maps build files to Cloudflare route rules',()=>{expect(routeForHtml('index.html')).toBe('/');expect(routeForHtml('tools/example/index.html')).toBe('/tools/example/');expect(routeForHtml('404.html')).toBe('/404.html')});
 it('generates common headers globally and exact CSP hashes per route',()=>{const body=generateHeaders({pages,channel:'preview'});expect(body.match(/Content-Security-Policy:/g)).toHaveLength(2);expect(body.split('\n\n')[0]).not.toContain('Content-Security-Policy');expect(body).toContain('X-Robots-Tag: noindex, nofollow');expect(body).toContain(cspForHashes(pages[0].hashes));expect(body).toContain('/_astro/*\n  Cache-Control: public, max-age=31536000, immutable')});
 it('enforces Cloudflare line, rule, route, hash, preview and cache constraints',()=>{const body=generateHeaders({pages,channel:'preview'});const result=validateGeneratedHeaders({body,pages,channel:'preview'});expect(result.errors).toEqual([]);expect(result.stats.rules).toBe(4);expect(result.stats.rules).toBeLessThanOrEqual(CLOUDFLARE_RULE_LIMIT);expect(result.stats.longestLine).toBeLessThan(CLOUDFLARE_HEADER_LINE_LIMIT)});
 it('rejects a missing route CSP and an oversized header line',()=>{const valid=generateHeaders({pages,channel:'local'});expect(validateGeneratedHeaders({body:valid.replace(/\/tools\/example\/[\s\S]*?(?=\n\n\/_astro)/,''),pages}).errors.join(' ')).toMatch(/missing/);expect(validateGeneratedHeaders({body:`/*\n  X-Test: ${'x'.repeat(2000)}`,pages:[]}).errors.join(' ')).toMatch(/below 2000/)});
});
