import {test,expect} from '@playwright/test';

test('Universal Input invokes a safe shared capability without leaving the page',async({page})=>{
  await page.goto('/');await page.locator('[data-analysis-input]').fill('*/5 * * * *');await page.locator('[data-analyze]').click();
  await expect(page.locator('[data-analysis-result]')).toBeVisible();await expect(page.locator('[data-result-kind]')).toHaveText('CRON');
  await expect(page).toHaveURL(/\/$/);
});

test('embedded capability adds structured state to a connected investigation',async({page})=>{
  await page.goto('/troubleshoot/cron/job-not-running/');const embedded=page.locator('[data-embedded-capability="cron"]');await expect(embedded).toBeVisible();
  await embedded.locator('[data-capability-input]').fill('0 2 * * *');await embedded.locator('[data-run-capability]').click();
  await expect(embedded.locator('[data-capability-status]')).toContainText('recognized');
  const state=JSON.parse(await page.locator('[data-investigation-state]').inputValue());expect(state.capabilityResults).toHaveLength(1);expect(state.stage).toBe('scope');
});

test('connected investigation remains keyboard operable and mobile-safe',async({page})=>{
  await page.setViewportSize({width:320,height:800});await page.goto('/troubleshoot/networking/dns-resolution/');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.locator('[data-capability-input]').focus();await expect(page.locator('[data-capability-input]')).toBeFocused();
});
