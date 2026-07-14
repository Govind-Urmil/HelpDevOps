import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

export function stripAnsi(value=''){
  return String(value).replace(/\u001B\[[0-?]*[ -/]*[@-~]/g,'');
}

export function parseUnitSummary(text=''){
  const clean=stripAnsi(text);
  const tests=clean.match(/Tests\s+(\d+)\s+passed(?:\s*\|\s*(\d+)\s+failed)?/i);
  const files=clean.match(/Test Files\s+(\d+)\s+passed(?:\s*\|\s*(\d+)\s+failed)?/i);
  return {
    passed:Number(tests?.[1]||0),failed:Number(tests?.[2]||0),
    filesPassed:Number(files?.[1]||0),filesFailed:Number(files?.[2]||0)
  };
}

export function parseCheckSummaries(text=''){
  const clean=stripAnsi(text);
  const summary={};
  const patterns={
    tools:/Resource validation passed:\s*(\d+) packs?[, ]+(?:and )?(\d+) tools?/i,
    diagnostics:/Diagnostic validation passed:\s*(\d+) journeys?/i,
    evidence:/Evidence validation passed:\s*(\d+) reviewed interpreters? and (\d+) executable(?: synthetic)? fixtures?/i,
    references:/(?:Reference validation passed:\s*)?(\d+) reviewed references?(?:\s+(?:validated|passed))?[.!]?/i,
    discovery:/(?:Discovery validation passed:\s*)?(\d+) discovery records? and (\d+) canonical error\/symptom entries?(?:\s+(?:validated|passed))?[.!]?/i,
    astro:/Result \((\d+) files\):\s*-?\s*(\d+) errors?\s*-?\s*(\d+) warnings?\s*-?\s*(\d+) hints?/i
  };
  let match=clean.match(patterns.tools);if(match)summary.tools={packs:+match[1],tools:+match[2]};
  match=clean.match(patterns.diagnostics);if(match)summary.diagnostics={journeys:+match[1]};
  match=clean.match(patterns.evidence);if(match)summary.evidence={interpreters:+match[1],fixtures:+match[2]};
  match=clean.match(patterns.references);if(match)summary.references={references:+match[1]};
  match=clean.match(patterns.discovery);if(match)summary.discovery={records:+match[1],errorEntries:+match[2]};
  match=clean.match(patterns.astro);if(match)summary.astro={files:+match[1],errors:+match[2],warnings:+match[3],hints:+match[4]};
  return summary;
}

export function summarizeBuild(root){
  const dist=path.join(root,'dist');
  if(!fs.existsSync(dist))return {routes:0,structuredDataHashes:0};
  const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
  const files=walk(dist);const html=files.filter(file=>file.endsWith('.html'));
  let hashes=0;
  const headers=path.join(dist,'_headers');
  if(fs.existsSync(headers))hashes=new Set(fs.readFileSync(headers,'utf8').match(/'sha256-[^']+'/g)||[]).size;
  return {routes:html.length,structuredDataHashes:hashes};
}

export function summarizeBudgets(root){
  const dist=path.join(root,'dist');
  if(!fs.existsSync(dist))return null;
  const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
  const htmlFiles=walk(dist).filter(file=>file.endsWith('.html'));const rows=[];
  for(const file of htmlFiles){
    const html=fs.readFileSync(file,'utf8');
    const urls=[...html.matchAll(/<(?:script|img)[^>]+src="([^"]+)"|<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(m=>m[1]||m[2]);
    const local=[...new Set(urls.filter(url=>url.startsWith('/')).map(url=>path.join(dist,url.split(/[?#]/)[0].replace(/^\//,''))).filter(fs.existsSync))];
    const js=local.filter(a=>a.endsWith('.js')).reduce((n,a)=>n+zlib.gzipSync(fs.readFileSync(a)).length,0);
    const css=local.filter(a=>a.endsWith('.css')).reduce((n,a)=>n+zlib.gzipSync(fs.readFileSync(a)).length,0);
    rows.push({js,css,transfer:fs.statSync(file).size+js+css,requests:1+urls.length});
  }
  const peak=key=>Math.max(0,...rows.map(row=>row[key]));
  return {routes:rows.length,peakJsGzipBytes:peak('js'),peakCssGzipBytes:peak('css'),peakTransferBytes:peak('transfer'),peakRequests:peak('requests')};
}

export function summarizePlaywright(file){
  if(!fs.existsSync(file))return null;
  const report=JSON.parse(fs.readFileSync(file,'utf8'));
  const projects={};
  const visitSuite=suite=>{
    for(const spec of suite.specs||[]){
      for(const test of spec.tests||[]){
        const project=test.projectName||'unknown';
        projects[project]??={passed:0,failed:0,skipped:0,total:0};
        projects[project].total++;
        const results=test.results||[];const last=results.at(-1);
        const status=test.status||last?.status||test.outcome||'unknown';
        if(test.expectedStatus==='skipped'||status==='skipped')projects[project].skipped++;
        else if(status==='expected'||status==='passed')projects[project].passed++;
        else projects[project].failed++;
      }
    }
    for(const child of suite.suites||[])visitSuite(child);
  };
  for(const suite of report.suites||[])visitSuite(suite);
  const totals=Object.values(projects).reduce((a,p)=>({passed:a.passed+p.passed,failed:a.failed+p.failed,skipped:a.skipped+p.skipped,total:a.total+p.total}),{passed:0,failed:0,skipped:0,total:0});
  return {projects,totals};
}


export const mandatoryBrowserProjects=['chromium','firefox','webkit','mobile'];

export function validateMandatoryBrowserEvidence(browserEvidence){
  const errors=[];
  if(!browserEvidence?.projects||!browserEvidence?.totals)return ['full browser evidence is missing or failed'];
  const aggregate={passed:0,failed:0,skipped:0,total:0};
  for(const projectName of mandatoryBrowserProjects){
    const project=browserEvidence.projects[projectName];
    if(!project||!Number.isInteger(project.total)||project.total<1){errors.push(`full browser evidence is missing required project: ${projectName}`);continue;}
    for(const field of ['passed','failed','skipped','total'])if(!Number.isInteger(project[field])||project[field]<0)errors.push(`browser evidence for ${projectName} has invalid ${field}`);
    if(project.passed+project.failed+project.skipped!==project.total)errors.push(`browser evidence totals are inconsistent for ${projectName}`);
    if(project.failed!==0)errors.push(`browser project failed: ${projectName}`);
    aggregate.passed+=project.passed;aggregate.failed+=project.failed;aggregate.skipped+=project.skipped;aggregate.total+=project.total;
  }
  const totals=browserEvidence.totals;
  for(const field of ['passed','failed','skipped','total']){
    if(!Number.isInteger(totals[field])||totals[field]<0)errors.push(`aggregate browser evidence has invalid ${field}`);
    else if(totals[field]!==aggregate[field])errors.push(`aggregate browser ${field} does not match project totals`);
  }
  if(totals.failed!==0)errors.push('full browser evidence contains failures');
  return errors;
}

export function parseLicenseSummary(text=''){
  const clean=stripAnsi(text);const match=clean.match(/Dependency license inventory passed:\s*(\d+) packages?,\s*(\d+) license expressions?,\s*(\d+) unresolved/i);
  return match?{packages:+match[1],licenseExpressions:+match[2],unresolved:+match[3]}:null;
}

export function parseSnapshotSummary(text=''){
  const clean=stripAnsi(text);const entries=clean.match(/(\d+) (?:portable|forward-slash) entries/i);const recovery=clean.match(/(\d+) recovery files/i);
  return {entries:entries?+entries[1]:null,recoveryFiles:recovery?+recovery[1]:null};
}
