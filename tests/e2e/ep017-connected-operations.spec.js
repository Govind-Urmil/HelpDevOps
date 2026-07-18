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

test('CrashLoopBackOff branch synchronizes canonical state and survives workspace restore',async({page})=>{
  await page.goto('/troubleshoot/kubernetes/crashloopbackoff/');const embedded=page.locator('[data-embedded-capability="kubernetes-manifest"]');
  await embedded.locator('[data-capability-input]').fill('apiVersion: v1\nkind: Pod\nmetadata:\n  name: api\nspec:\n  containers:\n    - name: api\n      image: nginx:1.27');await embedded.locator('[data-run-capability]').click();
  await page.getByRole('button',{name:'Application or sidecar'}).click();let state=JSON.parse(await page.locator('[data-investigation-state]').inputValue());
  expect(state.findings.confirmed.map(item=>item.label)).toContain('Application or sidecar');expect(state.findings.unknown).toHaveLength(1);expect(state.findings.excluded).toHaveLength(2);expect(state.verification.status).toBe('not-started');expect(state.unresolvedRisks).toHaveLength(1);expect(state.nextAction).toBe('Use current logs, previous logs, reason, code and signal.');
  await page.locator('header [data-session-open]').click();await page.locator('[data-workspace-title-input]').fill('EP-017.1 state');page.once('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'Save journey explicitly'}).click();await expect(page.locator('[data-session-dock] [data-workspace-status]')).toContainText('saved in this browser');
  await page.goto('/workspace/');await page.locator('[data-workspace-open]').click();await expect(page).toHaveURL(/crashloopbackoff/);const restoredState=page.locator('[data-investigation-state]');await expect(restoredState).not.toHaveValue('');state=JSON.parse(await restoredState.inputValue());expect(state.findings.confirmed.map(item=>item.label)).toContain('Application or sidecar');expect(state.capabilityResults).toHaveLength(1);
});

test('Incident Brief is populated from canonical investigation and capability findings',async({page})=>{
  await page.goto('/troubleshoot/kubernetes/crashloopbackoff/');const embedded=page.locator('[data-embedded-capability="kubernetes-manifest"]');
  await embedded.locator('[data-capability-input]').fill('apiVersion: v1\nkind: Pod\nmetadata:\n  name: api\nspec:\n  containers:\n    - name: api\n      image: nginx:1.27');await embedded.locator('[data-run-capability]').click();await page.getByRole('button',{name:'Application or sidecar'}).click();
  let guard=0;while(await page.locator('[data-build-incident-brief]').isHidden()&&guard++<12)await page.locator('[data-choice-list] button').first().click();
  await page.locator('[data-build-incident-brief]').click();await expect(page).toHaveURL(/incident-brief/);const observations=page.locator('[name="observations"]');await expect(observations).toHaveValue(/Capability: Kubernetes Manifest Analyzer/);await expect(observations).toHaveValue(/no resource requests or limits/);await expect(observations).toHaveValue(/no readiness, liveness, or startup probe/);await expect(observations).toHaveValue(/runAsNonRoot is not explicitly true/);await expect(observations).toHaveValue(/Application or sidecar/);await expect(page.locator('[name="verification"]')).not.toHaveValue('');await expect(page.locator('[name="riskNotes"]')).not.toHaveValue('');await expect(page.locator('[name="nextStep"]')).not.toHaveValue('');
});
