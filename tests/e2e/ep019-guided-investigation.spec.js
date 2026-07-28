import { test, expect } from '@playwright/test';

test('homepage presents one primary path and compact platform routes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Analyze evidence' })).toHaveAttribute('href', '#analyze');
  await expect(page.getByRole('link', { name: 'Browse Investigations' })).toHaveAttribute('href', '/troubleshoot/');
  await expect(page.locator('.platform-path')).toHaveCount(2);
});

test('journey supports context, follow-up evidence, progress and prerequisites', async ({ page }) => {
  await page.goto('/troubleshoot/kubernetes/image-pull-backoff/');
  await expect(page.locator('[data-current-step-bar]')).toBeVisible();
  await page.locator('[data-environment="cloud"]').selectOption('AWS');
  await page.getByRole('button', { name: /symptom and affected scope are confirmed/i }).click();
  await expect(page.locator('[data-progress-label]')).toHaveText('Step 2');
  await page.locator('[data-follow-up-evidence]').fill('Failed to pull image: unauthorized: authentication required');
  await page.getByRole('button', { name: 'Interpret follow-up' }).click();
  await expect(page.locator('[data-follow-up-result]')).toContainText(/closest current branch|No current branch/i);
});

test('before-and-after verification never claims that changed output proves recovery', async ({ page }) => {
  await page.goto('/troubleshoot/networking/connection-timeout/');
  await page.getByText('Before-and-after verification').click();
  await page.locator('[data-before-evidence]').fill('connection timed out');
  await page.locator('[data-after-evidence]').fill('tcp connection established');
  await page.getByRole('button', { name: 'Compare evidence' }).click();
  await expect(page.locator('[data-comparison-result]')).toContainText('not proof of recovery');
});

test('investigation resume, feedback and privacy clearing remain local', async ({ page }) => {
  await page.goto('/troubleshoot/docker/network-connectivity/');
  await page.locator('[data-environment="registry"]').selectOption('Private registry');
  await page.getByRole('button', { name: 'Save and resume locally' }).click();
  await expect(page.locator('[data-investigation-storage-status]')).toContainText('only in this browser');
  await page.getByRole('button', { name: 'Did not solve' }).click();
  await expect(page.locator('[data-feedback-status]')).toContainText('not been transmitted');
  await page.reload();
  await expect(page.locator('[data-investigation-storage-status]')).toContainText('Saved investigation available');
  await page.getByRole('button', { name: 'Clear saved investigation' }).click();
  await expect(page.locator('[data-investigation-storage-status]')).toContainText('cleared');
});

test('classification internals use progressive disclosure and mobile progress remains visible', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-analysis-input]').fill('permission denied');
  await page.locator('[data-analyze]').click();
  await expect(page.locator('.analysis-internals')).not.toHaveAttribute('open', '');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/troubleshoot/kubernetes/service-unreachable/');
  await expect(page.locator('[data-current-step-bar]')).toBeVisible();
  await expect(page.locator('body')).not.toHaveCSS('overflow-x', 'scroll');
});
