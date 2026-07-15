import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const root = process.cwd();
const evidence = path.join(root, 'evidence');

fs.mkdirSync(evidence, { recursive: true });

const routes = [
  ['homepage', '/'],
  ['encoding-hash', '/tools/encoding-hash/'],
  ['ipv4-cidr', '/tools/ipv4-cidr/'],
  ['linux-permissions', '/tools/linux-permissions/'],
  ['git-reference', '/tools/git-reference/']
];

const thresholds = {
  performance: 0.95,
  accessibility: 0.95,
  'best-practices': 0.95,
  seo: 0.95
};

const baseUrl = 'http://127.0.0.1:4321';
const cli = path.join(root, 'node_modules/lighthouse/cli/index.js');

const server = spawn(process.execPath, ['scripts/serve-dist.mjs'], {
  cwd: root,
  stdio: 'ignore'
});

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitForServer() {
  const deadline = Date.now() + 15000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl);

      if (response.ok) {
        return;
      }
    } catch {
      // Server is still starting.
    }

    await wait(250);
  }

  throw new Error('Local Lighthouse server did not become ready.');
}

async function runAudit(name, route, attempt) {
  const report = path.join(
    evidence,
    `lighthouse-${name}-attempt-${attempt}.json`
  );

  // Warm the route and static assets before measurement.
  await fetch(`${baseUrl}${route}`, {
    headers: {
      'Accept-Encoding': 'gzip'
    }
  });

  const child = spawn(
    process.execPath,
    [
      cli,
      `${baseUrl}${route}`,
      '--output=json',
      `--output-path=${report}`,
      '--quiet',
      '--chrome-flags=--headless --no-sandbox'
    ],
    {
      cwd: root,
      stdio: 'inherit'
    }
  );

  const code = await new Promise((resolve) => child.on('close', resolve));

  if (code !== 0 && !fs.existsSync(report)) {
    throw new Error(
      `Lighthouse ${name} attempt ${attempt} exited ${code} without a report`
    );
  }

  const result = JSON.parse(fs.readFileSync(report, 'utf8'));

  return Object.fromEntries(
    Object.keys(thresholds).map((category) => [
      category,
      result.categories[category].score
    ])
  );
}

function passes(scores) {
  return Object.entries(thresholds).every(
    ([category, minimum]) => scores[category] >= minimum
  );
}

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)];
}

try {
  await waitForServer();

  for (const [name, route] of routes) {
    const attempts = [await runAudit(name, route, 1)];

    if (!passes(attempts[0])) {
      attempts.push(await runAudit(name, route, 2));
      attempts.push(await runAudit(name, route, 3));
    }

    const finalScores = Object.fromEntries(
      Object.keys(thresholds).map((category) => [
        category,
        median(attempts.map((attempt) => attempt[category]))
      ])
    );

    const failures = [];

    for (const [category, minimum] of Object.entries(thresholds)) {
      const score = finalScores[category];

      console.log(
        `${name} ${category}: ${Math.round(score * 100)} ` +
          `(${attempts.length} attempt${attempts.length === 1 ? '' : 's'})`
      );

      if (score < minimum) {
        failures.push(
          `${name} ${category} ${score * 100} < ${minimum * 100}`
        );
      }
    }

    if (failures.length) {
      throw new Error(failures.join('\n'));
    }
  }
} finally {
  server.kill();
}