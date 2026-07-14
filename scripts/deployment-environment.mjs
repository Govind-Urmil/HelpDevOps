export function normalizeSiteUrl(value){
  if(!value)throw new Error('PUBLIC_SITE_URL is required.');
  const url=new URL(value);
  if(!['http:','https:'].includes(url.protocol))throw new Error('PUBLIC_SITE_URL must use HTTP or HTTPS.');
  url.hash='';url.search='';url.pathname='/';
  return url.href.replace(/\/$/,'');
}
export function validateDeploymentEnvironment({channel,siteUrl}){
  const errors=[];let parsed;
  try{parsed=new URL(siteUrl)}catch{errors.push('PUBLIC_SITE_URL is not a valid URL.');return errors}
  if(channel==='preview'){
    if(parsed.protocol!=='https:')errors.push('Preview PUBLIC_SITE_URL must use HTTPS.');
    if(parsed.hostname.endsWith('.example'))errors.push('Preview PUBLIC_SITE_URL must not use a placeholder domain.');
  }
  if(channel==='production'){
    if(parsed.protocol!=='https:')errors.push('Production PUBLIC_SITE_URL must use HTTPS.');
    if(parsed.hostname.endsWith('.example'))errors.push('Production PUBLIC_SITE_URL must not use a placeholder domain.');
    if(!process.env.APPROVED_PRODUCTION_HOSTNAME)errors.push('APPROVED_PRODUCTION_HOSTNAME is required for production.');
    else if(parsed.hostname!==process.env.APPROVED_PRODUCTION_HOSTNAME)errors.push('PUBLIC_SITE_URL hostname does not match APPROVED_PRODUCTION_HOSTNAME.');
  }
  return errors;
}
