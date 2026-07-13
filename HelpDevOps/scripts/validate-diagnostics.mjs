import fs from 'node:fs';import path from 'node:path';import {diagnosticJourneys} from '../src/diagnostics/registry.js';import {validateDiagnosticJourney,buildDiagnosticSearchIndex} from '../src/diagnostics/validation.js';import risks from '../src/diagnostics/config/risk-levels.json' with {type:'json'};
const errors=[]; const ids=new Set();
for(const journey of diagnosticJourneys){if(ids.has(journey.id))errors.push(`Duplicate journey id: ${journey.id}`);ids.add(journey.id);errors.push(...validateDiagnosticJourney(journey,{riskIds:risks.map(r=>r.id)}));}
if(errors.length)throw new Error(errors.join('\n'));
const generated=path.join(process.cwd(),'src','generated');fs.mkdirSync(generated,{recursive:true});
fs.writeFileSync(path.join(generated,'diagnostic-search-index.json'),JSON.stringify(buildDiagnosticSearchIndex(diagnosticJourneys),null,2)+'\n');
fs.writeFileSync(path.join(generated,'diagnostic-registry.json'),JSON.stringify(diagnosticJourneys.map(({nodes,examples,references,...j})=>({...j,nodeCount:nodes.length,referenceCount:references.length})),null,2)+'\n');
console.log(`Diagnostic validation passed: ${diagnosticJourneys.length} journeys.`);
