import {test,expect} from '@playwright/test';

const hostedPreviewEnabled=process.env.HELPDEVOPS_HOSTED_PREVIEW==='1'&&Boolean(process.env.PLAYWRIGHT_BASE_URL);

test.describe('EP-014 hosted preview smoke',()=>{
 test.skip(!hostedPreviewEnabled,'Requires the dedicated hosted-preview workflow and an explicit deployed preview URL.');
 test('preview identity, noindex, navigation and local-only behavior',async({page})=>{
   const external=[];page.on('request',request=>{const u=new URL(request.url());const base=new URL(page.context().pages()[0]?.url()||process.env.PLAYWRIGHT_BASE_URL);if(base.hostname&&u.hostname!==base.hostname)external.push(request.url())});
   await page.goto('/');
   await expect(page.getByRole('heading',{level:1})).toContainText('safest next step');
   await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow');
   await page.locator('#universal-input').fill('connection refused');
   await page.getByRole('button',{name:/Explore available paths|Analyze input/}).click();
   await expect(page.locator('[data-analysis-result]')).toBeVisible();
   expect(external.filter(url=>!url.startsWith('https://schema.org'))).toEqual([]);
 });
 test('workspace and incident brief remain browser-local on hosted origin',async({page})=>{
   await page.goto('/incident-brief/');
   await page.getByLabel(/Incident or problem summary/i).fill('Hosted preview smoke');
   await expect(page.getByText(/Summary only/i).first()).toBeVisible();
 });
 test('references, errors and 404 routes load',async({page})=>{
   for(const route of ['/reference/','/errors/','/workspace/']){await page.goto(route);await expect(page.locator('h1')).toBeVisible()}
   const response=await page.goto('/definitely-missing-preview-route');expect(response?.status()).toBe(404);
 });
});
