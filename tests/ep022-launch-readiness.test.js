import {describe,it,expect} from 'vitest';
import {seoEntries,technologyGovernance,reviewPolicy} from '../src/resources/launch-readiness.js';
import {publishedJourneys} from '../src/diagnostics/registry.js';
import fs from 'node:fs';
describe('EP-022 launch readiness',()=>{
 it('publishes a bounded set of unique, evidence-first SEO entries',()=>{expect(seoEntries.length).toBe(15);expect(new Set(seoEntries.map(x=>x.slug)).size).toBe(15);for(const entry of seoEntries){expect(entry.causes.length).toBeGreaterThanOrEqual(3);expect(entry.checks.length).toBeGreaterThanOrEqual(2);expect(entry.avoid).toMatch(/not|never|do not/i);expect(publishedJourneys.some(j=>j.id===entry.journeyId)).toBe(true)}});
 it('keeps tested and applicable versions honest',()=>{expect(reviewPolicy.testedAgainst).toMatch(/Synthetic fixtures/);expect(reviewPolicy.testedAgainst).toMatch(/not a connected production/);for(const value of Object.values(technologyGovernance)){expect(value.appliesTo).toBeTruthy();expect(value.compatibility).toBeTruthy();expect(value.official).toMatch(/^https:\/\//)}});
 it('defines a public methodology and no global correction system',()=>{const policy=fs.readFileSync('src/pages/issues/methodology.astro','utf8');expect(policy).toMatch(/independent expert review/);expect(policy).toMatch(/cannot guarantee/);expect(fs.readFileSync('src/layouts/BaseLayout.astro','utf8')).not.toMatch(/CorrectionReport/)});
 it('provides useful deterministic zero-result recovery',()=>{const ui=fs.readFileSync('public/scripts/ui.js','utf8');expect(ui).toMatch(/No reviewed destination matched/);expect(ui).toMatch(/Analyze redacted evidence/);expect(ui).toMatch(/No approximate result was fabricated/)});
 it('ships configurable production smoke verification',()=>{const smoke=fs.readFileSync('scripts/production-smoke.mjs','utf8');expect(smoke).toMatch(/HELPDEVOPS_BASE_URL/);expect(smoke).toMatch(/HELPDEVOPS_CANONICAL_URL/);expect(smoke).toMatch(/preflight/)});});
