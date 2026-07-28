import {spawnSync} from 'node:child_process';
import {validateDeploymentEnvironment} from './deployment-environment.mjs';
const target=process.argv[2];if(!['preview','production'].includes(target))throw new Error('Target must be preview or production.');
const siteUrl=process.env.PUBLIC_SITE_URL||'https://helpdevops.work-on.workers.dev';
const errors=validateDeploymentEnvironment({channel:target,siteUrl});
if(target==='preview'&&siteUrl.includes('.example'))errors.push('Set PUBLIC_SITE_URL to the real preview Worker URL before preview dry run.');
if(errors.length)throw new Error(errors.join(' '));
const npm=process.platform==='win32'?'npm.cmd':'npm';
for(const [cmd,args] of [[npm,['run','check']],[npm,['run','build']],[npm,['exec','--','wrangler','deploy','--env',target,'--dry-run']]]){
 const result=spawnSync(cmd,args,{stdio:'inherit',shell:process.platform==='win32',env:{...process.env,RELEASE_CHANNEL:target,PUBLIC_SITE_URL:siteUrl}});if(result.status!==0)process.exit(result.status||1);
}
