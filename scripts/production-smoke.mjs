const arg=process.argv.find(value=>value.startsWith('--base-url='));
const base=(arg?.split('=').slice(1).join('=')||process.env.HELPDEVOPS_BASE_URL||'').replace(/\/$/,'');
const expected=(process.env.HELPDEVOPS_CANONICAL_URL||base).replace(/\/$/,'');
if(!/^https?:\/\//.test(base))throw new Error('Supply --base-url=https://host or HELPDEVOPS_BASE_URL.');
const failures=[];
async function get(path,expectedStatus=200){
 const response=await fetch(`${base}${path}`,{redirect:'manual'});const text=await response.text();
 if(response.status!==expectedStatus)failures.push(`${path}: expected ${expectedStatus}, received ${response.status}`);
 return {response,text};
}
for(const path of ['/','/troubleshoot/','/tools/','/workspace/','/issues/methodology/','/issues/','/troubleshoot/kubernetes/crashloopbackoff/','/tools/structured-data/','/robots.txt','/sitemap-index.xml'])await get(path);
const missing=await get('/preflight/',404),home=await get('/');
if(!home.text.includes('class="brand-mark"'))failures.push('Current brand marker missing.');
if(home.text.includes('>_</'))failures.push('Old logo marker detected.');
if(/\bEP-0\d{2}\b|\bv0\.\d+\.\d+\b/.test(home.text))failures.push('Public engineering release label detected.');
if(!home.text.includes('data-search-open'))failures.push('Search control missing.');
for(const header of ['content-security-policy','strict-transport-security','x-content-type-options','referrer-policy','permissions-policy'])if(!home.response.headers.get(header))failures.push(`Missing ${header}.`);
const canonical=home.text.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
if(expected&&canonical&&!canonical.startsWith(expected))failures.push(`Canonical mismatch: ${canonical}`);
if(missing.text.includes('Preflight | HelpDevOps'))failures.push('Removed product content is still deployed.');
if(failures.length)throw new Error(failures.join('\n'));
console.log(`Production smoke passed for ${base}; canonical expectation ${expected}.`);
