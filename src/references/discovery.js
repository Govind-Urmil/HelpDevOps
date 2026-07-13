import {tools} from '../config/tools.js';
import {publishedJourneys} from '../diagnostics/registry.js';
import {evidenceDefinitions} from '../core/evidence/registry.js';
import {publishedReferences} from './registry.js';

const normalizePhrase = value => String(value || '')
  .toLowerCase()
  .replace(/[^a-z0-9.+#/-]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const tokenize = value => normalizePhrase(value).split(/\s+/).filter(Boolean);
const unique = values => [...new Set(values.filter(Boolean))];
const typePrefix = type => type.toLowerCase();

function canonicalJourneySignals(journey) {
  const byNormalizedTerm = new Map();

  for (const term of journey.exactErrors || []) {
    const normalizedTerm = normalizePhrase(term);
    if (!normalizedTerm) continue;
    if (!byNormalizedTerm.has(normalizedTerm)) {
      byNormalizedTerm.set(normalizedTerm, {
        term,
        normalizedTerm,
        kind: 'exact-error'
      });
    }
  }

  for (const term of journey.aliases || []) {
    const normalizedTerm = normalizePhrase(term);
    if (!normalizedTerm || byNormalizedTerm.has(normalizedTerm)) continue;
    byNormalizedTerm.set(normalizedTerm, {
      term,
      normalizedTerm,
      kind: 'symptom'
    });
  }

  return [...byNormalizedTerm.values()];
}

export const errorEntries = publishedJourneys
  .flatMap(journey => canonicalJourneySignals(journey).map(signal => ({
    id: `error:${journey.id}:${signal.normalizedTerm}`,
    journeyId: journey.id,
    term: signal.term,
    normalizedTerm: signal.normalizedTerm,
    domain: journey.domain,
    kind: signal.kind,
    title: journey.title,
    summary: journey.summary,
    doesNotProve: 'This signal identifies a reviewed diagnostic starting point, not a confirmed root cause.',
    route: journey.path,
    destinationType: 'DIAGNOSTIC'
  })))
  .sort((a, b) => a.term.localeCompare(b.term));

const make = (type, rawId, title, route, domain, summary, aliases = [], exactErrors = []) => {
  const normalizedTitle = normalizePhrase(title);
  const normalizedAliases = unique(aliases.map(normalizePhrase));
  const normalizedErrors = unique(exactErrors.map(normalizePhrase));
  const normalizedSummary = normalizePhrase(summary);
  const normalizedDomain = normalizePhrase(domain);
  const searchTokens = unique(tokenize([
    normalizedTitle,
    normalizedDomain,
    normalizedSummary,
    ...normalizedAliases,
    ...normalizedErrors
  ].join(' ')));

  return {
    type,
    id: `${typePrefix(type)}:${rawId}`,
    rawId,
    title,
    route,
    domain,
    summary,
    aliases,
    exactErrors,
    normalizedTitle,
    normalizedAliases,
    normalizedErrors,
    searchTokens
  };
};

export const discoveryIndex = [
  ...tools
    .filter(tool => tool.status === 'available')
    .map(tool => make('TOOL', tool.id, tool.title, tool.path, tool.category, tool.description, tool.aliases)),
  ...publishedJourneys
    .map(journey => make('DIAGNOSTIC', journey.id, journey.title, journey.path, journey.domain, journey.summary, journey.aliases, journey.exactErrors)),
  ...evidenceDefinitions
    .filter(definition => definition.reviewStatus === 'reviewed')
    .map(definition => make('INTERPRETER', definition.id, definition.title, `/interpret/${definition.slug}/`, definition.domain || definition.source, definition.summary, definition.aliases || [])),
  ...publishedReferences
    .map(reference => make('REFERENCE', reference.id, reference.title, reference.path, reference.domain, reference.summary, reference.aliases)),
  ...errorEntries
    .map(entry => make('ERROR', entry.id, entry.term, entry.route, entry.domain, `${entry.summary} ${entry.doesNotProve}`, [entry.title], entry.kind === 'exact-error' ? [entry.term] : [])),
  ...[...new Set(publishedJourneys.map(journey => journey.domain))]
    .map(domain => make('HUB', `hub-${domain}`, `${domain[0].toUpperCase() + domain.slice(1)} troubleshooting`, `/troubleshoot/${domain}/`, domain, `Browse reviewed ${domain} troubleshooting paths.`))
];

const aliasScores = {
  DIAGNOSTIC: 94,
  INTERPRETER: 93,
  TOOL: 92,
  REFERENCE: 85,
  ERROR: 86,
  HUB: 84
};

function boundedPrefixMatch(queryTokens, itemTokens) {
  return queryTokens.every(queryToken => {
    if (queryToken.length < 4) return itemTokens.includes(queryToken);
    return itemTokens.some(itemToken => itemToken.startsWith(queryToken));
  });
}

export function rankDiscovery(query, index = discoveryIndex) {
  const normalizedQuery = normalizePhrase(query);
  if (!normalizedQuery) return [];
  const queryTokens = tokenize(normalizedQuery);

  return index
    .map(item => {
      let score = 0;
      let why = '';

      if (item.normalizedTitle === normalizedQuery) {
        score = item.type === 'ERROR' ? 88 : 100;
        why = 'exact title';
      } else if (item.normalizedErrors.includes(normalizedQuery)) {
        score = 96;
        why = 'exact reviewed error';
      } else if (item.normalizedAliases.includes(normalizedQuery)) {
        score = aliasScores[item.type] || 90;
        why = 'alias';
      } else if (item.type === 'DIAGNOSTIC' && tokenize(item.normalizedTitle).includes(normalizedQuery)) {
        score = 89;
        why = 'title token';
      } else if (normalizedQuery.length >= 4 && item.normalizedTitle.startsWith(normalizedQuery)) {
        score = 80;
        why = 'title prefix';
      } else if (queryTokens.every(token => item.searchTokens.includes(token))) {
        score = 60 + queryTokens.length;
        why = 'matching tokens';
      } else if (boundedPrefixMatch(queryTokens, item.searchTokens)) {
        score = 48 + queryTokens.length;
        why = 'matching token prefixes';
      } else if (queryTokens.length > 1 && queryTokens.some(token => item.searchTokens.includes(token))) {
        score = 20;
        why = 'partial tokens';
      }

      return {...item, score, why};
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 20);
}
