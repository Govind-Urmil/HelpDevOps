import {defineConfig,devices} from '@playwright/test';
const remoteUrl=process.env.PLAYWRIGHT_BASE_URL;
export default defineConfig({
  testDir:'tests/e2e',fullyParallel:true,retries:0,
  expect:{timeout:10000},
  reporter:[['list'],['html',{open:'never',outputFolder:'evidence/playwright-report'}],['json',{outputFile:'evidence/playwright-results.json'}]],
  use:{baseURL:remoteUrl||'http://127.0.0.1:4321',trace:'retain-on-failure',screenshot:'only-on-failure'},
  webServer:remoteUrl?undefined:{command:'node scripts/serve-dist.mjs',url:'http://127.0.0.1:4321',reuseExistingServer:true},
  projects:[{name:'chromium',use:{...devices['Desktop Chrome']}},{name:'firefox',use:{...devices['Desktop Firefox']}},{name:'webkit',use:{...devices['Desktop Safari']}},{name:'mobile',use:{...devices['Pixel 7']}}]
});
