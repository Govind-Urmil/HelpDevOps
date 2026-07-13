import fs from 'node:fs';
import path from 'node:path';
import {publishedJourneys} from '../src/diagnostics/registry.js';
import {interpretEvidence} from '../src/core/evidence/interpreter.js';

const root=path.join(process.cwd(),'src','resources','evidence');
if(!fs.existsSync(root))throw new Error('Evidence resource root is missing.');
const journeyIds=new Set(publishedJourneys.filter(item=>item.status==='reviewed').map(item=>item.id));
const ids=[];
let fixtureCount=0;
for(const dir of fs.readdirSync(root)){
  if(dir==='shared.json')continue;
  const defPath=path.join(root,dir,'definition.json');
  const fixPath=path.join(root,dir,'fixtures.json');
  if(!fs.existsSync(defPath)||!fs.existsSync(fixPath))throw new Error(`${dir}: missing definition or fixtures`);
  const def=JSON.parse(fs.readFileSync(defPath));
  const fixtures=JSON.parse(fs.readFileSync(fixPath));
  if(def.id!==dir)throw new Error(`${dir}: id mismatch`);
  if(ids.includes(def.id))throw new Error(`${dir}: duplicate parser id`);
  ids.push(def.id);
  if(def.reviewStatus!=='reviewed')throw new Error(`${dir}: parser resource must be reviewed`);
  if(!journeyIds.has(def.relatedJourneyId))throw new Error(`${dir}: related journey must exist and be reviewed`);
  if(!def.limitations?.length||!def.references?.length)throw new Error(`${dir}: missing limitations or references`);
  if(!def.supportedFormats?.structured?.length&&!def.supportedFormats?.humanReadable?.length)throw new Error(`${dir}: no supported format`);
  if(!def.privacyReviewRequired)throw new Error(`${dir}: privacy review must be required`);
  for(const command of def.recommendedCommands||[])if(/\b(?:prune|delete|remove|rm\s|force-unlock|apply|restart|stop)\b/i.test(command))throw new Error(`${dir}: evidence collection command appears state-changing: ${command}`);
  if(!fixtures.fixtures?.length)throw new Error(`${dir}: fixtures missing`);
  for(const fixture of fixtures.fixtures){
    fixtureCount+=1;
    if(!fixture.id||!fixture.input||!fixture.format)throw new Error(`${dir}: invalid fixture`);
    if(fixture.fixtureType!=='synthetic'||fixture.containsRealEnvironmentData!==false)throw new Error(`${dir}: fixture provenance must be synthetic and non-production`);
    if(fixture.expectedParserId!==dir||fixture.expectedStatus!=='recognized')throw new Error(`${dir}/${fixture.id}: expected parser/status metadata is missing or inconsistent`);
    const result=interpretEvidence(fixture.input,{source:dir});
    if(result.parserId!==fixture.expectedParserId||result.status!==fixture.expectedStatus)throw new Error(`${dir}/${fixture.id}: fixture execution returned ${result.parserId||'none'}/${result.status}`);
  }
}
if(ids.length!==5)throw new Error(`Expected 5 evidence interpreters, found ${ids.length}`);
console.log(`Evidence validation passed: ${ids.length} reviewed interpreters and ${fixtureCount} executable synthetic fixtures.`);
