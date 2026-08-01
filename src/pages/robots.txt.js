export const prerender=true;
export function GET(){
  const body=`User-agent: *\nAllow: /\n\nSitemap: https://helpdevops.work-on.workers.dev/sitemap-index.xml\n`;
  return new Response(body,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
}
