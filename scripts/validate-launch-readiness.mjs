import {seoEntries,technologyGovernance,reviewPolicy} from '../src/resources/launch-readiness.js';
import {publishedJourneys} from '../src/diagnostics/registry.js';
const errors=[],today='2026-07-28',slugs=new Set();
if(seoEntries.length<12||seoEntries.length>15)errors.push(`Expected 12-15 SEO entries, found ${seoEntries.length}.`);
if(!/^\d{4}-\d{2}-\d{2}$/.test(reviewPolicy.reviewedAt)||!reviewPolicy.reviewDue)errors.push('Review policy dates must use YYYY-MM-DD.');
if(reviewPolicy.reviewDue<today)errors.push('Central review window is expired.');
for(const [id,item] of Object.entries(technologyGovernance)){
 if(!item.appliesTo||!item.compatibility)errors.push(`${id}: compatibility governance is incomplete.`);
 if(!item.official?.startsWith('https://'))errors.push(`${id}: official HTTPS documentation is required.`);
}
for(const entry of seoEntries){
 if(slugs.has(entry.slug))errors.push(`Duplicate SEO slug ${entry.slug}.`);slugs.add(entry.slug);
 if(!publishedJourneys.some(item=>item.id===entry.journeyId))errors.push(`${entry.slug}: unknown journey ${entry.journeyId}.`);
 for(const field of ['summary','avoid','escalation','limitation','appliesTo','testedAgainst','compatibility'])if(!entry[field])errors.push(`${entry.slug}: ${field} is required.`);
 if(entry.reviewDue<today)errors.push(`${entry.slug}: review is overdue.`);
 if(!entry.official.startsWith('https://'))errors.push(`${entry.slug}: official HTTPS reference required.`);
}
if(errors.length)throw new Error(errors.join('\n'));
console.log(`Launch-readiness validation passed: ${seoEntries.length} SEO entries, ${Object.keys(technologyGovernance).length} governed technologies, ${publishedJourneys.length} published investigations.`);
