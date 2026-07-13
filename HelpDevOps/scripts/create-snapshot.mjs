import fs from 'node:fs';import path from 'node:path';import AdmZip from 'adm-zip';import {snapshotName,excludedNames,excludedFiles} from './snapshot-config.mjs';
const root=process.cwd();const target=path.join(path.dirname(root),snapshotName);const zip=new AdmZip();
function add(directory,relative=''){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){if(excludedNames.has(entry.name)||excludedFiles.has(entry.name)||entry.name.endsWith('.log')||entry.name.endsWith('.zip'))continue;const absolute=path.join(directory,entry.name);const archivePath=path.posix.join(relative,entry.name);if(entry.isDirectory())add(absolute,archivePath);else zip.addFile(archivePath,fs.readFileSync(absolute))}}
add(root);zip.writeZip(target);console.log(`Created portable full snapshot: ${target}`);
