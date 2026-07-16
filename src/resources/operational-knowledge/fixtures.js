import {knowledgeObjects} from './catalog.js';
export const knowledgeFixtures=Object.freeze(knowledgeObjects.flatMap(item=>[
 {id:`${item.id}.positive`,issueId:item.id,kind:'positive',input:`${item.recognition.requiredContext.join(' ')} ${item.recognition.positive.join(' ')}`,expected:item.id},
 {id:`${item.id}.negative`,issueId:item.id,kind:'negative',input:`${item.recognition.requiredContext.join(' ')} ${item.recognition.exclusions[0]}`,expected:null},
 {id:`${item.id}.ambiguous`,issueId:item.id,kind:'ambiguous',input:'An uncorroborated operational symptom was mentioned without command output or technology context.',expected:null}
]));
