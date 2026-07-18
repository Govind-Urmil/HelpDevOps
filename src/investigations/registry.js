export const connectedInvestigations=Object.freeze([
  ['journey-linux-disk-full',null],['journey-docker-container-exits','docker-compose'],['journey-kubernetes-pod-pending','kubernetes-manifest'],
  ['journey-kubernetes-crashloopbackoff','kubernetes-manifest'],['journey-terraform-state-lock',null],['journey-docker-disk-usage','docker-compose'],
  ['journey-linux-systemd-service-start','linux-permissions'],['journey-networking-dns-resolution','ipv4-cidr'],
  ['journey-networking-connection-refused','ipv4-cidr'],['journey-cron-job-not-running','cron']
].map(([journeyId,capabilityId])=>Object.freeze({journeyId,capabilityId,loop:Object.freeze(['observe','scope','explain','test','act','verify','preserve']),
  connected:Boolean(capabilityId)})));
export const connectedInvestigationById=id=>connectedInvestigations.find(item=>item.journeyId===id);
