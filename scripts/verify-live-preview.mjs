import fs from 'node:fs';
import { normalizeSiteUrl } from './deployment-environment.mjs';

const args = process.argv.slice(2);
const ix = args.indexOf('--url');
const raw = ix >= 0 ? args[ix + 1] : process.env.PREVIEW_URL;

if (!raw) {
  throw new Error('Provide --url https://... or PREVIEW_URL.');
}

const base = normalizeSiteUrl(raw);

if (!base.startsWith('https://')) {
  throw new Error('Preview verification requires HTTPS.');
}

const missingRoute = '/__helpdevops_ep014_missing_route__';

const expectedRoutes = [
  '/',
  '/tools/',
  '/troubleshoot/',
  '/interpret/',
  '/reference/',
  '/errors/',
  '/workspace/',
  '/incident-brief/',
  '/references/',
  '/privacy/',
  missingRoute
];

const errors = [];
const checks = [];

for (const route of expectedRoutes) {
  const url = new URL(route, base);
  const res = await fetch(url, { redirect: 'manual' });
  const text = await res.text();

  const record = {
    route,
    status: res.status,
    contentType: res.headers.get('content-type'),
    robotsHeader: res.headers.get('x-robots-tag'),
    cacheControl: res.headers.get('cache-control')
  };

  checks.push(record);

  if (route === '/references/') {
    if (![200, 301, 302, 307, 308].includes(res.status)) {
      errors.push(`${route} returned ${res.status}`);
    }
  } else if (route === missingRoute) {
    if (res.status !== 404) {
      errors.push(`${route} must return 404, got ${res.status}`);
    }
  } else if (res.status !== 200) {
    errors.push(`${route} returned ${res.status}`);
  }

  if (
    route !== missingRoute &&
    route !== '/references/' &&
    !/noindex,nofollow/i.test(text)
  ) {
    errors.push(`${route} is missing preview noindex meta.`);
  }

  if (
    route !== missingRoute &&
    route !== '/references/' &&
    !/noindex\s*,?\s*nofollow/i.test(
      res.headers.get('x-robots-tag') || ''
    )
  ) {
    errors.push(`${route} is missing preview X-Robots-Tag.`);
  }

  if (text.includes('helpdevops.example')) {
    errors.push(`${route} leaks placeholder domain.`);
  }
}

const sitemap = await fetch(new URL('/sitemap-index.xml', base));
if (sitemap.status !== 200) {
  errors.push('sitemap-index.xml unavailable.');
}

const robots = await fetch(new URL('/robots.txt', base));
if (robots.status !== 200) {
  errors.push('robots.txt unavailable.');
}

const output = {
  base,
  checkedAt: new Date().toISOString(),
  checks,
  errors
};

fs.mkdirSync('evidence', { recursive: true });

fs.writeFileSync(
  'evidence/preview-validation.json',
  JSON.stringify(output, null, 2)
);

if (errors.length) {
  throw new Error(errors.join('\n'));
}

console.log(
  `Live preview validation passed for ${checks.length} representative routes at ${base}.`
);