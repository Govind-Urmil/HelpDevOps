import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('favorites and recent tools store metadata without raw input', async ({ page }) => {
  await page.goto('/tools/');
  await page.locator('[data-tool-card="cron"] [data-favorite-tool]').click();
  await page.goto('/tools/cron/');
  await page.locator('#cron-input').fill('SECRET_INPUT_SHOULD_NOT_BE_RECENT');
  const stored = await page.evaluate(() => localStorage.getItem('helpdevops.preferences.v1'));
  expect(stored).toContain('cron');
  expect(stored).not.toContain('SECRET_INPUT_SHOULD_NOT_BE_RECENT');
  await page.goto('/workspace/');
  await expect(page.locator('[data-favorite-list]')).toContainText('Cron Analyzer');
  await expect(page.locator('[data-recent-list]')).toContainText('Cron Analyzer');
});

test('explicit save persists a workspace and reopening restores input only', async ({ page }) => {
  await page.goto('/tools/cron/');
  await page.locator('#cron-input').fill('30 9 * * 1-5');
  await page.locator('header [data-session-open]').click();
  await page.locator('[data-workspace-title-input]').fill('Weekday schedule');
  await page.locator('[data-save-current-tool]').click();
  await expect(page.locator('[data-session-dock] [data-workspace-status]')).toContainText('saved in this browser');
  await page.goto('/workspace/');
  await expect(page.locator('[data-workspace-list]')).toContainText('Weekday schedule');
  await page.locator('[data-workspace-open]').click();
  await expect(page).toHaveURL(/\/tools\/cron\/$/);
  await expect(page.locator('#cron-input')).toHaveValue('30 9 * * 1-5');
  await expect(page.locator('[data-session-dock] [data-workspace-status]')).toContainText('Re-run analysis');
});

test('private-key material is blocked before saving', async ({ page }) => {
  await page.goto('/tools/structured-data/');
  await page.locator('#structured-input').fill('-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----');
  await page.locator('header [data-session-open]').click();
  await page.locator('[data-workspace-title-input]').fill('Unsafe content');
  page.once('dialog', async dialog => { expect(dialog.message()).toContain('private-key material'); await dialog.accept(); });
  await page.locator('[data-save-current-tool]').click();
  await expect(page.locator('[data-session-dock] [data-workspace-status]')).toContainText('cannot be saved');
  await page.goto('/workspace/');
  await expect(page.locator('[data-workspace-list]')).not.toContainText('Unsafe content');
});

test('export is local and clear-all removes workspace data', async ({ page }) => {
  await page.goto('/tools/ipv4-cidr/');
  await page.locator('header [data-session-open]').click();
  await page.locator('[data-workspace-title-input]').fill('Subnet review');
  page.once('dialog', dialog => dialog.accept());
  await page.locator('[data-save-current-tool]').click();
  await expect(page.locator('[data-session-dock] [data-workspace-status]')).toContainText('saved in this browser');
  await page.goto('/workspace/');
  const downloadPromise = page.waitForEvent('download');
  page.once('dialog', async dialog => { expect(dialog.message()).toContain('Possible sensitive content'); await dialog.accept(); });
  await page.locator('[data-export-all]').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/helpdevops-workspaces/);
  page.once('dialog', dialog => dialog.accept());
  await page.locator('[data-clear-all-local]').click();
  await expect(page.locator('[data-workspace-list]')).toContainText('No saved workspaces');
  expect(await page.evaluate(() => localStorage.getItem('helpdevops.preferences.v1'))).toBeNull();
});

test('validated import merges workspace data', async ({ page }) => {
  const exportData = {
    format:'helpdevops-workspace',formatVersion:1,exportedAt:'2026-07-13T00:00:00Z',applicationVersion:'0.5.0',
    workspaces:[{id:'imported1',schemaVersion:1,revision:1,title:'Imported workspace',createdAt:'2026-07-13T00:00:00Z',updatedAt:'2026-07-13T00:00:00Z',lastOpenedAt:'2026-07-13T00:00:00Z',toolStates:[{toolId:'cron',toolSchemaVersion:1,input:{'cron-input':'0 0 * * *'},options:{},resultSnapshot:null}],notes:'',source:'manual-save',sensitivity:{status:'reviewed',warningsAcknowledged:[]}}]
  };
  await page.goto('/workspace/');
  await page.locator('[data-import-file]').setInputFiles({name:'workspace.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exportData))});
  await expect(page.locator('[data-workspace-list]')).toContainText('Imported workspace');
});

test('favorite changes notify another tab from persisted state without transferring raw content', async ({ page, context }) => {
  const second = await context.newPage();
  await page.goto('/tools/'); await second.goto('/workspace/');
  const favorite = page.locator('[data-tool-card="cron"] [data-favorite-tool]');
  await favorite.click();
  await expect(second.locator('[data-favorite-list]')).toContainText('Cron Analyzer');
  await expect.poll(() => second.evaluate(() => JSON.parse(localStorage.getItem('helpdevops.preferences.v1')).favorites)).toContain('cron');
  await favorite.click();
  await expect(second.locator('[data-favorite-list]')).toContainText('No favorites yet.');
  await expect.poll(() => second.evaluate(() => JSON.parse(localStorage.getItem('helpdevops.preferences.v1')).favorites)).not.toContain('cron');
  await second.close();
});

test('saved workspace can be renamed, duplicated, and deleted', async ({ page }) => {
  await page.goto('/tools/cron/');
  await page.locator('#cron-input').fill('15 8 * * 1-5');
  await page.locator('header [data-session-open]').click();
  await page.locator('[data-workspace-title-input]').fill('Lifecycle workspace');
  await page.locator('[data-save-current-tool]').click();
  await expect(page.locator('[data-session-dock] [data-workspace-status]')).toContainText('saved in this browser');
  await page.goto('/workspace/');

  page.once('dialog', dialog => dialog.accept('Renamed workspace'));
  await page.locator('[data-workspace-rename]').click();
  await expect(page.locator('[data-workspace-list]')).toContainText('Renamed workspace');

  await page.locator('[data-workspace-duplicate]').click();
  await expect(page.locator('[data-workspace-list]')).toContainText('Renamed workspace (Copy)');
  await expect(page.locator('[data-workspace-count]')).toHaveText('2');

  page.once('dialog', dialog => dialog.accept());
  await page.locator('[data-workspace-delete]').last().click();
  await expect(page.locator('[data-workspace-count]')).toHaveText('1');
  page.once('dialog', dialog => dialog.accept());
  await page.locator('[data-workspace-delete]').click();
  await expect(page.locator('[data-workspace-count]')).toHaveText('0');
  await expect(page.locator('[data-workspace-list]')).toContainText('No saved workspaces');
});

test('replace import validates malformed and unsupported files before replacing', async ({ page }) => {
  const record = {id:'replacement1',schemaVersion:1,revision:1,title:'Replacement workspace',createdAt:'2026-07-13T00:00:00Z',updatedAt:'2026-07-13T00:00:00Z',lastOpenedAt:'2026-07-13T00:00:00Z',toolStates:[{toolId:'cron',toolSchemaVersion:1,input:{'cron-input':'0 6 * * *'},options:{},resultSnapshot:null}],notes:'',source:'manual-save',sensitivity:{status:'reviewed',warningsAcknowledged:[]}};
  await page.goto('/workspace/');
  const input = page.locator('[data-import-file]');
  await input.setInputFiles({name:'malformed.json',mimeType:'application/json',buffer:Buffer.from('{bad')});
  await expect(page.locator('[data-workspace-status]').last()).toContainText('valid JSON');
  await input.setInputFiles({name:'unsupported.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'helpdevops-workspace',formatVersion:2,workspaces:[]}))});
  await expect(page.locator('[data-workspace-status]').last()).toContainText('Unsupported');
  await page.locator('[data-import-mode]').selectOption('replace');
  page.once('dialog', dialog => dialog.accept());
  await input.setInputFiles({name:'replacement.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'helpdevops-workspace',formatVersion:1,exportedAt:'2026-07-13T00:00:00Z',applicationVersion:'0.5.0',workspaces:[record]}))});
  await expect(page.locator('[data-workspace-list]')).toContainText('Replacement workspace');
  await expect(page.locator('[data-workspace-count]')).toHaveText('1');
});

test('Universal Input transfer can be explicitly saved and restored without external requests', async ({ page }) => {
  const external = [];
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4321/')) external.push(request.url()); });
  await page.goto('/');
  await page.locator('[data-analysis-input]').fill('*/12 * * * *');
  await page.locator('[data-analyze]').click();
  await page.locator('[data-send-result]').click();
  await expect(page).toHaveURL(/\/tools\/cron\/$/);
  await expect(page.locator('#cron-input')).toHaveValue('*/12 * * * *');
  await page.locator('header [data-session-open]').click();
  await page.locator('[data-workspace-title-input]').fill('Transferred cron');
  await page.locator('[data-save-current-tool]').click();
  await expect(page.locator('[data-session-dock] [data-workspace-status]')).toContainText('saved in this browser');
  await page.goto('/workspace/');
  await page.locator('[data-workspace-open]').click();
  await expect(page.locator('#cron-input')).toHaveValue('*/12 * * * *');
  expect(external).toEqual([]);
});

test('core tools remain usable when IndexedDB is unavailable', async ({ browser }) => {
  const context = await browser.newContext();
  await context.addInitScript(() => Object.defineProperty(window,'indexedDB',{value:undefined,configurable:true}));
  const page = await context.newPage();
  await page.goto('/tools/cron/');
  await page.locator('#cron-input').fill('*/10 * * * *');
  await page.getByRole('button',{name:'Analyze cron'}).click();
  await expect(page.getByText('Common five-field cron expression recognized')).toBeVisible();
  await page.locator('header [data-session-open]').click();
  await expect(page.locator('[data-session-dock]')).toContainText('Workspace storage unavailable');
  await context.close();
});

test('workspace is keyboard accessible and reflows without overflow', async ({ page }) => {
  await page.setViewportSize({width:640,height:900});
  await page.goto('/workspace/');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
  const result=await new AxeBuilder({page}).analyze();
  expect(result.violations.filter(v=>['serious','critical'].includes(v.impact))).toEqual([]);
});
