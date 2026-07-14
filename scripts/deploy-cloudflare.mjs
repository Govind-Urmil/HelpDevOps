import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync,readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {validateMandatoryBrowserEvidence} from './certification-evidence.mjs';
import {validateDeploymentEnvironment} from './deployment-environment.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');

export function resolveNpmCommand(platform=process.platform){return platform==='win32'?'npm.cmd':'npm';}
export function sha256(file){const hash=createHash('sha256');hash.update(readFileSync(file));return hash.digest('hex').toUpperCase();}
export function loadCertification(rootDir=root){
 const file=resolve(rootDir,'release-certification','certification.json');
 if(!existsSync(file))throw new Error('Deployment requires a current full release certification. Run npm run certify:release first.');
 return JSON.parse(readFileSync(file,'utf8'));
}
export function validateCertificationForDeployment({manifest,release,currentCommit,treeClean}){
 const errors=[];
 if(manifest.gate!=='passed')errors.push('certification gate is not passed');
 if(manifest.profile!=='full')errors.push('certification profile is not full');
 if(manifest.version!==release.version||manifest.ep!==release.ep)errors.push('certification release identity does not match current release');
 if(!manifest.source?.gitAvailable||manifest.source.sourceCommit!==currentCommit)errors.push('certification source commit does not match current Git commit');
 if(manifest.source.sourceTreeClean!==true||manifest.source.sourceTreeCleanAfter!==true||treeClean!==true)errors.push('certified/current source tree is not clean');
 if(!manifest.package?.path||!manifest.package?.sha256)errors.push('certification package identity is incomplete');
 else if(!existsSync(manifest.package.path))errors.push('certified release ZIP is missing');
 else if(sha256(manifest.package.path)!==manifest.package.sha256)errors.push('certified release ZIP checksum no longer matches');
 for(const browserError of validateMandatoryBrowserEvidence(manifest.evidence?.browserTests))errors.push(browserError);
 if(errors.length)throw new Error(`Deployment certification rejected: ${errors.join('; ')}.`);
 return true;
}

function run(command,args,env={}){
 const result=spawnSync(command,args,{cwd:root,stdio:'inherit',shell:process.platform==='win32',env:{...process.env,...env}});
 if(result.status!==0)process.exit(result.status||1);
}
function git(commandArgs){const result=spawnSync('git',commandArgs,{cwd:root,encoding:'utf8',shell:false});if(result.status!==0)throw new Error(`Git command failed: git ${commandArgs.join(' ')}`);return result.stdout.trim();}
function main(){
 const target=process.argv[2];if(!['preview','production'].includes(target))throw new Error('Deployment target must be preview or production.');
 const release=JSON.parse(readFileSync(resolve(root,'release-meta.json'),'utf8'));
 const manifest=loadCertification(root);
 const currentCommit=git(['rev-parse','HEAD']);const treeClean=git(['status','--porcelain']).length===0;
 validateCertificationForDeployment({manifest,release,currentCommit,treeClean});
 const siteUrl=process.env.PUBLIC_SITE_URL;
 const deploymentErrors=validateDeploymentEnvironment({channel:target,siteUrl});
 if(deploymentErrors.length)throw new Error(`Deployment environment rejected: ${deploymentErrors.join('; ')}.`);
 const env={RELEASE_CHANNEL:target,PUBLIC_SITE_URL:siteUrl};
 run(resolveNpmCommand(),['run','check'],env);run(resolveNpmCommand(),['run','build'],env);
 run(resolveNpmCommand(),['exec','--','wrangler','deploy','--env',target],env);
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main();
