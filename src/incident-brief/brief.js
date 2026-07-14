import { scanSensitiveContent } from '../workspace/sensitive-content.js';
export const BRIEF_MODES = Object.freeze(['summary', 'structured', 'raw']);
const clean = (value, max = 12000) => String(value ?? '').replace(/\0/g, '').slice(0, max);
const safeLine = value => clean(value).split('\n').map(line=>line.replace(/^([=+@-])/, "'$1")).join('\n');
export function createIncidentBrief(input = {}, mode = 'summary', acknowledged = false) {
  if (!BRIEF_MODES.includes(mode)) throw new Error('Unsupported Incident Brief privacy mode.');
  const rawEvidence = clean(input.rawEvidence);
  const brief = {schemaVersion:1,mode,summary:clean(input.summary,2000),symptom:clean(input.symptom,4000),context:clean(input.context,4000),observations:mode==='summary'?'':clean(input.observations),unknowns:clean(input.unknowns),checks:clean(input.checks),actions:clean(input.actions),riskNotes:clean(input.riskNotes),verification:clean(input.verification),nextStep:clean(input.nextStep),escalationQuestions:clean(input.escalationQuestions),rawEvidence:mode==='raw'?rawEvidence:''};
  const reviewPayload = Object.entries(brief).filter(([key])=>!['schemaVersion','mode'].includes(key)).map(([key,value])=>`${key}: ${value}`).join('\n');
  const warnings = scanSensitiveContent(reviewPayload);
  if (warnings.some(item => item.severity === 'block')) throw new Error('Private-key-like material cannot be included anywhere in an Incident Brief. Return and redact it.');
  if (mode === 'raw' && rawEvidence && !acknowledged) throw new Error('Review and acknowledge raw evidence before inclusion.');
  const uniqueWarnings=[...new Map(warnings.map(item=>[item.id,item])).values()];
  return {...brief,sensitivity:{warnings:uniqueWarnings.map(({id,label})=>({id,label})),rawAcknowledged:mode==='raw'&&acknowledged}};
}
export function briefToMarkdown(brief){const sections=[['Problem summary',brief.summary],['Observed symptom',brief.symptom],['Execution context',brief.context],['Structured observations',brief.observations],['Unknowns',brief.unknowns],['Checks completed',brief.checks],['Actions considered or taken',brief.actions],['Risk notes',brief.riskNotes],['Verification state',brief.verification],['Recommended next step',brief.nextStep],['Escalation questions',brief.escalationQuestions],['Raw evidence (explicitly reviewed)',brief.rawEvidence]];return `# Incident Brief\n\nPrivacy mode: ${brief.mode}\n\n${sections.filter(([,value])=>value).map(([title,value])=>`## ${title}\n\n${safeLine(value)}`).join('\n\n')}\n`;}
export const briefToPlainText=brief=>briefToMarkdown(brief).replace(/^#{1,6}\s+/gm,'').replace(/\*\*/g,'');
export function safeBriefFilename(summary='incident'){const slug=clean(summary,60).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'incident';return `${slug}-incident-brief.md`;}
