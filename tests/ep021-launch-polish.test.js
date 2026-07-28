import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {buildInvestigationExport} from '../src/investigations/experience.js';
const read=file=>fs.readFileSync(path.join(process.cwd(),file),'utf8');
describe('EP-021 launch polish',()=>{
  it('keeps the homepage hierarchy focused',()=>{const source=read('src/pages/index.astro');expect(source).toContain('Analyze evidence');expect(source).toContain('Start from a symptom');expect(source).not.toContain('data-role-start');expect(source).not.toContain('WHY TRUST IT')});
  it('ships an accessible, reduced-motion-aware hero example',()=>{const source=read('src/components/InvestigationDemo.astro');expect(source).toContain('IntersectionObserver');expect(source).toContain('prefers-reduced-motion');expect(source).toContain('aria-live="off"')});
  it('exports branch path and structured outcome',()=>{const result=buildInvestigationExport({title:'Test',format:'markdown',answers:[{label:'Error is confirmed'}],investigationState:{findings:{observed:['HTTP 502'],confirmed:['Upstream unavailable'],unknown:['Why it stopped']},actions:['Restarted safely'],verification:{status:'verified'}}});expect(result.text).toContain('Error is confirmed');expect(result.text).toContain('HTTP 502');expect(result.text).toContain('Restarted safely');expect(result.text).toContain('verified')});
  it('does not render a TypeScript directive as page content',()=>{const source=read('src/pages/troubleshoot/index.astro');expect(source.split('---').slice(2).join('---')).not.toContain('\n// @ts-nocheck\n<BaseLayout')});
});
