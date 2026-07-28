import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {buildInvestigationExport} from '../src/investigations/experience.js';
const read=file=>fs.readFileSync(path.join(process.cwd(),file),'utf8');
describe('EP-021 launch polish',()=>{
  it('keeps the homepage hierarchy focused',()=>{const source=read('src/pages/index.astro');expect(source).toContain('Analyze Evidence');expect(source).toContain('Browse Investigations');expect(source).not.toContain('InvestigationDemo');expect(source).not.toContain('WHY TRUST IT')});
  it('ships a decorative reduced-motion-aware investigation network',()=>{const source=read('src/components/HeroNetwork.astro'),styles=read('src/styles/ep021.css');expect(source).toContain('IntersectionObserver');expect(source).toContain('aria-hidden="true"');expect(styles).toContain('prefers-reduced-motion');expect(styles).toContain('max-width:767px')});
  it('exports branch path and structured outcome',()=>{const result=buildInvestigationExport({title:'Test',format:'markdown',answers:[{label:'Error is confirmed'}],investigationState:{findings:{observed:['HTTP 502'],confirmed:['Upstream unavailable'],unknown:['Why it stopped']},actions:['Restarted safely'],verification:{status:'verified'}}});expect(result.text).toContain('Error is confirmed');expect(result.text).toContain('HTTP 502');expect(result.text).toContain('Restarted safely');expect(result.text).toContain('verified')});
  it('does not render a TypeScript directive as page content',()=>{const source=read('src/pages/troubleshoot/index.astro');expect(source.split('---').slice(2).join('---')).not.toContain('\n// @ts-nocheck\n<BaseLayout')});
});
