import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('review provenance and public methodology are honest and connected',async({page})=>{
 await page.goto('/troubleshoot/kubernetes/crashloopbackoff/');
 await expect(page.locator('.journey-trust')).toContainText('Reviewed guidance');
 await expect(page.locator('.journey-trust')).toContainText('Synthetic fixtures');
 await page.locator('.journey-trust summary').click();
 await page.getByRole('link',{name:/What “Reviewed guidance” means/}).click();
 await expect(page).toHaveURL(/issues\/methodology/);
 await expect(page.getByRole('heading',{level:1})).toContainText('Reviewed guidance');
 await expect(page.locator('main')).toContainText('not a claim of independent expert review');
});

test('exact launch errors search locally and zero results recover usefully',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Search HelpDevOps'}).click();
 await page.locator('[data-search-input]').fill('port is already allocated');
 await expect(page.locator('[data-search-results]')).toContainText('Docker port already allocated');
 await page.locator('[data-search-input]').fill('definitely unsupported frobnicator');
 await expect(page.locator('[data-search-results]')).toContainText('No reviewed destination matched');
 await expect(page.locator('[data-search-results]')).toContainText('Analyze redacted evidence');
});

test('issue entry is unique, useful, linked and accessible',async({page})=>{
 await page.goto('/issues/kubernetes-imagepullbackoff/');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Kubernetes ImagePullBackOff investigation');
 await expect(page.locator('main')).toContainText('First safe checks');
 await expect(page.locator('main')).toContainText('Mistake to avoid');
 await expect(page.getByRole('link',{name:'Open the complete guided investigation'})).toHaveAttribute('href','/troubleshoot/kubernetes/image-pull-backoff/');
 const results=await new AxeBuilder({page}).analyze();
 expect(results.violations.filter(item=>['serious','critical'].includes(item.impact))).toEqual([]);
});

test('launch surfaces reflow at required widths without console errors',async({page})=>{
 const errors=[];page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
 for(const width of [1440,1280,1024,768,390,360,320]){
  await page.setViewportSize({width,height:900});
  for(const route of ['/','/issues/','/issues/docker-port-allocated/','/issues/methodology/','/workspace/','/404.html']){
   await page.goto(route);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),`${route} at ${width}px`).toBe(true);
  }
 }
 expect(errors).toEqual([]);
});
