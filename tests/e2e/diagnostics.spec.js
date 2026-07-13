import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const routes=['/troubleshoot/linux/disk-full/','/troubleshoot/docker/container-exits-immediately/','/troubleshoot/kubernetes/pod-pending/'];

test('diagnostic hubs and journeys are crawlable',async({page})=>{
  await page.goto('/troubleshoot/');await expect(page.getByRole('heading',{name:'Find the safest next check'})).toBeVisible();
  for(const route of routes){await page.goto(route);await expect(page.locator('[data-diagnostic-root]')).toBeVisible();await expect(page.locator('[data-step-title]')).toBeVisible()}
});

test('journey progresses, goes back, restarts, and switches emergency view',async({page})=>{
  await page.goto(routes[0]);const first=await page.locator('[data-step-title]').textContent();
  await page.locator('[data-choice-list] button').first().click();await expect(page.locator('[data-step-title]')).not.toHaveText(first);
  await page.getByRole('button',{name:'Previous step'}).click();await expect(page.locator('[data-step-title]')).toHaveText(first);
  await page.getByRole('button',{name:'Emergency view'}).click();await expect(page.locator('[data-diagnostic-root]')).toHaveAttribute('data-emergency','true');
  await page.getByRole('button',{name:'Restart journey'}).click();await expect(page.locator('[data-step-title]')).toHaveText(first);
});

test('diagnostic routes reflow and have no serious accessibility violations',async({page})=>{
  await page.setViewportSize({width:640,height:900});
  for(const route of routes){await page.goto(route);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);const result=await new AxeBuilder({page}).analyze();expect(result.violations.filter(v=>['serious','critical'].includes(v.impact))).toEqual([])}
});
