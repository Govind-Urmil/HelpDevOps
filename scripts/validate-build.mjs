import fs from 'node:fs'; import path from 'node:path';
const dist=path.resolve('dist');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):entry.name.endsWith('.html')?[path.relative(dist,path.join(dir,entry.name)).replaceAll('\\','/')]:[]);
const routes=walk(dist).sort();
const metadata=new Map(); const errors=[];
for(const route of routes){const file=path.join(dist,route);if(!fs.existsSync(file)){errors.push(`Missing route: ${route}`);continue}const html=fs.readFileSync(file,'utf8');const title=html.match(/<title>(.*?)<\/title>/)?.[1];const desc=html.match(/<meta name="description" content="([^"]+)"/i)?.[1];const canonical=html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];if(!title||!desc||!canonical)errors.push(`Metadata missing: ${route}`);for(const [type,value] of [['title',title],['description',desc]]){const key=`${type}:${value}`;if(metadata.has(key))errors.push(`Duplicate ${type}: ${route} and ${metadata.get(key)}`);metadata.set(key,route)}const links=[...html.matchAll(/href="(\/[^"]*)"/g)].map(m=>m[1]).filter(x=>!x.startsWith('//'));for(const link of links){const clean=link.split(/[?#]/)[0];const target=clean==='/'?path.join(dist,'index.html'):path.extname(clean)?path.join(dist,clean):path.join(dist,clean,'index.html');if(!fs.existsSync(target))errors.push(`Broken internal link ${link} in ${route}`)}}
if(!fs.existsSync(path.join(dist,'sitemap-index.xml'))&&!fs.existsSync(path.join(dist,'sitemap-0.xml')))errors.push('Sitemap missing');
if(!fs.existsSync(path.join(dist,'robots.txt')))errors.push('robots.txt missing');
if(!fs.existsSync(path.join(dist,'favicon.svg')))errors.push('favicon missing');
const headers=fs.readFileSync(path.join(dist,'_headers'),'utf8');if(headers.includes('Strict-Transport-Security'))errors.push('HSTS must not be enabled in the generic development adapter');if(!headers.includes('Content-Security-Policy'))errors.push('CSP adapter missing');
if(errors.length)throw new Error(errors.join('\n'));console.log(`Validated ${routes.length} routes, metadata, internal links, robots, and sitemap.`);
