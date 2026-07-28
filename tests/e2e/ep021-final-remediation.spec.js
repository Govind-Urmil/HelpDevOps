import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('brand, footer, metadata and contextual correction placement are final',async({page})=>{
  await page.goto('/');
  await expect(page.locator('header .brand-mark')).toBeVisible();
  await expect(page.locator('footer .brand-mark')).toBeVisible();
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href','/favicon.svg');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content',/brand-social\.svg$/);
  await expect(page.locator('footer')).not.toContainText(/EP-\d{3}|v0\.\d+\.\d+|Preflight|Technical Correction/i);
  await expect(page.locator('.correction-report')).toHaveCount(0);
  await page.goto('/workspace/');
  await expect(page.locator('.correction-report')).toHaveCount(1);
});

test('hero remains balanced and overflow-free at required widths',async({page})=>{
  for(const width of [1440,1280,1024,768,390,360,320]){
    await page.setViewportSize({width,height:900});
    await page.goto('/');
    await expect(page.getByRole('link',{name:'Analyze Evidence'})).toBeVisible();
    await expect(page.getByRole('link',{name:'Browse Investigations'})).toBeVisible();
    const metrics=await page.locator('[data-hero-network]').evaluate(element=>({height:element.getBoundingClientRect().height,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth}));
    expect(metrics.overflow,`${width}px overflow`).toBe(false);
    if(width<768)expect(metrics.height,`${width}px network height`).toBeLessThanOrEqual(80);
    else expect(metrics.height).toBeGreaterThan(80);
  }
});

test('network has a complete static reduced-motion state and pauses offscreen',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();await page.goto('/');
  const network=page.locator('[data-hero-network]');
  await expect(network).toHaveAttribute('data-paused','true');
  await expect(network.locator('.recover')).toHaveCSS('opacity','1');
  await context.close();

  const normal=await browser.newContext({viewport:{width:1280,height:800}});
  const visiblePage=await normal.newPage();await visiblePage.goto('/');
  await expect(visiblePage.locator('[data-hero-network]')).toHaveAttribute('data-paused','false');
  await visiblePage.locator('footer').scrollIntoViewIfNeeded();
  await expect(visiblePage.locator('[data-hero-network]')).toHaveAttribute('data-paused','true');
  await normal.close();
});

test('public output has no engineering release label and remains accessible',async({page})=>{
  for(const route of ['/','/workspace/','/tools/','/troubleshoot/','/reference/','/about/','/404.html']){
    await page.goto(route);
    await expect(page.locator('body')).not.toContainText(/EP-\d{3}|v0\.\d+\.\d+/);
  }
  await page.goto('/');
  const results=await new AxeBuilder({page}).analyze();
  expect(results.violations.filter(item=>['serious','critical'].includes(item.impact))).toEqual([]);
});
