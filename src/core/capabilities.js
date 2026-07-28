export const CAPABILITIES = Object.freeze(['VALIDATE','FORMAT','CONVERT','CALCULATE','DECODE','GENERATE','COMPARE','INSPECT','TROUBLESHOOT']);

export const INPUT_KINDS = Object.freeze([
  'yaml','json','kubernetes','dockerfile','compose','env','jwt','cidr-ip','cron','timestamp','checksum',
  'git-command','git-error','bash-script','bash-error','jenkinsfile','pipeline-error','kubernetes-failure',
  'terraform-diagnostic','command-output','cicd-error','text-encoding','linux-permissions','git-ref','git-revision'
]);
