import {describe,it,expect} from 'vitest';
import fs from 'node:fs';

const read=(file)=>fs.readFileSync(file,'utf8');

describe('EP-015 premium operational UX foundation',()=>{
  it('keeps technology marks local and registry-driven',()=>{
    const registry=read('src/config/technologies.js');
    const mark=read('src/components/TechnologyMark.astro');
    expect(registry).toContain('export const technologies');
    expect(mark).toContain('technologyFor');
    expect(registry).toContain('/icons/technologies/');
    expect(mark).toContain('src={item.iconPath}');
    expect(mark).toContain('aria-hidden="true"');
    expect(mark).not.toMatch(/https?:\/\//);
  });

  it('gives the errors index a local filter and unique link names',()=>{
    const page=read('src/pages/errors/index.astro');
    expect(page).toContain('data-error-filter');
    expect(page).toContain('data-error-entry');
    expect(page).toContain('aria-label={`Open ${e.title} for “${e.term}”`}');
  });

  it('provides deterministic drag, focus, copy, and status affordances',()=>{
    const input=read('src/components/UniversalInput.astro');
    const journey=read('src/components/diagnostics/DiagnosticJourney.astro');
    expect(input).toContain("addEventListener('drop'");
    expect(input).toContain("dataset.dragActive='true'");
    expect(journey).toContain("className='command-copy'");
    expect(journey).toContain('aria-live="polite"');
  });

  it('keeps the footer concise without repeating the homepage trust message',()=>{
    const footer=read('src/components/SiteFooter.astro');
    expect(footer).toContain('A private, browser-first DevOps task workspace.');
    expect(footer).not.toContain('trust-strip');
  });
});
