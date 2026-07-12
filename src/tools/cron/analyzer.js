import resources from './resources.json';
const ranges=[[0,59],[0,23],[1,31],[1,12],[0,6]];
const fieldNames=['minute','hour','day of month','month','day of week'];
const macros={
  '@yearly':'once a year','@annually':'once a year','@monthly':'once a month','@weekly':'once a week','@daily':'once a day','@midnight':'once a day at midnight','@hourly':'once an hour','@reboot':'when the cron daemon starts'
};
const validPart=(part,min,max)=>{
  if(part==='*') return true;
  const [base,step]=part.split('/');
  if(step!==undefined && (!/^\d+$/.test(step)||Number(step)<1)) return false;
  if(base==='*') return true;
  return base.split(',').every(token=>{
    if(/^\d+$/.test(token)){const n=Number(token);return n>=min&&n<=max;}
    const match=token.match(/^(\d+)-(\d+)$/);if(!match)return false;
    const a=Number(match[1]),b=Number(match[2]);return a>=min&&b<=max&&a<=b;
  });
};
const describeField=(value,name)=> value==='*'?`every ${name}`: value.startsWith('*/')?`every ${value.slice(2)} ${name} units`:`${name}: ${value}`;
export function analyzeCron(raw){
  const input=raw.replace(/^\uFEFF/,'').trim();
  const base={kind:'cron',evidence:[],checked:['Supported five-field syntax','Numeric field ranges','Lists, ranges, and steps','Common macros'],notChecked:resources.limitations,references:resources.references};
  if(!input) return {...base,status:'invalid',title:'No cron expression supplied',summary:'Enter a cron expression to analyze.',findings:['The input was empty.'],actions:[],nextActions:['Paste a five-field cron schedule or load an example.']};
  if(input.startsWith('#')) return {...base,status:'unsupported',title:'Cron comment detected',summary:'This line is a comment, not a schedule.',findings:['Comment lines are intentionally ignored by cron.'],actions:[],nextActions:['Paste a schedule line to analyze.']};
  const firstLine=input.split('\n').find(line=>line.trim()&&!line.trim().startsWith('#'))?.trim()||'';
  const firstToken=firstLine.split(/\s+/)[0];
  if(macros[firstToken]){
    const command=firstLine.slice(firstToken.length).trim();
    return {...base,status:'recognized',title:'Cron macro recognized',summary:`This schedule runs ${macros[firstToken]}.`,evidence:[{signal:'supported-cron-macro',source:'input',excerpt:firstToken}],findings:command?[`Command preserved: ${command}`]:[],actions:[{label:'Copy expression',type:'copy'}],nextActions:['Review runtime environment and timezone behavior before installation.']};
  }
  const tokens=firstLine.split(/\s+/);if(tokens.length<5) return {...base,status:'invalid',title:'Too few cron fields',summary:'A common cron schedule needs five scheduling fields.',findings:[`Found ${tokens.length} whitespace-separated field${tokens.length===1?'':'s'}.`],actions:[],nextActions:['Provide minute, hour, day-of-month, month, and day-of-week fields.']};
  const scheduleToken=/^[\d*?,\/-]+$/;const sixth=tokens[5],seventh=tokens[6];const likelyQuartz=tokens.length>=6&&(sixth==='?'||tokens.slice(0,6).some(token=>token==='?'));const likelyYear=tokens.length>=6&&/^\d{4}$/.test(sixth)||tokens.length>=7&&/^\d{4}$/.test(seventh||'');const likelyExtraSchedule=tokens.length===6&&scheduleToken.test(sixth||'')||tokens.length>=7&&tokens.slice(0,6).every(token=>scheduleToken.test(token));
  if(likelyQuartz||likelyYear||likelyExtraSchedule){const signals=[likelyQuartz?'Quartz-style question-mark field':null,likelyYear?'year-like scheduling field':null,likelyExtraSchedule?'six or more schedule-like fields':null].filter(Boolean);return {...base,status:'unsupported',title:'Unsupported cron dialect detected',summary:resources.messages.unsupported,evidence:[{signal:'unsupported-cron-dialect',source:'input',excerpt:firstLine},{signal:'dialect-signals',source:'analyzer',excerpt:signals.join(', ')}],findings:['HelpDevOps did not treat the extra scheduling field as a command.'],actions:[],nextActions:['Use a common five-field cron expression or a supported macro.']};}
  const fields=tokens.slice(0,5);const invalid=[];fields.forEach((field,i)=>{if(!validPart(field,...ranges[i]))invalid.push(`${fieldNames[i]} field “${field}” is outside the supported syntax or range.`)});
  if(invalid.length) return {...base,status:'invalid',title:'Cron expression has invalid fields',summary:'The schedule could not be validated within the supported five-field dialect.',evidence:[{signal:'five-schedule-fields',source:'input',excerpt:fields.join(' ')}],findings:invalid,actions:[],nextActions:['Correct the listed fields and analyze again.']};
  const command=tokens.slice(5).join(' ');const summary=fields.map((v,i)=>describeField(v,fieldNames[i])).join('; ')+'.';
  return {...base,status:'valid-with-notes',title:'Common five-field cron expression recognized',summary,evidence:[{signal:'five-schedule-fields',source:'input',excerpt:fields.join(' ')},{signal:'supported-field-ranges',source:'analyzer',excerpt:'All five fields matched the supported subset.'}],findings:command?[`Command preserved: ${command}`]:['No command was included; the input was treated as a schedule expression only.'],actions:[{label:'Copy expression',type:'copy'}],nextActions:['Review timezone, daylight-saving behavior, permissions, and command safety in the target environment.']};
}
