import fs from 'node:fs';import path from 'node:path';
const root=process.cwd();const lock=JSON.parse(fs.readFileSync(path.join(root,'package-lock.json'),'utf8'));const inventory={};const unresolved=[];const prohibited=[];
function normalizeLicense(value){
 if(typeof value==='string'&&value.trim())return value.trim();
 if(Array.isArray(value)){
  const names=value.map(item=>typeof item==='string'?item:item?.type).filter(Boolean);
  if(names.length)return [...new Set(names)].join(' OR ');
 }
 return null;
}
for(const [packagePath,meta] of Object.entries(lock.packages||{})){
 if(!packagePath)continue;const name=packagePath.replace(/^node_modules\//,'');let license=normalizeLicense(meta.license)||normalizeLicense(meta.licenses);
 const packageJson=path.join(root,packagePath,'package.json');
 if(!license&&fs.existsSync(packageJson)){try{const installed=JSON.parse(fs.readFileSync(packageJson,'utf8'));license=normalizeLicense(installed.license)||normalizeLicense(installed.licenses);}catch{}}
 if(!license){unresolved.push(name);continue;}inventory[license]=(inventory[license]||0)+1;
 if(/(^|\W)(AGPL|GPL)(?:-|\W|$)/i.test(license)&&!/(LGPL)/i.test(license))prohibited.push({name,license});
}
if(prohibited.length)throw new Error(`Prohibited dependency license(s): ${prohibited.map(x=>`${x.name} (${x.license})`).join(', ')}`);
if(unresolved.length)throw new Error(`Unresolved dependency license metadata: ${unresolved.join(', ')}`);
const out=path.join(root,'release-certification');if(fs.existsSync(out))fs.writeFileSync(path.join(out,'licenses.json'),JSON.stringify({generatedAt:new Date().toISOString(),inventory,unresolved},null,2));
console.log(`Dependency license inventory passed: ${Object.values(inventory).reduce((a,b)=>a+b,0)} packages, ${Object.keys(inventory).length} license expressions, 0 unresolved metadata entries.`);
