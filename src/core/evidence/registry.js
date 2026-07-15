import df from '../../resources/evidence/df-usage/definition.json' with { type: 'json' };
import kubernetes from '../../resources/evidence/kubernetes-pod/definition.json' with { type: 'json' };
import docker from '../../resources/evidence/docker-state/definition.json' with { type: 'json' };
import terraform from '../../resources/evidence/terraform-lock/definition.json' with { type: 'json' };
import systemd from '../../resources/evidence/systemd-unit/definition.json' with { type: 'json' };
export const evidenceDefinitions=Object.freeze([df,kubernetes,docker,terraform,systemd]);
export const evidenceById=new Map(evidenceDefinitions.map(item=>[item.id,item]));
