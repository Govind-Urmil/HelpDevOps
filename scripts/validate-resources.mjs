import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const toolsText=fs.readFileSync(path.join(root,'src/config/tools.js'),'utf8');
const ids=[...toolsText.matchAll(/id:'([^']+)'/g)].map(match=>match[1]);
const duplicateIds=ids.filter((id,index)=>ids.indexOf(id)!==index);if(duplicateIds.length)throw new Error(`Duplicate tool IDs: ${duplicateIds.join(', ')}`);
const packs=[['cron','src/tools/cron/resources.json','src/tools/cron/examples.json'],['structured-data','src/tools/structured-data/resources.json','src/tools/structured-data/examples.json']];
for(const [tool,resourceFile,examplesFile] of packs){const resource=read(resourceFile);const examples=read(examplesFile);if(resource.tool!==tool)throw new Error(`${resourceFile}: tool mismatch`);if(!/^\d+\.\d+\.\d+$/.test(resource.schemaVersion)||!/^\d+\.\d+\.\d+$/.test(resource.resourceVersion))throw new Error(`${resourceFile}: invalid version`);if(!Array.isArray(resource.limitations)||resource.limitations.length<2)throw new Error(`${resourceFile}: limitations required`);if(!Array.isArray(resource.references)||!resource.references.length)throw new Error(`${resourceFile}: references required`);const exampleIds=examples.map(item=>item.id);const dupes=exampleIds.filter((id,index)=>exampleIds.indexOf(id)!==index);if(dupes.length)throw new Error(`${examplesFile}: duplicate IDs ${dupes.join(', ')}`);for(const example of examples){if(!example.id||!example.label||typeof example.input!=='string')throw new Error(`${examplesFile}: invalid example`);}}
console.log(`Resource validation passed: ${packs.length} packs, ${ids.length} tools.`);
