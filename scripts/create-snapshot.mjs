import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import AdmZip from 'adm-zip';
import {snapshotName} from './snapshot-config.mjs';

const root=process.cwd();
const target=path.join(path.dirname(root),snapshotName);
const result=spawnSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:root,encoding:'buffer'});
if(result.status!==0)throw new Error(`Unable to obtain the Git commit manifest: ${result.stderr?.toString('utf8')||'unknown error'}`);
const files=result.stdout.toString('utf8').split('\0').filter(Boolean).sort();
const zip=new AdmZip();
for(const archivePath of files){
  const absolute=path.join(root,...archivePath.split('/'));
  if(!fs.statSync(absolute).isFile())continue;
  zip.addFile(archivePath,fs.readFileSync(absolute));
}
zip.writeZip(target);
console.log(`Created Git-manifest snapshot with ${files.length} files: ${target}`);
