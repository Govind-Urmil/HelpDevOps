import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const channel = process.env.RELEASE_CHANNEL || 'local';
const configuredSite = process.env.PUBLIC_SITE_URL || 'https://helpdevops.work-on.workers.dev';
const siteUrl = new URL(configuredSite);
if (channel === 'production') {
  if (siteUrl.protocol !== 'https:' || siteUrl.hostname.endsWith('.example')) {
    throw new Error('Production build requires an approved HTTPS PUBLIC_SITE_URL without a placeholder domain.');
  }
}

export default defineConfig({
  site: siteUrl.href,
  output: 'static',
  integrations: [sitemap({ filter: page => !page.endsWith('/references/') })],
  build: { inlineStylesheets: 'never' }
});
