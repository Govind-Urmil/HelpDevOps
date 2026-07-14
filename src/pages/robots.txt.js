import {site} from '../config/site.js';
export const prerender=true;
export function GET(){
  const body=`User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap-index.xml\n`;
  return new Response(body,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
}
