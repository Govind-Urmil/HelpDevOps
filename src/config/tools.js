export const tools = [
  {id:'cron',title:'Cron Analyzer',path:'/tools/cron/',category:'Automation',capabilities:['INSPECT','VALIDATE'],inputKinds:['cron'],status:'available',description:'Inspect and explain common five-field cron schedules locally.',aliases:['crontab','schedule','job schedule']},
  {id:'structured-data',title:'JSON & YAML Inspector',path:'/tools/structured-data/',category:'Configuration',capabilities:['INSPECT','FORMAT'],inputKinds:['json','yaml'],status:'available',description:'Parse, inspect and safely format JSON or YAML in your browser.',aliases:['json formatter','yaml validator','format json','inspect yaml']},
  {id:'docker-compose',title:'Docker Compose Analyzer',path:'/tools/',category:'Containers',capabilities:['INSPECT'],inputKinds:['compose'],status:'planned',description:'Detailed Docker Compose analysis is planned for a later EP.',aliases:['compose','docker compose']},
  {id:'kubernetes',title:'Kubernetes Manifest Analyzer',path:'/tools/',category:'Containers',capabilities:['INSPECT'],inputKinds:['kubernetes'],status:'planned',description:'Cluster-aware Kubernetes validation is planned for a later EP.',aliases:['k8s','manifest','kubectl']}
];
export const availableTools = tools.filter(tool => tool.status === 'available');
