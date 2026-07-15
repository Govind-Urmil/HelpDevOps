import {buildEvidenceResult,unsupported} from '../result.js';
const props=['Id','LoadState','ActiveState','SubState','Result','ExecMainCode','ExecMainStatus','NRestarts'];
export function parseSystemdUnit(text){
 const map={};for(const line of text.split('\n')){const m=line.match(/^([A-Za-z][A-Za-z0-9]+)=(.*)$/);if(m&&props.includes(m[1]))map[m[1]]=m[2];}
 if(Object.keys(map).length>=3 && ('ActiveState' in map || 'LoadState' in map)){
  const observations=props.filter(k=>Object.hasOwn(map,k)).map(k=>({label:k,value:map[k]||'(empty)'}));const interpretations=[];
  if(map.LoadState==='not-found')interpretations.push('The service manager reports that the requested unit was not found.');
  if(map.ActiveState==='failed')interpretations.push(`The service manager recorded a failed active state${map.Result?` with result ${map.Result}`:''}.`);
  if(map.ExecMainStatus)interpretations.push(`The main process status is ${map.ExecMainStatus}; this value alone does not identify the application root cause.`);
  if(!interpretations.length)interpretations.push('Stable systemd properties were parsed, but no reviewed failure signal was present.');
  return buildEvidenceResult({parserId:'systemd-unit',title:'Structured systemd unit state recognized',summary:'Parsed selected stable systemctl show properties.',recognition:{status:'recognized-structured',format:'systemctl-show'},observations,interpretations,unknowns:['Unit properties do not include the complete journal or application configuration context.','Viewing process identity or journal entries may require additional privileges.'],nextChecks:['Review journalctl -u <service> -b --no-pager and the unit definition before changing restart limits or security controls.'],relatedJourneyId:'journey-linux-systemd-service-start',formatted:observations.map(o=>`${o.label}: ${o.value}`).join('\n')});
 }
 const human=/^[●*]?\s*\S+\.service\s+-/m.test(text)&&/\bLoaded:\s|\bActive:\s/m.test(text);if(human){
  const observations=[];for(const [label,re] of [['Loaded',/^\s*Loaded:\s*(.+)$/mi],['Active',/^\s*Active:\s*(.+)$/mi],['Process',/^\s*Process:\s*(.+)$/mi]]){const m=text.match(re);if(m)observations.push({label,value:m[1].trim()});}
  return buildEvidenceResult({parserId:'systemd-unit',title:'Human-readable systemd status recognized',summary:'Recognized bounded systemctl status output. This human-readable format is not a stable machine interface.',recognition:{status:'recognized-human-readable',format:'systemctl-status'},observations,interpretations:[/failed/i.test(text)?'The displayed status includes a failed-state signal.':'A service status excerpt was recognized.'],unknowns:['The status excerpt may truncate journal messages and does not by itself identify the application root cause.'],nextChecks:['Collect selected systemctl show properties and review journalctl -u <service> -b --no-pager.'],relatedJourneyId:'journey-linux-systemd-service-start'});
 }
 return unsupported('Selected systemctl show properties or a supported status excerpt were not found.',{source:'systemd-unit'});
}
