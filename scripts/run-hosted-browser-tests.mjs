import {spawnSync} from 'node:child_process';
const args=process.argv.slice(2);const ix=args.indexOf('--url');const url=ix>=0?args[ix+1]:process.env.PREVIEW_URL;
if(!url)throw new Error('Provide --url https://... or PREVIEW_URL.');
let preview;try{preview=new URL(url)}catch{throw new Error('The hosted preview URL is invalid.');}
if(preview.protocol!=='https:')throw new Error('The hosted preview URL must use HTTPS.');
if(['localhost','127.0.0.1','::1'].includes(preview.hostname))throw new Error('The hosted preview workflow requires a deployed, non-local URL.');
const command=process.platform==='win32'?'npm.cmd':'npm';
const result=spawnSync(command,['exec','--','playwright','test','tests/e2e/ep014-hosted-preview.spec.js'],{stdio:'inherit',shell:process.platform==='win32',env:{...process.env,HELPDEVOPS_HOSTED_PREVIEW:'1',PLAYWRIGHT_BASE_URL:preview.href}});
if(result.error)throw result.error;
process.exit(result.status??1);
