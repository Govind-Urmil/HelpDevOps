import linuxJourney from './journeys/linux-disk-full/journey.json' with { type: 'json' };
import linuxNodes from './journeys/linux-disk-full/nodes.json' with { type: 'json' };
import linuxExamples from './journeys/linux-disk-full/examples.json' with { type: 'json' };
import linuxReferences from './journeys/linux-disk-full/references.json' with { type: 'json' };
import dockerJourney from './journeys/docker-container-exits/journey.json' with { type: 'json' };
import dockerNodes from './journeys/docker-container-exits/nodes.json' with { type: 'json' };
import dockerExamples from './journeys/docker-container-exits/examples.json' with { type: 'json' };
import dockerReferences from './journeys/docker-container-exits/references.json' with { type: 'json' };
import kubernetesJourney from './journeys/kubernetes-pod-pending/journey.json' with { type: 'json' };
import kubernetesNodes from './journeys/kubernetes-pod-pending/nodes.json' with { type: 'json' };
import kubernetesExamples from './journeys/kubernetes-pod-pending/examples.json' with { type: 'json' };
import kubernetesReferences from './journeys/kubernetes-pod-pending/references.json' with { type: 'json' };
import crashJourney from './journeys/kubernetes-crashloopbackoff/journey.json' with { type: 'json' };
import crashNodes from './journeys/kubernetes-crashloopbackoff/nodes.json' with { type: 'json' };
import crashExamples from './journeys/kubernetes-crashloopbackoff/examples.json' with { type: 'json' };
import crashReferences from './journeys/kubernetes-crashloopbackoff/references.json' with { type: 'json' };
import tfJourney from './journeys/terraform-state-lock/journey.json' with { type: 'json' };
import tfNodes from './journeys/terraform-state-lock/nodes.json' with { type: 'json' };
import tfExamples from './journeys/terraform-state-lock/examples.json' with { type: 'json' };
import tfReferences from './journeys/terraform-state-lock/references.json' with { type: 'json' };
import httpJourney from './journeys/http-502-bad-gateway/journey.json' with { type: 'json' };
import httpNodes from './journeys/http-502-bad-gateway/nodes.json' with { type: 'json' };
import httpExamples from './journeys/http-502-bad-gateway/examples.json' with { type: 'json' };
import httpReferences from './journeys/http-502-bad-gateway/references.json' with { type: 'json' };
import dockdiskJourney from './journeys/docker-disk-usage/journey.json' with { type: 'json' };
import dockdiskNodes from './journeys/docker-disk-usage/nodes.json' with { type: 'json' };
import dockdiskExamples from './journeys/docker-disk-usage/examples.json' with { type: 'json' };
import dockdiskReferences from './journeys/docker-disk-usage/references.json' with { type: 'json' };
import systemdJourney from './journeys/linux-systemd-service-start/journey.json' with { type: 'json' };
import systemdNodes from './journeys/linux-systemd-service-start/nodes.json' with { type: 'json' };
import systemdExamples from './journeys/linux-systemd-service-start/examples.json' with { type: 'json' };
import systemdReferences from './journeys/linux-systemd-service-start/references.json' with { type: 'json' };

import gitJourney from './journeys/push-rejected/journey.json' with { type: 'json' };
import gitNodes from './journeys/push-rejected/nodes.json' with { type: 'json' };
import gitExamples from './journeys/push-rejected/examples.json' with { type: 'json' };
import gitReferences from './journeys/push-rejected/references.json' with { type: 'json' };
import jenkinsJourney from './journeys/agent-offline/journey.json' with { type: 'json' };
import jenkinsNodes from './journeys/agent-offline/nodes.json' with { type: 'json' };
import jenkinsExamples from './journeys/agent-offline/examples.json' with { type: 'json' };
import jenkinsReferences from './journeys/agent-offline/references.json' with { type: 'json' };
import dnsJourney from './journeys/dns-resolution/journey.json' with { type: 'json' };
import dnsNodes from './journeys/dns-resolution/nodes.json' with { type: 'json' };
import dnsExamples from './journeys/dns-resolution/examples.json' with { type: 'json' };
import dnsReferences from './journeys/dns-resolution/references.json' with { type: 'json' };
import connectionJourney from './journeys/connection-refused/journey.json' with { type: 'json' };
import connectionNodes from './journeys/connection-refused/nodes.json' with { type: 'json' };
import connectionExamples from './journeys/connection-refused/examples.json' with { type: 'json' };
import connectionReferences from './journeys/connection-refused/references.json' with { type: 'json' };
import cronJourney from './journeys/job-not-running/journey.json' with { type: 'json' };
import cronNodes from './journeys/job-not-running/nodes.json' with { type: 'json' };
import cronExamples from './journeys/job-not-running/examples.json' with { type: 'json' };
import cronReferences from './journeys/job-not-running/references.json' with { type: 'json' };
import shellJourney from './journeys/execution-failure/journey.json' with { type: 'json' };
import shellNodes from './journeys/execution-failure/nodes.json' with { type: 'json' };
import shellExamples from './journeys/execution-failure/examples.json' with { type: 'json' };
import shellReferences from './journeys/execution-failure/references.json' with { type: 'json' };
import {expandedJourneys} from './expanded-journeys.js';

export const diagnosticJourneys = [
  {...linuxJourney,nodes:linuxNodes,examples:linuxExamples,references:linuxReferences,path:`/troubleshoot/${linuxJourney.domain}/${linuxJourney.slug}/`},
  {...dockerJourney,nodes:dockerNodes,examples:dockerExamples,references:dockerReferences,path:`/troubleshoot/${dockerJourney.domain}/${dockerJourney.slug}/`},
  {...kubernetesJourney,nodes:kubernetesNodes,examples:kubernetesExamples,references:kubernetesReferences,path:`/troubleshoot/${kubernetesJourney.domain}/${kubernetesJourney.slug}/`},
  {...crashJourney,nodes:crashNodes,examples:crashExamples,references:crashReferences,path:`/troubleshoot/${crashJourney.domain}/${crashJourney.slug}/`},
  {...tfJourney,nodes:tfNodes,examples:tfExamples,references:tfReferences,path:`/troubleshoot/${tfJourney.domain}/${tfJourney.slug}/`},
  {...httpJourney,nodes:httpNodes,examples:httpExamples,references:httpReferences,path:`/troubleshoot/${httpJourney.domain}/${httpJourney.slug}/`},
  {...dockdiskJourney,nodes:dockdiskNodes,examples:dockdiskExamples,references:dockdiskReferences,path:`/troubleshoot/${dockdiskJourney.domain}/${dockdiskJourney.slug}/`},
  {...systemdJourney,nodes:systemdNodes,examples:systemdExamples,references:systemdReferences,path:`/troubleshoot/${systemdJourney.domain}/${systemdJourney.slug}/`},
  {...gitJourney,nodes:gitNodes,examples:gitExamples,references:gitReferences,path:`/troubleshoot/${gitJourney.domain}/${gitJourney.slug}/`},
  {...jenkinsJourney,nodes:jenkinsNodes,examples:jenkinsExamples,references:jenkinsReferences,path:`/troubleshoot/${jenkinsJourney.domain}/${jenkinsJourney.slug}/`},
  {...dnsJourney,nodes:dnsNodes,examples:dnsExamples,references:dnsReferences,path:`/troubleshoot/${dnsJourney.domain}/${dnsJourney.slug}/`},
  {...connectionJourney,nodes:connectionNodes,examples:connectionExamples,references:connectionReferences,path:`/troubleshoot/${connectionJourney.domain}/${connectionJourney.slug}/`},
  {...cronJourney,nodes:cronNodes,examples:cronExamples,references:cronReferences,path:`/troubleshoot/${cronJourney.domain}/${cronJourney.slug}/`},
  {...shellJourney,nodes:shellNodes,examples:shellExamples,references:shellReferences,path:`/troubleshoot/${shellJourney.domain}/${shellJourney.slug}/`},
  ...expandedJourneys
];
export const publishedJourneys = diagnosticJourneys.filter(item=>['reviewed','technical-review'].includes(item.status));
export const journeyByPath = path => diagnosticJourneys.find(item=>item.path===path);
export const diagnosticDomains = [...new Set(publishedJourneys.map(item=>item.domain))];



