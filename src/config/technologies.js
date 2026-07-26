export const technologies = Object.freeze(Object.fromEntries(['kubernetes','docker','git','terraform','linux','jenkins','networking','bash','yaml'].map(id=>[id,{label:{kubernetes:'Kubernetes',docker:'Docker',git:'Git',terraform:'Terraform',linux:'Linux',jenkins:'Jenkins',networking:'Networking',bash:'Bash',yaml:'YAML'}[id],iconPath:`/icons/technologies/${id}.svg`}])));

const aliases={container:'docker',containers:'docker',systemd:'linux',cron:'linux',shell:'bash',http:'networking',dns:'networking'};
export function technologyFor(value=''){
  const key=String(value).toLowerCase().trim();
  return technologies[key]||technologies[aliases[key]]||null;
}

