import fs from 'node:fs'; import path from 'node:path'; import { spawn } from 'node:child_process';
const root=process.cwd(), evidence=path.join(root,'evidence'); fs.mkdirSync(evidence,{recursive:true});
const routes=[['homepage','/'],['encoding-hash','/tools/encoding-hash/'],['ipv4-cidr','/tools/ipv4-cidr/'],['linux-permissions','/tools/linux-permissions/'],['git-reference','/tools/git-reference/']];
const thresholds={performance:0.95,accessibility:0.95,'best-practices':0.95,seo:0.95};
const server=spawn(process.execPath,['scripts/serve-dist.mjs'],{cwd:root,stdio:'ignore'}); const wait=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
try{
  await wait(1200); const cli=path.join(root,'node_modules/lighthouse/cli/index.js');
  for(const [name,route] of routes){
    const report=path.join(evidence,`lighthouse-${name}.json`);
    const child=spawn(process.execPath,[cli,`http://127.0.0.1:4321${route}`,'--output=json',`--output-path=${report}`,'--quiet','--chrome-flags=--headless --no-sandbox'],{cwd:root,stdio:'inherit'});
    const code=await new Promise(resolve=>child.on('close',resolve)); if(code!==0&&!fs.existsSync(report))throw new Error(`Lighthouse ${name} exited ${code} without a report`);
    const result=JSON.parse(fs.readFileSync(report,'utf8')), failures=[];
    for(const [category,minimum] of Object.entries(thresholds)){const score=result.categories[category].score; console.log(`${name} ${category}: ${Math.round(score*100)}`); if(score<minimum)failures.push(`${name} ${category} ${score*100} < ${minimum*100}`)}
    if(failures.length)throw new Error(failures.join('\n'));
  }
} finally { server.kill(); }
