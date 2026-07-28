import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
const read=file=>fs.readFileSync(file,'utf8');
describe('EP-021 final remediation',()=>{
  it('removes Preflight from product code and durable navigation',()=>{
    expect(fs.existsSync('src/pages/preflight.astro')).toBe(false);
    for(const file of ['src/config/pages.js','src/config/site.js','src/components/SiteFooter.astro','src/references/discovery.js'])expect(read(file).toLowerCase()).not.toContain('preflight');
  });
  it('uses the original evidence-path brand on every global surface',()=>{
    const header=read('src/components/SiteHeader.astro'),footer=read('src/components/SiteFooter.astro'),layout=read('src/layouts/BaseLayout.astro');
    expect(header).toContain('BrandMark');expect(footer).toContain('BrandMark');expect(read('src/components/BrandMark.astro')).toContain('brand-route-safe');
    expect(layout).toContain('/favicon.svg');expect(read('src/components/OpenGraphMeta.astro')).toContain('/brand-social.svg');
  });
  it('keeps correction reporting contextual and removes public release labels',()=>{
    expect(read('src/layouts/BaseLayout.astro')).not.toContain('CorrectionReport');
    expect(read('src/pages/workspace.astro')).toContain('CorrectionReport');
    expect(read('src/components/SiteFooter.astro')).not.toMatch(/site\.(?:ep|version)|EP-\d{3}|v0\.\d+\.\d+/);
  });
  it('replaces the large demo with a decorative responsive network',()=>{
    expect(fs.existsSync('src/components/InvestigationDemo.astro')).toBe(false);
    const network=read('src/components/HeroNetwork.astro'),styles=read('src/styles/ep021.css');
    expect(network).toContain('aria-hidden="true"');expect(network).toContain('IntersectionObserver');expect(network).toContain('visibilitychange');
    expect(styles).toContain('@media(max-width:767px)');expect(styles).toContain('height:5rem');expect(styles).toContain('prefers-reduced-motion');
  });
});
