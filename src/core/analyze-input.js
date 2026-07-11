import {analyzeCron} from '../tools/cron/analyzer.js';
import {detectAndAnalyze} from '../tools/structured-data/analyzer.js';
export function analyzeInput(input){
  const structured=detectAndAnalyze(input);if(structured)return structured;
  const cron=analyzeCron(input);if(cron.status!=='invalid'||input.trim().split(/\s+/).length>=5)return cron;
  return {status:'unsupported',kind:'unknown',title:'Input was not recognized',summary:'The supplied text did not match the supported JSON, YAML, or common cron subsets.',evidence:[],findings:[],actions:[],checked:['JSON parse attempt','YAML parse attempt','Common five-field cron analysis'],notChecked:['Shell commands, logs, Dockerfiles, Jenkinsfiles, Terraform, and other planned domains'],nextActions:['Open the tools directory or try a supported example.']};
}
