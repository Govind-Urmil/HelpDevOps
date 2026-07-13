import fs from 'node:fs'; import path from 'node:path'; import zlib from 'node:zlib';
const walk=(dir)=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):path.join(dir,entry.name));
const htmlFiles=walk('dist').filter(file=>file.endsWith('.html')), failures=[], results=[];
for(const file of htmlFiles){
  const html=fs.readFileSync(file,'utf8');
  const urls=[...html.matchAll(/<(?:script|img)[^>]+src="([^"]+)"|<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(match=>match[1]||match[2]);
  const local=[...new Set(urls.filter(url=>url.startsWith('/')).map(url=>path.join('dist',url.split(/[?#]/)[0].replace(/^\//,''))).filter(fs.existsSync))];
  const js=local.filter(asset=>asset.endsWith('.js')).reduce((size,asset)=>size+zlib.gzipSync(fs.readFileSync(asset)).length,0);
  const css=local.filter(asset=>asset.endsWith('.css')).reduce((size,asset)=>size+zlib.gzipSync(fs.readFileSync(asset)).length,0);
  const transfer=fs.statSync(file).size+js+css, requests=1+urls.length, route=path.relative('dist',file);
  if(js>40*1024)failures.push(`${route}: JS ${js} > 40KB`); if(css>35*1024)failures.push(`${route}: CSS ${css} > 35KB`); if(transfer>250*1024)failures.push(`${route}: transfer ${transfer} > 250KB`); if(requests>15)failures.push(`${route}: requests ${requests} > 15`);
  if(urls.some(url=>/^https?:\/\//.test(url)&&!url.startsWith('https://helpdevops.example')))failures.push(`${route}: third-party runtime asset found`);
  results.push({route,js,css,transfer,requests});
}
if(failures.length)throw new Error(failures.join('\n'));
const peak=(key)=>results.reduce((best,item)=>item[key]>best[key]?item:best,results[0]);
console.log(`Budgets passed for ${results.length} routes. Peak JS ${(peak('js').js/1024).toFixed(1)}KB gzip; peak CSS ${(peak('css').css/1024).toFixed(1)}KB gzip; peak transfer ${(peak('transfer').transfer/1024).toFixed(1)}KB; peak requests ${peak('requests').requests}.`);
