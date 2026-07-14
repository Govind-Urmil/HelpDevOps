import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync,mkdirSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseCheckSummaries,parseLicenseSummary,parseSnapshotSummary,parseUnitSummary,summarizeBudgets,summarizeBuild,summarizePlaywright,validateMandatoryBrowserEvidence} from './certification-evidence.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const args=new Set(process.argv.slice(2));
const profile=process.argv.includes('--profile')?process.argv[process.argv.indexOf('--profile')+1]:'full';
const allowArchive=args.has('--allow-archive');
if(!['core','full'].includes(profile))throw new Error(`Unsupported certification profile: ${profile}`);
const release=JSON.parse(readFileSync(join(root,'release-meta.json'),'utf8'));
const pkg=JSON.parse(readFileSync(join(root,'package.json'),'utf8'));
const out=join(root,'release-certification');
rmSync(out,{recursive:true,force:true});mkdirSync(out,{recursive:true});

function exec(command,commandArgs,{allowFailure=false,env={}}={}){
 const executable=process.platform==='win32'&&command==='npm'?'npm.cmd':command;
 const started=Date.now();
 const run=spawnSync(executable,commandArgs,{cwd:root,encoding:'utf8',stdio:'pipe',shell:false,env:{...process.env,CI:'1',...env}});
 if(run.stdout)process.stdout.write(run.stdout);if(run.stderr)process.stderr.write(run.stderr);
 const item={command:[command,...commandArgs].join(' '),status:run.status===0?'passed':'failed',exitCode:run.status,durationMs:Date.now()-started,stdout:(run.stdout||'').trim(),stderr:(run.stderr||'').trim(),error:run.error?.message||null};
 if(item.status==='failed'&&!allowFailure)throw Object.assign(new Error(`Certification command failed: ${item.command}\n${item.stderr||item.stdout}`),{certificationItem:item});
 return item;
}
function sha256(file){const hash=createHash('sha256');hash.update(readFileSync(file));return hash.digest('hex').toUpperCase();}
function gitStatus(){return spawnSync('git',['status','--porcelain'],{cwd:root,encoding:'utf8'}).stdout.trim();}

const checks=[];const evidence={};let sourceCommit=null,branch=null,sourceTreeClean=null,sourceTreeCleanAfter=null,gitAvailable=false;let packagePath=null,packageSha256=null;
const gitProbeRaw=spawnSync('git',['rev-parse','--is-inside-work-tree'],{cwd:root,encoding:'utf8'});
if(gitProbeRaw.status===0){
 gitAvailable=true;sourceCommit=spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).stdout.trim();branch=spawnSync('git',['branch','--show-current'],{cwd:root,encoding:'utf8'}).stdout.trim();sourceTreeClean=gitStatus().length===0;
 checks.push({name:'Git source identity',status:'passed',details:{sourceCommit,branch,sourceTreeClean}});
 if(!sourceTreeClean)throw new Error('Full release certification requires a clean Git working tree.');
}else if(!allowArchive){throw new Error('Release certification requires a Git repository. Use --allow-archive only for recovery validation of an extracted snapshot.');}
else{checks.push({name:'Git source identity',status:'archive-mode',details:{reason:'Git metadata intentionally absent from portable snapshot.'}});}

const commandChecks=[
 ['Clean dependency installation','npm',['ci'],'install'],
 ['Dependency audit','npm',['run','audit:dependencies'],'audit'],
 ['Dependency license inventory','npm',['run','audit:licenses'],'licenses'],
 ['Source, resource, and Astro checks','npm',['run','check'],'checks'],
 ['Unit tests','npm',['test'],'unit'],
 ['Production build','npm',['run','build'],'build'],
 ['Built output validation','npm',['run','validate'],'validate'],
 ['Performance budgets','npm',['run','audit:budgets'],'budgets'],
];
if(profile==='full')commandChecks.push(['Full browser matrix','npm',['run','verify:browsers'],'browsers']);
for(const [name,cmd,a,key] of commandChecks){
 try{
  const result=exec(cmd,a);checks.push({name,...result});const text=`${result.stdout}\n${result.stderr}`;
  if(key==='audit')evidence.security={...(evidence.security||{}),dependencyAudit:'passed'};
  if(key==='licenses')evidence.licenses=parseLicenseSummary(text);
  if(key==='checks')evidence.resources=parseCheckSummaries(text);
  if(key==='unit')evidence.unitTests=parseUnitSummary(text);
  if(key==='build'){evidence.build=summarizeBuild(root);evidence.security={...(evidence.security||{}),securityHeaders:'generated',structuredDataCspHashes:evidence.build.structuredDataHashes};}
  if(key==='validate')evidence.staticOutput={routesAndMetadata:'passed'};
  if(key==='budgets')evidence.budgets=summarizeBudgets(root);
  if(key==='browsers'){
   evidence.browserTests=summarizePlaywright(join(root,'evidence','playwright-results.json'));
   const browserErrors=validateMandatoryBrowserEvidence(evidence.browserTests);
   if(browserErrors.length)throw Object.assign(new Error(`Full browser certification evidence invalid: ${browserErrors.join('; ')}`),{certificationItem:{command:'browser evidence validation',status:'failed',exitCode:1,durationMs:0,error:browserErrors.join('; ')}});
  }
 }catch(error){checks.push({name,...error.certificationItem});finalize('failed');throw error;}
}

if(profile==='full'){
 for(const [name,cmd,a,key] of [['Snapshot creation','npm',['run','snapshot'],'snapshot'],['Snapshot validation','npm',['run','snapshot:validate'],'snapshotValidation']]){
  try{const result=exec(cmd,a);checks.push({name,...result});evidence[key]=parseSnapshotSummary(`${result.stdout}\n${result.stderr}`);}catch(error){checks.push({name,...error.certificationItem});finalize('failed');throw error;}
 }
 evidence.snapshot={...evidence.snapshot,...evidence.snapshotValidation,freshExtraction:'passed'};
 if(!Number.isInteger(evidence.snapshot.entries)||evidence.snapshot.entries<1||!Number.isInteger(evidence.snapshot.recoveryFiles)||evidence.snapshot.recoveryFiles<1)throw new Error('Snapshot certification evidence is incomplete: entry and recovery-file totals are required.');
 const {snapshotName}=await import('./snapshot-config.mjs');
 packagePath=resolve(root,'..',snapshotName);if(!existsSync(packagePath))throw new Error(`Certified snapshot missing: ${packagePath}`);
 packageSha256=sha256(packagePath);writeFileSync(join(out,'checksums.txt'),`${packageSha256}  ${snapshotName}\n`);
}
if(gitAvailable){sourceTreeCleanAfter=gitStatus().length===0;checks.push({name:'Final Git cleanliness',status:sourceTreeCleanAfter?'passed':'failed',details:{sourceTreeCleanAfter}});if(!sourceTreeCleanAfter){finalize('failed');throw new Error('Certification commands modified tracked or untracked release-affecting source files. Clean the working tree and certify again.');}}
finalize('passed');
console.log(`Release certification ${profile}: passed`);

function finalize(gate){
 const manifest={schemaVersion:2,generatedAt:new Date().toISOString(),product:release.product,version:release.version,ep:release.ep,profile,gate,source:{gitAvailable,sourceCommit,branch,sourceTreeClean,sourceTreeCleanAfter,archiveMode:!gitAvailable},environment:{platform:process.platform,arch:process.arch,node:process.version,npm:exec('npm',['--version'],{allowFailure:true}).stdout.trim()},package:{name:pkg.name,version:pkg.version,path:packagePath,sha256:packageSha256},evidence,checks:checks.map(({stdout,stderr,...item})=>item)};
 writeFileSync(join(out,'certification.json'),JSON.stringify(manifest,null,2));
 const browser=evidence.browserTests?.totals;const unit=evidence.unitTests;const build=evidence.build;const budget=evidence.budgets;
 const lines=[`# Release Certification`,``,`- Product: ${manifest.product}`,`- Release: ${manifest.ep} / v${manifest.version}`,`- Profile: ${profile}`,`- Gate: **${gate}**`,`- Source commit: ${sourceCommit||'portable archive mode'}`,`- Package SHA-256: ${packageSha256||'not generated by core profile'}`,`- Unit tests: ${unit?`${unit.passed} passed, ${unit.failed} failed`:'not captured'}`,`- Browser tests: ${browser?`${browser.passed} passed, ${browser.failed} failed, ${browser.skipped} skipped`:'not executed in this profile'}`,`- Routes: ${build?.routes??'not captured'}`,`- Peak transfer: ${budget?`${(budget.peakTransferBytes/1024).toFixed(1)} KB`:'not captured'}`,``,`## Checks`,...checks.map(x=>`- ${x.name}: **${x.status}**${x.durationMs?` (${x.durationMs} ms)`:''}`)];
 writeFileSync(join(out,'certification.md'),lines.join('\n')+'\n');
}
