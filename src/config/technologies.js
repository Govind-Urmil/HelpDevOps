export const technologies = Object.freeze({
  kubernetes:{label:'Kubernetes',icon:'kubernetes'}, docker:{label:'Docker',icon:'docker'}, git:{label:'Git',icon:'git'},
  terraform:{label:'Terraform',icon:'terraform'}, linux:{label:'Linux',icon:'linux'}, jenkins:{label:'Jenkins',icon:'jenkins'},
  networking:{label:'Networking',icon:'networking'}, bash:{label:'Bash',icon:'bash'}, ansible:{label:'Ansible',icon:'ansible'}, kafka:{label:'Kafka',icon:'kafka'}
});

const aliases={container:'docker',containers:'docker',systemd:'linux',cron:'linux',shell:'bash',http:'networking',dns:'networking'};
export function technologyFor(value=''){
  const key=String(value).toLowerCase().trim();
  return technologies[key]||technologies[aliases[key]]||null;
}
