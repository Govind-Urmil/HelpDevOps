import fs from 'node:fs';
import path from 'node:path';
import {generateHeaders,readBuiltPages,validateGeneratedHeaders} from './security-headers.mjs';
import {securityPolicy} from '../src/config/security.js';

const dist=path.resolve('dist');const pages=readBuiltPages(dist);const channel=process.env.RELEASE_CHANNEL||'local';const body=generateHeaders({pages,channel});
const validation=validateGeneratedHeaders({body,pages,channel});if(validation.errors.length)throw new Error(validation.errors.join('\n'));
fs.writeFileSync(path.join(dist,'_headers'),body);
const uniqueHashes=new Set(pages.flatMap(page=>page.hashes));
console.log(`Generated ${validation.stats.rules} _headers rules with route-specific CSP for ${pages.length} HTML routes and ${uniqueHashes.size} unique inline-script hash(es); longest line ${validation.stats.longestLine}, longest CSP line ${validation.stats.longestCspLine}; HSTS ${securityPolicy.hsts.enabled?'enabled':'disabled'}.`);
