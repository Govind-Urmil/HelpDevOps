import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import AdmZip from 'adm-zip';
import {snapshotName,requiredFiles} from './snapshot-config.mjs';

const archive=path.join(path.dirname(process.cwd()),snapshotName);
if(!fs.existsSync(archive))throw new Error(`Snapshot missing: ${archive}`);
const zip=new AdmZip(archive),entries=zip.getEntries(),names=entries.map(entry=>entry.entryName),errors=[];
const prohibited=[
 /^\.git\//,/^node_modules\//,/^dist\//,/^evidence\//,/^release-health\//,/^release-certification\//,
 /^test-results\//,/^playwright-report\//,/^coverage\//,/\.zip$/i,/lighthouse.*\.json$/i,
 /playwright-results\.json$/i,/CODEX-WORKFLOW\.md$/i
];
for(const name of names){
 if(name.includes('\\'))errors.push(`Backslash archive path: ${name}`);
 if(prohibited.some(pattern=>pattern.test(name)))errors.push(`Prohibited archive entry: ${name}`);
}
for(const required of requiredFiles)if(!names.includes(required))errors.push(`Required archive entry missing: ${required}`);
for(const entry of entries){
 if(entry.isDirectory||entry.header.size>2_000_000)continue;
 const text=entry.getData().toString('utf8');
 if(/C:\\Users\\/i.test(text))errors.push(`Local absolute path in ${entry.entryName}`);
 if(/(?:ghp_|github_pat_|AKIA)[A-Za-z0-9_\-]{12,}/.test(text))errors.push(`Credential-like token in ${entry.entryName}`);
}
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'helpdevops-snapshot-'));
function run(command,args){
 const executable=process.platform==='win32'&&command==='npm'?'npm.cmd':command;
 const result=spawnSync(executable,args,{cwd:temporary,encoding:'utf8',shell:process.platform==='win32',env:{...process.env,CI:'1'}});
 if(result.status!==0)errors.push(`Fresh-extraction command failed: ${command} ${args.join(' ')}\n${result.stdout||''}\n${result.stderr||''}`);
}
try{
 zip.extractAllTo(temporary,true);
 for(const required of requiredFiles)if(!fs.existsSync(path.join(temporary,...required.split('/'))))errors.push(`Extracted file missing: ${required}`);
 const pkg=JSON.parse(fs.readFileSync(path.join(temporary,'package.json'),'utf8'));
 const release=JSON.parse(fs.readFileSync(path.join(temporary,'release-meta.json'),'utf8'));
 if(pkg.version!=='0.14.0'||release.version!==pkg.version||release.ep!=='EP-014')errors.push('Extracted release identity mismatch.');
 if(!errors.length){
  run('npm',['ci']);
  run('npm',['run','audit:dependencies']);
  run('npm',['run','check']);
  run('npm',['test']);
  run('npm',['run','build']);
  run('npm',['run','validate']);
  run('npm',['run','audit:budgets']);
 }
}finally{fs.rmSync(temporary,{recursive:true,force:true});}
if(errors.length)throw new Error(errors.join('\n'));
console.log(`Snapshot hygiene, portability, and fresh-extraction execution passed: ${names.length} forward-slash entries, ${requiredFiles.length} recovery files verified.`);
