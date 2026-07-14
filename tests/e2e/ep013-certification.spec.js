import {test,expect} from '@playwright/test';
test('owner focused browser smoke covers representative release surfaces',async({page})=>{
 const external=[];page.on('request',r=>{const u=new URL(r.url());if(!['127.0.0.1','localhost'].includes(u.hostname))external.push(r.url());});
 for(const route of ['/','/tools/cron/','/troubleshoot/linux/disk-full/','/interpret/df/','/reference/filesystem-blocks-inodes/','/workspace/','/incident-brief/']){
  await page.goto(route);await expect(page.locator('main')).toBeVisible();await expect(page).toHaveTitle(/HelpDevOps/);
 }
 expect(external).toEqual([]);
});
