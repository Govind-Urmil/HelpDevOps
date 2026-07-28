export const symptomStarts=Object.freeze([
  {id:'service-down',title:'A service is unavailable',signal:'Timeout, refused connection, 502, or failed health check',firstEvidence:'Record source, destination, port, timestamp, and blast radius.',href:'/troubleshoot/networking/connection-timeout/'},
  {id:'rollout-stuck',title:'A deployment is not progressing',signal:'ProgressDeadlineExceeded or minimum availability failure',firstEvidence:'Record rollout conditions, revision, unavailable replicas, and events.',href:'/troubleshoot/kubernetes/rollout-stalled/'},
  {id:'pods-failing',title:'Pods will not start or stay ready',signal:'Pending, CrashLoopBackOff, ImagePullBackOff, or OOMKilled',firstEvidence:'Confirm namespace and context, then preserve Pod events and status.',href:'/troubleshoot/kubernetes/'},
  {id:'pipeline-failed',title:'A delivery pipeline failed',signal:'A stage failed, returned a non-zero exit, or lost its agent',firstEvidence:'Preserve the first failing stage, revision, parameters, and exit code.',href:'/troubleshoot/jenkins/pipeline-failure/'},
  {id:'terraform-failed',title:'Terraform cannot initialize or apply',signal:'Provider install, state lock, authorization, or drift error',firstEvidence:'Preserve the exact error, provider source, identity, and resource address.',href:'/troubleshoot/terraform/'},
  {id:'host-slow',title:'A Linux host is slow or saturated',signal:'High load, CPU saturation, memory pressure, or disk exhaustion',firstEvidence:'Capture load, run queue, memory, disk, and the sustained process.',href:'/troubleshoot/linux/high-load/'}
]);
