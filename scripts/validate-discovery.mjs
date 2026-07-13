import {discoveryIndex, errorEntries, rankDiscovery} from '../src/references/discovery.js';
import {publishedReferences} from '../src/references/registry.js';

const ids = new Set();
const routes = new Set();
for (const item of discoveryIndex) {
  if (!item.id) throw new Error('Discovery item missing ID');
  if (ids.has(item.id)) throw new Error(`Duplicate discovery ID ${item.id}`);
  ids.add(item.id);
  if (!item.route?.startsWith('/')) throw new Error(`${item.id}: invalid route`);
  const routeKey = `${item.type}:${item.route}`;
  if (routes.has(routeKey) && item.type !== 'ERROR') throw new Error(`Duplicate discovery route/type ${routeKey}`);
  routes.add(routeKey);
}

const journeySignals = new Set();
for (const entry of errorEntries) {
  const key = `${entry.journeyId}:${entry.normalizedTerm}`;
  if (journeySignals.has(key)) throw new Error(`Duplicate normalized journey signal ${key}`);
  journeySignals.add(key);
}

const visibleSignals = new Set();
for (const entry of errorEntries) {
  const key = `${entry.route}:${entry.normalizedTerm}`;
  if (visibleSignals.has(key)) throw new Error(`Duplicate visible error-index record ${key}`);
  visibleSignals.add(key);
}

const rankingCases = [
  ['pod pending', 'Kubernetes Pod remains Pending'],
  ['df -i', 'How to read df disk-usage output'],
  ['failed to push some refs', 'Git push rejected or non-fast-forward'],
  ['502', 'HTTP 502 Bad Gateway'],
  ['cron path', 'Cron execution environment']
];
for (const [query, title] of rankingCases) {
  const result = rankDiscovery(query)[0];
  if (!result || result.title !== title) throw new Error(`Ranking failed for ${query}: ${result?.title}`);
}

const equivalentQueries = [
  ['CrashLoopBackOff', ' crashloopbackoff  '],
  ['502 Bad Gateway', '502   bad gateway'],
  ['Connection Refused', 'connection refused']
];
for (const [left, right] of equivalentQueries) {
  const leftResult = rankDiscovery(left)[0];
  const rightResult = rankDiscovery(right)[0];
  if (!leftResult || !rightResult || leftResult.id !== rightResult.id) {
    throw new Error(`Equivalent query ranking differs: ${left} / ${right}`);
  }
}

for (const query of ['failed', 'offline', 'status', 'lock', 'permission']) {
  const top = rankDiscovery(query)[0];
  if (top?.score >= 90) throw new Error(`Generic query received overconfident exact ranking: ${query}`);
}

const collisionCases = [
  ['lock', /blocks|inode|disk full|df disk-usage/i],
  ['port', /transport/i]
];
for (const [query, forbidden] of collisionCases) {
  const collision = rankDiscovery(query).find(result => forbidden.test(result.title));
  if (collision) throw new Error(`Substring collision for ${query}: ${collision.title}`);
}

if (!errorEntries.length) throw new Error('Error index is empty');
if (publishedReferences.some(reference => !discoveryIndex.some(item => item.type === 'REFERENCE' && item.rawId === reference.id))) {
  throw new Error('Reference missing from discovery index');
}

console.log(`${discoveryIndex.length} discovery records and ${errorEntries.length} canonical error/symptom entries validated.`);
